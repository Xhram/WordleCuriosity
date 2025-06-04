import fs from 'fs';
import { Worker, isMainThread, parentPort } from 'worker_threads';
import game from './gameState.js';


const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

function loadJson(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading file from disk: ${error}`);
        return [];
    }
}
function saveAnalysisResults(filePath, results) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(results, null, 4));
        console.log(`Results saved to ${filePath}`);
    } catch (error) {
        console.error(`Error writing file to disk: ${error}`);
    }
}
let wordList = loadJson('./words.json');
let startingWordsScores = loadJson('./analysis/sims_results/raw (.json)/every_possible_wordle_guess_with_every_starting_word_and_target_word_mt.json').sort((a, b) => {return a.averagePossibleWordsCount - b.averagePossibleWordsCount});


function findAllPossibleGuessesForAGame(gameState, wordList) {
    let correctLetters = Array(5).fill("");
    let incorrectLetters = new Set();
    let wronglyPositionedLettersPerGuess = [];

    for(let guessedWordIndex in gameState.guessedWords) {
        let guessedWord = gameState.guessedWords[guessedWordIndex];
        let letterStates = gameState.letterStates[guessedWordIndex];
        let wronglyPositionedLetters = Array(5).fill("");
        for(let i = 0; i < 5; i++) {
            let letterState = letterStates[i];
            if(letterState === 'b') {
                incorrectLetters.add(guessedWord[i]);
            } else if(letterState === 'g') {
                correctLetters[i] = guessedWord[i];
                // Check if the correct letter just found appears as yellow in this word
                let doubleLetterDetected = false;
                for (let j = 0; j < guessedWord.length  ; j++) {

                    if (j != i && guessedWord[j] === guessedWord[i] && letterStates[j] === 'y') {
                        doubleLetterDetected = true;
                        break;
                    }
                }
                if(!doubleLetterDetected) {
                    incorrectLetters.delete(guessedWord[i]);
                }
            } else if(letterState === 'y') {
                wronglyPositionedLetters[i] = guessedWord[i];
            }

        }
        wronglyPositionedLettersPerGuess.push(wronglyPositionedLetters);
    }

    //filter incorrect letters from know to be in the word
    for(let guessedWordIndex in gameState.guessedWords) {
        let guessedWord = gameState.guessedWords[guessedWordIndex];
        let letterStates = gameState.letterStates[guessedWordIndex];

        for(let i = 0; i < 5; i++) {
            if(letterStates[i] != "b" && incorrectLetters.has(guessedWord[i])) {
                incorrectLetters.delete(guessedWord[i]);
            }
        }
    }


    let possibleGuesses = wordList.filter(word => {
        for(let i = 0; i < 5; i++) {
            if(incorrectLetters.has(word[i])) {
                return false;
            }
            if(correctLetters[i] != "" && word[i] !== correctLetters[i]) {
                return false;
            }
        }
        for(let guessIndex in gameState.guessedWords) {
            let wronglyPositionedLetters = wronglyPositionedLettersPerGuess[guessIndex];
            let letterCounter = word.split('');
            for(let i = 0; i < 5; i++) {
                let wronglyPositionedLetter = wronglyPositionedLetters[i];
                if(wronglyPositionedLetter != ""){
                    let letter = word[i];
                    if(letter === wronglyPositionedLetter) {
                        return false;
                    }
                    let indexOfWronglyPositionedLetter = letterCounter.indexOf(wronglyPositionedLetter);
                    if(indexOfWronglyPositionedLetter === -1) {
                        return false;
                    } else {
                        letterCounter[indexOfWronglyPositionedLetter] = "";
                    }

                }
            }
        }

        return true;
    })
    
    return {possibleGuesses, possibleGuessesCount: possibleGuesses.length};
}

function findBestWordToGuessInHardMode(wordList, startingWordsScores, gameState, debug = false) {
    if(gameState.guessedWords.length === 0) {
        return [{word:startingWordsScores[0].startingWord, score: startingWordsScores[0].averagePossibleWordsCount}];
    }
    let possibleGuesses = findAllPossibleGuessesForAGame(gameState, wordList).possibleGuesses;
    // calc letter pop score
    let letterPopScore = {};
    let totalLetterCount = possibleGuesses.length * 5; // 5 letters per word
    for(let guess of possibleGuesses) {
        for(let letter of guess) {
            if(!letterPopScore[letter]) {
                letterPopScore[letter] = {
                    letterCount: 0,
                    wordCount: 0,
                    popScore: 0
                };
            }
            letterPopScore[letter].letterCount++;

        }
        let uniqueLetters = new Set(guess);
        for(let letter of uniqueLetters) {
            letterPopScore[letter].wordCount++;
        }
    }    
    for(let letter in letterPopScore) {
        letterPopScore[letter].popScore = (letterPopScore[letter].letterCount / totalLetterCount);
        if(letterPopScore[letter].wordCount == possibleGuesses.length) {
            letterPopScore[letter].popScore = 0; // if a letter is in every word, it has no pop score
            if(debug) {
                console.log("Warning: letter", letter, "is in every word, setting pop score to 0");
            }
        }
    }
    if(debug) {
        console.log("Letter pop scores:");
        for (let letter in letterPopScore) {
            console.log(`Letter: ${letter}, Count: ${letterPopScore[letter].letterCount}, Word Count: ${letterPopScore[letter].wordCount}, Pop Score: ${letterPopScore[letter].popScore.toFixed(4)}`);
        }
    }
    


    // renaming averagePossibleWordsCount to star Score

    let starWeight = 1 / gameState.guessedWords.length;
    let popWeight = gameState.guessedWords.length * 2;
    
    possibleGuesses = possibleGuesses.map(guess => {
        let starScore = startingWordsScores.find(score => score.startingWord === guess).averagePossibleWordsCount
        
        let popScore = 0;
        let uniqueLetters = new Set(guess);
        for(let letter of uniqueLetters) {
            popScore += letterPopScore[letter].popScore || 0;
        }

        
        return {
            word: guess,
            starScore: starScore,
            popScore: popScore,
            score: 0
        };
    })
    let popMin = Math.min(...possibleGuesses.map(g => g.popScore));
    let popMax = Math.max(...possibleGuesses.map(g => g.popScore));
    let starMin = Math.min(...possibleGuesses.map(g => g.starScore));
    let starMax = Math.max(...possibleGuesses.map(g => g.starScore));

    possibleGuesses = possibleGuesses.map(g => {
        let normPop = (popMax === popMin) ? 0.5 : (g.popScore - popMin) / (popMax - popMin); // Higher is better
        let normStar = (starMax === starMin) ? 0.5 : 1 - (g.starScore - starMin) / (starMax - starMin); // Lower is better

        let score = (popWeight * normPop + starWeight * normStar) / (popWeight + starWeight); // normalize even if weights don’t add to 1

        return {
            ...g,
            normPop,
            normStar,
            score
        };
    });

    possibleGuesses.sort((a, b) => b.score - a.score);


    return possibleGuesses 
}

// let possibleGuesses = findBestWordToGuessInHardMode(wordList, startingWordsScores, new game(["lares", "goals", "claps", ""], ["yybbg", "bbgyg", "bggyg", ""]));
// console.log("Possible guesses #:", possibleGuesses.length);
// console.log("Possible guesses:\n");
// console.log("| Word  | Score | Star Score | Pop Score |");
// console.log("| :---: | :--: | :--: | :--: |");
// console.log(possibleGuesses.slice(0,10).map(score => {return `| ${score.word} | ${score.score.toFixed(2)} | ${score.normStar.toFixed(2)} | ${score.normPop.toFixed(2)} |`}).join("\n"))

function runGameSimsOnEveryWord(wordList, startingWordsScores) {
    let results = [];
    let blankGamePossibleGuesses = findBestWordToGuessInHardMode(wordList, startingWordsScores, new game([], []));
    for(let targetWord of wordList) { 
        let gameState = new game([], []);
        let solveTime = 0;
        
        
        for(let guessCount = 0; guessCount < 6; guessCount++) {

            let possibleGuesses = undefined;
            if(guessCount == 0) {
                possibleGuesses = blankGamePossibleGuesses;
            } else {
                possibleGuesses = findBestWordToGuessInHardMode(wordList, startingWordsScores, gameState);
            }
            if(gameState.guessedWords.length > 0) {}
            if(possibleGuesses[0] == undefined) {
                console.error("No possible guesses found for game state:", gameState);
            }
            
            let bestGuess = possibleGuesses[0].word;
            gameState.guessedWords.push(bestGuess);
            if(bestGuess === targetWord) {
                gameState.letterStates.push('ggggg'); // all greens
                solveTime = guessCount + 1;
                break;
            }
            let letterStates = Array(5).fill('b');
            let lettersLeft = [];
            //greens
            for(let i = 0; i < 5; i++) {
                if(bestGuess[i] === targetWord[i]) {
                    letterStates[i] = 'g';
                } else {
                    lettersLeft.push(targetWord[i]); // add the letter to the letters left to check for yellows
                }
            }
            //yellows
            for(let index in bestGuess) {
                let letter = bestGuess[index];
                if(letterStates[index] !== 'g'){
                    let indexOfLetter = lettersLeft.indexOf(letter);
                    if(indexOfLetter !== -1) {
                        letterStates[index] = 'y';
                        lettersLeft.splice(indexOfLetter,1) // remove the letter from the target word to avoid double counting
                    }
                }
            }
            gameState.letterStates.push(letterStates.join(''));

            
        }
        



        results.push({
            targetWord,
            solveTime,
            gameState,
        });
    }
    saveAnalysisResults('./analysis/sims_results/raw (.json)/solver_every_word_sim.json', results);
    return results;
}
// runGameSimsOnEveryWord(wordList, startingWordsScores)
// avg solve time is: 4.699293167283743


import fs from 'fs';
import { Worker, isMainThread, parentPort } from 'worker_threads';
import seedrandom from 'seedrandom';
import "../solver/baseCode/solver.js"; // Importing the solver module to ensure it is loaded

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
function generateLetterDictionary(alphabet, defaultValue) {
    let letterDict = {};
    for (let letter of alphabet) {
        letterDict[letter] = JSON.parse(JSON.stringify(defaultValue));
    }
    return letterDict;
}



function getMostCommonLetters(wordList) {
    let letterDict = generateLetterDictionary(ALPHABET, {count: 0, persentage: 0});
    letterDict["total"] = {count: 0, persentage: 100};

    for (let word of wordList) {
        for (let letter of word) {
            if (letterDict[letter]) {
                letterDict[letter].count++;
                letterDict["total"].count++;
            }
        }
    }

    for (let letter of ALPHABET) {
        letterDict[letter].persentage = letterDict[letter].count / letterDict["total"].count * 100;
    }
    saveAnalysisResults('./analysis/stats/most_common_letters.json', letterDict);
    
    //convert to array and sort by count 
    let sortedLetters = Object.entries(letterDict)
        .sort((a, b) => b[1].count - a[1].count)
        .map(([key, value]) => ({ letter: key, ...value }));

    saveAnalysisResults('./analysis/stats/sorted_most_common_letters.json', sortedLetters);

    return {letterDict:letterDict, sortedLetters: sortedLetters};
}

function saveMostCommonLettersToTable(wordList) {
    let { sortedLetters } = getMostCommonLetters(wordList);

    let tableOut = "";
    tableOut += `Letter | Percentage | Count\n`;
    tableOut += `-----------------------------\n`;
    for (let letter of sortedLetters) {
        tableOut += `${letter.letter} | ${letter.persentage.toFixed(2)}% | ${letter.count}\n`;
    }
    fs.writeFileSync('./analysis/stats/sorted_most_common_letters_table.md', tableOut);

    return tableOut;
}



function getMostCommonLettersPerPosition(wordList) {
    let letterDicts = [];
    for (let i = 0; i < 5; i++) {
        let letterDict = generateLetterDictionary(ALPHABET, {count: 0, persentage: 0});
        letterDict["total"] = {count: 0, persentage: 100};
        letterDicts.push(letterDict);
    }
    
    for (let word of wordList) {
        for (let i = 0; i < word.length; i++) {
            let letter = word[i];
            let letterDict = letterDicts[i];
            if (letterDict[letter]) {
                letterDict[letter].count++;
                letterDict["total"].count++;
            }
        }
    }

    for (let letter of ALPHABET) {
        for (let letterDict of letterDicts) {
            letterDict[letter].persentage = letterDict[letter].count / letterDict["total"].count * 100;
        }
    }
    saveAnalysisResults('./analysis/stats/most_common_letters_per_position.json', letterDicts);

    //convert to a sorted format
    let sortedLettersPerPosition = letterDicts.map(letterDict => 
        Object.entries(letterDict)
            .sort((a, b) => b[1].count - a[1].count)
            .map(([key, value]) => ({ letter: key, ...value }))
    );

    saveAnalysisResults('./analysis/stats/sorted_most_common_letters_per_position.json', sortedLettersPerPosition);

    return {letterDicts: letterDicts, sortedLettersPerPosition: sortedLettersPerPosition};
}

function saveMostCommonLettersPerPositionToTable(wordList) {
    let { sortedLettersPerPosition } = getMostCommonLettersPerPosition(wordList);
    
    for (let i = 0; i < sortedLettersPerPosition.length; i++) {
        sortedLettersPerPosition[i] = sortedLettersPerPosition[i].filter(entry => entry.letter !== "total");
    }

    let tableOut = "Rank | 1st Letter | 2nd Letter | 3rd Letter | 4th Letter | 5th Letter\n";
    tableOut += "---------------------------------------------------------------\n";

    for (let i = 0; i < sortedLettersPerPosition[0].length; i++) {
        let row = [
            (i + 1),
            sortedLettersPerPosition[0][i].letter + ` (${sortedLettersPerPosition[0][i].persentage.toFixed(1)}%)`,
            sortedLettersPerPosition[1][i].letter + ` (${sortedLettersPerPosition[1][i].persentage.toFixed(1)}%)`,
            sortedLettersPerPosition[2][i].letter + ` (${sortedLettersPerPosition[2][i].persentage.toFixed(1)}%)`,
            sortedLettersPerPosition[3][i].letter + ` (${sortedLettersPerPosition[3][i].persentage.toFixed(1)}%)`,
            sortedLettersPerPosition[4][i].letter + ` (${sortedLettersPerPosition[4][i].persentage.toFixed(1)}%)`
        ];
        tableOut += "| " + row.join(' | ') + ' |\n';
    }

    fs.writeFileSync('./analysis/stats/sorted_most_common_letters_per_position_table.md', tableOut);

    return tableOut;
}



function getBestStartingWordleWordByGreenScore(wordList){
    let { letterDicts } = getMostCommonLettersPerPosition(wordList);
    let wordScores = [];

    for(let word of wordList){
        let score = {
            word: word,
            score: 0,
            scorePerPosition: []
        }

        for(let i = 0; i < word.length; i++){
            let letter = word[i];
            let letterDict = letterDicts[i];
            if(letterDict[letter]){
                score.score += letterDict[letter].persentage;
                score.scorePerPosition.push(letterDict[letter]);
            } else {
                console.error(`Letter ${letter} not found in letterDict for position ${i} in word ${word}`);
                score.scorePerPosition.push("error");
            }
        }

        wordScores.push(score);
    }

    wordScores.sort((a, b) => b.score - a.score);

    wordScores.forEach((score, index) => {
        score.rank = index + 1;
    });

    saveAnalysisResults('./analysis/stats/best_starting_wordle_words_from_position_chances.json', wordScores);

    // Filtering out words that repeat letters
    let noRepeatingLettersWordScores = wordScores.filter((score) => {
        let letterSet = new Set(score.word);
        return letterSet.size === score.word.length;
    });
    
    noRepeatingLettersWordScores.forEach((score, index) => {
        score.rank = index + 1;
    });

    saveAnalysisResults('./analysis/stats/best_starting_wordle_words_from_position_chances_no_repeating_letters.json', noRepeatingLettersWordScores);
    
    return {
        wordScores: wordScores,
        noRepeatingLettersWordScores: noRepeatingLettersWordScores
    };
}

function saveBestStartingWordleWordsByGreenScoreToTable(wordList) {
    let { noRepeatingLettersWordScores } = getBestStartingWordleWordByGreenScore(wordList);

    let tableOut = "Rank | Word | Score\n";
    tableOut += "-------------------------\n";

    for (let scoreObj of noRepeatingLettersWordScores) {
        tableOut += `| ${scoreObj.rank} | ${scoreObj.word} | ${scoreObj.score.toFixed(2)} |\n`;
    }

    fs.writeFileSync('./analysis/stats/best_starting_wordle_words_tables_from_position_chances_no_repeating_letters.md', tableOut);

    return tableOut;
}

function getBestStartingWordleWordByPopScore(wordList, greenScoreWeight, popScoreWeight) {
    let {wordScores} = getBestStartingWordleWordByGreenScore(wordList);
    let popScores = wordScores.map(score => {
        return {
            word: score.word,
            score: 0,
            greenScore: score.score,
            popScore: 0
        };
    });
    let greenScoreLetterDict = getMostCommonLetters(wordList).letterDict;

    for(let score of popScores) {
        for(let letter of score.word) {
            score.popScore += greenScoreLetterDict[letter].persentage;
        }
    }

    popScores.forEach(score => {
        score.score = (score.popScore * popScoreWeight) + (score.greenScore * greenScoreWeight);
    });

    popScores.sort((a, b) => b.score - a.score);

    saveAnalysisResults(
        './analysis/stats/best_starting_wordle_words_by_pop_score.json',
        {
            greenScoreWeight: greenScoreWeight,
            popScoreWeight: popScoreWeight,
            popScores: popScores
        }
    );

    let popScoresNoRepeatingLetters = popScores.filter((score) => {
        let letterSet = new Set(score.word);
        return letterSet.size === score.word.length;
    });

    saveAnalysisResults(
        './analysis/stats/best_starting_wordle_words_by_pop_score_no_repeating_letters.json',
        {
            greenScoreWeight: greenScoreWeight,
            popScoreWeight: popScoreWeight,
            popScoresNoRepeatingLetters: popScoresNoRepeatingLetters
        }
    );


    return {
        greenScoreWeight: greenScoreWeight,
        popScoreWeight: popScoreWeight,
        popScores: popScores,
        popScoresNoRepeatingLetters: popScoresNoRepeatingLetters
    };
}

function saveBestStartingWordleWordsByPopScoreToTable(wordList, greenScoreWeight, popScoreWeight) {
    let { popScoresNoRepeatingLetters } = getBestStartingWordleWordByPopScore(wordList, greenScoreWeight, popScoreWeight);
    let tableOut = `Weights used: Green Score Weight = ${greenScoreWeight.toFixed(2)}, Pop Score Weight = ${popScoreWeight.toFixed(2)}\n`;
    tableOut += "| Rank | Word | Score | Pop Score | Green Score |\n";
    tableOut += "|------|------|-------|-----------|-------------|\n";
    popScoresNoRepeatingLetters = popScoresNoRepeatingLetters; // Limit to top 100 for table output
    popScoresNoRepeatingLetters.forEach((scoreObj, idx) => {
        tableOut += `| ${idx + 1} | ${scoreObj.word} | ${scoreObj.score.toFixed(2)} | ${scoreObj.popScore.toFixed(2)} | ${scoreObj.greenScore.toFixed(2)} |\n`;
    });

    fs.writeFileSync('./analysis/stats/best_starting_wordle_words_by_pop_score_table.md', tableOut);

    return tableOut;
}



function recursiveWordleGameSimulate(wordList, startingWord, targetWord, history, depth) {
    let stepsToSolve = {1:0, 2:0, 3:0, 4:0, 5:0};
    if (depth === 0) {
        return stepsToSolve;
    }
    let guessedLetters = new Set();
    
    // Extract correct letters (greens) and track yellow letters
    let correctLetters = Array(5).fill("");
    let requiredLetters = new Set(); // For yellow letters
    
    for (let pastGuess of history) {
        for (let i = 0; i < pastGuess.length; i++) {
            if (pastGuess[i] === targetWord[i]) {
                correctLetters[i] = pastGuess[i];
            } else if (targetWord.includes(pastGuess[i])) {
                requiredLetters.add(pastGuess[i]);
            }
        }
    }
    // Collect letters that are known not to be in the target word
    let guessedButNotInTarget = new Set();
    for (let pastGuess of history) {
        for (let i = 0; i < pastGuess.length; i++) {
            let guessedLetter = pastGuess[i];
            if (!targetWord.includes(guessedLetter)) {
                guessedButNotInTarget.add(guessedLetter);
            }
        }
    }

    // Filter possible words based on:
    // 1. Correct letters in specific positions
    // 2. Required letters that must be present elsewhere
    let possibleWords = [startingWord];
    if(startingWord == ""){
        possibleWords = wordList.filter(word => {
            // Check for correct letters (greens)
            for (let i = 0; i < word.length; i++) {
                if (correctLetters[i] && word[i] !== correctLetters[i]) {
                    return false;
                }
            }
    
            // Check if the candidate word contains any letter that is known not to be in the target word
            for (let letter of guessedButNotInTarget) {
                if (word.includes(letter)) {
                    return false;
                }
            }
    
            // Check for required letters (yellows)
            let letterCount = {};
            for (let letter of targetWord) {
                letterCount[letter] = (letterCount[letter] || 0) + 1;
            }
    
            // Ensure word contains all required letters without exceeding their count
            for (let letter of requiredLetters) {
                if (!word.includes(letter)) {
                    return false;
                }
                
                // Check that we don't have more of a letter than exists in the target word
                let wordLetterCount = word.split('').filter(l => l === letter).length;
                if (wordLetterCount > letterCount[letter]) {
                    return false;
                }
            }
    
            return true;
        });
        
    }

    possibleWords.forEach(word => {
        if (word === targetWord) {
            // Found the solution at this step
            let steps = history.length + 1;
            if (steps >= 1 && steps <= 5) {
                stepsToSolve[steps]++;
            }
        } else if (history.length < 4) {
            // Continue recursively with this guess added to history
            let nextHistory = [...history, word];
            let result = recursiveWordleGameSimulate(wordList, "", targetWord, nextHistory, depth - 1);
            // Accumulate results
            for (let k in result) {
                stepsToSolve[k] += result[k];
            }
        }
    })
    return stepsToSolve;
}



function simulateEveryWordleGameWithAStartWord(wordList, startingWord) {
    let allResults = {};
    let total = { steps: {1:0, 2:0, 3:0, 4:0, 5:0}, average: 0, totalGames: 0 };
    let checkedWordsCount = 0;
    for (let targetWord of wordList) {
        let result = recursiveWordleGameSimulate(wordList, startingWord, targetWord, [], 5);
        allResults[targetWord] = result;
        console.clear();
        checkedWordsCount++;
        console.log(`Checked ${checkedWordsCount} out of ${wordList.length} words...`);
    }
    // Calculate total results
    for (let word in allResults) {
        let result = allResults[word];
        total.totalGames += Object.values(result).reduce((a, b) => a + b, 0);
        for (let steps in result) {
            total.steps[steps] += result[steps];
        }
    }
    allResults["total_result"] = total;
    saveAnalysisResults('./analysis/wordle_game_simulation_results.json', allResults);
    return allResults;
}

function randomWordListShuffle(wordList, seed) {
    let rng = seedrandom(seed);
    let shuffledList = JSON.parse(JSON.stringify(wordList));
    // Fisher-Yates shuffle
    for (let i = shuffledList.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [shuffledList[i], shuffledList[j]] = [shuffledList[j], shuffledList[i]];
    }
    return shuffledList;
}




function simulateEveryWordleGameWithAStartWordMultithreaded(wordList, startingWord, numThreads = 4) {
    const totalWords = wordList.length;
    const allResults = {};
    let checkedWordsCount = 0;
    let total_result = { steps: {1:0, 2:0, 3:0, 4:0, 5:0}, average: 0, totalGames: 0, startingWord: startingWord };
    const startTime = Date.now();

    // Shuffle the wordList to ensure randomness in processing
    let shuffledList = randomWordListShuffle(wordList, 7);
    // Split wordList into chunks:
    const chunkSize = Math.ceil(totalWords / numThreads);
    const chunks = [];
    for (let i = 0; i < totalWords; i += chunkSize) {
        chunks.push(shuffledList.slice(i, i + chunkSize));
    }

    
    return new Promise((resolve, reject) => {
        let finishedWorkers = 0;
        for (let i = 0; i < chunks.length; i++) {
            try {
                const worker = new Worker('./analysis/worker.js', { workerData: null });

                worker.on('message', (msg) => {
                    // If a single word finished:
                    if (msg.finishedOne) {
                        allResults[msg.finishedOne] = msg.data;
                        checkedWordsCount++;
                        // Update totals incrementally
                        let stepResults = msg.data;
                        total_result.totalGames += Object.values(stepResults).reduce((a, b) => a + b, 0);
                        for (let steps in stepResults) {
                            total_result.steps[steps] += stepResults[steps];
                        }
                        // Persist partial progress
                        saveAnalysisResults(`./analysis/sims_results/wordle_game_simulation_results_starting_word_${startingWord}.json`, { ...allResults, total_result: total_result });
                        // Show progress and ETA
                        const elapsed = (Date.now() - startTime) / 1000;
                        const rate = checkedWordsCount / elapsed;
                        const remaining = totalWords - checkedWordsCount;
                        const eta = remaining / (rate || 1);
                        const progress = ((checkedWordsCount / totalWords) * 100).toFixed(2);
                        console.clear();
                        console.log(`Progress: ${progress}% (${checkedWordsCount}/${totalWords}) | ETA: ${eta.toFixed(1)}s`);
                    }
                    // If the worker is done with its chunk:
                    if (msg.done) {
                        finishedWorkers++;
                        if (finishedWorkers === chunks.length) {
                            allResults.total_result = total_result;
                            // Final save
                            saveAnalysisResults(`./analysis/sims_results/wordle_game_simulation_results_starting_word_${startingWord}.json`, allResults);
                            resolve(allResults);
                        }
                    }
                });

                worker.on('error', (err) => {
                    console.error(`Worker error: ${err.message}`);
                    reject(err);
                });

                worker.on('exit', (code) => {
                    if (code !== 0) {
                        console.error(`Worker stopped with exit code ${code}`);
                        reject(new Error(`Worker stopped with exit code ${code}`));
                    }
                });

                worker.postMessage({
                    chunk: chunks[i],
                    globalWordList: wordList,
                    startingWord: startingWord
                });
            } catch (err) {
                console.error(`Failed to create worker: ${err.message}`);
                reject(err);
            }
        }
    });
}



function getHowManyWordsArePossibleGuessesWithAStartingWordAndATargetWord(wordList, startingWord, targetWord) {
    
    let correctLetters = Array(5).fill("");
    let incorrectLetters = new Set();
    let wronglyPositionedLetters = Array(5).fill("");
    for( let i = 0; i < startingWord.length; i++) {
        if (startingWord[i] === targetWord[i]) {
            correctLetters[i] = startingWord[i];
        }
        if (!targetWord.includes(startingWord[i])) {
            incorrectLetters.add(startingWord[i]);
        }
        if (startingWord[i] != targetWord[i] && targetWord.includes(startingWord[i])) {
            wronglyPositionedLetters[i] = startingWord[i];
        }
    }
    incorrectLetters = Array.from(incorrectLetters);

    let possibleWords = wordList.filter(word => {
        if (word === targetWord) {
            return true;
        }
        let moddedWord = word.split('');
        for (let i = 0; i < 5; i++) {
            if (correctLetters[i] && word[i] !== correctLetters[i]) {
                return false;
            }
            if(wronglyPositionedLetters[i] != ""){
                if(word[i] == wronglyPositionedLetters[i]) {
                    return false;
                }
                let indexOfWronglyPositioned = moddedWord.indexOf(wronglyPositionedLetters[i]);
                
                if(indexOfWronglyPositioned == -1) {
                    return false;
                } else {
                    moddedWord[indexOfWronglyPositioned] = ''
                }

            }
        }

        for (let letter of incorrectLetters) {
            if (word.includes(letter)) {
                return false;
            }
        }

        return true;
    });
    let possibleWordsCount = possibleWords.length;
    return {possibleWordsCount, possibleWords};
}
function getHowManyWordsArePossibleGuessesWithAStartingWordAndATargetWordLite(wordList, startingWord, targetWord) {
    
    let correctLetters = Array(5).fill("");
    let incorrectLetters = new Set();
    let wronglyPositionedLetters = Array(5).fill("");
    for( let i = 0; i < startingWord.length; i++) {
        if (startingWord[i] === targetWord[i]) {
            correctLetters[i] = startingWord[i];
        }
        if (!targetWord.includes(startingWord[i])) {
            incorrectLetters.add(startingWord[i]);
        }
        if (startingWord[i] != targetWord[i] && targetWord.includes(startingWord[i])) {
            wronglyPositionedLetters[i] = startingWord[i];
        }
    }
    incorrectLetters = Array.from(incorrectLetters);

    let possibleWordsCount = 0;
    wordList.forEach(word => {
        if (word === targetWord) {
            possibleWordsCount++;
            return;
        }
        let moddedWord = word.split('');
        for (let i = 0; i < 5; i++) {
            if (correctLetters[i] && word[i] !== correctLetters[i]) {
                return;
            }
            if(wronglyPositionedLetters[i] != ""){
                if(word[i] == wronglyPositionedLetters[i]) {
                    return;
                }
                let indexOfWronglyPositioned = moddedWord.indexOf(wronglyPositionedLetters[i]);
                
                if(indexOfWronglyPositioned == -1) {
                    return;
                } else {
                    moddedWord[indexOfWronglyPositioned] = ''
                }

            }
        }

        for (let letter of incorrectLetters) {
            if (word.includes(letter)) {
                return;
            }
        }
        possibleWordsCount++;
        return;
    });
    return {possibleWordsCount};
}

// let startingWord = "proud";
// let targetWord = "rouxx";
// let possibleWords = getHowManyWordsArePossibleGuessesWithAStartingWordAndATargetWord(wordList, startingWord, targetWord).possibleWords;
// let scores = loadJson(`./analysis/sims_results/raw (.json)/every_possible_wordle_guess_with_every_starting_word_and_target_word_mt.json`);
// let possibleWordsWithScore = possibleWords.map(word => {
//     let score = scores.find(s => s.startingWord == word);
//     return {
//         word: word,
//         score: score.averagePossibleWordsCount
//     };
// })
// possibleWordsWithScore.sort((a, b) => {
//     return a.score - b.score;
// });
// console.log(possibleWordsWithScore.map(p => `${p.word} (${p.score})`).join("\n"));


// // console.log(getHowManyWordsArePossibleGuessesWithAStartingWordAndATargetWord(wordList, startingWord, targetWord).possibleWords.join("\n"))
// console.log(getHowManyWordsArePossibleGuessesWithAStartingWordAndATargetWord(wordList, startingWord, targetWord).possibleWords.length)
// console.log(getHowManyWordsArePossibleGuessesWithAStartingWordAndATargetWord(wordList, startingWord, targetWord).possibleWords.indexOf(targetWord))

// let l = randomWordListShuffle(wordList, Math.random() * 1000);
// console.log(l[0]);
// console.log(l[1]);

function getEveryPossibleWordleGuessWithAStartingWordAndEveryTargetWord(wordList, startingWord, options = {}) {
    const {
        showProgress = true,
        save = true,
        savePath = `./analysis/sims_results/raw (.json)/wordle_game_simulation_results_starting_word_${startingWord}.json`
    } = options;

    let results = {
        startingWord: startingWord,
        averagePossibleWordsCount: 0,
        totalPossibleWordsCount: 0,
        games: []
    };
    for (let word of wordList) {
        let { possibleWordsCount } = getHowManyWordsArePossibleGuessesWithAStartingWordAndATargetWordLite(wordList, startingWord, word);
        results.games.push({
            targetWord: word,
            possibleWordsCount: possibleWordsCount
        });
        results.totalPossibleWordsCount += possibleWordsCount;
        if (showProgress) {
            const index = results.games.length;
            console.clear();
            console.log(`Progress: ${((index / wordList.length) * 100).toFixed(2)}% (${index}/${wordList.length})`);
        }
        if (options.progressCallback) {
            let progress = (results.games.length / wordList.length) * 100;
            options.progressCallback(progress, startingWord);
        }
    }
    results.averagePossibleWordsCount = results.totalPossibleWordsCount / wordList.length;
    if (save) {
        saveAnalysisResults(savePath, results);
    }
    return results;
}



function getEveryPossibleWordleGuessWithEveryStartingWordAndEveryTargetWord(wordList) {
    let results = []
    for(let startingWord of wordList){
        let result = getEveryPossibleWordleGuessWithAStartingWordAndEveryTargetWord(wordList, startingWord,{showProgress: false, save: false});
        delete result.games;
        results.push(result);
        console.clear();
        console.log(`Progress: ${((results.length / wordList.length) * 100).toFixed(2)}% (${results.length}/${wordList.length})`);
        
    }
    saveAnalysisResults(`./analysis/sims_results/raw (.json)/every_possible_wordle_guess_with_every_starting_word_and_target_word.json`, results);
}


function getEveryPossibleWordleGuessWithEveryStartingWordAndEveryTargetWordMultithreaded(wordList, numThreads = 4, saveThreshold = 50) {
    let shuffledList = randomWordListShuffle(wordList, 77);
    const totalStartingWords = shuffledList.length;
    const chunkSize = Math.ceil(totalStartingWords / numThreads);
    const chunks = [];
    for (let i = 0; i < totalStartingWords; i += chunkSize) {
        chunks.push(shuffledList.slice(i, i + chunkSize));
    }

    let completedWorkers = 0;
    let allResults = [];
    let resultsCounter = 0;
    const startTime = Date.now();

    return new Promise((resolve, reject) => {
        for (let chunk of chunks) {
            const worker = new Worker('./analysis/workerv2.js', { workerData: null });
            worker.on('message', (msg) => {
                if (msg.results) {
                    allResults.push(...msg.results);
                    resultsCounter += msg.results.length;
                    const elapsed = (Date.now() - startTime) / 1000;
                    const progress = (allResults.length / totalStartingWords * 100).toFixed(2);
                    console.clear();
                    console.log(`Progress: ${progress}% (${allResults.length}/${totalStartingWords}) | Elapsed: ${elapsed.toFixed(1)}s`);

                    if (resultsCounter >= saveThreshold) {
                        resultsCounter = 0;
                        saveAnalysisResults(
                            `./analysis/sims_results/raw (.json)/every_possible_wordle_guess_with_every_starting_word_and_target_word_mt.json`,
                            allResults
                        );
                    }
                }
                if (msg.done) {
                    completedWorkers++;
                    if (completedWorkers === chunks.length) {
                        saveAnalysisResults(
                            `./analysis/sims_results/raw (.json)/every_possible_wordle_guess_with_every_starting_word_and_target_word_mt.json`,
                            allResults
                        );
                        resolve(allResults);
                    }
                }
            });
            worker.on('error', (err) => reject(err));
            worker.postMessage({ chunk, globalWordList: wordList });
        }
    });
}
// if (isMainThread) {
//     console.log("Starting analysis...");
//     getEveryPossibleWordleGuessWithEveryStartingWordAndEveryTargetWordMultithreaded(wordList, 28)
//         .catch(err => {
//             console.error("Multithreaded computation failed:", err);
//             process.exit(1);
//         });

// }
// time for first is 300



function convertGetEveryPossibleWordleGuessWithEveryStartingWordAndEveryTargetWordDataToTable() {
    const analysisFilePath = `./analysis/sims_results/raw (.json)/every_possible_wordle_guess_with_every_starting_word_and_target_word_mt.json`;
    const outputTablePath = './analysis/sims_results/table (.md)/every_possible_wordle_guess_with_every_starting_word_and_target_word_table.md';
    
    try {
        const data = loadJson(analysisFilePath);
        
        if (!Array.isArray(data)) {
            throw new Error("Invalid data format: Expected an array.");
        }
        
        // Calculate reduction percentage and sort by it
        const sortedData = data.map((entry) => {
            const reductionPercentage = 100 - (entry.averagePossibleWordsCount / wordList.length) * 100;
            return {
                word: entry.startingWord,
                reductionPercentage: reductionPercentage,
                averagePossibleWordsCount: entry.averagePossibleWordsCount,
            };
        }).sort((a, b) => b.reductionPercentage - a.reductionPercentage);
        
        // Generate table
        let tableOut = "| Rank | Word | Reduction % | Average Possible Words Count |\n";
        tableOut += "|------|------|-------------|-----------------------------|\n";
        
        sortedData.forEach((entry, index) => {
            tableOut += `| ${index + 1} | ${entry.word} | ${entry.reductionPercentage.toFixed(2)}% | ${entry.averagePossibleWordsCount.toFixed(2)} |\n`;
        });
        
        // Save table to file
        fs.writeFileSync(outputTablePath, tableOut);
        console.log(`Table saved to ${outputTablePath}`);
    } catch (error) {
        console.error(`Error generating table: ${error.message}`);
    }
}



// convertGetEveryPossibleWordleGuessWithEveryStartingWordAndEveryTargetWordDataToTable()



export {getEveryPossibleWordleGuessWithAStartingWordAndEveryTargetWord, getHowManyWordsArePossibleGuessesWithAStartingWordAndATargetWord}
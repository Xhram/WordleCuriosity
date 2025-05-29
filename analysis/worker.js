import { parentPort } from 'worker_threads';

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

try {
    parentPort.on('message', ({ chunk, globalWordList, startingWord }) => {
        let partialResults = {};

        for (let targetWord of chunk) {
            console.log(`Starting simulation for target word: ${targetWord}`);
            let result = recursiveWordleGameSimulate(globalWordList, startingWord, targetWord, [], 5);
            partialResults[targetWord] = result;
            parentPort.postMessage({ finishedOne: targetWord, data: result });
        }
        parentPort.postMessage({ done: partialResults });
    });
} catch (err) {
    console.error(`Worker encountered an error: ${err.message}`);
    parentPort.postMessage({ error: err.message });
}

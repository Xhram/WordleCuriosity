let lastFrameKeyStates = {};
let ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
let wordList = undefined;
(async () => {wordList = await fetch('./resources/words.json').then(response => response.json());})();
let startingWordsScores = undefined;
(async () => {startingWordsScores = await fetch('./resources/startingWordData.json').then(response => response.json());})();


document.addEventListener('keydown', (event) => {
    if (lastFrameKeyStates[event.key] === undefined || lastFrameKeyStates[event.key] === false) {
        lastFrameKeyStates[event.key] = true;
        onKeyPress(event.key);
    }
});
document.addEventListener('keyup', (event) => {
    if (lastFrameKeyStates[event.key] === undefined || lastFrameKeyStates[event.key] === true) {
        lastFrameKeyStates[event.key] = false;
    }
});

function onKeyPress(key) {
    console.log(`Key pressed: ${key}`);
    if(ALPHABET.includes(key.toLowerCase())) {
        let selectedSquare = getSelectedSquare();
        if (selectedSquare) {
            let letter = key.toUpperCase();
            selectNextSquare(false);
            selectedSquare.innerHTML = selectedSquare.innerHTML===""?letter:selectedSquare.innerHTML;
            selectedSquare.classList.add('filled');
        }
    } else if (key === 'Backspace') {
        let selectedSquare = getSelectedSquare();
        if (selectedSquare) {
            if((selectedSquare.innerHTML == "" && isSelectedLastInRow()) || !isSelectedLastInRow()) {
                selectPreviousSquare();

            }

            selectedSquare = getSelectedSquare();
            selectedSquare.innerHTML = '';
            selectedSquare.classList.remove('filled');

        }
    } else if (key === 'Enter') {
        submitNextWord();
    }
}
function submitNextWord() {
        let row = getSelectedRow();
        if (row) {
            let word = getWordFromRow(row);
            let isValid = wordList.includes(word);
            console.log(`Word entered: ${word}, is valid: ${isValid}`);
            if(isValid){
                row.classList.add('valid');
                for (let letterBox of row.querySelectorAll('.guess-letter')) {
                    letterBox.classList.add('wrong');
                }
                
                selectNextSquare();
                let state = getGameState();
                if(state.guessedWords.length >= 2) {
                    let letterStates = state.letterStates[state.letterStates.length - 2];
                    for (let i = 0; i < letterStates.length; i++) {
                        let letterBox = row.querySelector(`.guess-letter:nth-child(${i + 1})`);
                        if (letterStates[i] === 'g') {
                            letterBox.classList.remove('wrong', 'badposition');
                            letterBox.classList.add('correct');
                        }
                    }

                }

                updateWordList();
            }
        }
}

function getSelectedSquare() {
    return document.querySelector('.guess-letter.selected');
}
function selectNextSquare(canGoToNextRow = true) {
    let selectedSquare = getSelectedSquare();
    let nextSibling = selectedSquare.nextElementSibling;
    if (nextSibling == undefined) {
        let parent = selectedSquare.parentElement;
        nextSibling = parent.nextElementSibling?.querySelector('.guess-letter:first-child');
        nextSibling = canGoToNextRow===true ? nextSibling : undefined;
    }
    if (nextSibling != undefined) {
        selectedSquare.classList.remove('selected');
    }
    if( nextSibling != undefined) {
        nextSibling.classList.add('selected');
    }
}
function selectPreviousSquare() {
    let selectedSquare = getSelectedSquare();
    let previousSibling = selectedSquare.previousElementSibling;
    if (previousSibling == undefined) {
        let parent = selectedSquare.parentElement;
        previousSibling = parent.previousElementSibling?.querySelector('.guess-letter:last-child');
    }
    if (previousSibling != undefined) {
        selectedSquare.classList.remove('selected');

    }
    if( previousSibling != undefined) {
        previousSibling.classList.add('selected');
    }
    if(getSelectedRow().classList.contains('valid')) {
        getSelectedRow().classList.remove('valid');
        for (let letterBox of getSelectedRow().querySelectorAll('.guess-letter')) {
            letterBox.classList.remove('wrong');
            letterBox.classList.remove('correct');
            letterBox.classList.remove('badposition');
        }
    }
}
function isSelectedLastInRow() {
    let selectedSquare = getSelectedSquare();
    if (selectedSquare) {
        let nextSibling = selectedSquare.nextElementSibling;
        return nextSibling === null || nextSibling === undefined;
    }
    return false;
}
let guessLetterBoxes = document.querySelectorAll('.guess-letter');
guessLetterBoxes.forEach(box => {
    box.addEventListener('click', () => {
        let inWord = box.parentElement.classList.contains("valid");
        if(inWord) {
            if(box.classList.contains('wrong')){
                box.classList.remove('wrong');
                box.classList.add('badposition');
            } else if(box.classList.contains('badposition')) {
                box.classList.remove('badposition');
                box.classList.add('correct');
            } else if(box.classList.contains('correct')) {
                box.classList.remove('correct');
                box.classList.add('wrong');
            }
        }
        updateWordList();
    });
    box.innerHTML = '';
    
});

function getWordFromRow(row){
    let letters = Array.from(row.querySelectorAll('.guess-letter'));
    return Array.from(letters.map(letter => letter.innerHTML).join('')).filter(letter => !(letter == " " || letter == "\t")).join('').toLowerCase();
}
function getSelectedRow(){
    return getSelectedSquare()?.parentElement;
}



function getGameState() {
    let gameState = new game([], []);

    for (let row of document.querySelectorAll('.guess')) {
        if (row.classList.contains('valid')) {
            let word = getWordFromRow(row);
            gameState.guessedWords.push(word);
            let letterStates = Array.from(row.querySelectorAll('.guess-letter')).map(letterBox => {
                if (letterBox.classList.contains('correct')) {
                    return 'g';
                } else if (letterBox.classList.contains('badposition')) {
                    return 'y';
                } else {
                    return 'b';
                }
            }).join('');
            gameState.letterStates.push(letterStates);
        }
    }
    return gameState;
}

function updateWordList() {
    console.log("Updating word list...");
    if (wordList === undefined || startingWordsScores === undefined) {
        setTimeout(updateWordList, 100);
        return
    }
    let possibleGuesses = findBestWordToGuessInHardMode(wordList, startingWordsScores, getGameState());
    document.querySelector("#possibleWordCount").innerHTML = possibleGuesses.length;
    document.querySelector("#wordList").innerHTML = possibleGuesses.slice(0,10).map((wordData, index) => `<div onclick="setNextWord(\'${wordData.word}\')" class="recommendedWord" style="font-size:${60/(index*0.5 + 1)}px;">${index + 1}. ${wordData.word}</div>`).join('');
}
document.addEventListener('DOMContentLoaded', () => {
    updateWordList();
})
function clearBoard() {
    console.log("Clearing board...");
    let guessRows = document.querySelectorAll('.guess');
    guessRows.forEach(row => {
        row.querySelectorAll('.guess-letter').forEach(letterBox => {
            letterBox.innerHTML = '';
            letterBox.classList.remove('filled', 'wrong', 'correct', 'badposition');
        });
        row.classList.remove('valid');
    });
    document.querySelector("#possibleWordCount").innerHTML = '';
    document.querySelector("#wordList").innerHTML = '';
    for (let i = 0; i < 5*6; i++) {
        selectPreviousSquare();
    }
    updateWordList();
}

function setNextWord(word) {
    console.log(`Setting next word: ${word}`);
    let selectedRow = getSelectedRow();
    if (selectedRow) {
        let letterBoxes = selectedRow.querySelectorAll('.guess-letter');
        for (let i = 0; i < letterBoxes.length; i++) {
            letterBoxes[i].innerHTML = word[i].toUpperCase();
            letterBoxes[i].classList.add('filled');
        }
        for(let i = 0; i < 5; i++) {
            selectNextSquare(false);

        }
        submitNextWord();
        updateWordList();
    }
}
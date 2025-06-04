class game {
    constructor(guessedWords, letterStates){
        this.guessedWords = guessedWords.filter(word => word != "");
        this.letterStates = letterStates.filter(word => word != "");
    }
    // guessedWords = ["lares","nitro"]
    // letterStates = ["bbybb", "bbbyy"]
    // letterStates:
    // g = green
    // y = yellow
    // b = black/gray
    toJson() {
        return {
            guessedWords: this.guessedWords,
            letterStates: this.letterStates
        };
    }
}

export default game;
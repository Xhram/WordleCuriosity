import { count } from 'console';
import fs from 'fs';
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

function loadWordList(filePath) {
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

let wordList = loadWordList('./words.json');
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
    saveAnalysisResults('./analysis/most_common_letters.json', letterDict);
    
    //convert to array and sort by count 
    let sortedLetters = Object.entries(letterDict)
        .sort((a, b) => b[1].count - a[1].count)
        .map(([key, value]) => ({ letter: key, ...value }));

    saveAnalysisResults('./analysis/sorted_most_common_letters.json', sortedLetters);

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
    fs.writeFileSync('./analysis/sorted_most_common_letters_table.md', tableOut);

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
    saveAnalysisResults('./analysis/most_common_letters_per_position.json', letterDicts);

    //convert to a sorted format

    let sortedLettersPerPosition = letterDicts.map(letterDict => 
        Object.entries(letterDict)
            .sort((a, b) => b[1].count - a[1].count)
            .map(([key, value]) => ({ letter: key, ...value }))
    );

    saveAnalysisResults('./analysis/sorted_most_common_letters_per_position.json', sortedLettersPerPosition);

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

    fs.writeFileSync('./analysis/sorted_most_common_letters_per_position_table.md', tableOut);

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

    saveAnalysisResults('./analysis/best_starting_wordle_words_from_position_chances.json', wordScores);

    // Filtering out words that repeat letters
    let noRepeatingLettersWordScores = wordScores.filter((score) => {
        let letterSet = new Set(score.word);
        return letterSet.size === score.word.length;
    })
    
    noRepeatingLettersWordScores.forEach((score, index) => {
        score.rank = index + 1;
    });

    saveAnalysisResults('./analysis/best_starting_wordle_words_from_position_chances_no_repeating_letters.json', noRepeatingLettersWordScores);
    
    return {
        wordScores: wordScores,
        noRepeatingLettersWordScores: noRepeatingLettersWordScores
    };
}

function saveBestStartingWordleWordsByGreenScoreToTable(wordList) {
    let { noRepeatingLettersWordScores } = getBestStartingWordleWordByGreenScore(wordList);

    let tableOut = "Rank | Word | Score\n";
    tableOut += "-------------------------\n";6

    for (let scoreObj of noRepeatingLettersWordScores) {
        tableOut += `| ${scoreObj.rank} | ${scoreObj.word} | ${scoreObj.score.toFixed(2)} |\n`;
    }

    fs.writeFileSync('./analysis/best_starting_wordle_words_tables_from_position_chances_no_repeating_letters.md', tableOut);

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
        './analysis/best_starting_wordle_words_by_pop_score.json',
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
        './analysis/best_starting_wordle_words_by_pop_score_no_repeating_letters.json',
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

    let tableOut = `Weights used: Green Score Weight = ${greenScoreWeight}, Pop Score Weight = ${popScoreWeight}\n`;
    tableOut += "| Rank | Word | Score | Pop Score | Green Score |\n";
    tableOut += "|------|------|-------|-----------|-------------|\n";

    popScoresNoRepeatingLetters.forEach((scoreObj, idx) => {
        tableOut += `| ${idx + 1} | ${scoreObj.word} | ${scoreObj.score.toFixed(2)} | ${scoreObj.popScore.toFixed(2)} | ${scoreObj.greenScore.toFixed(2)} |\n`;
    });

    fs.writeFileSync('./analysis/best_starting_wordle_words_by_pop_score_table.md', tableOut);

    return tableOut;
}

saveBestStartingWordleWordsByPopScoreToTable(wordList, .1, .9);

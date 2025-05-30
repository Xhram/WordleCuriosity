import { parentPort } from 'worker_threads';
import { getEveryPossibleWordleGuessWithAStartingWordAndEveryTargetWord } from './index.js';

parentPort.on('message', (msg) => {
    const { chunk, globalWordList } = msg;
    let results = [];
    let sendSize = 3;

    for (let startingWord of chunk) {

        let result = getEveryPossibleWordleGuessWithAStartingWordAndEveryTargetWord(
            globalWordList,
            startingWord,
            { showProgress: false, save: false }
        );
        delete result.games;
        results.push(result);
        if(results.length >= sendSize) {

            parentPort.postMessage({ results });
            results = [];
        }
    }

    parentPort.postMessage({ results, done: true });
});
import { parentPort } from 'worker_threads';
import { getEveryPossibleWordleGuessWithAStartingWordAndEveryTargetWord } from './index.js';

parentPort.on('message', (msg) => {
    const { chunk, globalWordList } = msg;
    let results = [];
    let sendSize = 1;

    for (let startingWord of chunk) {
        let result = getEveryPossibleWordleGuessWithAStartingWordAndEveryTargetWord(
            globalWordList,
            startingWord,
            {
                showProgress: false,
                save: false,
                progressCallback: (progress, word) => {
                    parentPort.postMessage({ progress, lastWord: word });
                }
            }
        );
        delete result.games;
        results.push(result);
        let currentProgress = (results.length / chunk.length) * 100;
        parentPort.postMessage({ progress: currentProgress });
        if(results.length >= sendSize) {

            parentPort.postMessage({ results });
            results = [];
        }
    }

    parentPort.postMessage({ results, done: true });
});
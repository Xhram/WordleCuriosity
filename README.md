# The Best Wordle Starting Word
*By: Xhram* <br>
*I made this similar to a blog post*

The best starting word for Wordle is **AEROS**.<br>

![Pares](./assets/Aeros.png)

# Why is Aeros the best starting word?

## Most common letter:
This started by asking what is the most common letter in Wordle. So I extracted the [word list from Wordle](./words.json), then created a [Node.js script](./analysis/index.js) with a function `getMostCommonLetters(wordList)`. This left me with two files: [`most_common_letters.json`](./analysis/stats/most_common_letters.json) and [`sorted_most_common_letters.json`](./analysis/stats/sorted_most_common_letters.json). I simplified the results into a table at [`sorted_most_common_letters_table.md`](./analysis/stats/sorted_most_common_letters_table.md).

| Letter | Percentage | Count |
| :----: | ---------- | ----- |
total | 100.00% | 74275
e | 10.04% | 7455
s | 9.85% | 7319
a | 9.60% | 7128
o | 7.02% | 5212
r | 6.35% | 4714
i | 5.90% | 4381
l | 5.09% | 3780
t | 4.99% | 3707
n | 4.68% | 3478
u | 3.94% | 2927
d | 3.68% | 2735
p | 3.28% | 2436
m | 3.25% | 2414
y | 3.23% | 2400
c | 3.02% | 2246
h | 2.68% | 1993
g | 2.51% | 1864
b | 2.49% | 1849
k | 2.36% | 1753
f | 1.67% | 1240
w | 1.52% | 1127
v | 1.08% | 801
z | 0.68% | 503
j | 0.46% | 342
x | 0.44% | 326
q | 0.20% | 145

## Most common letter per position
The next step was to find the most common letter at each position in a five-letter word. I wrote a function `getMostCommonLettersPerPosition(wordList)`. Running this function produced two files: [`sorted_most_common_letters_per_position.json`](./analysis/stats/sorted_most_common_letters_per_position.json) and [`most_common_letters_per_position.json`](./analysis/stats/most_common_letters_per_position.json). I also created a [table](./analysis/stats/sorted_most_common_letters_per_position_table.md) for easier viewing.

| Rank | 1st Letter | 2nd Letter | 3rd Letter | 4th Letter | 5th Letter |
| :--: | :--: | :--: | :--: | :--: | :--: |
| NaN  | (X\~\~\~\~) | (\~X\~\~\~) | (\~\~X\~\~) | (\~\~\~X\~) | (\~\~\~\~X) |
| 1 | s (11.2%) | a (18.1%) | a (9.2%) | e (17.0%) | s (29.2%) |
| 2 | p (7.6%) | o (16.3%) | r (9.1%) | a (8.9%) | e (11.7%) |
| 3 | b (6.8%) | e (12.5%) | i (7.9%) | i (7.1%) | y (10.3%) |
| 4 | c (6.5%) | i (10.8%) | n (7.5%) | t (7.0%) | a (6.0%) |
| 5 | m (6.4%) | u (9.2%) | o (7.5%) | n (6.0%) | d (5.9%) |
| 6 | t (5.9%) | r (6.9%) | e (6.7%) | l (5.8%) | t (5.4%) |
| 7 | a (5.8%) | l (5.2%) | l (6.5%) | o (5.6%) | r (5.0%) |
| 8 | r (5.4%) | h (4.1%) | u (5.1%) | r (5.4%) | n (4.2%) |
| 9 | d (4.9%) | n (2.6%) | t (4.9%) | s (4.0%) | l (3.6%) |
| 10 | g (4.6%) | y (2.0%) | s (4.1%) | k (3.8%) | o (3.4%) |
| 11 | f (4.3%) | t (1.7%) | m (3.9%) | d (3.7%) | h (2.9%) |
| 12 | l (4.2%) | p (1.7%) | c (3.1%) | u (3.3%) | i (2.6%) |
| 13 | h (3.6%) | m (1.4%) | d (3.1%) | g (3.3%) | k (2.1%) |
| 14 | n (3.2%) | c (1.4%) | g (2.9%) | p (3.1%) | m (1.5%) |
| 15 | w (2.9%) | w (1.2%) | p (2.9%) | c (3.1%) | g (1.2%) |
| 16 | k (2.9%) | k (0.8%) | b (2.6%) | m (3.0%) | p (1.1%) |
| 17 | o (2.4%) | s (0.8%) | k (2.2%) | h (1.9%) | c (1.0%) |
| 18 | e (2.2%) | b (0.7%) | w (2.1%) | b (1.9%) | u (0.6%) |
| 19 | v (1.9%) | d (0.7%) | v (1.9%) | f (1.7%) | f (0.6%) |
| 20 | j (1.5%) | g (0.6%) | y (1.7%) | v (1.2%) | x (0.6%) |
| 21 | u (1.5%) | x (0.4%) | f (1.4%) | z (1.0%) | b (0.5%) |
| 22 | y (1.4%) | v (0.4%) | z (1.1%) | w (1.0%) | w (0.5%) |
| 23 | i (1.2%) | f (0.2%) | h (1.0%) | y (0.8%) | z (0.3%) |
| 24 | z (0.8%) | z (0.2%) | x (1.0%) | j (0.3%) | q (0.0%) |
| 25 | q (0.7%) | q (0.1%) | j (0.4%) | x (0.1%) | v (0.0%) |
| 26 | x (0.1%) | j (0.1%) | q (0.1%) | q (0.0%) | j (0.0%) |

## Best Words (I Thought)
I analyzed every word by summing the percentage likelihood of each letter appearing in its specific position, resulting in a score for each word. This process initially identified `sanes` as the top word, but since repeated letters are less useful for early guesses, I filtered out words with duplicate letters. This was implemented in the `getBestStartingWordleWord(wordList)` function, which produced the files [`best_starting_wordle_words_from_position_chances_no_repeating_letters.json`](./analysis/stats/best_starting_wordle_words_from_position_chances_no_repeating_letters.json) and [`best_starting_wordle_words_from_position_chances.json`](./analysis/stats/best_starting_wordle_words_from_position_chances.json). The table below shows the results.

*Please note that, as previously mentioned, the Score is not truly a percentage but a summative representation of the likelihood a given letter would appear in its given spot in the word—this % can be very misleading.*
*Also note: due to the length of this list, only the first 10 and last 5 will be in the [README.md](./README.md). Please see the [JSON file](./analysis/stats/best_starting_wordle_words_from_position_chances_no_repeating_letters.json) ([`best_starting_wordle_words_from_position_chances_no_repeating_letters.json`](./analysis/stats/best_starting_wordle_words_from_position_chances_no_repeating_letters.json)) or the [table file](./analysis/stats/best_starting_wordle_words_tables_from_position_chances_no_repeating_letters.md) ([`best_starting_wordle_words_tables_from_position_chances_no_repeating_letters.md`](./analysis/stats/best_starting_wordle_words_tables_from_position_chances_no_repeating_letters.md)) for the full list.*

| Rank | Word | Score |
| :-: | :-: | :-: |
1 | pares | 81.02
2 | bares | 80.17
3 | cares | 79.95
4 | mares | 79.82
5 | panes | 79.44
6 | tares | 79.35
7 | pores | 79.22
8 | banes | 78.59
9 | pales | 78.46
10 | bores | 78.36
11 | ... to ... | 9360  
9361 | upbow | 11.76
9362 | udyog | 10.56
9363 | othyl | 9.54
9364 | ethyl | 9.39
9365 | enzym | 8.31

### Why those are not the best words
These words are very effective at finding green letters on the first guess because they use the most common letters in their most likely positions. However, this approach mainly focuses on matching letters in the exact spots, rather than helping you learn more about which letters are in the word overall. As a result, these starting words might not be as helpful for revealing yellow letters or for quickly narrowing down the list of possible answers.

## New Approach

After reviewing the previous method, I realized that focusing solely on the most common letters in their exact positions (the "green letter score") is not always the most effective strategy for Wordle. While this method is great for maximizing the chance of getting green letters (correct letter, correct position) on the first guess, it doesn't help as much with discovering which letters are present in the word, regardless of their position (yellow letters).

To address this, I introduced a new scoring system called the "popularity score" (or "Pop Score"). Instead of only considering the likelihood of each letter appearing in a specific position, the Pop Score sums up the overall frequency percentages of all unique letters in a word, based on their general occurrence in the Wordle word list. This approach rewards words that contain the most common letters, regardless of their position, making it more likely to reveal useful information about which letters are in the target word.

In summary:
- The **Green Score** measures how likely a word is to produce green letters by matching common letters in their most frequent positions.
- The **Pop Score** measures how likely a word is to contain the most common letters overall, regardless of their position, increasing the chance of finding yellow letters and narrowing down possible answers more efficiently.

When ranking starting words, I now use the Pop Score as the primary metric. If two words have the same Pop Score, the Green Score is used as a tiebreaker. This combined approach helps select starting words that are both likely to hit common letters and provide valuable information for solving the puzzle in fewer guesses.

## Mixing Green and Pop Scores

After developing both the Green Score and Pop Score systems, I wanted a way to combine their strengths. To do this, I introduced a **weighted scoring system** that mixes both scores using adjustable weights. This allows you to tune how much you value matching common letters in their exact positions (Green Score) versus simply including the most common letters anywhere in the word (Pop Score).

The formula is simple:
```
Final Score = (Green Score * Green Score Weight) + (Pop Score * Pop Score Weight)
```
- **Green Score Weight**: How much you care about matching letters in their most likely positions (finding green letters).
- **Pop Score Weight**: How much you care about just hitting the most common letters, regardless of position (finding yellow letters).

By adjusting these weights, you can prioritize your starting word strategy:
- A higher Pop Score Weight (e.g., 0.9) means you want to maximize the chance of revealing which common letters are present, even if not in the right spot.
- A higher Green Score Weight (e.g., 0.9) means you want to maximize the chance of getting green letters right away.

I chose these weights based on what seemed reasonable from initial results, but they are somewhat arbitrary. I encourage others to experiment with the code and adjust the weights to find the starting word and scoring balance that works best for their own play style.

The code for this approach is in the function `getBestStartingWordleWordByPopScore(wordList, greenScoreWeight, popScoreWeight)`, and the results are saved in both JSON and table formats for easy review.

```
Final Score = (Green Score * Green Score Weight) + (Pop Score * Pop Score Weight)
```

This flexible system lets you experiment and find the best starting word for your own play style!

## Results and Explanation

The results below use a Green Score Weight of 0.1 and a Pop Score Weight of 0.9, which I selected based on what seemed reasonable from initial testing. These weights are somewhat arbitrary, and you may get different results by adjusting them. I encourage you to experiment with the code and try different weight combinations to find the starting word and scoring balance that best fits your own play style. The table shows the top 25 and last 5 starting words from this analysis:

| Rank | Word  | Score | Pop Score | Green Score |
| :----: | :---: | :-----: | :-----: | :-----: |
| 1 | aeros | 44.79 | 42.85 | 62.23 |
| 2 | tares | 44.68 | 40.83 | 79.35 |
| 3 | lares | 44.59 | 40.92 | 77.62 |
| 4 | rales | 44.45 | 40.92 | 76.20 |
| 5 | rates | 44.20 | 40.83 | 74.60 |
| 6 | ranes | 44.18 | 40.52 | 77.19 |
| 7 | nares | 44.12 | 40.52 | 76.57 |
| 8 | toeas | 44.05 | 41.50 | 66.99 |
| 9 | soare | 43.95 | 42.85 | 53.87 |
| 10 | aloes | 43.91 | 41.59 | 64.79 |
| 11 | reais | 43.90 | 41.73 | 63.37 |
| 12 | dares | 43.40 | 39.52 | 78.36 |
| 13 | arles | 43.38 | 40.92 | 65.50 |
| 14 | teras | 43.31 | 40.83 | 65.64 |
| 15 | pares | 43.31 | 39.11 | 81.02 |
| 16 | tales | 43.29 | 39.57 | 76.79 |
| 17 | earls | 43.28 | 40.92 | 64.45 |
| 18 | laers | 43.19 | 40.92 | 63.64 |
| 19 | aeons | 43.17 | 41.19 | 61.00 |
| 20 | mares | 43.16 | 39.08 | 79.82 |
| 21 | reals | 43.05 | 40.92 | 62.16 |
| 22 | tears | 42.98 | 40.83 | 62.34 |
| 23 | cares | 42.97 | 38.86 | 79.95 |
| 24 | lanes | 42.94 | 39.26 | 76.04 |
| 25 | earns | 42.92 | 40.52 | 64.56 |
|----|----|----|----|----|
| 9360 | jumpy | 15.55 | 14.16 | 28.04 |
| 9361 | judgy | 15.18 | 13.82 | 27.43 |
| 9362 | phynx | 14.87 | 14.32 | 19.85 |
| 9363 | whump | 14.82 | 14.67 | 16.17 |
| 9364 | vughy | 14.72 | 13.44 | 26.18 |
| 9365 | jumby | 14.72 | 13.37 | 26.81 |

You can view the full ranked lists in the generated JSON and table files in the `analysis` folder, such as:
- [`best_starting_wordle_words_by_pop_score_table.md`](./analysis/stats/best_starting_wordle_words_by_pop_score_table.md)
- [`best_starting_wordle_words_by_pop_score_no_repeating_letters.json`](./analysis/stats/best_starting_wordle_words_by_pop_score_no_repeating_letters.json)
- [`best_starting_wordle_words_by_pop_score.json`](./analysis/stats/best_starting_wordle_words_by_pop_score.json)












































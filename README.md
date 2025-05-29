# The Best Wordle Starting Word
*By:Xhram*


The best starting word for Wordle is **pares**.
![Pares](./analysis/Pares.png)


## Why is Pares the best starting word?

### Most common letter:
This started by asking what is the most common letter in wordle. So I ripped the [wordlist from wordle](./words.json) then I simply created a [node js script](./analysis/index.js) and made a function `getMostCommonLetters(wordList)` leaving me with to files [`most_common_letters.json`](./analysis/most_common_letters.json) and [`sorted_most_common_letters.json`](./analysis/sorted_most_common_letters.json). I simplifyed it into a table at [`sorted_most_common_letters_table.txt`](./analysis/sorted_most_common_letters_table.txt).



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


### Most common letter per position
The next step was what is the most common letter at any single position in a given word. Then you get the idea I made a function `getMostCommonLettersPerPosition(wordList)`. Running the aforementioned function produces to files [`sorted_most_common_letters_per_position.json`](./analysis/sorted_most_common_letters_per_position.json) and [`most_common_letters_per_position.json`](./analysis/most_common_letters_per_position.json). Then again I made another [table](./analysis/sorted_most_common_letters_per_position_table.txt).


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


### Best Words
Lastly I just went through every word and took the percentage that a letter at a give position in a word is and added it together to give it a score. Doing so gives you `sanes` but as you might know double letters aren't as helpful as using a guess on a new letter. Therefore I filtered any words using a letter more then once. Done in this function `getBestStartingWordleWord(wordList)` in turn gives you [`best_starting_wordle_words_no_repeating_letters.json`](./analysis/best_starting_wordle_words_no_repeating_letters.json) and [`best_starting_wordle_words.json`](./analysis/best_starting_wordle_words.json). In the end here is the table I made.

*Please Note that as previously mentioned the Score is not truly a percentage but an summative representation of the likly hood a given letter would appear in its given spot in the word - this % can be very missleading*

*Also note due to the length of this list only the first 100 and last 100 will be in the [README.md](./README.md) but please go to the [json file](./analysis/best_starting_wordle_words_no_repeating_letters.json) ([`best_starting_wordle_words_no_repeating_letters.json`](./analysis/best_starting_wordle_words_no_repeating_letters.json)) or the [table file](./analysis/best_starting_wordle_words_table_no_repeating_letters.txt) ([`best_starting_wordle_words_table_no_repeating_letters.txt`](./analysis/best_starting_wordle_words_table_no_repeating_letters.txt))*
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
11 | canes | 78.36
12 | dares | 78.36
13 | manes | 78.24
14 | cores | 78.14
15 | gares | 78.03
16 | mores | 78.01
17 | fares | 77.77
18 | pones | 77.64
19 | lares | 77.62
20 | bales | 77.60
21 | tores | 77.55
22 | males | 77.25
23 | ranes | 77.19
24 | hares | 77.00
25 | pates | 76.86
26 | tales | 76.79
27 | bones | 76.78
28 | poles | 76.65
29 | nares | 76.57
30 | cones | 76.56
31 | dores | 76.56
32 | wares | 76.34
33 | gores | 76.22
34 | rales | 76.20
35 | fanes | 76.18
36 | lanes | 76.04
37 | bates | 76.00
38 | tones | 75.97
39 | fores | 75.96
40 | lores | 75.82
41 | boles | 75.80
42 | dales | 75.80
43 | cates | 75.78
44 | mates | 75.65
45 | coles | 75.58
46 | gales | 75.46
47 | moles | 75.45
48 | rones | 75.38
49 | vares | 75.33
50 | fales | 75.20
51 | kaies | 75.09
52 | paces | 75.05
53 | potes | 75.05
54 | toles | 74.98
55 | pages | 74.78
56 | wanes | 74.76
57 | cames | 74.74
58 | kanes | 74.72
59 | rates | 74.60
60 | kores | 74.50
61 | hales | 74.43
62 | roles | 74.40
63 | fones | 74.38
64 | botes | 74.20
65 | dates | 74.20
66 | tames | 74.14
67 | pomes | 74.01
68 | doles | 74.00
69 | cades | 73.98
70 | cotes | 73.98
71 | moues | 73.98
72 | gates | 73.86
73 | maces | 73.85
74 | motes | 73.85
75 | paves | 73.78
76 | wales | 73.77
77 | vanes | 73.75
78 | kales | 73.74
79 | cages | 73.71
80 | capes | 73.70
81 | goles | 73.66
82 | hones | 73.61
83 | fates | 73.60
84 | mages | 73.58
85 | mapes | 73.57
86 | rames | 73.56
87 | taces | 73.38
88 | janes | 73.35
89 | mabes | 73.30
90 | bakes | 73.27
91 | dames | 73.15
92 | tapes | 73.11
93 | cakes | 73.05
94 | yores | 72.99
95 | comes | 72.93
96 | roues | 72.92
97 | makes | 72.92
98 | paxes | 72.89
99 | tabes | 72.84
100 | hates | 72.83
101 | ... to ... | 9265
9266 | oxlip | 17.51
9267 | aspic | 17.51
9268 | abohm | 17.50
9269 | amuck | 17.50
9270 | glyph | 17.50
9271 | ethal | 17.44
9272 | kydst | 17.35
9273 | epoch | 17.34
9274 | ejido | 17.32
9275 | oculi | 17.26
9276 | aswim | 17.24
9277 | inorb | 17.23
9278 | thymi | 17.23
9279 | using | 17.23
9280 | uncap | 17.21
9281 | octli | 17.13
9282 | kyudo | 17.09
9283 | tsubo | 17.08
9284 | ampul | 17.07
9285 | escot | 17.04
9286 | optic | 17.03
9287 | askoi | 16.96
9288 | ancho | 16.91
9289 | umbra | 16.88
9290 | otium | 16.83
9291 | extol | 16.79
9292 | estro | 16.78
9293 | opium | 16.78
9294 | okrug | 16.71
9295 | xylic | 16.71
9296 | unbag | 16.70
9297 | infra | 16.60
9298 | oskin | 16.56
9299 | ekdam | 16.54
9300 | odism | 16.48
9301 | educt | 16.45
9302 | opgaf | 16.44
9303 | impot | 16.42
9304 | ephod | 16.33
9305 | whump | 16.17
9306 | abjud | 16.16
9307 | indol | 16.16
9308 | ovism | 16.14
9309 | lymph | 16.14
9310 | elbow | 16.06
9311 | psych | 15.97
9312 | odium | 15.83
9313 | xysti | 15.82
9314 | abmho | 15.79
9315 | ozeki | 15.71
9316 | incut | 15.63
9317 | unmix | 15.60
9318 | equip | 15.57
9319 | adsum | 15.54
9320 | zygon | 15.43
9321 | ephor | 15.41
9322 | input | 15.36
9323 | awful | 15.35
9324 | incur | 15.24
9325 | nduja | 15.19
9326 | nymph | 15.08
9327 | osmic | 15.07
9328 | elchi | 15.05
9329 | ogmic | 14.94
9330 | unjam | 14.88
9331 | envoi | 14.84
9332 | zymic | 14.77
9333 | exfil | 14.70
9334 | odeum | 14.65
9335 | estop | 14.61
9336 | etyma | 14.55
9337 | inspo | 14.49
9338 | estoc | 14.48
9339 | ogham | 14.39
9340 | impro | 14.35
9341 | ichor | 14.12
9342 | adhoc | 14.10
9343 | endow | 14.00
9344 | emoji | 13.99
9345 | oshac | 13.98
9346 | enfix | 13.83
9347 | abysm | 13.71
9348 | incog | 13.69
9349 | exurb | 13.64
9350 | unzip | 13.35
9351 | unhip | 13.22
9352 | octyl | 13.17
9353 | unfix | 13.07
9354 | indow | 12.99
9355 | ethic | 12.97
9356 | embog | 12.96
9357 | unbox | 12.80
9358 | inbox | 12.55
9359 | embox | 12.37
9360 | embow | 12.27
9361 | upbow | 11.76
9362 | udyog | 10.56
9363 | othyl | 9.54
9364 | ethyl | 9.39
9365 | enzym | 8.31
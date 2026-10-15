# Probability and Randomization

This topic teaches two things: **algorithms that use randomness** (fair shuffles, sampling from streams, weighted picks, rejection sampling, random pivots, random hash seeds) and **problems that ask for a probability** (which are usually dynamic programming with fractions). You will learn to prove that a random algorithm is fair, compute expected running times with "try until success" reasoning, and write tests for random code that are reproducible (seeded PRNG) and never flaky (wide tolerance bands).

**Prerequisites:** [Mathematics for DSA](../00_Foundations/04_Mathematics_For_DSA/README.md), [Hashing](../05_Hashing/README.md), [Searching](../10_Searching/README.md), [Sorting](../11_Sorting/README.md), [Dynamic Programming overview](../29_Dynamic_Programming/01_Concepts/OVERVIEW.md)

## Essential vs Advanced

- **Essential** (normal interviews): expectation and linearity, geometric "try until success", Fisher–Yates, reservoir sampling, weighted pick with prefix sums + binary search, rejection sampling (rand10 from rand7), Insert Delete GetRandom, randomized quickselect, probability DP, seeded tests. Problems 01–08.
- **Advanced (competitive programming)**: alias method, rand10 with leftover reuse, random-seed hashing against anti-hash tests, Monte Carlo vs Las Vegas in depth, convergence cutoffs (Soup Servings), sliding-window probability DP (New 21 Game). Problems 09–10.

Every section of [CONCEPTS.md](01_Concepts/CONCEPTS.md) carries one of these two tags.

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom. On a first pass, skip sections tagged Advanced.
2. Open [02_Implementations/randomization.js](02_Implementations/randomization.js) and run it: `node 02_Implementations/randomization.js`. Then close it and re-implement Fisher–Yates, reservoir sampling and the weighted picker from memory.
3. Solve the problems in order (01 to 10). Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Answer the questions in [04_Interview_And_Assessment](04_Interview_And_Assessment) and tick the mastery checklist only when you meet it.
5. Run this topic's tests from the curriculum root: `npm run test:topic 38_Probability_And_Randomization`, or from this folder: `node --test tests/randomization.test.js`.

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts/CONCEPTS.md) | 16-step guide: expectation, geometric distribution, Fisher–Yates and reservoir proofs, weighted pick, rejection sampling, randomized quickselect, Monte Carlo vs Las Vegas, chi-square checks, seeded PRNG |
| [02_Implementations](02_Implementations/randomization.js) | `randomization.js`: mulberry32, randInt, fisherYates, reservoirSample, WeightedPicker, AliasTable, rand10FromRand7, quickselect, randomizedQuicksort, seeded hash, chiSquare/looksUniform |
| [03_Problems](03_Problems) | 10 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) and a [self-assessment quiz](04_Interview_And_Assessment/QUIZ.md) |
| [tests](tests/randomization.test.js) | node:test suite (seeded, wide tolerance bands) |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Shuffle an Array | Medium | Fisher–Yates | [statement](03_Problems/02_Medium/01_shuffle_an_array.md) | [solution](03_Problems/solutions/01_shuffle_an_array.js) |
| 02 | Random Pick Index | Medium | reservoir sampling | [statement](03_Problems/02_Medium/02_random_pick_index.md) | [solution](03_Problems/solutions/02_random_pick_index.js) |
| 03 | Linked List Random Node | Medium | reservoir sampling | [statement](03_Problems/02_Medium/03_linked_list_random_node.md) | [solution](03_Problems/solutions/03_linked_list_random_node.js) |
| 04 | Random Pick with Weight | Medium | prefix sums + binary search | [statement](03_Problems/02_Medium/04_random_pick_with_weight.md) | [solution](03_Problems/solutions/04_random_pick_with_weight.js) |
| 05 | Implement Rand10() Using Rand7() | Medium | rejection sampling | [statement](03_Problems/02_Medium/05_rand10_using_rand7.md) | [solution](03_Problems/solutions/05_rand10_using_rand7.js) |
| 06 | Random Point in Non-overlapping Rectangles | Medium | weighted pick by point count | [statement](03_Problems/02_Medium/06_random_point_in_rectangles.md) | [solution](03_Problems/solutions/06_random_point_in_rectangles.js) |
| 07 | Insert Delete GetRandom O(1) | Medium | array + Map, swap-remove | [statement](03_Problems/02_Medium/07_insert_delete_getrandom.md) | [solution](03_Problems/solutions/07_insert_delete_getrandom.js) |
| 08 | Knight Probability in Chessboard | Medium | probability DP (forward) | [statement](03_Problems/02_Medium/08_knight_probability.md) | [solution](03_Problems/solutions/08_knight_probability.js) |
| 09 | Soup Servings | Hard (Advanced) | memoized probability DP + convergence | [statement](03_Problems/03_Hard/09_soup_servings.md) | [solution](03_Problems/solutions/09_soup_servings.js) |
| 10 | New 21 Game | Hard (Advanced) | probability DP + sliding window | [statement](03_Problems/03_Hard/10_new_21_game.md) | [solution](03_Problems/solutions/10_new_21_game.js) |

All ten are LeetCode Medium; 09 and 10 are placed under Hard here because they need an extra insight (convergence cutoff, sliding-window sum).

## Testing random code (the rule used everywhere in this topic)

Every random function takes an optional `rng` argument (default `Math.random`). Tests pass `mulberry32(seed)` so any failure can be replayed, and they check bucket counts with `looksUniform`, which allows about 6 standard deviations of noise. A correct generator essentially never fails; a biased one fails by a huge margin.

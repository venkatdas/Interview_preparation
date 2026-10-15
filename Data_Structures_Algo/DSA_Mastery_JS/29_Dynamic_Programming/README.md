# Dynamic Programming

Dynamic programming (DP) solves a problem by splitting it into smaller versions of itself, solving each smaller version **once**, and saving the answer so it is never recomputed: "recursion + a notebook". It is the most feared interview topic, but it is also the most predictable once you follow one recipe: **define the state → write the recurrence → set the base cases → choose the order → read the answer**. This folder teaches that recipe first and then the six classic families, one sub-folder each. Every solution file shows the same progression: brute force → memoised recursion → tabulation → space-optimised.

**Prerequisites:** [Backtracking](../13_Backtracking/README.md) (recursion and the decision tree), [Hashing](../05_Hashing/README.md) (memo tables), [Complexity Analysis](../01_Complexity_Analysis).

## Start here

1. Read [01_Concepts/OVERVIEW.md](01_Concepts/OVERVIEW.md) — the 5-step framework, top-down vs bottom-up, how to count states × transitions, and how to recognise a DP problem.
2. Open [02_Implementations/dp_framework.js](02_Implementations/dp_framework.js) and run it with `node 29_Dynamic_Programming/02_Implementations/dp_framework.js`. It takes Fibonacci and Climbing Stairs through naive recursion, memoization, tabulation and rolling variables, with timings.
3. Work through the sub-topics in the order below.

## Sub-topics

| # | Sub-topic | What you learn | Problems | Tests |
|---|---|---|---|---|
| 01 | [1D DP](01_One_Dimensional_DP/README.md) | `dp[i]` over a prefix or an index: Fibonacci family, House Robber, Decode Ways, Coin Change, Word Break, simple stock problems | 19 | `node --test 29_Dynamic_Programming/01_One_Dimensional_DP/tests/one_dimensional_dp.test.js` |
| 02 | [Knapsack](02_Knapsack/README.md) | 0/1 vs unbounded, subset sum, counting combinations vs permutations, the reversed-loop trick | 11 | `node --test 29_Dynamic_Programming/02_Knapsack/tests/knapsack.test.js` |
| 03 | [Strings and Sequences](03_Strings_And_Sequences/README.md) | two-index DP over strings: LCS, LIS, edit distance, palindromes, wildcard / regex matching | 16 | `node --test 29_Dynamic_Programming/03_Strings_And_Sequences/tests/strings_and_sequences.test.js` |
| 04 | [Grid DP](04_Grid_DP/README.md) | `dp[r][c]` on a matrix: unique paths, min path sum, maximal square, dungeon game, cherry pickup | 10 | `node --test 29_Dynamic_Programming/04_Grid_DP/tests/grid_dp.test.js` |
| 05 | [Interval DP](05_Interval_DP/README.md) | `dp[l][r]` over ranges: matrix chain, burst balloons, cut stick, two-ends games | 8 | `node --test 29_Dynamic_Programming/05_Interval_DP/tests/interval_dp.test.js` |
| 06 | [Advanced DP](06_Advanced_DP/README.md) | bitmask, tree, digit and state-machine DP; DP + binary search; DP + monotonic deque | 14 | `node --test 29_Dynamic_Programming/06_Advanced_DP/tests/advanced_dp.test.js` |

Total: 78 problems, each with a statement page (staged hints, no spoilers) and a runnable solution file.

## Study order

1. **01 → 02** first. 1D DP teaches the recipe on the smallest states; knapsack teaches "choices with a capacity", which appears everywhere.
2. **03 and 04** next, in either order. Both add a second index; strings are asked more often in interviews, grids are easier to visualise.
3. **05 Interval DP** after you are comfortable filling 2D tables in a non-obvious order.
4. **06 Advanced DP** last. Tree DP and stock state machines are common in top-tier interviews; bitmask and digit DP appear mainly in hard rounds.
5. For each sub-topic: read `01_Concepts/CONCEPTS.md`, solve the problems Easy → Hard (timebox, then hints), answer `04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md`, take `QUIZ.md`, and run that sub-topic's tests.
6. When a DP feels slow or uses too much memory, continue with DP optimisations in [41_Advanced_Algorithm_Design](../41_Advanced_Algorithm_Design).

## Run all DP tests

From the curriculum root:

```
node --test 29_Dynamic_Programming/*/tests/*.test.js
```

Each solution file can also be run on its own, e.g. `node 29_Dynamic_Programming/05_Interval_DP/03_Problems/solutions/06_burst_balloons.js`; it runs its own asserts and prints a ✓ line.

# Knapsack DP

**Knapsack** problems pick items under a budget: maximum value that fits in a bag, fewest coins for an amount, number of ways to reach a sum, or whether an array splits into equal halves. The state is "items considered so far + capacity left", and the only decision per item is take it or skip it. Learning the loop-direction rule (down = each item once, up = reuse) unlocks a whole family of interview problems.

**Prerequisites:** [1D Dynamic Programming](../01_One_Dimensional_DP/README.md), [DP overview](../01_Concepts/OVERVIEW.md), [Backtracking](../../13_Backtracking/README.md) (the subset brute force).

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (pseudocode, dry run, loop direction, alternatives, when knapsack does NOT apply).
2. Run [02_Implementations/knapsack.js](02_Implementations/knapsack.js): `node 02_Implementations/knapsack.js`. Then close it and re-implement 0/1, unbounded, subset sum and count subsets from memory.
3. Solve the problems in order (suggested: 01 → 02 → 03 → 04 → 05 → 06 → 07 → 08/09 → 10 → 11). Each page has the statement and staged hints; the solution lives in a separate file.
4. Test yourself: [QUIZ.md](04_Interview_And_Assessment/QUIZ.md) and [INTERVIEW_QUESTIONS.md](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md). Tick the mastery checklist only when it is true.
5. Run this sub-topic's tests: `node --test tests/knapsack.test.js` (from this folder).

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts) | intuition, pseudocode, dry run, complexity, patterns, alternatives, when knapsack does NOT apply |
| [02_Implementations](02_Implementations) | `knapsack.js` (0/1 2D + 1D, unbounded, subset sum, count subsets) |
| [03_Problems](03_Problems) | 11 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) and a [self-assessment quiz](04_Interview_And_Assessment/QUIZ.md) |
| [tests](tests) | [knapsack.test.js](tests/knapsack.test.js): `knapsack.js` vs brute force, and all versions of 11 solutions agreeing on random inputs |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | 0/1 Knapsack | Medium | 0/1 knapsack, max value | [statement](03_Problems/02_Medium/01_knapsack_01_basic.md) | [solution](03_Problems/solutions/01_knapsack_01_basic.js) |
| 02 | Unbounded Knapsack | Medium | unbounded, forward loop | [statement](03_Problems/02_Medium/02_unbounded_knapsack_basic.md) | [solution](03_Problems/solutions/02_unbounded_knapsack_basic.js) |
| 03 | Partition Equal Subset Sum | Medium | subset sum (boolean) | [statement](03_Problems/02_Medium/03_subset_sum_partition_equal.md) | [solution](03_Problems/solutions/03_subset_sum_partition_equal.js) |
| 04 | Coin Change | Medium | unbounded, min variant | [statement](03_Problems/02_Medium/04_coin_change_min_coins.md) | [solution](03_Problems/solutions/04_coin_change_min_coins.js) |
| 05 | Coin Change II | Medium | unbounded, count combinations | [statement](03_Problems/02_Medium/05_coin_change_ii.md) | [solution](03_Problems/solutions/05_coin_change_ii.js) |
| 06 | Combination Sum IV | Medium | unbounded, count permutations | [statement](03_Problems/02_Medium/06_combination_sum_iv.md) | [solution](03_Problems/solutions/06_combination_sum_iv.js) |
| 07 | Target Sum | Medium | transform to count subsets | [statement](03_Problems/02_Medium/07_target_sum.md) | [solution](03_Problems/solutions/07_target_sum.js) |
| 08 | Last Stone Weight II | Medium | subset sum closest to half | [statement](03_Problems/02_Medium/08_last_stone_weight_ii.md) | [solution](03_Problems/solutions/08_last_stone_weight_ii.js) |
| 09 | Minimum Subset Sum Difference | Medium | subset sum closest to half | [statement](03_Problems/02_Medium/09_minimum_subset_sum_difference.md) | [solution](03_Problems/solutions/09_minimum_subset_sum_difference.js) |
| 10 | Rod Cutting | Medium | unbounded knapsack | [statement](03_Problems/02_Medium/10_rod_cutting.md) | [solution](03_Problems/solutions/10_rod_cutting.js) |
| 11 | Ones and Zeroes | Medium | 0/1 knapsack, 2 capacities | [statement](03_Problems/02_Medium/11_ones_and_zeroes.md) | [solution](03_Problems/solutions/11_ones_and_zeroes.js) |


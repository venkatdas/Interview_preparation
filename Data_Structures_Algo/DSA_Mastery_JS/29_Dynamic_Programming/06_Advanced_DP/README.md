# Advanced DP (Bitmask, Tree, Digit, State Machine)

**Prerequisites:** [Dynamic Programming/02 Knapsack](../02_Knapsack/README.md), [Bit Manipulation](../../14_Bit_Manipulation/README.md), [Binary Trees](../../20_Trees/01_Binary_Trees/README.md)

## How to study this topic

1. Read [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (intuition, how it works, complexity, patterns, mistakes, interview tips).
2. This sub-topic has no separate implementation file: the reusable DP helpers live in [../02_Implementations/dp_framework.js](../02_Implementations/dp_framework.js) and the big-picture guide is [../01_Concepts/OVERVIEW.md](../01_Concepts/OVERVIEW.md). Every solution file shows brute force → memo → tabulation → optimized.
3. Solve the problems in order: Easy, then Medium, then Hard. Each problem page has the statement and staged hints; the solution lives in a separate file.
4. Answer the [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) out loud, then take the [quiz](04_Interview_And_Assessment/QUIZ.md). Move on only when every box in its mastery checklist is ticked.
5. Run this topic's tests from the curriculum root: `node --test 29_Dynamic_Programming/06_Advanced_DP/tests/advanced_dp.test.js`.

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) | theory, visuals, pseudocode, dry run, complexity, alternatives, patterns, common mistakes, interview tips |
| [../02_Implementations/dp_framework.js](../02_Implementations/dp_framework.js) | shared DP framework (memo / tabulation helpers) used by all DP sub-topics |
| [03_Problems](03_Problems) | 14 problems with staged hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) | conceptual interview questions with model answers |
| [04_Interview_And_Assessment/QUIZ.md](04_Interview_And_Assessment/QUIZ.md) | self-assessment quiz + mastery checklist |
| [tests](tests) | `advanced_dp.test.js` (node:test) |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Count Numbers with Unique Digits | Medium | digit DP (lite) | [statement](03_Problems/02_Medium/01_count_numbers_with_unique_digits.md) | [solution](03_Problems/solutions/01_count_numbers_with_unique_digits.js) |
| 02 | Count Vowels Permutation | Hard | state machine | [statement](03_Problems/03_Hard/02_count_vowels_permutation.md) | [solution](03_Problems/solutions/02_count_vowels_permutation.js) |
| 03 | Number of Ways to Stay in the Same Place After Some Steps | Hard | 2D DP, rolling row | [statement](03_Problems/03_Hard/03_number_of_ways_to_stay_in_same_place.md) | [solution](03_Problems/solutions/03_number_of_ways_to_stay_in_same_place.js) |
| 04 | Frog Jump | Hard | memo with Map key `${i},${k}` | [statement](03_Problems/03_Hard/04_frog_jump.md) | [solution](03_Problems/solutions/04_frog_jump.js) |
| 05 | House Robber III | Medium | tree DP (take/skip tuple) | [statement](03_Problems/02_Medium/05_house_robber_iii.md) | [solution](03_Problems/solutions/05_house_robber_iii.js) |
| 06 | Diameter of Binary Tree / Longest Path | Easy | tree DP (longest path) | [statement](03_Problems/01_Easy/06_diameter_longest_path_tree_dp.md) | [solution](03_Problems/solutions/06_diameter_longest_path_tree_dp.js) |
| 07 | Minimum Difficulty of a Job Schedule | Hard | partition DP (index + days) | [statement](03_Problems/03_Hard/07_minimum_difficulty_job_schedule.md) | [solution](03_Problems/solutions/07_minimum_difficulty_job_schedule.js) |
| 08 | Best Time to Buy and Sell Stock III | Hard | state machine (2 transactions) | [statement](03_Problems/03_Hard/08_best_time_to_buy_sell_stock_iii.md) | [solution](03_Problems/solutions/08_best_time_to_buy_sell_stock_iii.js) |
| 09 | Best Time to Buy and Sell Stock IV | Hard | state machine (k transactions) | [statement](03_Problems/03_Hard/09_best_time_to_buy_sell_stock_iv.md) | [solution](03_Problems/solutions/09_best_time_to_buy_sell_stock_iv.js) |
| 10 | Maximum Profit in Job Scheduling | Hard | DP + binary search | [statement](03_Problems/03_Hard/10_maximum_profit_job_scheduling.md) | [solution](03_Problems/solutions/10_maximum_profit_job_scheduling.js) |
| 11 | Partition to K Equal Sum Subsets | Medium | bitmask DP | [statement](03_Problems/02_Medium/11_partition_k_equal_sum_subsets.md) | [solution](03_Problems/solutions/11_partition_k_equal_sum_subsets.js) |
| 12 | Binary Tree Cameras | Hard | tree DP (3 states) | [statement](03_Problems/03_Hard/12_binary_tree_cameras.md) | [solution](03_Problems/solutions/12_binary_tree_cameras.js) |
| 13 | Constrained Subsequence Sum | Hard | DP + monotonic deque | [statement](03_Problems/03_Hard/13_constrained_subsequence_sum.md) | [solution](03_Problems/solutions/13_constrained_subsequence_sum.js) |
| 14 | Find the Shortest Superstring / Travelling Salesman for small n | Hard | bitmask + last (Held-Karp) | [statement](03_Problems/03_Hard/14_shortest_superstring_tsp.md) | [solution](03_Problems/solutions/14_shortest_superstring_tsp.js) |


# 1D Dynamic Programming

**1D DP** is dynamic programming where the state is one number: an index, an amount or a day. You walk a line of stairs, houses, digits or prices, make one decision per position, and write down the best answer so far so nothing is ever recomputed. Every other DP family (knapsack, grids, strings, intervals) is this idea with a bigger state, so start here.

**Prerequisites:** [Recursion](../../12_Recursion) and [Backtracking](../../13_Backtracking/README.md) (writing the plain recursion), [Hashing](../../05_Hashing/README.md) (memo tables), and the [DP overview](../01_Concepts/OVERVIEW.md) (the 5-step framework, shared by all DP sub-topics).

## How to study this topic

1. Read the [DP overview](../01_Concepts/OVERVIEW.md), then [01_Concepts/CONCEPTS.md](01_Concepts/CONCEPTS.md) top to bottom (pseudocode, dry run, patterns, when it does not apply).
2. Run the shared framework file: `node ../02_Implementations/dp_framework.js` (Fibonacci four ways, with timings). There is no separate data structure in this sub-topic.
3. Solve the problems in order: Easy, then Medium. Each page has the statement and staged hints; every solution file shows `bruteForce`, `memo`, `tabulation` and `optimized` side by side.
4. Test yourself: [QUIZ.md](04_Interview_And_Assessment/QUIZ.md) and [INTERVIEW_QUESTIONS.md](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md). Tick the mastery checklist only when it is true.
5. Run this sub-topic's tests: `node --test tests/one_dimensional_dp.test.js` (from this folder).

## Contents

| Section | What is inside |
|---|---|
| [01_Concepts](01_Concepts) | intuition, pseudocode, dry run, complexity, patterns, alternatives, when 1D DP does NOT apply |
| [03_Problems](03_Problems) | 19 problems with hints; solutions in `03_Problems/solutions` |
| [04_Interview_And_Assessment](04_Interview_And_Assessment) | [interview questions](04_Interview_And_Assessment/INTERVIEW_QUESTIONS.md) and a [self-assessment quiz](04_Interview_And_Assessment/QUIZ.md) |
| [tests](tests) | [one_dimensional_dp.test.js](tests/one_dimensional_dp.test.js): every version of 18 solutions must agree on edge cases and seeded random inputs |

## Problems

| # | Problem | Difficulty | Pattern | Statement | Solution |
|---|---|---|---|---|---|
| 01 | Fibonacci Number | Easy | fibonacci family | [statement](03_Problems/01_Easy/01_fibonacci_number.md) | [solution](03_Problems/solutions/01_fibonacci_number.js) |
| 02 | Climbing Stairs | Easy | fibonacci / count ways | [statement](03_Problems/01_Easy/02_climbing_stairs.md) | [solution](03_Problems/solutions/02_climbing_stairs.js) |
| 03 | Min Cost Climbing Stairs | Easy | reach the end, min cost | [statement](03_Problems/01_Easy/03_min_cost_climbing_stairs.md) | [solution](03_Problems/solutions/03_min_cost_climbing_stairs.js) |
| 04 | N-th Tribonacci Number | Easy | fibonacci (3 back) | [statement](03_Problems/01_Easy/04_nth_tribonacci.md) | [solution](03_Problems/solutions/04_nth_tribonacci.js) |
| 05 | House Robber | Medium | take or skip | [statement](03_Problems/02_Medium/05_house_robber.md) | [solution](03_Problems/solutions/05_house_robber.js) |
| 06 | House Robber II | Medium | take or skip, circular | [statement](03_Problems/02_Medium/06_house_robber_ii.md) | [solution](03_Problems/solutions/06_house_robber_ii.js) |
| 07 | Delete and Earn | Medium | house robber in disguise | [statement](03_Problems/02_Medium/07_delete_and_earn.md) | [solution](03_Problems/solutions/07_delete_and_earn.js) |
| 08 | Maximum Subarray | Medium | Kadane / best ending here | [statement](03_Problems/02_Medium/08_maximum_subarray.md) | [solution](03_Problems/solutions/08_maximum_subarray.js) |
| 09 | Counting Bits | Easy | DP on bits | [statement](03_Problems/01_Easy/09_counting_bits.md) | [solution](03_Problems/solutions/09_counting_bits.js) |
| 10 | Decode Ways | Medium | count ways, look back 1 and 2 | [statement](03_Problems/02_Medium/10_decode_ways.md) | [solution](03_Problems/solutions/10_decode_ways.js) |
| 11 | Jump Game | Medium | can reach (DP vs greedy) | [statement](03_Problems/02_Medium/11_jump_game.md) | [solution](03_Problems/solutions/11_jump_game.js) |
| 12 | Jump Game II | Medium | fewest moves (DP vs greedy BFS) | [statement](03_Problems/02_Medium/12_jump_game_ii.md) | [solution](03_Problems/solutions/12_jump_game_ii.js) |
| 13 | Paint House | Medium | state machine (3 colours) | [statement](03_Problems/02_Medium/13_paint_house.md) | [solution](03_Problems/solutions/13_paint_house.js) |
| 14 | Perfect Squares | Medium | amount DP | [statement](03_Problems/02_Medium/14_perfect_squares.md) | [solution](03_Problems/solutions/14_perfect_squares.js) |
| 15 | Coin Change | Medium | amount DP (unbounded) | [statement](03_Problems/02_Medium/15_coin_change.md) | [solution](03_Problems/solutions/15_coin_change.js) |
| 16 | Integer Break | Medium | split the number | [statement](03_Problems/02_Medium/16_integer_break.md) | [solution](03_Problems/solutions/16_integer_break.js) |
| 17 | Word Break | Medium | split the prefix | [statement](03_Problems/02_Medium/17_word_break.md) | [solution](03_Problems/solutions/17_word_break.js) |
| 18 | Best Time to Buy and Sell Stock with Cooldown | Medium | state machine | [statement](03_Problems/02_Medium/18_stock_with_cooldown.md) | [solution](03_Problems/solutions/18_stock_with_cooldown.js) |
| 19 | Best Time to Buy and Sell Stock with Transaction Fee | Medium | state machine | [statement](03_Problems/02_Medium/19_stock_with_transaction_fee.md) | [solution](03_Problems/solutions/19_stock_with_transaction_fee.js) |


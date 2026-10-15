# Combination Sum IV

| | |
|---|---|
| **Topic** | Knapsack DP |
| **Difficulty** | Medium |
| **Pattern** | unbounded, count permutations |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #377 — https://leetcode.com/problems/combination-sum-iv/ |
| **Solution file** | [06_combination_sum_iv.js](../solutions/06_combination_sum_iv.js) — open only after a real attempt |

## Problem

Given distinct positive integers nums and a target, return the number of
ORDERED sequences (permutations) of nums that add up to target. Numbers may
be reused.

## Examples

```
Input: nums=[1,2,3], target=4   Output: 7
  Explanation: 1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 1+3, 3+1, 2+2  (order matters!)
Input: nums=[9], target=3       Output: 0
```

## Constraints & clarifying questions

```
- Does order matter? (yes - despite the name, these are permutations;
  compare with Coin Change II where it does not)
- Reuse allowed? (yes, unbounded)
- Negative numbers? (no; with negatives the count could be infinite)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *unbounded, count permutations* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(nums^target) time, O(target) space. From the remaining target, try every number as the NEXT element and recurse.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — DP (unbounded knapsack, count, order matters)   O(n * target) time, O(target) space. 

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- target 0 -> 1
- all nums > target -> 0
- results grow fast (fit 32-bit on LeetCode)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(nums^target) time, O(target) space

```
From the remaining target, try every number as the NEXT element and recurse.
Because we pick "the next element" freely, 1+2 and 2+1 are different paths.
```

### APPROACH 2 — DP (unbounded knapsack, count, order matters)   O(n * target) time, O(target) space


### DP definition

```
STATE      dp[t] = number of ordered sequences summing to t
RECURRENCE dp[t] = sum over num &lt;= t of dp[t - num]   (last element is num)
BASE CASES dp[0] = 1 (empty sequence)
ANSWER     dp[target]
LOOP ORDER: target OUTER, nums inner. For every total we consider every
possible LAST element, so each ordering is counted separately.
(Swap the loops and you get Coin Change II = combinations.)

Dry run: nums=[1,2,3], target=4
  t:   0  1  2  3  4
  dp:  1  1  2  4  7      dp[3] = dp[2]+dp[1]+dp[0] = 2+1+1 = 4
                          dp[4] = dp[3]+dp[2]+dp[1] = 4+2+1 = 7
```

### Edge cases

```
- target 0 -> 1
- all nums > target -> 0
- results grow fast (fit 32-bit on LeetCode)
```

Full JavaScript solution with tests: [06_combination_sum_iv.js](../solutions/06_combination_sum_iv.js). Run it with `node 06_combination_sum_iv.js` from the solutions folder.

</details>

## Common mistakes

- Putting the numbers loop outside, which counts combinations (Coin Change II) instead of ordered sequences.
- Forgetting `dp[0] = 1`.
- Assuming the result fits in 32 bits for large targets; the problem guarantees it, but intermediate values can still grow.

## Related follow-ups

- [Coin Change II](05_coin_change_ii.md)
- [Climbing Stairs](../../../01_One_Dimensional_DP/03_Problems/01_Easy/02_climbing_stairs.md)
- Combination Sum (backtracking, LeetCode 39)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

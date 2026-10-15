# Partition Equal Subset Sum

| | |
|---|---|
| **Topic** | Knapsack DP |
| **Difficulty** | Medium |
| **Pattern** | subset sum (boolean) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #416 — https://leetcode.com/problems/partition-equal-subset-sum/ |
| **Solution file** | [03_subset_sum_partition_equal.js](../solutions/03_subset_sum_partition_equal.js) — open only after a real attempt |

## Problem

Given an array of positive integers, return true if it can be split into two
subsets with equal sums.

## Examples

```
Input: [1,5,11,5]   Output: true    Explanation: [1,5,5] and [11]
Input: [1,2,3,5]    Output: false   Explanation: total 11 is odd
```

## Constraints & clarifying questions

```
- All numbers positive? (yes, on LeetCode 1..100, up to 200 numbers)
- Must both subsets be non-empty? (with positive numbers an empty subset has sum 0,
  so equal sums force both to be non-empty anyway)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *subset sum (boolean)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (all subsets)   O(2^n) time, O(n) space. Total must be even.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — DP (subset sum = boolean 0/1 knapsack)   O(n * target) time, O(target) space. The "items" are the numbers, their weight is their value, and we only care whether a capacity can be filled EXACTLY.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- odd total -> false immediately
- single element -> false
- [x, x] -> true
- a number larger than total/2 can never be used (loop just skips it)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (all subsets)   O(2^n) time, O(n) space

```
Total must be even. Then ask: does any subset sum to total/2? Try take/skip
for every number.
```

### APPROACH 2 — DP (subset sum = boolean 0/1 knapsack)   O(n * target) time, O(target) space

```
The "items" are the numbers, their weight is their value, and we only care
whether a capacity can be filled EXACTLY.
```

### DP definition

```
STATE      dp[s] = can some subset of the numbers seen so far sum to exactly s
RECURRENCE dp[s] = dp[s] (skip num)  OR  dp[s - num] (take num)
BASE CASES dp[0] = true (empty subset)
ANSWER     dp[total / 2]
Dry run: [1,5,11,5], total 22, target 11
  start      dp[0]=T, rest F
  num 1  ->  reachable {0,1}
  num 5  ->  reachable {0,1,5,6}
  num 11 ->  reachable {0,1,5,6,11}  -> dp[11] = true, answer true
  (loop runs s downward so each number is used once)
```

### Edge cases

```
- odd total -> false immediately
- single element -> false
- [x, x] -> true
- a number larger than total/2 can never be used (loop just skips it)
```

Full JavaScript solution with tests: [03_subset_sum_partition_equal.js](../solutions/03_subset_sum_partition_equal.js). Run it with `node 03_subset_sum_partition_equal.js` from the solutions folder.

</details>

## Common mistakes

- Not rejecting an odd total immediately.
- Setting `dp[0] = false`; the empty subset always reaches sum 0.
- Looping the sum upward, which reuses the same number twice.

## Related follow-ups

- [Target Sum](07_target_sum.md)
- [Last Stone Weight II](08_last_stone_weight_ii.md)
- [Partition to K Equal Sum Subsets](../../../06_Advanced_DP/03_Problems/02_Medium/11_partition_k_equal_sum_subsets.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

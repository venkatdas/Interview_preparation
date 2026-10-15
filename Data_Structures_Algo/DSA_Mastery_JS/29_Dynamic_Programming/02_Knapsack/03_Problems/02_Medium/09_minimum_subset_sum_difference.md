# Minimum Subset Sum Difference

| | |
|---|---|
| **Topic** | Knapsack DP |
| **Difficulty** | Medium |
| **Pattern** | subset sum closest to half |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Classic problem (not on LeetCode) |
| **Solution file** | [09_minimum_subset_sum_difference.js](../solutions/09_minimum_subset_sum_difference.js) — open only after a real attempt |

## Problem

Split an array of non-negative integers into two subsets (every element goes
to exactly one subset) so that the absolute difference of their sums is as
small as possible. Return that minimum difference.

## Examples

```
Input: [1,6,11,5]   Output: 1    Explanation: {1,5,6}=12 and {11}=11
Input: [1,2,3,9]    Output: 3    Explanation: {1,2,3}=6 and {9}=9
```

## Constraints & clarifying questions

```
- Can a subset be empty? (yes, e.g. a single element -> difference is that element)
- Negative numbers? (assume no; with negatives the sum range would need an offset)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *subset sum closest to half* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^n) time, O(n) space. Try every way to put each element in subset A or subset B, track |sumA - sumB|.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — DP (subset sum, pick the sum closest to total/2)   O(n * total) time, O(total) space. If subset A has sum s, subset B has total - s, difference = |total - 2s|.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty -> 0
- single element -> that element
- all equal with even count -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n) time, O(n) space

```
Try every way to put each element in subset A or subset B, track |sumA - sumB|.
```

### APPROACH 2 — DP (subset sum, pick the sum closest to total/2)   O(n * total) time, O(total) space

```
If subset A has sum s, subset B has total - s, difference = |total - 2s|.
We want s as close to total/2 as possible, and s must be a reachable subset sum.
So build the reachable-sum table once, then scan s from total/2 downward.
(Last Stone Weight II is exactly this problem in a costume.)
```

### DP definition

```
STATE      dp[s] = is sum s reachable by some subset of the elements seen so far
RECURRENCE dp[s] = dp[s] || dp[s - num]   (s downward)
BASE CASES dp[0] = true
ANSWER     min over reachable s &lt;= total/2 of (total - 2s)
Dry run: [1,6,11,5], total 23, half 11
  reachable sums: 0,1,5,6,7,11,12,16,17,18,22,23
  largest reachable <= 11 is 11 -> 23 - 22 = 1
```

### Edge cases

```
- empty -> 0
- single element -> that element
- all equal with even count -> 0
```

Full JavaScript solution with tests: [09_minimum_subset_sum_difference.js](../solutions/09_minimum_subset_sum_difference.js). Run it with `node 09_minimum_subset_sum_difference.js` from the solutions folder.

</details>

## Common mistakes

- Looking for the closest sum above half instead of the best reachable sum at or below `floor(total / 2)`.
- Returning `total - best` instead of `total - 2 * best`.
- Trying the DP when values are huge or negative; then use meet in the middle (see the partition follow-up).

## Related follow-ups

- [Last Stone Weight II](08_last_stone_weight_ii.md)
- [Partition Equal Subset Sum](03_subset_sum_partition_equal.md)
- [Partition Array Into Two Arrays to Minimize Sum Difference](../../../../41_Advanced_Algorithm_Design/01_Classic_Techniques/03_Problems/03_Hard/10_partition_array_minimize_sum_difference.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

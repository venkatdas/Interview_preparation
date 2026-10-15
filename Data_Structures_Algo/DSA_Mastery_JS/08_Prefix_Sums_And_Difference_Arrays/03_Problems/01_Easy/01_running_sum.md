# Running Sum of 1d Array

| | |
|---|---|
| **Topic** | Prefix Sums and Difference Arrays |
| **Difficulty** | Easy |
| **Pattern** | build prefix |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1480 — https://leetcode.com/problems/running-sum-of-1d-array/ |
| **Solution file** | [01_running_sum.js](../solutions/01_running_sum.js) — open only after a real attempt |

## Problem

Given an array nums, return runningSum where runningSum[i] = nums[0] + ... + nums[i].

## Examples

```
Input: [1, 2, 3, 4]      Output: [1, 3, 6, 10]
Input: [1, 1, 1, 1, 1]   Output: [1, 2, 3, 4, 5]
Input: [3, 1, 2, 10, 1]  Output: [3, 4, 6, 16, 17]
```

## Constraints & clarifying questions

```
- Modify in place or return a new array? (either; we return a new one)
- Negatives? (fine)
- Empty? ([])
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *build prefix* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(n) space. For each i, sum nums[0..i] from scratch.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (prefix sum, one pass)   O(n) time, O(n) output (O(1) extra if in place). runningSum[i] = runningSum[i - 1] + nums[i].

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Empty -> []
- Single element -> itself
- Negatives can make the running sum go down
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(n) space

```
For each i, sum nums[0..i] from scratch.
```

### APPROACH 2 — Optimal (prefix sum, one pass)   O(n) time, O(n) output (O(1) extra if in place)

```
runningSum[i] = runningSum[i - 1] + nums[i]. Each element reuses the previous total.
This IS the prefix-sum array (without the leading zero convention).

Dry run on [3, 1, 2, 10, 1]:
  i=0: 3
  i=1: 3 + 1 = 4
  i=2: 4 + 2 = 6
  i=3: 6 + 10 = 16
  i=4: 16 + 1 = 17
```

### Edge cases

```
- Empty -> []
- Single element -> itself
- Negatives can make the running sum go down
```

Full JavaScript solution with tests: [01_running_sum.js](../solutions/01_running_sum.js). Run it with `node 01_running_sum.js` from the solutions folder.

</details>

## Common mistakes

- Starting the loop at index 0 and adding `nums[-1]` (undefined), producing NaN.
- Allocating a new array when the in-place version is asked for (or vice versa).
- Using `reduce` that returns only the total instead of the running list.

## Related follow-ups

- [Range Sum Query - Immutable](02_range_sum_query_immutable.md) — use the running sums to answer ranges
- [Find Pivot Index](03_find_pivot_index.md) — left sum vs right sum
- [Minimum Value to Get Positive Step by Step Sum](10_minimum_value_positive_step_sum.md) — track the minimum running sum

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

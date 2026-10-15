# Contiguous Array

| | |
|---|---|
| **Topic** | Prefix Sums and Difference Arrays |
| **Difficulty** | Medium |
| **Pattern** | balance transform |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #525 — https://leetcode.com/problems/contiguous-array/ |
| **Solution file** | [07_contiguous_array.js](../solutions/07_contiguous_array.js) — open only after a real attempt |

## Problem

Given a binary array nums, return the length of the longest contiguous subarray with
an equal number of 0s and 1s.

## Examples

```
Input: [0, 1]            Output: 2
Input: [0, 1, 0]         Output: 2   Explanation: [0, 1] or [1, 0]
Input: [0, 0, 1, 0, 0, 0, 1, 1]   Output: 6   Explanation: indices 2..7 -> [1, 0, 0, 0, 1, 1] has three 0s and three 1s
```

## Constraints & clarifying questions

```
- Only 0s and 1s? (yes)
- Longest, not count? (longest)
- No valid subarray -> 0
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *balance transform* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. For each start, extend right tracking zeros and ones; record when equal.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (balance transform + prefix + first-index map)   O(n) time, O(n) space. Treat 0 as -1 and 1 as +1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- All zeros or all ones -> 0
- Whole array balanced -> n
- Empty -> 0
- Single element -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
For each start, extend right tracking zeros and ones; record when equal.
```

### APPROACH 2 — Optimal (balance transform + prefix + first-index map)   O(n) time, O(n) space

```
Treat 0 as -1 and 1 as +1. "Equal zeros and ones" becomes "sum equals 0".
Running balance: if the balance at index i equals the balance at an earlier index j,
then the subarray (j, i] has balance 0 -> equal counts. Store the FIRST index of each
balance value (longest answer), seeded with {0: -1}.
This is problem 06 with k = 0 after the transform.

Dry run on [0, 1, 0]:
  map {0:-1}
  i=0 (0 -> -1) balance -1, new -> map {0:-1, -1:0}
  i=1 (1 -> +1) balance 0, seen at -1 -> length 1 - (-1) = 2, best 2
  i=2 (0 -> -1) balance -1, seen at 0 -> length 2 - 0 = 2
  2
```

### Edge cases

```
- All zeros or all ones -> 0
- Whole array balanced -> n
- Empty -> 0
- Single element -> 0
```

Full JavaScript solution with tests: [07_contiguous_array.js](../solutions/07_contiguous_array.js). Run it with `node 07_contiguous_array.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting to map 0 to -1; without it, equal counts do not become a zero sum.
- Storing the latest index of a balance instead of the first.
- Seeding the map with `{0: 0}` instead of `{0: -1}`.

## Related follow-ups

- [Maximum Size Subarray Sum Equals k](06_maximum_size_subarray_sum_equals_k.md) — general target k
- Longest Well-Performing Interval (LeetCode #1124) — balance > 0 instead of = 0
- [Subarray Sum Equals K](05_subarray_sum_equals_k.md) — counting version

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

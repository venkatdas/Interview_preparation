# Sum of Subarray Minimums

| | |
|---|---|
| **Topic** | Monotonic Stacks and Queues |
| **Difficulty** | Medium |
| **Pattern** | contribution technique, strict/non-strict |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #907 — https://leetcode.com/problems/sum-of-subarray-minimums/ |
| **Solution file** | [03_sum_of_subarray_minimums.js](../solutions/03_sum_of_subarray_minimums.js) — open only after a real attempt |

## Problem

Return the sum of min(b) over every contiguous subarray b of arr, modulo 1e9+7.

## Examples

```
Input: [3,1,2,4]   Output: 17
  subarrays: [3],[1],[2],[4],[3,1],[1,2],[2,4],[3,1,2],[1,2,4],[3,1,2,4]
  mins:       3   1   2   4    1     1     2      1       1        1     -> 17
Input: [11,81,94,43,3]   Output: 444
```

## Constraints & clarifying questions

```
- n up to 3 * 10^4 -> O(n^2) is borderline; O(n) expected
- Values positive, up to 3 * 10^4; answer mod 1e9+7
- Duplicates: each subarray must be counted exactly once
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *contribution technique, strict/non-strict* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. For every start, extend the end while tracking the running min; add it each step.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Contribution technique with previous/next smaller)   O(n) time, O(n) space. Flip the question: instead of "min of each subarray", ask "for each element, how many subarrays is it the minimum of?" Element arr[i] is the min of every subarray that starts in (prevSmaller[i], i]  and ends in [i, nextSmaller[i]) so it contributes arr[i] * (i

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single element -> itself
- all equal [2,2,2] -> 2 * 6 subarrays = 12 (duplicate handling must be right)
- strictly increasing / decreasing
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
For every start, extend the end while tracking the running min; add it each step.
```

### APPROACH 2 — Optimal (Contribution technique with previous/next smaller)   O(n) time, O(n) space

```
Flip the question: instead of "min of each subarray", ask "for each element, how many
subarrays is it the minimum of?" Element arr[i] is the min of every subarray that
  starts in (prevSmaller[i], i]  and ends in [i, nextSmaller[i])
so it contributes arr[i] * (i - prevSmaller[i]) * (nextSmaller[i] - i).
Duplicates: use STRICT "<" on one side and "<=" on the other so a subarray with two equal
minimums is credited to exactly one of them (here: left uses <, right uses <=).

Dry run on [3,1,2,4]:
  prevSmaller (strict <):   [-1, -1, 1, 2]
  nextSmallerOrEqual:       [ 1,  4, 4, 4]
  i=0: 3 * (0-(-1)) * (1-0) = 3 * 1 * 1 = 3
  i=1: 1 * (1-(-1)) * (4-1) = 1 * 2 * 3 = 6
  i=2: 2 * (2-1) * (4-2)    = 2 * 1 * 2 = 4
  i=3: 4 * (3-2) * (4-3)    = 4 * 1 * 1 = 4
  total 17
```

### Edge cases

```
- single element -> itself
- all equal [2,2,2] -> 2 * 6 subarrays = 12 (duplicate handling must be right)
- strictly increasing / decreasing
```

Full JavaScript solution with tests: [03_sum_of_subarray_minimums.js](../solutions/03_sum_of_subarray_minimums.js). Run it with `node 03_sum_of_subarray_minimums.js` from the solutions folder.

</details>

## Common mistakes

- Counting subarrays twice when there are equal minimums (use strict on one side, non-strict on the other).
- Forgetting the modulo 10^9 + 7.
- Overflowing intermediate products in languages with fixed ints (in JS keep products below 2^53 or take modulo early).

## Related follow-ups

- Sum of Subarray Ranges (LeetCode #2104)
- [Largest Rectangle in Histogram](../03_Hard/04_largest_rectangle_in_histogram.md)
- [Online Stock Span](01_online_stock_span.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

# Maximum Sum Subarray of Size K

| | |
|---|---|
| **Topic** | Sliding Window |
| **Difficulty** | Easy |
| **Pattern** | fixed window |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Original exercise (classic fixed-size window warm-up) |
| **Solution file** | [02_max_sum_subarray_size_k.js](../solutions/02_max_sum_subarray_size_k.js) — open only after a real attempt |

## Problem

Given an array of positive integers and a number k, return the maximum sum of any
contiguous subarray of size k. Also return the start index of that subarray.

## Examples

```
Input: nums = [2, 1, 5, 1, 3, 2], k = 3   Output: { sum: 9, start: 2 }   Explanation: [5, 1, 3]
Input: nums = [2, 3, 4, 1, 5], k = 2      Output: { sum: 7, start: 1 }   Explanation: [3, 4]
```

## Constraints & clarifying questions

```
- k > nums.length? (return sum 0 / start -1; clarify)
- Positive only? (doesn't matter for a fixed window)
- If several windows tie, which start? (the first one)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *fixed window* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n * k) time, O(1) space. For every start, add up k elements.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (fixed window)   O(n) time, O(1) space. Same slide as problem 01, but written in the single-loop form that many people prefer: for right in 0..n-1: windowSum += nums[right] if right >= k - 1:                       (window is full) compare windowSum to best (start = right - k + 1) windowSum -= nums[r

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k === nums.length -> whole array, start 0
- k > nums.length -> no window
- k = 1 -> max element and its index
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * k) time, O(1) space

```
For every start, add up k elements.
```

### APPROACH 2 — Optimal (fixed window)   O(n) time, O(1) space

```
Same slide as problem 01, but written in the single-loop form that many people prefer:
  for right in 0..n-1:
    windowSum += nums[right]
    if right >= k - 1:                       (window is full)
      compare windowSum to best (start = right - k + 1)
      windowSum -= nums[right - k + 1]       (drop the leftmost before the next step)

Dry run on [2, 1, 5, 1, 3, 2], k = 3:
  right=0 sum 2        | right=1 sum 3 | right=2 sum 8 full, best 8 (start 0), drop 2 -> 6
  right=3 sum 7 full, best 8, drop 1 -> 6
  right=4 sum 9 full, best 9 (start 2), drop 5 -> 4
  right=5 sum 6 full, best 9, drop 1 -> 5
  { sum: 9, start: 2 }
```

### Edge cases

```
- k === nums.length -> whole array, start 0
- k > nums.length -> no window
- k = 1 -> max element and its index
```

Full JavaScript solution with tests: [02_max_sum_subarray_size_k.js](../solutions/02_max_sum_subarray_size_k.js). Run it with `node 02_max_sum_subarray_size_k.js` from the solutions folder.

</details>

## Common mistakes

- Not handling k greater than the array length (no valid window).
- Sliding the window before the first k elements are added, which drops an element too early.
- Starting `best` at 0 when all values can be negative.

## Related follow-ups

- [Maximum Average Subarray I](01_maximum_average_subarray.md) — the same window, report an average
- [Sliding Window Maximum](../03_Hard/12_sliding_window_maximum.md) — max element per window instead of the sum
- [Range Sum Query - Immutable](../../../08_Prefix_Sums_And_Difference_Arrays/03_Problems/01_Easy/02_range_sum_query_immutable.md) — prefix sums answer any window in O(1)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

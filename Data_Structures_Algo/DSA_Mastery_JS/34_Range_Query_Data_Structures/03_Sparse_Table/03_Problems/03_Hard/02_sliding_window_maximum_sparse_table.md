# Sliding Window Maximum, sparse table version

| | |
|---|---|
| **Topic** | Sparse Table (Range Minimum Query) |
| **Difficulty** | Hard |
| **Pattern** | fixed-size windows share one level |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #239 — https://leetcode.com/problems/sliding-window-maximum/ |
| **Solution file** | [02_sliding_window_maximum_sparse_table.js](../solutions/02_sliding_window_maximum_sparse_table.js) — open only after a real attempt |

## Problem

Given nums and a window size k, return the maximum of every contiguous window of size k,
from left to right.

## Examples

```
Input: nums = [1,3,-1,-3,5,3,6,7], k = 3   Output: [3,3,5,5,6,7]
Input: nums = [1], k = 1                   Output: [1]
```

## Constraints & clarifying questions

```
- 1 <= k <= n
- n up to 10^5 -> O(n * k) is too slow for big k
- The usual interview answer is a monotonic deque (O(n), see
  ../../18_Monotonic_Stacks_And_Queues/). The sparse table is an alternative that is easy to
  get right and also answers ARBITRARY range-max queries, not only fixed-size windows.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *fixed-size windows share one level* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n * k) time. For every window start, scan k elements.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Sparse table for range max)   O(n log n) build, O(1) per window. Every window [i, i + k - 1] is a range-max query.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k = 1 -> the array itself
- k = n -> single answer
- negative numbers, duplicates
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * k) time

```
For every window start, scan k elements.
```

### APPROACH 2 — Optimal (Sparse table for range max)   O(n log n) build, O(1) per window

```
Every window [i, i + k - 1] is a range-max query. All windows have the same length, so
the level is the same for every query: level = floor(log2 k).
answer[i] = max(table[level][i], table[level][i + k - 2^level]).

Dry run: nums = [1,3,-1,-3,5,3,6,7], k = 3 -> level = 1 (blocks of 2)
  table[1] = [3, 3, -1, 5, 5, 6, 7]
  window 0 [0..2]: max(table[1][0], table[1][1]) = max(3, 3) = 3
  window 1 [1..3]: max(3, -1) = 3
  window 2 [2..4]: max(-1, 5) = 5
  window 3 [3..5]: max(5, 5) = 5
  window 4 [4..6]: max(5, 6) = 6
  window 5 [5..7]: max(6, 7) = 7
```

### Edge cases

```
- k = 1 -> the array itself
- k = n -> single answer
- negative numbers, duplicates
```

Full JavaScript solution with tests: [02_sliding_window_maximum_sparse_table.js](../solutions/02_sliding_window_maximum_sparse_table.js). Run it with `node 02_sliding_window_maximum_sparse_table.js` from the solutions folder.

</details>

## Common mistakes

- Stopping one window early: there are `n - k + 1` windows, not `n - k`.
- Using O(n log n) memory for a problem that a monotonic deque solves in O(n) time and O(k) memory — mention the deque as the optimal answer.
- Building all levels when one level (`2^floor(log2 k)`) is enough for fixed-size windows.

## Related follow-ups

- [Monotonic deque](../../../../18_Monotonic_Stacks_And_Queues/README.md)
- [Range Minimum Queries, static](../02_Medium/01_range_min_queries_offline.md)
- Constrained Subsequence Sum (LeetCode #1425)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

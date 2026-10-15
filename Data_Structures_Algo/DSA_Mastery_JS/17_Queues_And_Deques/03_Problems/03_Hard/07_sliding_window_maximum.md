# Sliding Window Maximum

| | |
|---|---|
| **Topic** | Queues and Deques |
| **Difficulty** | Hard |
| **Pattern** | monotonic deque |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #239 — https://leetcode.com/problems/sliding-window-maximum/ |
| **Solution file** | [07_sliding_window_maximum.js](../solutions/07_sliding_window_maximum.js) — open only after a real attempt |

## Problem

Given an array nums and a window size k, return the maximum of every
contiguous window of size k as the window slides from left to right.

## Examples

```
Input: nums = [1,3,-1,-3,5,3,6,7], k = 3   Output: [3,3,5,5,6,7]
  [1 3 -1] -3 5 3 6 7  -> 3
  1 [3 -1 -3] 5 3 6 7  -> 3
  1 3 [-1 -3 5] 3 6 7  -> 5 ...
Input: nums = [1], k = 1                   Output: [1]
```

## Constraints & clarifying questions

```
- 1 <= k <= nums.length? (yes)
- Negatives allowed? (yes)
- Need O(n)? (yes - the O(n*k) brute force is too slow for 10^5)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *monotonic deque* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n*k) time, O(1) extra space. For every window start, scan the k elements for the max.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (monotonic decreasing deque of indices)   O(n) time, O(k) space. Keep a deque of INDICES whose values are decreasing from front to back.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k = 1 -> the array itself
- k = n -> single max
- all equal values (use <= when popping so duplicates don't pile up)
- decreasing array (deque fills, front expires each step)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n*k) time, O(1) extra space

```
For every window start, scan the k elements for the max.
```

### APPROACH 2 — Optimal (monotonic decreasing deque of indices)   O(n) time, O(k) space

```
Keep a deque of INDICES whose values are decreasing from front to back.
Invariant: the front is the index of the current window's maximum.
For each index i:
  1. pop from the BACK while nums[back] <= nums[i]
     (a smaller element that is also OLDER can never be the max again)
  2. push i at the back
  3. pop from the FRONT if it has left the window (front <= i - k)
  4. once i >= k - 1, record nums[front]
Every index is pushed once and popped at most once -> O(n).

Dry run on [1,3,-1,-3,5,3,6,7], k=3 (deque shows values for readability):
  i=0 (1)   deque [1]
  i=1 (3)   3>=1 pop -> [3]
  i=2 (-1)  deque [3,-1]                 record 3
  i=3 (-3)  deque [3,-1,-3] ; front(idx 1) still in window   record 3
  i=4 (5)   pops -3,-1,3 -> [5]          record 5
  i=5 (3)   deque [5,3]                  record 5
  i=6 (6)   pops 3,5 -> [6]              record 6
  i=7 (7)   pops 6 -> [7]                record 7
```

### Edge cases

```
- k = 1 -> the array itself
- k = n -> single max
- all equal values (use <= when popping so duplicates don't pile up)
- decreasing array (deque fills, front expires each step)
```

Full JavaScript solution with tests: [07_sliding_window_maximum.js](../solutions/07_sliding_window_maximum.js). Run it with `node 07_sliding_window_maximum.js` from the solutions folder.

</details>

## Common mistakes

- Storing values instead of indices, so you cannot tell when the front has left the window.
- Popping from the back with `<` and keeping equal values (correct but slower; know why `<=` is fine).
- Emitting output before the first full window (`i >= k - 1`).

## Related follow-ups

- [Shortest Subarray with Sum at Least K](08_shortest_subarray_sum_at_least_k.md)
- [Jump Game VI](../../../18_Monotonic_Stacks_And_Queues/03_Problems/02_Medium/06_jump_game_vi.md) (18_Monotonic_Stacks_And_Queues)
- [Sliding Window Median](../../../19_Heaps_And_Priority_Queues/03_Problems/03_Hard/16_sliding_window_median.md) (19_Heaps_And_Priority_Queues)
- Longest Continuous Subarray With Absolute Diff ≤ Limit (LeetCode #1438)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

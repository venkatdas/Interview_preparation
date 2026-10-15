# Sliding Window Maximum

| | |
|---|---|
| **Topic** | Sliding Window |
| **Difficulty** | Hard |
| **Pattern** | monotonic deque |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #239 — https://leetcode.com/problems/sliding-window-maximum/ |
| **Solution file** | [12_sliding_window_maximum.js](../solutions/12_sliding_window_maximum.js) — open only after a real attempt |

## Problem

Given an integer array nums and a window size k, return an array with the maximum of
every window of size k as it slides from left to right.

## Examples

```
Input: nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3   Output: [3, 3, 5, 5, 6, 7]
Input: nums = [1], k = 1                          Output: [1]
```

## Constraints & clarifying questions

```
- 1 <= k <= n? (yes)
- Negative numbers? (yes; doesn't matter)
- Need O(n)? (the follow-up; a heap gives O(n log k))
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

**Start simple.** APPROACH 1 — Brute force   O(n * k) time, O(1) space. For each window, scan its k elements for the max.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (monotonic deque of indices)   O(n) time, O(k) space. Keep a deque of INDICES whose values are strictly decreasing from front to back.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k = 1 -> the array itself
- k = n -> single max
- Strictly decreasing input -> each window's max is its first element
- Duplicates: use <= when popping so equal older values are dropped
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * k) time, O(1) space

```
For each window, scan its k elements for the max.
```

### APPROACH 2 — Optimal (monotonic deque of indices)   O(n) time, O(k) space

```
Keep a deque of INDICES whose values are strictly decreasing from front to back.
The front is always the max of the current window.
For each right:
  1. If the front index fell out of the window (front <= right - k), pop it from the front.
  2. While the back value <= nums[right], pop from the back. Those elements are smaller
     AND older than nums[right], so they can never be a window max again.
  3. Push right.
  4. If right >= k - 1, record nums[front].
Each index is pushed once and popped at most once -> O(n) total.

Dry run on [1, 3, -1, -3, 5, 3, 6, 7], k = 3 (deque shows values for readability):
  r=0 (1):  deque [1]
  r=1 (3):  pop 1 (<= 3)      deque [3]
  r=2 (-1): deque [3, -1]                  record 3
  r=3 (-3): deque [3, -1, -3]              record 3
  r=4 (5):  front idx 1 > 4-3=1? no, 1 <= 1 -> pop front; pop -3, -1 (<= 5)  deque [5]  record 5
  r=5 (3):  deque [5, 3]                   record 5
  r=6 (6):  pop 3, 5          deque [6]    record 6
  r=7 (7):  pop 6             deque [7]    record 7
  [3, 3, 5, 5, 6, 7]

Implementation note: JS arrays have O(n) shift(). We use a head index into an array
so both ends are O(1) (a classic trick; see 17_Queues_And_Deques for a real Deque class).
```

### Edge cases

```
- k = 1 -> the array itself
- k = n -> single max
- Strictly decreasing input -> each window's max is its first element
- Duplicates: use <= when popping so equal older values are dropped
```

Full JavaScript solution with tests: [12_sliding_window_maximum.js](../solutions/12_sliding_window_maximum.js). Run it with `node 12_sliding_window_maximum.js` from the solutions folder.

</details>

## Common mistakes

- Storing values instead of indices in the deque, so you cannot tell when the front left the window.
- Popping from the back with `<` instead of `<=` is fine, but popping from the *front* to remove smaller values is wrong.
- Recording the answer before the first full window (i < k - 1).

## Related follow-ups

- [Sliding Window Maximum (Queues)](../../../17_Queues_And_Deques/03_Problems/03_Hard/07_sliding_window_maximum.md) — the deque in the queues topic
- [Shortest Subarray with Sum at Least K](../../../17_Queues_And_Deques/03_Problems/03_Hard/08_shortest_subarray_sum_at_least_k.md) — monotonic deque over prefix sums
- [Jump Game VI](../../../18_Monotonic_Stacks_And_Queues/03_Problems/02_Medium/06_jump_game_vi.md) — DP sped up by a window max

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

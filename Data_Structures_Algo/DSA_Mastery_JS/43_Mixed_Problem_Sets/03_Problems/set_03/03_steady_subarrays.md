# Steady Subarrays

| | |
|---|---|
| **Set** | [Mixed Set 03](README.md) — problem 03 of 5 |
| **Difficulty** | Medium |
| **Time box** | 25 minutes (then open Hint 1) |
| **Source** | Original exercise |
| **Solution file** | [03_steady_subarrays.js](solutions/03_steady_subarrays.js) — open only after a real attempt |

> The topic is hidden on purpose. Part of the skill being trained is recognizing the pattern on your own.

## Problem

A sensor reports readings `nums`. A contiguous non-empty stretch of readings is
"steady" if (max - min) within it is at most `limit`. Return the number of steady
subarrays.

## Examples

```
Input: nums = [1, 3, 2], limit = 1      Output: 4   Explanation: [1], [3], [2], [3,2]
Input: nums = [5, 5, 5], limit = 0      Output: 6   Explanation: every subarray
Input: nums = [], limit = 3             Output: 0
```

## Constraints & clarifying questions

```
- Up to 10^5 readings, so O(n^2) is too slow. limit >= 0. Values may be negative.
- Answer can be about n^2 / 2 (fits in a JS number).
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 25 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1 — which patterns?</summary>

**Pattern.** Sliding window + two monotonic deques (window max and window min). See [Sliding Window](../../../07_Sliding_Window/README.md) and [Monotonic Stacks & Queues](../../../18_Monotonic_Stacks_And_Queues/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Brute force: each start, extend while max − min ≤ limit.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Steady windows are closed under shrinking, so for each right end the valid starts form a range [left, right]. Two deques give the window max and min in O(1).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty -> 0
- limit huge -> n(n+1)/2
- limit 0 -> counts runs of equal values
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
For every start, extend the end while tracking running max/min; count while steady.
```

### APPROACH 2 — Optimal (sliding window + two monotonic deques)   O(n) time, O(n) space

```
If a window is steady, every smaller window inside it is too, so for each right end the
steady starts form a range [left, right]. Move right forward; keep a decreasing deque of
indices (front = window max) and an increasing deque (front = window min). While
max - min > limit, advance left and drop deque fronts that fell out. Then add
right - left + 1 (all steady subarrays ending at right).

Dry run on [1, 3, 2], limit = 1:
  r=0: maxQ [0] minQ [0]    window [1]       +1  total 1
  r=1: maxQ [1] minQ [0,1]  max 3 - min 1 = 2 > 1 -> left=1, minQ [1]   +1  total 2
  r=2: maxQ [1,2] minQ [2]  3 - 2 = 1 ok     +2 ([3,2],[2])  total 4
  answer 4
```

### Edge cases

```
- empty -> 0
- limit huge -> n(n+1)/2
- limit 0 -> counts runs of equal values
```

### Common mistakes

```
- Storing values instead of indices in the deques: you cannot tell when they leave the window.
- Using strict < / > when maintaining deques: duplicates are dropped too early or too late
  (either works if you pop fronts by index, as here).
```

Full JavaScript solution with tests: [03_steady_subarrays.js](solutions/03_steady_subarrays.js). Run it with `node solutions/03_steady_subarrays.js` from this folder.

</details>

## Related follow-ups

- Longest steady subarray (LeetCode #1438)
- Count subarrays where max − min is exactly limit (count(≤limit) − count(≤limit−1))
- Data arrives as a stream

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down which pattern you did NOT see at first. That is the one to drill.
- Fill in the set's reflection checklist in [QUIZ.md](../../04_Interview_And_Assessment/QUIZ.md).
- Re-solve from scratch in 3 days, then in 1 week.

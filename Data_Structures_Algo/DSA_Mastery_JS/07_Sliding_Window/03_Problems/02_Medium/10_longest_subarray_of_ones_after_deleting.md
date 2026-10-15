# Longest Subarray of 1's After Deleting One Element

| | |
|---|---|
| **Topic** | Sliding Window |
| **Difficulty** | Medium |
| **Pattern** | variable, budget of 1 |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1493 — https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element/ |
| **Solution file** | [10_longest_subarray_of_ones_after_deleting.js](../solutions/10_longest_subarray_of_ones_after_deleting.js) — open only after a real attempt |

## Problem

Given a binary array, you MUST delete exactly one element. Return the length of the
longest subarray of 1s in the resulting array. (Return 0 if no such subarray exists.)

## Examples

```
Input: [1, 1, 0, 1]            Output: 3   Explanation: delete the 0 -> [1, 1, 1]
Input: [0, 1, 1, 1, 0, 1, 1, 0, 1]   Output: 5   Explanation: delete nums[4] -> 1,1,1,1,1
Input: [1, 1, 1]               Output: 2   Explanation: must delete one 1
```

## Constraints & clarifying questions

```
- Must delete exactly one, even if all are 1s? (yes -> answer is n - 1 for all ones)
- Only 0/1? (yes)
- All zeros? (0)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *variable, budget of 1* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. Try deleting each index, then scan for the longest run of 1s.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (window with at most ONE zero, answer = window length - 1)   O(n) time, O(1) space. This is Max Consecutive Ones III with k = 1, except the deleted element is always removed from the count: a window [left, right] with at most one zero gives a run of (right - left + 1) - 1 ones after deleting that zero (or any 1 if there is no zero).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- All ones -> n - 1
- All zeros -> 0
- Single element -> 0
- Two zeros adjacent: [1, 0, 0, 1] -> 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
Try deleting each index, then scan for the longest run of 1s.
```

### APPROACH 2 — Optimal (window with at most ONE zero, answer = window length - 1)   O(n) time, O(1) space

```
This is Max Consecutive Ones III with k = 1, except the deleted element is always
removed from the count: a window [left, right] with at most one zero gives a run of
(right - left + 1) - 1 ones after deleting that zero (or any 1 if there is no zero).
  expand: if 0, zeros++
  while zeros > 1: shrink
  best = max(best, right - left)        (window length minus one)

Dry run on [1, 1, 0, 1]:
  r=0 len 1 -> best 0 | r=1 len 2 -> best 1 | r=2 zero(1) len 3 -> best 2 | r=3 len 4 -> best 3
  3
```

### Edge cases

```
- All ones -> n - 1
- All zeros -> 0
- Single element -> 0
- Two zeros adjacent: [1, 0, 0, 1] -> 1
```

Full JavaScript solution with tests: [10_longest_subarray_of_ones_after_deleting.js](../solutions/10_longest_subarray_of_ones_after_deleting.js). Run it with `node 10_longest_subarray_of_ones_after_deleting.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting that one element *must* be deleted, so an all-ones array gives n - 1, not n.
- Returning the window length instead of window length minus one.
- Allowing two zeros in the window.

## Related follow-ups

- [Max Consecutive Ones III](09_max_consecutive_ones_iii.md) — up to k flips
- [Fruit Into Baskets](08_fruit_into_baskets.md) — the same at-most-budget window
- Max Consecutive Ones (LeetCode #485) — no deletions at all

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

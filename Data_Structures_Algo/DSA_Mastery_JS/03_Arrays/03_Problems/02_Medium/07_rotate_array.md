# Rotate Array

| | |
|---|---|
| **Topic** | Arrays |
| **Difficulty** | Medium |
| **Pattern** | reversal |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #189 — https://leetcode.com/problems/rotate-array/ |
| **Solution file** | [07_rotate_array.js](../solutions/07_rotate_array.js) — open only after a real attempt |

## Problem

Rotate an integer array to the RIGHT by k steps, in place. k is non-negative.

## Examples

```
Input: [1, 2, 3, 4, 5, 6, 7], k = 3   Output: [5, 6, 7, 1, 2, 3, 4]
Input: [-1, -100, 3, 99], k = 2       Output: [3, 99, -1, -100]
```

## Constraints & clarifying questions

```
- Can k be larger than the array length? (yes -> use k % n)
- Right or left rotation? (right; left by k is right by n - k)
- In place with O(1) extra space? (that is the follow-up; a copy-based O(n) space answer is a fine first step)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *reversal* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n * k) time, O(1) space. Rotate by one step k times: save the last element, shift everything right by one, put the saved element at index 0.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (three reversals)   O(n) time, O(1) space. Rotating right by k means the last k elements move to the front.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k === 0 or k === n -> unchanged
- k > n -> k % n
- Single element / empty array
- Two elements with k = 1 -> swapped
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n * k) time, O(1) space

```
Rotate by one step k times: save the last element, shift everything right by one,
put the saved element at index 0. Each step is O(n).
(Alternative: build a new array with result[(i + k) % n] = nums[i], O(n) time, O(n) space.)
```

### APPROACH 2 — Optimal (three reversals)   O(n) time, O(1) space

```
Rotating right by k means the last k elements move to the front.
  1. reverse the whole array      -> last k are now first, but backwards
  2. reverse the first k elements -> fix their order
  3. reverse the remaining n - k  -> fix their order

Dry run on [1, 2, 3, 4, 5, 6, 7], k = 3:
  reverse all      -> [7, 6, 5, 4, 3, 2, 1]
  reverse [0..2]   -> [5, 6, 7, 4, 3, 2, 1]
  reverse [3..6]   -> [5, 6, 7, 1, 2, 3, 4]
```

### Edge cases

```
- k === 0 or k === n -> unchanged
- k > n -> k % n
- Single element / empty array
- Two elements with k = 1 -> swapped
```

Full JavaScript solution with tests: [07_rotate_array.js](../solutions/07_rotate_array.js). Run it with `node 07_rotate_array.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting `k = k % n`, so k larger than the length rotates too far or crashes the reverse indices.
- Rotating one step at a time k times, which is O(n·k) and times out.
- Reassigning `nums = [...]` inside the function; the caller never sees it because the array must be changed in place.

## Related follow-ups

- [Rotate Image](../../../09_Matrix_And_Multidimensional_Arrays/03_Problems/02_Medium/06_rotate_image.md) — the reversal trick in 2D
- [Reverse Words in a String](../../../04_Strings/03_Problems/02_Medium/10_reverse_words_in_a_string.md) — reverse all, then reverse parts
- Rotate List (LeetCode #61) — the same rotation on a linked list

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

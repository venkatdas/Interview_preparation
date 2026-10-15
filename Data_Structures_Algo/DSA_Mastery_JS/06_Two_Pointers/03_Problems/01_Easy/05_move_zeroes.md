# Move Zeroes

| | |
|---|---|
| **Topic** | Two Pointers |
| **Difficulty** | Easy |
| **Pattern** | read / write |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #283 — https://leetcode.com/problems/move-zeroes/ |
| **Solution file** | [05_move_zeroes.js](../solutions/05_move_zeroes.js) — open only after a real attempt |

## Problem

Given an integer array, move all 0s to the end while keeping the relative order of
the non-zero elements. Do it in place.

## Examples

```
Input: [0, 1, 0, 3, 12]   Output: [1, 3, 12, 0, 0]
Input: [0]                Output: [0]
```

## Constraints & clarifying questions

```
- In place with O(1) extra space? (yes)
- Must the order of non-zeros be preserved? (yes -> rules out a partition/swap-from-end approach)
- Minimise the number of writes? (follow-up: the swap version only writes when needed)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *read / write* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n) time, O(n) space. Copy the non-zeros into a new array, pad with zeros, copy back.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (read / write)   O(n) time, O(1) space. Pass 1: compact every non-zero to the front using the read/write pattern.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- No zeros -> unchanged
- All zeros -> unchanged
- Zeros already at the end
- Single element
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n) time, O(n) space

```
Copy the non-zeros into a new array, pad with zeros, copy back. Works, but uses O(n) space.
```

### APPROACH 2 — Optimal (read / write)   O(n) time, O(1) space

```
Pass 1: compact every non-zero to the front using the read/write pattern.
Pass 2: fill from `write` to the end with 0.

Variant (fewer writes): swap nums[write] and nums[read] whenever nums[read] != 0.
Since write only lags behind read when zeros were skipped, nums[write] is always 0 at
the moment of a swap, so the zero "bubbles" forward without a second pass.

Dry run on [0, 1, 0, 3, 12] (swap variant):
  read=0 0  skip                    write=0
  read=1 1  swap(0,1) -> [1,0,0,3,12] write=1
  read=2 0  skip
  read=3 3  swap(1,3) -> [1,3,0,0,12] write=2
  read=4 12 swap(2,4) -> [1,3,12,0,0] write=3
```

### Edge cases

```
- No zeros -> unchanged
- All zeros -> unchanged
- Zeros already at the end
- Single element
```

Full JavaScript solution with tests: [05_move_zeroes.js](../solutions/05_move_zeroes.js). Run it with `node 05_move_zeroes.js` from the solutions folder.

</details>

## Common mistakes

- Counting zeros, filtering them out, and pushing them back; this allocates a new array.
- Using a swap that runs even when `read === write`, then assuming that is a bug; it is harmless.
- Changing the relative order of the non-zero elements (for example, swapping from both ends).

## Related follow-ups

- [Move Zeroes (Arrays)](../../../03_Arrays/03_Problems/01_Easy/05_move_zeroes.md) — the same problem in the arrays topic
- [Remove Element](04_remove_element.md) — the write-pointer template
- [Sort Colors](../02_Medium/16_sort_colors.md) — three groups instead of two

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

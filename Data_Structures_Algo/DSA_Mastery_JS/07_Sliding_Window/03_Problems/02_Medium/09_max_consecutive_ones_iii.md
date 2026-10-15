# Max Consecutive Ones III

| | |
|---|---|
| **Topic** | Sliding Window |
| **Difficulty** | Medium |
| **Pattern** | variable, budget of k |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1004 — https://leetcode.com/problems/max-consecutive-ones-iii/ |
| **Solution file** | [09_max_consecutive_ones_iii.js](../solutions/09_max_consecutive_ones_iii.js) — open only after a real attempt |

## Problem

Given a binary array nums and an integer k, you may flip at most k zeros to ones.
Return the length of the longest contiguous run of 1s you can get.

## Examples

```
Input: nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2   Output: 6   Explanation: flip the two 0s before the 1111
Input: nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k = 3   Output: 10
```

## Constraints & clarifying questions

```
- Only 0s and 1s? (yes)
- k = 0 allowed? (yes -> longest existing run of 1s)
- k >= number of zeros? (whole array)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *variable, budget of k* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. For each start, extend right counting zeros; stop when zeros > k.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (variable window with a zero budget)   O(n) time, O(1) space. Reframe: longest window containing AT MOST k zeros.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- All ones -> n
- All zeros with k < n -> k
- k = 0 -> longest natural run
- Empty -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
For each start, extend right counting zeros; stop when zeros > k.
```

### APPROACH 2 — Optimal (variable window with a zero budget)   O(n) time, O(1) space

```
Reframe: longest window containing AT MOST k zeros.
  expand: if nums[right] === 0, zeros++
  while zeros > k: if nums[left] === 0, zeros--; left++
  record right - left + 1
Monotonic: adding elements can only add zeros; removing can only remove them.

Dry run on [1,1,1,0,0,0,1,1,1,1,0], k = 2:
  r=0..2 ones, len 3 | r=3 zero(1) len 4 | r=4 zero(2) len 5
  r=5 zero(3) > 2 -> shrink: drop 1,1,1 (left=3), drop 0 (zeros 2, left=4) len 2
  r=6..9 ones, len grows to 6 (window [4..9] = 0,0,1,1,1,1)
  r=10 zero(3) -> drop nums[4]=0 (zeros 2, left=5) len 6
  best 6
```

### Edge cases

```
- All ones -> n
- All zeros with k < n -> k
- k = 0 -> longest natural run
- Empty -> 0
```

Full JavaScript solution with tests: [09_max_consecutive_ones_iii.js](../solutions/09_max_consecutive_ones_iii.js). Run it with `node 09_max_consecutive_ones_iii.js` from the solutions folder.

</details>

## Common mistakes

- Actually flipping zeros in the array; just count zeros in the window.
- Decrementing the zero count when *any* element leaves, not only when a zero leaves.
- Handling k = 0 as a special case; the general window already does it.

## Related follow-ups

- [Longest Subarray of 1's After Deleting One Element](10_longest_subarray_of_ones_after_deleting.md) — k = 1 with a mandatory deletion
- [Longest Repeating Character Replacement](04_longest_repeating_character_replacement.md) — the multi-letter version
- Max Consecutive Ones II (LeetCode #487) — at most one flip

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

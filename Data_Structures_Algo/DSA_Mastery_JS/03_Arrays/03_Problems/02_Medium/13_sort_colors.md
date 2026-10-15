# Sort Colors

| | |
|---|---|
| **Topic** | Arrays |
| **Difficulty** | Medium |
| **Pattern** | Dutch national flag |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #75 — https://leetcode.com/problems/sort-colors/ |
| **Solution file** | [13_sort_colors.js](../solutions/13_sort_colors.js) — open only after a real attempt |

## Problem

An array holds only the values 0, 1 and 2 (red, white, blue). Sort it in place so
that all 0s come first, then all 1s, then all 2s. Do not use the library sort.

## Examples

```
Input: [2, 0, 2, 1, 1, 0]   Output: [0, 0, 1, 1, 2, 2]
Input: [2, 0, 1]            Output: [0, 1, 2]
```

## Constraints & clarifying questions

```
- Only the three values 0, 1, 2? (yes)
- One pass and O(1) space? (that is the follow-up; counting sort is two passes)
- Stable sort needed? (no, values are indistinguishable)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Dutch national flag* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (counting sort)   O(n) time, O(1) space, TWO passes. Count how many 0s, 1s and 2s.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Dutch national flag, three pointers)   O(n) time, O(1) space, ONE pass. Keep three regions: [0 ..

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Already sorted
- All the same value
- Single element / empty
- Only two of the three values present
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (counting sort)   O(n) time, O(1) space, TWO passes

```
Count how many 0s, 1s and 2s. Then overwrite the array: that many 0s, then 1s, then 2s.
Already linear, but it is two passes and does not generalize to "partition around a pivot".
```

### APPROACH 2 — Optimal (Dutch national flag, three pointers)   O(n) time, O(1) space, ONE pass

```
Keep three regions:
  [0 .. low-1]   all 0s
  [low .. mid-1] all 1s
  [mid .. high]  unknown
  [high+1 .. n-1] all 2s
Look at nums[mid]:
  0 -> swap with nums[low], low++, mid++  (the swapped-in value is a known 1 or the same 0)
  1 -> mid++
  2 -> swap with nums[high], high--       (do NOT move mid: the swapped-in value is unknown)
Stop when mid > high.

Dry run on [2, 0, 2, 1, 1, 0]:
  low=0 mid=0 high=5: 2 -> swap(0,5) [0,0,2,1,1,2] high=4
  low=0 mid=0 high=4: 0 -> swap(0,0) low=1 mid=1
  low=1 mid=1 high=4: 0 -> swap(1,1) low=2 mid=2
  low=2 mid=2 high=4: 2 -> swap(2,4) [0,0,1,1,2,2] high=3
  low=2 mid=2 high=3: 1 -> mid=3
  low=2 mid=3 high=3: 1 -> mid=4
  mid > high -> done: [0,0,1,1,2,2]
```

### Edge cases

```
- Already sorted
- All the same value
- Single element / empty
- Only two of the three values present
```

Full JavaScript solution with tests: [13_sort_colors.js](../solutions/13_sort_colors.js). Run it with `node 13_sort_colors.js` from the solutions folder.

</details>

## Common mistakes

- Advancing `mid` after swapping with `high`; the value swapped in from the right has not been examined yet.
- Using `mid < high` instead of `mid <= high` as the loop condition, which leaves the last element unchecked.
- Calling `nums.sort()` when the point of the problem is a one-pass partition.

## Related follow-ups

- [Sort Colors (Two Pointers)](../../../06_Two_Pointers/03_Problems/02_Medium/16_sort_colors.md) — the same Dutch national flag partition
- [Sort Colors (Sorting)](../../../11_Sorting/03_Problems/02_Medium/02_sort_colors.md) — counting sort view
- [Move Zeroes](../01_Easy/05_move_zeroes.md) — the two-way partition warm-up

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

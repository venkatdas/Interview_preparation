# Sort Colors

| | |
|---|---|
| **Topic** | Two Pointers |
| **Difficulty** | Medium |
| **Pattern** | Dutch flag partition |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #75 — https://leetcode.com/problems/sort-colors/ |
| **Solution file** | [16_sort_colors.js](../solutions/16_sort_colors.js) — open only after a real attempt |

## Problem

Given an array with values 0, 1 and 2 (red, white, blue), sort it in place so that
all 0s come first, then 1s, then 2s. Do NOT use the library sort. One pass, O(1) space.

## Examples

```
Input: [2, 0, 2, 1, 1, 0]   Output: [0, 0, 1, 1, 2, 2]
Input: [2, 0, 1]            Output: [0, 1, 2]
```

## Constraints & clarifying questions

```
- Only values 0, 1, 2? (yes)
- One pass required? (follow-up: yes, that is the Dutch national flag algorithm)
- In place? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Dutch flag partition* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (counting sort, two passes)   O(n) time, O(1) space. Count the 0s, 1s and 2s, then overwrite the array with that many of each.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Dutch national flag, three pointers, one pass)   O(n) time, O(1) space. Maintain three regions with pointers low, mid, high: [0, low)      all 0s [low, mid)    all 1s [mid, high]   unknown (mid scans this) (high, n)     all 2s Look at nums[mid]: 0 -> swap with nums[low], low++, mid++ (the swapped-in element came from the 1s region

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Already sorted
- All one value
- Single element / empty
- No 1s at all: [2, 0, 2, 0]
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (counting sort, two passes)   O(n) time, O(1) space

```
Count the 0s, 1s and 2s, then overwrite the array with that many of each.
Already O(n), but two passes and it only works because the values are tiny.
```

### APPROACH 2 — Optimal (Dutch national flag, three pointers, one pass)   O(n) time, O(1) space

```
Maintain three regions with pointers low, mid, high:
  [0, low)      all 0s
  [low, mid)    all 1s
  [mid, high]   unknown (mid scans this)
  (high, n)     all 2s
Look at nums[mid]:
  0 -> swap with nums[low], low++, mid++ (the swapped-in element came from the 1s region or is mid itself, so it's known)
  1 -> mid++
  2 -> swap with nums[high], high-- (do NOT move mid: the swapped-in element is unknown)
Stop when mid > high.

Dry run on [2, 0, 2, 1, 1, 0]:
  low=0 mid=0 high=5: nums[0]=2 -> swap with nums[5]: [0,0,2,1,1,2] high=4
  mid=0: 0 -> swap(low=0,mid=0) no-op, low=1 mid=1
  mid=1: 0 -> swap(1,1), low=2 mid=2
  mid=2: 2 -> swap with nums[4]: [0,0,1,1,2,2] high=3
  mid=2: 1 -> mid=3
  mid=3: 1 -> mid=4 > high=3 stop
  [0, 0, 1, 1, 2, 2]
```

### Edge cases

```
- Already sorted
- All one value
- Single element / empty
- No 1s at all: [2, 0, 2, 0]
```

Full JavaScript solution with tests: [16_sort_colors.js](../solutions/16_sort_colors.js). Run it with `node 16_sort_colors.js` from the solutions folder.

</details>

## Common mistakes

- Incrementing `mid` after a swap with `high`.
- Loop condition `mid < high` instead of `mid <= high`.
- Using two passes (counting sort) when the interviewer asks for one pass.

## Related follow-ups

- [Sort Colors (Arrays)](../../../03_Arrays/03_Problems/02_Medium/13_sort_colors.md) — the same problem in the arrays topic
- [Sort Colors (Sorting)](../../../11_Sorting/03_Problems/02_Medium/02_sort_colors.md) — the counting-sort angle
- [Wiggle Sort II](../../../11_Sorting/03_Problems/02_Medium/11_wiggle_sort_ii.md) — three-way partition with virtual indexing

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

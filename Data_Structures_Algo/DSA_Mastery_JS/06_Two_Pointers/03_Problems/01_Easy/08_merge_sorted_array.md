# Merge Sorted Array

| | |
|---|---|
| **Topic** | Two Pointers |
| **Difficulty** | Easy |
| **Pattern** | two arrays, fill from back |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #88 — https://leetcode.com/problems/merge-sorted-array/ |
| **Solution file** | [08_merge_sorted_array.js](../solutions/08_merge_sorted_array.js) — open only after a real attempt |

## Problem

nums1 has length m + n: the first m elements are sorted values, the last n are zeros
(empty space). nums2 has n sorted values. Merge nums2 into nums1 IN PLACE so nums1 is sorted.

## Examples

```
Input: nums1 = [1, 2, 3, 0, 0, 0], m = 3, nums2 = [2, 5, 6], n = 3
Output: nums1 = [1, 2, 2, 3, 5, 6]
Input: nums1 = [1], m = 1, nums2 = [], n = 0   Output: [1]
Input: nums1 = [0], m = 0, nums2 = [1], n = 1  Output: [1]
```

## Constraints & clarifying questions

```
- Is the spare room guaranteed to be exactly n slots at the END of nums1? (yes)
- In place, O(1) extra space? (yes)
- Duplicates across the arrays? (fine)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *two arrays, fill from back* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O((m+n) log(m+n)) time, O(1) space. Copy nums2 into the empty slots and sort nums1.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (two pointers, fill from the BACK)   O(m + n) time, O(1) space. Merging from the front would overwrite nums1 values we haven't used yet.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 0 -> nothing to do
- m = 0 -> copy nums2 over entirely
- all of nums2 smaller than all of nums1 -> nums1 values shift to the end
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O((m+n) log(m+n)) time, O(1) space

```
Copy nums2 into the empty slots and sort nums1. Ignores that both halves are sorted.
```

### APPROACH 2 — Optimal (two pointers, fill from the BACK)   O(m + n) time, O(1) space

```
Merging from the front would overwrite nums1 values we haven't used yet.
The empty space is at the END, so fill from the end: compare the largest remaining
of each array and place the bigger one at position write = m + n - 1, moving down.
Stop when nums2 is exhausted: any leftover nums1 values are already in place.

Dry run on nums1 = [1, 2, 3, _, _, _], nums2 = [2, 5, 6]:
  i=2 (3) j=2 (6) write=5: 6 bigger -> nums1[5]=6, j=1
  i=2 (3) j=1 (5) write=4: 5 bigger -> nums1[4]=5, j=0
  i=2 (3) j=0 (2) write=3: 3 bigger -> nums1[3]=3, i=1
  i=1 (2) j=0 (2) write=2: tie -> take nums2 (either works) nums1[2]=2, j=-1
  j < 0 -> stop. nums1 = [1, 2, 2, 3, 5, 6]
```

### Edge cases

```
- n = 0 -> nothing to do
- m = 0 -> copy nums2 over entirely
- all of nums2 smaller than all of nums1 -> nums1 values shift to the end
```

Full JavaScript solution with tests: [08_merge_sorted_array.js](../solutions/08_merge_sorted_array.js). Run it with `node 08_merge_sorted_array.js` from the solutions folder.

</details>

## Common mistakes

- Merging from the front and overwriting nums1 values that are still needed.
- Forgetting to copy the leftover nums2 elements when nums1 runs out first.
- Treating the trailing zeros in nums1 as real values.

## Related follow-ups

- [Merge Sorted Array (Arrays)](../../../03_Arrays/03_Problems/01_Easy/09_merge_sorted_array.md) — the same problem in the arrays topic
- [Merge Two Sorted Lists](../../../15_Linked_Lists/03_Problems/01_Easy/02_merge_two_sorted_lists.md) — merging linked lists
- [Squares of a Sorted Array](07_squares_of_sorted_array.md) — another fill-from-the-back problem

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

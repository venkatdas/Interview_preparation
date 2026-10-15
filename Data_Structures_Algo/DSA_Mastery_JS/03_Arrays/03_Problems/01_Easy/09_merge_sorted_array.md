# Merge Sorted Array

| | |
|---|---|
| **Topic** | Arrays |
| **Difficulty** | Easy |
| **Pattern** | fill from the back |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #88 — https://leetcode.com/problems/merge-sorted-array/ |
| **Solution file** | [09_merge_sorted_array.js](../solutions/09_merge_sorted_array.js) — open only after a real attempt |

## Problem

nums1 has length m + n: the first m slots hold sorted values, the last n slots are
zeros (free space). nums2 has n sorted values. Merge nums2 INTO nums1 so that nums1
is sorted. Do it in place.

## Examples

```
Input: nums1 = [1, 2, 3, 0, 0, 0], m = 3, nums2 = [2, 5, 6], n = 3   Output: [1, 2, 2, 3, 5, 6]
Input: nums1 = [1], m = 1, nums2 = [], n = 0                        Output: [1]
Input: nums1 = [0], m = 0, nums2 = [1], n = 1                       Output: [1]
```

## Constraints & clarifying questions

```
- Are both inputs sorted ascending? (yes)
- Is the free space in nums1 guaranteed to be exactly n? (yes)
- Duplicates allowed? (yes, keep all of them)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *fill from the back* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O((m+n) log(m+n)) time, O(1) extra space (sort is in place). Copy nums2 into the free slots of nums1, then sort nums1 with a numeric comparator.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (fill from the back, two pointers)   O(m + n) time, O(1) space. Merging from the FRONT would overwrite unprocessed nums1 values.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 0 -> nums1 unchanged
- m = 0 -> nums1 becomes a copy of nums2
- All of nums2 smaller than all of nums1 -> nums1 values all shift right
- Duplicates across the two arrays
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O((m+n) log(m+n)) time, O(1) extra space (sort is in place)

```
Copy nums2 into the free slots of nums1, then sort nums1 with a numeric comparator.
```

### APPROACH 2 — Optimal (fill from the back, two pointers)   O(m + n) time, O(1) space

```
Merging from the FRONT would overwrite unprocessed nums1 values. But the back of
nums1 is empty, so merge from the back: compare the largest remaining of each array
and place the bigger one at the last free slot. Pointers: i = m-1 (nums1), j = n-1
(nums2), write = m+n-1. If nums2 runs out first we are done; if nums1 runs out first,
copy the rest of nums2.

Dry run on nums1 = [1, 2, 3, 0, 0, 0], nums2 = [2, 5, 6]:
  i=2(3) j=2(6) write=5: 6 > 3 -> nums1[5]=6, j=1     [1,2,3,0,0,6]
  i=2(3) j=1(5) write=4: 5 > 3 -> nums1[4]=5, j=0     [1,2,3,0,5,6]
  i=2(3) j=0(2) write=3: 3 > 2 -> nums1[3]=3, i=1     [1,2,3,3,5,6]
  i=1(2) j=0(2) write=2: 2 <= 2 -> nums1[2]=2, j=-1   [1,2,2,3,5,6]
  j < 0 -> stop. nums1's leftovers are already in place.
```

### Edge cases

```
- n = 0 -> nums1 unchanged
- m = 0 -> nums1 becomes a copy of nums2
- All of nums2 smaller than all of nums1 -> nums1 values all shift right
- Duplicates across the two arrays
```

Full JavaScript solution with tests: [09_merge_sorted_array.js](../solutions/09_merge_sorted_array.js). Run it with `node 09_merge_sorted_array.js` from the solutions folder.

</details>

## Common mistakes

- Merging from the front, which overwrites values of nums1 you still need.
- Stopping when nums1 runs out but forgetting to copy the remaining nums2 elements.
- Using `nums1.concat(nums2).sort()`; default sort is lexicographic and the result is a new array, not in place.

## Related follow-ups

- [Merge Sorted Array (Two Pointers)](../../../06_Two_Pointers/03_Problems/01_Easy/08_merge_sorted_array.md) — same problem in the pointer topic
- [Merge Two Sorted Lists](../../../15_Linked_Lists/03_Problems/01_Easy/02_merge_two_sorted_lists.md) — the merge step on linked lists
- [Squares of a Sorted Array](../../../06_Two_Pointers/03_Problems/01_Easy/07_squares_of_sorted_array.md) — fill from the back again

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

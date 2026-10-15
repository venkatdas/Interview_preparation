# Sort an Array

| | |
|---|---|
| **Topic** | Sorting |
| **Difficulty** | Medium |
| **Pattern** | merge sort / quick sort |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #912 — https://leetcode.com/problems/sort-an-array/ |
| **Solution file** | [01_sort_an_array.js](../solutions/01_sort_an_array.js) — open only after a real attempt |

## Problem

Given an array of integers, return it sorted in ascending order WITHOUT using
built-in sort, in O(n log n) time and with as little extra space as possible.

## Examples

```
Input: [5,2,3,1]       Output: [1,2,3,5]
Input: [5,1,1,2,0,0]   Output: [0,0,1,1,2,5]
```

## Constraints & clarifying questions

```
- n <= 5 * 10^4, values in [-5 * 10^4, 5 * 10^4]  (small range: counting sort also works!)
- Duplicates? (yes) Negatives? (yes)
- Must it be stable? (not for plain integers)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *merge sort / quick sort* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (insertion sort)   O(n^2) time, O(1) space. For each element, slide it left into the sorted prefix.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (merge sort; quick sort shown too)   O(n log n) time, O(n) space. Merge sort: split in half, sort halves recursively, merge two sorted halves in O(n).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [] and [x]
- all equal values (quick sort without random pivot / three-way would be slow)
- already sorted / reverse sorted
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (insertion sort)   O(n^2) time, O(1) space

```
For each element, slide it left into the sorted prefix. Times out on 5 * 10^4
elements in the worst case, but it is the simplest correct sort.
```

### APPROACH 2 — Optimal (merge sort; quick sort shown too)   O(n log n) time, O(n) space

```
Merge sort: split in half, sort halves recursively, merge two sorted halves in O(n).
Recursion depth is log n, so no stack issues. Quick sort with a random pivot is
O(n log n) average and in-place; both are provided.

Dry run merge sort on [5,2,3,1]:
  split -> [5,2] and [3,1]
  [5,2] -> [5],[2] -> merge -> [2,5]
  [3,1] -> [3],[1] -> merge -> [1,3]
  merge [2,5] and [1,3]: 1 < 2 take 1; 2 < 3 take 2; 3 < 5 take 3; leftover 5 -> [1,2,3,5]
```

### Edge cases

```
- [] and [x]
- all equal values (quick sort without random pivot / three-way would be slow)
- already sorted / reverse sorted
```

Full JavaScript solution with tests: [01_sort_an_array.js](../solutions/01_sort_an_array.js). Run it with `node 01_sort_an_array.js` from the solutions folder.

</details>

## Common mistakes

- Calling `nums.sort()` without a comparator; it sorts numbers as strings ([10, 9] stays [10, 9]).
- Picking the first element as the quicksort pivot, which is O(n^2) on sorted input; randomise it.
- Recursive merge sort that slices arrays at every level, which allocates O(n log n) total memory.

## Related follow-ups

- [Kth Largest Element in an Array](04_kth_largest_element.md) — partition without full sorting
- [Sort List](12_sort_list.md) — merge sort on a linked list
- [Count of Smaller Numbers After Self](../03_Hard/13_count_smaller_after_self.md) — merge sort that counts

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

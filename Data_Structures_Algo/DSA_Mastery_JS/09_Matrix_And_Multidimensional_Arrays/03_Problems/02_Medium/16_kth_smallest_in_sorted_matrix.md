# Kth Smallest Element in a Sorted Matrix

| | |
|---|---|
| **Topic** | Matrix and Multidimensional Arrays |
| **Difficulty** | Medium |
| **Pattern** | binary search on value |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #378 — https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/ |
| **Solution file** | [16_kth_smallest_in_sorted_matrix.js](../solutions/16_kth_smallest_in_sorted_matrix.js) — open only after a real attempt |

## Problem

An n x n matrix has rows and columns sorted ascending. Return the k-th smallest element
(1-indexed, counting duplicates). Aim for better than O(n^2) extra memory.

## Examples

```
Input: matrix = [[1,5,9],[10,11,13],[12,13,15]], k = 8   Output: 13
  Explanation: sorted: 1,5,9,10,11,12,13,13,15 -> 8th is 13
Input: matrix = [[-5]], k = 1   Output: -5
```

## Constraints & clarifying questions

```
- Rows and columns sorted, but not fully sorted end to end? (right - so no 1D binary search)
- 1 <= k <= n^2? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *binary search on value* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2 log n) time, O(n^2) space. Flatten, sort, index k - 1.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (binary search on the VALUE)   O(n log(max - min)) time, O(1) space. The answer lies between matrix[0][0] and matrix[n-1][n-1].

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- 1x1 -> that element
- k = 1 -> matrix[0][0]; k = n^2 -> bottom-right
- duplicates: the count includes them, so the answer respects them
- negative values: use lo/hi from the matrix, not 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2 log n) time, O(n^2) space

```
Flatten, sort, index k - 1. (A min-heap over rows gives O(k log n) - also fine.)
```

### APPROACH 2 — Optimal (binary search on the VALUE)   O(n log(max - min)) time, O(1) space

```
The answer lies between matrix[0][0] and matrix[n-1][n-1]. For a candidate value mid,
count how many cells are <= mid. Because rows and columns are sorted, this count is
found with a staircase walk from the bottom-left in O(n): move up when the cell > mid
(the whole row to the right is bigger), move right when it is <= mid (the whole column
above is smaller, so add the column height so far).
If count >= k, the answer is <= mid -> hi = mid; else lo = mid + 1. The loop ends with
lo === hi equal to the smallest value whose count >= k, which is always an element of
the matrix (counts only change at actual values).

Dry run on the example, k = 8: lo=1, hi=15
  mid=8:  count(<=8)=2  < 8 -> lo=9
  mid=12: count(<=12)=6 < 8 -> lo=13
  mid=14: count(<=14)=8 >= 8 -> hi=14
  mid=13: count(<=13)=8 >= 8 -> hi=13   lo=13=hi -> 13
```

### Edge cases

```
- 1x1 -> that element
- k = 1 -> matrix[0][0]; k = n^2 -> bottom-right
- duplicates: the count includes them, so the answer respects them
- negative values: use lo/hi from the matrix, not 0
```

Full JavaScript solution with tests: [16_kth_smallest_in_sorted_matrix.js](../solutions/16_kth_smallest_in_sorted_matrix.js). Run it with `node 16_kth_smallest_in_sorted_matrix.js` from the solutions folder.

</details>

## Common mistakes

- Flattening and sorting (O(n^2 log n)) when the sorted structure allows better.
- In the binary search on values, returning `mid` instead of the converged `lo`, which may not be in the matrix.
- Counting cells `< mid` instead of `<= mid`.

## Related follow-ups

- [Search a 2D Matrix II](10_search_2d_matrix_ii.md) — the staircase walk used for counting
- [Merge k Sorted Lists](../../../19_Heaps_And_Priority_Queues/03_Problems/03_Hard/07_merge_k_sorted_lists.md) — the heap approach
- Find K Pairs with Smallest Sums (LeetCode #373) — the same k-way heap idea

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

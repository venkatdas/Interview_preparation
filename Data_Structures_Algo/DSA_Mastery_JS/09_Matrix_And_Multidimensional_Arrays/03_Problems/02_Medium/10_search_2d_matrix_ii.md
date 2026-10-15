# Search a 2D Matrix II

| | |
|---|---|
| **Topic** | Matrix and Multidimensional Arrays |
| **Difficulty** | Medium |
| **Pattern** | staircase search |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #240 — https://leetcode.com/problems/search-a-2d-matrix-ii/ |
| **Solution file** | [10_search_2d_matrix_ii.js](../solutions/10_search_2d_matrix_ii.js) — open only after a real attempt |

## Problem

Each row is sorted left to right and each column is sorted top to bottom (but rows do NOT
continue into each other). Return true if target is in the matrix.

## Examples

```
Input: matrix = [[1,4,7,11,15],[2,5,8,12,19],[3,6,9,16,22],[10,13,14,17,24],[18,21,23,26,30]], target = 5    Output: true
Input: same matrix, target = 20   Output: false
```

## Constraints & clarifying questions

```
- Is the matrix fully sorted (row i ends <= row i+1 starts)? (no - that is LeetCode 74, one binary search)
- Duplicates? (possible; we only need existence)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *staircase search* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(m n) time, O(1) space. Scan every cell.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (staircase search from the top-right)   O(m + n) time, O(1) space. Start at the top-right corner.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- empty matrix -> false
- target smaller than the top-left or larger than the bottom-right -> false quickly
- 1 x n or n x 1 -> degenerates to a linear scan
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(m n) time, O(1) space

```
Scan every cell. (Binary search in each row gives O(m log n), also "brute-ish".)
```

### APPROACH 2 — Optimal (staircase search from the top-right)   O(m + n) time, O(1) space

```
Start at the top-right corner. That cell is the LARGEST in its row and the SMALLEST in
its column. Compare with target:
  equal   -> found
  greater -> the whole column below is bigger too -> move LEFT (eliminate a column)
  smaller -> the whole row to the left is smaller too -> move DOWN (eliminate a row)
Each step throws away a full row or column, so at most m + n steps.
(Starting bottom-left works symmetrically. Top-left does NOT work: both directions grow.)

Dry run for target 5:
  (0,4)=15 > 5 -> left  (0,3)=11 > 5 -> left  (0,2)=7 > 5 -> left  (0,1)=4 < 5 -> down
  (1,1)=5 == 5 -> true
```

### Edge cases

```
- empty matrix -> false
- target smaller than the top-left or larger than the bottom-right -> false quickly
- 1 x n or n x 1 -> degenerates to a linear scan
```

Full JavaScript solution with tests: [10_search_2d_matrix_ii.js](../solutions/10_search_2d_matrix_ii.js). Run it with `node 10_search_2d_matrix_ii.js` from the solutions folder.

</details>

## Common mistakes

- Starting at the top-left or bottom-right corner, where both moves increase (or decrease) the value, so you cannot eliminate.
- Treating the matrix as one sorted list; rows do not continue from each other here.
- Binary searching every row (O(m log n)) and calling it optimal.

## Related follow-ups

- [Search a 2D Matrix](../../../10_Searching/03_Problems/02_Medium/11_search_2d_matrix.md) — fully sorted, one binary search
- [Kth Smallest Element in a Sorted Matrix](16_kth_smallest_in_sorted_matrix.md) — the same staircase walk for counting
- [Two Sum II - Input Array Is Sorted](../../../06_Two_Pointers/03_Problems/02_Medium/03_two_sum_ii_sorted.md) — the same elimination idea in 1D

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

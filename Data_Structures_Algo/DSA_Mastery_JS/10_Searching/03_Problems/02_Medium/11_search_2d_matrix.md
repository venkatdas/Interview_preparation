# Search a 2D Matrix

| | |
|---|---|
| **Topic** | Searching (Linear and Binary Search) |
| **Difficulty** | Medium |
| **Pattern** | flattened index |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #74 — https://leetcode.com/problems/search-a-2d-matrix/ |
| **Solution file** | [11_search_2d_matrix.js](../solutions/11_search_2d_matrix.js) — open only after a real attempt |

## Problem

An m x n matrix has each row sorted ascending, and the first element of each row is
greater than the last element of the previous row. Return true if target is in it.
O(log(m * n)) required.

## Examples

```
matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]]
Input: target = 3    Output: true
Input: target = 13   Output: false
```

## Constraints & clarifying questions

```
- Rows "chain" (row i+1 starts after row i ends)? (yes; if NOT, that is LeetCode 240,
  solved with the staircase walk from the top-right corner in O(m + n))
- m, n >= 1
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *flattened index* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(m * n). Scan every cell.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (treat the matrix as one flat sorted array)   O(log(m*n)) time, O(1) space. Reading the matrix row by row gives a sorted list of length m * n.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- 1x1 matrix
- single row / single column
- target smaller than matrix[0][0] or larger than the last cell
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(m * n)

```
Scan every cell. (Or O(m + n) staircase walk, which also works here.)
```

### APPROACH 2 — Optimal (treat the matrix as one flat sorted array)   O(log(m*n)) time, O(1) space

```
Reading the matrix row by row gives a sorted list of length m * n. Binary search
over virtual indices 0..m*n-1 and translate on the fly:
  row = Math.floor(index / n),  col = index % n
Plain Template 1 otherwise.

Dry run target = 3, m=3 n=4 (12 cells):
  l=0 r=11 mid=5 -> row 1 col 1 -> 11 > 3 -> r=4
  l=0 r=4  mid=2 -> row 0 col 2 -> 5 > 3  -> r=1
  l=0 r=1  mid=0 -> row 0 col 0 -> 1 < 3  -> l=1
  l=1 r=1  mid=1 -> row 0 col 1 -> 3 === 3 -> true
```

### Edge cases

```
- 1x1 matrix
- single row / single column
- target smaller than matrix[0][0] or larger than the last cell
```

Full JavaScript solution with tests: [11_search_2d_matrix.js](../solutions/11_search_2d_matrix.js). Run it with `node 11_search_2d_matrix.js` from the solutions folder.

</details>

## Common mistakes

- Wrong flat-to-2D mapping: row is `Math.floor(mid / cols)`, column is `mid % cols` (cols, not rows).
- Doing two binary searches with an off-by-one when choosing the row.
- Using the staircase walk (O(m + n)) when O(log(m·n)) is possible here.

## Related follow-ups

- [Search a 2D Matrix II](../../../09_Matrix_And_Multidimensional_Arrays/03_Problems/02_Medium/10_search_2d_matrix_ii.md) — rows and columns sorted separately
- [Reshape the Matrix](../../../09_Matrix_And_Multidimensional_Arrays/03_Problems/01_Easy/04_reshape_the_matrix.md) — the same index mapping
- [Binary Search](../01_Easy/01_binary_search.md) — the 1D base

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

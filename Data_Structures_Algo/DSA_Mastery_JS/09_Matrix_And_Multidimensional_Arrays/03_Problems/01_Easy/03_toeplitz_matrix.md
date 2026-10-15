# Toeplitz Matrix

| | |
|---|---|
| **Topic** | Matrix and Multidimensional Arrays |
| **Difficulty** | Easy |
| **Pattern** | compare with up-left neighbour |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #766 — https://leetcode.com/problems/toeplitz-matrix/ |
| **Solution file** | [03_toeplitz_matrix.js](../solutions/03_toeplitz_matrix.js) — open only after a real attempt |

## Problem

A matrix is Toeplitz if every diagonal from top-left to bottom-right has the same value
all along it. Return true if the given m x n matrix is Toeplitz.

## Examples

```
Input: [[1,2,3,4],[5,1,2,3],[9,5,1,2]]   Output: true
Input: [[1,2],[2,2]]                     Output: false   Explanation: diagonal 1,2 differs
```

## Constraints & clarifying questions

```
- Follow-up: what if only one row fits in memory at a time? (compare row i with row i-1 shifted by one)
- Non-square allowed? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *compare with up-left neighbour* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(m n) time, O(m + n) space. Group cells by their diagonal id r - c in a Map (diagonal id -> first value seen).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (compare with the up-left neighbour)   O(m n) time, O(1) space. Cell (r, c) is on the same diagonal as (r-1, c-1).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single row or single column -> always true (every diagonal has one cell)
- 1x1 -> true
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(m n) time, O(m + n) space

```
Group cells by their diagonal id r - c in a Map (diagonal id -> first value seen). If any
cell disagrees with its diagonal's value, return false.
```

### APPROACH 2 — Optimal (compare with the up-left neighbour)   O(m n) time, O(1) space

```
Cell (r, c) is on the same diagonal as (r-1, c-1). If every cell equals its up-left
neighbour, then by induction every diagonal is constant. One pass, no extra memory.

Dry run on [[1,2],[2,2]]:
  (1,1)=2 vs (0,0)=1 -> differ -> false
```

### Edge cases

```
- single row or single column -> always true (every diagonal has one cell)
- 1x1 -> true
```

Full JavaScript solution with tests: [03_toeplitz_matrix.js](../solutions/03_toeplitz_matrix.js). Run it with `node 03_toeplitz_matrix.js` from the solutions folder.

</details>

## Common mistakes

- Reading `matrix[r - 1][c - 1]` for r = 0 or c = 0; start both loops at 1.
- Walking each diagonal separately with complex start points when comparing each cell to its top-left neighbour is enough.
- Ignoring the follow-up where only one row fits in memory.

## Related follow-ups

- [Matrix Diagonal Sum](02_matrix_diagonal_sum.md) — diagonals by index
- [Valid Sudoku](../02_Medium/12_valid_sudoku.md) — checking a rule across rows, columns and boxes
- [Transpose Matrix](01_transpose_matrix.md) — simple index mapping

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

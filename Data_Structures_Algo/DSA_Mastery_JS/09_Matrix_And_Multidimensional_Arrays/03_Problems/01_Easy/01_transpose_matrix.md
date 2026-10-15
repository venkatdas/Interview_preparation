# Transpose Matrix

| | |
|---|---|
| **Topic** | Matrix and Multidimensional Arrays |
| **Difficulty** | Easy |
| **Pattern** | index swap |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #867 — https://leetcode.com/problems/transpose-matrix/ |
| **Solution file** | [01_transpose_matrix.js](../solutions/01_transpose_matrix.js) — open only after a real attempt |

## Problem

Return the transpose of a matrix: flip it over its main diagonal so that row i becomes
column i. An m x n matrix becomes n x m.

## Examples

```
Input: [[1,2,3],[4,5,6],[7,8,9]]   Output: [[1,4,7],[2,5,8],[3,6,9]]
Input: [[1,2,3],[4,5,6]]           Output: [[1,4],[2,5],[3,6]]
```

## Constraints & clarifying questions

```
- Can the matrix be non-square? (yes -> you cannot do it in place)
- Empty matrix? (return [])
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *index swap* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (build column by column)   O(m n) time, O(m n) space. For each column index c, collect grid[r][c] for every r into a new row.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (allocate n x m, result[c][r] = grid[r][c])   O(m n) time, O(m n) space. Allocate the result with swapped dimensions (careful: fresh row arrays!) and copy each cell to its mirrored position.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- 1 x n -> n x 1
- [] -> []
- square matrix (in-place variant possible: swap grid[r][c] with grid[c][r] for c > r)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (build column by column)   O(m n) time, O(m n) space

```
For each column index c, collect grid[r][c] for every r into a new row. Same complexity
as the "optimal" one; it is just a different way of writing the same loops.
```

### APPROACH 2 — Optimal (allocate n x m, result[c][r] = grid[r][c])   O(m n) time, O(m n) space

```
Allocate the result with swapped dimensions (careful: fresh row arrays!) and copy each
cell to its mirrored position. You must touch every cell once, so O(m n) is optimal.

Dry run on [[1,2,3],[4,5,6]] (2x3 -> 3x2):
  result = [[_,_],[_,_],[_,_]]
  (0,0)=1 -> result[0][0]; (0,1)=2 -> result[1][0]; (0,2)=3 -> result[2][0]
  (1,0)=4 -> result[0][1]; (1,1)=5 -> result[1][1]; (1,2)=6 -> result[2][1]
  -> [[1,4],[2,5],[3,6]]
```

### Edge cases

```
- 1 x n -> n x 1
- [] -> []
- square matrix (in-place variant possible: swap grid[r][c] with grid[c][r] for c > r)
```

Full JavaScript solution with tests: [01_transpose_matrix.js](../solutions/01_transpose_matrix.js). Run it with `node 01_transpose_matrix.js` from the solutions folder.

</details>

## Common mistakes

- Transposing a non-square matrix in place; the result has shape cols × rows, so it needs a new matrix.
- Creating rows with `Array(n).fill([])`, which shares one inner array across all rows.
- Swapping every pair twice in the square in-place version (loop j from i + 1, not from 0).

## Related follow-ups

- [Rotate Image](../02_Medium/06_rotate_image.md) — transpose plus reverse each row
- [Reshape the Matrix](04_reshape_the_matrix.md) — another index remapping
- [Toeplitz Matrix](03_toeplitz_matrix.md) — reasoning about diagonals

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

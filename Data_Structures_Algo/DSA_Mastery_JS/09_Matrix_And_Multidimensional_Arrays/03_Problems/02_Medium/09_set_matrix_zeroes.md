# Set Matrix Zeroes

| | |
|---|---|
| **Topic** | Matrix and Multidimensional Arrays |
| **Difficulty** | Medium |
| **Pattern** | first row/col as flags |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #73 — https://leetcode.com/problems/set-matrix-zeroes/ |
| **Solution file** | [09_set_matrix_zeroes.js](../solutions/09_set_matrix_zeroes.js) — open only after a real attempt |

## Problem

If a cell is 0, set its entire row and column to 0. Do it in place. Follow-up: O(1) extra
space.

## Examples

```
Input: [[1,1,1],[1,0,1],[1,1,1]]            Output: [[1,0,1],[0,0,0],[1,0,1]]
Input: [[0,1,2,0],[3,4,5,2],[1,3,1,5]]      Output: [[0,0,0,0],[0,4,5,0],[0,3,1,0]]
```

## Constraints & clarifying questions

```
- Must it be O(1) extra space, or is O(m + n) acceptable? (O(m+n) is the normal answer, O(1) is the follow-up)
- Values can be any integers, including negatives? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *first row/col as flags* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force / standard   O(m n) time, O(m + n) space. First pass: record which rows and columns contain a 0 (two Sets or boolean arrays).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (first row and first column as the flags)   O(m n) time, O(1) space. Use grid[r][0] as the flag for row r and grid[0][c] as the flag for column c.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- zero in the first row or first column (the tricky part - test it)
- no zeros -> unchanged
- all zeros -> all zeros
- 1 x n or n x 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force / standard   O(m n) time, O(m + n) space

```
First pass: record which rows and columns contain a 0 (two Sets or boolean arrays).
Second pass: zero any cell whose row or column is flagged. You cannot zero during the
first pass - the new zeros would be mistaken for original zeros.
```

### APPROACH 2 — Optimal (first row and first column as the flags)   O(m n) time, O(1) space

```
Use grid[r][0] as the flag for row r and grid[0][c] as the flag for column c. Cell (0,0)
is shared by both, so keep one extra boolean `firstColHasZero` for column 0 (grid[0][0]
will serve as the row-0 flag).
  1. Scan column 0 -> firstColHasZero.
  2. For c >= 1, scan every cell; if 0, set grid[r][0] = 0 and grid[0][c] = 0.
  3. For r >= 1, c >= 1 (bottom-right block): if grid[r][0] === 0 or grid[0][c] === 0 -> 0.
  4. If grid[0][0] === 0, zero row 0. If firstColHasZero, zero column 0.
Order matters: the first row/column must be processed LAST, after they have served as flags.

Dry run on [[1,1,1],[1,0,1],[1,1,1]]:
  firstColHasZero = false
  (1,1)=0 -> grid[1][0]=0, grid[0][1]=0  -> [[1,0,1],[0,0,1],[1,1,1]]
  block: (1,2): row flag 0 -> 0; (2,1): col flag 0 -> 0 -> [[1,0,1],[0,0,0],[1,0,1]]
  grid[0][0] = 1 -> row 0 untouched; firstColHasZero false -> done
```

### Edge cases

```
- zero in the first row or first column (the tricky part - test it)
- no zeros -> unchanged
- all zeros -> all zeros
- 1 x n or n x 1
```

Full JavaScript solution with tests: [09_set_matrix_zeroes.js](../solutions/09_set_matrix_zeroes.js). Run it with `node 09_set_matrix_zeroes.js` from the solutions folder.

</details>

## Common mistakes

- Zeroing rows and columns while still scanning, so new zeros spread across the whole matrix.
- In the O(1)-space version, forgetting a separate flag for the first column (or row), because `matrix[0][0]` cannot store both.
- Processing the first row/column markers before the inner cells, which wipes the markers.

## Related follow-ups

- [Game of Life](13_game_of_life.md) — another in-place update needing encoded state
- [Find All Numbers Disappeared in an Array](../../../03_Arrays/03_Problems/01_Easy/12_find_all_numbers_disappeared.md) — using the input as storage
- [Rotate Image](06_rotate_image.md) — another in-place matrix transform

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

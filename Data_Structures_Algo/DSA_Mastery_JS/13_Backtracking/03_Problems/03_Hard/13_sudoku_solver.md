# Sudoku Solver

| | |
|---|---|
| **Topic** | Backtracking |
| **Difficulty** | Hard |
| **Pattern** | find one solution, return boolean |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #37 — https://leetcode.com/problems/sudoku-solver/ |
| **Solution file** | [13_sudoku_solver.js](../solutions/13_sudoku_solver.js) — open only after a real attempt |

## Problem

Fill a 9x9 board (array of arrays of single-character strings, '.' = empty) so that
every row, every column and every 3x3 box contains the digits 1-9 exactly once.
Modify the board in place. The puzzle is guaranteed to have exactly one solution.

## Examples

```
Input: a standard puzzle with ~30 givens   Output: the completed grid (see tests)
```

## Constraints & clarifying questions

```
- Exactly one solution? (yes) Should I return it or fill in place? (in place)
- Is the given board valid? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *find one solution, return boolean* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(9^(empty cells)) with slow O(27) validity checks. Find the first empty cell, try digits 1-9, check row/col/box by scanning them, recurse.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Backtracking with "find one" early return + O(1) checks). O(9^(empty cells)) worst, far less in practice; O(81) stack Keep three arrays of Sets: rowsUsed[r], colsUsed[c], boxesUsed[b] with b = 3*floor(r/3) + floor(c/3).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Already-complete board -> returns true without changes
- A board with no solution -> returns false (board restored)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(9^(empty cells)) with slow O(27) validity checks

```
Find the first empty cell, try digits 1-9, check row/col/box by scanning them,
recurse. Same search tree as optimal but each check costs 27 lookups.
```

### APPROACH 2 — Optimal (Backtracking with "find one" early return + O(1) checks)

```
O(9^(empty cells)) worst, far less in practice; O(81) stack
Keep three arrays of Sets: rowsUsed[r], colsUsed[c], boxesUsed[b] with b = 3*floor(r/3) + floor(c/3).
Pre-fill them from the givens. solve(cellIndex):
  - cellIndex === 81 -> all filled -> return true
  - cell not empty  -> solve(cellIndex + 1)
  - for d in 1..9: if d is free in row, col and box: place it (choose), if solve(next)
    returns true -> return true immediately (do NOT undo, we want to keep it),
    else remove it (un-choose).
  - no digit worked -> return false (makes the caller try its next digit)

Dry run (tiny): row 0 = "53..7...." -> cell (0,2) is empty; 1 free? yes -> place 1 and go on.
Deep inside, if some cell has no legal digit, we return false up the chain until a
previous cell tries its next digit. Eventually (0,2) ends up as 4 in the solution.
```

### Edge cases

```
- Already-complete board -> returns true without changes
- A board with no solution -> returns false (board restored)
```

Full JavaScript solution with tests: [13_sudoku_solver.js](../solutions/13_sudoku_solver.js). Run it with `node 13_sudoku_solver.js` from the solutions folder.

</details>

## Common mistakes

- Not returning `true` up the call chain once solved, so the solver keeps going and erases the answer.
- Computing the 3x3 box index wrong: it is `Math.floor(r / 3) * 3 + Math.floor(c / 3)`.
- Forgetting to clear the cell (back to `.`) after a failed digit.

## Related follow-ups

- [Valid Sudoku](../../../09_Matrix_And_Multidimensional_Arrays/03_Problems/02_Medium/12_valid_sudoku.md) (09_Matrix_And_Multidimensional_Arrays)
- [N-Queens](12_n_queens.md)
- Sudoku-like constraint search: Word Squares (LeetCode #425)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

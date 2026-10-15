# Valid Sudoku

| | |
|---|---|
| **Topic** | Matrix and Multidimensional Arrays |
| **Difficulty** | Medium |
| **Pattern** | row/col/box sets |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #36 — https://leetcode.com/problems/valid-sudoku/ |
| **Solution file** | [12_valid_sudoku.js](../solutions/12_valid_sudoku.js) — open only after a real attempt |

## Problem

A 9x9 board holds digits '1'-'9' or '.' for empty. Return true if the FILLED cells are
valid: no digit repeats in any row, any column, or any of the nine 3x3 boxes.
(The board does not have to be solvable.)

## Examples

```
Input: the classic LeetCode board   Output: true
Same board with board[0][0] = '8'   Output: false   Explanation: two 8s in the top-left box
```

## Constraints & clarifying questions

```
- Always 9x9? (yes)
- Only '.' and '1'-'9'? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *row/col/box sets* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(81 * 9) time, O(9) space. Check each of the 9 rows, 9 columns, and 9 boxes separately with a fresh Set each time.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (one pass, three arrays of Sets)   O(81) time, O(81) space. Walk every cell once.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- completely empty board -> true
- duplicate only within a box (different rows and columns) -> false (easy to miss)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(81 * 9) time, O(9) space

```
Check each of the 9 rows, 9 columns, and 9 boxes separately with a fresh Set each time.
Three separate loops; 27 scans of 9 cells.
```

### APPROACH 2 — Optimal (one pass, three arrays of Sets)   O(81) time, O(81) space

```
Walk every cell once. Keep rows[9], cols[9], boxes[9] as Sets. The box index for cell
(r, c) is Math.floor(r / 3) * 3 + Math.floor(c / 3):
  boxes:  0 1 2
          3 4 5
          6 7 8
If a digit is already in its row, column, or box set -> false. Else add it to all three.
(A bitmask per row/col/box - 9 bits each - replaces the Sets; see 14_Bit_Manipulation/.)

Dry run (first few cells of row 0: '5','3','.','.','7'):
  (0,0)='5': rows[0]={5} cols[0]={5} boxes[0]={5}
  (0,1)='3': rows[0]={5,3} cols[1]={3} boxes[0]={5,3}
  (0,4)='7': rows[0]={5,3,7} cols[4]={7} boxes[1]={7}   ... continue
```

### Edge cases

```
- completely empty board -> true
- duplicate only within a box (different rows and columns) -> false (easy to miss)
```

Full JavaScript solution with tests: [12_valid_sudoku.js](../solutions/12_valid_sudoku.js). Run it with `node 12_valid_sudoku.js` from the solutions folder.

</details>

## Common mistakes

- Box index formula wrong: it is `Math.floor(r / 3) * 3 + Math.floor(c / 3)`.
- Checking that the board is *solvable*; the problem only asks whether the filled cells break a rule.
- Counting "." as a digit.

## Related follow-ups

- [Sudoku Solver](../../../13_Backtracking/03_Problems/03_Hard/13_sudoku_solver.md) — actually fill the board
- [N-Queens](../../../13_Backtracking/03_Problems/03_Hard/12_n_queens.md) — row/column/diagonal constraints
- [Toeplitz Matrix](../01_Easy/03_toeplitz_matrix.md) — a simpler rule check

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

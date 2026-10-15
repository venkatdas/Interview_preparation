# N-Queens

| | |
|---|---|
| **Topic** | Backtracking |
| **Difficulty** | Hard |
| **Pattern** | row by row with attacked sets |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #51 — https://leetcode.com/problems/n-queens/ |
| **Solution file** | [12_n_queens.js](../solutions/12_n_queens.js) — open only after a real attempt |

## Problem

Place n queens on an n x n chessboard so that no two queens attack each other
(same row, column, or diagonal). Return all distinct board configurations, each
as an array of strings where 'Q' is a queen and '.' is empty.

## Examples

```
Input: n = 4   Output: [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
Input: n = 1   Output: [["Q"]]
```

## Constraints & clarifying questions

```
- 1 <= n <= 9
- n = 2 and n = 3 have NO solutions -> return []
- Do they want all solutions, or just the count (N-Queens II)?
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *row by row with attacked sets* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^n * n^2). Every queen sits in its own row, so choose a column for each row: n^n boards.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (Backtracking row by row with attacked sets)   O(n!) time, O(n) space. Place queens one ROW at a time (so rows never clash).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 1 -> [["Q"]]
- n = 2, 3 -> []
- counts: n=4:2, 5:10, 6:4, 7:40, 8:92, 9:352
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^n * n^2)

```
Every queen sits in its own row, so choose a column for each row: n^n boards.
For each full board, check every pair of queens for attacks. n=8: 16.7M boards.
```

### APPROACH 2 — Optimal (Backtracking row by row with attacked sets)   O(n!) time, O(n) space

```
Place queens one ROW at a time (so rows never clash). For row r, try every column c
and reject it in O(1) if:
  - column c already has a queen                      -> Set cols
  - diagonal (r - c) already has a queen              -> Set diag1  (same r - c = same "\" diagonal)
  - anti-diagonal (r + c) already has a queen         -> Set diag2  (same r + c = same "/" diagonal)
Choose: add to the three sets + record column. Explore row r + 1. Un-choose: remove.

Why r - c and r + c? Walking down-right adds 1 to both r and c, so r - c stays constant.
Walking down-left adds 1 to r and subtracts 1 from c, so r + c stays constant.

Dry run n=4 (queens[] = column chosen per row):
  row0 c=0 -> row1 c=0 col clash, c=1 diag clash, c=2 ok -> row2: c=0 diag(2-0=2 vs 0-0=0? no)
    ... all of row2 clashes -> back up; row1 c=3 ok -> row2 c=1 ok -> row3 all clash -> back up
  row0 c=1 -> row1 c=3 -> row2 c=0 -> row3 c=2 -> record ".Q..","...Q","Q...","..Q."
  row0 c=2 -> row1 c=0 -> row2 c=3 -> row3 c=1 -> record
  row0 c=3 -> no solution
```

### Edge cases

```
- n = 1 -> [["Q"]]
- n = 2, 3 -> []
- counts: n=4:2, 5:10, 6:4, 7:40, 8:92, 9:352
```

Full JavaScript solution with tests: [12_n_queens.js](../solutions/12_n_queens.js). Run it with `node 12_n_queens.js` from the solutions folder.

</details>

## Common mistakes

- Using the wrong diagonal keys: one diagonal is `row - col`, the other is `row + col`.
- Scanning the whole board to test each placement (O(n) or O(n²)) instead of O(1) Set lookups.
- Forgetting to remove the queen from all three Sets when backtracking.

## Related follow-ups

- N-Queens II (LeetCode #52)
- [Sudoku Solver](13_sudoku_solver.md)
- [Valid Sudoku](../../../09_Matrix_And_Multidimensional_Arrays/03_Problems/02_Medium/12_valid_sudoku.md) (09_Matrix_And_Multidimensional_Arrays)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

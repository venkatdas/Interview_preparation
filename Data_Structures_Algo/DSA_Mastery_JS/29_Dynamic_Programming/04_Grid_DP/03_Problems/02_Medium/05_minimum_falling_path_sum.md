# Minimum Falling Path Sum

| | |
|---|---|
| **Topic** | Grid DP |
| **Difficulty** | Medium |
| **Pattern** | row-by-row, 3 parents |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #931 — https://leetcode.com/problems/minimum-falling-path-sum/ |
| **Solution file** | [05_minimum_falling_path_sum.js](../solutions/05_minimum_falling_path_sum.js) — open only after a real attempt |

## Problem

Given an n x n matrix, a "falling path" starts at any cell in the first row and moves
down one row at a time to the same column, the column to the left, or the column to the
right. Return the minimum sum of any falling path.

## Examples

```
Input: [[2,1,3],[6,5,4],[7,8,9]]   Output: 13   Explanation: 1 -> 5 -> 7 or 1 -> 4 -> 8
Input: [[-19,57],[-40,-5]]         Output: -59  Explanation: -19 -> -40
Input: [[7]]                       Output: 7
```

## Constraints & clarifying questions

```
- 1 <= n <= 100, values in -100 .. 100
- May we start in any column? (yes) End in any column? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *row-by-row, 3 parents* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force recursion   O(3^n * n) time, O(n) space. For every starting column, try all three moves at every row.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 4 — Two rows   O(n^2) time, O(n) space. Each row only needs the previous row.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- 1x1 matrix -> that value
- negative values -> fine, min handles them
- n = 2: only two columns, the "middle" option and one side exist
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force recursion   O(3^n * n) time, O(n) space

```
For every starting column, try all three moves at every row.
```

### APPROACH 2 — Memoization   O(n^2) time, O(n^2) space

### APPROACH 3 — Tabulation    O(n^2) time, O(n^2) space

```
Dry run on [[2,1,3],[6,5,4],[7,8,9]]:
  row 0:  2  1  3
  row 1:  6+min(2,1)=7   5+min(2,1,3)=6   4+min(1,3)=5
  row 2:  7+min(7,6)=13  8+min(7,6,5)=13  9+min(6,5)=14
  answer = min(13, 13, 14) = 13
```

### APPROACH 4 — Two rows   O(n^2) time, O(n) space

```
Each row only needs the previous row. Because cell j reads j-1, j AND j+1 of the row
above, we cannot overwrite in place; keep `prev` and build `curr`.
```

### DP definition

```
STATE
dp[i][j] = minimum falling path sum that ENDS at cell (i, j)
RECURRENCE
dp[i][j] = matrix[i][j] + min(dp[i-1][j-1], dp[i-1][j], dp[i-1][j+1])
  (out-of-range columns count as Infinity)
BASE CASES
dp[0][j] = matrix[0][j]
ANSWER
min over j of dp[n-1][j]   (the path may end anywhere)
```

### Edge cases

```
- 1x1 matrix -> that value
- negative values -> fine, min handles them
- n = 2: only two columns, the "middle" option and one side exist
```

Full JavaScript solution with tests: [05_minimum_falling_path_sum.js](../solutions/05_minimum_falling_path_sum.js). Run it with `node 05_minimum_falling_path_sum.js` from the solutions folder.

</details>

## Common mistakes

- Reading `prev[j-1]` / `prev[j+1]` outside the row; skip (or treat as Infinity) the missing diagonal at the edges.
- Returning `dp[n-1][0]` instead of the minimum of the whole last row.
- Overwriting the previous row in place while it is still being read; keep two rows.

## Related follow-ups

- [Triangle](04_triangle.md)
- [Minimum Path Sum](03_minimum_path_sum.md)
- Minimum Falling Path Sum II (LeetCode #1289)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

# Count Square Submatrices with All Ones

| | |
|---|---|
| **Topic** | Grid DP |
| **Difficulty** | Medium |
| **Pattern** | square ending at (i, j) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1277 — https://leetcode.com/problems/count-square-submatrices-with-all-ones/ |
| **Solution file** | [06_count_square_submatrices.js](../solutions/06_count_square_submatrices.js) — open only after a real attempt |

## Problem

Given an m x n matrix of 0s and 1s, count how many square submatrices consist entirely
of 1s. Squares of every size count (1x1, 2x2, 3x3, ...).

## Examples

```
Input: [[0,1,1,1],[1,1,1,1],[0,1,1,1]]   Output: 15
  Explanation: 10 squares of side 1, 4 of side 2, 1 of side 3.
Input: [[1,0,1],[1,1,0],[1,1,0]]         Output: 7
  Explanation: 6 squares of side 1, 1 of side 2.
```

## Constraints & clarifying questions

```
- 1 <= m, n <= 300
- Squares only, not rectangles? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *square ending at (i, j)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(m * n * min(m,n)^2) time, O(1) space. For every top-left corner and every side length, check that every cell is 1.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 4 — One row   O(m*n) time, O(n) space. dp[i][j] needs dp[i-1][j-1] (up-left), which the in-place row has already overwritten.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- all zeros -> 0
- all ones n x n -> sum of k^2 for k = 1..n (e.g. 2x2 -> 5, 3x3 -> 14)
- single row / column -> number of ones
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(m * n * min(m,n)^2) time, O(1) space

```
For every top-left corner and every side length, check that every cell is 1.
Implemented recursively on "largest square ending at (i, j)" to match the other versions.
```

### APPROACH 2 — Memoization   O(m*n) time, O(m*n) space

### APPROACH 3 — Tabulation    O(m*n) time, O(m*n) space

```
Dry run on [[0,1,1,1],[1,1,1,1],[0,1,1,1]]:
  matrix        dp
  0 1 1 1       0 1 1 1
  1 1 1 1  ->   1 1 2 2     dp[1][2] = 1 + min(1, 1, 1) = 2
  0 1 1 1       0 1 2 3     dp[2][3] = 1 + min(2, 2, 2) = 3
  sum = (0+1+1+1) + (1+1+2+2) + (0+1+2+3) = 3 + 6 + 6 = 15
```

### APPROACH 4 — One row   O(m*n) time, O(n) space

```
dp[i][j] needs dp[i-1][j-1] (up-left), which the in-place row has already overwritten.
Keep the overwritten value in a variable `prevDiagonal` before writing.
```

### DP definition

```
STATE
dp[i][j] = side length of the largest all-ones square whose bottom-right corner is (i, j)
  KEY INSIGHT: that number is also HOW MANY squares end at (i, j)
  (side 1, side 2, ..., side dp[i][j] all fit), so the answer is the sum of the table.
RECURRENCE
dp[i][j] = 0                                              if matrix[i][j] === 0
  dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])  otherwise
  A k-square at (i, j) needs (k-1)-squares above, to the left and diagonally; the
  smallest of the three is the bottleneck.
BASE CASES
first row / first column: dp = matrix value (only a 1x1 square can end there)
ANSWER
sum of all dp[i][j]
```

### Edge cases

```
- all zeros -> 0
- all ones n x n -> sum of k^2 for k = 1..n (e.g. 2x2 -> 5, 3x3 -> 14)
- single row / column -> number of ones
```

Full JavaScript solution with tests: [06_count_square_submatrices.js](../solutions/06_count_square_submatrices.js). Run it with `node 06_count_square_submatrices.js` from the solutions folder.

</details>

## Common mistakes

- Using `max` of the three neighbours instead of `min`; the square is limited by its weakest side.
- Adding only the maximum side instead of summing every `dp[i][j]` (a cell with side k ends k squares).
- Applying the formula to cells that are 0; they must stay 0.

## Related follow-ups

- [Maximal Square](07_maximal_square.md)
- Maximal Rectangle (LeetCode #85)
- [Largest Rectangle in Histogram (stack)](../../../../16_Stacks/03_Problems/03_Hard/12_largest_rectangle_histogram.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

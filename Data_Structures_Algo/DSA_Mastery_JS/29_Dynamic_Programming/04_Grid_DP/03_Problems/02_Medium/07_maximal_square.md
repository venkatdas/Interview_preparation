# Maximal Square

| | |
|---|---|
| **Topic** | Grid DP |
| **Difficulty** | Medium |
| **Pattern** | square ending at (i, j) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #221 — https://leetcode.com/problems/maximal-square/ |
| **Solution file** | [07_maximal_square.js](../solutions/07_maximal_square.js) — open only after a real attempt |

## Problem

Given an m x n binary matrix (characters '0' / '1'), find the largest square containing
only '1's and return its AREA.

## Examples

```
Input: [["1","0","1","0","0"],
        ["1","0","1","1","1"],
        ["1","1","1","1","1"],
        ["1","0","0","1","0"]]        Output: 4   Explanation: a 2x2 square of ones
Input: [["0","1"],["1","0"]]         Output: 1
Input: [["0"]]                       Output: 0
```

## Constraints & clarifying questions

```
- 1 <= m, n <= 300; cells are the characters '0' and '1' (not numbers)
- Return area (side * side), not the side length
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

**Start simple.** APPROACH 1 — Brute force   O((m*n) * min(m,n)^2) time. For every cell as a top-left corner, grow the side while the new row and column are all ones.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 4 — One row + prevDiagonal   O(m*n) time, O(n) space. 

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- all '0' -> 0
- all '1' -> min(m, n)^2
- single row / column -> 1 if any '1' else 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O((m*n) * min(m,n)^2) time

```
For every cell as a top-left corner, grow the side while the new row and column are
all ones. Shown here as uncached recursion on "largest square ending at (i, j)".
```

### APPROACH 2 — Memoization   O(m*n) time, O(m*n) space

### APPROACH 3 — Tabulation    O(m*n) time, O(m*n) space

```
Dry run on the 4x5 example:
  1 0 1 0 0        1 0 1 0 0
  1 0 1 1 1   ->   1 0 1 1 1
  1 1 1 1 1        1 1 1 2 2       dp[2][3] = 1 + min(1, 1, 1) = 2
  1 0 0 1 0        1 0 0 1 0
  max side = 2 -> area 4
```

### APPROACH 4 — One row + prevDiagonal   O(m*n) time, O(n) space

### DP definition

```
STATE
dp[i][j] = side of the largest all-ones square whose bottom-right corner is (i, j)
RECURRENCE
dp[i][j] = 0                                             if cell is '0'
  dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) otherwise
BASE CASES
first row / column: 1 if the cell is '1' else 0
ANSWER
(max over all dp[i][j])^2
```

### Edge cases

```
- all '0' -> 0
- all '1' -> min(m, n)^2
- single row / column -> 1 if any '1' else 0
```

Full JavaScript solution with tests: [07_maximal_square.js](../solutions/07_maximal_square.js). Run it with `node 07_maximal_square.js` from the solutions folder.

</details>

## Common mistakes

- Comparing with the number 1 when the input cells are the strings "1" and "0".
- Returning the side length instead of the AREA (side squared).
- Using the one-row version without saving the old top-left (diagonal) value before overwriting it.

## Related follow-ups

- [Count Square Submatrices with All Ones](06_count_square_submatrices.md)
- Maximal Rectangle (LeetCode #85)
- Largest Plus Sign (LeetCode #764)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

# Matrix Diagonal Sum

| | |
|---|---|
| **Topic** | Matrix and Multidimensional Arrays |
| **Difficulty** | Easy |
| **Pattern** | diagonal indices |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1572 — https://leetcode.com/problems/matrix-diagonal-sum/ |
| **Solution file** | [02_matrix_diagonal_sum.js](../solutions/02_matrix_diagonal_sum.js) — open only after a real attempt |

## Problem

Given a square matrix, return the sum of the primary diagonal (top-left to bottom-right)
plus the secondary diagonal (top-right to bottom-left), counting the centre cell only once
when n is odd.

## Examples

```
Input: [[1,2,3],[4,5,6],[7,8,9]]   Output: 25   Explanation: 1+5+9 + 3+7 (5 counted once)
Input: [[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1]]   Output: 8
Input: [[5]]   Output: 5
```

## Constraints & clarifying questions

```
- Always square? (yes)
- Odd n: centre once? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *diagonal indices* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. Loop over every cell; add it if r === c or r + c === n - 1.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (walk the diagonals directly)   O(n) time, O(1) space. Row r has primary cell (r, r) and secondary cell (r, n - 1 - r).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- 1x1 -> the single value
- 2x2 -> all four cells
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
Loop over every cell; add it if r === c or r + c === n - 1.
```

### APPROACH 2 — Optimal (walk the diagonals directly)   O(n) time, O(1) space

```
Row r has primary cell (r, r) and secondary cell (r, n - 1 - r). Add both; when they are
the same cell (r === n - 1 - r, only for odd n at the middle row), add once.

Dry run on 3x3 [[1,2,3],[4,5,6],[7,8,9]]:
  r=0: (0,0)=1 + (0,2)=3 -> 4
  r=1: (1,1)=5 (same cell as (1,1)) -> 9
  r=2: (2,2)=9 + (2,0)=7 -> 25
```

### Edge cases

```
- 1x1 -> the single value
- 2x2 -> all four cells
```

Full JavaScript solution with tests: [02_matrix_diagonal_sum.js](../solutions/02_matrix_diagonal_sum.js). Run it with `node 02_matrix_diagonal_sum.js` from the solutions folder.

</details>

## Common mistakes

- Counting the centre element twice when n is odd.
- Using `mat[i][n - i]` instead of `mat[i][n - 1 - i]` for the anti-diagonal.
- Looping over every cell (O(n^2)) when only 2n cells matter.

## Related follow-ups

- [Toeplitz Matrix](03_toeplitz_matrix.md) — properties along diagonals
- [Diagonal Traverse](../02_Medium/11_diagonal_traverse.md) — walk every diagonal
- [N-Queens](../../../13_Backtracking/03_Problems/03_Hard/12_n_queens.md) — the r + c and r − c diagonal ids

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

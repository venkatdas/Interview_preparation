# Range Sum Query 2D - Immutable

| | |
|---|---|
| **Topic** | Prefix Sums and Difference Arrays |
| **Difficulty** | Medium |
| **Pattern** | 2D prefix |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #304 — https://leetcode.com/problems/range-sum-query-2d-immutable/ |
| **Solution file** | [11_range_sum_query_2d.js](../solutions/11_range_sum_query_2d.js) — open only after a real attempt |

## Problem

Given a 2D matrix, implement NumMatrix with sumRegion(row1, col1, row2, col2) returning
the sum of the rectangle with top-left (row1, col1) and bottom-right (row2, col2),
inclusive. Many queries; the matrix never changes.

## Examples

```
matrix = [[3,0,1,4,2],[5,6,3,2,1],[1,2,0,1,5],[4,1,0,1,7],[1,0,3,0,5]]
sumRegion(2,1,4,3) -> 8      sumRegion(1,1,2,2) -> 11      sumRegion(1,2,2,4) -> 12
```

## Constraints & clarifying questions

```
- Immutable? (yes)
- Inclusive corners? (yes)
- Up to 10^4 queries -> need O(1) per query
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *2D prefix* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(rows * cols) per query. Double loop over the rectangle.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (2D prefix sums, inclusion-exclusion)   O(R*C) build, O(1) query. sums[r][c] = sum of the rectangle from (0,0) to (r-1,c-1) (padded with a zero row/col).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Single cell query
- Whole matrix
- 1xN or Nx1 matrix
- Queries touching row 0 / col 0 (the padding makes them uniform)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(rows * cols) per query

```
Double loop over the rectangle.
(Intermediate: per-row prefix sums give O(rows) per query.)
```

### APPROACH 2 — Optimal (2D prefix sums, inclusion-exclusion)   O(R*C) build, O(1) query

```
sums[r][c] = sum of the rectangle from (0,0) to (r-1,c-1) (padded with a zero row/col).
Build:  sums[r+1][c+1] = grid[r][c] + sums[r][c+1] + sums[r+1][c] - sums[r][c]
        (cell + above + left - the overlap that got counted twice)
Query:  total(r2,c2) - strip above (r1-1, c2) - strip left (r2, c1-1) + corner (r1-1, c1-1)
        = sums[r2+1][c2+1] - sums[r1][c2+1] - sums[r2+1][c1] + sums[r1][c1]

Dry run for sumRegion(1,1,2,2) on the matrix above:
  sums[3][3] = sum of rows 0..2, cols 0..2 = 3+0+1+5+6+3+1+2+0 = 21
  sums[1][3] = row 0, cols 0..2 = 4
  sums[3][1] = rows 0..2, col 0 = 9
  sums[1][1] = 3
  21 - 4 - 9 + 3 = 11   (6 + 3 + 2 + 0 = 11)
```

### Edge cases

```
- Single cell query
- Whole matrix
- 1xN or Nx1 matrix
- Queries touching row 0 / col 0 (the padding makes them uniform)
```

Full JavaScript solution with tests: [11_range_sum_query_2d.js](../solutions/11_range_sum_query_2d.js). Run it with `node 11_range_sum_query_2d.js` from the solutions folder.

</details>

## Common mistakes

- Forgetting to add back the top-left overlap that was subtracted twice.
- Using an n × m prefix grid without the extra zero row and column, which forces many boundary checks.
- Mixing up row/column order in the inclusion-exclusion formula.

## Related follow-ups

- [Range Sum Query - Immutable](../01_Easy/02_range_sum_query_immutable.md) — the 1D version
- Matrix Block Sum (LeetCode #1314) — many 2D range queries at once
- Count Submatrices with All Ones (LeetCode #1504) — 2D counting with prefix ideas

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

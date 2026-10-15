# Triangle

| | |
|---|---|
| **Topic** | Grid DP |
| **Difficulty** | Medium |
| **Pattern** | row-by-row, bottom-up |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #120 — https://leetcode.com/problems/triangle/ |
| **Solution file** | [04_triangle.js](../solutions/04_triangle.js) — open only after a real attempt |

## Problem

Given a triangle array (row i has i + 1 numbers), find the minimum path sum from top to
bottom. From index j in one row you may move to index j or j + 1 in the next row.

## Examples

```
Input: [[2],[3,4],[6,5,7],[4,1,8,3]]   Output: 11   Explanation: 2 + 3 + 5 + 1
Input: [[-10]]                         Output: -10
```

## Constraints & clarifying questions

```
- 1 <= rows <= 200, values can be negative (-10^4 .. 10^4)
- Follow-up: can you do it in O(rows) extra space? (yes, bottom-up with one array)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *row-by-row, bottom-up* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force recursion   O(2^rows) time, O(rows) space. best(i, j) tries both children.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 4 — One array   O(rows^2) time, O(rows) space. Keep only the row below.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single row -> that value
- negative values -> min still works, no special handling
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force recursion   O(2^rows) time, O(rows) space

```
best(i, j) tries both children. The cell (i, j) is reached by many different paths
from above, so it is recomputed over and over.
```

### APPROACH 2 — Memoization   O(rows^2) time, O(rows^2) space

### APPROACH 3 — Tabulation (bottom row first)   O(rows^2) time, O(rows^2) space

```
Dry run on [[2],[3,4],[6,5,7],[4,1,8,3]]:
  row 3:  4  1  8  3           (base)
  row 2:  6+min(4,1)=7   5+min(1,8)=6   7+min(8,3)=10
  row 1:  3+min(7,6)=9   4+min(6,10)=10
  row 0:  2+min(9,10)=11                 -> answer 11
```

### APPROACH 4 — One array   O(rows^2) time, O(rows) space

```
Keep only the row below. Since cell j reads j and j+1 of the row below and we write
j, a left-to-right pass in place is safe (j+1 has not been overwritten yet).
```

### DP definition

```
STATE
dp[i][j] = minimum path sum from cell (i, j) DOWN to the bottom row
  (we define it "from here to the end" so the answer lands at the top, dp[0][0])
RECURRENCE
dp[i][j] = triangle[i][j] + min(dp[i+1][j], dp[i+1][j+1])
BASE CASES
dp[last][j] = triangle[last][j]
ANSWER
dp[0][0]
```

### Edge cases

```
- single row -> that value
- negative values -> min still works, no special handling
```

Full JavaScript solution with tests: [04_triangle.js](../solutions/04_triangle.js). Run it with `node 04_triangle.js` from the solutions folder.

</details>

## Common mistakes

- Going top-down and then forgetting to take the minimum over the whole last row.
- Greedily picking the smaller of the two children at each step — a local choice can hide a much cheaper path below.
- Indexing `row[j+1]` out of range when processing top-down edges; bottom-up avoids all edge cases.

## Related follow-ups

- [Minimum Path Sum](03_minimum_path_sum.md)
- [Minimum Falling Path Sum](05_minimum_falling_path_sum.md)
- Pascal's Triangle (LeetCode #118)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

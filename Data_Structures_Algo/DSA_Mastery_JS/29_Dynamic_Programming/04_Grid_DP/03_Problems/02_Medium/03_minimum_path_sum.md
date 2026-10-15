# Minimum Path Sum

| | |
|---|---|
| **Topic** | Grid DP |
| **Difficulty** | Medium |
| **Pattern** | best path + reconstruction |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #64 — https://leetcode.com/problems/minimum-path-sum/ |
| **Solution file** | [03_minimum_path_sum.js](../solutions/03_minimum_path_sum.js) — open only after a real attempt |

## Problem

Given an m x n grid of non-negative numbers, find a path from top-left to bottom-right
(moving only right or down) that minimises the sum of the numbers along the path.
Return that minimum sum. Bonus: return the path itself.

## Examples

```
Input: [[1,3,1],[1,5,1],[4,2,1]]   Output: 7   Explanation: 1 -> 3 -> 1 -> 1 -> 1
Input: [[1,2,3],[4,5,6]]           Output: 12  Explanation: 1 -> 2 -> 3 -> 6
Input: [[5]]                       Output: 5
```

## Constraints & clarifying questions

```
- 1 <= m, n <= 200, 0 <= grid[i][j] <= 200
- Negative numbers? (no; with negatives the recurrence still works, min just gets smaller)
- Do they want the sum only, or the actual path too?
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *best path + reconstruction* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force recursion   O(2^(m+n)) time, O(m+n) space. cost(i, j) = grid[i][j] + min(cost(i-1, j), cost(i, j-1)), Infinity when out of bounds.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 4 — One row   O(m*n) time, O(n) space. 

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- 1x1 grid -> grid[0][0]
- single row / single column -> sum of all cells
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force recursion   O(2^(m+n)) time, O(m+n) space

```
cost(i, j) = grid[i][j] + min(cost(i-1, j), cost(i, j-1)), Infinity when out of bounds.
```

### APPROACH 2 — Memoization   O(m*n) time, O(m*n) space

### APPROACH 3 — Tabulation    O(m*n) time, O(m*n) space

```
Dry run on [[1,3,1],[1,5,1],[4,2,1]]:
grid        dp
1 3 1       1  4  5
1 5 1   ->  2  7  6       dp[1][2] = 1 + min(5, 7) = 6
4 2 1       6  8  7       dp[2][2] = 1 + min(6, 8) = 7  -> answer 7

Path reconstruction: start at (2,2) value 7. Parents: above (1,2)=6, left (2,1)=8.
7 - 1 = 6 matches "above", so move to (1,2). Repeat until (0,0).
Path = (0,0) (0,1) (0,2) (1,2) (2,2)  -> values 1,3,1,1,1 = 7.
```

### APPROACH 4 — One row   O(m*n) time, O(n) space

### DP definition

```
STATE
dp[i][j] = minimum path sum from (0, 0) to (i, j)
RECURRENCE
dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])
BASE CASES
dp[0][0] = grid[0][0]
  dp[0][j] = dp[0][j-1] + grid[0][j]   (first row: only from the left)
  dp[i][0] = dp[i-1][0] + grid[i][0]   (first column: only from above)
ANSWER
dp[m-1][n-1]
```

### Edge cases

```
- 1x1 grid -> grid[0][0]
- single row / single column -> sum of all cells
```

Full JavaScript solution with tests: [03_minimum_path_sum.js](../solutions/03_minimum_path_sum.js). Run it with `node 03_minimum_path_sum.js` from the solutions folder.

</details>

## Common mistakes

- Using 0 for out-of-grid parents in a min DP; they must be Infinity (or handle the first row/column separately).
- Trying Dijkstra or BFS; with only right/down moves the grid is a DAG and plain DP is O(m·n).
- Forgetting to add the starting cell's own cost.

## Related follow-ups

- [Triangle](04_triangle.md)
- [Dungeon Game](../03_Hard/09_dungeon_game.md)
- [Minimum Cost Climbing Stairs](../../../01_One_Dimensional_DP/03_Problems/01_Easy/03_min_cost_climbing_stairs.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

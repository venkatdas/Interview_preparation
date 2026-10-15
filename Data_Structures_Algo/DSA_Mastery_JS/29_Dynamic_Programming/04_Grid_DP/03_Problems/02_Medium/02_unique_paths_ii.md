# Unique Paths II

| | |
|---|---|
| **Topic** | Grid DP |
| **Difficulty** | Medium |
| **Pattern** | count paths + obstacles |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #63 — https://leetcode.com/problems/unique-paths-ii/ |
| **Solution file** | [02_unique_paths_ii.js](../solutions/02_unique_paths_ii.js) — open only after a real attempt |

## Problem

Same robot (top-left to bottom-right, moves right or down), but the grid now has
obstacles: grid[i][j] === 1 is a wall you cannot step on. Count the distinct paths.

## Examples

```
Input: [[0,0,0],[0,1,0],[0,0,0]]   Output: 2
  Explanation: the middle cell is blocked; go around it on the top-right or bottom-left.
Input: [[0,1],[0,0]]               Output: 1
Input: [[1]]                       Output: 0   Explanation: start is blocked
```

## Constraints & clarifying questions

```
- 1 <= m, n <= 100
- Can the start or goal be an obstacle? (yes -> answer 0)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *count paths + obstacles* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force recursion   O(2^(m+n)) time, O(m+n) space. paths(i, j) returns 0 for obstacles / out of bounds, 1 at the start, else the sum of the two parents.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 4 — One row   O(m*n) time, O(n) space. row[j] = obstacle ?

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- start or goal blocked -> 0
- obstacle in the first row: cells after it in that row are unreachable
- 1x1 grid with 0 -> 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force recursion   O(2^(m+n)) time, O(m+n) space

```
paths(i, j) returns 0 for obstacles / out of bounds, 1 at the start, else the sum of
the two parents.
```

### APPROACH 2 — Memoization   O(m*n) time, O(m*n) space

### APPROACH 3 — Tabulation    O(m*n) time, O(m*n) space

```
Dry run on [[0,0,0],[0,1,0],[0,0,0]]:
     j=0  j=1  j=2
i=0 [ 1    1    1 ]
i=1 [ 1    0    1 ]     dp[1][1] = 0 (obstacle), dp[1][2] = 1 + 0 = 1
i=2 [ 1    1    2 ]     dp[2][1] = 0 + 1 = 1, dp[2][2] = 1 + 1 = 2  -> answer 2
```

### APPROACH 4 — One row   O(m*n) time, O(n) space

```
row[j] = obstacle ? 0 : row[j] + row[j-1]. Handle j = 0 separately (no left parent).
```

### DP definition

```
STATE
dp[i][j] = number of paths from (0, 0) to (i, j) that avoid obstacles
RECURRENCE
dp[i][j] = 0                         if grid[i][j] is an obstacle
  dp[i][j] = dp[i-1][j] + dp[i][j-1]   otherwise (out-of-grid parents count as 0)
BASE CASES
dp[0][0] = grid[0][0] === 0 ? 1 : 0
  NOTE: the first row / column are NOT all 1s anymore. After the first obstacle in
  that row, every cell to its right is 0 (nothing can reach it).
ANSWER
dp[m-1][n-1]
```

### Edge cases

```
- start or goal blocked -> 0
- obstacle in the first row: cells after it in that row are unreachable
- 1x1 grid with 0 -> 1
```

Full JavaScript solution with tests: [02_unique_paths_ii.js](../solutions/02_unique_paths_ii.js). Run it with `node 02_unique_paths_ii.js` from the solutions folder.

</details>

## Common mistakes

- Filling the whole first row with 1s; cells AFTER an obstacle in the first row/column are unreachable (0).
- Forgetting the start or end cell itself can be an obstacle (answer 0).
- In the one-row version, not resetting `row[j] = 0` on an obstacle, so an old value leaks through.

## Related follow-ups

- [Unique Paths](01_unique_paths.md)
- [Dungeon Game](../03_Hard/09_dungeon_game.md)
- Unique Paths III (LeetCode #980) — backtracking, not DP

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

# Cherry Pickup

| | |
|---|---|
| **Topic** | Grid DP |
| **Difficulty** | Hard |
| **Pattern** | two walkers, 3D state |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #741 — https://leetcode.com/problems/cherry-pickup/ |
| **Solution file** | [10_cherry_pickup.js](../solutions/10_cherry_pickup.js) — open only after a real attempt |

## Problem

An n x n grid has cells: 0 = empty, 1 = a cherry, -1 = a thorn (blocked). Start at
(0, 0), walk to (n-1, n-1) moving only right or down, then walk back to (0, 0) moving
only left or up. You pick up every cherry you step on (a cell gives its cherry once).
Return the maximum number of cherries you can collect. If there is no valid round trip,
return 0.

## Examples

```
Input: [[0,1,-1],[1,0,-1],[1,1,1]]   Output: 5
  Explanation: go down, down, right, right (4 cherries), come back via the other side (1 more).
Input: [[1,1,-1],[1,-1,1],[-1,1,1]]  Output: 0   Explanation: no way to reach the corner
Input: [[1]]                         Output: 1
```

## Constraints & clarifying questions

```
- 1 <= n <= 50
- A cherry is counted once even if both trips cross that cell? (yes)
- Is (0, 0) or (n-1, n-1) ever a thorn? (possible -> answer 0)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *two walkers, 3D state* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force recursion   O(4^(2n)) time, O(n) space. Explore all 4 joint moves at each step; no caching.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 3 — Tabulation   O(n^3) time, O(n^2) space. Fill t from 2n-2 down to 0.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- start or goal is a thorn -> 0
- no path at all -> 0 (never return a negative number)
- 1x1 grid -> grid[0][0] if it is not a thorn
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force recursion   O(4^(2n)) time, O(n) space

```
Explore all 4 joint moves at each step; no caching.
```

### APPROACH 2 — Memoization   O(n^3) time, O(n^3) space

```
States: t in [0, 2n-2], r1 and r2 in [0, n) -> about 2n * n * n = O(n^3).
```

### APPROACH 3 — Tabulation   O(n^3) time, O(n^2) space

```
Fill t from 2n-2 down to 0. Each layer t only needs layer t+1, so keep two n x n grids.

Dry run on [[0,1,-1],[1,0,-1],[1,1,1]] (n = 3, last step t = 4):
  t=4: both at (2,2): 1 cherry.
  t=3: valid positions are (2,1) and (1,2); (1,2) is a thorn, so only (2,1).
       dp[3][2][2] = grid[2][1] (1, counted once) + dp[4][2][2] = 2
  t=2: positions (2,0), (1,1), (0,2 thorn). Both walkers must be able to step to (2,1):
       (2,0)->(2,1) right ok, (1,1)->(2,1) down ok.
       dp[2][2][1] = grid[2][0] + grid[1][1] + 2 = 1 + 0 + 2 = 3
       dp[2][2][2] = 1 + 2 = 3,  dp[2][1][1] = 0 + 2 = 2
  t=1: positions (1,0) and (0,1).
       dp[1][1][0] = grid[1][0] + grid[0][1] + max(dp[2][2][1], dp[2][1][1], dp[2][2][2]...)
                   = 1 + 1 + 3 = 5
  t=0: dp[0][0][0] = grid[0][0] + max(...) = 0 + 5 = 5  -> answer 5
```

### KEY IDEA: two walkers, one clock

```
Walking there and back is the same as TWO walkers both going from (0, 0) to (n-1, n-1)
at the same time. After t steps every walker satisfies row + col = t, so a walker is
fully described by (t, row). Two walkers -> state (t, row1, row2), with
col1 = t - row1 and col2 = t - row2. If both stand on the same cell, count it once.
```

### DP definition

```
STATE
dp[t][r1][r2] = max cherries collected by two walkers who have taken t steps and are
                  at rows r1 and r2 (columns t - r1 and t - r2), from here to the end
RECURRENCE
each walker moves down (row + 1) or right (row stays), so 4 combinations:
  dp[t][r1][r2] = cherries(t, r1, r2) + max over (dr1, dr2) in {0,1}x{0,1}
                  of dp[t+1][r1+dr1][r2+dr2]
  cherries = grid[r1][c1] + grid[r2][c2], but counted once when r1 === r2
BASE CASES
t = 2n - 2 (both at the corner) -> grid[n-1][n-1]
  any walker out of bounds or on a thorn -> -Infinity (invalid)
ANSWER
max(0, dp[0][0][0])
```

### Edge cases

```
- start or goal is a thorn -> 0
- no path at all -> 0 (never return a negative number)
- 1x1 grid -> grid[0][0] if it is not a thorn
```

Full JavaScript solution with tests: [10_cherry_pickup.js](../solutions/10_cherry_pickup.js). Run it with `node 10_cherry_pickup.js` from the solutions folder.

</details>

## Common mistakes

- Doing two greedy passes (best path down, then best path back); the first path's choice can ruin the second. Move both walkers at once.
- Counting a cherry twice when both walkers stand on the same cell.
- Not returning 0 when no path exists (all states are -Infinity at the end).

## Related follow-ups

- [Dungeon Game](09_dungeon_game.md)
- Cherry Pickup II (LeetCode #1463)
- [Minimum Path Sum](../02_Medium/03_minimum_path_sum.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

# Dungeon Game

| | |
|---|---|
| **Topic** | Grid DP |
| **Difficulty** | Hard |
| **Pattern** | reverse DP |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #174 — https://leetcode.com/problems/dungeon-game/ |
| **Solution file** | [09_dungeon_game.js](../solutions/09_dungeon_game.js) — open only after a real attempt |

## Problem

A knight starts at the top-left room of a dungeon and must reach the princess in the
bottom-right room, moving only right or down. Each room has a number: negative = demon
(lose health), positive = potion (gain health). The knight's health must stay >= 1 at
ALL times (entering a room with health 0 or less means death). Return the minimum
initial health needed to rescue the princess.

## Examples

```
Input: [[-2,-3,3],[-5,-10,1],[10,30,-5]]   Output: 7
  Explanation: path right -> right -> down -> down with 7 health:
  7-2=5, 5-3=2, 2+3=5, 5+1=6, 6-5=1 (never below 1).
Input: [[0]]                               Output: 1
Input: [[100]]                             Output: 1
```

## Constraints & clarifying questions

```
- 1 <= m, n <= 200, values in -1000 .. 1000
- Does the starting room's value apply? (yes, the knight enters it)
- Health must be >= 1 even after the last room? (yes)

WHY FORWARD DP FAILS
The "best" forward path (max health so far) may walk into a huge demon later. What you
need at a cell depends on the FUTURE, so we define the state "from here to the goal" and
fill the table backwards from the princess.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *reverse DP* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force recursion   O(2^(m+n)) time, O(m+n) space. need(i, j) = max(1, min(need(i+1, j), need(i, j+1)) - dungeon[i][j]).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 4 — One row   O(m*n) time, O(n) space. Process rows bottom to top, columns right to left.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- all potions -> 1
- 1x1 with a demon -> 1 - value
- the goal room is a potion -> still need at least 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force recursion   O(2^(m+n)) time, O(m+n) space

```
need(i, j) = max(1, min(need(i+1, j), need(i, j+1)) - dungeon[i][j]).
```

### APPROACH 2 — Memoization   O(m*n) time, O(m*n) space

### APPROACH 3 — Tabulation (bottom-right to top-left)   O(m*n) time, O(m*n) space

```
Dry run on [[-2,-3,3],[-5,-10,1],[10,30,-5]]:
  dp[2][2] = max(1, 1 - (-5)) = 6
  dp[2][1] = max(1, 6 - 30) = 1        dp[1][2] = max(1, 6 - 1) = 5
  dp[2][0] = max(1, 1 - 10) = 1        dp[1][1] = max(1, min(5,1) - (-10)) = 11
  dp[0][2] = max(1, 5 - 3) = 2         dp[1][0] = max(1, min(11,1) - (-5)) = 6
  dp[0][1] = max(1, min(2,11) - (-3)) = 5
  dp[0][0] = max(1, min(5,6) - (-2)) = 7   -> answer 7

  dp table:    7  5  2
               6 11  5
               1  1  6
```

### APPROACH 4 — One row   O(m*n) time, O(n) space

```
Process rows bottom to top, columns right to left. row[j] holds "below", row[j+1] holds
"right" (already updated in this pass).
```

### DP definition

```
STATE
dp[i][j] = minimum health needed when ENTERING room (i, j) so that you can still
             reach the princess alive
RECURRENCE
needAfter  = min(dp[i+1][j], dp[i][j+1])     (health required when leaving this room)
  dp[i][j]   = max(1, needAfter - dungeon[i][j])
  "max(1, ...)" because a big potion cannot push the requirement below 1.
BASE CASES
dp[m-1][n-1] = max(1, 1 - dungeon[m-1][n-1])    (must leave the goal room with >= 1)
  out-of-grid cells = Infinity (not a valid way out)
ANSWER
dp[0][0]
```

### Edge cases

```
- all potions -> 1
- 1x1 with a demon -> 1 - value
- the goal room is a potion -> still need at least 1
```

Full JavaScript solution with tests: [09_dungeon_game.js](../solutions/09_dungeon_game.js). Run it with `node 09_dungeon_game.js` from the solutions folder.

</details>

## Common mistakes

- Running the DP forward from the start; the minimum starting health depends on the FUTURE, so fill from the princess back to the start.
- Forgetting `max(1, ...)`: health must be at least 1 at every moment, and a big potion cannot make the requirement drop below 1.
- Tracking "max health so far" forward; two quantities (current health and minimum seen) do not fit one forward state.

## Related follow-ups

- [Minimum Path Sum](../02_Medium/03_minimum_path_sum.md)
- [Cherry Pickup](10_cherry_pickup.md)
- Minimum Path Cost in a Grid (LeetCode #2304)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

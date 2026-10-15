# Predict the Winner / Stone Game

| | |
|---|---|
| **Topic** | Interval DP |
| **Difficulty** | Medium |
| **Pattern** | game DP, score difference |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #486 — https://leetcode.com/problems/predict-the-winner/ · LeetCode #877 — https://leetcode.com/problems/stone-game/ |
| **Solution file** | [01_predict_the_winner_stone_game.js](../solutions/01_predict_the_winner_stone_game.js) — open only after a real attempt |

## Problem

Two players take turns picking a number from EITHER END of an array. Each number
picked is added to that player's score. Both play optimally. Return true if
player 1 can win (ties count as a win for player 1).
Stone Game (877) is the same problem with the extra promise that the array has
even length and an odd total (so there is always a winner); the same DP solves it.

## Examples

```
Input: [1, 5, 2]       Output: false
  Explanation: player 1 takes 1 or 2; player 2 then takes 5 and wins.
Input: [1, 5, 233, 7]  Output: true
  Explanation: player 1 takes 1, player 2 takes 5 or 7, player 1 takes 233.
Input: [5, 3, 4, 5]    Output: true   (Stone Game example)
```

## Constraints & clarifying questions

```
- Is a tie a win for player 1? (LeetCode 486: yes)
- 1 <= n <= 20 and values are non-negative. (DP works for any n up to ~1000.)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *game DP, score difference* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (plain recursion)   O(2^n) time, O(n) space. At each turn the current player has 2 choices (left or right).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 3 — Optimized (1D rolling array)   O(n^2) time, O(n) space. dp[l][r] only needs dp[l+1][r] (row below) and dp[l][r-1] (same row, left).

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Single element -> player 1 takes it -> true
- Two elements   -> player 1 takes the bigger -> true
- All equal      -> tie -> true
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (plain recursion)   O(2^n) time, O(n) space

```
At each turn the current player has 2 choices (left or right). Try both and take
the one that maximizes (my score - opponent score). Branching factor 2, depth n.
```

### APPROACH 2 — Memo / Tabulation (Interval DP, score difference)   O(n^2) time, O(n^2) space

```
Instead of tracking two scores, track ONE number per range.

  STATE      dp[l][r] = best (current player's score - other player's score)
                        the player to move can achieve on the sub-array nums[l..r]
  RECURRENCE dp[l][r] = max( nums[l] - dp[l+1][r],   // take left; opponent moves next
                             nums[r] - dp[l][r-1] )  // take right
             (subtract because the opponent's best difference is against us)
  BASE CASES dp[i][i] = nums[i]     (only one number left, take it)
  ANSWER     dp[0][n-1] >= 0

Why does this work? The "difference" view folds both players into one number, and
the sub-game after my move is exactly the same game on a smaller range for the
other player.

Dry run on [1, 5, 2]:
  len 1: dp[0][0]=1  dp[1][1]=5  dp[2][2]=2
  len 2: dp[0][1] = max(1-5, 5-1) = 4
         dp[1][2] = max(5-2, 2-5) = 3
  len 3: dp[0][2] = max(1 - dp[1][2], 2 - dp[0][1]) = max(1-3, 2-4) = -2
  -2 < 0 -> false

       r=0  r=1  r=2
  l=0 [ 1 ][ 4 ][ -2 ]
  l=1 [ - ][ 5 ][  3 ]
  l=2 [ - ][ - ][  2 ]
```

### APPROACH 3 — Optimized (1D rolling array)   O(n^2) time, O(n) space

```
dp[l][r] only needs dp[l+1][r] (row below) and dp[l][r-1] (same row, left).
Iterating l from n-1 down to 0 and r from l+1 up, a single array indexed by r
holds "row l+1" before we overwrite it with "row l".
```

### Edge cases

```
- Single element -> player 1 takes it -> true
- Two elements   -> player 1 takes the bigger -> true
- All equal      -> tie -> true
```

Full JavaScript solution with tests: [01_predict_the_winner_stone_game.js](../solutions/01_predict_the_winner_stone_game.js). Run it with `node 01_predict_the_winner_stone_game.js` from the solutions folder.

</details>

## Common mistakes

- Tracking each player's total separately; store the score DIFFERENCE (current player minus opponent) so one table covers both players.
- Forgetting that a tie counts as a win for player 1 in Predict the Winner (`diff >= 0`).
- Filling `dp[l][r]` row by row from the top; it depends on `dp[l+1][r]`, so loop by increasing length (or l from right to left).

## Related follow-ups

- [Minimum Score Triangulation](../02_Medium/03_minimum_score_triangulation.md)
- Stone Game II (LeetCode #1140)
- Stone Game VII (LeetCode #1690)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

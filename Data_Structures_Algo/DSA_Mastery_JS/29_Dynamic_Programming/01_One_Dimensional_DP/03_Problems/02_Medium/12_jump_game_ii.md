# Jump Game II

| | |
|---|---|
| **Topic** | 1D Dynamic Programming |
| **Difficulty** | Medium |
| **Pattern** | fewest moves (DP vs greedy BFS) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #45 — https://leetcode.com/problems/jump-game-ii/ |
| **Solution file** | [12_jump_game_ii.js](../solutions/12_jump_game_ii.js) — open only after a real attempt |

## Problem

Same jumping rules as Jump Game, but now it is guaranteed you CAN reach the
last index. Return the MINIMUM number of jumps needed.

## Examples

```
Input: [2,3,1,1,4]   Output: 2   Explanation: 0 -> 1 (jump 1), 1 -> 4 (jump 3)
Input: [2,3,0,1,4]   Output: 2
```

## Constraints & clarifying questions

```
- 1 <= nums.length <= 10^4
- Single element -> 0 jumps

DP DEFINITION
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *fewest moves (DP vs greedy BFS)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^n) time, O(n) space. Try every jump from every index, return the smallest count.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 4 — Greedy BFS "levels"   O(n) time, O(1) space. Treat each jump as one BFS level.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [0] -> 0
- [1, 2] -> 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n) time, O(n) space

```
Try every jump from every index, return the smallest count.
```

### APPROACH 2 — Memoization   O(n * maxJump) time, O(n) space


### APPROACH 3 — Tabulation   O(n * maxJump) time, O(n) space

```
Fill right to left. Dry run, nums = [2, 3, 1, 1, 4]:
  i    : 0  1  2  3  4
  dp   : 2  1  2  1  0
  dp[3] = 1 + dp[4] = 1
  dp[2] = 1 + dp[3] = 2
  dp[1] = 1 + min(dp[2], dp[3], dp[4]) = 1
  dp[0] = 1 + min(dp[1], dp[2]) = 2
```

### APPROACH 4 — Greedy BFS "levels"   O(n) time, O(1) space

```
Treat each jump as one BFS level. currentEnd = the farthest index reachable
with `jumps` jumps; farthest = the farthest reachable with jumps+1. When i
hits currentEnd we must jump again. This is a true greedy because taking the
jump that maximises the next frontier is never worse.
```

### DP definition

```
STATE:       dp[i] = min jumps to reach the last index starting from i
RECURRENCE:  dp[i] = 1 + min over j in [i+1, i+nums[i]] of dp[j]
BASE CASES:  dp[n-1] = 0
ANSWER:      dp[0]
```

### Edge cases

```
- [0] -> 0
- [1, 2] -> 1
```

Full JavaScript solution with tests: [12_jump_game_ii.js](../solutions/12_jump_game_ii.js). Run it with `node 12_jump_game_ii.js` from the solutions folder.

</details>

## Common mistakes

- Counting a jump at every index instead of only when the current "level" (window) ends.
- Looping all the way to the last index in the greedy BFS, which adds one extra jump; loop to `n - 2`.
- Returning 1 for a single-element array; you are already there, so it is 0 jumps.

## Related follow-ups

- [Jump Game](11_jump_game.md)
- [Min Cost Climbing Stairs](../01_Easy/03_min_cost_climbing_stairs.md)
- Minimum Number of Taps to Open to Water a Garden (LeetCode 1326)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

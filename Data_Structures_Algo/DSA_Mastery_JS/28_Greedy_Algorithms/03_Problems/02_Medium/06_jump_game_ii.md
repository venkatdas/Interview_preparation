# Jump Game II

| | |
|---|---|
| **Topic** | Greedy Algorithms |
| **Difficulty** | Medium |
| **Pattern** | farthest reach (BFS levels) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #45 — https://leetcode.com/problems/jump-game-ii/ |
| **Solution file** | [06_jump_game_ii.js](../solutions/06_jump_game_ii.js) — open only after a real attempt |

## Problem

Same setup as Jump Game, but the last index is guaranteed reachable.
Return the MINIMUM number of jumps to reach the last index.

## Examples

```
Input: [2,3,1,1,4]   Output: 2   Explanation: 0 -> 1 -> 4
Input: [2,3,0,1,4]   Output: 2
```

## Constraints & clarifying questions

```
- Is the end always reachable? (yes, per problem)
- Single element -> 0 jumps
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *farthest reach (BFS levels)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force / DP   O(n^2) time, O(n) space. dp[i] = min jumps to reach i.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (farthest reach, "BFS by levels")   O(n) time, O(1) space. Think of all indices reachable with k jumps as one "level" [levelStart..levelEnd].

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [0] or single element -> 0
- two elements -> 1
- never jump from the last index (loop runs to length - 2)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force / DP   O(n^2) time, O(n) space

```
dp[i] = min jumps to reach i. For every i and every j < i that can jump to i,
dp[i] = min(dp[j] + 1). Simple and correct, just slow for 10^5.
```

### APPROACH 2 — Optimal (farthest reach, "BFS by levels")   O(n) time, O(1) space

```
Think of all indices reachable with k jumps as one "level" [levelStart..levelEnd].
While scanning the current level, compute the farthest index any of them can reach.
When i hits levelEnd, we must jump: jumps++, and the next level ends at `farthest`.
```

### WHY GREEDY WORKS ("greedy stays ahead")

```
After k jumps, greedy's level covers EVERY index reachable with k jumps (it took the max of
all options, and reachability is monotone - see Jump Game). Any other strategy is at some
index inside that level or before it. So greedy is never behind, and it reaches the end
with no more jumps than any other strategy.

Dry run on [2,3,1,1,4]:
  i=0: farthest=2.  i == levelEnd(0) -> jump 1, levelEnd=2
  i=1: farthest=max(2,1+3)=4
  i=2: farthest=max(4,2+1)=4. i == levelEnd(2) -> jump 2, levelEnd=4 (covers last index)
  stop before the last index -> 2
```

### Edge cases

```
- [0] or single element -> 0
- two elements -> 1
- never jump from the last index (loop runs to length - 2)
```

Full JavaScript solution with tests: [06_jump_game_ii.js](../solutions/06_jump_game_ii.js). Run it with `node 06_jump_game_ii.js` from the solutions folder.

</details>

## Common mistakes

- Counting a jump at the last index (loop to `n - 2`, not `n - 1`).
- Jumping to the index with the biggest `nums[i]` instead of the one that reaches farthest (`i + nums[i]`).
- Returning 1 for a single-element array - the answer is 0.

## Related follow-ups

- [Jump Game](../02_Medium/05_jump_game.md)
- Minimum Number of Taps to Open to Water a Garden (LeetCode #1326)
- Video Stitching (LeetCode #1024)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

# Jump Game

| | |
|---|---|
| **Topic** | 1D Dynamic Programming |
| **Difficulty** | Medium |
| **Pattern** | can reach (DP vs greedy) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #55 — https://leetcode.com/problems/jump-game/ |
| **Solution file** | [11_jump_game.js](../solutions/11_jump_game.js) — open only after a real attempt |

## Problem

nums[i] is the MAXIMUM jump length from index i. Starting at index 0,
can you reach the last index?

## Examples

```
Input: [2,3,1,1,4]   Output: true    Explanation: 0 -> 1 -> 4
Input: [3,2,1,0,4]   Output: false   Explanation: you always land on index 3 (a 0) and get stuck
```

## Constraints & clarifying questions

```
- 1 <= nums.length <= 10^4, 0 <= nums[i] <= 10^5
- Single element: already at the last index -> true

DP DEFINITION
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *can reach (DP vs greedy)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^n) time, O(n) space. From i, try every jump length 1..nums[i] recursively.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 4 — Greedy   O(n) time, O(1) space   (the real interview answer). Track `farthest` = the furthest index reachable so far.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [0] -> true (already at the end)
- [0, 1] -> false
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n) time, O(n) space

```
From i, try every jump length 1..nums[i] recursively.
```

### APPROACH 2 — Memoization   O(n * maxJump) time, O(n) space


### APPROACH 3 — Tabulation   O(n * maxJump) time, O(n) space

```
Fill right to left. Dry run, nums = [2, 3, 1, 1, 4]:
  i    : 0  1  2  3  4
  dp   : T  T  T  T  T     dp[3]: j=4 -> T ; dp[2]: j=3 -> T ; dp[1]: j=2 -> T ; dp[0]: j=1 -> T
nums = [3, 2, 1, 0, 4]:
  dp   : F  F  F  F  T     dp[3]: nums[3]=0, no jumps -> F ; dp[2]: j=3 -> F ; ...
```

### APPROACH 4 — Greedy   O(n) time, O(1) space   (the real interview answer)

```
Track `farthest` = the furthest index reachable so far. Scan left to right;
if i > farthest we're stuck. Otherwise farthest = max(farthest, i + nums[i]).
This works because reachability is "monotone": if you can reach index k you
can reach every index before k. So we only need the max frontier, not the
whole table. That observation is what lets greedy beat DP here.
```

### DP definition

```
STATE:       dp[i] = can we reach the last index starting from i?
RECURRENCE:  dp[i] = OR over j in [i+1, i+nums[i]] of dp[j]
BASE CASES:  dp[n-1] = true
ANSWER:      dp[0]
```

### Edge cases

```
- [0] -> true (already at the end)
- [0, 1] -> false
```

Full JavaScript solution with tests: [11_jump_game.js](../solutions/11_jump_game.js). Run it with `node 11_jump_game.js` from the solutions folder.

</details>

## Common mistakes

- Returning false as soon as you see a 0. A 0 is only a problem if you cannot jump over it.
- Forgetting the single-element array: you are already at the end, so the answer is true.
- Not stopping the greedy scan when `i > farthest`; any index past that point is unreachable.

## Related follow-ups

- [Jump Game II](12_jump_game_ii.md)
- [Frog Jump](../../../06_Advanced_DP/03_Problems/03_Hard/04_frog_jump.md)
- Jump Game III (LeetCode 1306)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

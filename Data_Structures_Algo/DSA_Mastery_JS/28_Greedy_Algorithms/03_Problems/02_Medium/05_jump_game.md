# Jump Game

| | |
|---|---|
| **Topic** | Greedy Algorithms |
| **Difficulty** | Medium |
| **Pattern** | farthest reach |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #55 — https://leetcode.com/problems/jump-game/ |
| **Solution file** | [05_jump_game.js](../solutions/05_jump_game.js) — open only after a real attempt |

## Problem

nums[i] is the maximum jump length from index i. You start at index 0.
Return true if you can reach the last index.

## Examples

```
Input: [2,3,1,1,4]   Output: true    Explanation: 0 -> 1 -> 4
Input: [3,2,1,0,4]   Output: false   Explanation: you always land on index 3 (value 0)
```

## Constraints & clarifying questions

```
- Are values non-negative? (yes)
- Single element array? (already at the last index -> true)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *farthest reach* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^n) time, O(n) space (recursion). From index i try every jump 1..nums[i] and recurse.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (farthest reach)   O(n) time, O(1) space. Keep `farthest` = the farthest index reachable so far.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [0]        -> true (already there)
- [0, 1]     -> false
- large first jump covering everything -> true early exit
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n) time, O(n) space (recursion)

```
From index i try every jump 1..nums[i] and recurse. (Memoising it gives the O(n^2) DP.)
```

### APPROACH 2 — Optimal (farthest reach)   O(n) time, O(1) space

```
Keep `farthest` = the farthest index reachable so far. Walk i from 0. If i > farthest,
index i is unreachable, so the end is unreachable too. Otherwise extend farthest with
i + nums[i]. If farthest ever covers the last index, return true.
```

### WHY GREEDY WORKS

```
Reachability is "monotone": if you can reach index j you can reach every index before j
(just jump shorter). So the only thing that matters is the single number `farthest`.
Tracking the maximum reach is exactly keeping the best option alive - nothing is lost by
not remembering which path produced it.

Dry run on [3,2,1,0,4]:
  i=0 farthest=max(0,0+3)=3
  i=1 farthest=max(3,1+2)=3
  i=2 farthest=max(3,2+1)=3
  i=3 farthest=max(3,3+0)=3
  i=4 > farthest(3) -> false
```

### Edge cases

```
- [0]        -> true (already there)
- [0, 1]     -> false
- large first jump covering everything -> true early exit
```

Full JavaScript solution with tests: [05_jump_game.js](../solutions/05_jump_game.js). Run it with `node 05_jump_game.js` from the solutions folder.

</details>

## Common mistakes

- Not checking `i > farthest` before using `nums[i]` - you cannot jump from an index you cannot reach.
- Assuming a 0 always means failure; a 0 only blocks you if nothing jumps over it.
- Forgetting that a single-element array is already at the end (true).

## Related follow-ups

- [Jump Game II](../02_Medium/06_jump_game_ii.md)
- Jump Game III (LeetCode #1306) - BFS
- Video Stitching (LeetCode #1024)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

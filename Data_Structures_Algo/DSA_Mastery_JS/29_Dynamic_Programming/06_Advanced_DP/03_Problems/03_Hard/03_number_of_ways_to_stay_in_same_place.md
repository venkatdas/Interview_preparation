# Number of Ways to Stay in the Same Place After Some Steps

| | |
|---|---|
| **Topic** | Advanced DP (Bitmask, Tree, Digit, State Machine) |
| **Difficulty** | Hard |
| **Pattern** | 2D DP, rolling row |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1269 — https://leetcode.com/problems/number-of-ways-to-stay-in-the-same-place-after-some-steps/ |
| **Solution file** | [03_number_of_ways_to_stay_in_same_place.js](../solutions/03_number_of_ways_to_stay_in_same_place.js) — open only after a real attempt |

## Problem

You stand at index 0 of an array of length arrLen. In one step you can move left,
move right, or stay (never leaving the array). Count the ways to be back at index 0
after exactly `steps` steps, modulo 1e9 + 7.

## Examples

```
Input: steps = 3, arrLen = 2   Output: 4
  Explanation: RLS, RSL, SRL, SSS   (R = right, L = left, S = stay)
Input: steps = 2, arrLen = 4   Output: 2   Explanation: RL, SS
Input: steps = 4, arrLen = 2   Output: 8
```

## Constraints & clarifying questions

```
- 1 <= steps <= 500, 1 <= arrLen <= 10^6
- Key observation: in `steps` moves you can never get farther than steps/2 from 0
  and still come back, so only min(arrLen, steps/2 + 1) positions matter.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *2D DP, rolling row* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (plain recursion)   O(3^steps) time, O(steps) space. ways(stepsLeft, position): try stay / left / right and recurse.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 3 — Rolling array   O(1) extra rows: only the previous row is needed.. 

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- arrLen = 1 -> only "stay" is possible -> answer 1
- steps = 1 -> 1 (must stay)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (plain recursion)   O(3^steps) time, O(steps) space

```
ways(stepsLeft, position): try stay / left / right and recurse.
```

### APPROACH 2 — 2D DP (steps x positions)   O(steps * min(arrLen, steps)) time, same space

### APPROACH 3 — Rolling array   O(1) extra rows: only the previous row is needed.

### DP definition

```
STATE      dp[s][p] = number of ways to be at position p after s steps.
RECURRENCE dp[s][p] = dp[s-1][p] (stayed) + dp[s-1][p-1] (came from left)
+ dp[s-1][p+1] (came from right), skipping out-of-range neighbours.
BASE CASES dp[0][0] = 1 (at start, before moving), dp[0][p>0] = 0.
ANSWER     dp[steps][0].
The position limit is maxPos = min(arrLen - 1, steps / 2) because going further
means you cannot return in time.

Dry run steps = 3, arrLen = 2 (positions 0 and 1):
  s=0 : [1, 0]
  s=1 : [1+0, 1+0]        = [1, 1]
  s=2 : [1+1, 1+1]        = [2, 2]
  s=3 : [2+2, 2+2]        = [4, 4]   -> dp[3][0] = 4
```

### Edge cases

```
- arrLen = 1 -> only "stay" is possible -> answer 1
- steps = 1 -> 1 (must stay)
```

Full JavaScript solution with tests: [03_number_of_ways_to_stay_in_same_place.js](../solutions/03_number_of_ways_to_stay_in_same_place.js). Run it with `node 03_number_of_ways_to_stay_in_same_place.js` from the solutions folder.

</details>

## Common mistakes

- Sizing the position dimension by arrLen (up to 10^6); you can never go further than `steps / 2` and still return, so cap it at `min(arrLen, steps / 2 + 1)`.
- Letting the pointer move to -1 or arrLen.
- Forgetting the modulo on every addition.

## Related follow-ups

- [Count Vowels Permutation](02_count_vowels_permutation.md)
- [Climbing Stairs](../../../01_One_Dimensional_DP/03_Problems/01_Easy/02_climbing_stairs.md)
- Knight Probability in Chessboard (LeetCode #688)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

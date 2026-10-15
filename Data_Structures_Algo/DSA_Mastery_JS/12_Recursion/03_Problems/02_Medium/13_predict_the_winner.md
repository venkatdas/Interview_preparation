# Predict the Winner

| | |
|---|---|
| **Topic** | Recursion |
| **Difficulty** | Medium |
| **Pattern** | minimax recursion + memo |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md), [Dynamic Programming overview](../../../29_Dynamic_Programming/01_Concepts/OVERVIEW.md) |
| **Source** | LeetCode #486 — https://leetcode.com/problems/predict-the-winner/ (statement paraphrased in our own words) |
| **Solution file** | [13_predict_the_winner.js](../solutions/13_predict_the_winner.js) — open only after a real attempt |

## Problem

Two players take turns removing a number from EITHER end of an array and adding it to
their score. Player 1 moves first. Both play optimally. Return true if player 1 ends
with a score >= player 2's score.

## Examples

```
[1, 5, 2]       -> false   (whatever P1 takes, P2 grabs the 5)
[1, 5, 233, 7]  -> true    (P1 takes 1; whatever P2 takes, P1 can take 233)
[7]             -> true
```

## Constraints & clarifying questions

```
- 1 <= n <= 20, 0 <= nums[i] <= 10^7
- A tie counts as a win for player 1 (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 35 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Two-player optimal play = *minimax*. The state is just the remaining interval [i, j].

</details>

<details><summary>Hint 2</summary>

**Start simple.** Return the score DIFFERENCE for the player to move: take left gives nums[i] - diff(i+1, j), take right gives nums[j] - diff(i, j-1).

</details>

<details><summary>Hint 3</summary>

**The key idea.** The minus sign is the turn switch: the opponent's best advantage counts against you. Only n^2 intervals exist, so memoize on (i, j).

</details>

<details><summary>Hint 4</summary>

**Edge cases.** One element: that player wins it. Ties count as a win for player 1 (>= 0).

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (minimax on score difference)   O(2^n) time, O(n) stack

```
PROMISE: diff(i, j) = best (my score - opponent score) the player TO MOVE can force
on nums[i..j].
  base: i === j -> nums[i]
  step: take left  -> nums[i] - diff(i+1, j)   (the opponent then plays optimally,
        take right -> nums[j] - diff(i, j-1)    and their advantage counts against me)
        return the max of the two.
Answer: diff(0, n-1) >= 0. Using the DIFFERENCE removes the need to track two scores
and whose turn it is: the sign flip IS the turn change.
```

### APPROACH 2 — Optimal (same recursion + memo on (i, j))   O(n^2) time, O(n^2) space

```
Only n^2 distinct (i, j) intervals exist, so cache them. This is interval DP top-down.

Dry run [1, 5, 2]:
  diff(1,2) = max(5 - 2, 2 - 5) = 3      diff(0,1) = max(1 - 5, 5 - 1) = 4
  diff(0,2) = max(1 - diff(1,2), 2 - diff(0,1)) = max(-2, -2) = -2 -> false
```

### Complexity

| Approach | Time | Space |
|---|---|---|
| minimax recursion | O(2^n) | O(n) stack |
| memoized | O(n^2) | O(n^2) |

### Edge cases

```
- n = 1 -> true;  n = 2 -> true (take the larger)
- even n: player 1 can always win (take all even or all odd indices), a nice check
```

### Common mistakes

- Tracking both players' scores and a turn flag (more state, easier to get wrong).
- Using > 0 instead of >= 0.
- Memoizing on a key that ignores one of i or j.

Full JavaScript solution with tests: [13_predict_the_winner.js](../solutions/13_predict_the_winner.js). Run it with `node 13_predict_the_winner.js` from the solutions folder.

</details>

## Related follow-ups

- Stone Game (LeetCode #877)
- Stone Game II (LeetCode #1140)
- Can I Win (LeetCode #464)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down the recursive PROMISE you used in one sentence. If you could not state it, re-solve.
- Re-solve from scratch in 3 days, then in 1 week.

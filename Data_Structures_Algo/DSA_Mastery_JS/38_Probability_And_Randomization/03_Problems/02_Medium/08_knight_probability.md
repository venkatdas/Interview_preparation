# Knight Probability in Chessboard

| | |
|---|---|
| **Topic** | Probability and Randomization |
| **Difficulty** | Medium |
| **Pattern** | probability DP (forward) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #688 — https://leetcode.com/problems/knight-probability-in-chessboard/ (statement paraphrased, not copied) |
| **Solution file** | [08_knight_probability.js](../solutions/08_knight_probability.js) — open only after a real attempt |

## Problem

A knight starts at `(row, column)` on an `n x n` board and makes exactly `k` moves. Each move is one of the 8 knight moves chosen uniformly at random, even if it would leave the board. Once the knight leaves the board it stays off. Return the probability that it is still on the board after the `k` moves.

## Examples

```
n = 3, k = 2, row = 0, column = 0 -> 0.0625
  From (0,0) only 2 of the 8 moves stay on board. From each of those, again 2 of 8.
  (2/8) * (2/8) = 0.0625
n = 1, k = 0, row = 0, column = 0 -> 1
```

## Constraints & clarifying questions

```
- 1 <= n <= 25, 0 <= k <= 100 -> 8^100 paths is impossible
- Answers within 1e-5 are accepted
- Does the knight come back after leaving? (no)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** "Return the probability" with a small state space is *probability DP*. See Pattern F in section 13 of [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** Recursion: prob(r, c, k) = average of prob(next, k - 1) over the 8 moves; off board -> 0; k = 0 -> 1. Why is it exponential?

</details>

<details><summary>Hint 3</summary>

**The key idea.** State = (cell, moves made). Keep a grid dp of "probability of being here now". Each step, every cell pushes dp / 8 to each on-board target. Mass pushed off the board disappears. Answer = sum of the grid after k steps.

</details>

<details><summary>Hint 4</summary>

**Edge cases.** k = 0 -> 1. n <= 2 -> every move leaves the board. Allocate a fresh grid each step (or swap two grids).

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (Recurse over all paths)   O(8^k) time, O(k) stack

```
f(r, c, k) = 0 if off board, 1 if k = 0,
           else (1/8) * sum over 8 moves of f(r+dr, c+dc, k-1)
```

### APPROACH 2 — Optimal (Forward probability DP)   O(k * n^2 * 8) time, O(n^2) space

```
dp[row][column] = 1
repeat k times:
    next = zero grid
    for every cell with dp > 0:
        for each move to an on-board cell: next[target] += dp[cell] / 8
    dp = next
return sum(dp)
```

### Dry run

```
n=3, k=2, start (0,0)
  step 0: dp(0,0) = 1
  step 1: (1,2) = 1/8, (2,1) = 1/8                    sum 0.25
  step 2: (1,2) sends 1/64 to (0,0) and (2,0)
          (2,1) sends 1/64 to (0,0) and (0,2)         sum 4/64 = 0.0625
```

### Complexity

- Brute force: O(8^k) time, O(k) stack
- Optimal: O(k * n^2 * 8) time, O(n^2) space

### Edge cases

```
- k = 0 -> 1
- n = 1 or 2 with k >= 1 -> 0
- central square on 8x8 with k = 1 -> 1 (all 8 moves stay on)
```

### Common mistakes

- Dividing by the number of valid moves instead of 8 (the knight can step off).
- Updating dp in place during a step (mixes step t and t+1 values).
- Trying Monte Carlo: too noisy for 1e-5.

Full JavaScript solution with tests: [08_knight_probability.js](../solutions/08_knight_probability.js). Run it with `node 08_knight_probability.js` from the solutions folder.

</details>

## Related follow-ups

- Out of Boundary Paths (LeetCode 576)
- Toss Strange Coins (LeetCode 1230)
- Number of Ways to Stay in the Same Place After Some Steps (LeetCode 1269)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

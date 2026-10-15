# Climbing Stairs

| | |
|---|---|
| **Topic** | 1D Dynamic Programming |
| **Difficulty** | Easy |
| **Pattern** | fibonacci / count ways |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #70 — https://leetcode.com/problems/climbing-stairs/ |
| **Solution file** | [02_climbing_stairs.js](../solutions/02_climbing_stairs.js) — open only after a real attempt |

## Problem

You are climbing a staircase with n steps. Each move you can climb 1 or 2
steps. How many distinct ways can you reach the top?

## Examples

```
Input: n = 2   Output: 2   Explanation: 1+1, 2
Input: n = 3   Output: 3   Explanation: 1+1+1, 1+2, 2+1
Input: n = 5   Output: 8
```

## Constraints & clarifying questions

```
- 1 <= n <= 45 (answer fits in a normal number)
- Does order matter? (yes: 1+2 and 2+1 are different ways)

DP DEFINITION
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *fibonacci / count ways* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^n) time, O(n) space. Try both moves from every step.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 4 — Space optimized   O(n) time, O(1) space. Keep only the last two values.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 1 -> 1
- n = 2 -> 2
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n) time, O(n) space

```
Try both moves from every step. ways(n) = ways(n-1) + ways(n-2).
```

### APPROACH 2 — Memoization   O(n) time, O(n) space

```
Cache ways(i) so each step is solved once.
```

### APPROACH 3 — Tabulation   O(n) time, O(n) space

```
Dry run, n = 5:
  step : 0  1  2  3  4  5
  dp   : 1  1  2  3  5  8
It is Fibonacci shifted by one.
```

### APPROACH 4 — Space optimized   O(n) time, O(1) space

```
Keep only the last two values.
```

### DP definition

```
STATE:       dp[i] = number of ways to reach step i
RECURRENCE:  dp[i] = dp[i-1] + dp[i-2]
(last move was either a 1-step from i-1 or a 2-step from i-2)
BASE CASES:  dp[0] = 1 (one way to stand at the bottom), dp[1] = 1
ANSWER:      dp[n]
```

### Edge cases

```
- n = 1 -> 1
- n = 2 -> 2
```

Full JavaScript solution with tests: [02_climbing_stairs.js](../solutions/02_climbing_stairs.js). Run it with `node 02_climbing_stairs.js` from the solutions folder.

</details>

## Common mistakes

- Setting `ways(0) = 0`. There is exactly one way to stand still, so `ways(0) = 1`; otherwise every count collapses.
- Off-by-one between "step index" and "number of steps climbed" when building the table.
- Returning `n` for small inputs by guesswork instead of letting the base cases handle `n = 1` and `n = 2`.

## Related follow-ups

- [Fibonacci Number](01_fibonacci_number.md)
- [Min Cost Climbing Stairs](03_min_cost_climbing_stairs.md)
- [Combination Sum IV (count ordered ways)](../../../02_Knapsack/03_Problems/02_Medium/06_combination_sum_iv.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

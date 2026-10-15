# Perfect Squares

| | |
|---|---|
| **Topic** | 1D Dynamic Programming |
| **Difficulty** | Medium |
| **Pattern** | amount DP |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #279 — https://leetcode.com/problems/perfect-squares/ |
| **Solution file** | [14_perfect_squares.js](../solutions/14_perfect_squares.js) — open only after a real attempt |

## Problem

Return the least number of perfect square numbers (1, 4, 9, 16, ...) that
sum to n.

## Examples

```
Input: n = 12   Output: 3   Explanation: 4 + 4 + 4
Input: n = 13   Output: 2   Explanation: 4 + 9
```

## Constraints & clarifying questions

```
- 1 <= n <= 10^4
- Is an answer always possible? (yes, 1 is a perfect square)

DP DEFINITION
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *amount DP* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   exponential time. Subtract every square and recurse, keep the minimum.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 4 — Not needed. The table already is 1D and every cell may look far back, so no rolling trick.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 1 -> 1
- n is itself a perfect square -> 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   exponential time

```
Subtract every square and recurse, keep the minimum.
```

### APPROACH 2 — Memoization   O(n * sqrt(n)) time, O(n) space


### APPROACH 3 — Tabulation   O(n * sqrt(n)) time, O(n) space

```
Dry run, n = 12 (squares 1, 4, 9):
  i   : 0  1  2  3  4  5  6  7  8  9  10 11 12
  dp  : 0  1  2  3  1  2  3  4  2  1  2  3  3
  dp[12] = 1 + min(dp[11], dp[8], dp[3]) = 1 + min(3, 2, 3) = 3
```

### APPROACH 4 — Not needed

```
The table already is 1D and every cell may look far back, so no rolling trick.
(A math fact, Lagrange's four-square theorem, gives an O(sqrt n) solution,
but interviewers want the DP.)
```

### DP definition

```
STATE:       dp[i] = min number of squares that sum to i
RECURRENCE:  dp[i] = 1 + min over every square s &lt;= i of dp[i - s]
BASE CASES:  dp[0] = 0
ANSWER:      dp[n]
This is "Coin Change" where the coins are the perfect squares.
```

### Edge cases

```
- n = 1 -> 1
- n is itself a perfect square -> 1
```

Full JavaScript solution with tests: [14_perfect_squares.js](../solutions/14_perfect_squares.js). Run it with `node 14_perfect_squares.js` from the solutions folder.

</details>

## Common mistakes

- Greedy "take the biggest square first": 12 = 9 + 1 + 1 + 1 (4) but 4 + 4 + 4 is 3.
- Looping over every j < i instead of only perfect squares, which turns O(n√n) into O(n²).
- Initialising the table with 0 instead of a large value (or `i`), so `min` never improves.

## Related follow-ups

- [Coin Change](15_coin_change.md)
- [Integer Break](16_integer_break.md)
- [Unbounded Knapsack](../../../02_Knapsack/03_Problems/02_Medium/02_unbounded_knapsack_basic.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

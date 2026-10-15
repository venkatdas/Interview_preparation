# Coin Change

| | |
|---|---|
| **Topic** | 1D Dynamic Programming |
| **Difficulty** | Medium |
| **Pattern** | amount DP (unbounded) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #322 — https://leetcode.com/problems/coin-change/ |
| **Solution file** | [15_coin_change.js](../solutions/15_coin_change.js) — open only after a real attempt |

## Problem

Given coin denominations and an amount, return the FEWEST coins needed to
make that amount, or -1 if impossible. You have unlimited coins of each kind.

## Examples

```
Input: coins = [1,2,5], amount = 11   Output: 3    Explanation: 5 + 5 + 1
Input: coins = [2], amount = 3        Output: -1
Input: coins = [1], amount = 0        Output: 0
```

## Constraints & clarifying questions

```
- 1 <= coins.length <= 12, 1 <= coins[i] <= 2^31-1, 0 <= amount <= 10^4
- Unlimited supply of each coin? (yes - this is the UNBOUNDED version)

This file is the plain 1D "DP on amount" view. The same problem appears in
../../29_Dynamic_Programming/02_Knapsack/ as an unbounded knapsack; both views give the same code.

DP DEFINITION
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *amount DP (unbounded)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(coins^amount) time. Subtract every coin and recurse.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 3 — Tabulation   O(amount * coins) time, O(amount) space. Dry run, coins = [1, 2, 5], amount = 11: a   : 0  1  2  3  4  5  6  7  8  9  10 11 dp  : 0  1  1  2  2  1  2  2  3  3  2  3 dp[11] = 1 + min(dp[10], dp[9], dp[6]) = 1 + min(2, 3, 2) = 3

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- amount = 0 -> 0
- no combination works -> -1 (keep Infinity in the table, convert at the end)
- a coin larger than amount is simply skipped
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(coins^amount) time

```
Subtract every coin and recurse. Exponential branching.
```

### APPROACH 2 — Memoization   O(amount * coins) time, O(amount) space


### APPROACH 3 — Tabulation   O(amount * coins) time, O(amount) space

```
Dry run, coins = [1, 2, 5], amount = 11:
  a   : 0  1  2  3  4  5  6  7  8  9  10 11
  dp  : 0  1  1  2  2  1  2  2  3  3  2  3
  dp[11] = 1 + min(dp[10], dp[9], dp[6]) = 1 + min(2, 3, 2) = 3
```

### DP definition

```
STATE:       dp[a] = fewest coins to make amount a  (Infinity if impossible)
RECURRENCE:  dp[a] = 1 + min over coins c &lt;= a of dp[a - c]
BASE CASES:  dp[0] = 0
ANSWER:      dp[amount] === Infinity ? -1 : dp[amount]
```

### Edge cases

```
- amount = 0 -> 0
- no combination works -> -1 (keep Infinity in the table, convert at the end)
- a coin larger than amount is simply skipped
```

Full JavaScript solution with tests: [15_coin_change.js](../solutions/15_coin_change.js). Run it with `node 15_coin_change.js` from the solutions folder.

</details>

## Common mistakes

- Greedy "biggest coin first" fails, e.g. coins [1, 3, 4] and amount 6 (greedy 3 coins, best 2).
- Using 0 as "impossible" in a min table; use Infinity and convert to -1 at the end.
- Forgetting amount 0 → 0 coins.

## Related follow-ups

- [Coin Change (knapsack view)](../../../02_Knapsack/03_Problems/02_Medium/04_coin_change_min_coins.md)
- [Coin Change II](../../../02_Knapsack/03_Problems/02_Medium/05_coin_change_ii.md)
- [Perfect Squares](14_perfect_squares.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

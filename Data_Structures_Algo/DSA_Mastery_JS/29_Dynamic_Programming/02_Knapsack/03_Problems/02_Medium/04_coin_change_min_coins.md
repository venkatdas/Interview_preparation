# Coin Change

| | |
|---|---|
| **Topic** | Knapsack DP |
| **Difficulty** | Medium |
| **Pattern** | unbounded, min variant |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #322 — https://leetcode.com/problems/coin-change/ |
| **Solution file** | [04_coin_change_min_coins.js](../solutions/04_coin_change_min_coins.js) — open only after a real attempt |

## Problem

Given coin denominations and an amount, return the FEWEST coins needed to make
exactly that amount. Unlimited coins of each kind. Return -1 if impossible.

## Examples

```
Input: coins=[1,2,5], amount=11   Output: 3    Explanation: 5 + 5 + 1
Input: coins=[2], amount=3        Output: -1
Input: coins=[1], amount=0        Output: 0
```

## Constraints & clarifying questions

```
- Unlimited supply of each coin? (yes -> unbounded knapsack, "min" variant)
- amount can be 0? (yes -> 0 coins)
- Greedy (largest coin first) works? (NO: coins=[1,3,4], amount 6 -> greedy 4+1+1=3, best 3+3=2)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *unbounded, min variant* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(coins^amount) time, O(amount) space. For the remaining amount try every coin, recurse, take the min.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — DP (unbounded knapsack, MIN variant)   O(n * amount) time, O(amount) space. 

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- amount 0 -> 0
- no coin divides the amount -> -1
- coin larger than amount -> skipped
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(coins^amount) time, O(amount) space

```
For the remaining amount try every coin, recurse, take the min. Same remaining
amount is recomputed countless times.
```

### APPROACH 2 — DP (unbounded knapsack, MIN variant)   O(n * amount) time, O(amount) space


### DP definition

```
STATE      dp[a] = fewest coins to make amount a
RECURRENCE dp[a] = 1 + min over coins c &lt;= a of dp[a - c]
BASE CASES dp[0] = 0; "impossible" states start as Infinity (min-variant init!)
ANSWER     dp[amount], or -1 if still Infinity
Dry run: coins=[1,2,5], amount=6
  a:     0  1  2  3  4  5  6
  dp:    0  1  1  2  2  1  2      dp[6] = 1 + min(dp[5]=1, dp[4]=2, dp[1]=1) = 2  (5+1)
```

### Edge cases

```
- amount 0 -> 0
- no coin divides the amount -> -1
- coin larger than amount -> skipped
```

Full JavaScript solution with tests: [04_coin_change_min_coins.js](../solutions/04_coin_change_min_coins.js). Run it with `node 04_coin_change_min_coins.js` from the solutions folder.

</details>

## Common mistakes

- Greedy "largest coin first" does not work for arbitrary coin systems.
- Initialising with 0 instead of Infinity, so every amount looks free.
- Returning Infinity instead of -1 when the amount cannot be made.

## Related follow-ups

- [Coin Change II](05_coin_change_ii.md)
- [Perfect Squares](../../../01_One_Dimensional_DP/03_Problems/02_Medium/14_perfect_squares.md)
- [Coin Change (1D DP view)](../../../01_One_Dimensional_DP/03_Problems/02_Medium/15_coin_change.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

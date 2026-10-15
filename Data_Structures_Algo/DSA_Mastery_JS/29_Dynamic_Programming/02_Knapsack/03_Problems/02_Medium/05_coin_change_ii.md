# Coin Change II

| | |
|---|---|
| **Topic** | Knapsack DP |
| **Difficulty** | Medium |
| **Pattern** | unbounded, count combinations |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #518 — https://leetcode.com/problems/coin-change-ii/ |
| **Solution file** | [05_coin_change_ii.js](../solutions/05_coin_change_ii.js) — open only after a real attempt |

## Problem

Given coin denominations and an amount, return the NUMBER of combinations
that make up that amount. Unlimited coins. Order does not matter:
2+1+2 and 1+2+2 are the same combination.

## Examples

```
Input: amount=5, coins=[1,2,5]   Output: 4
  Explanation: 5 | 2+2+1 | 2+1+1+1 | 1+1+1+1+1
Input: amount=3, coins=[2]       Output: 0
Input: amount=10, coins=[10]     Output: 1
```

## Constraints & clarifying questions

```
- Combinations (order ignored) or permutations (order matters)? (combinations here;
  for permutations see 06-combination-sum-iv)
- amount 0? (yes -> 1 way: use no coins)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *unbounded, count combinations* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(exponential) time, O(amount) space. Decide how many of coin[index] to use (0, 1, 2, ...), then move to the next coin.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — DP (unbounded knapsack, COUNT variant)   O(n * amount) time, O(amount) space. 

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- amount 0 -> 1
- no coins and amount > 0 -> 0
- answers can be large; LeetCode promises they fit in 32-bit ints
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(exponential) time, O(amount) space

```
Decide how many of coin[index] to use (0, 1, 2, ...), then move to the next
coin. Fixing the coin order is what stops us from counting 1+2 and 2+1 twice.
```

### APPROACH 2 — DP (unbounded knapsack, COUNT variant)   O(n * amount) time, O(amount) space


### DP definition

```
STATE      dp[a] = number of combinations making amount a using coins seen so far
RECURRENCE dp[a] += dp[a - coin]       (ways that use at least one more of this coin)
BASE CASES dp[0] = 1 (one way to make 0: take nothing) - count-variant init!
ANSWER     dp[amount]
LOOP ORDER MATTERS: coins outer, amount inner. Each coin is "introduced" once,
so every combination is counted in exactly one order (the coin order).

Dry run: coins=[1,2,5], amount=5
  start         dp = [1,0,0,0,0,0]
  coin 1        dp = [1,1,1,1,1,1]
  coin 2        dp = [1,1,2,2,3,3]   dp[4] = 1 + dp[2]=2 -> 3
  coin 5        dp = [1,1,2,2,3,4]
  answer 4
```

### Edge cases

```
- amount 0 -> 1
- no coins and amount > 0 -> 0
- answers can be large; LeetCode promises they fit in 32-bit ints
```

Full JavaScript solution with tests: [05_coin_change_ii.js](../solutions/05_coin_change_ii.js). Run it with `node 05_coin_change_ii.js` from the solutions folder.

</details>

## Common mistakes

- Putting the amount loop outside the coin loop; that counts orderings (permutations) instead of combinations.
- Setting `dp[0] = 0`; there is exactly one way to make 0 (use no coins).
- Mixing up argument order: this problem passes `(amount, coins)`.

## Related follow-ups

- [Combination Sum IV](06_combination_sum_iv.md)
- [Coin Change](04_coin_change_min_coins.md)
- [Target Sum](07_target_sum.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

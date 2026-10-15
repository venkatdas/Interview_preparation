# Best Time to Buy and Sell Stock with Transaction Fee

| | |
|---|---|
| **Topic** | 1D Dynamic Programming |
| **Difficulty** | Medium |
| **Pattern** | state machine |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #714 — https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/ |
| **Solution file** | [19_stock_with_transaction_fee.js](../solutions/19_stock_with_transaction_fee.js) — open only after a real attempt |

## Problem

prices[i] is the stock price on day i. Unlimited transactions, one share at
a time, and every completed transaction (buy + sell) costs `fee`.
Return the max profit.

## Examples

```
Input: prices = [1,3,2,8,4,9], fee = 2   Output: 8
  Explanation: buy 1, sell 8 (-2 fee) = 5 ; buy 4, sell 9 (-2 fee) = 3 ; total 8
Input: prices = [1,3,7,5,10,3], fee = 3  Output: 6
```

## Constraints & clarifying questions

```
- 1 <= prices.length <= 5*10^4, 0 <= fee < 5*10^4
- When is the fee charged? (once per transaction; we charge it on sell)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *state machine* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^n) time, O(n) space. Recursion on (day, holding?) trying buy / sell / wait.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 4 — Space optimized   O(n) time, O(1) space. 

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- fee larger than any possible gain -> 0
- single day -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n) time, O(n) space

```
Recursion on (day, holding?) trying buy / sell / wait.
```

### APPROACH 2 — Memoization   O(n) time, O(n) space


### APPROACH 3 — Tabulation   O(n) time, O(n) space

```
Dry run, prices = [1, 3, 2, 8, 4, 9], fee = 2:
  day     :  0   1   2   3   4   5
  price   :  1   3   2   8   4   9
  holding : -1  -1  -1  -1   1   1
  free    :  0   0   0   5   5   8
  free[3] = max(0, -1 + 8 - 2) = 5 ; holding[4] = max(-1, 5 - 4) = 1 ; free[5] = max(5, 1 + 9 - 2) = 8
```

### APPROACH 4 — Space optimized   O(n) time, O(1) space


### DP definition

```
STATE MACHINE (two states, no cooldown)
FREE  --buy-->  HOLDING  --sell (pay fee)-->  FREE

DP DEFINITION
STATE:       holding[i] = max profit at end of day i while holding a share
free[i]    = max profit at end of day i with no share
RECURRENCE:  holding[i] = max(holding[i-1], free[i-1] - prices[i])
free[i]    = max(free[i-1], holding[i-1] + prices[i] - fee)
BASE CASES:  holding[0] = -prices[0], free[0] = 0
ANSWER:      free[n-1]
```

### Edge cases

```
- fee larger than any possible gain -> 0
- single day -> 0
```

Full JavaScript solution with tests: [19_stock_with_transaction_fee.js](../solutions/19_stock_with_transaction_fee.js). Run it with `node 19_stock_with_transaction_fee.js` from the solutions folder.

</details>

## Common mistakes

- Charging the fee on both buy and sell. It is charged once per transaction.
- Using the NEW holding value when computing the new free value in the same step (it happens to be safe here, but you must be able to explain why).
- Greedy "sell at every local peak" over-pays fees on small wiggles.

## Related follow-ups

- [Best Time to Buy and Sell Stock with Cooldown](18_stock_with_cooldown.md)
- [Best Time to Buy and Sell Stock IV](../../../06_Advanced_DP/03_Problems/03_Hard/09_best_time_to_buy_sell_stock_iv.md)
- [Maximum Subarray](08_maximum_subarray.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

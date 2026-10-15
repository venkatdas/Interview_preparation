# Best Time to Buy and Sell Stock III

| | |
|---|---|
| **Topic** | Advanced DP (Bitmask, Tree, Digit, State Machine) |
| **Difficulty** | Hard |
| **Pattern** | state machine (2 transactions) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #123 — https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/ |
| **Solution file** | [08_best_time_to_buy_sell_stock_iii.js](../solutions/08_best_time_to_buy_sell_stock_iii.js) — open only after a real attempt |

## Problem

Given daily prices, you may complete AT MOST TWO transactions (buy then sell, and you
must sell before buying again). Return the maximum profit.

## Examples

```
Input: [3,3,5,0,0,3,1,4]   Output: 6   Explanation: buy 0 sell 3 (+3), buy 1 sell 4 (+3)
Input: [1,2,3,4,5]         Output: 4   Explanation: one transaction 1 -> 5 is enough
Input: [7,6,4,3,1]         Output: 0   Explanation: never buy
```

## Constraints & clarifying questions

```
- 1 <= n <= 10^5, prices >= 0.
- "At most" two: doing zero or one transaction is allowed.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *state machine (2 transactions)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (plain recursion)   O(2^n) time, O(n) space. profit(day, holding, transactionsLeft): each day either skip, or buy (if not holding and transactions left), or sell (if holding).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — State machine DP   O(n * 2 * 3) = O(n) time, O(n) or O(1) space. 

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 1 -> 0
- strictly decreasing -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (plain recursion)   O(2^n) time, O(n) space

```
profit(day, holding, transactionsLeft): each day either skip, or buy (if not holding
and transactions left), or sell (if holding). Exponential.
```

### APPROACH 2 — State machine DP   O(n * 2 * 3) = O(n) time, O(n) or O(1) space

### DP definition

```
STATE      dp[day][t][holding] = best cash so far at end of `day`, having STARTED t
transactions (t in 0..2), holding = 1 if we own a share.
           A transaction is "counted" when we buy.
RECURRENCE dp[day][t][0] = max(dp[day-1][t][0],              // rest
dp[day-1][t][1] + price)      // sell
           dp[day][t][1] = max(dp[day-1][t][1],              // rest
                               dp[day-1][t-1][0] - price)    // buy (uses a transaction)
BASE CASES before day 0: dp[.][0][0] = 0, every "holding" state = -Infinity
(impossible to hold without buying).
ANSWER     max over t of dp[n-1][t][0].
The state machine (per transaction t):
    rest            rest
   +---+           +---+
   |   v   buy     |   v   sell
  [t-1, 0] -----> [t, 1] -----> [t, 0]

Dry run [3,3,5,0,0,3,1,4] using the 4-variable version (buy1, sell1, buy2, sell2):
  price | buy1 (max -p) | sell1 (buy1+p) | buy2 (sell1-p) | sell2 (buy2+p)
    3   |     -3        |      0         |     -3         |      0
    3   |     -3        |      0         |     -3         |      0
    5   |     -3        |      2         |     -3         |      2
    0   |      0        |      2         |      2         |      2
    0   |      0        |      2         |      2         |      2
    3   |      0        |      3         |      2         |      5
    1   |      0        |      3         |      2         |      5
    4   |      0        |      4         |      2         |      6   <- answer
```

### Edge cases

```
- n = 1 -> 0
- strictly decreasing -> 0
```

Full JavaScript solution with tests: [08_best_time_to_buy_sell_stock_iii.js](../solutions/08_best_time_to_buy_sell_stock_iii.js). Run it with `node 08_best_time_to_buy_sell_stock_iii.js` from the solutions folder.

</details>

## Common mistakes

- Counting a transaction on both buy and sell, which halves the allowed transactions.
- Updating the states in an order that reuses today's value (buy and sell on the same day) — harmless here, but know why.
- Initialising "holding" states to 0 instead of -Infinity / -prices[0].

## Related follow-ups

- [Best Time to Buy and Sell Stock IV](09_best_time_to_buy_sell_stock_iv.md)
- [Stock with Cooldown](../../../01_One_Dimensional_DP/03_Problems/02_Medium/18_stock_with_cooldown.md)
- [Stock with Transaction Fee](../../../01_One_Dimensional_DP/03_Problems/02_Medium/19_stock_with_transaction_fee.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

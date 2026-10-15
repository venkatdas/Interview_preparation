# Best Time to Buy and Sell Stock IV

| | |
|---|---|
| **Topic** | Advanced DP (Bitmask, Tree, Digit, State Machine) |
| **Difficulty** | Hard |
| **Pattern** | state machine (k transactions) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #188 — https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/ |
| **Solution file** | [09_best_time_to_buy_sell_stock_iv.js](../solutions/09_best_time_to_buy_sell_stock_iv.js) — open only after a real attempt |

## Problem

Same as Stock III but with AT MOST k transactions.

## Examples

```
Input: k = 2, prices = [2,4,1]       Output: 2   Explanation: buy 2 sell 4
Input: k = 2, prices = [3,2,6,5,0,3] Output: 7   Explanation: 2->6 (+4), 0->3 (+3)
Input: k = 0, prices = [1,3]         Output: 0
```

## Constraints & clarifying questions

```
- 0 <= k <= 100, 1 <= n <= 1000.
- A transaction needs 2 days, so if k >= n / 2 we are effectively unlimited: just sum
  every positive day-to-day rise (greedy). Nice speedup, optional.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *state machine (k transactions)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (plain recursion)   O(2^n) time, O(n) space. profit(day, holding, transactionsLeft) exactly like Stock III.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — State machine DP   O(n * k) time, O(n * k) or O(k) space. 

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k = 0 or n < 2 -> 0
- k large -> greedy (sum of positive diffs) gives the same answer, faster
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (plain recursion)   O(2^n) time, O(n) space

```
profit(day, holding, transactionsLeft) exactly like Stock III.
```

### APPROACH 2 — State machine DP   O(n * k) time, O(n * k) or O(k) space

### DP definition

```
STATE      dp[t][holding] after processing some days = best cash having started t
transactions, holding or not.
RECURRENCE for each price, for t = k down to 1 (or any order with a copy):
hold[t]  = max(hold[t],  free[t-1] - price)   // buy, opens transaction t
             free[t]  = max(free[t],  hold[t]  + price)    // sell
BASE CASES free[0] = 0, hold[.] = -Infinity before any day.
ANSWER     max over t of free[t]  (= free[k] since more transactions never hurt).
Dry run k = 2, prices = [3,2,6,5,0,3]:
  price | hold1 | free1 | hold2 | free2
    3   |  -3   |   0   |  -3   |   0
    2   |  -2   |   0   |  -2   |   0
    6   |  -2   |   4   |  -2   |   4
    5   |  -2   |   4   |  -1   |   4
    0   |   0   |   4   |   4   |   4
    3   |   0   |   4   |   4   |   7   <- answer
```

### Edge cases

```
- k = 0 or n < 2 -> 0
- k large -> greedy (sum of positive diffs) gives the same answer, faster
```

Full JavaScript solution with tests: [09_best_time_to_buy_sell_stock_iv.js](../solutions/09_best_time_to_buy_sell_stock_iv.js). Run it with `node 09_best_time_to_buy_sell_stock_iv.js` from the solutions folder.

</details>

## Common mistakes

- Allocating O(k * n) when k is huge; if `k >= n / 2` the limit does not bind, so sum every positive day-to-day gain.
- Off-by-one in the transaction index (k = 0 must return 0).
- Initialising holding states to 0, which pretends a stock was bought for free.

## Related follow-ups

- [Best Time to Buy and Sell Stock III](08_best_time_to_buy_sell_stock_iii.md)
- Best Time to Buy and Sell Stock II (LeetCode #122)
- [Stock with Cooldown](../../../01_One_Dimensional_DP/03_Problems/02_Medium/18_stock_with_cooldown.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

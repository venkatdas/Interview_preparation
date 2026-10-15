# Best Time to Buy and Sell Stock with Cooldown

| | |
|---|---|
| **Topic** | 1D Dynamic Programming |
| **Difficulty** | Medium |
| **Pattern** | state machine |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #309 — https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/ |
| **Solution file** | [18_stock_with_cooldown.js](../solutions/18_stock_with_cooldown.js) — open only after a real attempt |

## Problem

prices[i] is the stock price on day i. You can do as many buy/sell
transactions as you like (one share at a time), BUT after you sell you must
wait one day (cooldown) before buying again. Return the max profit.

## Examples

```
Input: [1,2,3,0,2]   Output: 3   Explanation: buy(1) sell(2) cooldown buy(0) sell(2)
Input: [1]           Output: 0
```

## Constraints & clarifying questions

```
- 1 <= prices.length <= 5000
- Can I hold more than one share at once? (no)
- Does the cooldown apply after a buy? (no, only after a sell)
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

**Start simple.** APPROACH 1 — Brute force   O(2^n) time, O(n) space. Recursion on (day, holding?) that tries every buy/sell/wait decision.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 4 — Space optimized   O(n) time, O(1) space. Three variables instead of three arrays.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- One day -> 0
- Strictly decreasing prices -> 0 (never buy)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n) time, O(n) space

```
Recursion on (day, holding?) that tries every buy/sell/wait decision.
```

### APPROACH 2 — Memoization   O(n) time, O(n) space

```
Cache on (day, holding).
```

### APPROACH 3 — Tabulation   O(n) time, O(n) space

```
Dry run, prices = [1, 2, 3, 0, 2]:
  day      :  0   1   2   3   4
  price    :  1   2   3   0   2
  holding  : -1  -1  -1   1   1
  cooldown :  0   1   2   2   3
  free     :  0   0   1   2   2
  answer = max(3, 2) = 3
```

### APPROACH 4 — Space optimized   O(n) time, O(1) space

```
Three variables instead of three arrays.
```

### DP definition

```
STATE MACHINE
Three states describe "what am I allowed to do today":

   HOLDING  --sell-->  COOLDOWN  --wait-->  FREE  --buy-->  HOLDING
   (keep holding)                           (keep waiting)

DP DEFINITION
STATE:       holding[i]  = max profit at end of day i while holding a share
cooldown[i] = max profit at end of day i, just sold today
             free[i]     = max profit at end of day i, no share, free to buy
RECURRENCE:  holding[i]  = max(holding[i-1], free[i-1] - prices[i])
cooldown[i] = holding[i-1] + prices[i]
             free[i]     = max(free[i-1], cooldown[i-1])
BASE CASES:  holding[0] = -prices[0], cooldown[0] = 0, free[0] = 0
ANSWER:      max(cooldown[n-1], free[n-1])   (ending while holding is never best)
```

### Edge cases

```
- One day -> 0
- Strictly decreasing prices -> 0 (never buy)
```

Full JavaScript solution with tests: [18_stock_with_cooldown.js](../solutions/18_stock_with_cooldown.js). Run it with `node 18_stock_with_cooldown.js` from the solutions folder.

</details>

## Common mistakes

- Buying from yesterday's "sold" state, which ignores the cooldown. Buy only from the rested/free state.
- Updating the states in place without saving the old values first.
- Returning the "holding" state at the end; you should finish without a share.

## Related follow-ups

- [Best Time to Buy and Sell Stock with Transaction Fee](19_stock_with_transaction_fee.md)
- [Best Time to Buy and Sell Stock III](../../../06_Advanced_DP/03_Problems/03_Hard/08_best_time_to_buy_sell_stock_iii.md)
- [Paint House](13_paint_house.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

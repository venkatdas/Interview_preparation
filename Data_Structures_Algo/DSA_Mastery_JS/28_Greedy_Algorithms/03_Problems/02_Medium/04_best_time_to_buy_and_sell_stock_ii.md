# Best Time to Buy and Sell Stock II

| | |
|---|---|
| **Topic** | Greedy Algorithms |
| **Difficulty** | Medium |
| **Pattern** | take every rise |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #122 — https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/ |
| **Solution file** | [04_best_time_to_buy_and_sell_stock_ii.js](../solutions/04_best_time_to_buy_and_sell_stock_ii.js) — open only after a real attempt |

## Problem

prices[i] is the stock price on day i. You may buy and sell as many times as you like,
but you can hold at most one share at a time (sell before you buy again).
Return the maximum profit.

## Examples

```
Input: [7,1,5,3,6,4]   Output: 7   Explanation: buy 1 sell 5 (+4), buy 3 sell 6 (+3)
Input: [1,2,3,4,5]     Output: 4   Explanation: buy 1 sell 5, or collect every +1 step
Input: [7,6,4,3,1]     Output: 0   Explanation: prices only fall, never trade
```

## Constraints & clarifying questions

```
- Can I buy and sell on the same day? (yes, it just gives 0 profit)
- Transaction fee or cooldown? (no - those variants need DP)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *take every rise* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^n) time. On each day decide: if holding, sell or keep; if not holding, buy or wait.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (collect every uphill step)   O(n) time, O(1) space. Whenever tomorrow's price is higher than today's, add the difference.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- fewer than 2 days -> 0
- all equal prices -> 0
- strictly decreasing -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n) time

```
On each day decide: if holding, sell or keep; if not holding, buy or wait. Recurse.
```

### APPROACH 2 — Optimal (collect every uphill step)   O(n) time, O(1) space

```
Whenever tomorrow's price is higher than today's, add the difference. Any uphill run
from a valley to a peak equals the sum of its daily rises, so collecting every positive
daily step is the same as buying at every valley and selling at every peak.
```

### WHY GREEDY WORKS

```
Profit of one trade (buy day i, sell day j) = sum of daily differences from i to j.
Dropping the negative differences and keeping the positive ones can only increase the sum.
Because unlimited trades are allowed, the best plan collects ALL positive differences and
none of the negative ones. No choice ever conflicts with a future choice.

Dry run on [7,1,5,3,6,4]:
  7->1 : -6 skip
  1->5 : +4 total 4
  5->3 : -2 skip
  3->6 : +3 total 7
  6->4 : -2 skip  -> 7
```

### Edge cases

```
- fewer than 2 days -> 0
- all equal prices -> 0
- strictly decreasing -> 0
```

Full JavaScript solution with tests: [04_best_time_to_buy_and_sell_stock_ii.js](../solutions/04_best_time_to_buy_and_sell_stock_ii.js). Run it with `node 04_best_time_to_buy_and_sell_stock_ii.js` from the solutions folder.

</details>

## Common mistakes

- Trying to find the single best buy/sell pair (that is problem #121, not this one).
- Thinking you must simulate buy and sell days explicitly - summing every positive day-to-day rise is equivalent.
- Adding negative differences too.

## Related follow-ups

- Best Time to Buy and Sell Stock (LeetCode #121)
- Best Time to Buy and Sell Stock with Transaction Fee (LeetCode #714) - needs DP
- [Jump Game](../02_Medium/05_jump_game.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

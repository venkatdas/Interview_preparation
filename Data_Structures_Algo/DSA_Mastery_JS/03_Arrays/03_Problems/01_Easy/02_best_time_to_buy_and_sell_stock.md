# Best Time to Buy and Sell Stock

| | |
|---|---|
| **Topic** | Arrays |
| **Difficulty** | Easy |
| **Pattern** | running min |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #121 — https://leetcode.com/problems/best-time-to-buy-and-sell-stock/ |
| **Solution file** | [02_best_time_to_buy_and_sell_stock.js](../solutions/02_best_time_to_buy_and_sell_stock.js) — open only after a real attempt |

## Problem

`prices[i]` is the price of a stock on day i. Pick one day to buy and a LATER day
to sell. Return the maximum profit. If no profit is possible, return 0.

## Examples

```
Input: [7, 1, 5, 3, 6, 4]   Output: 5   Explanation: buy on day 1 (price 1), sell on day 4 (price 6)
Input: [7, 6, 4, 3, 1]      Output: 0   Explanation: prices only fall, never buy
```

## Constraints & clarifying questions

```
- Only one transaction? (yes, one buy + one sell)
- Must sell after buying? (yes, same day is not allowed)
- Can prices be empty or a single day? (then profit is 0)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *running min* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. For every buy day i, try every sell day j > i and track the best prices[j] - prices[i].

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Optimal (running minimum)   O(n) time, O(1) space. Walk left to right remembering the CHEAPEST price seen so far.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Strictly decreasing prices -> 0
- All equal prices -> 0
- One day or empty -> 0
- Minimum at the very end (cannot be used to buy)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
For every buy day i, try every sell day j > i and track the best prices[j] - prices[i].
```

### APPROACH 2 — Optimal (running minimum)   O(n) time, O(1) space

```
Walk left to right remembering the CHEAPEST price seen so far. On each day the best
you can do if you sell today is price - minSoFar. Keep the max of those.
Why it works: the best sell day's partner is always the minimum before it.

Dry run on [7, 1, 5, 3, 6, 4]:
  price 7: min=7  profit 0   best 0
  price 1: min=1  profit 0   best 0
  price 5: min=1  profit 4   best 4
  price 3: min=1  profit 2   best 4
  price 6: min=1  profit 5   best 5
  price 4: min=1  profit 3   best 5   -> 5
```

### Edge cases

```
- Strictly decreasing prices -> 0
- All equal prices -> 0
- One day or empty -> 0
- Minimum at the very end (cannot be used to buy)
```

Full JavaScript solution with tests: [02_best_time_to_buy_and_sell_stock.js](../solutions/02_best_time_to_buy_and_sell_stock.js). Run it with `node 02_best_time_to_buy_and_sell_stock.js` from the solutions folder.

</details>

## Common mistakes

- Taking the global max minus the global min, ignoring that you must buy *before* you sell.
- Returning a negative profit when prices only fall; the answer is 0 (just do not trade).
- Updating the running minimum after computing profit on the same day in the wrong order is fine, but resetting max profit when a new minimum appears is not.

## Related follow-ups

- [Best Time to Buy and Sell Stock II](../../../28_Greedy_Algorithms/03_Problems/02_Medium/04_best_time_to_buy_and_sell_stock_ii.md) — unlimited transactions, greedy over every rise
- [Maximum Subarray](../02_Medium/04_maximum_subarray.md) — the daily-difference array turns this into Kadane
- [Best Time to Buy and Sell Stock with Cooldown](../../../29_Dynamic_Programming/01_One_Dimensional_DP/03_Problems/02_Medium/18_stock_with_cooldown.md) — the state-machine DP generalisation

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

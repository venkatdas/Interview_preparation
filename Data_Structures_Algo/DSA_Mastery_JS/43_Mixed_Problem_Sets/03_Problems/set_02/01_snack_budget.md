# Snack Budget

| | |
|---|---|
| **Set** | [Mixed Set 02](README.md) — problem 01 of 5 |
| **Difficulty** | Easy |
| **Time box** | 20 minutes (then open Hint 1) |
| **Source** | Original exercise |
| **Solution file** | [01_snack_budget.js](solutions/01_snack_budget.js) — open only after a real attempt |

> The topic is hidden on purpose. Part of the skill being trained is recognizing the pattern on your own.

## Problem

A vending machine has snacks with prices `prices` (one of each). For every budget in
`budgets`, answer independently: what is the largest NUMBER of different snacks you
can buy without the total going over the budget? Return an array of answers.

## Examples

```
Input: prices = [4, 2, 7, 1], budgets = [3, 10, 0]   Output: [2, 3, 0]
       Explanation: budget 3 buys 1+2; budget 10 buys 1+2+4; budget 0 buys nothing
Input: prices = [], budgets = [5]                    Output: [0]
```

## Constraints & clarifying questions

```
- Prices are positive integers? (yes) Budgets are non-negative.
- Up to 10^5 prices and 10^5 budgets, so O(n) per budget is too slow.
- Should I return answers in the original budget order? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 20 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1 — which patterns?</summary>

**Pattern.** Greedy + sorting + prefix sums + binary search. See [Sorting](../../../11_Sorting/README.md), [Prefix Sums & Difference Arrays](../../../08_Prefix_Sums_And_Difference_Arrays/README.md) and [Searching / Binary Search](../../../10_Searching/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** For one budget: sort and buy from the cheapest until the next does not fit.

</details>

<details><summary>Hint 3</summary>

**The key idea.** The best k items are always the k cheapest, so the cost of buying k items is a prefix sum. Prefix sums are non-decreasing, so each budget is a binary search.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- no prices                  -> all zeros
- budget huge                -> n
- budget exactly equals a prefix sum -> that prefix is allowed (<=)
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(q * n log n) time, O(n) space

```
For each budget, sort the prices and buy from the cheapest until the next one does not fit.
```

### APPROACH 2 — Optimal (sort + prefix sums + binary search)   O((n + q) log n) time, O(n) space

```
Greedy insight: to maximize the COUNT you always take the cheapest snacks first.
Sort once and build prefix sums pre[i] = cost of the i cheapest snacks (non-decreasing).
The answer for budget B is the largest i with pre[i] <= B, found by binary search
(upper bound of B in pre, minus one).

Dry run on prices = [4, 2, 7, 1]:
  sorted = [1, 2, 4, 7]   pre = [0, 1, 3, 7, 14]
  B=3  : largest i with pre[i] <= 3  -> i=2
  B=10 : largest i with pre[i] <= 10 -> i=3
  B=0  : i=0
  answer [2, 3, 0]
```

### Edge cases

```
- no prices                  -> all zeros
- budget huge                -> n
- budget exactly equals a prefix sum -> that prefix is allowed (<=)
```

### Common mistakes

```
- Sorting inside the query loop (back to brute force speed).
- Off-by-one in the binary search: return the count, not the index into sorted prices.
- Sorting numbers without a comparator.
```

Full JavaScript solution with tests: [01_snack_budget.js](solutions/01_snack_budget.js). Run it with `node solutions/01_snack_budget.js` from this folder.

</details>

## Related follow-ups

- Each snack has a "happiness" value and you maximize happiness (knapsack — much harder)
- Budgets arrive online while prices change
- Return which snacks to buy

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down which pattern you did NOT see at first. That is the one to drill.
- Fill in the set's reflection checklist in [QUIZ.md](../../04_Interview_And_Assessment/QUIZ.md).
- Re-solve from scratch in 3 days, then in 1 week.

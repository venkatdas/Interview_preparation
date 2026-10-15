# K Items Closest to Budget

| | |
|---|---|
| **Set** | [Mixed Set 02](README.md) — problem 04 of 5 |
| **Difficulty** | Medium |
| **Time box** | 25 minutes (then open Hint 1) |
| **Source** | Original exercise |
| **Solution file** | [04_k_items_closest_budget.js](solutions/04_k_items_closest_budget.js) — open only after a real attempt |

> The topic is hidden on purpose. Part of the skill being trained is recognizing the pattern on your own.

## Problem

A shop lists item prices `prices` (positive integers, possibly repeated). You must buy
EXACTLY k different items (different positions) and the total must not exceed
`budget`. Return the largest total you can reach, or -1 if no choice of k items fits.
n <= 20.

## Examples

```
Input: prices = [5, 3, 8, 6], k = 2, budget = 12   Output: 11   Explanation: 5 + 6 (or 3 + 8)
Input: prices = [5, 3, 8, 6], k = 3, budget = 10   Output: -1   Explanation: cheapest three cost 14
Input: prices = [4, 4], k = 0, budget = 0          Output: 0    Explanation: buying nothing costs 0
```

## Constraints & clarifying questions

```
- n <= 20. Prices up to 10^6.
- k can be 0 (answer 0) or larger than n (answer -1).
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 25 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1 — which patterns?</summary>

**Pattern.** Sorting + backtracking with pruning (bounds from prefix sums). See [Backtracking](../../../13_Backtracking/README.md) and [Sorting](../../../11_Sorting/README.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** n ≤ 20: enumerate all bitmasks and keep those with exactly k bits.

</details>

<details><summary>Hint 3</summary>

**The key idea.** Sort first. Then while choosing, the cheapest possible finish and the most expensive possible finish are prefix-sum lookups — prune when the cheapest already breaks the budget or the most expensive cannot beat the best.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- k = 0               -> 0
- k > n               -> -1
- budget below the k cheapest items -> -1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n * n) time, O(1) space

```
Enumerate every bitmask, keep those with exactly k bits, compute the sum, keep the best
sum <= budget.
```

### APPROACH 2 — Optimal (sort + backtracking with pruning)   O(C(n, k)) worst case, usually far less; O(k) space

```
Sort prices ascending and choose items left to right. Prune a branch when:
  - the cheapest way to finish (next "need" items, which are the next ones in sorted
    order) already exceeds the budget -> stop the whole loop, later items are pricier;
  - the most expensive way to finish (the last "need" items) cannot beat the best so far;
  - best === budget (cannot do better).
Prefix sums make both bounds O(1).

Dry run on prices = [5, 3, 8, 6], k = 2, budget = 12:
  sorted = [3, 5, 6, 8]
  pick 3 -> pick 5 (8), pick 6 (9), pick 8 (11)   best=11
  pick 5 -> need 1 more: max possible 5+8=13 > 11, try: 5+6=11, 5+8=13 > 12 stop
  pick 6 -> cheapest finish 6+8=14 > 12 -> stop
  answer 11
```

### Edge cases

```
- k = 0               -> 0
- k > n               -> -1
- budget below the k cheapest items -> -1
```

### Common mistakes

```
- Pruning with "continue" instead of "break" when prices are sorted (still correct, just slower).
- Treating equal prices as the same item: positions are different items.
```

Full JavaScript solution with tests: [04_k_items_closest_budget.js](solutions/04_k_items_closest_budget.js). Run it with `node solutions/04_k_items_closest_budget.js` from this folder.

</details>

## Related follow-ups

- n = 40: meet in the middle
- Any number of items (subset sum ≤ budget) with DP over sums
- Return the chosen items

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Write down which pattern you did NOT see at first. That is the one to drill.
- Fill in the set's reflection checklist in [QUIZ.md](../../04_Interview_And_Assessment/QUIZ.md).
- Re-solve from scratch in 3 days, then in 1 week.

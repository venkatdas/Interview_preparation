# Unbounded Knapsack

| | |
|---|---|
| **Topic** | Knapsack DP |
| **Difficulty** | Medium |
| **Pattern** | unbounded, forward loop |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Classic problem (not on LeetCode) |
| **Solution file** | [02_unbounded_knapsack_basic.js](../solutions/02_unbounded_knapsack_basic.js) — open only after a real attempt |

## Problem

Same as 0/1 knapsack, but you have an UNLIMITED supply of every item: you may
take item i zero, one, two, ... times. Return the maximum value that fits in
`capacity`.

## Examples

```
Input: weights=[2,3], values=[3,5], capacity=7   Output: 11
  Explanation: 2+2+3 = 7 -> 3+3+5 = 11
Input: weights=[5], values=[10], capacity=4      Output: 0
```

## Constraints & clarifying questions

```
- Truly unlimited copies? (yes; a per-item limit would be "bounded knapsack")
- Integer weights? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *unbounded, forward loop* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(exponential) time, O(capacity) recursion space. At each step pick ANY item that still fits and recurse with the smaller room.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — DP (unbounded knapsack)   O(n * capacity) time, O(capacity) space. 

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- capacity 0 -> 0
- no item fits -> 0
- a single item: floor(capacity / weight) * value
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(exponential) time, O(capacity) recursion space

```
At each step pick ANY item that still fits and recurse with the smaller room.
Massive repeated work (room 3 is reached in many different ways).
```

### APPROACH 2 — DP (unbounded knapsack)   O(n * capacity) time, O(capacity) space


### DP definition

```
STATE      dp[c] = max value that fits into capacity c
RECURRENCE dp[c] = max over items i with weights[i] &lt;= c of ( values[i] + dp[c - weights[i]] )
BASE CASES dp[0] = 0
ANSWER     dp[capacity]
The 1D loop is the 0/1 loop with the capacity walking UP instead of down.
Going up means dp[c - w] may already include item i, so item i can be reused.

Dry run: weights=[2,3], values=[3,5], capacity=7
  start           dp = [0,0,0,0,0,0,0,0]
  item w2 v3 (c up) dp = [0,0,3,3,6,6,9,9]
  item w3 v5 (c up) c=3: max(3, 5+dp[0])=5   c=4: max(6, 5+dp[1])=6
                    c=5: max(6, 5+dp[2]=8)=8  c=6: max(9, 5+dp[3]=10)=10
                    c=7: max(9, 5+dp[4]=11)=11
  answer 11
```

### Edge cases

```
- capacity 0 -> 0
- no item fits -> 0
- a single item: floor(capacity / weight) * value
```

Full JavaScript solution with tests: [02_unbounded_knapsack_basic.js](../solutions/02_unbounded_knapsack_basic.js). Run it with `node 02_unbounded_knapsack_basic.js` from the solutions folder.

</details>

## Common mistakes

- Walking capacity DOWNWARD (the 0/1 rule), which forbids reusing an item.
- In the 2D table, reading `dp[i-1][c-w]` for the take branch; for unbounded it must be `dp[i][c-w]` (same row).
- Forgetting zero capacity or items heavier than capacity.

## Related follow-ups

- [0/1 Knapsack](01_knapsack_01_basic.md)
- [Rod Cutting](10_rod_cutting.md)
- [Coin Change](04_coin_change_min_coins.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

# Rod Cutting

| | |
|---|---|
| **Topic** | Knapsack DP |
| **Difficulty** | Medium |
| **Pattern** | unbounded knapsack |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Classic problem (not on LeetCode) |
| **Solution file** | [10_rod_cutting.js](../solutions/10_rod_cutting.js) — open only after a real attempt |

## Problem

A rod of length n can be cut into pieces of integer length. prices[i] is the
price of a piece of length i + 1. Return the maximum money you can get by
cutting the rod (cutting is free, you may also sell it whole).

## Examples

```
Input: prices=[1,5,8,9,10,17,17,20], n=8   Output: 22   Explanation: 2 + 6 -> 5 + 17
Input: prices=[3,5,8,9,10,17,17,20], n=8   Output: 24   Explanation: eight pieces of 1
```

## Constraints & clarifying questions

```
- Can we use the same piece length many times? (yes -> UNBOUNDED knapsack)
- Is there a price for every length 1..n? (assume yes; missing lengths could be 0)
- Must the whole rod be used? (yes, but with positive prices that is automatic)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *unbounded knapsack* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^n) time, O(n) space. For a rod of length L choose the first cut i (1..L), earn prices[i-1], recurse on L - i.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — DP (unbounded knapsack: weight = length, value = price, capacity = n). O(n^2) time, O(n) space

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n = 0 -> 0
- a single price (only length-1 pieces) -> n * prices[0]
- whole rod worth more than any cut -> prices[n-1]
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n) time, O(n) space

```
For a rod of length L choose the first cut i (1..L), earn prices[i-1], recurse
on L - i. Every length is recomputed over and over.
```

### APPROACH 2 — DP (unbounded knapsack: weight = length, value = price, capacity = n)

```
O(n^2) time, O(n) space
```

### DP definition

```
STATE      dp[len] = best revenue for a rod of length len
RECURRENCE dp[len] = max over cut 1..len of ( prices[cut-1] + dp[len - cut] )
BASE CASES dp[0] = 0
ANSWER     dp[n]
Dry run: prices=[1,5,8,9], n=4
  len:  0  1  2  3   4
  dp:   0  1  5  8  10     dp[4] = max(1+dp[3]=9, 5+dp[2]=10, 8+dp[1]=9, 9+dp[0]=9) = 10
```

### Edge cases

```
- n = 0 -> 0
- a single price (only length-1 pieces) -> n * prices[0]
- whole rod worth more than any cut -> prices[n-1]
```

Full JavaScript solution with tests: [10_rod_cutting.js](../solutions/10_rod_cutting.js). Run it with `node 10_rod_cutting.js` from the solutions folder.

</details>

## Common mistakes

- Off-by-one on prices: `prices[i]` is the price of a piece of length `i + 1`.
- Using the 0/1 (downward) loop, which forbids two pieces of the same length.
- Forgetting that selling the rod whole is also an option.

## Related follow-ups

- [Unbounded Knapsack](02_unbounded_knapsack_basic.md)
- [Integer Break](../../../01_One_Dimensional_DP/03_Problems/02_Medium/16_integer_break.md)
- [Minimum Cost to Cut a Stick (interval DP)](../../../05_Interval_DP/03_Problems/03_Hard/05_minimum_cost_to_cut_a_stick.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

# 0/1 Knapsack

| | |
|---|---|
| **Topic** | Knapsack DP |
| **Difficulty** | Medium |
| **Pattern** | 0/1 knapsack, max value |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | Classic problem (not on LeetCode) |
| **Solution file** | [01_knapsack_01_basic.js](../solutions/01_knapsack_01_basic.js) — open only after a real attempt |

## Problem

You have n items. Item i has weight weights[i] and value values[i]. Your bag
holds at most `capacity` weight. Each item can be taken at most ONCE (0 or 1
times). Return the maximum total value you can carry.

## Examples

```
Input: weights=[1,3,4,5], values=[1,4,5,7], capacity=7   Output: 9
  Explanation: take items with weight 3 and 4 (3+4=7) -> value 4+5 = 9
Input: weights=[2,3], values=[3,4], capacity=1            Output: 0   (nothing fits)
```

## Constraints & clarifying questions

```
- Can an item be taken more than once? (no -> that's unbounded knapsack, file 02)
- Are weights/capacity integers? (yes, DP needs integer capacities as indexes)
- Must the bag be exactly full? (no, "at most" capacity)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *0/1 knapsack, max value* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (try every subset)   O(2^n) time, O(n) recursion space. For each item decide: skip it, or take it if it fits.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — DP (0/1 knapsack)   O(n * capacity) time, O(n * capacity) -> O(capacity) space. 

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- capacity 0 or empty items -> 0
- every item heavier than capacity -> 0
- one item exactly equal to capacity -> its value
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (try every subset)   O(2^n) time, O(n) recursion space

```
For each item decide: skip it, or take it if it fits. Two branches per item,
n items -> 2^n leaves.
```

### APPROACH 2 — DP (0/1 knapsack)   O(n * capacity) time, O(n * capacity) -> O(capacity) space


### DP definition

```
STATE      dp[i][c] = max value using only the first i items with capacity c
RECURRENCE dp[i][c] = max( dp[i-1][c],                         // skip item i
values[i-1] + dp[i-1][c - weights[i-1]] )   // take it (if it fits)
BASE CASES dp[0][c] = 0 (no items -> no value), dp[i][0] = 0 (no room)
ANSWER     dp[n][capacity]
Dry run: weights=[1,3,4], values=[1,4,5], capacity=5
           c=0  1  2  3  4  5
  i=0       0   0  0  0  0  0     (no items)
  i=1 (w1)  0   1  1  1  1  1
  i=2 (w3)  0   1  1  4  5  5     c=4: max(1, 4 + dp[1][1]=1) = 5
  i=3 (w4)  0   1  1  4  5  6     c=5: max(5, 5 + dp[2][1]=1) = 6
  answer dp[3][5] = 6 (items w1 + w4)

Space optimisation: row i only needs row i-1, so keep one row and walk c from
capacity DOWN to weight. Going down guarantees dp[c - w] is still the old row
value, so the current item is never counted twice.
```

### Edge cases

```
- capacity 0 or empty items -> 0
- every item heavier than capacity -> 0
- one item exactly equal to capacity -> its value
```

Full JavaScript solution with tests: [01_knapsack_01_basic.js](../solutions/01_knapsack_01_basic.js). Run it with `node 01_knapsack_01_basic.js` from the solutions folder.

</details>

## Common mistakes

- Walking capacity UPWARD in the 1D version, which silently lets an item be taken many times (that is unbounded knapsack).
- Sizing the table `capacity` instead of `capacity + 1` columns.
- Greedy by value/weight ratio; it is only correct for the fractional knapsack.

## Related follow-ups

- [Unbounded Knapsack](02_unbounded_knapsack_basic.md)
- [Partition Equal Subset Sum](03_subset_sum_partition_equal.md)
- [Ones and Zeroes](11_ones_and_zeroes.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

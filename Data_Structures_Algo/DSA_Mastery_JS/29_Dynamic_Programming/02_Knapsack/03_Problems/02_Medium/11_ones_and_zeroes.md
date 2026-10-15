# Ones and Zeroes

| | |
|---|---|
| **Topic** | Knapsack DP |
| **Difficulty** | Medium |
| **Pattern** | 0/1 knapsack, 2 capacities |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #474 — https://leetcode.com/problems/ones-and-zeroes/ |
| **Solution file** | [11_ones_and_zeroes.js](../solutions/11_ones_and_zeroes.js) — open only after a real attempt |

## Problem

Given binary strings strs and two budgets m (zeros) and n (ones), return the
size of the largest subset of strs that uses at most m zeros and n ones in total.

## Examples

```
Input: strs=["10","0001","111001","1","0"], m=5, n=3   Output: 4
  Explanation: {"10","0001","1","0"} uses 5 zeros and 3 ones
Input: strs=["10","0","1"], m=1, n=1                   Output: 2   ("0","1")
```

## Constraints & clarifying questions

```
- Each string used at most once? (yes -> 0/1 knapsack)
- Two budgets at once? (yes -> the "capacity" is 2-dimensional)
- Empty strings? (not on LeetCode)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *0/1 knapsack, 2 capacities* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^len) time, O(len) space. Take or skip each string, tracking zeros and ones left.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — DP (0/1 knapsack with TWO capacities, value = 1 per item). O(len * m * n) time, O(m * n) space

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- m = n = 0 -> 0 (no non-empty string fits)
- a string with more zeros than m is simply never taken
- empty strs -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^len) time, O(len) space

```
Take or skip each string, tracking zeros and ones left. Count the taken strings.
```

### APPROACH 2 — DP (0/1 knapsack with TWO capacities, value = 1 per item)

```
O(len * m * n) time, O(m * n) space
```

### DP definition

```
STATE      dp[z][o] = max number of strings using at most z zeros and o ones
RECURRENCE dp[z][o] = max( dp[z][o],  1 + dp[z - zeros(str)][o - ones(str)] )
BASE CASES dp[*][*] = 0 (no strings taken yet)
ANSWER     dp[m][n]
Both capacity loops run DOWNWARD so that each string is used once - the same
reversed-loop trick as 1D 0/1 knapsack, just in two dimensions.

Dry run: strs=["10","0","1"], m=1, n=1
  start            dp = [[0,0],[0,0]]      (rows z=0..1, cols o=0..1)
  "10" (1z,1o)     dp[1][1] = 1 + dp[0][0] = 1
  "0"  (1z,0o)     dp[1][1] = max(1, 1 + dp[0][1]=0) = 1 ; dp[1][0] = 1
  "1"  (0z,1o)     dp[1][1] = max(1, 1 + dp[1][0]=1) = 2 ; dp[0][1] = 1
  answer dp[1][1] = 2
```

### Edge cases

```
- m = n = 0 -> 0 (no non-empty string fits)
- a string with more zeros than m is simply never taken
- empty strs -> 0
```

Full JavaScript solution with tests: [11_ones_and_zeroes.js](../solutions/11_ones_and_zeroes.js). Run it with `node 11_ones_and_zeroes.js` from the solutions folder.

</details>

## Common mistakes

- Running one of the two capacity loops upward, which reuses a string.
- Swapping m (zeros) and n (ones).
- Treating it as "maximise total length"; the goal is the NUMBER of strings.

## Related follow-ups

- [0/1 Knapsack](01_knapsack_01_basic.md)
- [Partition Equal Subset Sum](03_subset_sum_partition_equal.md)
- Profitable Schemes (LeetCode 879)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

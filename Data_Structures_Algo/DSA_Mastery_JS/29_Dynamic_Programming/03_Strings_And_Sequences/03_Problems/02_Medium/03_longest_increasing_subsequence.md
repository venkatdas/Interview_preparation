# Longest Increasing Subsequence

| | |
|---|---|
| **Topic** | DP on Strings and Sequences |
| **Difficulty** | Medium |
| **Pattern** | "ends at i" O(n^2), patience O(n log n) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #300 — https://leetcode.com/problems/longest-increasing-subsequence/ |
| **Solution file** | [03_longest_increasing_subsequence.js](../solutions/03_longest_increasing_subsequence.js) — open only after a real attempt |

## Problem

Given an integer array nums, return the length of the longest strictly
increasing subsequence (order kept, elements may be skipped).

## Examples

```
Input: [10,9,2,5,3,7,101,18]   Output: 4   Explanation: [2,3,7,101]
Input: [0,1,0,3,2,3]           Output: 4   Explanation: [0,1,2,3]
Input: [7,7,7,7]               Output: 1   Explanation: strictly increasing, so one 7
```

## Constraints & clarifying questions

```
- Strictly increasing or non-decreasing? (strictly: 7,7 does not count)
- Empty array? (return 0)
- Negative numbers? (fine, we only compare)
- Is O(n^2) acceptable, or do they want O(n log n)? (know both!)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *"ends at i" O(n^2), patience O(n log n)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^n) time, O(n) space. At each index decide: take it (only if bigger than the last taken) or skip it.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 3 — Patience sorting / "tails" array   O(n log n) time, O(n) space. tails[k] = the SMALLEST possible tail value of an increasing subsequence of length k+1.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [] -> 0
- single element -> 1
- all equal -> 1
- already sorted -> n
- strictly decreasing -> 1
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n) time, O(n) space

```
At each index decide: take it (only if bigger than the last taken) or skip it.
State is (index, previous index), explored without caching.
```

### APPROACH 2 — DP (memo / tabulation)   O(n^2) time, O(n^2) memo / O(n) table

### APPROACH 3 — Patience sorting / "tails" array   O(n log n) time, O(n) space

```
tails[k] = the SMALLEST possible tail value of an increasing subsequence of length k+1.
tails is always sorted, so for each number binary-search the first tails[k] >= num
and overwrite it (we found an equally long subsequence with a better, smaller tail).
If num is bigger than every tail, append it (a longer subsequence exists now).
The length of tails is the answer. NOTE: tails is NOT an actual LIS, only its length
is right (values get overwritten in place).

Dry run on [10, 9, 2, 5, 3, 7, 101, 18]:
  10  -> tails = [10]
  9   -> replaces 10        tails = [9]
  2   -> replaces 9         tails = [2]
  5   -> append             tails = [2, 5]
  3   -> replaces 5         tails = [2, 3]
  7   -> append             tails = [2, 3, 7]
  101 -> append             tails = [2, 3, 7, 101]
  18  -> replaces 101       tails = [2, 3, 7, 18]   length 4
```

### DP definition

```
STATE      dp[i] = length of the longest increasing subsequence that ENDS at index i

RECURRENCE dp[i] = 1 + max(dp[j]) over all j &lt; i with nums[j] &lt; nums[i]
(if no such j, dp[i] = 1 -> the element alone)
BASE CASES dp[i] = 1 for every i

ANSWER     max(dp)  -- the LIS can end anywhere
Table for [10, 9, 2, 5, 3, 7, 101, 18]:
  i     : 0   1   2   3   4   5   6    7
  nums  : 10  9   2   5   3   7   101  18
  dp    : 1   1   1   2   2   3   4    4      max = 4
  dp[5] : 7 is bigger than 2 (dp 1), 5 (dp 2), 3 (dp 2) -> 1 + 2 = 3
  dp[7] : 18 is bigger than 2,5,3,7 -> 1 + dp[5] = 4
```

### Edge cases

```
- [] -> 0
- single element -> 1
- all equal -> 1
- already sorted -> n
- strictly decreasing -> 1
```

Full JavaScript solution with tests: [03_longest_increasing_subsequence.js](../solutions/03_longest_increasing_subsequence.js). Run it with `node 03_longest_increasing_subsequence.js` from the solutions folder.

</details>

## Common mistakes

- Returning `dp[n-1]` instead of `max(dp)`: the LIS does not have to end at the last element.
- Using `<=` in the comparison, which allows equal neighbours although the subsequence must be strictly increasing.
- In the patience-sorting version, using upper bound instead of lower bound (`tails[k] >= x`), which breaks strictness; and believing `tails` itself is an LIS (only its length is meaningful).

## Related follow-ups

- [Number of Longest Increasing Subsequence](04_number_of_longest_increasing_subsequence.md)
- [Russian Doll Envelopes](../03_Hard/14_russian_doll_envelopes.md)
- Largest Divisible Subset (LeetCode #368)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

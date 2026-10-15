# Target Sum

| | |
|---|---|
| **Topic** | Knapsack DP |
| **Difficulty** | Medium |
| **Pattern** | transform to count subsets |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #494 — https://leetcode.com/problems/target-sum/ |
| **Solution file** | [07_target_sum.js](../solutions/07_target_sum.js) — open only after a real attempt |

## Problem

Given non-negative integers nums and a target, put a '+' or '-' in front of
every number. Return how many sign assignments make the expression equal target.

## Examples

```
Input: nums=[1,1,1,1,1], target=3   Output: 5
  Explanation: -1+1+1+1+1, +1-1+1+1+1, +1+1-1+1+1, +1+1+1-1+1, +1+1+1+1-1
Input: nums=[1], target=1            Output: 1
```

## Constraints & clarifying questions

```
- Can nums contain 0? (yes; +0 and -0 are different assignments, so each 0 doubles the count)
- Can target be negative? (yes, handle it with the same formula)
- Every number must get a sign? (yes)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *transform to count subsets* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^n) time, O(n) space. Two choices per number (+ or -).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — DP (transform to subset sum, COUNT variant)   O(n * sum) time, O(sum) space. Let P = sum of the numbers that get '+', N = sum of those that get '-'.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- |target| > total -> 0
- (total + target) odd -> 0
- zeros in nums: dp[0] starts at 1; each 0 runs dp[s] += dp[s - 0], doubling every entry
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n) time, O(n) space

```
Two choices per number (+ or -). Recurse with the running sum and count how
many leaves hit the target.
```

### APPROACH 2 — DP (transform to subset sum, COUNT variant)   O(n * sum) time, O(sum) space

```
Let P = sum of the numbers that get '+', N = sum of those that get '-'.
  P - N = target        and        P + N = total
  => 2P = total + target  =>  P = (total + target) / 2
So the question becomes: how many subsets sum to P?  That is countSubsets.
If (total + target) is odd or negative there is no answer -> 0.
```

### DP definition

```
STATE      dp[s] = number of subsets (of numbers seen so far) with sum s
RECURRENCE dp[s] += dp[s - num]   (s walks downward -> each number once)
BASE CASES dp[0] = 1
ANSWER     dp[P]
Dry run: nums=[1,1,1,1,1], target=3 -> total 5, P = (5+3)/2 = 4
  start   dp = [1,0,0,0,0]
  each 1 shifts and adds: after 5 ones dp = [1,5,10,10,5]  (binomial numbers)
  dp[4] = 5 = C(5,4)  -> answer 5
```

### Edge cases

```
- |target| > total -> 0
- (total + target) odd -> 0
- zeros in nums: dp[0] starts at 1; each 0 runs dp[s] += dp[s - 0], doubling every entry
```

Full JavaScript solution with tests: [07_target_sum.js](../solutions/07_target_sum.js). Run it with `node 07_target_sum.js` from the solutions folder.

</details>

## Common mistakes

- Not rejecting `(total + target)` odd or `|target| > total` before building the table (negative index crash).
- Forgetting that zeros double the count: `+0` and `-0` are different assignments.
- Memoising with a key that does not include both the index and the running sum.

## Related follow-ups

- [Partition Equal Subset Sum](03_subset_sum_partition_equal.md)
- [Last Stone Weight II](08_last_stone_weight_ii.md)
- [Coin Change II](05_coin_change_ii.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

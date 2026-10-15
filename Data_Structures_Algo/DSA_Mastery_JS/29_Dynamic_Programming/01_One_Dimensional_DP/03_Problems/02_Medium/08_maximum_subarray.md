# Maximum Subarray

| | |
|---|---|
| **Topic** | 1D Dynamic Programming |
| **Difficulty** | Medium |
| **Pattern** | Kadane / best ending here |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #53 — https://leetcode.com/problems/maximum-subarray/ |
| **Solution file** | [08_maximum_subarray.js](../solutions/08_maximum_subarray.js) — open only after a real attempt |

## Problem

Find the contiguous subarray with the largest sum and return that sum.

## Examples

```
Input: [-2,1,-3,4,-1,2,1,-5,4]   Output: 6   Explanation: [4,-1,2,1]
Input: [1]                        Output: 1
Input: [5,4,-1,7,8]               Output: 23
```

## Constraints & clarifying questions

```
- 1 <= nums.length <= 10^5, values can be negative
- Must the subarray be non-empty? (yes, so all-negative input returns the max element)

DP DEFINITION
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *Kadane / best ending here* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(n^2) time, O(1) space. Try every start, extend to every end, track the best running sum.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 4 — Space optimized (Kadane's algorithm)   O(n) time, O(1) space. Only dp[i-1] is needed, so keep one running variable.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- All negative: [-3, -1, -2] -> -1
- Single element
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(n^2) time, O(1) space

```
Try every start, extend to every end, track the best running sum.
```

### APPROACH 2 — Memoization   O(n) time, O(n) space

```
bestEndingAt(i) = max(nums[i], nums[i] + bestEndingAt(i-1)), cached.
```

### APPROACH 3 — Tabulation   O(n) time, O(n) space

```
Dry run, nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]:
  nums : -2   1  -3   4  -1   2   1  -5   4
  dp   : -2   1  -2   4   3   5   6   1   5
  answer = max(dp) = 6
```

### APPROACH 4 — Space optimized (Kadane's algorithm)   O(n) time, O(1) space

```
Only dp[i-1] is needed, so keep one running variable.
```

### DP definition

```
STATE:       dp[i] = max sum of a subarray that ENDS exactly at index i
RECURRENCE:  dp[i] = max(nums[i], dp[i-1] + nums[i])
(either start fresh at i, or extend the best subarray ending at i-1)
BASE CASES:  dp[0] = nums[0]
ANSWER:      max over all dp[i]  (the answer is NOT in the last cell!)
```

### Edge cases

```
- All negative: [-3, -1, -2] -> -1
- Single element
```

Full JavaScript solution with tests: [08_maximum_subarray.js](../solutions/08_maximum_subarray.js). Run it with `node 08_maximum_subarray.js` from the solutions folder.

</details>

## Common mistakes

- Returning the last cell `dp[n-1]` instead of the maximum over all cells.
- Initialising the answer to 0, which is wrong when every number is negative (answer is the largest negative).
- Resetting the running sum when it drops below 0 but forgetting to compare the current element alone.

## Related follow-ups

- Maximum Product Subarray (LeetCode 152)
- [Best Time to Buy and Sell Stock with Transaction Fee](19_stock_with_transaction_fee.md)
- [Constrained Subsequence Sum](../../../06_Advanced_DP/03_Problems/03_Hard/13_constrained_subsequence_sum.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

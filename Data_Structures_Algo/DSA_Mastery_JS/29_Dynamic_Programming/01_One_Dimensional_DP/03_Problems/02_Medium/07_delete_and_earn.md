# Delete and Earn

| | |
|---|---|
| **Topic** | 1D Dynamic Programming |
| **Difficulty** | Medium |
| **Pattern** | house robber in disguise |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #740 — https://leetcode.com/problems/delete-and-earn/ |
| **Solution file** | [07_delete_and_earn.js](../solutions/07_delete_and_earn.js) — open only after a real attempt |

## Problem

Pick any nums[i], earn nums[i] points, and then EVERY element equal to
nums[i]-1 and nums[i]+1 is deleted. Repeat. Return the max points.

## Examples

```
Input: [3,4,2]       Output: 6   Explanation: take 4 (deletes 3), take 2 -> 6
Input: [2,2,3,3,3,4] Output: 9   Explanation: take all three 3s (deletes 2s and 4) -> 9
```

## Constraints & clarifying questions

```
- 1 <= nums.length <= 2*10^4, 1 <= nums[i] <= 10^4

KEY TRICK — it's House Robber in disguise
If you take value v once, you may as well take EVERY copy of v (taking v
only deletes v-1 and v+1, never other v's). So build
  points[v] = v * count(v)
Now "take value v" forbids "take value v-1 and v+1" -> adjacent "houses".

DP DEFINITION
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *house robber in disguise* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^maxValue) time. Take/skip recursion over the value axis.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 4 — Space optimized   O(n + maxValue) time, O(maxValue) space for points. 

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Single element -> that element
- All the same value -> value * count
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^maxValue) time

```
Take/skip recursion over the value axis.
```

### APPROACH 2 — Memoization   O(maxValue) time, O(maxValue) space


### APPROACH 3 — Tabulation   O(n + maxValue) time, O(maxValue) space

```
Dry run, nums = [2,2,3,3,3,4]:
  points: v=0:0  1:0  2:4  3:9  4:4
  dp    :   0    0    4    9    9
  dp[3] = max(dp[2]=4, dp[1]+9=9) = 9
  dp[4] = max(dp[3]=9, dp[2]+4=8) = 9
```

### APPROACH 4 — Space optimized   O(n + maxValue) time, O(maxValue) space for points


### DP definition

```
STATE:       dp[v] = max points using values 0..v
RECURRENCE:  dp[v] = max(dp[v-1], dp[v-2] + points[v])
BASE CASES:  dp[0] = 0, dp[1] = points[1]
ANSWER:      dp[maxValue]
```

### Edge cases

```
- Single element -> that element
- All the same value -> value * count
```

Full JavaScript solution with tests: [07_delete_and_earn.js](../solutions/07_delete_and_earn.js). Run it with `node 07_delete_and_earn.js` from the solutions folder.

</details>

## Common mistakes

- Running House Robber on the raw array. You must first bucket by value: `points[v] = v * count(v)`.
- Forgetting duplicates: taking value v earns ALL copies of v, not just one.
- Sizing the bucket array by `nums.length` instead of by the maximum value.

## Related follow-ups

- [House Robber](05_house_robber.md)
- [House Robber II](06_house_robber_ii.md)
- [Maximum Profit in Job Scheduling](../../../06_Advanced_DP/03_Problems/03_Hard/10_maximum_profit_job_scheduling.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

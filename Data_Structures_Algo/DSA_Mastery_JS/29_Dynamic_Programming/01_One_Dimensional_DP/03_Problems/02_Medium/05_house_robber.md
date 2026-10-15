# House Robber

| | |
|---|---|
| **Topic** | 1D Dynamic Programming |
| **Difficulty** | Medium |
| **Pattern** | take or skip |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #198 — https://leetcode.com/problems/house-robber/ |
| **Solution file** | [05_house_robber.js](../solutions/05_house_robber.js) — open only after a real attempt |

## Problem

nums[i] is the money in house i. You cannot rob two adjacent houses.
Return the maximum money you can rob.

## Examples

```
Input: [1,2,3,1]     Output: 4    Explanation: rob house 0 and 2 (1 + 3)
Input: [2,7,9,3,1]   Output: 12   Explanation: rob 0, 2, 4 (2 + 9 + 1)
```

## Constraints & clarifying questions

```
- 1 <= nums.length <= 100, 0 <= nums[i] <= 400
- Can the array be empty? (return 0 to be safe)

DP DEFINITION
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *take or skip* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^n) time, O(n) space. rob(i) = max(rob(i+1), nums[i] + rob(i+2)).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 4 — Space optimized   O(n) time, O(1) space. Two variables: best with previous house available, best two houses back.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [] -> 0
- [5] -> 5
- [2, 1] -> 2
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n) time, O(n) space

```
rob(i) = max(rob(i+1), nums[i] + rob(i+2)). Two branches per house.
```

### APPROACH 2 — Memoization   O(n) time, O(n) space


### APPROACH 3 — Tabulation   O(n) time, O(n) space

```
Dry run, nums = [2, 7, 9, 3, 1]:
  i (houses used) : 0   1   2   3    4    5
  dp              : 0   2   7   11   11   12
  dp[2] = max(dp[1]=2, dp[0]+7=7) = 7
  dp[3] = max(dp[2]=7, dp[1]+9=11) = 11
  dp[4] = max(dp[3]=11, dp[2]+3=10) = 11
  dp[5] = max(dp[4]=11, dp[3]+1=12) = 12
```

### APPROACH 4 — Space optimized   O(n) time, O(1) space

```
Two variables: best with previous house available, best two houses back.
```

### DP definition

```
STATE:       dp[i] = max money using only houses 0..i-1 (first i houses)
RECURRENCE:  dp[i] = max( dp[i-1],                 // SKIP house i-1
dp[i-2] + nums[i-1] )    // TAKE house i-1
BASE CASES:  dp[0] = 0 (no houses), dp[1] = nums[0]
ANSWER:      dp[n]
This is THE "take or skip" pattern. At every house you make one decision.
```

### Edge cases

```
- [] -> 0
- [5] -> 5
- [2, 1] -> 2
```

Full JavaScript solution with tests: [05_house_robber.js](../solutions/05_house_robber.js). Run it with `node 05_house_robber.js` from the solutions folder.

</details>

## Common mistakes

- Greedy "take every other house" (odd vs even indices). It fails on `[2, 1, 1, 2]` where the best is 4.
- Index confusion between `dp[i]` = "first i houses" and `nums[i]`; decide one meaning and stick to it.
- Not handling a single house (the answer is that house) or an empty street.

## Related follow-ups

- [House Robber II](06_house_robber_ii.md)
- [Delete and Earn](07_delete_and_earn.md)
- [House Robber III (tree DP)](../../../06_Advanced_DP/03_Problems/02_Medium/05_house_robber_iii.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

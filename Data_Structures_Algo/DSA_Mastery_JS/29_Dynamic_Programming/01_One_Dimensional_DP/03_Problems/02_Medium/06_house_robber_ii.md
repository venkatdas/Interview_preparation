# House Robber II

| | |
|---|---|
| **Topic** | 1D Dynamic Programming |
| **Difficulty** | Medium |
| **Pattern** | take or skip, circular |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #213 — https://leetcode.com/problems/house-robber-ii/ |
| **Solution file** | [06_house_robber_ii.js](../solutions/06_house_robber_ii.js) — open only after a real attempt |

## Problem

Same as House Robber, but the houses form a CIRCLE: the first and last
house are adjacent. Return the max money without robbing adjacent houses.

## Examples

```
Input: [2,3,2]     Output: 3    Explanation: can't take both 2s (they're adjacent in the circle)
Input: [1,2,3,1]   Output: 4
Input: [1,2,3]     Output: 3
```

## Constraints & clarifying questions

```
- 1 <= nums.length <= 100
- One house: just take it (no neighbour to conflict with).

KEY TRICK
House 0 and house n-1 can't both be chosen. So the answer is
  max( rob(houses 0..n-2),  rob(houses 1..n-1) )
Each half is the plain linear House Robber.

DP DEFINITION (for one linear segment)
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *take or skip, circular* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^n) time, O(n) space. Plain take/skip recursion over each of the two segments.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 4 — Space optimized   O(n) time, O(1) space. 

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- [1] -> 1 (the segment trick would give two empty segments, handle separately)
- [1, 2] -> 2
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n) time, O(n) space

```
Plain take/skip recursion over each of the two segments.
```

### APPROACH 2 — Memoization   O(n) time, O(n) space


### APPROACH 3 — Tabulation   O(n) time, O(n) space

```
Dry run, nums = [2, 3, 2]:
  segment [2, 3] -> dp: 0, 2, 3  -> 3
  segment [3, 2] -> dp: 0, 3, 3  -> 3
  answer = 3
```

### APPROACH 4 — Space optimized   O(n) time, O(1) space


### DP definition

```
STATE:       dp[i] = max money from the first i houses of the segment
RECURRENCE:  dp[i] = max(dp[i-1], dp[i-2] + segment[i-1])
BASE CASES:  dp[0] = 0, dp[1] = segment[0]
ANSWER:      max(dp over segment A, dp over segment B)
```

### Edge cases

```
- [1] -> 1 (the segment trick would give two empty segments, handle separately)
- [1, 2] -> 2
```

Full JavaScript solution with tests: [06_house_robber_ii.js](../solutions/06_house_robber_ii.js). Run it with `node 06_house_robber_ii.js` from the solutions folder.

</details>

## Common mistakes

- Trying to patch one loop with a "did I take the first house" flag; two clean linear runs are simpler and less buggy.
- Forgetting the single-house case: excluding first and last would leave nothing, but the answer is `nums[0]`.
- Slicing off the wrong ends: run on `[0..n-2]` and on `[1..n-1]`, then take the max.

## Related follow-ups

- [House Robber](05_house_robber.md)
- [Delete and Earn](07_delete_and_earn.md)
- [House Robber III (tree DP)](../../../06_Advanced_DP/03_Problems/02_Medium/05_house_robber_iii.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

# Min Cost Climbing Stairs

| | |
|---|---|
| **Topic** | 1D Dynamic Programming |
| **Difficulty** | Easy |
| **Pattern** | reach the end, min cost |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #746 — https://leetcode.com/problems/min-cost-climbing-stairs/ |
| **Solution file** | [03_min_cost_climbing_stairs.js](../solutions/03_min_cost_climbing_stairs.js) — open only after a real attempt |

## Problem

cost[i] is the price to step ON stair i. Once you pay it you can climb 1 or
2 stairs. You may start at stair 0 or stair 1. Return the minimum cost to
reach the top (one past the last stair).

## Examples

```
Input: cost = [10,15,20]            Output: 15   Explanation: start at 1, pay 15, jump 2 to top
Input: cost = [1,100,1,1,1,100,1,1,100,1]  Output: 6
```

## Constraints & clarifying questions

```
- 2 <= cost.length <= 1000, 0 <= cost[i] <= 999
- Is the "top" index n (one past the array)? (yes)

DP DEFINITION
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *reach the end, min cost* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force   O(2^n) time, O(n) space. From the top, ask: did I come from stair n-1 or n-2?

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 4 — Space optimized   O(n) time, O(1) space. 

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- Two stairs: answer is min(cost[0], cost[1])
- All zeros -> 0
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force   O(2^n) time, O(n) space

```
From the top, ask: did I come from stair n-1 or n-2? Take the cheaper.
```

### APPROACH 2 — Memoization   O(n) time, O(n) space


### APPROACH 3 — Tabulation   O(n) time, O(n) space

```
Dry run, cost = [10, 15, 20]:
  i    : 0   1   2    3(top)
  dp   : 0   0   10   15      dp[2] = min(0+15, 0+10) = 10
                              dp[3] = min(10+20, 0+15) = 15
```

### APPROACH 4 — Space optimized   O(n) time, O(1) space


### DP definition

```
STATE:       dp[i] = min cost to reach stair i (before paying cost[i])
RECURRENCE:  dp[i] = min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2])
BASE CASES:  dp[0] = 0, dp[1] = 0 (free to start on either)
ANSWER:      dp[n]
```

### Edge cases

```
- Two stairs: answer is min(cost[0], cost[1])
- All zeros -> 0
```

Full JavaScript solution with tests: [03_min_cost_climbing_stairs.js](../solutions/03_min_cost_climbing_stairs.js). Run it with `node 03_min_cost_climbing_stairs.js` from the solutions folder.

</details>

## Common mistakes

- Treating the last step as the top. The top is one PAST the last index, so the answer is `dp[n]`, not `dp[n-1]`.
- Charging the cost of the step you land on instead of the step you leave (or charging both).
- Forgetting that you may start on step 0 OR step 1 for free.

## Related follow-ups

- [Climbing Stairs](02_climbing_stairs.md)
- [Jump Game II](../02_Medium/12_jump_game_ii.md)
- [Minimum Path Sum (grid version)](../../../04_Grid_DP/03_Problems/02_Medium/03_minimum_path_sum.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

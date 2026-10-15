# Maximum Profit in Job Scheduling

| | |
|---|---|
| **Topic** | Advanced DP (Bitmask, Tree, Digit, State Machine) |
| **Difficulty** | Hard |
| **Pattern** | DP + binary search |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1235 — https://leetcode.com/problems/maximum-profit-in-job-scheduling/ |
| **Solution file** | [10_maximum_profit_job_scheduling.js](../solutions/10_maximum_profit_job_scheduling.js) — open only after a real attempt |

## Problem

You have n jobs, each with startTime, endTime and profit. Pick a set of jobs with no
time overlap (a job may start exactly when another ends) that maximises total profit.

## Examples

```
Input: start = [1,2,3,3], end = [3,4,5,6], profit = [50,10,40,70]   Output: 120
  Explanation: job 1 (1-3, 50) + job 4 (3-6, 70)
Input: start = [1,2,3,4,6], end = [3,5,10,6,9], profit = [20,20,100,70,60]   Output: 150
  Explanation: job 1 (20) + job 4 (70) + job 5 (60)
Input: start = [1,1,1], end = [2,3,4], profit = [5,6,4]   Output: 6
```

## Constraints & clarifying questions

```
- 1 <= n <= 5 * 10^4, times up to 10^9 (so no "DP over time" array).
- Touching jobs (end == next start) do NOT overlap.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *DP + binary search* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (plain recursion, take or skip)   O(2^n) time, O(n) space. Sort by start.

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — DP + binary search   O(n log n) time, O(n) space. Sort jobs by START time.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- single job -> its profit
- all jobs overlap -> best single profit
- all jobs disjoint -> sum of all
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (plain recursion, take or skip)   O(2^n) time, O(n) space

```
Sort by start. choose(i, lastEnd): skip job i, or take it if start >= lastEnd.
```

### APPROACH 2 — DP + binary search   O(n log n) time, O(n) space

```
Sort jobs by START time.
```

### DP definition

```
STATE      dp[i] = max profit using jobs i..n-1 (suffix), i.e. "best from job i on".
RECURRENCE dp[i] = max( dp[i + 1],                                // skip job i
profit[i] + dp[next(i)] )                 // take job i
           where next(i) = first index j with start[j] >= end[i], found with
           BINARY SEARCH on the sorted start times (that is the whole trick).
BASE CASES dp[n] = 0.
ANSWER     dp[0].
Without binary search, next(i) is a linear scan -> O(n^2). With it, O(n log n).

Dry run example 2 (sorted by start):
  i | start end profit | next(i) | dp[i] = max(dp[i+1], profit + dp[next])
  4 |   6    9    60   |   5     | max(0, 60 + 0) = 60
  3 |   4    6    70   |   4     | max(60, 70 + 60) = 130
  2 |   3   10   100   |   5     | max(130, 100 + 0) = 130
  1 |   2    5    20   |   4     | max(130, 20 + 60) = 130
  0 |   1    3    20   |   2     | max(130, 20 + 130) = 150   <- answer
```

### Edge cases

```
- single job -> its profit
- all jobs overlap -> best single profit
- all jobs disjoint -> sum of all
```

Full JavaScript solution with tests: [10_maximum_profit_job_scheduling.js](../solutions/10_maximum_profit_job_scheduling.js). Run it with `node 10_maximum_profit_job_scheduling.js` from the solutions folder.

</details>

## Common mistakes

- Sorting by start time but binary searching on end times (or the reverse) inconsistently.
- Treating a job that starts exactly when another ends as overlapping; touching is allowed.
- Using a linear scan to find the previous compatible job, which makes it O(n^2).

## Related follow-ups

- [Minimum Difficulty of a Job Schedule](07_minimum_difficulty_job_schedule.md)
- Weighted interval scheduling ([Intervals](../../../../31_Intervals/README.md))
- Maximum Number of Events That Can Be Attended II (LeetCode #1751)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

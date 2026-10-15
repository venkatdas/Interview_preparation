# Minimum Difficulty of a Job Schedule

| | |
|---|---|
| **Topic** | Advanced DP (Bitmask, Tree, Digit, State Machine) |
| **Difficulty** | Hard |
| **Pattern** | partition DP (index + days) |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1335 — https://leetcode.com/problems/minimum-difficulty-of-a-job-schedule/ |
| **Solution file** | [07_minimum_difficulty_job_schedule.js](../solutions/07_minimum_difficulty_job_schedule.js) — open only after a real attempt |

## Problem

Jobs must be done in order over exactly d days; each day you do at least one job
(a contiguous block). A day's difficulty is the MAX difficulty of the jobs done that
day. Minimise the total of the daily difficulties. Return -1 if impossible.

## Examples

```
Input: jobDifficulty = [6,5,4,3,2,1], d = 2   Output: 7
  Explanation: day 1 = [6,5,4,3,2] (max 6), day 2 = [1] -> 6 + 1
Input: [9,9,9], d = 4                          Output: -1   Explanation: fewer jobs than days
Input: [1,1,1], d = 3                          Output: 3
```

## Constraints & clarifying questions

```
- 1 <= n <= 300, 1 <= d <= 10, difficulty up to 1000.
- n < d -> -1.
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 30 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** This is a *partition DP (index + days)* problem. Re-read the recognition clues in [the concepts guide](../../01_Concepts/CONCEPTS.md).

</details>

<details><summary>Hint 2</summary>

**Start simple.** APPROACH 1 — Brute force (plain recursion)   O(n^d) time, O(d) space. solve(i, daysLeft): choose where day `daysLeft` ends (j from i to n - daysLeft), take max(jobs[i..j]) + solve(j + 1, daysLeft - 1).

</details>

<details><summary>Hint 3</summary>

**The key idea.** APPROACH 2 — Memo / tabulation   O(d * n^2) time, O(d * n) space. 

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.**

```
- n < d -> -1
- d = 1 -> max of everything
- all equal difficulties -> d * value
```

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (plain recursion)   O(n^d) time, O(d) space

```
solve(i, daysLeft): choose where day `daysLeft` ends (j from i to n - daysLeft), take
max(jobs[i..j]) + solve(j + 1, daysLeft - 1). Try every cut.
```

### APPROACH 2 — Memo / tabulation   O(d * n^2) time, O(d * n) space

### DP definition

```
STATE      dp[i][k] = min total difficulty to finish jobs i..n-1 in exactly k days.
RECURRENCE dp[i][k] = min over j in [i, n - k] of  max(jobs[i..j]) + dp[j + 1][k - 1]
(day 1 does jobs i..j, the remaining k - 1 days handle j+1..n-1).
           Track the running max while j grows so the inner loop stays O(1) per j.
BASE CASES dp[n][0] = 0 (no jobs, no days). dp[i][0] with i &lt; n = +inf (jobs left but
no days). dp[n][k > 0] = +inf (days left but no jobs).
ANSWER     dp[0][d].
Dry run [6,5,4,3,2,1], d = 2:
  k = 1 (one day for the suffix): dp[i][1] = max(jobs[i..5])
    i : 0 1 2 3 4 5
    dp: 6 5 4 3 2 1
  k = 2, i = 0: try j = 0..4
    j=0: max 6 + dp[1][1]=5 -> 11
    j=1: max 6 + dp[2][1]=4 -> 10
    j=2: 6 + 3 = 9,  j=3: 6 + 2 = 8,  j=4: 6 + 1 = 7   -> dp[0][2] = 7
```

### Edge cases

```
- n < d -> -1
- d = 1 -> max of everything
- all equal difficulties -> d * value
```

Full JavaScript solution with tests: [07_minimum_difficulty_job_schedule.js](../solutions/07_minimum_difficulty_job_schedule.js). Run it with `node 07_minimum_difficulty_job_schedule.js` from the solutions folder.

</details>

## Common mistakes

- Not returning -1 when there are more days than jobs.
- Letting a day be empty; every day must do at least one job, so leave enough jobs for the remaining days.
- Recomputing the max of each segment from scratch; extend the running max as the day grows.

## Related follow-ups

- Split Array Largest Sum (LeetCode #410)
- [Palindrome Partitioning II](../../../05_Interval_DP/03_Problems/03_Hard/04_palindrome_partitioning_ii.md)
- [Maximum Profit in Job Scheduling](10_maximum_profit_job_scheduling.md)

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

# Maximum Profit in Job Scheduling

| | |
|---|---|
| **Topic** | DP Optimizations (Advanced) |
| **Difficulty** | Hard |
| **Pattern** | sort + binary search inside DP |
| **Prerequisites** | [Concepts](../../01_Concepts/CONCEPTS.md) |
| **Source** | LeetCode #1235 — https://leetcode.com/problems/maximum-profit-in-job-scheduling/ |
| **Solution file** | [04_maximum_profit_job_scheduling.js](../solutions/04_maximum_profit_job_scheduling.js) — open only after a real attempt |
| **Interview frequency** | Occasional to fairly common at top-tier companies (weighted interval scheduling is a classic). |

## Problem

There are n jobs. Job i runs during `[startTime[i], endTime[i])` and pays `profit[i]`.
Choose a set of jobs such that no two overlap, and maximise the total profit. A job that
ends at time t is compatible with a job that starts at time t.

## Examples

```
Input: start = [1,2,3,3], end = [3,4,5,6], profit = [50,10,40,70]           Output: 120
Input: start = [1,2,3,4,6], end = [3,5,10,6,9], profit = [20,20,100,70,60]  Output: 150
Input: start = [1,1,1], end = [2,3,4], profit = [5,6,4]                     Output: 6
```

## Constraints & clarifying questions

```
- 1 <= n <= 5e4, 1 <= start < end <= 1e9, 1 <= profit <= 1e4
- Times are huge -> no DP indexed by time
- end == next start is allowed
```

## Your attempt

1. Restate the problem in your own words.
2. Walk through one example by hand.
3. Write the brute force first, state its complexity.
4. Find the bottleneck, then optimize. Timebox: 40 minutes before opening hints.

## Hints (open one at a time)

<details><summary>Hint 1</summary>

**Pattern.** Weighted interval scheduling: DP over jobs sorted by end time, with binary search to find the previous compatible job.

</details>

<details><summary>Hint 2</summary>

**Start simple.** Take/skip recursion is O(2^n). After sorting by end, `dp[i] = max(dp[i-1], profit_i + dp[p])` where p counts jobs that end <= start_i; scanning backwards for p is O(n^2).

</details>

<details><summary>Hint 3</summary>

**The key idea.** The ends are sorted, so p is an *upper bound* binary search on the ends for start_i: O(log n) per job.

</details>

<details><summary>Hint 4</summary>

**Edge cases to handle.** Touching intervals, identical intervals, a single job. Search only among jobs before i.

</details>

## Solution walkthrough (spoiler)

<details><summary>Show approaches, dry run and complexity</summary>

### APPROACH 1 — Brute force (take / skip)   O(2^n) time, O(n) space

```
sort by start; go(i, lastEnd) = max(go(i+1, lastEnd),
                                      profit_i + go(i+1, end_i)  if start_i >= lastEnd)
```

### APPROACH 2 — Optimal (sort by end + binary search)   O(n log n) time, O(n) space

```
sort jobs by end
dp[0] = 0
for i in 1..n:
  p = number of jobs among the first i-1 with end <= start_i     (binary search)
  dp[i] = max(dp[i-1], profit_i + dp[p])
```

Dry run on example 1 (sorted: A[1,3,50] B[2,4,10] C[3,5,40] D[3,6,70]):

```
i | job | p | take          | dp[i]
1 | A   | 0 | 50            | 50
2 | B   | 0 | 10            | 50
3 | C   | 1 | 40 + 50 = 90  | 90
4 | D   | 1 | 70 + 50 = 120 | 120
```

### Complexity

Sorting O(n log n) plus n binary searches O(n log n); dp array O(n).

### Edge cases

```
- one job -> its profit
- end == start of another -> both can be taken (use <= in the search)
```

### Common mistakes

- Sorting by start but binary searching on end (the ends are then not sorted).
- Using `<` instead of `<=` and missing touching intervals.

Full JavaScript solution with tests: [04_maximum_profit_job_scheduling.js](../solutions/04_maximum_profit_job_scheduling.js). Run it with `node 04_maximum_profit_job_scheduling.js` from the solutions folder.

</details>

## Related follow-ups

- Maximum Earnings From Taxi (LeetCode 2008)
- Maximum Number of Events That Can Be Attended II (LeetCode 1751)
- Two Best Non-Overlapping Events (LeetCode 2054)
- Longest Increasing Subsequence (LeetCode 300) — binary search inside DP

## After solving

- Compare your complexity with the solution's. If yours is worse, find the bottleneck.
- Note the mistake you made (if any) in the topic's common-mistakes list and in `PROBLEM_TRACKER.md`.
- Re-solve from scratch in 3 days, then in 1 week.

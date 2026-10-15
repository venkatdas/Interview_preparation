/**
 * 10. Maximum Profit in Job Scheduling   (LeetCode 1235 — Hard)
 *
 * PROBLEM
 * You have n jobs, each with startTime, endTime and profit. Pick a set of jobs with no
 * time overlap (a job may start exactly when another ends) that maximises total profit.
 *
 * EXAMPLES
 * Input: start = [1,2,3,3], end = [3,4,5,6], profit = [50,10,40,70]   Output: 120
 *   Explanation: job 1 (1-3, 50) + job 4 (3-6, 70)
 * Input: start = [1,2,3,4,6], end = [3,5,10,6,9], profit = [20,20,100,70,60]   Output: 150
 *   Explanation: job 1 (20) + job 4 (70) + job 5 (60)
 * Input: start = [1,1,1], end = [2,3,4], profit = [5,6,4]   Output: 6
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= n <= 5 * 10^4, times up to 10^9 (so no "DP over time" array).
 * - Touching jobs (end == next start) do NOT overlap.
 *
 * APPROACH 1 — Brute force (plain recursion, take or skip)   O(2^n) time, O(n) space
 * Sort by start. choose(i, lastEnd): skip job i, or take it if start >= lastEnd.
 *
 * APPROACH 2 — DP + binary search   O(n log n) time, O(n) space
 * Sort jobs by START time.
 * STATE      dp[i] = max profit using jobs i..n-1 (suffix), i.e. "best from job i on".
 * RECURRENCE dp[i] = max( dp[i + 1],                                // skip job i
 *                         profit[i] + dp[next(i)] )                 // take job i
 *            where next(i) = first index j with start[j] >= end[i], found with
 *            BINARY SEARCH on the sorted start times (that is the whole trick).
 * BASE CASES dp[n] = 0.
 * ANSWER     dp[0].
 * Without binary search, next(i) is a linear scan -> O(n^2). With it, O(n log n).
 *
 * Dry run example 2 (sorted by start):
 *   i | start end profit | next(i) | dp[i] = max(dp[i+1], profit + dp[next])
 *   4 |   6    9    60   |   5     | max(0, 60 + 0) = 60
 *   3 |   4    6    70   |   4     | max(60, 70 + 60) = 130
 *   2 |   3   10   100   |   5     | max(130, 100 + 0) = 130
 *   1 |   2    5    20   |   4     | max(130, 20 + 60) = 130
 *   0 |   1    3    20   |   2     | max(130, 20 + 130) = 150   <- answer
 *
 * EDGE CASES
 * - single job -> its profit
 * - all jobs overlap -> best single profit
 * - all jobs disjoint -> sum of all
 */

function sortJobs(startTime, endTime, profit) {
  return startTime
    .map((start, i) => ({ start, end: endTime[i], profit: profit[i] }))
    .sort((a, b) => a.start - b.start);
}

// first index j in jobs (sorted by start) with jobs[j].start >= time
function firstJobStartingAtOrAfter(jobs, time) {
  let low = 0, high = jobs.length;
  while (low < high) {
    const mid = (low + high) >> 1;
    if (jobs[mid].start >= time) high = mid;
    else low = mid + 1;
  }
  return low;
}

function bruteForce(startTime, endTime, profit) {
  const jobs = sortJobs(startTime, endTime, profit);
  function choose(i, lastEnd) {
    if (i === jobs.length) return 0;
    let best = choose(i + 1, lastEnd);                                 // skip
    if (jobs[i].start >= lastEnd) best = Math.max(best, jobs[i].profit + choose(i + 1, jobs[i].end)); // take
    return best;
  }
  return choose(0, 0);
}

function memo(startTime, endTime, profit) {
  const jobs = sortJobs(startTime, endTime, profit);
  const cache = new Array(jobs.length).fill(-1); // dp[i] only depends on i, not on lastEnd!
  function best(i) {
    if (i === jobs.length) return 0;
    if (cache[i] !== -1) return cache[i];
    const next = firstJobStartingAtOrAfter(jobs, jobs[i].end);
    const result = Math.max(best(i + 1), jobs[i].profit + best(next));
    cache[i] = result;
    return result;
  }
  return best(0);
}

function tabulation(startTime, endTime, profit) {
  const jobs = sortJobs(startTime, endTime, profit);
  const n = jobs.length;
  const dp = new Array(n + 1).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    const next = firstJobStartingAtOrAfter(jobs, jobs[i].end);
    dp[i] = Math.max(dp[i + 1], jobs[i].profit + dp[next]);
  }
  return dp[0];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation]) {
  assert.strictEqual(solve([1, 2, 3, 3], [3, 4, 5, 6], [50, 10, 40, 70]), 120);
  assert.strictEqual(solve([1, 2, 3, 4, 6], [3, 5, 10, 6, 9], [20, 20, 100, 70, 60]), 150);
  assert.strictEqual(solve([1, 1, 1], [2, 3, 4], [5, 6, 4]), 6);
  assert.strictEqual(solve([5], [9], [8]), 8);
  assert.strictEqual(solve([1, 3, 5], [3, 5, 7], [1, 1, 1]), 3);   // touching jobs are fine
  assert.strictEqual(solve([4, 2, 4, 8, 2], [5, 5, 5, 10, 8], [1, 2, 8, 10, 4]), 18);
}
console.log('✓ 10-maximum-profit-job-scheduling passed');

module.exports = { bruteForce, memo, tabulation };

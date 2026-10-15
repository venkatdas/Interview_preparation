/**
 * 04. Maximum Profit in Job Scheduling   (LeetCode 1235 — Hard)
 *
 * PROBLEM
 * There are n jobs; job i runs on [startTime[i], endTime[i]) and pays profit[i].
 * Pick a set of jobs with no two overlapping and maximise the total profit.
 * A job that ends at time t does not overlap a job that starts at time t.
 *
 * EXAMPLES
 * start = [1,2,3,3], end = [3,4,5,6], profit = [50,10,40,70]            -> 120 (jobs 0 and 3)
 * start = [1,2,3,4,6], end = [3,5,10,6,9], profit = [20,20,100,70,60]   -> 150 (jobs 0, 3, 4)
 * start = [1,1,1], end = [2,3,4], profit = [5,6,4]                      -> 6
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= n <= 5e4, times up to 1e9 (so no array indexed by time!), profit up to 1e4.
 * - Touching endpoints allowed? (yes, end == start is fine)
 *
 * APPROACH 1 — Brute force (take / skip every job)   O(2^n) time, O(n) space
 * Sort by start; recursively either skip job i or take it (if it starts after the last
 * chosen end). Exponential - only for checking small cases.
 *
 * APPROACH 2 — Optimal (sort by end + binary search)   O(n log n) time, O(n) space
 * Sort jobs by end time. dp[i] = best profit using only the first i jobs.
 *   skip job i:  dp[i-1]
 *   take job i:  profit + dp[p]  where p = how many jobs end <= start of job i
 * Because the ends are sorted, p is found by binary search (upper bound of start).
 * Without the binary search this is the O(n^2) "scan backwards" DP.
 *
 * Dry run on example 1 (sorted by end: A[1,3,50] B[2,4,10] C[3,5,40] D[3,6,70]):
 *   i | job | p (ends <= start)   | take          | skip | dp[i]
 *   1 | A   | 0                   | 50 + 0  = 50  | 0    | 50
 *   2 | B   | 0 (3 > 2)           | 10 + 0  = 10  | 50   | 50
 *   3 | C   | 1 (A ends at 3)     | 40 + 50 = 90  | 50   | 90
 *   4 | D   | 1                   | 70 + 50 = 120 | 90   | 120
 *
 * EDGE CASES
 * - one job -> its profit
 * - identical intervals -> only the best one
 * - chains that touch (end == next start) -> all can be taken
 */

function bruteForce(startTime, endTime, profit) {
  const jobs = startTime.map((s, i) => [s, endTime[i], profit[i]]).sort((a, b) => a[0] - b[0]);
  const go = (i, lastEnd) => {
    if (i === jobs.length) return 0;
    let best = go(i + 1, lastEnd);                                  // skip
    if (jobs[i][0] >= lastEnd) best = Math.max(best, jobs[i][2] + go(i + 1, jobs[i][1])); // take
    return best;
  };
  return go(0, -Infinity);
}

function optimal(startTime, endTime, profit) {
  const n = startTime.length;
  const jobs = startTime.map((s, i) => [s, endTime[i], profit[i]]).sort((a, b) => a[1] - b[1]);
  const dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    const [s, , p] = jobs[i - 1];
    let lo = 0;
    let hi = i - 1;                     // answer in [0, i-1]
    while (lo < hi) {                   // first job (among 0..i-2) whose end > s
      const mid = (lo + hi) >> 1;
      if (jobs[mid][1] <= s) lo = mid + 1; else hi = mid;
    }
    dp[i] = Math.max(dp[i - 1], p + dp[lo]);
  }
  return dp[n];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 2, 3, 3], [3, 4, 5, 6], [50, 10, 40, 70]), 120);
  assert.strictEqual(solve([1, 2, 3, 4, 6], [3, 5, 10, 6, 9], [20, 20, 100, 70, 60]), 150);
  assert.strictEqual(solve([1, 1, 1], [2, 3, 4], [5, 6, 4]), 6);
  assert.strictEqual(solve([5], [9], [3]), 3);
  assert.strictEqual(solve([1, 2, 3], [2, 3, 4], [1, 1, 1]), 3);         // touching chain
  assert.strictEqual(solve([1, 1], [5, 5], [4, 9]), 9);                  // identical intervals
  assert.strictEqual(solve([1e9 - 2], [1e9], [7]), 7);                   // huge times
}

function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(1235);
for (let t = 0; t < 300; t++) {
  const n = 1 + Math.floor(rand() * 12);
  const s = [];
  const e = [];
  const p = [];
  for (let i = 0; i < n; i++) {
    const a = Math.floor(rand() * 20);
    s.push(a);
    e.push(a + 1 + Math.floor(rand() * 6));
    p.push(1 + Math.floor(rand() * 30));
  }
  assert.strictEqual(optimal(s, e, p), bruteForce(s, e, p));
}
console.log('✓ 04_maximum_profit_job_scheduling passed');

module.exports = { optimal, bruteForce };

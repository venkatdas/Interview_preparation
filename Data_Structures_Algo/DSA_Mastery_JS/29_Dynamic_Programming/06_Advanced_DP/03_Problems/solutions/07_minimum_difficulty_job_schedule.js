/**
 * 07. Minimum Difficulty of a Job Schedule   (LeetCode 1335 — Hard)
 *
 * PROBLEM
 * Jobs must be done in order over exactly d days; each day you do at least one job
 * (a contiguous block). A day's difficulty is the MAX difficulty of the jobs done that
 * day. Minimise the total of the daily difficulties. Return -1 if impossible.
 *
 * EXAMPLES
 * Input: jobDifficulty = [6,5,4,3,2,1], d = 2   Output: 7
 *   Explanation: day 1 = [6,5,4,3,2] (max 6), day 2 = [1] -> 6 + 1
 * Input: [9,9,9], d = 4                          Output: -1   Explanation: fewer jobs than days
 * Input: [1,1,1], d = 3                          Output: 3
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= n <= 300, 1 <= d <= 10, difficulty up to 1000.
 * - n < d -> -1.
 *
 * APPROACH 1 — Brute force (plain recursion)   O(n^d) time, O(d) space
 * solve(i, daysLeft): choose where day `daysLeft` ends (j from i to n - daysLeft), take
 * max(jobs[i..j]) + solve(j + 1, daysLeft - 1). Try every cut.
 *
 * APPROACH 2 — Memo / tabulation   O(d * n^2) time, O(d * n) space
 * STATE      dp[i][k] = min total difficulty to finish jobs i..n-1 in exactly k days.
 * RECURRENCE dp[i][k] = min over j in [i, n - k] of  max(jobs[i..j]) + dp[j + 1][k - 1]
 *            (day 1 does jobs i..j, the remaining k - 1 days handle j+1..n-1).
 *            Track the running max while j grows so the inner loop stays O(1) per j.
 * BASE CASES dp[n][0] = 0 (no jobs, no days). dp[i][0] with i < n = +inf (jobs left but
 *            no days). dp[n][k > 0] = +inf (days left but no jobs).
 * ANSWER     dp[0][d].
 *
 * Dry run [6,5,4,3,2,1], d = 2:
 *   k = 1 (one day for the suffix): dp[i][1] = max(jobs[i..5])
 *     i : 0 1 2 3 4 5
 *     dp: 6 5 4 3 2 1
 *   k = 2, i = 0: try j = 0..4
 *     j=0: max 6 + dp[1][1]=5 -> 11
 *     j=1: max 6 + dp[2][1]=4 -> 10
 *     j=2: 6 + 3 = 9,  j=3: 6 + 2 = 8,  j=4: 6 + 1 = 7   -> dp[0][2] = 7
 *
 * EDGE CASES
 * - n < d -> -1
 * - d = 1 -> max of everything
 * - all equal difficulties -> d * value
 */

function bruteForce(jobDifficulty, d) {
  const n = jobDifficulty.length;
  if (n < d) return -1;
  function solve(start, daysLeft) {
    if (daysLeft === 0) return start === n ? 0 : Infinity;
    let best = Infinity;
    let dayMax = 0;
    // leave at least daysLeft - 1 jobs for the remaining days
    for (let end = start; end <= n - daysLeft; end++) {
      dayMax = Math.max(dayMax, jobDifficulty[end]);
      best = Math.min(best, dayMax + solve(end + 1, daysLeft - 1));
    }
    return best;
  }
  return solve(0, d);
}

function memo(jobDifficulty, d) {
  const n = jobDifficulty.length;
  if (n < d) return -1;
  // 2D cache array: cache[start][daysLeft]; -1 = not computed
  const cache = Array.from({ length: n + 1 }, () => new Array(d + 1).fill(-1));
  function solve(start, daysLeft) {
    if (daysLeft === 0) return start === n ? 0 : Infinity;
    if (cache[start][daysLeft] !== -1) return cache[start][daysLeft];
    let best = Infinity;
    let dayMax = 0;
    for (let end = start; end <= n - daysLeft; end++) {
      dayMax = Math.max(dayMax, jobDifficulty[end]);
      best = Math.min(best, dayMax + solve(end + 1, daysLeft - 1));
    }
    cache[start][daysLeft] = best;
    return best;
  }
  return solve(0, d);
}

function tabulation(jobDifficulty, d) {
  const n = jobDifficulty.length;
  if (n < d) return -1;
  // dp[i][k] = min difficulty for jobs i..n-1 in k days
  const dp = Array.from({ length: n + 1 }, () => new Array(d + 1).fill(Infinity));
  dp[n][0] = 0;
  for (let k = 1; k <= d; k++) {
    for (let i = 0; i <= n - k; i++) {
      let dayMax = 0;
      for (let j = i; j <= n - k; j++) {
        dayMax = Math.max(dayMax, jobDifficulty[j]);
        dp[i][k] = Math.min(dp[i][k], dayMax + dp[j + 1][k - 1]);
      }
    }
  }
  return dp[0][d];
}

function optimized(jobDifficulty, d) {
  // Rolling 1D array over k: only dp[.][k-1] is needed to build dp[.][k].
  const n = jobDifficulty.length;
  if (n < d) return -1;
  let prev = new Array(n + 1).fill(Infinity);
  prev[n] = 0;
  for (let k = 1; k <= d; k++) {
    const current = new Array(n + 1).fill(Infinity);
    for (let i = 0; i <= n - k; i++) {
      let dayMax = 0;
      for (let j = i; j <= n - k; j++) {
        dayMax = Math.max(dayMax, jobDifficulty[j]);
        current[i] = Math.min(current[i], dayMax + prev[j + 1]);
      }
    }
    prev = current;
  }
  return prev[0];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve([6, 5, 4, 3, 2, 1], 2), 7);
  assert.strictEqual(solve([9, 9, 9], 4), -1);
  assert.strictEqual(solve([1, 1, 1], 3), 3);
  assert.strictEqual(solve([7, 1, 7, 1, 7, 1], 3), 15);
  assert.strictEqual(solve([11, 111, 22, 222, 33, 333, 44, 444], 6), 843);
  assert.strictEqual(solve([5], 1), 5);
}
console.log('✓ 07-minimum-difficulty-job-schedule passed');

module.exports = { bruteForce, memo, tabulation, optimized };

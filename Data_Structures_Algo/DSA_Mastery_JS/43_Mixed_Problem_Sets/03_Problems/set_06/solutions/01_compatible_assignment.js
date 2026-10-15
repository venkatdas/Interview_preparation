/**
 * 01. Compatible Assignment   (Original — Hard)
 *
 * PROBLEM
 * n workers and n jobs. cost[w][j] is what worker w charges for job j, or null if worker w
 * cannot do job j. Every worker must get exactly one job and every job exactly one worker.
 * Return the minimum total cost, or -1 if no complete assignment exists. n <= 15.
 *
 * EXAMPLES
 * Input: [[4, 1, 3],
 *         [2, 0, 5],
 *         [3, 2, 2]]            Output: 5   Explanation: w0->j1 (1), w1->j0 (2), w2->j2 (2)
 * Input: [[1, null], [2, null]] Output: -1  Explanation: nobody can do job 1
 * Input: []                     Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n <= 15 (2^15 * 15 is about 500k states: fine). Costs non-negative.
 * - Is the matrix square? (yes)
 *
 * APPROACH 1 — Brute force   O(n! * n) time, O(n) space
 * Try every permutation (backtracking): worker i takes any unused allowed job.
 *
 * APPROACH 2 — Optimal (DP over bitmasks of used jobs)   O(2^n * n) time, O(2^n) space
 * Workers are assigned in order 0, 1, 2, ... so the number of set bits in the mask tells
 * which worker is next: w = popcount(mask). dp[mask] = min cost to give jobs in mask to
 * workers 0..w-1. Transition: for each job j not in mask that worker w may do,
 * dp[mask | 1<<j] = min(dp[mask] + cost[w][j]). Answer dp[(1<<n) - 1].
 * Many different orders reach the same mask — the DP solves each mask once instead of
 * once per permutation (that is the n! -> 2^n saving).
 *
 * Dry run on the 3x3 example (masks written as job bits j2 j1 j0):
 *   dp[000]=0
 *   worker 0: dp[001]=4, dp[010]=1, dp[100]=3
 *   worker 1: dp[011]=min(4+0, 1+2)=3, dp[101]=min(4+5, 3+2)=5, dp[110]=min(1+5, 3+0)=3
 *   worker 2: dp[111]=min(dp[011]+2, dp[101]+2, dp[110]+3) = min(5, 7, 6) = 5
 *   answer 5
 *
 * EDGE CASES
 * - n = 0 -> 0
 * - a job nobody can do -> -1
 * - a worker who can do nothing -> -1
 *
 * COMMON MISTAKES
 * - Keeping both "which worker" and "mask" as state (the worker is implied by popcount).
 * - Greedy (each worker takes their cheapest free job): fails, e.g. on the example.
 */

function bruteForce(cost) {
  const n = cost.length;
  const used = new Array(n).fill(false);
  let best = Infinity;
  (function go(w, sum) {
    if (w === n) { best = Math.min(best, sum); return; }
    for (let j = 0; j < n; j++) {
      if (used[j] || cost[w][j] === null) continue;
      used[j] = true; go(w + 1, sum + cost[w][j]); used[j] = false;
    }
  })(0, 0);
  return best === Infinity ? -1 : best;
}

function popcount(x) { let c = 0; while (x) { x &= x - 1; c++; } return c; }

function optimal(cost) {
  const n = cost.length;
  const full = (1 << n) - 1;
  const dp = new Array(1 << n).fill(Infinity);
  dp[0] = 0;
  for (let mask = 0; mask < full; mask++) {
    if (dp[mask] === Infinity) continue;
    const w = popcount(mask); // next worker to assign
    for (let j = 0; j < n; j++) {
      if (mask & (1 << j) || cost[w][j] === null) continue;
      const nm = mask | (1 << j);
      if (dp[mask] + cost[w][j] < dp[nm]) dp[nm] = dp[mask] + cost[w][j];
    }
  }
  return dp[full] === Infinity ? -1 : dp[full];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([[4, 1, 3], [2, 0, 5], [3, 2, 2]]), 5);
  assert.strictEqual(solve([[1, null], [2, null]]), -1);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([[7]]), 7);
  assert.strictEqual(solve([[null]]), -1);
  assert.strictEqual(solve([[1, 2], [1, 100]]), 3); // greedy w0->j0 would cost 101
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(601);
for (let t = 0; t < 300; t++) {
  const n = Math.floor(rand() * 7);
  const cost = Array.from({ length: n }, () => Array.from({ length: n }, () => (rand() < 0.2 ? null : Math.floor(rand() * 20))));
  assert.strictEqual(optimal(cost), bruteForce(cost));
}
console.log('✓ set_06/01_compatible_assignment passed');
module.exports = { optimal, bruteForce };

/**
 * 02. Unique Paths   (LeetCode 62 — Medium)
 *
 * PROBLEM
 * A robot starts at the top-left cell of an m x n grid and wants to reach the bottom-right
 * cell. It can only move right or down. Count the distinct paths.
 *
 * EXAMPLES
 * Input: m = 3, n = 7   Output: 28
 * Input: m = 3, n = 2   Output: 3     (RDD, DRD, DDR)
 * Input: m = 1, n = 1   Output: 1     (already there: the empty path)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= m, n <= 100 (LeetCode promises the answer fits in 2 * 10^9)
 * - Outside that promise the count can be huge -> return a BigInt? (exactBig does)
 *
 * APPROACH 1 — Brute force (grid DP)   O(m*n) time, O(n) space
 * paths[r][c] = paths[r-1][c] + paths[r][c-1]. Rolling one row keeps space O(n).
 * (Pure recursion without memo would be exponential.)
 *
 * APPROACH 2 — Optimal (combinatorial formula)   O(min(m, n)) time, O(1) space
 * Every path is a word of (m-1) D's and (n-1) R's. A path is fully decided by WHICH of the
 * (m+n-2) moves are D's -> answer = C(m+n-2, m-1).
 * Compute it multiplicatively: res = res * (N - k + i) / i for i = 1..k. After step i, res is
 * exactly C(N-k+i, i), an integer, so dividing never leaves a fraction. In plain numbers the
 * intermediate res * (N-k+i) can exceed 2^53 for large grids, so the exact version uses BigInt.
 *
 * Dry run, m = 3, n = 7: N = 8, k = min(2, 6) = 2
 *   i=1: res = 1 * 7 / 1 = 7
 *   i=2: res = 7 * 8 / 2 = 28   -> 28
 *
 * EDGE CASES
 * - m = 1 or n = 1 -> 1 (a single straight line)
 * - m = n = 1 -> 1
 * - large m, n -> use BigInt to stay exact
 */

function bruteForce(m, n) {
  const row = new Array(n).fill(1); // first row: only one way to each cell
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) row[c] += row[c - 1]; // from above (old row[c]) + from left
  }
  return row[n - 1];
}

/** Exact answer as a BigInt for any grid size. */
function exactBig(m, n) {
  const N = m + n - 2;
  const k = Math.min(m - 1, n - 1);
  let res = 1n;
  for (let i = 1; i <= k; i++) res = (res * BigInt(N - k + i)) / BigInt(i);
  return res;
}

function optimal(m, n) {
  return Number(exactBig(m, n)); // within the LeetCode promise this is exact
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(3, 7), 28);
  assert.strictEqual(solve(3, 2), 3);
  assert.strictEqual(solve(1, 1), 1);
  assert.strictEqual(solve(1, 50), 1);
  assert.strictEqual(solve(7, 3), 28); // symmetric
  assert.strictEqual(solve(10, 10), 48620);
}
assert.strictEqual(exactBig(100, 100), 22750883079422934966181954039568885395604168260154104734000n);
function mulberry32(seed) {
  return function () {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(2);
for (let t = 0; t < 200; t++) {
  const m = 1 + Math.floor(rand() * 17), n = 1 + Math.floor(rand() * 17);
  assert.strictEqual(optimal(m, n), bruteForce(m, n));
}
console.log('✓ 02_unique_paths passed');

module.exports = { optimal, bruteForce, exactBig };

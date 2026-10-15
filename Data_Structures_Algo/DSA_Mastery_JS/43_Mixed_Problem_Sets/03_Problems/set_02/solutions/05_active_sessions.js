/**
 * 05. Active Sessions   (Original — Medium)
 *
 * PROBLEM
 * A website logs user sessions as [start, end): a session is active at time t when
 * start <= t < end. Given the sessions and a list of query times, return for every query
 * how many sessions are active at that moment (answers in query order).
 *
 * EXAMPLES
 * Input: sessions = [[1, 5], [2, 3], [4, 8]], queries = [2, 3, 5, 0]   Output: [2, 1, 1, 0]
 *        Explanation: t=3 -> [2,3) already ended, only [1,5); t=5 -> only [4,8)
 * Input: sessions = [], queries = [1]                                  Output: [0]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Up to 10^5 sessions and 10^5 queries -> O(n * q) is too slow.
 * - Is end exclusive? (yes) Can start === end? (yes; such a session is never active)
 *
 * APPROACH 1 — Brute force   O(n * q) time, O(1) extra space
 * For each query, scan all sessions and count start <= t < end.
 *
 * APPROACH 2 — Optimal (sort starts and ends separately + binary search)   O((n + q) log n) time, O(n) space
 * active(t) = #(start <= t) - #(end <= t). Every session with end <= t also has
 * start <= t (start <= end), so the subtraction removes exactly the finished ones.
 * Both counts are "upper bound" binary searches on sorted arrays.
 *
 * Dry run on sessions [[1,5],[2,3],[4,8]]:
 *   starts = [1, 2, 4]   ends = [3, 5, 8]
 *   t=2: starts <= 2 -> 2, ends <= 2 -> 0 -> 2
 *   t=3: starts <= 3 -> 2, ends <= 3 -> 1 -> 1
 *   t=5: starts <= 5 -> 3, ends <= 5 -> 2 -> 1
 *   t=0: 0 - 0 -> 0
 *
 * EDGE CASES
 * - no sessions                 -> zeros
 * - query exactly at an end     -> that session is NOT counted (exclusive end)
 * - zero-length sessions        -> cancel out
 *
 * COMMON MISTAKES
 * - Pairing starts and ends after sorting them separately (they no longer belong
 *   together — and you do not need them to).
 * - Using "< t" instead of "<= t" for the ends count.
 */

function bruteForce(sessions, queries) {
  return queries.map((t) => sessions.filter(([s, e]) => s <= t && t < e).length);
}

function countAtMost(sorted, x) {
  let lo = 0, hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] <= x) lo = mid + 1; else hi = mid;
  }
  return lo;
}

function optimal(sessions, queries) {
  const starts = sessions.map((s) => s[0]).sort((a, b) => a - b);
  const ends = sessions.map((s) => s[1]).sort((a, b) => a - b);
  return queries.map((t) => countAtMost(starts, t) - countAtMost(ends, t));
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([[1, 5], [2, 3], [4, 8]], [2, 3, 5, 0]), [2, 1, 1, 0]);
  assert.deepStrictEqual(solve([], [1]), [0]);
  assert.deepStrictEqual(solve([[3, 3]], [3]), [0]);
  assert.deepStrictEqual(solve([[0, 10], [0, 10]], [0, 9, 10]), [2, 2, 0]);
  assert.deepStrictEqual(solve([[1, 2]], []), []);
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(205);
for (let t = 0; t < 300; t++) {
  const sessions = Array.from({ length: Math.floor(rand() * 8) }, () => {
    const s = Math.floor(rand() * 20); return [s, s + Math.floor(rand() * 8)];
  });
  const queries = Array.from({ length: Math.floor(rand() * 6) }, () => Math.floor(rand() * 30) - 2);
  assert.deepStrictEqual(optimal(sessions, queries), bruteForce(sessions, queries));
}
console.log('✓ set_02/05_active_sessions passed');
module.exports = { optimal, bruteForce };

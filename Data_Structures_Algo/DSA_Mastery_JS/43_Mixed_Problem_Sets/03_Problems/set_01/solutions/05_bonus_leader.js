/**
 * 05. Bonus Leader   (Original — Medium)
 *
 * PROBLEM
 * n employees sit in a row, numbered 0..n-1, each starting with 0 points. You get a list
 * of updates [l, r, delta]: every employee from l to r (inclusive) gains delta points
 * (delta may be negative). After all updates, return the index of the employee with the
 * most points. On a tie return the smallest index. n >= 1.
 *
 * EXAMPLES
 * Input: n = 5, updates = [[0, 2, 3], [1, 4, 2]]       Output: 1   Explanation: points [3,5,5,2,2]
 * Input: n = 3, updates = []                           Output: 0   Explanation: all zero, smallest index
 * Input: n = 4, updates = [[0, 3, -1], [2, 2, -5]]     Output: 0   Explanation: [-1,-1,-6,-1]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n and the number of updates up to 10^5 each, so applying each update cell by cell is too slow.
 * - 0 <= l <= r < n. Totals fit in a JS number.
 *
 * APPROACH 1 — Brute force   O(n * q) time, O(n) space
 * Keep a points array and add delta to every cell of every range, then find the max.
 *
 * APPROACH 2 — Optimal (difference array + prefix sum + running argmax)   O(n + q) time, O(n) space
 * Record each update in a difference array: diff[l] += delta, diff[r + 1] -= delta.
 * A prefix sum over diff rebuilds the real points. Track the best value and the first
 * index that reached it during the same pass (use strict > so ties keep the smaller index).
 *
 * Dry run on n = 5, updates = [[0,2,3],[1,4,2]]:
 *   diff after updates: [3, 2, 0, -3, 0, -2]
 *   i=0 run=3   best=3 at 0
 *   i=1 run=5   best=5 at 1
 *   i=2 run=5   tie -> keep 1
 *   i=3 run=2
 *   i=4 run=2
 *   answer 1
 *
 * EDGE CASES
 * - no updates           -> 0
 * - all totals negative  -> still pick the max (start best at -Infinity, not 0)
 * - r = n - 1            -> diff needs n + 1 slots
 *
 * COMMON MISTAKES
 * - diff array of size n: diff[r + 1] is out of range for r = n - 1 (in JS it silently grows the array; in other languages it crashes).
 * - Using >= when comparing: returns the LAST index of a tie.
 */

function bruteForce(n, updates) {
  const pts = new Array(n).fill(0);
  for (const [l, r, d] of updates) for (let i = l; i <= r; i++) pts[i] += d;
  let bestIdx = 0;
  for (let i = 1; i < n; i++) if (pts[i] > pts[bestIdx]) bestIdx = i;
  return bestIdx;
}

function optimal(n, updates) {
  const diff = new Array(n + 1).fill(0);
  for (const [l, r, d] of updates) { diff[l] += d; diff[r + 1] -= d; }
  let run = 0, best = -Infinity, bestIdx = 0;
  for (let i = 0; i < n; i++) {
    run += diff[i];
    if (run > best) { best = run; bestIdx = i; } // strict > keeps the smallest index on ties
  }
  return bestIdx;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(5, [[0, 2, 3], [1, 4, 2]]), 1);
  assert.strictEqual(solve(3, []), 0);
  assert.strictEqual(solve(4, [[0, 3, -1], [2, 2, -5]]), 0);
  assert.strictEqual(solve(1, [[0, 0, 7]]), 0);
  assert.strictEqual(solve(4, [[3, 3, 1]]), 3);
  assert.strictEqual(solve(4, [[0, 1, -2], [2, 3, -1]]), 2);
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(105);
for (let t = 0; t < 300; t++) {
  const n = 1 + Math.floor(rand() * 10);
  const q = Math.floor(rand() * 6);
  const updates = Array.from({ length: q }, () => {
    const l = Math.floor(rand() * n), r = l + Math.floor(rand() * (n - l));
    return [l, r, Math.floor(rand() * 11) - 5];
  });
  assert.strictEqual(optimal(n, updates), bruteForce(n, updates));
}
console.log('✓ set_01/05_bonus_leader passed');
module.exports = { optimal, bruteForce };

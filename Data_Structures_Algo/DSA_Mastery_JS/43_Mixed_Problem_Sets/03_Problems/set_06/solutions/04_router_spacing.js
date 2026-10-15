/**
 * 04. Router Spacing   (Original — Medium)
 *
 * PROBLEM
 * A long corridor has candidate mounting points at integer `positions` (distinct, not
 * sorted). You must install exactly k routers (2 <= k <= positions.length) on k different
 * points. To reduce interference, maximize the smallest distance between any two routers.
 * Return that maximum possible smallest distance.
 *
 * EXAMPLES
 * Input: positions = [1, 2, 8, 4, 9], k = 3   Output: 3   Explanation: 1, 4, 8 (or 1, 4, 9)
 * Input: positions = [5, 1], k = 2            Output: 4
 * Input: positions = [0, 10, 20, 30], k = 4   Output: 10
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Up to 10^5 positions in [0, 10^9]. Distinct? (yes)
 *
 * APPROACH 1 — Brute force   O(C(n, k) * k) time
 * Sort, try every combination of k points, take the best minimum gap.
 *
 * APPROACH 2 — Optimal (sort + binary search on the answer + greedy placement)   O(n log n + n log(range)) time, O(1) extra
 * Check(d): can k routers be placed with every gap >= d? Greedy: put one at the first
 * point, then always at the next point that is >= last + d. Placing as early as possible
 * never hurts later choices, so greedy finds the maximum count. Check is monotonic
 * (true for small d, false for large) -> binary search the largest true d.
 *
 * Dry run on sorted [1, 2, 4, 8, 9], k = 3 (lo=1, hi=8):
 *   d=5: 1, 8 -> only 2   false -> hi=4
 *   d=3: 1, 4, 8 -> 3     true  -> lo=3  (mid computed as upper middle)
 *   d=4: 1, 8 -> 2        false -> hi=3
 *   answer 3
 *
 * EDGE CASES
 * - k = n -> the smallest adjacent gap
 * - k = 2 -> max - min
 *
 * COMMON MISTAKES
 * - Lower middle with lo = mid: infinite loop. Use mid = (lo + hi + 1) >> 1 when searching for the last true.
 * - Forgetting to sort.
 */

function bruteForce(positions, k) {
  const a = positions.slice().sort((x, y) => x - y);
  let best = 0;
  const pick = [];
  (function go(i) {
    if (pick.length === k) {
      let m = Infinity;
      for (let t = 1; t < k; t++) m = Math.min(m, pick[t] - pick[t - 1]);
      best = Math.max(best, m); return;
    }
    if (i === a.length) return;
    pick.push(a[i]); go(i + 1); pick.pop(); go(i + 1);
  })(0);
  return best;
}

function fits(a, k, d) {
  let count = 1, last = a[0];
  for (let i = 1; i < a.length && count < k; i++) if (a[i] - last >= d) { count++; last = a[i]; }
  return count >= k;
}

function optimal(positions, k) {
  const a = positions.slice().sort((x, y) => x - y);
  let lo = 1, hi = a[a.length - 1] - a[0];
  while (lo < hi) {
    const mid = Math.floor((lo + hi + 1) / 2); // upper middle: we keep the last true
    if (fits(a, k, mid)) lo = mid; else hi = mid - 1;
  }
  return lo;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 2, 8, 4, 9], 3), 3);
  assert.strictEqual(solve([5, 1], 2), 4);
  assert.strictEqual(solve([0, 10, 20, 30], 4), 10);
  assert.strictEqual(solve([0, 1, 100], 3), 1);
  assert.strictEqual(solve([0, 1000000000], 2), 1000000000);
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(604);
for (let t = 0; t < 300; t++) {
  const set = new Set();
  const n = 2 + Math.floor(rand() * 8);
  while (set.size < n) set.add(Math.floor(rand() * 50));
  const k = 2 + Math.floor(rand() * (n - 1));
  assert.strictEqual(optimal([...set], k), bruteForce([...set], k));
}
console.log('✓ set_06/04_router_spacing passed');
module.exports = { optimal, bruteForce };

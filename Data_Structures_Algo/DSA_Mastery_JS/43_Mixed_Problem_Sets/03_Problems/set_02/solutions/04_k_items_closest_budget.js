/**
 * 04. K Items Closest to Budget   (Original — Medium)
 *
 * PROBLEM
 * A shop lists item prices `prices` (positive integers, possibly repeated). You must buy
 * EXACTLY k different items (different positions) and the total must not exceed
 * `budget`. Return the largest total you can reach, or -1 if no choice of k items fits.
 * n <= 20.
 *
 * EXAMPLES
 * Input: prices = [5, 3, 8, 6], k = 2, budget = 12   Output: 11   Explanation: 5 + 6 (or 3 + 8)
 * Input: prices = [5, 3, 8, 6], k = 3, budget = 10   Output: -1   Explanation: cheapest three cost 14
 * Input: prices = [4, 4], k = 0, budget = 0          Output: 0    Explanation: buying nothing costs 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n <= 20. Prices up to 10^6.
 * - k can be 0 (answer 0) or larger than n (answer -1).
 *
 * APPROACH 1 — Brute force   O(2^n * n) time, O(1) space
 * Enumerate every bitmask, keep those with exactly k bits, compute the sum, keep the best
 * sum <= budget.
 *
 * APPROACH 2 — Optimal (sort + backtracking with pruning)   O(C(n, k)) worst case, usually far less; O(k) space
 * Sort prices ascending and choose items left to right. Prune a branch when:
 *   - the cheapest way to finish (next "need" items, which are the next ones in sorted
 *     order) already exceeds the budget -> stop the whole loop, later items are pricier;
 *   - the most expensive way to finish (the last "need" items) cannot beat the best so far;
 *   - best === budget (cannot do better).
 * Prefix sums make both bounds O(1).
 *
 * Dry run on prices = [5, 3, 8, 6], k = 2, budget = 12:
 *   sorted = [3, 5, 6, 8]
 *   pick 3 -> pick 5 (8), pick 6 (9), pick 8 (11)   best=11
 *   pick 5 -> need 1 more: max possible 5+8=13 > 11, try: 5+6=11, 5+8=13 > 12 stop
 *   pick 6 -> cheapest finish 6+8=14 > 12 -> stop
 *   answer 11
 *
 * EDGE CASES
 * - k = 0               -> 0
 * - k > n               -> -1
 * - budget below the k cheapest items -> -1
 *
 * COMMON MISTAKES
 * - Pruning with "continue" instead of "break" when prices are sorted (still correct, just slower).
 * - Treating equal prices as the same item: positions are different items.
 */

function bruteForce(prices, k, budget) {
  const n = prices.length;
  let best = -1;
  for (let mask = 0; mask < (1 << n); mask++) {
    let bits = 0, sum = 0;
    for (let i = 0; i < n; i++) if (mask & (1 << i)) { bits++; sum += prices[i]; }
    if (bits === k && sum <= budget && sum > best) best = sum;
  }
  return best;
}

function optimal(prices, k, budget) {
  const a = prices.slice().sort((x, y) => x - y);
  const n = a.length;
  if (k > n) return -1;
  const pre = [0];
  for (const p of a) pre.push(pre[pre.length - 1] + p);
  let best = -1;
  function dfs(start, need, sum) {
    if (need === 0) { if (sum > best) best = sum; return; }
    for (let i = start; i + need <= n; i++) {
      if (best === budget) return; // cannot improve
      const cheapest = sum + pre[i + need] - pre[i]; // take a[i..i+need-1]
      if (cheapest > budget) break; // later starts are only more expensive
      const priciest = sum + a[i] + pre[n] - pre[n - need + 1]; // a[i] + the largest need-1
      if (priciest <= best) continue; // this branch cannot beat best
      dfs(i + 1, need - 1, sum + a[i]);
    }
  }
  dfs(0, k, 0);
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([5, 3, 8, 6], 2, 12), 11);
  assert.strictEqual(solve([5, 3, 8, 6], 3, 10), -1);
  assert.strictEqual(solve([4, 4], 0, 0), 0);
  assert.strictEqual(solve([4, 4], 3, 100), -1);
  assert.strictEqual(solve([4, 4, 4], 2, 8), 8);
  assert.strictEqual(solve([10, 1, 2, 7], 2, 9), 9);
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(204);
for (let t = 0; t < 300; t++) {
  const n = Math.floor(rand() * 10);
  const prices = Array.from({ length: n }, () => 1 + Math.floor(rand() * 15));
  const k = Math.floor(rand() * (n + 2));
  const budget = Math.floor(rand() * 60);
  assert.strictEqual(optimal(prices, k, budget), bruteForce(prices, k, budget));
}
console.log('✓ set_02/04_k_items_closest_budget passed');
module.exports = { optimal, bruteForce };

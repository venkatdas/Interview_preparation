/**
 * 04. Doubling Inner Loop   (Original — Medium)
 *
 * PROBLEM
 * Analyze the step count of this function and give a tight Θ bound. Then write a
 * closed form that computes the EXACT count in O(log n) time.
 *
 *   function f(n) {
 *     let steps = 0;
 *     for (let i = 1; i < n; i++)
 *       for (let j = 1; j <= i; j *= 2)
 *         steps++;
 *     return steps;
 *   }
 *
 * EXAMPLES
 * n = 1 -> 0    n = 2 -> 1    n = 5 -> 1+2+2+3 = 8    n = 9 -> 1+2+2+3+3+3+3+4 = 21
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 1e15 for the closed form (brute force only up to ~1e6).
 *
 * APPROACH 1 — Brute force (run it)   Θ(n log n)
 * Run the nested loops with a counter.
 *
 * APPROACH 2 — Optimal (group i by bit length)   O(log n)
 * For fixed i, j takes the values 1, 2, 4, ... ≤ i: that is floor(log2 i) + 1 = bitLength(i) values.
 * So steps = Σ_{i=1}^{n-1} bitLength(i). All i in [2^k, 2^(k+1)) have bitLength k + 1,
 * and there are 2^k of them. Sum group by group, cutting the last group at n - 1.
 * Each term is ≤ log2 n and there are n terms -> O(n log n); the upper half
 * i ≥ n/2 alone contributes (n/2)·log2(n/2) -> Ω(n log n). Hence Θ(n log n).
 *
 * Dry run n = 9 (i = 1..8):
 *   bit length 1: i = 1        -> 1 × 1 = 1
 *   bit length 2: i = 2,3      -> 2 × 2 = 4
 *   bit length 3: i = 4..7     -> 4 × 3 = 12
 *   bit length 4: i = 8        -> 1 × 4 = 4      total 21
 *
 * EMPIRICAL CHECK
 * doubling ratio slightly above 2 (n log n), e.g. ≈ 2.1 near n = 2^16, approaching 2 slowly.
 *
 * EDGE CASES
 * - n = 1 -> no i at all -> 0
 * - the last group is partial (n - 1 is usually not 2^(k+1) - 1)
 *
 * COMMON MISTAKES
 * - "Two nested loops => n²". The inner loop is logarithmic.
 * - Using Σ log2 i without the +1 (off by n).
 */
const { doublingRatio, mulberry32 } = require('../../02_Implementations/growth');

function bruteForce(n) {
  let steps = 0;
  for (let i = 1; i < n; i++) for (let j = 1; j <= i; j *= 2) steps++;
  return steps;
}

function optimal(n) {
  const last = n - 1; // i runs 1..last
  let total = 0;
  for (let k = 0, lo = 1; lo <= last; k++, lo *= 2) {
    const hi = Math.min(2 * lo - 1, last);   // group [2^k, 2^(k+1) - 1]
    total += (hi - lo + 1) * (k + 1);
  }
  return total;
}

// ---------- tests ----------
const assert = require('assert');
for (const [n, s] of [[1, 0], [2, 1], [5, 8], [9, 21]]) {
  assert.strictEqual(bruteForce(n), s);
  assert.strictEqual(optimal(n), s);
}
for (let n = 0; n <= 3000; n++) assert.strictEqual(optimal(n), bruteForce(n));
const r = doublingRatio(bruteForce, 1 << 16);
assert.ok(r > 2 && r < 2.2, `ratio ${r}`);
// n log n bounds: (n/2)log2(n/2) <= steps <= n (log2 n + 1)
for (const n of [1e3, 1e6, 1e12]) {
  const s = optimal(n);
  assert.ok(s <= n * (Math.log2(n) + 1) && s >= (n / 2) * Math.log2(n / 2));
}
const rand = mulberry32(404);
for (let t = 0; t < 100; t++) { const n = Math.floor(rand() * 50000); assert.strictEqual(optimal(n), bruteForce(n)); }
console.log('✓ 04_doubling_inner_loop passed');

module.exports = { optimal, bruteForce };

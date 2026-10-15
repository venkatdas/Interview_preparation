/**
 * 01. Binary Counter Bit Flips   (Original — Easy)
 *
 * PROBLEM
 * A binary counter starts at 0. Each increment flips the trailing 1s to 0 and the next
 * 0 to 1. Return the TOTAL number of bit flips performed by n increments (0 -> n).
 * A single increment can flip many bits (0111 -> 1000 flips 4), yet the total is small.
 * Find a closed form and explain the amortized cost per increment.
 *
 * EXAMPLES
 * n = 1 -> 1      (0 -> 1)
 * n = 2 -> 3      (+1, then 01 -> 10 flips 2)
 * n = 4 -> 7      (1 + 2 + 1 + 3)
 * n = 8 -> 15
 * n = 0 -> 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 1e15 -> simulation is impossible; need a formula.
 * - The counter has enough bits (no overflow).
 *
 * APPROACH 1 — Brute force (simulate)   O(n) amortized total work
 * Keep the value; for each increment from k to k+1, the cost is (number of trailing
 * ones of k) + 1. Sum it up.
 *
 * APPROACH 2 — Optimal (aggregate counting / potential)   O(log n)
 * Aggregate view: bit i flips every 2^i increments, so it flips floor(n / 2^i) times.
 *   total = Σ_i floor(n / 2^i) = 2n - popcount(n)
 * (Proof of the identity: Σ floor(n/2^i) = n - popcount(n) for i >= 1, plus n for i = 0.)
 * Potential view: Φ = number of 1 bits. An increment costing t + 1 changes Φ by 1 - t,
 * so amortized cost = (t + 1) + (1 - t) = 2. Total real = 2n - Φ(final) = 2n - popcount(n). Same formula!
 *
 * Dry run n = 4:
 *   0->1 cost 1, 1->10 cost 2, 10->11 cost 1, 11->100 cost 3 -> total 7
 *   formula: 2·4 - popcount(100₂) = 8 - 1 = 7
 *
 * EDGE CASES
 * - n = 0 -> 0
 * - n = 2^k - 1 (all ones) -> 2n - k: the smallest Φ drop
 * - n up to 1e15: use Math.floor division, not 32-bit shifts
 *
 * COMMON MISTAKES
 * - Bounding each increment by log n and concluding O(n log n) total (true, but loose).
 * - Using n >> i for n beyond 2^31 (32-bit funnel).
 */
const { BinaryCounter, mulberry32 } = require('../../02_Implementations/amortized_algorithms');

function bruteForce(n) {
  let total = 0;
  for (let k = 0; k < n; k++) {
    let t = 0, x = k;
    while (x % 2 === 1) { t++; x = (x - 1) / 2; } // trailing ones of k
    total += t + 1;
  }
  return total;
}

function popcount(n) {
  let c = 0;
  while (n > 0) { c += n % 2; n = Math.floor(n / 2); }
  return c;
}

function optimal(n) {
  return 2 * n - popcount(n);
}

// ---------- tests ----------
const assert = require('assert');
for (const [n, f] of [[0, 0], [1, 1], [2, 3], [4, 7], [8, 15]]) {
  assert.strictEqual(bruteForce(n), f);
  assert.strictEqual(optimal(n), f);
}
for (let n = 0; n <= 5000; n++) assert.strictEqual(optimal(n), bruteForce(n));
// cross-check with the instrumented counter
const c = new BinaryCounter(40);
for (let i = 0; i < 3000; i++) c.increment();
assert.strictEqual(c.flips, optimal(3000));
// amortized: always < 2 per increment
assert.ok(optimal(1e15) < 2 * 1e15);
const rand = mulberry32(511);
for (let t = 0; t < 50; t++) { const n = Math.floor(rand() * 100000); assert.strictEqual(optimal(n), bruteForce(n)); }
console.log('✓ 01_binary_counter_flips passed');

module.exports = { optimal, bruteForce };

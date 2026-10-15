/**
 * 02. Halving Loop   (Original — Easy)
 *
 * PROBLEM
 * Analyze this function. Give the exact number of loop iterations as a formula in n
 * (n >= 1), a tight Θ bound, and confirm it with a step counter.
 *
 *   function countHalvings(n) {
 *     let steps = 0;
 *     for (let i = n; i > 0; i = Math.floor(i / 2)) steps++;
 *     return steps;
 *   }
 *
 * Then answer: what changes if the update is i = i - 2 instead? And i = Math.floor(i / 3)?
 *
 * EXAMPLES
 * n = 1 -> 1    n = 2 -> 2    n = 7 -> 3    n = 8 -> 4    n = 1e9 -> 30
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n is a positive integer up to 2^53.
 * - Does the base of the logarithm matter for Θ? (no; it matters for the exact count)
 *
 * APPROACH 1 — Brute force (run it)   Θ(log n)
 * Run the loop and count.
 *
 * APPROACH 2 — Optimal (closed form)   Θ(1)
 * Each iteration removes one binary digit from i (floor(i/2) is i >> 1 for small i).
 * The loop runs once per bit of n: steps = floor(log2 n) + 1 = the bit length of n.
 * Use n.toString(2).length to avoid floating-point log errors near powers of two.
 * Θ(log n). Variants: i -= 2 -> ceil(n/2) iterations, Θ(n); i = floor(i/3) -> floor(log3 n) + 1, still Θ(log n)
 * (different base = constant factor).
 *
 * EMPIRICAL CHECK
 * Doubling n adds exactly ONE step: steps(2n) = steps(n) + 1. The ratio steps(2n)/steps(n) -> 1.
 *
 * EDGE CASES
 * - n = 1 -> 1 step
 * - exact powers of two: Math.log2(2**k) is exact, but Math.log2 on large non-powers can round; the bit-length formula is safer
 *
 * COMMON MISTAKES
 * - Off by one: answering floor(log2 n) (forgets the iteration with i = 1).
 * - Calling it Θ(n/2) because "it halves": the NUMBER of halvings is logarithmic.
 */
const { mulberry32 } = require('../../02_Implementations/growth');

function bruteForce(n) {
  let steps = 0;
  for (let i = n; i > 0; i = Math.floor(i / 2)) steps++;
  return steps;
}

function optimal(n) {
  return n.toString(2).length; // = floor(log2 n) + 1 for n >= 1
}

function bruteBase3(n) { let s = 0; for (let i = n; i > 0; i = Math.floor(i / 3)) s++; return s; }

// ---------- tests ----------
const assert = require('assert');
for (const [n, s] of [[1, 1], [2, 2], [7, 3], [8, 4], [1e9, 30]]) {
  assert.strictEqual(bruteForce(n), s);
  assert.strictEqual(optimal(n), s);
}
for (let n = 1; n <= 5000; n++) assert.strictEqual(optimal(n), bruteForce(n));
for (let n = 1; n <= 5000; n++) assert.strictEqual(bruteForce(2 * n), bruteForce(n) + 1, 'doubling adds one step');
for (let n = 1; n <= 2000; n++) assert.strictEqual(bruteBase3(n), n.toString(3).length);
const rand = mulberry32(402);
for (let t = 0; t < 500; t++) {
  const n = 1 + Math.floor(rand() * Number.MAX_SAFE_INTEGER);
  assert.strictEqual(optimal(n), bruteForce(n));
}
console.log('✓ 02_halving_loop passed');

module.exports = { optimal, bruteForce };

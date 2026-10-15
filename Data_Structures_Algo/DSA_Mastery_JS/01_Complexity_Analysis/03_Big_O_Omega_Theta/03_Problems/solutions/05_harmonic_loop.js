/**
 * 05. Harmonic Loop   (Original — Medium)
 *
 * PROBLEM
 * This loop is the skeleton of the Sieve of Eratosthenes and of "for every number,
 * visit all its multiples" algorithms. Count the inner steps exactly, give a tight
 * Θ bound, and compute the exact count for n = 1e12 (brute force cannot).
 *
 *   for (let i = 1; i <= n; i++)
 *     for (let j = i; j <= n; j += i)
 *       steps++;
 *
 * EXAMPLES
 * n = 1 -> 1    n = 4 -> 4+2+1+1 = 8    n = 8 -> 20    n = 10 -> 27
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 1e12 for the formula. Result fits in a double exactly? (≈ 2.8e13 < 2^53, yes)
 *
 * APPROACH 1 — Brute force (run it)   Θ(n log n)
 * For each i the inner loop visits i, 2i, 3i, ... ≤ n: floor(n / i) times.
 *
 * APPROACH 2 — Optimal (divisor-block trick)   O(√n)
 * steps = Σ_{i=1}^{n} floor(n / i). floor(n/i) takes only O(√n) distinct values:
 * for a block of i with the same q = floor(n/i), the block ends at i' = floor(n / q).
 * Add q × (block length) and jump to i' + 1.
 * Growth: Σ n/i = n·H(n) ≈ n ln n, and the floors subtract at most n -> Θ(n log n).
 * (A sieve that only starts from primes is Θ(n log log n): even fewer steps.)
 *
 * Dry run n = 10, blocks:
 *   i=1: q=10, ends 1 -> 10      i=2: q=5, ends 2 -> 5     i=3: q=3, ends 3 -> 3
 *   i=4..5: q=2 -> 2×2 = 4       i=6..10: q=1 -> 5×1 = 5    total 27
 *
 * EMPIRICAL CHECK
 * steps(n) / (n ln n) -> 1 (it is n ln n + (2γ - 1) n + O(√n), γ ≈ 0.577).
 *
 * EDGE CASES
 * - n = 1 -> 1
 * - very large n: use the block formula, never the loop
 *
 * COMMON MISTAKES
 * - Calling it Θ(n²) because of nesting.
 * - Calling it Θ(n) because "the inner loop shrinks fast": the harmonic series diverges (log n).
 */
const { mulberry32 } = require('../../02_Implementations/growth');

function bruteForce(n) {
  let steps = 0;
  for (let i = 1; i <= n; i++) for (let j = i; j <= n; j += i) steps++;
  return steps;
}

function optimal(n) {
  let total = 0;
  for (let i = 1; i <= n; ) {
    const q = Math.floor(n / i);
    const end = Math.floor(n / q);
    total += q * (end - i + 1);
    i = end + 1;
  }
  return total;
}

// ---------- tests ----------
const assert = require('assert');
for (const [n, s] of [[0, 0], [1, 1], [4, 8], [8, 20], [10, 27]]) {
  assert.strictEqual(bruteForce(n), s);
  assert.strictEqual(optimal(n), s);
}
for (let n = 0; n <= 3000; n++) assert.strictEqual(optimal(n), bruteForce(n));
const gamma = 0.5772156649;
for (const n of [1e6, 1e9, 1e12]) {
  const s = optimal(n);
  const approx = n * Math.log(n) + (2 * gamma - 1) * n;
  assert.ok(Math.abs(s - approx) <= 2 * Math.sqrt(n), `n=${n}`);
}
const rand = mulberry32(405);
for (let t = 0; t < 100; t++) { const n = Math.floor(rand() * 100000); assert.strictEqual(optimal(n), bruteForce(n)); }
console.log('✓ 05_harmonic_loop passed');

module.exports = { optimal, bruteForce };

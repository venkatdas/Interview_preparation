/**
 * 07. Three Half-Size Calls   (Original — Medium)
 *
 * PROBLEM
 * Count the total number of calls made by g(n), give the recurrence, solve it with
 * the master theorem, and give an exact closed form.
 *
 *   function g(n) {
 *     calls++;
 *     if (n <= 1) return;
 *     const h = n >> 1;          // floor(n / 2)
 *     g(h); g(h); g(h);          // three recursive calls on half the size, O(1) other work
 *   }
 *
 * Bonus: the "buggy fast power" pow(x, n) = pow(x, n/2) * pow(x, n/2) has the same
 * shape with TWO calls. What is its complexity?
 *
 * EXAMPLES
 * n = 1 -> 1 call    n = 2 -> 4    n = 3 -> 4    n = 4 -> 13    n = 8 -> 40    n = 1024 -> 88573
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n >= 1 integer.
 *
 * APPROACH 1 — Brute force (run it)   Θ(n^log2(3))
 * Run g with a counter.
 *
 * APPROACH 2 — Optimal (closed form)   O(1)
 * Recurrence: C(n) = 3·C(floor(n/2)) + 1, C(1) = 1.
 * Master theorem: a = 3, b = 2, d = 0; log2 3 ≈ 1.585 > 0 -> case 1 (leaves dominate) -> Θ(n^1.585).
 * Every n in [2^k, 2^(k+1)) halves down to 1 in exactly k steps, so the call tree is a
 * complete ternary tree of depth k: C = 1 + 3 + 9 + ... + 3^k = (3^(k+1) - 1) / 2,
 * with k = floor(log2 n) = bitLength(n) - 1.
 * Number of leaves 3^k = (2^k)^log2(3) ≈ n^1.585: this is Karatsuba's shape (with an O(n) merge, still case 1).
 * Bonus: two calls -> C(n) = 2C(n/2) + 1 -> case 1 with log2 2 = 1 -> Θ(n). The "fast" power
 * becomes linear unless you store the half result.
 *
 * EMPIRICAL CHECK
 * Doubling n triples the leaves: C(2n) / C(n) -> 3 = 2^1.585.
 *
 * EDGE CASES
 * - n = 1 -> 1 call (just the base case)
 * - n = 2 and n = 3 give the same count (floor)
 *
 * COMMON MISTAKES
 * - Answering Θ(n log n) or Θ(n) by "each level halves": the NUMBER of calls triples per level.
 * - Using log base 10 for the exponent (log10 3 ≠ log2 3).
 */
const { masterTheorem, doublingRatio, mulberry32 } = require('../../02_Implementations/growth');

function bruteForce(n) {
  let calls = 0;
  (function g(m) {
    calls++;
    if (m <= 1) return;
    const h = m >> 1;
    g(h); g(h); g(h);
  })(n);
  return calls;
}

function optimal(n) {
  const k = n.toString(2).length - 1;
  return (3 ** (k + 1) - 1) / 2;
}

function buggyPowCalls(n) {
  let calls = 0;
  (function p(m) { calls++; if (m <= 1) return; p(m >> 1); p(m >> 1); })(n);
  return calls;
}

// ---------- tests ----------
const assert = require('assert');
for (const [n, c] of [[1, 1], [2, 4], [3, 4], [4, 13], [8, 40], [1024, 88573]]) {
  assert.strictEqual(bruteForce(n), c);
  assert.strictEqual(optimal(n), c);
}
for (let n = 1; n <= 3000; n++) assert.strictEqual(optimal(n), bruteForce(n));
assert.strictEqual(masterTheorem(3, 2, 0).bound, 'Theta(n^1.585)');
assert.strictEqual(masterTheorem(3, 2, 1).case, 1, 'Karatsuba is case 1 too');
assert.ok(Math.abs(doublingRatio(bruteForce, 512) - 3) < 0.01);
assert.strictEqual(masterTheorem(2, 2, 0).bound, 'Theta(n)');
assert.strictEqual(buggyPowCalls(1024), 2047, 'linear, not logarithmic');
const rand = mulberry32(407);
for (let t = 0; t < 100; t++) { const n = 1 + Math.floor(rand() * 20000); assert.strictEqual(optimal(n), bruteForce(n)); }
console.log('✓ 07_three_half_calls passed');

module.exports = { optimal, bruteForce };

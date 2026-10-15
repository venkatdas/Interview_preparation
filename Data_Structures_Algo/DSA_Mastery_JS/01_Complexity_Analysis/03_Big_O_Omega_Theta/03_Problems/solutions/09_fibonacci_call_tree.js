/**
 * 09. Fibonacci Call Tree   (Original — Hard)
 *
 * PROBLEM
 * Count the calls made by naive recursive Fibonacci, prove the count is exactly
 * 2·F(n+1) - 1, and derive a tight bound. Explain why the master theorem does not
 * apply, and compare with the memoized version's call count.
 *
 *   function fib(n) { calls++; if (n < 2) return n; return fib(n - 1) + fib(n - 2); }
 *
 * EXAMPLES
 * (Fibonacci numbers: F(0)=0, F(1)=1, F(2)=1, F(3)=2, ...)
 * n = 0 -> 1 call   n = 1 -> 1   n = 2 -> 3   n = 5 -> 15   n = 10 -> 177   n = 30 -> 2692537
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Exact count for n up to 70 (fits in a double: 2F(71) ≈ 6.1e14 < 2^53).
 *
 * APPROACH 1 — Brute force (run it)   Θ(φ^n)
 * Run naive fib with a counter (only up to n ≈ 32 in reasonable time).
 *
 * APPROACH 2 — Optimal (prove a closed form, evaluate it iteratively)   O(n)
 * Recurrence: C(n) = C(n-1) + C(n-2) + 1, C(0) = C(1) = 1.
 * Guess C(n) = 2F(n+1) - 1. Proof by induction:
 *   base: C(0) = 2F(1) - 1 = 1 ✓, C(1) = 2F(2) - 1 = 1 ✓
 *   step: C(n) = (2F(n) - 1) + (2F(n-1) - 1) + 1 = 2(F(n) + F(n-1)) - 1 = 2F(n+1) - 1 ✓
 * F(n) = Θ(φ^n) with φ = (1 + √5)/2 ≈ 1.618 (Binet), so C(n) = Θ(φ^n).
 * Loose bounds also work: C(n) ≤ 2C(n-1)+1 -> O(2^n); C(n) ≥ 2C(n-2) -> Ω(√2^n). φ^n is the tight one.
 * The master theorem needs subproblems of size n/b; here sizes are n-1 and n-2 (subtract-and-conquer).
 * Memoized fib: each value is computed once and calls fib twice -> 2n - 1 calls for n >= 1: Θ(n).
 *
 * EMPIRICAL CHECK
 * C(n+1) / C(n) -> φ ≈ 1.618 (constant ratio per +1 step = exponential growth).
 *
 * EDGE CASES
 * - n = 0, 1 -> one call each
 * - large n: use the closed form; never run naive fib past ~35 in tests
 *
 * COMMON MISTAKES
 * - Saying Θ(2^n) as the tight bound (it is an upper bound; tight is φ^n).
 * - Saying the space is exponential too: the stack depth is only n -> Θ(n) space.
 */
const { mulberry32 } = require('../../02_Implementations/growth');

function bruteForce(n) {
  let calls = 0;
  (function fib(m) { calls++; if (m < 2) return m; return fib(m - 1) + fib(m - 2); })(n);
  return calls;
}

function fibNumber(n) { let a = 0, b = 1; for (let i = 0; i < n; i++) [a, b] = [b, a + b]; return a; }

function optimal(n) {
  return 2 * fibNumber(n + 1) - 1;
}

function memoCalls(n) {
  let calls = 0;
  const memo = new Map();
  (function fib(m) {
    calls++;
    if (m < 2) return m;
    if (memo.has(m)) return memo.get(m);
    const v = fib(m - 1) + fib(m - 2);
    memo.set(m, v);
    return v;
  })(n);
  return calls;
}

// ---------- tests ----------
const assert = require('assert');
for (const [n, c] of [[0, 1], [1, 1], [2, 3], [5, 15], [10, 177], [30, 2692537]]) {
  assert.strictEqual(bruteForce(n), c);
  assert.strictEqual(optimal(n), c);
}
for (let n = 0; n <= 25; n++) assert.strictEqual(optimal(n), bruteForce(n));
const phi = (1 + Math.sqrt(5)) / 2;
assert.ok(Math.abs(optimal(61) / optimal(60) - phi) < 1e-9);
assert.ok(optimal(70) < 2 ** 70, 'O(2^n) is a valid but loose upper bound');
for (let n = 1; n <= 500; n++) assert.strictEqual(memoCalls(n), 2 * n - 1);
const rand = mulberry32(409);
for (let t = 0; t < 20; t++) { const n = Math.floor(rand() * 22); assert.strictEqual(optimal(n), bruteForce(n)); }
console.log('✓ 09_fibonacci_call_tree passed');

module.exports = { optimal, bruteForce, memoCalls };

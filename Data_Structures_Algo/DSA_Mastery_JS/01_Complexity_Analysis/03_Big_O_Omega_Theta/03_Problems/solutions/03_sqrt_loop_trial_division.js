/**
 * 03. Square-Root Loop and Trial Division   (Original — Easy)
 *
 * PROBLEM
 * Analyze trial division. Count the number of times the % check runs, and give the
 * BEST-case and WORST-case Θ bounds as a function of n. Which inputs produce each case?
 *
 *   function isPrime(n) {                       // n >= 2
 *     for (let d = 2; d * d <= n; d++)
 *       if (n % d === 0) return false;          // <- count this check
 *     return true;
 *   }
 *
 * Write a closed-form step count: steps(n) = (smallest divisor d of n with d*d <= n) - 1
 * if such a divisor exists, else floor(sqrt(n)) - 1.
 *
 * EXAMPLES
 * n = 2 -> 0 checks (loop never runs)     n = 4 -> 1 (d = 2 divides)
 * n = 97 (prime) -> 8 (d = 2..9)          n = 1000000 -> 1 (even: best case)
 * n = 999983 (prime) -> 998               n = 25 -> 4 (d = 2,3,4,5)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 1e12 -> worst case 1e6 checks: fine.
 * - Is the input SIZE n, or the number of digits? (here we analyze in terms of the value n;
 *   in terms of bits b, √n = 2^(b/2): exponential! This is a pseudo-polynomial algorithm.)
 *
 * APPROACH 1 — Brute force (run it)   Θ(1) best, Θ(√n) worst
 * Run the loop with a counter.
 *
 * APPROACH 2 — Optimal (closed form)   O(√n) to find the smallest divisor, O(1) to evaluate
 * The loop stops at the smallest divisor d ≤ √n, after d - 1 checks (d = 2 is the first check).
 * If n is prime, no divisor ≤ √n exists and the loop runs d = 2..floor(√n): floor(√n) - 1 checks.
 * Best case: n even -> 1 check -> Θ(1). Worst case: n prime -> Θ(√n).
 * Average over all n is dominated by small divisors (half the numbers are even), but
 * "the complexity of isPrime" usually means the worst case: Θ(√n).
 *
 * EMPIRICAL CHECK
 * For primes p near 4x apart, steps grow ~2x (√ signature): steps(4p) / steps(p) ≈ 2.
 *
 * EDGE CASES
 * - n = 2, 3 -> 0 checks
 * - perfect squares of primes (25, 49): the divisor is exactly √n, so d*d <= n must use <=
 * - floating sqrt: use an integer correction, not Math.floor(Math.sqrt(n)) blindly for huge n
 *
 * COMMON MISTAKES
 * - Saying "Ω(1) because best case" — Ω and best case are different things (see concepts 5.2).
 * - Loop condition d * d < n: misses the square divisor (25 would be "prime").
 */
const { mulberry32 } = require('../../02_Implementations/growth');

function bruteForce(n) {
  let steps = 0;
  for (let d = 2; d * d <= n; d++) {
    steps++;
    if (n % d === 0) return steps;
  }
  return steps;
}

function isqrt(n) {
  let r = Math.floor(Math.sqrt(n));
  while (r * r > n) r--;
  while ((r + 1) * (r + 1) <= n) r++;
  return r;
}

function optimal(n) {
  const root = isqrt(n);
  for (let d = 2; d <= root; d++) if (n % d === 0) return d - 1; // smallest divisor
  return Math.max(0, root - 1);
}

// ---------- tests ----------
const assert = require('assert');
for (const [n, s] of [[2, 0], [4, 1], [97, 8], [1000000, 1], [999983, 998], [25, 4]]) {
  assert.strictEqual(bruteForce(n), s, `brute ${n}`);
  assert.strictEqual(optimal(n), s, `optimal ${n}`);
}
for (let n = 2; n <= 20000; n++) assert.strictEqual(optimal(n), bruteForce(n));
// √ signature on primes: 4x the value -> ~2x the steps
const primes = [10007, 40009, 160001, 640007];
const steps = primes.map(bruteForce);
for (let i = 1; i < steps.length; i++) {
  const r = steps[i] / steps[i - 1];
  assert.ok(r > 1.9 && r < 2.1, `ratio ${r}`);
}
const rand = mulberry32(403);
for (let t = 0; t < 300; t++) {
  const n = 2 + Math.floor(rand() * 1e9);
  assert.strictEqual(optimal(n), bruteForce(n));
}
console.log('✓ 03_sqrt_loop_trial_division passed');

module.exports = { optimal, bruteForce };

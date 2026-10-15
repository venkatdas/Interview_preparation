/**
 * 06. Pow(x, n)   (LeetCode 50 — Medium)
 *
 * PROBLEM
 * Implement pow(x, n): compute x raised to the integer power n. n can be negative.
 *
 * EXAMPLES
 * Input: x = 2, n = 10     Output: 1024
 * Input: x = 2, n = -2     Output: 0.25     Explanation: 1 / 2^2
 * Input: x = 2.1, n = 3    Output: 9.261
 * Input: x = 5, n = 0      Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can n be negative? (yes -> 1 / x^|n|)
 * - Can I use Math.pow / **? (no, that is the point of the question)
 * - How large is n? (up to 2^31, so an O(n) loop is too slow; and -2^31 negated overflows in
 *   32-bit languages, in JS it is fine)
 * - Floating point: is approximate equality acceptable? (yes)
 *
 * APPROACH 1 — Brute force   O(|n|) time, O(1) space
 * Multiply x by itself |n| times. For n = 10^9 that is a billion multiplications.
 *
 * APPROACH 2 — Optimal (binary exponentiation)   O(log |n|) time, O(1) space
 * x^n = (x^2)^(n/2) when n is even, and x * (x^2)^((n-1)/2) when n is odd.
 * Loop: if the current bit of n is 1, multiply the result by the current base; then square
 * the base and shift n right. Each iteration halves n, so about 31 iterations max.
 *
 * Dry run x=2, n=10 (binary 1010):
 *   n=10 even          base=4        result=1
 *   n=5  odd  result=4 base=16
 *   n=2  even          base=256      result=4
 *   n=1  odd  result=4*256=1024  base=65536
 *   n=0  -> 1024
 *
 * EDGE CASES
 * - n = 0            -> 1 (even for x = 0)
 * - n negative       -> invert x, use |n|
 * - x = 1 or -1      -> stays 1 / alternates sign
 * - x = 0, n > 0     -> 0
 */

function bruteForce(x, n) {
  const exponent = Math.abs(n);
  let result = 1;
  for (let i = 0; i < exponent; i++) result *= x;
  return n < 0 ? 1 / result : result;
}

function optimal(x, n) {
  let base = x;
  let exponent = Math.abs(n);
  let result = 1;

  while (exponent > 0) {
    if (exponent % 2 === 1) result *= base; // this bit is set: include the current power
    base *= base;                            // x -> x^2 -> x^4 -> x^8 ...
    exponent = Math.floor(exponent / 2);
  }
  return n < 0 ? 1 / result : result;
}

// recursive version (same idea, O(log n) stack) - often what interviewers expect first
function optimalRecursive(x, n) {
  if (n === 0) return 1;
  if (n < 0) return 1 / optimalRecursive(x, -n);
  const half = optimalRecursive(x, Math.floor(n / 2));
  return n % 2 === 0 ? half * half : half * half * x;
}

// ---------- tests ----------
const assert = require('assert');
const close = (a, b) => Math.abs(a - b) < 1e-9;
for (const solve of [bruteForce, optimal, optimalRecursive]) {
  assert.strictEqual(solve(2, 10), 1024);
  assert.strictEqual(solve(2, -2), 0.25);
  assert.ok(close(solve(2.1, 3), 9.261));
  assert.strictEqual(solve(5, 0), 1);
  assert.strictEqual(solve(0, 5), 0);
  assert.strictEqual(solve(-2, 3), -8);
  assert.strictEqual(solve(1, 1000), 1);
  assert.strictEqual(solve(-1, 1001), -1);
}
assert.strictEqual(optimal(2, 30), 1073741824);
assert.strictEqual(optimal(2, -31), 2 ** -31);
assert.strictEqual(optimalRecursive(3, 13), 1594323);
console.log('✓ 06-pow-x-n passed');

module.exports = { optimal, bruteForce, optimalRecursive };

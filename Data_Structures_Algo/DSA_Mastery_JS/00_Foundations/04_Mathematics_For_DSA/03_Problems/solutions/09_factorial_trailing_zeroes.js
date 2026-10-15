/**
 * 09. Factorial Trailing Zeroes   (LeetCode 172 — Medium)
 *
 * PROBLEM
 * Given an integer n, return the number of trailing zeroes in n! (n factorial).
 *
 * EXAMPLES
 * Input: 3    Output: 0    Explanation: 3! = 6
 * Input: 5    Output: 1    Explanation: 5! = 120
 * Input: 25   Output: 6    Explanation: 25! ends in 000000
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 10^4; n! has thousands of digits, so computing it is not the plan
 * - Follow-up: can you do it in O(log n)?
 *
 * APPROACH 1 — Brute force (compute n! with BigInt, count zeros)   O(n * digits) time, O(digits) space
 * Multiply 1..n as a BigInt, convert to a string, count trailing '0's. Works for small n
 * only; the number grows to ~35,000 digits for n = 10^4.
 *
 * APPROACH 2 — Optimal (count factors of 5)   O(log5 n) time, O(1) space
 * A trailing zero comes from a factor of 10 = 2 * 5. In n! there are always far more 2s than
 * 5s, so the number of zeros equals the number of times 5 appears as a factor across
 * 1..n. Multiples of 5 contribute one 5 each (n / 5 of them), multiples of 25 contribute a
 * second one (n / 25), multiples of 125 a third (n / 125), and so on.
 *
 * Dry run on n = 25:
 *   25 / 5   = 5   (5, 10, 15, 20, 25)
 *   25 / 25  = 1   (25 has a second factor of 5)
 *   25 / 125 = 0   stop
 *   total = 6
 * Dry run on n = 100: 100/5 = 20, 100/25 = 4, 100/125 = 0 -> 24
 *
 * EDGE CASES
 * - n = 0 -> 0! = 1 -> 0 zeroes
 * - n < 5 -> 0
 * - n = 5^k boundaries (5, 25, 125) each add a new layer
 */

function bruteForce(n) {
  let product = 1n;
  for (let i = 2n; i <= BigInt(n); i++) product *= i;
  const str = product.toString();
  let zeros = 0;
  for (let i = str.length - 1; i >= 0 && str[i] === '0'; i--) zeros++;
  return zeros;
}

function optimal(n) {
  let zeros = 0;
  while (n >= 5) {
    n = Math.floor(n / 5); // first pass counts multiples of 5, next of 25, then 125 ...
    zeros += n;
  }
  return zeros;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(0), 0);
  assert.strictEqual(solve(3), 0);
  assert.strictEqual(solve(5), 1);
  assert.strictEqual(solve(10), 2);
  assert.strictEqual(solve(25), 6);
  assert.strictEqual(solve(100), 24);
  assert.strictEqual(solve(125), 31);
}
assert.strictEqual(optimal(10000), 2499);
assert.strictEqual(optimal(2147483647), 536870902);
console.log('✓ 09-factorial-trailing-zeroes passed');

module.exports = { optimal, bruteForce };

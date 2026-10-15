/**
 * 02. Reverse Integer   (LeetCode 7 — Medium)
 *
 * PROBLEM
 * Given a signed 32-bit integer x, return x with its digits reversed. If reversing makes
 * the value go outside [-2^31, 2^31 - 1], return 0. Assume you cannot store 64-bit integers.
 *
 * EXAMPLES
 * Input: 123    Output: 321
 * Input: -123   Output: -321
 * Input: 120    Output: 21      Explanation: leading zero disappears
 * Input: 1534236469  Output: 0  Explanation: 9646324351 overflows 32 bits
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - What to return on overflow? (0)
 * - Is x itself always within 32 bits? (yes)
 * - Does the sign stay in front? (yes: -123 -> -321)
 *
 * APPROACH 1 — Brute force (string)   O(d) time, O(d) space
 * Take the absolute value, convert to string, reverse, parse, re-apply the sign, then check
 * the 32-bit range. Works, but relies on JS numbers being 64-bit floats.
 *
 * APPROACH 2 — Optimal (digit loop with overflow check before the multiply)   O(d) time, O(1) space
 * Peel digits with % 10 and floor-divide by 10. Before doing reversed * 10 + digit, check
 * whether it would exceed the limit: reversed > MAX / 10, or reversed === MAX / 10 and
 * digit > 7 (MAX ends in 7, MIN ends in 8). We work on |x| and re-apply the sign at the end.
 *
 * Dry run on x = -123:
 *   sign=-1, n=123, rev=0
 *   digit=3 -> rev=3,   n=12
 *   digit=2 -> rev=32,  n=1
 *   digit=1 -> rev=321, n=0
 *   return -321
 *
 * EDGE CASES
 * - 0                    -> 0
 * - trailing zeros       -> dropped (120 -> 21)
 * - exactly at the limit -> 2147483647 reversed overflows -> 0
 * - -2^31 (-2147483648)  -> reversed overflows -> 0
 */

const INT_MAX = 2 ** 31 - 1; // 2147483647
const INT_MIN = -(2 ** 31);  // -2147483648

function bruteForce(x) {
  const sign = x < 0 ? -1 : 1;
  const reversed = sign * Number(String(Math.abs(x)).split('').reverse().join(''));
  if (reversed > INT_MAX || reversed < INT_MIN) return 0;
  return reversed;
}

function optimal(x) {
  const sign = x < 0 ? -1 : 1;
  let remaining = Math.abs(x);
  let reversed = 0;
  const limit = sign === 1 ? INT_MAX : -INT_MIN; // 2147483647 or 2147483648

  while (remaining > 0) {
    const digit = remaining % 10;
    remaining = Math.floor(remaining / 10);

    // would reversed * 10 + digit overflow? check BEFORE computing it
    if (reversed > Math.floor(limit / 10) ||
        (reversed === Math.floor(limit / 10) && digit > limit % 10)) {
      return 0;
    }
    reversed = reversed * 10 + digit;
  }
  return sign * reversed;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(123), 321);
  assert.strictEqual(solve(-123), -321);
  assert.strictEqual(solve(120), 21);
  assert.strictEqual(solve(0), 0);
  assert.strictEqual(solve(1534236469), 0);   // overflow
  assert.strictEqual(solve(-2147483648), 0);  // overflow
  assert.strictEqual(solve(1463847412), 2147483641); // fits exactly
  assert.strictEqual(solve(7), 7);
}
console.log('✓ 02-reverse-integer passed');

module.exports = { optimal, bruteForce };

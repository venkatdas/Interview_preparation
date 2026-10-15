/**
 * 18. Divide Two Integers   (LeetCode 29 — Medium)
 *
 * PROBLEM
 * Divide two integers without using *, / or %. Truncate toward zero. The result must fit in
 * a 32-bit signed int: if it overflows (only -2^31 / -1), return 2^31 - 1.
 *
 * EXAMPLES
 * Input: dividend = 10, divisor = 3    Output: 3
 * Input: dividend = 7, divisor = -3    Output: -2
 * Input: dividend = -2147483648, divisor = -1   Output: 2147483647 (clamped)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - divisor is never 0? (yes)
 * - Truncate toward zero (not floor)? (yes: -7 / 2 = -3)
 *
 * APPROACH 1 — Brute force   O(quotient) time
 * Repeatedly subtract |divisor| from |dividend| and count. 2^31 iterations in the worst
 * case - far too slow, but shows the idea.
 *
 * APPROACH 2 — Optimal (doubling / shift-and-subtract, long division in base 2)   O(32^2) = O(1) time, O(1) space
 * Work with positive values (track the sign separately). While remaining >= divisor:
 * double the divisor (and a matching `multiple` starting at 1) as long as the doubled value
 * still fits. Subtract that biggest chunk and add `multiple` to the quotient. Each outer
 * round strips the highest remaining bit of the quotient, like long division in base 2.
 * Doubling is done with `+` (no `*`), and we never shift, so the 32-bit trap of `<<` never
 * bites (JS doubles hold these values exactly).
 *
 * Dry run on 10 / 3:
 *   round 1: chunk 3->6 (12 > 10 stop), multiple 1->2. remaining 10-6 = 4, quotient 2
 *   round 2: chunk 3 (6 > 4 stop),      multiple 1.    remaining 4-3 = 1, quotient 3
 *   1 < 3 -> stop. answer 3
 *
 * EDGE CASES
 * - overflow case -2^31 / -1 -> clamp to 2^31 - 1
 * - dividend = 0 -> 0
 * - |dividend| < |divisor| -> 0
 * - negative / negative -> positive
 */

const INT_MAX = 2 ** 31 - 1;
const INT_MIN = -(2 ** 31);

function bruteForce(dividend, divisor) {
  if (dividend === INT_MIN && divisor === -1) return INT_MAX;
  const negative = (dividend < 0) !== (divisor < 0);
  let a = Math.abs(dividend);
  const b = Math.abs(divisor);
  let quotient = 0;
  while (a >= b) { a -= b; quotient++; }
  return negative ? -quotient : quotient;
}

function optimal(dividend, divisor) {
  if (dividend === INT_MIN && divisor === -1) return INT_MAX; // the only overflow case

  const negative = (dividend < 0) !== (divisor < 0);
  let remaining = Math.abs(dividend);
  const base = Math.abs(divisor);

  let quotient = 0;
  while (remaining >= base) {
    let chunk = base;        // base * 2^k, grown by doubling
    let multiple = 1;        // 2^k, grown alongside
    while (chunk + chunk <= remaining) {   // find the largest power-of-two multiple that fits
      chunk += chunk;
      multiple += multiple;
    }
    remaining -= chunk;
    quotient += multiple;
  }
  return negative ? -quotient : quotient;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(10, 3), 3);
  assert.strictEqual(solve(7, -3), -2);
  assert.strictEqual(solve(-7, 2), -3);
  assert.strictEqual(solve(0, 5), 0);
  assert.strictEqual(solve(1, 2), 0);
  assert.strictEqual(solve(-12, -4), 3);
  assert.strictEqual(solve(INT_MIN, -1), INT_MAX);
}
assert.strictEqual(optimal(INT_MIN, 1), INT_MIN);
assert.strictEqual(optimal(INT_MAX, 1), INT_MAX);
assert.strictEqual(optimal(INT_MIN, 2), -1073741824);
console.log('✓ 18-divide-two-integers passed');

module.exports = { optimal, bruteForce };

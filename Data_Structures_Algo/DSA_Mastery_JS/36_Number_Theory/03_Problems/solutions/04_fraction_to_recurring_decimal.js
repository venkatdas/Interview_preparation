/**
 * 04. Fraction to Recurring Decimal   (LeetCode 166 — Medium)
 *
 * PROBLEM
 * Given integers numerator and denominator, return the fraction as a decimal string.
 * If the fractional part repeats, wrap the repeating block in parentheses.
 *
 * EXAMPLES
 * Input: 1, 2     Output: "0.5"
 * Input: 2, 1     Output: "2"
 * Input: 4, 333   Output: "0.(012)"
 * Input: 1, 6     Output: "0.1(6)"
 * Input: -50, 8   Output: "-6.25"
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Both fit in 32-bit signed ints; denominator != 0.
 * - Sign: negative only if exactly one is negative; "0" never gets a minus sign.
 *
 * APPROACH 1 — Brute force   O(d^2) time, O(d) space
 * Long division, storing each remainder in an ARRAY; detect a repeat with indexOf.
 * Correct (a remainder repeat means the digits repeat from there), but indexOf is O(d).
 *
 * APPROACH 2 — Optimal (long division + Map remainder -> position)   O(d) time, O(d) space
 * Number theory fact: there are only d possible remainders (0..d-1), so after at most
 * d steps either the remainder becomes 0 (terminating) or one repeats (cycle).
 * Store the index where each remainder FIRST appeared; on a repeat insert "(" there.
 *
 * Dry run on 1 / 6:
 *   integer part 0, rem 1
 *   rem 1 (pos 0): 10/6 = 1, rem 4     digits "1"
 *   rem 4 (pos 1): 40/6 = 6, rem 4     digits "16"
 *   rem 4 seen at pos 1 -> "1" + "(6)" -> "0.1(6)"
 *
 * EDGE CASES
 * - numerator 0 -> "0" (no "-0")
 * - -2147483648 / -1 -> "2147483648" (overflow in 32-bit langs; fine in JS doubles)
 * - remainders * 10 stay below 2^35, far from the 2^53 limit.
 */

function signAndInteger(num, den) {
  if (num === 0) return { prefix: '0', rem: 0, d: 1 };
  const neg = (num < 0) !== (den < 0);
  const n = Math.abs(num), d = Math.abs(den);
  return { prefix: (neg ? '-' : '') + Math.floor(n / d), rem: n % d, d };
}

function bruteForce(numerator, denominator) {
  const { prefix, d } = signAndInteger(numerator, denominator);
  let { rem } = signAndInteger(numerator, denominator);
  if (rem === 0) return prefix;
  const seen = [];
  let digits = '';
  while (rem !== 0) {
    const at = seen.indexOf(rem);
    if (at !== -1) return `${prefix}.${digits.slice(0, at)}(${digits.slice(at)})`;
    seen.push(rem);
    rem *= 10;
    digits += Math.floor(rem / d);
    rem %= d;
  }
  return `${prefix}.${digits}`;
}

function optimal(numerator, denominator) {
  const { prefix, d } = signAndInteger(numerator, denominator);
  let { rem } = signAndInteger(numerator, denominator);
  if (rem === 0) return prefix;
  const firstSeen = new Map(); // remainder -> index in digits
  const digits = [];
  while (rem !== 0 && !firstSeen.has(rem)) {
    firstSeen.set(rem, digits.length);
    rem *= 10;
    digits.push(Math.floor(rem / d));
    rem %= d;
  }
  if (rem === 0) return `${prefix}.${digits.join('')}`;
  const at = firstSeen.get(rem);
  return `${prefix}.${digits.slice(0, at).join('')}(${digits.slice(at).join('')})`;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(1, 2), '0.5');
  assert.strictEqual(solve(2, 1), '2');
  assert.strictEqual(solve(4, 333), '0.(012)');
  assert.strictEqual(solve(1, 6), '0.1(6)');
  assert.strictEqual(solve(-50, 8), '-6.25');
  assert.strictEqual(solve(0, -5), '0');
  assert.strictEqual(solve(-2147483648, -1), '2147483648');
  assert.strictEqual(solve(1, 7), '0.(142857)');
  assert.strictEqual(solve(22, 7), '3.(142857)');
}
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(166);
for (let t = 0; t < 2000; t++) {
  const num = Math.floor(rng() * 2001) - 1000;
  let den = Math.floor(rng() * 401) - 200;
  if (den === 0) den = 1;
  const got = optimal(num, den);
  assert.strictEqual(got, bruteForce(num, den));
  if (!got.includes('(')) assert.ok(Math.abs(Number(got) - num / den) < 1e-9);
}
console.log('✓ 04_fraction_to_recurring_decimal passed');

module.exports = { optimal, bruteForce };

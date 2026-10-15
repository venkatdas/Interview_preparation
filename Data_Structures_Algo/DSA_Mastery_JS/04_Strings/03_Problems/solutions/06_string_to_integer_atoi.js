/**
 * 06. String to Integer (atoi)   (LeetCode 8 — Medium)
 *
 * PROBLEM
 * Convert a string to a 32-bit signed integer following these rules:
 *   1. Ignore leading whitespace.
 *   2. An optional '+' or '-' sets the sign.
 *   3. Read digits until a non-digit (or the end). No digits -> 0.
 *   4. Clamp the result into [-2^31, 2^31 - 1] = [-2147483648, 2147483647].
 *
 * EXAMPLES
 * Input: "42"            Output: 42
 * Input: "   -042"       Output: -42      Explanation: whitespace skipped, leading zeros fine
 * Input: "1337c0d3"      Output: 1337     Explanation: stop at 'c'
 * Input: "words 987"     Output: 0        Explanation: first non-space char is not a sign/digit
 * Input: "-91283472332"  Output: -2147483648   Explanation: clamped
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Which whitespace? (only ' ' on LeetCode)
 * - "+-12" ? (second char is not a digit -> 0)
 * - Is "  +0 123" 0? (yes, stop at the space)
 * - Clamp or throw on overflow? (clamp)
 *
 * APPROACH 1 — Brute force   O(n) time, O(n) space
 * Use a regex to grab the leading "optional sign + digits" after trimming, parseInt it,
 * then clamp with Math.min/Math.max. Short, but interviewers usually want the manual
 * state machine because parseInt hides every edge case.
 *
 * APPROACH 2 — Optimal (parsing state machine)   O(n) time, O(1) space
 * One index walks the string through four states:
 *   skip spaces -> read sign -> accumulate digits (result = result * 10 + digit) -> stop.
 * Clamp inside the digit loop (or at the end; JS numbers do not overflow at 2^31, so
 * clamping once at the end is safe as long as the input length is reasonable).
 *
 * Dry run on "   -042":
 *   i=0..2 spaces skipped, i=3 '-' -> sign=-1, i=4
 *   '0' result=0, '4' result=4, '2' result=42, end
 *   return -1 * 42 = -42
 *
 * EDGE CASES
 * - ""  or "   "        -> 0
 * - "-"  or "+"         -> 0 (careful: -1 * 0 is -0 in JS, strictEqual treats it as different)
 * - "0000000000012"     -> 12
 * - "2147483648"        -> 2147483647 (clamped)
 * - "-2147483649"       -> -2147483648 (clamped)
 */

const INT_MAX = 2 ** 31 - 1;
const INT_MIN = -(2 ** 31);

function bruteForce(s) {
  const match = s.trimStart().match(/^[+-]?\d+/);
  if (!match) return 0;
  const value = parseInt(match[0], 10);
  return Math.max(INT_MIN, Math.min(INT_MAX, value));
}

function optimal(s) {
  let i = 0;
  const n = s.length;

  // state 1: skip leading spaces
  while (i < n && s[i] === ' ') i++;

  // state 2: optional sign
  let sign = 1;
  if (i < n && (s[i] === '+' || s[i] === '-')) {
    sign = s[i] === '-' ? -1 : 1;
    i++;
  }

  // state 3: digits
  let result = 0;
  while (i < n && s[i] >= '0' && s[i] <= '9') {
    const digit = s.charCodeAt(i) - 48; // '0' is 48
    result = result * 10 + digit;
    // clamp early so a 100-digit string cannot blow past safe-integer range
    if (sign * result > INT_MAX) return INT_MAX;
    if (sign * result < INT_MIN) return INT_MIN;
    i++;
  }

  return result === 0 ? 0 : sign * result; // avoid returning -0 for "-" or "-0"
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('42'), 42);
  assert.strictEqual(solve('   -042'), -42);
  assert.strictEqual(solve('1337c0d3'), 1337);
  assert.strictEqual(solve('words 987'), 0);
  assert.strictEqual(solve('-91283472332'), -2147483648);
  assert.strictEqual(solve('2147483648'), 2147483647);
  assert.strictEqual(solve(''), 0);
  assert.strictEqual(solve('+-12'), 0);
  assert.strictEqual(solve('-'), 0);
  assert.strictEqual(solve('  +0 123'), 0);
}
console.log('✓ 06-string-to-integer-atoi passed');

module.exports = { optimal, bruteForce };

/**
 * 01. Sum of Digits   (Original — Easy)
 *
 * PROBLEM
 * Given a non-negative integer n, return the sum of its decimal digits using
 * RECURSION (no loops, no string conversion in the recursive version). Then extend it:
 * superDigit(n) keeps summing digits until a single digit remains, also recursively.
 *
 * EXAMPLES
 * Input: 4096   sumDigits = 19   superDigit = 1   (4096 -> 19 -> 10 -> 1)
 * Input: 7      sumDigits = 7    superDigit = 7
 * Input: 0      sumDigits = 0    superDigit = 0
 * Input: 999999 sumDigits = 54   superDigit = 9
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 0 <= n <= Number.MAX_SAFE_INTEGER (at most 16 digits -> depth is tiny)
 * - Negative numbers? (not allowed; throw)
 *
 * APPROACH 1 — Brute force (string, iterative reference)   O(d) time, O(d) space
 * String(n).split('').reduce(...) — correct and simple; used as the oracle.
 *
 * APPROACH 2 — Optimal (linear recursion on the last digit)   O(d) time, O(d) stack
 * Base case: n < 10 -> n itself (a single digit).
 * Smaller problem: Math.floor(n / 10) drops the last digit.
 * Combine: (n % 10) + sumDigits(Math.floor(n / 10)).
 * superDigit(n) = n < 10 ? n : superDigit(sumDigits(n)).
 *
 * Dry run sumDigits(4096):
 *   4096 -> 6 + sumDigits(409)
 *   409  -> 9 + sumDigits(40)
 *   40   -> 0 + sumDigits(4)
 *   4    -> base case 4
 *   unwinding: 0+4=4, 9+4=13, 6+13=19
 *
 * EDGE CASES
 * - n = 0 -> 0 (base case covers it: 0 < 10)
 * - n with zeros inside (4096) -> zeros add nothing but still recurse
 * - n < 0 or non-integer -> RangeError
 *
 * COMMON MISTAKES
 * - Base case n === 0 only: works, but sumDigits(7) then needs an extra call; n < 10 is cleaner.
 * - Using n / 10 without Math.floor -> never reaches the base case cleanly (floats).
 * - Forgetting to return the recursive expression.
 */

function check(n) {
  if (!Number.isSafeInteger(n) || n < 0) throw new RangeError('n must be a non-negative safe integer');
}

function bruteForce(n) {
  check(n);
  let s = n;
  while (s >= 10) s = String(s).split('').reduce((a, c) => a + Number(c), 0);
  return { sumDigits: String(n).split('').reduce((a, c) => a + Number(c), 0), superDigit: s };
}

function sumDigits(n) {
  if (n < 10) return n;
  return (n % 10) + sumDigits(Math.floor(n / 10));
}

function superDigit(n) {
  if (n < 10) return n;
  return superDigit(sumDigits(n));
}

function optimal(n) {
  check(n);
  return { sumDigits: sumDigits(n), superDigit: superDigit(n) };
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(4096), { sumDigits: 19, superDigit: 1 });
  assert.deepStrictEqual(solve(7), { sumDigits: 7, superDigit: 7 });
  assert.deepStrictEqual(solve(0), { sumDigits: 0, superDigit: 0 });
  assert.deepStrictEqual(solve(999999), { sumDigits: 54, superDigit: 9 });
  assert.throws(() => solve(-5), RangeError);
}
// superDigit equals the digital root formula 1 + (n - 1) % 9 for n > 0
for (let n = 1; n < 2000; n++) assert.strictEqual(superDigit(n), 1 + ((n - 1) % 9));
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(21);
for (let t = 0; t < 500; t++) {
  const n = Math.floor(rand() * Number.MAX_SAFE_INTEGER);
  assert.deepStrictEqual(optimal(n), bruteForce(n));
}
console.log('✓ 01_sum_of_digits passed');

module.exports = { optimal, bruteForce };

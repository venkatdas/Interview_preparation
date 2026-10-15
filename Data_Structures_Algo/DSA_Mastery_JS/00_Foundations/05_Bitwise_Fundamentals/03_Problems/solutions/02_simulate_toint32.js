/**
 * 02. Simulate ToInt32 and ToUint32   (Original — Easy)
 *
 * PROBLEM
 * JavaScript converts operands of & | ^ ~ << >> with ToInt32, and of >>> with ToUint32.
 * Implement toInt32(x) and toUint32(x) using ONLY arithmetic (Math.trunc, %, +, -),
 * no bitwise operators, so that they match x | 0 and x >>> 0 for every Number x,
 * including fractions, negatives, values far beyond 2^32, NaN and Infinity.
 *
 * EXAMPLES
 * Input: 3.9            toInt32: 3            toUint32: 3
 * Input: -3.9           toInt32: -3           toUint32: 4294967293
 * Input: 2147483648     toInt32: -2147483648  toUint32: 2147483648
 * Input: 4294967301     toInt32: 5            toUint32: 5
 * Input: NaN            toInt32: 0            toUint32: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Any Number, up to Number.MAX_VALUE.
 * - -0 -> 0 (result must be +0; compare with === is fine).
 *
 * APPROACH 1 — Brute force (repeated subtraction / addition)   O(|x| / 2^32) time
 * Truncate, then while t >= 2^32 subtract 2^32; while t < 0 add 2^32. Correct but
 * hopelessly slow for x = 1e300 (so the brute force caps at |x| < 2^40 in tests).
 *
 * APPROACH 2 — Optimal (modular arithmetic)   O(1) time, O(1) space
 * 1. not finite -> 0
 * 2. t = Math.trunc(x)                    (toward zero, NOT floor)
 * 3. u = ((t % 2^32) + 2^32) % 2^32       (JS % keeps the sign of t, so shift into range)
 * 4. toUint32 = u; toInt32 = u >= 2^31 ? u - 2^32 : u
 * For huge t this is still exact: JS % on doubles computes the remainder exactly
 * (like C fmod), so t % 2^32 has no rounding error even for 1e300.
 *
 * Dry run x = -3.9:
 *   t = -3; -3 % 2^32 = -3; (-3 + 2^32) % 2^32 = 4294967293 = toUint32
 *   4294967293 >= 2^31 -> toInt32 = 4294967293 - 4294967296 = -3
 *
 * EDGE CASES
 * - NaN, Infinity, -Infinity -> 0
 * - -0 -> 0
 * - 2^31 exactly -> -2^31 (int32), 2^31 (uint32)
 * - 2^53 + 2 and 1e300 -> must still match x | 0
 *
 * COMMON MISTAKES
 * - Math.floor instead of Math.trunc (-3.9 -> -4, wrong).
 * - Forgetting that % can return a negative number.
 * - Returning -0 for -0.5 (fix by adding 0 or using the modular step, which gives +0).
 */

const TWO_32 = 4294967296, TWO_31 = 2147483648;

function bruteForce(x) {
  if (!Number.isFinite(x)) return { int32: 0, uint32: 0 };
  let t = Math.trunc(x);
  while (t >= TWO_32) t -= TWO_32;
  while (t < 0) t += TWO_32;
  t += 0; // normalise -0
  return { int32: t >= TWO_31 ? t - TWO_32 : t, uint32: t };
}

function optimal(x) {
  if (!Number.isFinite(x)) return { int32: 0, uint32: 0 };
  const t = Math.trunc(x);
  const u = (((t % TWO_32) + TWO_32) % TWO_32) + 0;
  return { int32: u >= TWO_31 ? u - TWO_32 : u, uint32: u };
}

// ---------- tests ----------
const assert = require('assert');
const cases = [3.9, -3.9, 2147483648, 4294967301, NaN, Infinity, -Infinity, -0, -0.5, 0, -2147483649];
for (const solve of [bruteForce, optimal]) {
  for (const x of cases) assert.deepStrictEqual(solve(x), { int32: x | 0, uint32: x >>> 0 }, String(x));
}
assert.deepStrictEqual(optimal(1e300), { int32: 1e300 | 0, uint32: 1e300 >>> 0 });
assert.deepStrictEqual(optimal(2 ** 53 + 2), { int32: (2 ** 53 + 2) | 0, uint32: (2 ** 53 + 2) >>> 0 });
assert.ok(Object.is(optimal(-0.5).int32, 0), 'no negative zero');
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(52);
for (let t = 0; t < 3000; t++) {
  const x = (rand() - 0.5) * 2 ** Math.floor(rand() * 40);
  assert.deepStrictEqual(optimal(x), bruteForce(x));
  const y = (rand() - 0.5) * 2 ** Math.floor(rand() * 1000);
  assert.deepStrictEqual(optimal(y), { int32: y | 0, uint32: y >>> 0 });
}
console.log('✓ 02_simulate_toint32 passed');

module.exports = { optimal, bruteForce };

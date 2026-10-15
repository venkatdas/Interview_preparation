/**
 * 05. Divide by Powers of Two with Shifts   (Original — Medium)
 *
 * PROBLEM
 * Given a 32-bit signed integer n and 0 <= k <= 31, compute three quotients of n / 2^k
 * using ONLY bitwise operators, comparisons and + / - (no /, %, Math.*):
 *   floor:    Math.floor(n / 2^k)                 (round toward -infinity)
 *   trunc:    Math.trunc(n / 2^k)                 (round toward zero, like C integer division)
 *   unsigned: Math.floor((n as uint32) / 2^k)     (treat the bits as unsigned)
 *
 * EXAMPLES
 * Input: n = 20,  k = 2   Output: { floor: 5,  trunc: 5,  unsigned: 5 }
 * Input: n = -7,  k = 1   Output: { floor: -4, trunc: -3, unsigned: 2147483644 }
 * Input: n = -1,  k = 31  Output: { floor: -1, trunc: 0,  unsigned: 1 }
 * Input: n = 5,   k = 0   Output: { floor: 5,  trunc: 5,  unsigned: 5 }
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n is in [-2^31, 2^31 - 1]; k in [0, 31].
 * - Why does it matter? Mid-point (lo + hi) >> 1, hashing, and C-style division ports.
 *
 * APPROACH 1 — Brute force (arithmetic)   O(1) time
 * floor = Math.floor(n / 2 ** k); trunc = Math.trunc(n / 2 ** k);
 * unsigned = Math.floor((n >>> 0) / 2 ** k). The reference answer.
 *
 * APPROACH 2 — Optimal (shifts)   O(1) time, O(1) space
 * floor:    n >> k     (arithmetic shift copies the sign bit: rounds toward -infinity)
 * unsigned: n >>> k    (zero-fill shift on the unsigned view)
 * trunc:    for n >= 0 same as floor. For n < 0 add a BIAS of (2^k - 1) before shifting:
 *           (n + bias) >> k. The bias pushes any non-zero remainder past the next multiple,
 *           turning floor into ceil, which is truncation for negative numbers.
 *           Branch-free bias: (n >> 31) is -1 (all ones) when n < 0 and 0 otherwise;
 *           >>> (32 - k) keeps only its low k bits -> 2^k - 1 or 0 (k = 0 handled separately).
 *           n + bias cannot overflow: bias is non-zero only when n is negative.
 *
 * Dry run n = -7 (…11111001), k = 1:
 *   floor:    -7 >> 1  = …11111100 = -4
 *   trunc:    bias = 1; (-7 + 1) >> 1 = -6 >> 1 = -3
 *   unsigned: -7 >>> 1 = 0111…1100 = 2147483644
 *
 * EDGE CASES
 * - k = 0: all three are n (unsigned is n >>> 0)
 * - n = -2^31: trunc bias must not overflow (n + bias stays negative: safe)
 * - n = -1, k = 31: floor -1, trunc 0, unsigned 1
 *
 * COMMON MISTAKES
 * - Using >> and calling it "integer division" for negatives (it floors, C truncates).
 * - Using >>> on signed values expecting a negative result.
 * - Building the bias as (1 << k) - 1 and forgetting that 1 << 31 is negative (it happens to
 *   wrap correctly, but the branch-free form avoids having to reason about it).
 */

function bruteForce(n, k) {
  const p = 2 ** k;
  return { floor: Math.floor(n / p), trunc: Math.trunc(n / p) + 0, unsigned: Math.floor((n >>> 0) / p) };
}

function optimal(n, k) {
  const floor = n >> k;
  const unsigned = n >>> k;
  const bias = k === 0 ? 0 : (n >> 31) >>> (32 - k); // n < 0 -> low k bits all ones; else 0
  const trunc = ((n + bias) | 0) >> k;
  return { floor, trunc, unsigned };
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(20, 2), { floor: 5, trunc: 5, unsigned: 5 });
  assert.deepStrictEqual(solve(-7, 1), { floor: -4, trunc: -3, unsigned: 2147483644 });
  assert.deepStrictEqual(solve(-1, 31), { floor: -1, trunc: 0, unsigned: 1 });
  assert.deepStrictEqual(solve(5, 0), { floor: 5, trunc: 5, unsigned: 5 });
  assert.deepStrictEqual(solve(-(2 ** 31), 31), { floor: -1, trunc: -1, unsigned: 1 });
  assert.deepStrictEqual(solve(-8, 3), { floor: -1, trunc: -1, unsigned: 536870911 });
}
// why (lo + hi) >> 1 can break: sum beyond int32
const lo = 2 ** 30, hi = 2 ** 31 - 1;
assert.ok((lo + hi) >> 1 < 0, 'overflowed mid-point');
assert.strictEqual(lo + ((hi - lo) >> 1), Math.floor((lo + hi) / 2));
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(55);
for (let t = 0; t < 5000; t++) {
  const n = (Math.floor(rand() * 2 ** 32) - 2 ** 31) | 0, k = Math.floor(rand() * 32);
  assert.deepStrictEqual(optimal(n, k), bruteForce(n, k), n + ' ' + k);
}
console.log('✓ 05_shift_division passed');

module.exports = { optimal, bruteForce };

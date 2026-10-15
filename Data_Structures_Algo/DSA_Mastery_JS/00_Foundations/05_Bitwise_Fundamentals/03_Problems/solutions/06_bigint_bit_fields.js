/**
 * 06. Bit Fields in 64-bit BigInts   (Original — Medium)
 *
 * PROBLEM
 * A 64-bit unsigned ID (as a BigInt) is laid out like a snowflake ID:
 *   bits 63..22  timestamp (42 bits)
 *   bits 21..12  machine   (10 bits)
 *   bits 11..0   sequence  (12 bits)
 * Write pack({ timestamp, machine, sequence }) -> BigInt and unpack(id) -> the three
 * fields (as BigInts), plus popcount(id) and bitLength(id). Values exceed 2^53, so
 * Number bitwise operators (32-bit!) cannot be used.
 *
 * EXAMPLES
 * Input: pack({ timestamp: 1n, machine: 0n, sequence: 0n })     Output: 4194304n   (1n << 22n)
 * Input: unpack(4194305n)                                       Output: { timestamp: 1n, machine: 0n, sequence: 1n }
 * Input: pack({ timestamp: 2n**42n - 1n, machine: 1023n, sequence: 4095n })   Output: 2n**64n - 1n
 * Input: popcount(2n**64n - 1n)                                 Output: 64
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Fields out of range (e.g. machine = 1024n)? (throw RangeError)
 * - IDs are always within [0, 2^64)? (yes; validate)
 *
 * APPROACH 1 — Brute force (binary strings)   O(64) per op with string building
 * Pad each field's toString(2) to its width, concatenate, BigInt('0b' + s). unpack slices
 * the 64-char string. popcount counts '1' chars. Easy to follow, allocation-heavy.
 *
 * APPROACH 2 — Optimal (BigInt shifts and masks)   O(1) word ops (O(64) for popcount)
 * mask(w) = (1n << w) - 1n
 * pack   = (timestamp << 22n) | (machine << 12n) | sequence
 * unpack = timestamp: id >> 22n; machine: (id >> 12n) & mask(10n); sequence: id & mask(12n)
 * popcount: Kernighan x &= x - 1n; bitLength: shift right until 0 (or toString(2).length).
 * BigInt has no >>> and cannot mix with Number: every literal needs the n suffix.
 *
 * Dry run unpack(4194305n):
 *   4194305 = 2^22 + 1
 *   timestamp = 4194305n >> 22n = 1n
 *   machine   = (4194305n >> 12n) & 1023n = 1024n & 1023n = 0n
 *   sequence  = 4194305n & 4095n = 1n
 *
 * EDGE CASES
 * - all-zero ID -> all fields 0n, bitLength 0
 * - all-ones ID -> max fields
 * - field overflow -> RangeError, never silently bleed into the neighbour field
 *
 * COMMON MISTAKES
 * - 1n << 22 (mixing BigInt and Number) -> TypeError.
 * - Using Number(id) >> 22 -> precision loss AND the 32-bit funnel.
 * - Forgetting to mask the middle field (machine would include the timestamp bits).
 */

const W = { timestamp: 42n, machine: 10n, sequence: 12n };
const mask = w => (1n << w) - 1n;
function validate({ timestamp, machine, sequence }) {
  for (const [k, v] of Object.entries({ timestamp, machine, sequence })) {
    if (typeof v !== 'bigint' || v < 0n || v > mask(W[k])) throw new RangeError(k + ' out of range');
  }
}
function validateId(id) {
  if (typeof id !== 'bigint' || id < 0n || id >= 1n << 64n) throw new RangeError('id must be a 64-bit unsigned BigInt');
}

const bruteForce = {
  pack(f) {
    validate(f);
    const s = f.timestamp.toString(2).padStart(42, '0') + f.machine.toString(2).padStart(10, '0') + f.sequence.toString(2).padStart(12, '0');
    return BigInt('0b' + s);
  },
  unpack(id) {
    validateId(id);
    const s = id.toString(2).padStart(64, '0');
    return { timestamp: BigInt('0b' + s.slice(0, 42)), machine: BigInt('0b' + s.slice(42, 52)), sequence: BigInt('0b' + s.slice(52)) };
  },
  popcount: id => [...id.toString(2)].filter(c => c === '1').length,
  bitLength: id => (id === 0n ? 0 : id.toString(2).length),
};

const optimal = {
  pack(f) {
    validate(f);
    return (f.timestamp << 22n) | (f.machine << 12n) | f.sequence;
  },
  unpack(id) {
    validateId(id);
    return { timestamp: id >> 22n, machine: (id >> 12n) & mask(10n), sequence: id & mask(12n) };
  },
  popcount(id) { let c = 0; while (id > 0n) { id &= id - 1n; c++; } return c; },
  bitLength(id) { let n = 0; while (id > 0n) { id >>= 1n; n++; } return n; },
};

// ---------- tests ----------
const assert = require('assert');
for (const s of [bruteForce, optimal]) {
  assert.strictEqual(s.pack({ timestamp: 1n, machine: 0n, sequence: 0n }), 4194304n);
  assert.deepStrictEqual(s.unpack(4194305n), { timestamp: 1n, machine: 0n, sequence: 1n });
  assert.strictEqual(s.pack({ timestamp: 2n ** 42n - 1n, machine: 1023n, sequence: 4095n }), 2n ** 64n - 1n);
  assert.strictEqual(s.popcount(2n ** 64n - 1n), 64);
  assert.strictEqual(s.bitLength(0n), 0);
  assert.deepStrictEqual(s.unpack(0n), { timestamp: 0n, machine: 0n, sequence: 0n });
  assert.throws(() => s.pack({ timestamp: 0n, machine: 1024n, sequence: 0n }), RangeError);
  assert.throws(() => s.unpack(1n << 64n), RangeError);
}
assert.throws(() => 1n << 22, TypeError);
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(56);
const randBig = bits => { let v = 0n; for (let i = 0; i < bits; i++) v = (v << 1n) | (rand() < 0.5 ? 1n : 0n); return v; };
for (let t = 0; t < 1000; t++) {
  const f = { timestamp: randBig(42), machine: randBig(10), sequence: randBig(12) };
  const id = optimal.pack(f);
  assert.strictEqual(id, bruteForce.pack(f));
  assert.deepStrictEqual(optimal.unpack(id), f);
  assert.strictEqual(optimal.popcount(id), bruteForce.popcount(id));
  assert.strictEqual(optimal.bitLength(id), bruteForce.bitLength(id));
}
console.log('✓ 06_bigint_bit_fields passed');

module.exports = { optimal, bruteForce };

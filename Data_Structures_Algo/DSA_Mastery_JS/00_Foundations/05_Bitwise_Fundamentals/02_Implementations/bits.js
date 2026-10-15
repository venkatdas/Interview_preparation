/**
 * Bitwise fundamentals in JavaScript.
 *
 * 1. toBinary(n, width) / fromBinary(bits)  - two's complement patterns at any width 1..32
 * 2. toInt32(x) / toUint32(x)               - the conversion every bitwise operator applies, done with arithmetic
 * 3. getBit / setBit / clearBit / toggleBit - single-bit masks
 * 4. lowMask(k) / extractField(x, lo, len)  - multi-bit masks
 * 5. bigBitLength / bigPopcount / bigGetBit - BigInt bit access beyond 32 bits
 */

const TWO_32 = 2 ** 32;
const TWO_31 = 2 ** 31;

// ---------- 1. two's complement strings ----------
function toBinary(n, width = 32) {
  if (!Number.isInteger(width) || width < 1 || width > 32) throw new RangeError('width must be 1..32');
  const span = 2 ** width;
  if (n < -(span / 2) || n >= span / 2) throw new RangeError(`${n} does not fit in ${width} signed bits`);
  let u = ((n % span) + span) % span; // negative n -> 2^width + n
  let bits = '';
  for (let i = 0; i < width; i++) { bits = (u % 2) + bits; u = Math.floor(u / 2); }
  return bits;
}

function fromBinary(bits) {
  if (!/^[01]{1,32}$/.test(bits)) throw new RangeError('expected 1..32 binary digits');
  let u = 0;
  for (const b of bits) u = u * 2 + (b === '1' ? 1 : 0);
  return bits[0] === '1' ? u - 2 ** bits.length : u; // top bit has weight -2^(w-1)
}

// ---------- 2. ToInt32 / ToUint32 ----------
function toUint32(x) {
  if (!Number.isFinite(x)) return 0;
  const t = Math.trunc(x);
  return ((t % TWO_32) + TWO_32) % TWO_32;
}
function toInt32(x) {
  const u = toUint32(x);
  return u >= TWO_31 ? u - TWO_32 : u;
}

// ---------- 3. single bits ----------
const getBit = (x, i) => (x >> i) & 1;
const setBit = (x, i) => x | (1 << i);
const clearBit = (x, i) => x & ~(1 << i);
const toggleBit = (x, i) => x ^ (1 << i);

// ---------- 4. masks ----------
// k ones in the low bits. (1 << k) - 1 breaks at k = 31/32, so use the unsigned shift trick.
function lowMask(k) {
  if (k <= 0) return 0;
  if (k >= 32) return 0xffffffff;
  return -1 >>> (32 - k);
}
function extractField(x, lo, len) {
  return ((x >>> lo) & lowMask(len)) >>> 0;
}

// ---------- 5. BigInt ----------
function bigBitLength(x) {
  if (x < 0n) throw new RangeError('non-negative only');
  let len = 0;
  while (x > 0n) { x >>= 1n; len++; }
  return len;
}
function bigPopcount(x) {
  if (x < 0n) throw new RangeError('non-negative only');
  let c = 0;
  while (x > 0n) { x &= x - 1n; c++; } // Kernighan works for BigInt too
  return c;
}
const bigGetBit = (x, i) => Number((x >> BigInt(i)) & 1n);

// ---------- self-test ----------
if (require.main === module) {
  const assert = require('assert');

  assert.strictEqual(toBinary(13, 8), '00001101');
  assert.strictEqual(toBinary(-6, 8), '11111010');
  assert.strictEqual(toBinary(-1, 4), '1111');
  assert.strictEqual(toBinary(-8, 4), '1000');
  assert.throws(() => toBinary(8, 4), RangeError);
  assert.strictEqual(fromBinary('11111010'), -6);
  assert.strictEqual(fromBinary('0111'), 7);
  assert.strictEqual(toBinary(-5, 32), (-5 >>> 0).toString(2));
  assert.strictEqual((-5).toString(2), '-101', 'toString(2) is sign + magnitude');

  // the funnel
  assert.strictEqual(2 ** 31 | 0, -2147483648);
  assert.strictEqual(2 ** 32 | 0, 0);
  assert.strictEqual(-3.9 | 0, -3);
  assert.strictEqual(1 << 32, 1);
  assert.strictEqual(-16 >> 2, -4);
  assert.strictEqual(-16 >>> 28, 15);
  const samples = [0, -0, 1, -1, 3.9, -3.9, 2 ** 31, 2 ** 32 + 5, -(2 ** 31) - 1, 1e10, -1e10, 2 ** 53, NaN, Infinity, -Infinity];
  for (const x of samples) {
    assert.strictEqual(toInt32(x), x | 0, `toInt32(${x})`);
    assert.strictEqual(toUint32(x), x >>> 0, `toUint32(${x})`);
  }

  assert.strictEqual(getBit(13, 2), 1);
  assert.strictEqual(getBit(13, 1), 0);
  assert.strictEqual(setBit(13, 1), 15);
  assert.strictEqual(clearBit(13, 0), 12);
  assert.strictEqual(toggleBit(13, 3), 5);
  assert.strictEqual(lowMask(0), 0);
  assert.strictEqual(lowMask(4), 15);
  assert.strictEqual(lowMask(31), 2 ** 31 - 1);
  assert.strictEqual(lowMask(32), 2 ** 32 - 1);
  assert.strictEqual(extractField(0xabcd, 4, 8), 0xbc);
  assert.strictEqual(extractField(-1, 0, 32), 2 ** 32 - 1);

  assert.strictEqual(bigBitLength(0n), 0);
  assert.strictEqual(bigBitLength(1n << 70n), 71);
  assert.strictEqual(bigPopcount((1n << 64n) - 1n), 64);
  assert.strictEqual(bigGetBit(1n << 60n, 60), 1);
  assert.throws(() => 1n >>> 1n, TypeError);
  assert.throws(() => 1n << 3, TypeError);

  // random round trips
  let seed = 9;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let t = 0; t < 2000; t++) {
    const w = 1 + Math.floor(rnd() * 32);
    const n = Math.floor(rnd() * 2 ** w) - 2 ** (w - 1);
    assert.strictEqual(fromBinary(toBinary(n, w)), n);
    const x = (rnd() - 0.5) * 2 ** (1 + Math.floor(rnd() * 60));
    assert.strictEqual(toInt32(x), x | 0);
    const b = BigInt(Math.floor(rnd() * 2 ** 30)) << BigInt(Math.floor(rnd() * 40));
    assert.strictEqual(bigPopcount(b), [...b.toString(2)].filter(c => c === '1').length);
    assert.strictEqual(bigBitLength(b), b === 0n ? 0 : b.toString(2).length);
  }

  console.log('✓ bits.js self-test passed');
}

module.exports = { toBinary, fromBinary, toInt32, toUint32, getBit, setBit, clearBit, toggleBit, lowMask, extractField, bigBitLength, bigPopcount, bigGetBit };

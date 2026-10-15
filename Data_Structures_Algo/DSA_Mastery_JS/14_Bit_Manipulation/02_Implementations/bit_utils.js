/**
 * Bit manipulation utilities in JavaScript.
 *
 * Reminder: every bitwise operator in JS converts its operands to 32-bit SIGNED integers.
 * Use `>>> 0` to view a value as unsigned, and BigInt for anything above 2^32.
 *
 * Contents
 *   toBinaryString     - pretty printer (handles negatives as two's complement)
 *   isOdd / isEven
 *   getBit / setBit / clearBit / toggleBit
 *   removeLowestSetBit - n & (n - 1)
 *   lowestSetBit       - n & -n
 *   countSetBits       - Brian Kernighan
 *   isPowerOfTwo
 *   swapWithoutTemp
 *   subsetsOfMask      - every sub-mask of a mask
 *   allMasks           - every subset of n items as a mask
 *   grayCode           - i ^ (i >> 1)
 *   charMask / hasChar - lowercase letters as a 26-bit set
 */

// ---------- printing ----------
function toBinaryString(n, width = 8) {
  // `n >>> 0` turns -1 into 4294967295 so toString(2) shows the two's complement pattern
  return (n >>> 0).toString(2).padStart(width, '0').slice(-width);
}

// ---------- odd / even ----------
function isOdd(n) {
  return (n & 1) === 1; // bit 0 is the "ones" place
}

function isEven(n) {
  return (n & 1) === 0;
}

// ---------- single bit operations ----------
function getBit(n, i) {
  return (n >> i) & 1;
}

function setBit(n, i) {
  return n | (1 << i);
}

function clearBit(n, i) {
  return n & ~(1 << i);   // ~(1 << i) is all ones except position i
}

function toggleBit(n, i) {
  return n ^ (1 << i);
}

// ---------- lowest set bit tricks ----------
// n - 1 flips the lowest 1 to 0 and every 0 below it to 1; AND-ing with n erases exactly that 1.
function removeLowestSetBit(n) {
  return n & (n - 1);
}

// -n is ~n + 1; the +1 carries through the trailing zeros and stops at the lowest 1.
function lowestSetBit(n) {
  return n & -n;
}

// ---------- counting ----------
function countSetBits(n) {
  let count = 0;
  n = n >>> 0;             // unsigned view so negative inputs terminate (at most 32 iterations)
  while (n !== 0) {
    n &= n - 1;            // each iteration removes one set bit -> O(number of set bits)
    count++;
  }
  return count;
}

function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0; // exactly one bit set
}

// ---------- swap ----------
function swapWithoutTemp(a, b) {
  a = a ^ b;
  b = a ^ b; // (a ^ b) ^ b === a
  a = a ^ b; // (a ^ b) ^ a === b
  return [a, b];
}

// ---------- subsets ----------
// Every non-empty sub-mask of `mask`, largest first. (sub - 1) & mask jumps to the next one.
function subsetsOfMask(mask) {
  const result = [];
  for (let sub = mask; sub > 0; sub = (sub - 1) & mask) result.push(sub);
  return result;
}

// Every subset of n items, as masks 0 .. 2^n - 1. n must be < 31.
function allMasks(n) {
  const result = [];
  for (let mask = 0; mask < (1 << n); mask++) result.push(mask);
  return result;
}

// ---------- gray code ----------
// Consecutive values differ in exactly one bit.
function grayCode(n) {
  const result = [];
  for (let i = 0; i < (1 << n); i++) result.push(i ^ (i >> 1));
  return result;
}

// ---------- lowercase letters as a 26-bit set ----------
function charMask(word) {
  let mask = 0;
  for (const ch of word) mask |= 1 << (ch.charCodeAt(0) - 97);
  return mask;
}

function hasChar(mask, ch) {
  return ((mask >> (ch.charCodeAt(0) - 97)) & 1) === 1;
}

// ---------- self-test ----------
const assert = require('assert');

assert.strictEqual(toBinaryString(13), '00001101');
assert.strictEqual(toBinaryString(-1, 8), '11111111');
assert.strictEqual(toBinaryString(-6, 8), '11111010');     // ~5
assert.strictEqual(toBinaryString(5, 32).length, 32);

assert.strictEqual(isOdd(7), true);
assert.strictEqual(isOdd(8), false);
assert.strictEqual(isEven(0), true);
assert.strictEqual(isOdd(-3), true);                         // -3 = ...11111101

assert.strictEqual(getBit(13, 0), 1);  // 1101
assert.strictEqual(getBit(13, 1), 0);
assert.strictEqual(setBit(13, 1), 15);
assert.strictEqual(clearBit(13, 0), 12);
assert.strictEqual(toggleBit(13, 2), 9);
assert.strictEqual(toggleBit(toggleBit(13, 5), 5), 13);

assert.strictEqual(removeLowestSetBit(0b1011000), 0b1010000);
assert.strictEqual(lowestSetBit(0b1011000), 0b0001000);
assert.strictEqual(lowestSetBit(0), 0);

assert.strictEqual(countSetBits(0), 0);
assert.strictEqual(countSetBits(13), 3);
assert.strictEqual(countSetBits(-1), 32);
assert.strictEqual(countSetBits(2 ** 31), 1);                // 2^31 becomes the sign bit, still one bit

assert.strictEqual(isPowerOfTwo(1), true);
assert.strictEqual(isPowerOfTwo(1024), true);
assert.strictEqual(isPowerOfTwo(0), false);
assert.strictEqual(isPowerOfTwo(-2), false);
assert.strictEqual(isPowerOfTwo(12), false);

assert.deepStrictEqual(swapWithoutTemp(3, 9), [9, 3]);
assert.deepStrictEqual(swapWithoutTemp(-4, 0), [0, -4]);

assert.deepStrictEqual(subsetsOfMask(0b101), [0b101, 0b100, 0b001]);
assert.deepStrictEqual(subsetsOfMask(0), []);
assert.deepStrictEqual(allMasks(2), [0, 1, 2, 3]);
assert.strictEqual(allMasks(0).length, 1);

assert.deepStrictEqual(grayCode(2), [0, 1, 3, 2]);
const gray3 = grayCode(3);
for (let i = 1; i < gray3.length; i++) assert.strictEqual(countSetBits(gray3[i] ^ gray3[i - 1]), 1);

assert.strictEqual(charMask('abc'), 0b111);
assert.strictEqual(hasChar(charMask('hello'), 'l'), true);
assert.strictEqual(hasChar(charMask('hello'), 'z'), false);
assert.strictEqual((charMask('abc') & charMask('xyz')) === 0, true); // disjoint words

// the famous JS traps, pinned down
assert.strictEqual(1 << 31, -2147483648);
assert.strictEqual((1 << 31) >>> 0, 2147483648);
assert.strictEqual(-8 >> 1, -4);
assert.strictEqual(-8 >>> 1, 2147483644);
assert.strictEqual((2 ** 33) | 0, 0);
assert.strictEqual(1 << 32, 1);                              // shift amount is taken mod 32

console.log('✓ bit-utils.js self-test passed');

module.exports = {
  toBinaryString, isOdd, isEven, getBit, setBit, clearBit, toggleBit,
  removeLowestSetBit, lowestSetBit, countSetBits, isPowerOfTwo, swapWithoutTemp,
  subsetsOfMask, allMasks, grayCode, charMask, hasChar,
};

// node --test 14_Bit_Manipulation/tests/bit_manipulation.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const B = require('../02_Implementations/bit_utils');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// Random signed 32-bit integer.
const rand32 = (rnd) => (Math.floor(rnd() * 2 ** 32) | 0);
// Brute-force references built on strings, not bit tricks.
const bin32 = (n) => (n >>> 0).toString(2).padStart(32, '0');
const popString = (n) => [...bin32(n)].filter((c) => c === '1').length;

describe('bit_utils', () => {
  it('toBinaryString pads, truncates and shows two\'s complement', () => {
    assert.equal(B.toBinaryString(5), '00000101');
    assert.equal(B.toBinaryString(0), '00000000');
    assert.equal(B.toBinaryString(-1), '11111111');
    assert.equal(B.toBinaryString(-1, 32), '1'.repeat(32));
    assert.equal(B.toBinaryString(256), '00000000'); // only the low 8 bits
  });
  it('isOdd / isEven work for negatives and zero', () => {
    assert.equal(B.isEven(0), true);
    assert.equal(B.isOdd(-3), true);
    assert.equal(B.isEven(-4), true);
  });
  it('get/set/clear/toggle agree with string manipulation on random inputs', () => {
    const rnd = mulberry32(14);
    for (let t = 0; t < 500; t++) {
      const n = rand32(rnd), i = Math.floor(rnd() * 31);
      const s = bin32(n);
      assert.equal(B.getBit(n, i), Number(s[31 - i]));
      assert.equal(B.getBit(B.setBit(n, i), i), 1);
      assert.equal(B.getBit(B.clearBit(n, i), i), 0);
      assert.equal(B.getBit(B.toggleBit(n, i), i), 1 - Number(s[31 - i]));
      assert.equal(B.toggleBit(B.toggleBit(n, i), i), n); // toggle twice is identity
    }
  });
  it('countSetBits matches a string count, including negatives', () => {
    assert.equal(B.countSetBits(0), 0);
    assert.equal(B.countSetBits(-1), 32);
    assert.equal(B.countSetBits(-2147483648), 1);
    const rnd = mulberry32(7);
    for (let t = 0; t < 500; t++) { const n = rand32(rnd); assert.equal(B.countSetBits(n), popString(n)); }
  });
  it('removeLowestSetBit and lowestSetBit', () => {
    assert.equal(B.removeLowestSetBit(12), 8);
    assert.equal(B.lowestSetBit(12), 4);
    assert.equal(B.removeLowestSetBit(0), 0);
    assert.equal(B.lowestSetBit(0), 0);
    const rnd = mulberry32(3);
    for (let t = 0; t < 300; t++) {
      const n = rand32(rnd);
      assert.equal(popString(B.removeLowestSetBit(n)), Math.max(0, popString(n) - 1));
    }
  });
  it('isPowerOfTwo: zero, negatives, boundaries', () => {
    assert.equal(B.isPowerOfTwo(0), false);
    assert.equal(B.isPowerOfTwo(1), true);
    assert.equal(B.isPowerOfTwo(-8), false);
    assert.equal(B.isPowerOfTwo(2 ** 30), true);
    for (let n = 1; n <= 5000; n++) assert.equal(B.isPowerOfTwo(n), Number.isInteger(Math.log2(n)));
  });
  it('swapWithoutTemp swaps, including equal values and negatives', () => {
    assert.deepEqual(B.swapWithoutTemp(3, 9), [9, 3]);
    assert.deepEqual(B.swapWithoutTemp(-5, 5), [5, -5]);
    assert.deepEqual(B.swapWithoutTemp(7, 7), [7, 7]);
  });
  it('subsetsOfMask returns every non-empty submask exactly once', () => {
    assert.deepEqual(B.subsetsOfMask(0), []);
    for (let mask = 0; mask < 256; mask++) {
      const brute = [];
      for (let s = 1; s <= mask; s++) if ((s & mask) === s) brute.push(s);
      assert.deepEqual([...B.subsetsOfMask(mask)].sort((a, b) => a - b), brute);
    }
  });
  it('allMasks(n) has 2^n entries; allMasks(0) is [0]', () => {
    assert.deepEqual(B.allMasks(0), [0]);
    assert.equal(B.allMasks(10).length, 1024);
  });
  it('grayCode: neighbours differ in exactly one bit and every value appears once', () => {
    for (let n = 0; n <= 10; n++) {
      const g = B.grayCode(n);
      assert.equal(new Set(g).size, 1 << n);
      for (let i = 1; i < g.length; i++) assert.equal(B.countSetBits(g[i] ^ g[i - 1]), 1);
    }
  });
  it('charMask / hasChar behave like a Set of letters (duplicates ignored)', () => {
    const rnd = mulberry32(26);
    for (let t = 0; t < 200; t++) {
      const len = Math.floor(rnd() * 12);
      const word = Array.from({ length: len }, () => String.fromCharCode(97 + Math.floor(rnd() * 26))).join('');
      const set = new Set(word), mask = B.charMask(word);
      for (let c = 0; c < 26; c++) { const ch = String.fromCharCode(97 + c); assert.equal(B.hasChar(mask, ch), set.has(ch)); }
      assert.equal(B.countSetBits(mask), set.size);
    }
    assert.equal(B.charMask(''), 0);
  });
});

describe('selected solutions on extra edge cases', () => {
  const single = require('../03_Problems/solutions/01_single_number');
  const counting = require('../03_Problems/solutions/06_counting_bits');
  const sum = require('../03_Problems/solutions/11_sum_of_two_integers');
  const range = require('../03_Problems/solutions/13_bitwise_and_of_numbers_range');
  const divide = require('../03_Problems/solutions/18_divide_two_integers');
  it('single number: one element, negatives', () => {
    assert.equal(single.optimal([42]), 42);
    assert.equal(single.optimal([-1, 2, 2]), -1);
    assert.equal(single.optimal([0, -7, -7]), 0);
  });
  it('counting bits matches popcount for 0..2000', () => {
    const res = counting.optimal(2000);
    assert.equal(res.length, 2001);
    res.forEach((v, i) => assert.equal(v, popString(i)));
    assert.deepEqual(counting.optimal(0), [0]);
  });
  it('sum of two integers without +: negatives and zero, random', () => {
    assert.equal(sum.optimal(0, 0), 0);
    assert.equal(sum.optimal(-1, 1), 0);
    assert.equal(sum.optimal(-5, -7), -12);
    const rnd = mulberry32(11);
    for (let t = 0; t < 300; t++) {
      const a = Math.floor(rnd() * 2001) - 1000, b = Math.floor(rnd() * 2001) - 1000;
      assert.equal(sum.optimal(a, b), a + b);
    }
  });
  it('bitwise AND of range: equal ends, zero, and brute force agreement', () => {
    assert.equal(range.optimal(7, 7), 7);
    assert.equal(range.optimal(0, 5), 0);
    for (let l = 0; l < 70; l++) for (let r = l; r < 70; r++) {
      let acc = l; for (let x = l + 1; x <= r; x++) acc &= x;
      assert.equal(range.optimal(l, r), acc);
    }
  });
  it('divide two integers: truncation toward zero and 32-bit overflow clamp', () => {
    assert.equal(divide.optimal(7, -3), -2);
    assert.equal(divide.optimal(-7, 3), -2);
    assert.equal(divide.optimal(0, 5), 0);
    assert.equal(divide.optimal(-2147483648, -1), 2147483647);
    assert.equal(divide.optimal(-2147483648, 1), -2147483648);
    const rnd = mulberry32(29);
    for (let t = 0; t < 300; t++) {
      const a = rand32(rnd), b = (rand32(rnd) >> Math.floor(rnd() * 31)) || 1;
      const expected = Math.max(-(2 ** 31), Math.min(2 ** 31 - 1, Math.trunc(a / b)));
      assert.equal(divide.optimal(a, b), expected);
    }
  });
});

/**
 * 03. Binary <-> Hex by Nibbles   (Original — Easy)
 *
 * PROBLEM
 * Write binToHex(bits) and hexToBin(hex) for unsigned values of ANY length (longer
 * than 53 bits too, so no parseInt/Number conversion of the whole string). Use the
 * fact that one hex digit is exactly 4 bits (a nibble). Output hex in lowercase
 * without leading zeros ("0" for zero); output binary without leading zeros ("0" for zero).
 *
 * EXAMPLES
 * Input: binToHex("11010110")          Output: "d6"
 * Input: binToHex("101")               Output: "5"      (pad on the LEFT to "0101")
 * Input: hexToBin("1f")                Output: "11111"
 * Input: binToHex("0000")              Output: "0"
 * Input: binToHex("1" + "0".repeat(64))  Output: "1" + "0".repeat(16)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Input length up to 1e5 characters.
 * - Uppercase hex input allowed? (yes, accept both)
 * - Leading zeros in input? (allowed; strip them in output)
 *
 * APPROACH 1 — Brute force (BigInt via the whole value)   O(L^2) time in the worst case
 * BigInt('0b' + bits).toString(16) and BigInt('0x' + hex).toString(2). Correct for any
 * length, but builds a huge integer; conversions of very long strings are quadratic-ish.
 * Used as the oracle.
 *
 * APPROACH 2 — Optimal (nibble grouping)   O(L) time, O(L) space
 * binToHex: left-pad bits to a multiple of 4; for each group of 4, value = b0*8 + b1*4 + b2*2 + b3
 * (or parseInt of 4 chars), map to '0123456789abcdef'. Strip leading zeros.
 * hexToBin: each hex digit -> its 4-bit string (value.toString(2).padStart(4, '0')); join; strip.
 * Grouping works because 16 = 2^4: each hex digit covers exactly 4 binary places.
 *
 * Dry run binToHex("101101"):
 *   pad to "00101101" -> groups "0010" "1101" -> 2, 13 -> "2d"
 *
 * EDGE CASES
 * - all zeros -> "0"
 * - length not a multiple of 4 -> pad on the LEFT (padding on the right multiplies by 16!)
 * - uppercase hex
 * - very long strings (no Number conversion)
 *
 * COMMON MISTAKES
 * - Grouping from the left without padding first (groups misaligned).
 * - parseInt(bits, 2) on more than 53 bits (precision loss).
 * - Stripping zeros until the string is empty (should leave "0").
 */

const HEX = '0123456789abcdef';
const strip = s => s.replace(/^0+(?=.)/, '');

const bruteForce = {
  binToHex: bits => BigInt('0b' + bits).toString(16),
  hexToBin: hex => BigInt('0x' + hex).toString(2),
};

const optimal = {
  binToHex(bits) {
    const padded = bits.padStart(Math.ceil(bits.length / 4) * 4, '0');
    let out = '';
    for (let i = 0; i < padded.length; i += 4) {
      let v = 0;
      for (let j = i; j < i + 4; j++) v = v * 2 + (padded[j] === '1' ? 1 : 0);
      out += HEX[v];
    }
    return strip(out || '0');
  },
  hexToBin(hex) {
    let out = '';
    for (const c of hex.toLowerCase()) {
      const v = HEX.indexOf(c);
      if (v < 0) throw new RangeError('bad hex digit ' + c);
      out += v.toString(2).padStart(4, '0');
    }
    return strip(out || '0');
  },
};

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve.binToHex('11010110'), 'd6');
  assert.strictEqual(solve.binToHex('101'), '5');
  assert.strictEqual(solve.hexToBin('1f'), '11111');
  assert.strictEqual(solve.binToHex('0000'), '0');
  assert.strictEqual(solve.hexToBin('0'), '0');
  assert.strictEqual(solve.hexToBin('FF'), '11111111');
  assert.strictEqual(solve.binToHex('1' + '0'.repeat(64)), '1' + '0'.repeat(16));
}
assert.strictEqual(optimal.binToHex('1'.repeat(100000)).length, 25000);
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(53);
for (let t = 0; t < 500; t++) {
  const bits = Array.from({ length: 1 + Math.floor(rand() * 120) }, () => (rand() < 0.5 ? '0' : '1')).join('');
  assert.strictEqual(optimal.binToHex(bits), bruteForce.binToHex(bits));
  const hex = Array.from({ length: 1 + Math.floor(rand() * 30) }, () => HEX[Math.floor(rand() * 16)]).join('');
  assert.strictEqual(optimal.hexToBin(hex), bruteForce.hexToBin(hex));
  assert.strictEqual(optimal.hexToBin(optimal.binToHex(bits)), strip(bits));
}
console.log('✓ 03_binary_hex_nibbles passed');

module.exports = { optimal, bruteForce };

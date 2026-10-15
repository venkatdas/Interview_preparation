/**
 * 01. Two's Complement at Any Width   (Original — Easy)
 *
 * PROBLEM
 * Write encode(n, w) that returns the w-bit two's complement bit string of the
 * integer n (1 <= w <= 32), and decode(bits) that turns such a string back into the
 * signed integer. encode must throw a RangeError if n does not fit in w signed bits.
 *
 * EXAMPLES
 * Input: encode(5, 4)       Output: "0101"
 * Input: encode(-5, 4)      Output: "1011"
 * Input: encode(-1, 8)      Output: "11111111"
 * Input: decode("1000")     Output: -8
 * Input: encode(8, 4)       Output: RangeError (4 signed bits hold -8..7)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Range for w bits is [-2^(w-1), 2^(w-1) - 1].
 * - decode infers the width from the string length.
 * - Why not n.toString(2)? Because (-5).toString(2) is "-101" (sign + magnitude).
 *
 * APPROACH 1 — Brute force (definition: flip and add one)   O(w) time, O(w) space
 * For n >= 0 write the binary digits and pad with zeros. For n < 0, write |n| in w bits,
 * flip every bit, then add 1 with a manual carry loop from the right.
 * decode: if the top bit is 1, do the reverse (subtract 1, flip) and negate.
 *
 * APPROACH 2 — Optimal (modular view + bit ops)   O(w) time, O(w) space
 * The w-bit pattern of n is the unsigned number (n mod 2^w), i.e. 2^w + n for negatives.
 * With the 32-bit funnel: u = (n >>> 0) gives the 32-bit pattern; read its low w bits
 * with (u >>> i) & 1 for i = w-1 .. 0.
 * decode: u = sum of bits; the top bit has weight -2^(w-1), so value = u - 2^w when the top bit is 1.
 *
 * Dry run encode(-5, 4):
 *   -5 >>> 0 = 4294967291 = ...11111011
 *   bits 3..0: 1 0 1 1 -> "1011"
 *   check: -8 + 0 + 2 + 1 = -5
 *
 * EDGE CASES
 * - n = -2^(w-1) (the most negative) -> "1000...0" (no positive counterpart!)
 * - w = 1: the only values are 0 ("0") and -1 ("1")
 * - w = 32: u can be >= 2^31, so build u with arithmetic, not << (which would wrap)
 *
 * COMMON MISTAKES
 * - Using toString(2) on negatives.
 * - Building the value in decode with (u << 1) | b: wraps negative at 32 bits.
 * - Forgetting the range check (encode(8, 4) would silently give "1000" = -8).
 */

function checkFit(n, w) {
  if (!Number.isInteger(w) || w < 1 || w > 32) throw new RangeError('w must be 1..32');
  if (!Number.isInteger(n) || n < -(2 ** (w - 1)) || n > 2 ** (w - 1) - 1) throw new RangeError('does not fit');
}

const bruteForce = {
  encode(n, w) {
    checkFit(n, w);
    const bits = Math.abs(n).toString(2).padStart(w, '0').split('').map(Number);
    if (n >= 0) return bits.join('');
    for (let i = 0; i < w; i++) bits[i] ^= 1;            // flip
    for (let i = w - 1; i >= 0; i--) {                   // add one
      if (bits[i] === 0) { bits[i] = 1; break; }
      bits[i] = 0;
    }
    return bits.join('');
  },
  decode(s) {
    const bits = s.split('').map(Number);
    if (bits[0] === 0) return parseInt(s, 2);
    for (let i = bits.length - 1; i >= 0; i--) {         // subtract one
      if (bits[i] === 1) { bits[i] = 0; break; }
      bits[i] = 1;
    }
    return -parseInt(bits.map(b => b ^ 1).join(''), 2);  // flip and negate
  },
};

const optimal = {
  encode(n, w) {
    checkFit(n, w);
    const u = n >>> 0; // 32-bit unsigned pattern; its low w bits are the w-bit pattern
    let s = '';
    for (let i = w - 1; i >= 0; i--) s += (u >>> i) & 1;
    return s;
  },
  decode(s) {
    let u = 0;
    for (const c of s) u = u * 2 + (c === '1' ? 1 : 0); // arithmetic: safe at 32 bits
    return s[0] === '1' ? u - 2 ** s.length : u;
  },
};

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve.encode(5, 4), '0101');
  assert.strictEqual(solve.encode(-5, 4), '1011');
  assert.strictEqual(solve.encode(-1, 8), '11111111');
  assert.strictEqual(solve.decode('1000'), -8);
  assert.strictEqual(solve.encode(-8, 4), '1000');
  assert.strictEqual(solve.encode(0, 1), '0');
  assert.strictEqual(solve.encode(-1, 1), '1');
  assert.strictEqual(solve.encode(-(2 ** 31), 32), '1' + '0'.repeat(31));
  assert.throws(() => solve.encode(8, 4), RangeError);
}
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(51);
for (let t = 0; t < 2000; t++) {
  const w = 1 + Math.floor(rand() * 32);
  const n = Math.floor(rand() * 2 ** w) - 2 ** (w - 1);
  const e = optimal.encode(n, w);
  assert.strictEqual(e, bruteForce.encode(n, w));
  assert.strictEqual(optimal.decode(e), n);
  assert.strictEqual(bruteForce.decode(e), n);
}
console.log('✓ 01_twos_complement_width passed');

module.exports = { optimal, bruteForce };

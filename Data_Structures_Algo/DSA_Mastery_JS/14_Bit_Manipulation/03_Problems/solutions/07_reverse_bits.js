/**
 * 07. Reverse Bits   (LeetCode 190 — Easy)
 *
 * PROBLEM
 * Reverse the 32 bits of an unsigned integer. Bit 0 becomes bit 31, bit 1 becomes bit 30, ...
 *
 * EXAMPLES
 * Input: 43261596 (00000010100101000001111010011100)
 * Output: 964176192 (00111001011110000010100101000000)
 * Input: 1   Output: 2147483648 (bit 0 moved to bit 31)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Return value is unsigned? (yes -> in JS finish with >>> 0, otherwise bit 31 makes it negative)
 *
 * APPROACH 1 — Brute force (string)   O(32) time, O(32) space
 * Convert to a 32-char binary string, reverse it, parse it back. Works, but interviewers
 * want the bit version.
 *
 * APPROACH 2 — Optimal (bit-by-bit)   O(32) = O(1) time, O(1) space
 * Loop 32 times: shift result left by 1, append the lowest bit of n, shift n right (logical!).
 * Finally `>>> 0` so the result is read as unsigned.
 *
 * Dry run on n = 1 (showing only the first 2 and last steps):
 *   i=0: result = (0 << 1) | 1 = 1,   n = 0
 *   i=1: result = (1 << 1) | 0 = 2,   n = 0
 *   ... i=31: result = 1 << 31 = -2147483648 (signed)  -> >>> 0 -> 2147483648
 *
 * EDGE CASES
 * - 0 -> 0
 * - 0xFFFFFFFF (all ones) -> same value 4294967295
 * - input given as a negative JS int (e.g. -1): use >>> on n so it behaves as unsigned
 */

function bruteForce(n) {
  const bits = (n >>> 0).toString(2).padStart(32, '0');
  return parseInt(bits.split('').reverse().join(''), 2);
}

function optimal(n) {
  let result = 0;
  for (let i = 0; i < 32; i++) {
    result = (result << 1) | (n & 1); // make room, append n's lowest bit
    n = n >>> 1;                      // logical shift: do not drag the sign bit in
  }
  return result >>> 0;                // unsigned view
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(43261596), 964176192);
  assert.strictEqual(solve(1), 2147483648);
  assert.strictEqual(solve(0), 0);
  assert.strictEqual(solve(4294967295), 4294967295);
  assert.strictEqual(solve(-1), 4294967295);
  assert.strictEqual(solve(2147483648), 1);
  assert.strictEqual(solve(solve(123456789)), 123456789);
}
console.log('✓ 07-reverse-bits passed');

module.exports = { optimal, bruteForce };

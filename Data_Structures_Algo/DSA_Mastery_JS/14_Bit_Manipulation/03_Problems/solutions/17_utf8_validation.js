/**
 * 17. UTF-8 Validation   (LeetCode 393 — Medium)
 *
 * PROBLEM
 * data is an array of integers; only the lowest 8 bits of each matter (one byte each).
 * Return true if the bytes form a valid UTF-8 encoding. Rules:
 *   1-byte char : 0xxxxxxx
 *   2-byte char : 110xxxxx 10xxxxxx
 *   3-byte char : 1110xxxx 10xxxxxx 10xxxxxx
 *   4-byte char : 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
 * Every continuation byte must start with 10.
 *
 * EXAMPLES
 * Input: [197,130,1]       Output: true    Explanation: 11000101 10000010 | 00000001
 * Input: [235,140,4]       Output: false   Explanation: 11101011 says 3-byte, but 00000100 is not 10xxxxxx
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can integers be > 255? (yes; use only the low 8 bits: byte & 0xFF)
 * - Is an empty array valid? (yes)
 *
 * APPROACH 1 — Brute force (string prefixes)   O(n) time, O(8) space
 * Convert each byte to an 8-char binary string and use startsWith on '0', '110', '1110',
 * '11110', '10'. Same logic as the optimal one, slower and clunkier.
 *
 * APPROACH 2 — Optimal (bit masks)   O(n) time, O(1) space
 * Keep `remaining` = number of continuation bytes still expected.
 *   if remaining === 0: read the leading byte and decide how many follow:
 *     (byte >> 7) === 0b0      -> 1-byte, remaining = 0
 *     (byte >> 5) === 0b110    -> remaining = 1
 *     (byte >> 4) === 0b1110   -> remaining = 2
 *     (byte >> 3) === 0b11110  -> remaining = 3
 *     anything else (10xxxxxx or 11111xxx) -> false
 *   else: byte must be 10xxxxxx, i.e. (byte >> 6) === 0b10; remaining--.
 * At the end remaining must be 0.
 *
 * Dry run on [197,130,1]:
 *   197 = 11000101: >>5 = 110 -> remaining 1
 *   130 = 10000010: >>6 = 10  ok, remaining 0
 *   1   = 00000001: >>7 = 0   -> 1-byte, remaining 0
 *   end, remaining 0 -> true
 *
 * EDGE CASES
 * - starts with a continuation byte -> false
 * - truncated multi-byte char at the end -> false (remaining > 0)
 * - 11111xxx leading byte (5+ bytes) -> false
 */

function bruteForce(data) {
  let remaining = 0;
  for (const value of data) {
    const bits = (value & 0xff).toString(2).padStart(8, '0');
    if (remaining === 0) {
      if (bits.startsWith('0')) remaining = 0;
      else if (bits.startsWith('110')) remaining = 1;
      else if (bits.startsWith('1110')) remaining = 2;
      else if (bits.startsWith('11110')) remaining = 3;
      else return false;
    } else {
      if (!bits.startsWith('10')) return false;
      remaining--;
    }
  }
  return remaining === 0;
}

function optimal(data) {
  let remaining = 0;
  for (const value of data) {
    const byte = value & 0xff;                 // only the lowest 8 bits count
    if (remaining === 0) {
      if ((byte >> 7) === 0b0) remaining = 0;
      else if ((byte >> 5) === 0b110) remaining = 1;
      else if ((byte >> 4) === 0b1110) remaining = 2;
      else if ((byte >> 3) === 0b11110) remaining = 3;
      else return false;                       // 10xxxxxx out of place, or 11111xxx
    } else {
      if ((byte >> 6) !== 0b10) return false;  // must be a continuation byte
      remaining--;
    }
  }
  return remaining === 0;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([197, 130, 1]), true);
  assert.strictEqual(solve([235, 140, 4]), false);
  assert.strictEqual(solve([]), true);
  assert.strictEqual(solve([130]), false);
  assert.strictEqual(solve([240, 162, 138, 147]), true);     // 4-byte char
  assert.strictEqual(solve([240, 162, 138]), false);         // truncated
  assert.strictEqual(solve([248, 130, 130, 130, 130]), false); // 11111000 leading
  assert.strictEqual(solve([0, 127, 64]), true);
}
console.log('✓ 17-utf8-validation passed');

module.exports = { optimal, bruteForce };

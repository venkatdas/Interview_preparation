/**
 * 14. Restore IP Addresses   (LeetCode 93 — Medium)
 *
 * PROBLEM
 * Given a string of digits, return all valid IPv4 addresses that can be formed by
 * inserting exactly three dots. Each of the 4 parts must be 0..255 and must not have
 * leading zeros ("01" is invalid, "0" is fine).
 *
 * EXAMPLES
 * Input: "25525511135"   Output: ["255.255.11.135","255.255.111.35"]
 * Input: "0000"          Output: ["0.0.0.0"]
 * Input: "101023"        Output: ["1.0.10.23","1.0.102.3","10.1.0.23","10.10.2.3","101.0.2.3"]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Only digits in the input? (yes)
 * - Length < 4 or > 12 -> no answer
 * - "0" allowed as a part, "00"/"01" not
 *
 * APPROACH 1 — Brute force   O(1) really (at most 3 nested loops of 3 -> 27 splits)
 * Three nested loops choose the three dot positions (each part 1-3 chars), validate
 * all four parts. Because the parts have max length 3 the work is constant.
 *
 * APPROACH 2 — Optimal (Backtracking: partition into exactly 4 valid parts)   O(3^4) time, O(4) stack
 * go(start, parts): if parts.length === 4, record if start === s.length. Otherwise try
 * a piece of length 1, 2, 3 from `start`; skip invalid pieces (leading zero, > 255),
 * recurse. Pruning: if the remaining characters cannot fit in the remaining parts
 * (fewer than 1 per part or more than 3 per part), return early.
 *
 * Dry run "25525511135":
 *   part "2" -> rest 10 chars for 3 parts (max 9) -> prune
 *   part "25" -> rest 9 chars, 3 parts ok -> "5","52","525(>255 skip)"... eventually nothing fits
 *   part "255" -> "255" -> "11" -> "135" record; "111" -> "35" record
 *
 * EDGE CASES
 * - "" or shorter than 4 -> []
 * - longer than 12 -> []
 * - all zeros "0000" -> ["0.0.0.0"]; "00000" -> []
 */

function isValidPart(part) {
  if (part.length === 0 || part.length > 3) return false;
  if (part.length > 1 && part[0] === '0') return false;   // leading zero
  return Number(part) <= 255;
}

function bruteForce(s) {
  const results = [];
  const n = s.length;
  for (let a = 1; a <= 3; a++) {
    for (let b = 1; b <= 3; b++) {
      for (let c = 1; c <= 3; c++) {
        const d = n - a - b - c;                  // whatever is left is the 4th part
        if (d < 1 || d > 3) continue;
        const parts = [s.slice(0, a), s.slice(a, a + b), s.slice(a + b, a + b + c), s.slice(a + b + c)];
        if (parts.every(isValidPart)) results.push(parts.join('.'));
      }
    }
  }
  return results;
}

function optimal(s) {
  const results = [];
  if (s.length < 4 || s.length > 12) return results;

  function go(start, parts) {
    const remainingChars = s.length - start;
    const remainingParts = 4 - parts.length;
    // prune: each remaining part needs between 1 and 3 characters
    if (remainingChars < remainingParts || remainingChars > 3 * remainingParts) return;
    if (parts.length === 4) {
      if (start === s.length) results.push(parts.join('.'));
      return;
    }
    for (let length = 1; length <= 3 && start + length <= s.length; length++) {
      const part = s.slice(start, start + length);
      if (!isValidPart(part)) continue;
      parts.push(part);                 // choose
      go(start + length, parts);        // explore
      parts.pop();                      // un-choose
    }
  }

  go(0, []);
  return results;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve('25525511135').sort(), ['255.255.11.135', '255.255.111.35']);
  assert.deepStrictEqual(solve('0000'), ['0.0.0.0']);
  assert.deepStrictEqual(solve('101023').sort(),
    ['1.0.10.23', '1.0.102.3', '10.1.0.23', '10.10.2.3', '101.0.2.3'].sort());
  assert.deepStrictEqual(solve('00000'), []);
  assert.deepStrictEqual(solve('1'), []);
  assert.deepStrictEqual(solve(''), []);
  assert.deepStrictEqual(solve('1111111111111'), []);   // 13 digits
  assert.deepStrictEqual(solve('255255255255'), ['255.255.255.255']);
  assert.deepStrictEqual(solve('010010').sort(), ['0.10.0.10', '0.100.1.0']);
}
console.log('✓ 14-restore-ip-addresses passed');

module.exports = { optimal, bruteForce };

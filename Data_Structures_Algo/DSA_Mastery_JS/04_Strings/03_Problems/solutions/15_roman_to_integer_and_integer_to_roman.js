/**
 * 15. Roman to Integer & Integer to Roman   (LeetCode 13 — Easy, LeetCode 12 — Medium)
 *
 * PROBLEM
 * Roman numerals use seven symbols: I=1 V=5 X=10 L=50 C=100 D=500 M=1000.
 * Symbols are written largest to smallest and added up, EXCEPT six subtractive pairs:
 * IV=4 IX=9 XL=40 XC=90 CD=400 CM=900 (a smaller symbol before a larger one is subtracted).
 *   Part A (LC 13): given a valid roman numeral string, return its integer value.
 *   Part B (LC 12): given an integer 1..3999, return its roman numeral.
 *
 * EXAMPLES
 * Input: "III"       Output: 3
 * Input: "LVIII"     Output: 58     Explanation: L=50, V=5, III=3
 * Input: "MCMXCIV"   Output: 1994   Explanation: M=1000, CM=900, XC=90, IV=4
 * Input: 58          Output: "LVIII"
 * Input: 1994        Output: "MCMXCIV"
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is the input always a valid numeral in [1, 3999]? (yes; no validation needed)
 * - Uppercase only? (yes)
 * - Should intToRoman produce the canonical form ("IV", never "IIII")? (yes)
 *
 * APPROACH 1 — Brute force   O(n) time, O(1) space
 * romanToInt: scan left to right, and whenever the current two characters form one of the
 * six subtractive pairs (looked up in a map), take the pair's value and skip two chars.
 * intToRoman: for each of the 13 values (1000, 900, ..., 4, 1), repeatedly subtract while
 * it fits and append its symbol. Both are already efficient; the "optimal" versions are
 * just the cleaner one-pass formulations.
 *
 * APPROACH 2 — Optimal
 *   romanToInt (look-ahead comparison)   O(n) time, O(1) space
 *   For each symbol: if its value is SMALLER than the next symbol's value, subtract it,
 *   otherwise add it. That single rule covers all six subtractive pairs without a table.
 *   intToRoman (greedy table)   O(1) time, O(1) space (output length <= 15)
 *   Greedy works because the 13 values include the subtractive pairs, so the largest
 *   value that fits is always the canonical choice.
 *
 * Dry run romanToInt("MCMXCIV"):
 *   M(1000) next C(100)  -> 1000 >= 100 add      total 1000
 *   C(100)  next M(1000) -> 100 < 1000 subtract  total 900
 *   M(1000) next X(10)   -> add                  total 1900
 *   X(10)   next C(100)  -> subtract             total 1890
 *   C(100)  next I(1)    -> add                  total 1990
 *   I(1)    next V(5)    -> subtract             total 1989
 *   V(5)    last         -> add                  total 1994
 *
 * Dry run intToRoman(1994):
 *   1000 fits -> "M", 994 left; 900 fits -> "CM", 94; 90 fits -> "XC", 4; 4 fits -> "IV", 0
 *   "MCMXCIV"
 *
 * EDGE CASES
 * - single symbol "I" -> 1, "M" -> 1000
 * - all subtractive: "CDXLIV" -> 444
 * - 3999 -> "MMMCMXCIX" (longest output)
 * - 4 -> "IV", not "IIII"
 */

const VALUES = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };

// 13 entries, largest first, including the six subtractive pairs
const TABLE = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
  [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
];

// ---------- Part A: roman -> int ----------

function romanToIntBrute(s) {
  const pairs = { IV: 4, IX: 9, XL: 40, XC: 90, CD: 400, CM: 900 };
  let total = 0;
  let i = 0;
  while (i < s.length) {
    const two = s.slice(i, i + 2);
    if (pairs[two] !== undefined) {
      total += pairs[two];
      i += 2;
    } else {
      total += VALUES[s[i]];
      i += 1;
    }
  }
  return total;
}

function romanToInt(s) {
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const current = VALUES[s[i]];
    const next = i + 1 < s.length ? VALUES[s[i + 1]] : 0;
    // a smaller symbol before a larger one means "subtract me" (IV, XC, CM ...)
    total += current < next ? -current : current;
  }
  return total;
}

// ---------- Part B: int -> roman ----------

function intToRomanBrute(num) {
  const parts = [];
  for (const [value, symbol] of TABLE) {
    while (num >= value) {
      parts.push(symbol);
      num -= value;
    }
  }
  return parts.join('');
}

function intToRoman(num) {
  const parts = [];
  for (const [value, symbol] of TABLE) {
    if (num === 0) break;
    const count = Math.floor(num / value);   // how many times this symbol repeats (0..3)
    if (count > 0) {
      parts.push(symbol.repeat(count));
      num -= value * count;
    }
  }
  return parts.join('');
}

// aliases so this file matches the folder convention
function bruteForce(input) {
  return typeof input === 'number' ? intToRomanBrute(input) : romanToIntBrute(input);
}

function optimal(input) {
  return typeof input === 'number' ? intToRoman(input) : romanToInt(input);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('III'), 3);
  assert.strictEqual(solve('LVIII'), 58);
  assert.strictEqual(solve('MCMXCIV'), 1994);
  assert.strictEqual(solve('CDXLIV'), 444);
  assert.strictEqual(solve('I'), 1);
  assert.strictEqual(solve(58), 'LVIII');
  assert.strictEqual(solve(1994), 'MCMXCIV');
  assert.strictEqual(solve(4), 'IV');
  assert.strictEqual(solve(3999), 'MMMCMXCIX');
  assert.strictEqual(solve(1000), 'M');
}
// round trip every number in range
for (let n = 1; n <= 3999; n++) {
  assert.strictEqual(romanToInt(intToRoman(n)), n);
  assert.strictEqual(romanToIntBrute(intToRomanBrute(n)), n);
}
console.log('✓ 15-roman-to-integer-and-integer-to-roman passed');

module.exports = { optimal, bruteForce, romanToInt, intToRoman };

/**
 * 03. Excel Sheet Column Number & Column Title   (LeetCode 171 — Easy, LeetCode 168 — Easy)
 *
 * PROBLEM
 * Excel names columns A, B, ..., Z, AA, AB, ..., ZZ, AAA, ...
 * 171: given a title like "AB", return its number (28).
 * 168: given a number like 28, return its title ("AB").
 *
 * EXAMPLES
 * Input: "A"    Output: 1
 * Input: "Z"    Output: 26
 * Input: "AA"   Output: 27     Explanation: 1 * 26 + 1
 * Input: "ZY"   Output: 701    Explanation: 26 * 26 + 25
 * Input: 701    Output: "ZY"
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Only uppercase A-Z? (yes)
 * - Max length? (7 letters, fits in 32-bit)
 * - Is there a "zero" letter? (no: this is bijective base 26, digits are 1..26)
 *
 * APPROACH 1 — Brute force (count up)   O(26^k) time
 * Generate titles in order A, B, ..., Z, AA, ... until you reach the target. Correct but
 * exponential in the title length; useful only as a mental model.
 *
 * APPROACH 2 — Optimal (base conversion without a zero digit)   O(k) time, O(1) space
 * Title -> number: like reading a base-26 number, value = value * 26 + (ch - 'A' + 1).
 * Number -> title: like converting to base 26, but digits run 1..26 instead of 0..25, so
 * subtract 1 before taking % 26 and before dividing. That shift is the whole trick.
 *
 * Dry run title "ZY":
 *   'Z': value = 0 * 26 + 26 = 26
 *   'Y': value = 26 * 26 + 25 = 701
 * Dry run number 701:
 *   n=701: n-1=700, 700 % 26 = 24 -> 'Y',  n = floor(700 / 26) = 26
 *   n=26:  n-1=25,  25 % 26 = 25  -> 'Z',  n = floor(25 / 26) = 0
 *   reversed: "ZY"
 *
 * EDGE CASES
 * - "Z" -> 26 and 26 -> "Z" (the -1 shift is what makes this work; without it 26 -> "A0")
 * - 52 -> "AZ", 53 -> "BA"
 */

function bruteForce(title) {
  // count titles in order until we hit the target
  let current = '';
  let number = 0;
  while (current !== title) {
    number++;
    current = numberToTitle(number);
    if (current.length > title.length) return -1; // safety: not found
  }
  return number;
}

// 171: title -> number
function optimal(title) {
  let value = 0;
  for (const ch of title) {
    const digit = ch.charCodeAt(0) - 64; // 'A' is 65 -> 1
    value = value * 26 + digit;
  }
  return value;
}

// 168: number -> title
function numberToTitle(number) {
  const letters = [];
  while (number > 0) {
    number--; // shift from 1..26 to 0..25 so % and / behave like normal base 26
    letters.push(String.fromCharCode(65 + (number % 26)));
    number = Math.floor(number / 26);
  }
  return letters.reverse().join('');
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('A'), 1);
  assert.strictEqual(solve('Z'), 26);
  assert.strictEqual(solve('AA'), 27);
  assert.strictEqual(solve('AZ'), 52);
  assert.strictEqual(solve('BA'), 53);
  assert.strictEqual(solve('ZY'), 701);
}
assert.strictEqual(optimal('FXSHRXW'), 2147483647);
assert.strictEqual(numberToTitle(1), 'A');
assert.strictEqual(numberToTitle(26), 'Z');
assert.strictEqual(numberToTitle(27), 'AA');
assert.strictEqual(numberToTitle(701), 'ZY');
assert.strictEqual(numberToTitle(2147483647), 'FXSHRXW');
for (let n = 1; n <= 1000; n++) assert.strictEqual(optimal(numberToTitle(n)), n); // round trip
console.log('✓ 03-excel-sheet-column-number passed');

module.exports = { optimal, bruteForce, titleToNumber: optimal, numberToTitle };

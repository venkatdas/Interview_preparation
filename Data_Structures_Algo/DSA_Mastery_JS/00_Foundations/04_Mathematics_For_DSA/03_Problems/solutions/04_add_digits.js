/**
 * 04. Add Digits   (LeetCode 258 — Easy)
 *
 * PROBLEM
 * Given a non-negative integer, repeatedly add all its digits until the result has only one
 * digit. Return that digit.
 *
 * EXAMPLES
 * Input: 38   Output: 2   Explanation: 3 + 8 = 11, 1 + 1 = 2
 * Input: 0    Output: 0
 * Input: 9    Output: 9
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can n be 0? (yes -> 0)
 * - Follow-up: can you do it without any loop / recursion, in O(1)?
 *
 * APPROACH 1 — Brute force (simulate)   O(log n) time per round, a few rounds, O(1) space
 * While n has more than one digit, replace n with the sum of its digits. Each round shrinks
 * n a lot (a 10-digit number sums to at most 90), so it ends after 2-3 rounds.
 *
 * APPROACH 2 — Optimal (digital root formula)   O(1) time, O(1) space
 * A number and the sum of its digits leave the same remainder when divided by 9, because
 * 10 = 1 (mod 9), so every power of 10 is 1 (mod 9). Repeating the digit sum does not change
 * n mod 9. The final single digit is therefore n mod 9, except that a multiple of 9 (other
 * than 0) ends at 9, not 0. The formula 1 + (n - 1) % 9 handles both cases.
 *
 * Dry run on 38: 38 mod 9 = 2 -> 1 + (37 % 9) = 1 + 1 = 2. Matches 3+8=11, 1+1=2.
 * Dry run on 18: 18 mod 9 = 0 but the answer is 9: 1 + (17 % 9) = 1 + 8 = 9.
 * Dry run on 0: special-cased -> 0.
 *
 * EDGE CASES
 * - 0            -> 0 (the formula would give 1 + (-1 % 9) = 0 in JS by luck; be explicit)
 * - multiples of 9 -> 9, not 0
 * - single digit -> itself
 */

function bruteForce(num) {
  while (num >= 10) {
    let digitSum = 0;
    while (num > 0) {
      digitSum += num % 10;
      num = Math.floor(num / 10);
    }
    num = digitSum;
  }
  return num;
}

function optimal(num) {
  if (num === 0) return 0;
  return 1 + ((num - 1) % 9); // digital root
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(38), 2);
  assert.strictEqual(solve(0), 0);
  assert.strictEqual(solve(9), 9);
  assert.strictEqual(solve(18), 9);
  assert.strictEqual(solve(10), 1);
  assert.strictEqual(solve(99999999), 9);
  assert.strictEqual(solve(123456789), 9);
  assert.strictEqual(solve(2 ** 31 - 1), 1);
}
for (let n = 0; n < 2000; n++) assert.strictEqual(optimal(n), bruteForce(n));
console.log('✓ 04-add-digits passed');

module.exports = { optimal, bruteForce };

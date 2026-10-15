/**
 * 01. Palindrome Number   (LeetCode 9 — Easy)
 *
 * PROBLEM
 * Given an integer x, return true if x reads the same forwards and backwards.
 *
 * EXAMPLES
 * Input: 121    Output: true
 * Input: -121   Output: false   Explanation: reads "121-" backwards, the minus breaks it
 * Input: 10     Output: false   Explanation: "01" is not "10"
 * Input: 0      Output: true
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Are negative numbers ever palindromes? (no, by definition here)
 * - Can I convert to a string? (allowed, but the follow-up asks for no string conversion)
 * - Range: 32-bit signed integer
 *
 * APPROACH 1 — Brute force (string)   O(d) time, O(d) space, d = number of digits
 * Convert to a string, reverse it, compare. Simple but allocates two strings.
 *
 * APPROACH 2 — Optimal (reverse half the digits)   O(d) time, O(1) space
 * Reverse digits from the right into a new number until the reversed part is >= what is
 * left. Then the two halves must match (for odd length, drop the middle digit with / 10).
 * Reversing only half avoids overflow of the reversed number.
 *
 * Dry run on 1221:
 *   x=1221 rev=0    -> rev=1,   x=122
 *   x=122  rev=1    -> rev=12,  x=12
 *   x=12   rev=12   stop (rev >= x)  -> x === rev -> true
 * Dry run on 12321:
 *   x=12321 rev=0   -> rev=1,   x=1232
 *   x=1232  rev=1   -> rev=12,  x=123
 *   x=123   rev=12  -> rev=123, x=12
 *   x=12    rev=123 stop -> x === Math.floor(rev / 10) (12 === 12) -> true
 *
 * EDGE CASES
 * - negative           -> false
 * - ends with 0 (10, 100) but not 0 itself -> false (a leading zero is impossible)
 * - single digit       -> true
 */

function bruteForce(x) {
  const str = String(x);
  return str === [...str].reverse().join('');
}

function optimal(x) {
  if (x < 0) return false;
  if (x % 10 === 0 && x !== 0) return false; // trailing zero can never mirror a leading digit

  let reversedHalf = 0;
  while (x > reversedHalf) {
    reversedHalf = reversedHalf * 10 + (x % 10); // move the last digit of x onto the reversed half
    x = Math.floor(x / 10);
  }
  // even digit count: x === reversedHalf; odd: the middle digit sits at the end of reversedHalf
  return x === reversedHalf || x === Math.floor(reversedHalf / 10);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(121), true);
  assert.strictEqual(solve(-121), false);
  assert.strictEqual(solve(10), false);
  assert.strictEqual(solve(0), true);
  assert.strictEqual(solve(7), true);
  assert.strictEqual(solve(1221), true);
  assert.strictEqual(solve(12321), true);
  assert.strictEqual(solve(123), false);
  assert.strictEqual(solve(1000021), false);
}
console.log('✓ 01-palindrome-number passed');

module.exports = { optimal, bruteForce };

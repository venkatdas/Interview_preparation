/**
 * 14. Multiply Strings   (LeetCode 43 — Medium)
 *
 * PROBLEM
 * Given two non-negative integers as strings (possibly hundreds of digits long),
 * return their product as a string. You may NOT convert them to numbers directly
 * (Number() would lose precision past 2^53).
 *
 * EXAMPLES
 * Input: num1 = "2", num2 = "3"       Output: "6"
 * Input: num1 = "123", num2 = "456"   Output: "56088"
 * Input: num1 = "0", num2 = "52"      Output: "0"
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - No leading zeros except "0" itself? (yes)
 * - Negative numbers? (no)
 * - Can I use BigInt? (in real JS yes - BigInt(a) * BigInt(b) - but the interviewer wants
 *   the schoolbook algorithm; BigInt makes a great "brute force" sanity check)
 *
 * APPROACH 1 — Brute force   O(n * m) time, O(n + m) space
 * (String(BigInt(num1) * BigInt(num2))). Uses the language's arbitrary precision.
 * Correct and short, but it skips the point of the question.
 *
 * APPROACH 2 — Optimal (schoolbook multiplication on a digit array)   O(n * m) time, O(n + m) space
 * The product of two numbers with n and m digits has at most n + m digits.
 * Key insight: digit i of num1 (from the right) times digit j of num2 (from the right)
 * contributes to positions i + j (low) and i + j + 1 (high) of the result, counted from
 * the right. Use an array `result` of length n + m, add each product into it, carry as
 * you go, then strip leading zeros.
 * Indexing from the LEFT (as in the code): product of num1[i] and num2[j] lands at
 * positions [i + j, i + j + 1] of a result array indexed left to right.
 *
 * Dry run on "12" x "34" (result length 4, indices 0..3):
 *   i=1 ('2'), j=1 ('4'): 8  -> pos 3: 8, carry 0                result [0,0,0,8]
 *   i=1 ('2'), j=0 ('3'): 6  -> pos 2: 6                         result [0,0,6,8]
 *   i=0 ('1'), j=1 ('4'): 4  -> pos 2: 6+4=10 -> 0, carry 1 to pos 1   [0,1,0,8]
 *   i=0 ('1'), j=0 ('3'): 3  -> pos 1: 1+3=4                     result [0,4,0,8]
 *   strip leading zero -> "408"  (12 * 34 = 408)
 *
 * EDGE CASES
 * - either is "0"      -> "0" (short-circuit, otherwise we'd return "" after stripping)
 * - "1" x anything     -> that thing
 * - very long inputs   -> no overflow because each cell holds a single digit after carry
 */

function bruteForce(num1, num2) {
  return String(BigInt(num1) * BigInt(num2));
}

function optimal(num1, num2) {
  if (num1 === '0' || num2 === '0') return '0';

  const n = num1.length;
  const m = num2.length;
  const result = new Array(n + m).fill(0); // indexed left to right, most significant first

  for (let i = n - 1; i >= 0; i--) {
    const digit1 = num1.charCodeAt(i) - 48;
    for (let j = m - 1; j >= 0; j--) {
      const digit2 = num2.charCodeAt(j) - 48;
      const low = i + j + 1;  // the "ones" position of this partial product
      const high = i + j;     // where its carry goes

      const sum = digit1 * digit2 + result[low];
      result[low] = sum % 10;
      result[high] += Math.floor(sum / 10); // may exceed 9 temporarily; later cells fix it
    }
  }

  // result[high] can only overflow into cells that are processed later (smaller index),
  // and the last cell written is index 0, which never exceeds 9 for valid inputs.
  // Strip leading zeros (at most n + m - 1 of them).
  let start = 0;
  while (start < result.length - 1 && result[start] === 0) start++;
  return result.slice(start).join('');
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('2', '3'), '6');
  assert.strictEqual(solve('123', '456'), '56088');
  assert.strictEqual(solve('0', '52'), '0');
  assert.strictEqual(solve('12', '34'), '408');
  assert.strictEqual(solve('1', '999'), '999');
  assert.strictEqual(solve('99', '99'), '9801');
  assert.strictEqual(solve('123456789', '987654321'), '121932631112635269');
  assert.strictEqual(solve('9'.repeat(30), '9'.repeat(30)), String(BigInt('9'.repeat(30)) ** 2n));
}
console.log('✓ 14-multiply-strings passed');

module.exports = { optimal, bruteForce };

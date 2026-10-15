/**
 * 11. Sum of Two Integers   (LeetCode 371 — Medium)
 *
 * PROBLEM
 * Return a + b without using the + or - operators. Inputs fit in 32-bit signed ints.
 *
 * EXAMPLES
 * Input: a = 1, b = 2     Output: 3
 * Input: a = 2, b = 3     Output: 5
 * Input: a = -1, b = 1    Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 32-bit overflow behaviour? (wrap like a 32-bit int, which JS bitwise ops do for free)
 * - Negative inputs? (yes, two's complement handles them)
 *
 * APPROACH 1 — Brute force   O(|b|) time
 * Increment a |b| times using ++ / -- (technically not + or -). Only for tiny b; shown
 * for contrast.
 *
 * APPROACH 2 — Optimal (XOR for sum, AND for carry)   O(32) time, O(1) space
 * Adding two bits: 0+0=0, 0+1=1, 1+0=1, 1+1=0 carry 1.
 *   sum without carries = a ^ b
 *   carries             = (a & b) << 1   (a carry moves one position left)
 * Then add the carries to the partial sum the same way. Each round the carry loses at
 * least its lowest bit, so after at most 32 rounds the carry is 0.
 *
 * Dry run on a = 5 (101), b = 3 (011):
 *   sum = 101 ^ 011 = 110,  carry = (101 & 011) << 1 = 001 << 1 = 010
 *   sum = 110 ^ 010 = 100,  carry = (110 & 010) << 1 = 010 << 1 = 100
 *   sum = 100 ^ 100 = 000,  carry = (100 & 100) << 1 = 1000
 *   sum = 000 ^ 1000 = 1000, carry = 0  -> 8
 *
 * EDGE CASES
 * - a = -1, b = 1 -> 0 (carry propagates off the top and disappears)
 * - b = 0 -> a
 * - both negative -> correct two's complement result
 */

function bruteForce(a, b) {
  while (b > 0) { a++; b--; }
  while (b < 0) { a--; b++; }
  return a;
}

function optimal(a, b) {
  while (b !== 0) {
    const carry = (a & b) << 1; // positions where both have 1 produce a carry one bit left
    a = a ^ b;                  // add without carrying
    b = carry;                  // now add the carries
  }
  return a;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(1, 2), 3);
  assert.strictEqual(solve(2, 3), 5);
  assert.strictEqual(solve(-1, 1), 0);
  assert.strictEqual(solve(5, 3), 8);
  assert.strictEqual(solve(-7, -8), -15);
  assert.strictEqual(solve(0, 0), 0);
  assert.strictEqual(solve(100, -30), 70);
}
assert.strictEqual(optimal(2147483647, 1), -2147483648); // wraps like a real 32-bit int
console.log('✓ 11-sum-of-two-integers passed');

module.exports = { optimal, bruteForce };

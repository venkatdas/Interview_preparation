/**
 * 02. Number of 1 Bits   (LeetCode 191 — Easy)
 *
 * PROBLEM
 * Given a 32-bit unsigned integer, return the number of 1 bits (its "Hamming weight").
 *
 * EXAMPLES
 * Input: 11          Output: 3   Explanation: 1011
 * Input: 128         Output: 1   Explanation: 10000000
 * Input: 4294967293  Output: 31  Explanation: all ones except bit 1 (in JS this is -3 | 0)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is the input treated as unsigned? (yes; in JS negative inputs must be viewed with >>> 0)
 *
 * APPROACH 1 — Brute force   O(32) time, O(1) space
 * Check all 32 bit positions with (n >>> i) & 1. Always 32 iterations.
 *
 * APPROACH 2 — Optimal (Brian Kernighan)   O(k) time, O(1) space, k = number of 1 bits
 * n & (n - 1) clears the lowest set bit. Repeat until n is 0, counting iterations.
 * Loops only as many times as there are 1 bits.
 *
 * Dry run on 11 (1011):
 *   1011 & 1010 = 1010   count 1
 *   1010 & 1001 = 1000   count 2
 *   1000 & 0111 = 0000   count 3 -> 3
 *
 * EDGE CASES
 * - 0 -> 0
 * - 2^31 (sign bit) -> 1; convert with >>> 0 so the loop terminates
 * - -1 (all bits set) -> 32
 */

function bruteForce(n) {
  let count = 0;
  for (let i = 0; i < 32; i++) {
    if (((n >>> i) & 1) === 1) count++;
  }
  return count;
}

function optimal(n) {
  let count = 0;
  n = n >>> 0;                 // unsigned view: -1 becomes 4294967295 and the loop ends
  while (n !== 0) {
    n &= n - 1;                // kill the lowest set bit
    count++;
  }
  return count;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(11), 3);
  assert.strictEqual(solve(128), 1);
  assert.strictEqual(solve(0), 0);
  assert.strictEqual(solve(4294967293), 31);
  assert.strictEqual(solve(-1), 32);
  assert.strictEqual(solve(2 ** 31), 1);
  assert.strictEqual(solve(255), 8);
}
console.log('✓ 02-number-of-1-bits passed');

module.exports = { optimal, bruteForce };

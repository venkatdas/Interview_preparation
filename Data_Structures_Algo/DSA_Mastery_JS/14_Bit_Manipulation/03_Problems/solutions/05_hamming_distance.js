/**
 * 05. Hamming Distance   (LeetCode 461 — Easy)
 *
 * PROBLEM
 * The Hamming distance between two integers is the number of bit positions where they differ.
 * Return it for x and y.
 *
 * EXAMPLES
 * Input: x = 1, y = 4   Output: 2   Explanation: 001 vs 100 differ at two positions
 * Input: x = 3, y = 1   Output: 1   Explanation: 011 vs 001
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Non-negative 32-bit integers? (yes)
 *
 * APPROACH 1 — Brute force   O(32) time, O(1) space
 * Compare bit i of x and bit i of y for every i in 0..31.
 *
 * APPROACH 2 — Optimal (popcount of XOR)   O(k) time, O(1) space, k = differing bits
 * x ^ y has a 1 exactly where x and y differ. Count its 1 bits with Kernighan's trick.
 *
 * Dry run on x = 1, y = 4:
 *   001 ^ 100 = 101  -> two set bits -> 2
 *
 * EDGE CASES
 * - x === y -> 0
 * - one of them is 0 -> popcount of the other
 */

function bruteForce(x, y) {
  let distance = 0;
  for (let i = 0; i < 32; i++) {
    if (((x >>> i) & 1) !== ((y >>> i) & 1)) distance++;
  }
  return distance;
}

function optimal(x, y) {
  let diff = (x ^ y) >>> 0;   // 1s where the bits differ
  let distance = 0;
  while (diff !== 0) {
    diff &= diff - 1;         // remove lowest set bit
    distance++;
  }
  return distance;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(1, 4), 2);
  assert.strictEqual(solve(3, 1), 1);
  assert.strictEqual(solve(7, 7), 0);
  assert.strictEqual(solve(0, 255), 8);
  assert.strictEqual(solve(0, 0), 0);
  assert.strictEqual(solve(2 ** 31 - 1, 0), 31);
}
console.log('✓ 05-hamming-distance passed');

module.exports = { optimal, bruteForce };

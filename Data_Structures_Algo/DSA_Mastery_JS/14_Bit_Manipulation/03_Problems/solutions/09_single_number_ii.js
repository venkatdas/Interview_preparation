/**
 * 09. Single Number II   (LeetCode 137 — Medium)
 *
 * PROBLEM
 * Every element appears exactly THREE times except one, which appears once. Find it in
 * O(n) time and O(1) extra space.
 *
 * EXAMPLES
 * Input: [2,2,3,2]              Output: 3
 * Input: [0,1,0,1,0,1,99]       Output: 99
 * Input: [-2,-2,-2,5]           Output: 5
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Negatives allowed? (yes - answer must handle the sign bit correctly)
 * - Plain XOR works? (no: three copies do not cancel, 2^2^2 = 2)
 *
 * APPROACH 1 — Brute force   O(n) time, O(n) space
 * Count with a hash map, return the key with count 1.
 *
 * APPROACH 2 — Optimal (count each bit column modulo 3)   O(32 n) time, O(1) space
 * For each bit position i, count how many numbers have bit i set. Numbers that appear 3
 * times contribute a multiple of 3 to that count. So (count % 3) is the single number's
 * bit i. Rebuild the answer bit by bit. If bit 31 ends up set, the number is negative:
 * `result | 0` re-interprets the 32-bit pattern as signed.
 *
 * Dry run on [2,2,3,2] (bits: 010,010,011,010):
 *   bit0 count=1 -> 1%3=1 -> set
 *   bit1 count=4 -> 4%3=1 -> set
 *   bit2 count=0 -> 0
 *   result = 011 = 3
 *
 * EDGE CASES
 * - single element -> itself
 * - negative single number -> sign bit count % 3 === 1 -> result | 0 gives the negative value
 * - the single number is 0 -> all counts are multiples of 3 -> 0
 */

function bruteForce(nums) {
  const counts = new Map();
  for (const num of nums) counts.set(num, (counts.get(num) || 0) + 1);
  for (const [num, count] of counts) if (count === 1) return num;
  return undefined;
}

function optimal(nums) {
  let result = 0;
  for (let bit = 0; bit < 32; bit++) {
    let count = 0;
    for (const num of nums) {
      if ((num >>> bit) & 1) count++;
    }
    if (count % 3 === 1) result |= 1 << bit; // this bit belongs to the single number
  }
  return result | 0; // if bit 31 was set, read the pattern as a signed 32-bit int
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([2, 2, 3, 2]), 3);
  assert.strictEqual(solve([0, 1, 0, 1, 0, 1, 99]), 99);
  assert.strictEqual(solve([-2, -2, -2, 5]), 5);
  assert.strictEqual(solve([7, -4, 7, 7]), -4);
  assert.strictEqual(solve([42]), 42);
  assert.strictEqual(solve([1, 1, 1, 0]), 0);
}
console.log('✓ 09-single-number-ii passed');

module.exports = { optimal, bruteForce };

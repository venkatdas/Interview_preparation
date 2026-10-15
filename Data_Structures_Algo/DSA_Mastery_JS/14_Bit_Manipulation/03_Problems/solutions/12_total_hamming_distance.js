/**
 * 12. Total Hamming Distance   (LeetCode 477 — Medium)
 *
 * PROBLEM
 * Return the sum of Hamming distances over ALL pairs of numbers in the array.
 *
 * EXAMPLES
 * Input: [4,14,2]   Output: 6
 *   Explanation: HD(4,14)=2, HD(4,2)=2, HD(14,2)=2 -> 6
 * Input: [4,14,4]   Output: 4
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Non-negative numbers < 2^30? (yes)
 * - n up to 10^4 -> O(n^2) pairs is borderline, want O(32 n)
 *
 * APPROACH 1 — Brute force   O(n^2 * 32) time, O(1) space
 * For every pair, popcount(a ^ b). 10^8 for n = 10^4; too slow in a strict judge.
 *
 * APPROACH 2 — Optimal (count ones per bit column)   O(32 n) time, O(1) space
 * Look at one bit position at a time. If `ones` numbers have a 1 there and `zeros` have a 0,
 * then every (one, zero) pair differs at this bit -> contributes ones * zeros.
 * Sum over the 32 columns. Pairs are never enumerated.
 *
 * Dry run on [4,14,2] (100, 1110, 010):
 *   bit0: ones=0, zeros=3 -> 0
 *   bit1: ones=2 (14,2), zeros=1 -> 2
 *   bit2: ones=2 (4,14), zeros=1 -> 2
 *   bit3: ones=1 (14),   zeros=2 -> 2   -> 6
 *
 * EDGE CASES
 * - single element -> 0
 * - all equal -> 0
 * - empty -> 0
 */

function bruteForce(nums) {
  let total = 0;
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      let diff = nums[i] ^ nums[j];
      while (diff !== 0) { diff &= diff - 1; total++; }
    }
  }
  return total;
}

function optimal(nums) {
  let total = 0;
  const n = nums.length;
  for (let bit = 0; bit < 32; bit++) {
    let ones = 0;
    for (const num of nums) ones += (num >>> bit) & 1;
    total += ones * (n - ones); // each (1, 0) pair at this column differs here
  }
  return total;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([4, 14, 2]), 6);
  assert.strictEqual(solve([4, 14, 4]), 4);
  assert.strictEqual(solve([7]), 0);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([5, 5, 5]), 0);
  assert.strictEqual(solve([0, 1, 2, 3]), 8);
}
console.log('✓ 12-total-hamming-distance passed');

module.exports = { optimal, bruteForce };

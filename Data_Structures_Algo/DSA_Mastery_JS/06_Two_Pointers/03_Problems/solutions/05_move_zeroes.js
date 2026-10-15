/**
 * 05. Move Zeroes   (LeetCode 283 — Easy)
 *
 * PROBLEM
 * Given an integer array, move all 0s to the end while keeping the relative order of
 * the non-zero elements. Do it in place.
 *
 * EXAMPLES
 * Input: [0, 1, 0, 3, 12]   Output: [1, 3, 12, 0, 0]
 * Input: [0]                Output: [0]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - In place with O(1) extra space? (yes)
 * - Must the order of non-zeros be preserved? (yes -> rules out a partition/swap-from-end approach)
 * - Minimise the number of writes? (follow-up: the swap version only writes when needed)
 *
 * APPROACH 1 — Brute force   O(n) time, O(n) space
 * Copy the non-zeros into a new array, pad with zeros, copy back. Works, but uses O(n) space.
 *
 * APPROACH 2 — Optimal (read / write)   O(n) time, O(1) space
 * Pass 1: compact every non-zero to the front using the read/write pattern.
 * Pass 2: fill from `write` to the end with 0.
 *
 * Variant (fewer writes): swap nums[write] and nums[read] whenever nums[read] != 0.
 * Since write only lags behind read when zeros were skipped, nums[write] is always 0 at
 * the moment of a swap, so the zero "bubbles" forward without a second pass.
 *
 * Dry run on [0, 1, 0, 3, 12] (swap variant):
 *   read=0 0  skip                    write=0
 *   read=1 1  swap(0,1) -> [1,0,0,3,12] write=1
 *   read=2 0  skip
 *   read=3 3  swap(1,3) -> [1,3,0,0,12] write=2
 *   read=4 12 swap(2,4) -> [1,3,12,0,0] write=3
 *
 * EDGE CASES
 * - No zeros -> unchanged
 * - All zeros -> unchanged
 * - Zeros already at the end
 * - Single element
 */

function bruteForce(nums) {
  const nonZeros = nums.filter((x) => x !== 0);
  const zeroCount = nums.length - nonZeros.length;
  const result = [...nonZeros, ...new Array(zeroCount).fill(0)];
  for (let i = 0; i < nums.length; i++) nums[i] = result[i];
  return nums;
}

function optimal(nums) {
  let write = 0; // next slot for a non-zero value
  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== 0) {
      // when write < read, nums[write] is a zero we skipped: swap moves it right
      [nums[write], nums[read]] = [nums[read], nums[write]];
      write++;
    }
  }
  return nums;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([0, 1, 0, 3, 12]), [1, 3, 12, 0, 0]);
  assert.deepStrictEqual(solve([0]), [0]);
  assert.deepStrictEqual(solve([1, 2, 3]), [1, 2, 3]);
  assert.deepStrictEqual(solve([0, 0, 0]), [0, 0, 0]);
  assert.deepStrictEqual(solve([1, 0, 0]), [1, 0, 0]);
  assert.deepStrictEqual(solve([]), []);
  assert.deepStrictEqual(solve([0, 0, 1]), [1, 0, 0]);
  assert.deepStrictEqual(solve([-1, 0, -2]), [-1, -2, 0]);
}
console.log('✓ 05-move-zeroes passed');

module.exports = { optimal, bruteForce };

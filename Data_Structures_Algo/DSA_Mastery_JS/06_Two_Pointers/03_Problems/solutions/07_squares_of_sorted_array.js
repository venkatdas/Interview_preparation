/**
 * 07. Squares of a Sorted Array   (LeetCode 977 — Easy)
 *
 * PROBLEM
 * Given an integer array sorted in non-decreasing order (may contain negatives), return
 * an array of the squares of each number, also sorted in non-decreasing order.
 *
 * EXAMPLES
 * Input: [-4, -1, 0, 3, 10]   Output: [0, 1, 9, 16, 100]
 * Input: [-7, -3, 2, 3, 11]   Output: [4, 9, 9, 49, 121]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Sorted input? (yes; negatives first)
 * - Can I do O(n)? (that's the follow-up; the trivial answer is square-then-sort)
 *
 * APPROACH 1 — Brute force   O(n log n) time, O(n) space
 * Square everything, then sort. Throws away the fact that the input was sorted.
 *
 * APPROACH 2 — Optimal (opposite ends, fill output from the back)   O(n) time, O(n) output
 * Squares are big at BOTH ends (large negatives on the left, large positives on the
 * right) and small in the middle. So the largest square is always at one of the two ends.
 * Compare |nums[left]| and |nums[right]|, write the bigger square at the END of the result,
 * move that pointer inward. Repeat until the pointers cross.
 *
 * Dry run on [-4, -1, 0, 3, 10]:
 *   write=4  |-4|=4 vs |10|=10 -> result[4]=100, right=3
 *   write=3  4 vs 3            -> result[3]=16,  left=1
 *   write=2  1 vs 3            -> result[2]=9,   right=2
 *   write=1  1 vs 0            -> result[1]=1,   left=2
 *   write=0  0 vs 0            -> result[0]=0
 *   [0, 1, 9, 16, 100]
 *
 * EDGE CASES
 * - All negative: [-3, -2, -1] -> [1, 4, 9] (pure reversal)
 * - All positive -> squares in order
 * - Single element, empty
 * - Equal absolute values: [-2, 2] -> [4, 4]
 */

function bruteForce(nums) {
  return nums.map((x) => x * x).sort((a, b) => a - b);
}

function optimal(nums) {
  const result = new Array(nums.length);
  let left = 0;
  let right = nums.length - 1;

  // fill from the back: the biggest square is at one of the ends
  for (let write = nums.length - 1; write >= 0; write--) {
    if (Math.abs(nums[left]) > Math.abs(nums[right])) {
      result[write] = nums[left] * nums[left];
      left++;
    } else {
      result[write] = nums[right] * nums[right];
      right--;
    }
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([-4, -1, 0, 3, 10]), [0, 1, 9, 16, 100]);
  assert.deepStrictEqual(solve([-7, -3, 2, 3, 11]), [4, 9, 9, 49, 121]);
  assert.deepStrictEqual(solve([-3, -2, -1]), [1, 4, 9]);
  assert.deepStrictEqual(solve([1, 2, 3]), [1, 4, 9]);
  assert.deepStrictEqual(solve([-2, 2]), [4, 4]);
  assert.deepStrictEqual(solve([5]), [25]);
  assert.deepStrictEqual(solve([]), []);
}
console.log('✓ 07-squares-of-sorted-array passed');

module.exports = { optimal, bruteForce };

/**
 * 18. Single Element in a Sorted Array   (LeetCode 540 — Medium)
 *
 * PROBLEM
 * A sorted array where every element appears exactly twice, except one element that
 * appears once. Find that element in O(log n) time and O(1) space.
 *
 * EXAMPLES
 * Input: [1,1,2,3,3,4,4,8,8]   Output: 2
 * Input: [3,3,7,7,10,11,11]    Output: 10
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Length is odd (2k + 1), sorted, exactly one single
 * - O(log n) required (XOR of everything is O(n) and a nice warm-up answer)
 *
 * APPROACH 1 — Brute force (XOR)   O(n) time, O(1) space
 * XOR all elements: pairs cancel (a ^ a = 0), leaving the single one. See 14_Bit_Manipulation.
 *
 * APPROACH 2 — Optimal (binary search on index parity)   O(log n) time, O(1) space
 * BEFORE the single element, pairs start at EVEN indices: (0,1), (2,3), ...
 * AFTER it, pairs start at ODD indices: (5,6), (7,8), ...
 * So for an even mid: if nums[mid] === nums[mid + 1], the pair pattern is still intact
 * -> the single is to the RIGHT (left = mid + 2). Otherwise it is at mid or to the left.
 * Force mid to be even (if odd, mid--) so the check is uniform.
 * Loop while left < right; nums[left] is the single.
 *
 * Dry run [1,1,2,3,3,4,4,8,8]:
 *   l=0 r=8 mid=4 (even): nums[4]=3 === nums[5]=4? no  -> r=4
 *   l=0 r=4 mid=2 (even): nums[2]=2 === nums[3]=3? no  -> r=2
 *   l=0 r=2 mid=1 -> make even: 0: nums[0]=1 === nums[1]=1 yes -> l=2
 *   l === r === 2 -> nums[2] = 2
 *
 * EDGE CASES
 * - single element array
 * - single at the very start or very end
 * - negatives
 */

function bruteForce(nums) {
  let result = 0;
  for (const v of nums) result ^= v;
  return result;
}

function optimal(nums) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    let mid = left + ((right - left) >> 1);
    if (mid % 2 === 1) mid--;                        // always inspect an even index
    if (nums[mid] === nums[mid + 1]) left = mid + 2; // pairs intact so far: single is right
    else right = mid;                                // pattern broken: single is mid or left
  }
  return nums[left];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 1, 2, 3, 3, 4, 4, 8, 8]), 2);
  assert.strictEqual(solve([3, 3, 7, 7, 10, 11, 11]), 10);
  assert.strictEqual(solve([5]), 5);
  assert.strictEqual(solve([1, 2, 2]), 1);
  assert.strictEqual(solve([1, 1, 2]), 2);
  assert.strictEqual(solve([-3, -3, -1, 0, 0]), -1);
  assert.strictEqual(solve([1, 1, 2, 2, 3, 3, 4]), 4);
}
for (let trial = 0; trial < 300; trial++) {
  const pairs = Math.floor(Math.random() * 8);
  const values = Array.from({ length: pairs + 1 }, (_, i) => i * 2 - 5);
  const single = values[Math.floor(Math.random() * values.length)];
  const nums = values.flatMap((v) => (v === single ? [v] : [v, v]));
  assert.strictEqual(optimal(nums), single, JSON.stringify(nums));
}
console.log('✓ 18-single-element-sorted-array passed');

module.exports = { optimal, bruteForce };

/**
 * 04. Product of Array Except Self   (LeetCode 238 — Medium)
 *
 * PROBLEM
 * Given an integer array nums, return an array answer where answer[i] is the product of
 * all elements except nums[i]. Must run in O(n) and must NOT use division.
 *
 * EXAMPLES
 * Input: [1, 2, 3, 4]       Output: [24, 12, 8, 6]
 * Input: [-1, 1, 0, -3, 3]  Output: [0, 0, 9, 0, 0]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - No division? (yes; division also breaks on zeros)
 * - O(1) extra space (output doesn't count)? (follow-up: yes with the two-pass trick)
 * - At least 2 elements? (yes)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) extra space
 * For each i, multiply every other element.
 *
 * APPROACH 2 — Optimal (prefix product × suffix product)   O(n) time, O(1) extra space
 * answer[i] = (product of everything LEFT of i) * (product of everything RIGHT of i).
 *   Pass 1 (left to right): answer[i] = product of nums[0..i-1]  (a prefix product)
 *   Pass 2 (right to left): keep a running suffix product and multiply it in.
 * The output array holds the prefix products, so we need no extra arrays.
 *
 * Dry run on [1, 2, 3, 4]:
 *   pass 1: left=1 -> answer[0]=1, left=1
 *                      answer[1]=1, left=2
 *                      answer[2]=2, left=6
 *                      answer[3]=6, left=24      answer = [1, 1, 2, 6]
 *   pass 2: right=1 -> answer[3]=6*1=6,  right=4
 *                      answer[2]=2*4=8,  right=12
 *                      answer[1]=1*12=12, right=24
 *                      answer[0]=1*24=24           answer = [24, 12, 8, 6]
 *
 * EDGE CASES
 * - One zero -> every other slot is 0, the zero's slot is the product of the rest
 * - Two zeros -> all zeros
 * - Negatives
 * - Exactly two elements -> swapped
 */

function bruteForce(nums) {
  const answer = new Array(nums.length);
  for (let i = 0; i < nums.length; i++) {
    let product = 1;
    for (let j = 0; j < nums.length; j++) if (j !== i) product *= nums[j];
    answer[i] = product;
  }
  return answer;
}

function optimal(nums) {
  const n = nums.length;
  const answer = new Array(n).fill(1);

  // pass 1: answer[i] = product of all elements to the LEFT of i
  let leftProduct = 1;
  for (let i = 0; i < n; i++) {
    answer[i] = leftProduct;
    leftProduct *= nums[i];
  }

  // pass 2: multiply in the product of all elements to the RIGHT of i
  let rightProduct = 1;
  for (let i = n - 1; i >= 0; i--) {
    answer[i] *= rightProduct;
    rightProduct *= nums[i];
  }
  return answer;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([1, 2, 3, 4]), [24, 12, 8, 6]);
  // normalise -0 to 0 (x + 0) because deepStrictEqual treats -0 and 0 as different
  assert.deepStrictEqual(solve([-1, 1, 0, -3, 3]).map((x) => x + 0), [0, 0, 9, 0, 0]);
  assert.deepStrictEqual(solve([2, 3]), [3, 2]);
  assert.deepStrictEqual(solve([0, 0, 5]), [0, 0, 0]);
  assert.deepStrictEqual(solve([1, 1, 1]), [1, 1, 1]);
  assert.deepStrictEqual(solve([-2, -3, 4]), [-12, -8, 6]);
}
console.log('✓ 04-product-of-array-except-self passed');

module.exports = { optimal, bruteForce };

/**
 * 08. Product of Array Except Self   (LeetCode 238 — Medium)
 *
 * PROBLEM
 * Given an integer array nums, return an array answer where answer[i] is the product
 * of all elements EXCEPT nums[i]. You must not use division, and it must run in O(n).
 *
 * EXAMPLES
 * Input: [1, 2, 3, 4]       Output: [24, 12, 8, 6]
 * Input: [-1, 1, 0, -3, 3]  Output: [0, 0, 9, 0, 0]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can I use division? (no - and division breaks on zeros anyway)
 * - Can there be zeros? (yes; one zero -> only that slot is non-zero, two zeros -> all zeros)
 * - Does the product fit in a 32-bit int? (assume yes)
 * - Does the output array count as extra space? (no, the follow-up asks for O(1) extra beyond it)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) extra space
 * For each i, multiply every other element. Simple but quadratic.
 *
 * APPROACH 2 — Optimal (prefix and suffix products)   O(n) time, O(1) extra space
 * answer[i] = (product of everything LEFT of i) * (product of everything RIGHT of i).
 *   Pass 1, left to right: write the running prefix product into answer[i] BEFORE
 *           multiplying nums[i] in, so answer[i] = product of nums[0..i-1].
 *   Pass 2, right to left: keep a running suffix product and multiply it into answer[i]
 *           BEFORE multiplying nums[i] in.
 * Using the output array for the prefixes means no extra arrays.
 *
 * Dry run on [1, 2, 3, 4]:
 *   pass 1 (prefix): prefix=1 -> ans[0]=1, prefix=1
 *                    ans[1]=1, prefix=2
 *                    ans[2]=2, prefix=6
 *                    ans[3]=6, prefix=24          ans = [1, 1, 2, 6]
 *   pass 2 (suffix): suffix=1 -> ans[3]=6*1=6,  suffix=4
 *                    ans[2]=2*4=8,   suffix=12
 *                    ans[1]=1*12=12, suffix=24
 *                    ans[0]=1*24=24               ans = [24, 12, 8, 6]
 *
 * EDGE CASES
 * - JS gotcha: a negative times 0 gives -0, and strict equality tools (assert.deepStrictEqual,
 *   Object.is) treat -0 and 0 as different. Adding 0 (`x + 0`) normalizes -0 to 0.
 * - One zero: [1, 0, 3] -> [0, 3, 0]
 * - Two zeros -> all zeros
 * - Negative numbers
 * - Two elements: [a, b] -> [b, a]
 */

function bruteForce(nums) {
  const result = [];
  for (let i = 0; i < nums.length; i++) {
    let product = 1;
    for (let j = 0; j < nums.length; j++) {
      if (j !== i) product *= nums[j];
    }
    result.push(product + 0); // + 0 turns -0 (from negative * 0) into 0
  }
  return result;
}

function optimal(nums) {
  const n = nums.length;
  const result = new Array(n).fill(1);

  let prefix = 1; // product of all elements to the LEFT of i
  for (let i = 0; i < n; i++) {
    result[i] = prefix;
    prefix *= nums[i];
  }

  let suffix = 1; // product of all elements to the RIGHT of i
  for (let i = n - 1; i >= 0; i--) {
    result[i] = result[i] * suffix + 0; // + 0 normalizes -0 to 0
    suffix *= nums[i];
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([1, 2, 3, 4]), [24, 12, 8, 6]);
  assert.deepStrictEqual(solve([-1, 1, 0, -3, 3]), [0, 0, 9, 0, 0]);
  assert.deepStrictEqual(solve([1, 0, 3]), [0, 3, 0]);
  assert.deepStrictEqual(solve([0, 0, 2]), [0, 0, 0]);
  assert.deepStrictEqual(solve([2, 5]), [5, 2]);
  assert.deepStrictEqual(solve([-2, -3, 4]), [-12, -8, 6]);
  assert.deepStrictEqual(solve([]), []);
}
console.log('✓ 08-product-of-array-except-self passed');

module.exports = { optimal, bruteForce };

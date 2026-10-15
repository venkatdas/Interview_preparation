/**
 * 14. Maximum Product Subarray   (LeetCode 152 — Medium)
 *
 * PROBLEM
 * Given an integer array, find the contiguous subarray (at least one element) with
 * the largest PRODUCT and return that product.
 *
 * EXAMPLES
 * Input: [2, 3, -2, 4]   Output: 6    Explanation: [2, 3]
 * Input: [-2, 0, -1]     Output: 0    Explanation: [-2, -1] is not contiguous, best is [0]
 * Input: [-2, 3, -4]     Output: 24   Explanation: two negatives make a positive
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can there be zeros and negatives? (yes - both are the whole difficulty)
 * - Does the product fit in a 32-bit int? (assume yes)
 * - At least one element? (yes)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * For every start index, extend the end index multiplying as you go; track the max.
 *
 * APPROACH 2 — Optimal (Kadane with max AND min)   O(n) time, O(1) space
 * Plain Kadane fails because a negative number flips sign: the SMALLEST product so far
 * times a negative becomes the LARGEST. So at each index track both:
 *   curMax = max(num, curMax * num, curMin * num)
 *   curMin = min(num, curMax * num, curMin * num)   (use the OLD curMax)
 * A zero resets both to 0 and then to num on the next step, which handles zeros for free.
 *
 * Dry run on [2, 3, -2, 4]:
 *   num 2:  curMax=2   curMin=2    best=2
 *   num 3:  curMax=6   curMin=3    best=6
 *   num -2: candidates -2, 6*-2=-12, 3*-2=-6 -> curMax=-2 curMin=-12   best=6
 *   num 4:  candidates 4, -8, -48            -> curMax=4  curMin=-48   best=6  -> 6
 *
 * Dry run on [-2, 3, -4]:
 *   num -2: curMax=-2  curMin=-2   best=-2
 *   num 3:  curMax=3   curMin=-6   best=3
 *   num -4: candidates -4, -12, 24 -> curMax=24 curMin=-12  best=24   -> 24
 *
 * EDGE CASES
 * - Single negative element -> that element
 * - Zero in the middle splits the array: [-2, 0, -1] -> 0
 * - Odd number of negatives: the answer skips one end negative
 * - All negatives, even count -> whole product
 */

function bruteForce(nums) {
  if (nums.length === 0) return 0;
  let best = -Infinity;
  for (let start = 0; start < nums.length; start++) {
    let product = 1;
    for (let end = start; end < nums.length; end++) {
      product *= nums[end];
      best = Math.max(best, product);
    }
  }
  return best;
}

function optimal(nums) {
  if (nums.length === 0) return 0;
  let currentMax = nums[0];
  let currentMin = nums[0]; // needed because a negative can turn the min into the new max
  let best = nums[0];

  for (let i = 1; i < nums.length; i++) {
    const num = nums[i];
    const candidates = [num, currentMax * num, currentMin * num]; // compute with OLD values
    currentMax = Math.max(...candidates);
    currentMin = Math.min(...candidates);
    best = Math.max(best, currentMax);
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([2, 3, -2, 4]), 6);
  assert.strictEqual(solve([-2, 0, -1]), 0);
  assert.strictEqual(solve([-2, 3, -4]), 24);
  assert.strictEqual(solve([-3]), -3);
  assert.strictEqual(solve([0, 2]), 2);
  assert.strictEqual(solve([-1, -2, -3]), 6);
  assert.strictEqual(solve([2, -5, -2, -4, 3]), 24);
  assert.strictEqual(solve([]), 0);
}
console.log('✓ 14-maximum-product-subarray passed');

module.exports = { optimal, bruteForce };

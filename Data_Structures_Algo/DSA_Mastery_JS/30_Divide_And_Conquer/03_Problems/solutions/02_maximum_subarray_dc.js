/**
 * 02. Maximum Subarray, divide & conquer version   (LeetCode 53 — Medium)
 *
 * PROBLEM
 * Find the contiguous subarray (at least one element) with the largest sum; return the sum.
 *
 * EXAMPLES
 * Input: [-2,1,-3,4,-1,2,1,-5,4]   Output: 6   ([4,-1,2,1])
 * Input: [1]                       Output: 1
 * Input: [5,4,-1,7,8]              Output: 23
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - At least one element; all-negative arrays return the largest single element
 * - The follow-up on LeetCode literally says "try the divide and conquer approach"
 * - Kadane's O(n) one-pass is the usual answer (../../41_Advanced_Algorithm_Design/01_Classic_Techniques/); D&C is the
 *   recursion-pattern exercise
 *
 * APPROACH 1 — Brute force   O(n^2) time
 * For every start, extend the end with a running sum and track the max.
 *
 * APPROACH 2 — Optimal (Divide & conquer)   O(n log n) time, O(log n) stack space
 * Split at mid. The best subarray is
 *   (a) entirely in the left half  -> recurse
 *   (b) entirely in the right half -> recurse
 *   (c) crossing mid               -> best suffix ending at mid + best prefix starting at mid+1
 * (c) is O(n) per level, log n levels -> T(n) = 2T(n/2) + O(n) = O(n log n) (master theorem, case 2).
 *
 * Dry run on [-2,1,-3,4]:
 *   split: left [-2,1], right [-3,4]
 *   left: split [-2] | [1]: best 1; crossing: -2 + 1 = -1 -> left = 1
 *   right: split [-3] | [4]: best 4; crossing: -3 + 4 = 1 -> right = 4
 *   crossing at top: best suffix of [-2,1] = 1, best prefix of [-3,4] = 1 -> 2
 *   answer max(1, 4, 2) = 4
 *
 * EDGE CASES
 * - single element
 * - all negative -> max element
 * - all positive -> whole array
 */

function bruteForce(nums) {
  let best = -Infinity;
  for (let i = 0; i < nums.length; i++) {
    let sum = 0;
    for (let j = i; j < nums.length; j++) {
      sum += nums[j];
      best = Math.max(best, sum);
    }
  }
  return best;
}

function optimal(nums) {
  function solve(lo, hi) {
    if (lo === hi) return nums[lo];
    const mid = (lo + hi) >> 1;
    const left = solve(lo, mid);
    const right = solve(mid + 1, hi);

    let bestSuffix = -Infinity;
    let sum = 0;
    for (let i = mid; i >= lo; i--) {
      sum += nums[i];
      bestSuffix = Math.max(bestSuffix, sum);
    }
    let bestPrefix = -Infinity;
    sum = 0;
    for (let i = mid + 1; i <= hi; i++) {
      sum += nums[i];
      bestPrefix = Math.max(bestPrefix, sum);
    }
    return Math.max(left, right, bestSuffix + bestPrefix);
  }
  return solve(0, nums.length - 1);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([-2, 1, -3, 4, -1, 2, 1, -5, 4]), 6);
  assert.strictEqual(solve([1]), 1);
  assert.strictEqual(solve([5, 4, -1, 7, 8]), 23);
  assert.strictEqual(solve([-3, -1, -2]), -1);
  assert.strictEqual(solve([-2, 1, -3, 4]), 4);
  assert.strictEqual(solve([0, 0, 0]), 0);
}
for (let trial = 0; trial < 300; trial++) {
  const n = 1 + Math.floor(Math.random() * 15);
  const nums = Array.from({ length: n }, () => Math.floor(Math.random() * 21) - 10);
  assert.strictEqual(optimal(nums), bruteForce(nums));
}
console.log('✓ 02-maximum-subarray-dc passed');

module.exports = { optimal, bruteForce };

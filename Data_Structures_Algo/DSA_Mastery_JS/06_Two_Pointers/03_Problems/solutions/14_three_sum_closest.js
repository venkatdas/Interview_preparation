/**
 * 14. 3Sum Closest   (LeetCode 16 — Medium)
 *
 * PROBLEM
 * Given an integer array nums and an integer target, find three integers whose sum is
 * closest to target. Return that sum. Exactly one answer is guaranteed.
 *
 * EXAMPLES
 * Input: nums = [-1, 2, 1, -4], target = 1   Output: 2   Explanation: -1 + 2 + 1 = 2
 * Input: nums = [0, 0, 0], target = 1        Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - At least 3 numbers? (yes)
 * - Return the sum, not the triplet? (sum)
 * - Ties? ("exactly one solution" means no two sums are equally close)
 *
 * APPROACH 1 — Brute force   O(n^3) time, O(1) space
 * Try every triplet, track the sum with the smallest |sum - target|.
 *
 * APPROACH 2 — Optimal (sort + fix one + two pointers)   O(n^2) time, O(1) extra space
 * Same skeleton as 3Sum. For each fixed i, move left/right on the rest:
 *   - compute sum; if |sum - target| beats the best so far, record it.
 *   - sum < target -> we need a bigger sum -> left++
 *   - sum > target -> right--
 *   - sum == target -> can't do better than distance 0, return immediately.
 * Why no answer is skipped: when sum < target, pairing nums[left] with anything
 * left of `right` gives an even smaller sum, i.e. farther from target. So nums[left]
 * is done for this i.
 *
 * Dry run on sorted [-4, -1, 1, 2], target 1:
 *   i=0 (-4): L=1(-1) R=3(2): sum -3, dist 4, best -3; -3 < 1 -> L=2
 *             L=2(1) R=3(2): sum -1, dist 2, best -1; -1 < 1 -> L=3 stop
 *   i=1 (-1): L=2(1) R=3(2): sum 2, dist 1, best 2; 2 > 1 -> R=2 stop
 *   i=2: fewer than 2 elements remain -> done. answer 2
 *
 * EDGE CASES
 * - Exactly 3 numbers -> their sum
 * - Target far outside the range (e.g. 100) -> the 3 largest
 * - Negative target
 * - Exact match -> early return
 */

function bruteForce(nums, target) {
  let best = Infinity;
  for (let i = 0; i < nums.length; i++)
    for (let j = i + 1; j < nums.length; j++)
      for (let k = j + 1; k < nums.length; k++) {
        const sum = nums[i] + nums[j] + nums[k];
        if (Math.abs(sum - target) < Math.abs(best - target)) best = sum;
      }
  return best;
}

function optimal(nums, target) {
  const sorted = [...nums].sort((a, b) => a - b);
  let best = sorted[0] + sorted[1] + sorted[2];

  for (let i = 0; i < sorted.length - 2; i++) {
    let left = i + 1;
    let right = sorted.length - 1;

    while (left < right) {
      const sum = sorted[i] + sorted[left] + sorted[right];
      if (sum === target) return sum; // distance 0 is unbeatable

      if (Math.abs(sum - target) < Math.abs(best - target)) best = sum;

      if (sum < target) left++;
      else right--;
    }
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([-1, 2, 1, -4], 1), 2);
  assert.strictEqual(solve([0, 0, 0], 1), 0);
  assert.strictEqual(solve([1, 1, 1, 0], -100), 2);
  assert.strictEqual(solve([1, 2, 3], 100), 6);
  assert.strictEqual(solve([-5, -3, -1, 2], -9), -9);
  assert.strictEqual(solve([4, 0, 5, -5], 1), 0);
}
console.log('✓ 14-three-sum-closest passed');

module.exports = { optimal, bruteForce };

/**
 * 05. Minimum Size Subarray Sum   (LeetCode 209 — Medium)
 *
 * PROBLEM
 * Given an array of POSITIVE integers nums and an integer target, return the minimal
 * length of a contiguous subarray whose sum is >= target. Return 0 if none exists.
 *
 * EXAMPLES
 * Input: target = 7, nums = [2, 3, 1, 2, 4, 3]   Output: 2   Explanation: [4, 3]
 * Input: target = 4, nums = [1, 4, 4]            Output: 1
 * Input: target = 11, nums = [1, 1, 1, 1, 1]     Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - All positive? (YES, essential: that makes "sum >= target" monotonic in window size)
 * - "At least target", not "equal to"? (at least)
 * - Follow-up: O(n log n) with prefix sums + binary search exists, but O(n) window is better here
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * For every start, extend until the running sum reaches target; record the length.
 *
 * APPROACH 2 — Optimal (variable window, "shortest valid")   O(n) time, O(1) space
 *   expand: windowSum += nums[right]
 *   while windowSum >= target:            (valid -> record, then try a smaller window)
 *     best = min(best, right - left + 1)
 *     windowSum -= nums[left]; left++
 * Because numbers are positive, removing from the left always decreases the sum, so
 * once the window is invalid we must expand again. left never moves backward -> O(n).
 *
 * Dry run on target 7, [2, 3, 1, 2, 4, 3]:
 *   r=0 sum 2            r=1 sum 5            r=2 sum 6        (all < 7, keep expanding)
 *   r=3 sum 8  >= 7 -> window [0..3] len 4, best 4; drop 2 -> sum 6, left=1
 *   r=4 sum 10 >= 7 -> window [1..4] len 4;         drop 3 -> sum 7, left=2
 *              7 >= 7 -> window [2..4] len 3, best 3; drop 1 -> sum 6, left=3
 *   r=5 sum 9  >= 7 -> window [3..5] len 3;         drop 2 -> sum 7, left=4
 *              7 >= 7 -> window [4..5] len 2, best 2; drop 4 -> sum 3, left=5
 *   best 2
 *
 * EDGE CASES
 * - No subarray reaches target -> 0
 * - A single element >= target -> 1
 * - Whole array needed -> n
 * - Empty -> 0
 */

function bruteForce(nums, target) {
  let best = Infinity;
  for (let start = 0; start < nums.length; start++) {
    let sum = 0;
    for (let end = start; end < nums.length; end++) {
      sum += nums[end];
      if (sum >= target) {
        best = Math.min(best, end - start + 1);
        break; // longer windows from this start can't be shorter
      }
    }
  }
  return best === Infinity ? 0 : best;
}

function optimal(nums, target) {
  let left = 0;
  let windowSum = 0;
  let best = Infinity;

  for (let right = 0; right < nums.length; right++) {
    windowSum += nums[right];
    // window is valid: record it, then shrink to look for a shorter one
    while (windowSum >= target) {
      best = Math.min(best, right - left + 1);
      windowSum -= nums[left];
      left++;
    }
  }
  return best === Infinity ? 0 : best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([2, 3, 1, 2, 4, 3], 7), 2);
  assert.strictEqual(solve([1, 4, 4], 4), 1);
  assert.strictEqual(solve([1, 1, 1, 1, 1], 11), 0);
  assert.strictEqual(solve([1, 2, 3, 4, 5], 15), 5);
  assert.strictEqual(solve([], 1), 0);
  assert.strictEqual(solve([10], 7), 1);
  assert.strictEqual(solve([1, 2, 3, 4, 5], 11), 3);
}
console.log('✓ 05-minimum-size-subarray-sum passed');

module.exports = { optimal, bruteForce };

/**
 * 02. Maximum Sum Subarray of Size K   (classic, not on LeetCode by this name — Easy)
 *
 * PROBLEM
 * Given an array of positive integers and a number k, return the maximum sum of any
 * contiguous subarray of size k. Also return the start index of that subarray.
 *
 * EXAMPLES
 * Input: nums = [2, 1, 5, 1, 3, 2], k = 3   Output: { sum: 9, start: 2 }   Explanation: [5, 1, 3]
 * Input: nums = [2, 3, 4, 1, 5], k = 2      Output: { sum: 7, start: 1 }   Explanation: [3, 4]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - k > nums.length? (return sum 0 / start -1; clarify)
 * - Positive only? (doesn't matter for a fixed window)
 * - If several windows tie, which start? (the first one)
 *
 * APPROACH 1 — Brute force   O(n * k) time, O(1) space
 * For every start, add up k elements.
 *
 * APPROACH 2 — Optimal (fixed window)   O(n) time, O(1) space
 * Same slide as problem 01, but written in the single-loop form that many people prefer:
 *   for right in 0..n-1:
 *     windowSum += nums[right]
 *     if right >= k - 1:                       (window is full)
 *       compare windowSum to best (start = right - k + 1)
 *       windowSum -= nums[right - k + 1]       (drop the leftmost before the next step)
 *
 * Dry run on [2, 1, 5, 1, 3, 2], k = 3:
 *   right=0 sum 2        | right=1 sum 3 | right=2 sum 8 full, best 8 (start 0), drop 2 -> 6
 *   right=3 sum 7 full, best 8, drop 1 -> 6
 *   right=4 sum 9 full, best 9 (start 2), drop 5 -> 4
 *   right=5 sum 6 full, best 9, drop 1 -> 5
 *   { sum: 9, start: 2 }
 *
 * EDGE CASES
 * - k === nums.length -> whole array, start 0
 * - k > nums.length -> no window
 * - k = 1 -> max element and its index
 */

function bruteForce(nums, k) {
  if (k > nums.length || k === 0) return { sum: 0, start: -1 };
  let best = { sum: -Infinity, start: -1 };
  for (let start = 0; start + k <= nums.length; start++) {
    let sum = 0;
    for (let i = start; i < start + k; i++) sum += nums[i];
    if (sum > best.sum) best = { sum, start };
  }
  return best;
}

function optimal(nums, k) {
  if (k > nums.length || k === 0) return { sum: 0, start: -1 };
  let windowSum = 0;
  let best = { sum: -Infinity, start: -1 };

  for (let right = 0; right < nums.length; right++) {
    windowSum += nums[right];
    if (right >= k - 1) {
      const start = right - k + 1;
      if (windowSum > best.sum) best = { sum: windowSum, start };
      windowSum -= nums[start]; // leftmost element leaves before the next slide
    }
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([2, 1, 5, 1, 3, 2], 3), { sum: 9, start: 2 });
  assert.deepStrictEqual(solve([2, 3, 4, 1, 5], 2), { sum: 7, start: 1 });
  assert.deepStrictEqual(solve([1, 2, 3], 3), { sum: 6, start: 0 });
  assert.deepStrictEqual(solve([1, 2], 3), { sum: 0, start: -1 });
  assert.deepStrictEqual(solve([4, 9, 1], 1), { sum: 9, start: 1 });
  assert.deepStrictEqual(solve([5, 5, 5, 5], 2), { sum: 10, start: 0 }); // first tie wins
  assert.deepStrictEqual(solve([], 1), { sum: 0, start: -1 });
}
console.log('✓ 02-max-sum-subarray-size-k passed');

module.exports = { optimal, bruteForce };

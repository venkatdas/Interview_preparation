/**
 * 02. Search Insert Position   (LeetCode 35 — Easy)
 *
 * PROBLEM
 * Given a sorted array of distinct integers and a target, return the index if the
 * target is found. If not, return the index where it would be inserted to keep the
 * array sorted. O(log n) required.
 *
 * EXAMPLES
 * Input: [1,3,5,6], 5   Output: 2
 * Input: [1,3,5,6], 2   Output: 1
 * Input: [1,3,5,6], 7   Output: 4   (append at the end)
 * Input: [1,3,5,6], 0   Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Distinct values? (yes; with duplicates "lower bound" = insert before the equal run)
 * - Can the answer be n (past the end)? (yes)
 *
 * APPROACH 1 — Brute force   O(n) time
 * Scan from the left; return the first index whose value is >= target, or n.
 *
 * APPROACH 2 — Optimal (lower bound, Template 2)   O(log n) time, O(1) space
 * This IS lowerBound: the first index i with nums[i] >= target. Use the half-open
 * range [left, right) with right = n so n is a valid answer. If nums[mid] < target
 * the answer is right of mid; otherwise mid could be the answer, so keep it (right = mid).
 *
 * Dry run [1,3,5,6], target 2:
 *   left=0 right=4 mid=2 nums[2]=5 >= 2 -> right=2
 *   left=0 right=2 mid=1 nums[1]=3 >= 2 -> right=1
 *   left=0 right=1 mid=0 nums[0]=1 < 2  -> left=1
 *   left === right === 1 -> return 1
 *
 * EDGE CASES
 * - [] -> 0
 * - target smaller than all -> 0; larger than all -> n
 * - exact match returns its index
 */

function bruteForce(nums, target) {
  for (let i = 0; i < nums.length; i++) if (nums[i] >= target) return i;
  return nums.length;
}

function optimal(nums, target) {
  let left = 0, right = nums.length;         // half-open [left, right)
  while (left < right) {
    const mid = left + ((right - left) >> 1);
    if (nums[mid] < target) left = mid + 1;  // mid is too small
    else right = mid;                        // mid is a candidate (>= target)
  }
  return left;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 3, 5, 6], 5), 2);
  assert.strictEqual(solve([1, 3, 5, 6], 2), 1);
  assert.strictEqual(solve([1, 3, 5, 6], 7), 4);
  assert.strictEqual(solve([1, 3, 5, 6], 0), 0);
  assert.strictEqual(solve([], 3), 0);
  assert.strictEqual(solve([1], 1), 0);
  assert.strictEqual(solve([1], 2), 1);
  assert.strictEqual(solve([-5, -2, 0], -3), 1);
}
console.log('✓ 02-search-insert-position passed');

module.exports = { optimal, bruteForce };

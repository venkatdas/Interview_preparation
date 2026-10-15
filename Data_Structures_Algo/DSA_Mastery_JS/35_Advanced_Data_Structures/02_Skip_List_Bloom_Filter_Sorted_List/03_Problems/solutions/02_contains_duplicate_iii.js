/**
 * 02. Contains Duplicate III   (LeetCode 220 — Hard)
 *
 * PROBLEM
 * Given nums and two integers indexDiff (k) and valueDiff (t), return true if there are
 * indices i != j with |i - j| <= k and |nums[i] - nums[j]| <= t.
 *
 * EXAMPLES
 * Input: nums = [1,2,3,1], k = 3, t = 0   Output: true   (1 at index 0 and 3)
 * Input: nums = [1,5,9,1,5,9], k = 2, t = 3   Output: false
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - k >= 1, t >= 0; n up to 10^5 -> O(n k) is too slow for big k
 * - Values up to +-10^9: differences fit in doubles exactly
 *
 * APPROACH 1 — Brute force   O(n * k) time
 * For each i check the next k indices.
 *
 * APPROACH 2 — Optimal (Sliding window kept in a sorted structure)   O(n log k) time, O(k) space
 * Keep the last k values in a SortedList (TreeSet substitute). For nums[i], the closest
 * candidate is ceiling(nums[i] - t): the smallest stored value >= nums[i] - t. If it exists
 * and is <= nums[i] + t we found a pair. Then add nums[i] and, once the window has more
 * than k values, remove nums[i - k].
 * (Bucket approach: bucket id = floor(x / (t + 1)); same or adjacent buckets -> O(n).)
 *
 * Dry run: nums = [1,5,9,1,5,9], k = 2, t = 3
 *   i=0: window {} -> add 1                 {1}
 *   i=1: ceiling(5-3=2) = none -> add 5     {1,5}
 *   i=2: ceiling(6) = none -> add 9; size 3 > 2 -> remove nums[0]=1   {5,9}
 *   i=3: ceiling(-2) = 5, 5 <= 1+3=4? no -> add 1; remove 5   {1,9}
 *   i=4: ceiling(2) = 9, 9 <= 8? no -> add 5; remove 9       {1,5}
 *   i=5: ceiling(6) = none -> false
 *
 * EDGE CASES
 * - t = 0 -> plain "duplicate within k"
 * - k >= n -> whole array
 * - negative numbers
 * - single element -> false
 */

const { SortedList } = require('../../02_Implementations/sorted_list');

function bruteForce(nums, k, t) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j <= i + k && j < nums.length; j++) {
      if (Math.abs(nums[i] - nums[j]) <= t) return true;
    }
  }
  return false;
}

function optimal(nums, k, t) {
  const window = new SortedList();
  for (let i = 0; i < nums.length; i++) {
    const candidate = window.ceiling(nums[i] - t);     // smallest value >= nums[i] - t
    if (candidate !== undefined && candidate <= nums[i] + t) return true;
    window.add(nums[i]);
    if (window.size > k) window.remove(nums[i - k]);   // keep only the last k values
  }
  return false;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 2, 3, 1], 3, 0), true);
  assert.strictEqual(solve([1, 5, 9, 1, 5, 9], 2, 3), false);
  assert.strictEqual(solve([1, 0, 1, 1], 1, 2), true);
  assert.strictEqual(solve([7], 1, 0), false);
  assert.strictEqual(solve([-3, 3], 1, 6), true);
  assert.strictEqual(solve([1, 2], 0, 0), false);
  assert.strictEqual(solve([10, 100, 11], 2, 1), true);
}
for (let trial = 0; trial < 300; trial++) {
  const n = 1 + Math.floor(Math.random() * 12);
  const nums = Array.from({ length: n }, () => Math.floor(Math.random() * 30) - 15);
  const k = 1 + Math.floor(Math.random() * n);
  const t = Math.floor(Math.random() * 5);
  assert.strictEqual(optimal(nums, k, t), bruteForce(nums, k, t));
}
console.log('✓ 02-contains-duplicate-iii passed');

module.exports = { optimal, bruteForce };

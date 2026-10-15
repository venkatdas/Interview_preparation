/**
 * 11. Subarray Sum Equals K   (LeetCode 560 — Medium)
 *
 * PROBLEM
 * Given an integer array nums and an integer k, return the number of contiguous
 * subarrays whose elements sum to k.
 *
 * EXAMPLES
 * Input: nums = [1, 1, 1], k = 2      Output: 2   Explanation: [1,1] at 0-1 and at 1-2
 * Input: nums = [1, 2, 3], k = 3      Output: 2   Explanation: [1,2] and [3]
 * Input: nums = [1, -1, 0], k = 0     Output: 3   Explanation: [1,-1], [0], [1,-1,0]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Negative numbers? (yes -> sliding window does NOT work, because adding an element
 *   can make the sum go down. That is exactly why we need prefix sums + hashing.)
 * - Count subarrays, or return them? (count)
 * - Can k be 0 or negative? (yes)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * For every start index, extend the end index and keep a running sum; count when it
 * equals k. (The O(n^3) version recomputes the sum each time; don't do that.)
 *
 * APPROACH 2 — Optimal (prefix sum + hash map)   O(n) time, O(n) space
 * Let prefix[i] = sum of nums[0..i]. The sum of nums[j+1..i] is prefix[i] - prefix[j].
 * We want prefix[i] - prefix[j] === k, i.e. prefix[j] === prefix[i] - k.
 * So while walking, keep a map: prefixSum -> how many times it has occurred so far.
 * At each i, add map.get(runningSum - k) to the answer, then record runningSum.
 * Seed the map with {0: 1} for the empty prefix (so subarrays starting at index 0 count).
 *
 * Dry run on [1, 2, 3], k = 3:
 *   map = {0:1}, sum = 0, count = 0
 *   1: sum=1, need 1-3=-2 (0 times), map {0:1, 1:1}
 *   2: sum=3, need 0 -> 1 time, count=1, map {0:1, 1:1, 3:1}
 *   3: sum=6, need 3 -> 1 time, count=2, map {..., 6:1}
 *   answer 2
 *
 * EDGE CASES
 * - k = 0 with zeros/negatives: [0, 0] -> 3 ([0], [0], [0,0])
 * - Single element equal to k -> 1
 * - Empty -> 0
 * - Whole array sums to k (needs the {0:1} seed)
 */

function bruteForce(nums, k) {
  let count = 0;
  for (let start = 0; start < nums.length; start++) {
    let sum = 0;
    for (let end = start; end < nums.length; end++) {
      sum += nums[end];
      if (sum === k) count++;
    }
  }
  return count;
}

function optimal(nums, k) {
  const prefixCount = new Map([[0, 1]]); // empty prefix has sum 0, seen once
  let runningSum = 0;
  let count = 0;

  for (const num of nums) {
    runningSum += num;
    // every earlier prefix equal to (runningSum - k) closes a subarray with sum k
    count += prefixCount.get(runningSum - k) ?? 0;
    prefixCount.set(runningSum, (prefixCount.get(runningSum) ?? 0) + 1);
  }
  return count;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 1, 1], 2), 2);
  assert.strictEqual(solve([1, 2, 3], 3), 2);
  assert.strictEqual(solve([1, -1, 0], 0), 3);
  assert.strictEqual(solve([0, 0], 0), 3);
  assert.strictEqual(solve([5], 5), 1);
  assert.strictEqual(solve([], 0), 0);
  assert.strictEqual(solve([3, 4, 7, 2, -3, 1, 4, 2], 7), 4);
  assert.strictEqual(solve([1, 2, 3], 6), 1);
}
console.log('✓ 11-subarray-sum-equals-k passed');

module.exports = { optimal, bruteForce };

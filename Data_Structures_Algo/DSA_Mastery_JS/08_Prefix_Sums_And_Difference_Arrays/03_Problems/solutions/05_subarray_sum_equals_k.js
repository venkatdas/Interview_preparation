/**
 * 05. Subarray Sum Equals K   (LeetCode 560 — Medium)
 *
 * PROBLEM
 * Given an integer array nums and an integer k, return the number of contiguous
 * subarrays whose sum equals k.
 *
 * EXAMPLES
 * Input: nums = [1, 1, 1], k = 2       Output: 2
 * Input: nums = [1, 2, 3], k = 3       Output: 2   Explanation: [1,2] and [3]
 * Input: nums = [1, -1, 1, -1], k = 0  Output: 4   Explanation: [1,-1] x2, [-1,1], [1,-1,1,-1]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Negatives? (yes -> sliding window is out; prefix sums are in)
 * - Count, not the subarrays themselves? (count)
 * - k may be 0 or negative? (yes)
 *
 * APPROACH 1 — Brute force (with a prefix array)   O(n^2) time, O(n) space
 * Build prefix[]. For every pair (j < i), check prefix[i] - prefix[j] === k.
 * Already uses prefix sums to make each check O(1); the pairs are the problem.
 *
 * APPROACH 2 — Optimal (prefix sum + hash map of counts)   O(n) time, O(n) space
 * The prefix-sum view: subarray (j, i] has sum prefix[i] - prefix[j]. For a fixed i we
 * want the NUMBER of earlier j with prefix[j] === prefix[i] - k. A map
 * prefixValue -> count answers that in O(1). We never need the prefix array itself,
 * just the running value and the map. Seed with {0: 1} for the empty prefix.
 *
 * Dry run on [1, -1, 1, -1], k = 0:
 *   map {0:1}, running 0, count 0
 *   +1 -> running 1,  need 1  -> 0;           map {0:1, 1:1}
 *   -1 -> running 0,  need 0  -> 1 (count 1); map {0:2, 1:1}
 *   +1 -> running 1,  need 1  -> 1 (count 2); map {0:2, 1:2}
 *   -1 -> running 0,  need 0  -> 2 (count 4); map {0:3, 1:2}
 *   4
 *
 * EDGE CASES
 * - Whole array sums to k (the {0:1} seed catches it)
 * - All zeros with k = 0 -> n(n+1)/2
 * - Empty -> 0
 * - No match -> 0
 */

function bruteForce(nums, k) {
  const prefix = new Array(nums.length + 1).fill(0);
  for (let i = 0; i < nums.length; i++) prefix[i + 1] = prefix[i] + nums[i];

  let count = 0;
  for (let end = 1; end <= nums.length; end++) {
    for (let start = 0; start < end; start++) {
      if (prefix[end] - prefix[start] === k) count++;
    }
  }
  return count;
}

function optimal(nums, k) {
  const prefixCount = new Map([[0, 1]]); // prefix value -> how many prefixes had it
  let running = 0;
  let count = 0;

  for (const num of nums) {
    running += num;
    count += prefixCount.get(running - k) ?? 0;              // earlier prefixes that close a k-sum
    prefixCount.set(running, (prefixCount.get(running) ?? 0) + 1);
  }
  return count;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 1, 1], 2), 2);
  assert.strictEqual(solve([1, 2, 3], 3), 2);
  assert.strictEqual(solve([1, -1, 1, -1], 0), 4);
  assert.strictEqual(solve([0, 0, 0], 0), 6);
  assert.strictEqual(solve([], 0), 0);
  assert.strictEqual(solve([2, 2, 2], 7), 0);
  assert.strictEqual(solve([1, 2, 3], 6), 1);
  assert.strictEqual(solve([-1, -1, 1], -2), 1);
}
console.log('✓ 05-subarray-sum-equals-k passed');

module.exports = { optimal, bruteForce };

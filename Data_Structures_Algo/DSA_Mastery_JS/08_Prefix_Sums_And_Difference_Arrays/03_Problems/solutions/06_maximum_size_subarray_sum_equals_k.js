/**
 * 06. Maximum Size Subarray Sum Equals k   (LeetCode 325 — Medium)
 *
 * PROBLEM
 * Given an integer array nums and an integer k, return the length of the LONGEST
 * contiguous subarray whose sum equals k. Return 0 if none exists.
 *
 * EXAMPLES
 * Input: nums = [1, -1, 5, -2, 3], k = 3   Output: 4   Explanation: [1, -1, 5, -2]
 * Input: nums = [-2, -1, 2, 1], k = 1      Output: 2   Explanation: [-1, 2]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Negatives? (yes)
 * - Longest, not count? (longest -> store FIRST index of each prefix, not a count)
 * - Empty / no match -> 0
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * For each start, extend right with a running sum; record the length when it hits k.
 *
 * APPROACH 2 — Optimal (prefix sum + map of FIRST index)   O(n) time, O(n) space
 * Subarray (j, i] has sum prefix[i] - prefix[j] = k  ->  prefix[j] = prefix[i] - k.
 * For the LONGEST subarray ending at i we want the SMALLEST such j, so store each prefix
 * value's first occurrence and never overwrite it. Seed {0: -1}: the empty prefix sits
 * "before index 0", so a subarray starting at 0 has length i - (-1) = i + 1.
 *
 * Dry run on [1, -1, 5, -2, 3], k = 3:
 *   map {0:-1}
 *   i=0 run 1   need -2 no   map {0:-1, 1:0}
 *   i=1 run 0   need -3 no   0 already in map (keep -1)
 *   i=2 run 5   need 2  no   map {..., 5:2}
 *   i=3 run 3   need 0  -> at -1 -> length 3 - (-1) = 4  best 4; map {..., 3:3}
 *   i=4 run 6   need 3  -> at 3  -> length 1; map {..., 6:4}
 *   4
 *
 * EDGE CASES
 * - Whole array -> n (seed handles it)
 * - k = 0 with repeated prefix values
 * - Single element equal to k -> 1
 * - No subarray -> 0
 */

function bruteForce(nums, k) {
  let best = 0;
  for (let start = 0; start < nums.length; start++) {
    let sum = 0;
    for (let end = start; end < nums.length; end++) {
      sum += nums[end];
      if (sum === k) best = Math.max(best, end - start + 1);
    }
  }
  return best;
}

function optimal(nums, k) {
  const firstIndexOfPrefix = new Map([[0, -1]]); // prefix value -> earliest index it occurred at
  let running = 0;
  let best = 0;

  for (let i = 0; i < nums.length; i++) {
    running += nums[i];

    if (firstIndexOfPrefix.has(running - k)) {
      best = Math.max(best, i - firstIndexOfPrefix.get(running - k));
    }
    // keep the FIRST occurrence: earlier start = longer subarray
    if (!firstIndexOfPrefix.has(running)) firstIndexOfPrefix.set(running, i);
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, -1, 5, -2, 3], 3), 4);
  assert.strictEqual(solve([-2, -1, 2, 1], 1), 2);
  assert.strictEqual(solve([1, 2, 3], 6), 3);
  assert.strictEqual(solve([1, 2, 3], 7), 0);
  assert.strictEqual(solve([], 0), 0);
  assert.strictEqual(solve([0, 0, 0], 0), 3);
  assert.strictEqual(solve([5], 5), 1);
  assert.strictEqual(solve([1, 0, -1], 0), 3);
}
console.log('✓ 06-maximum-size-subarray-sum-equals-k passed');

module.exports = { optimal, bruteForce };

/**
 * 11. Partition to K Equal Sum Subsets   (LeetCode 698 — Medium)
 *
 * PROBLEM
 * Can the array be split into k non-empty subsets whose sums are all equal?
 *
 * EXAMPLES
 * Input: nums = [4,3,2,3,5,2,1], k = 4   Output: true
 *   Explanation: target 5: (5), (1,4), (2,3), (2,3)
 * Input: nums = [1,2,3,4], k = 3          Output: false   Explanation: 10 is not divisible by 3
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= k <= n <= 16  (n <= 16 screams "bitmask DP": 2^16 = 65536 states)
 * - sum % k !== 0 or max(nums) > target -> false immediately.
 *
 * APPROACH 1 — Brute force (plain recursion / backtracking)   O(k^n) time, O(n) space
 * Assign each number to one of k buckets, recurse, backtrack when a bucket overflows.
 *
 * APPROACH 2 — Bitmask DP   O(2^n * n) time, O(2^n) space
 * The idea: fill the buckets ONE AFTER ANOTHER. We never need to know which bucket a
 * number went into, only WHICH numbers are used so far (a subset = a bitmask) and how
 * full the current bucket is - and that is determined by the mask: (sum of mask) % target.
 * STATE      dp[mask] = true if the numbers in `mask` can be arranged so that every
 *            bucket except possibly the last is exactly full (the last holds
 *            sumOf(mask) % target).
 * RECURRENCE dp[mask | (1 << i)] = true if dp[mask] is true, bit i is not in mask, and
 *            (sumOf(mask) % target) + nums[i] <= target   (fits in the current bucket).
 * BASE CASES dp[0] = true (nothing used, all buckets empty).
 * ANSWER     dp[(1 << n) - 1]  (all numbers used; sum is k * target so all buckets full).
 *
 * Dry run nums = [2,1,3], k = 2, target 3 (bits: 0 -> 2, 1 -> 1, 2 -> 3):
 *   mask 000 sum 0 rem 0 : add 2 -> 001 ok, add 1 -> 010 ok, add 3 -> 100 ok
 *   mask 001 sum 2 rem 2 : add 1 -> 011 (2+1=3 ok), add 3 -> 2+3 > 3 no
 *   mask 010 sum 1 rem 1 : add 2 -> 011 ok, add 3 -> no
 *   mask 011 sum 3 rem 0 : add 3 -> 111 ok      -> dp[111] = true -> answer true
 *
 * EDGE CASES
 * - k = 1 -> always true
 * - sum % k !== 0 -> false
 * - an element larger than target -> false
 */

function bruteForce(nums, k) {
  const total = nums.reduce((sum, value) => sum + value, 0);
  if (total % k !== 0) return false;
  const target = total / k;
  const buckets = new Array(k).fill(0);
  function place(i) {
    if (i === nums.length) return buckets.every((bucket) => bucket === target);
    for (let b = 0; b < k; b++) {
      if (buckets[b] + nums[i] > target) continue;
      buckets[b] += nums[i];
      if (place(i + 1)) return true;
      buckets[b] -= nums[i];
      if (buckets[b] === 0) break; // all empty buckets are the same; avoid duplicate work
    }
    return false;
  }
  return place(0);
}

function memo(nums, k) {
  const total = nums.reduce((sum, value) => sum + value, 0);
  if (total % k !== 0) return false;
  const target = total / k;
  const n = nums.length;
  const cache = new Map(); // mask -> boolean (can we finish from this mask?)
  function canFinish(mask, currentBucket) {
    if (mask === (1 << n) - 1) return true;
    if (cache.has(mask)) return cache.get(mask);
    let result = false;
    for (let i = 0; i < n && !result; i++) {
      if (mask & (1 << i)) continue;                    // already used
      if (currentBucket + nums[i] > target) continue;   // does not fit
      const nextBucket = (currentBucket + nums[i]) % target; // full bucket resets to 0
      result = canFinish(mask | (1 << i), nextBucket);
    }
    cache.set(mask, result);
    return result;
  }
  return canFinish(0, 0);
}

function tabulation(nums, k) {
  const total = nums.reduce((sum, value) => sum + value, 0);
  if (total % k !== 0) return false;
  const target = total / k;
  const n = nums.length;
  const full = (1 << n) - 1;
  const dp = new Array(1 << n).fill(false);
  const sumOfMask = new Array(1 << n).fill(0);
  dp[0] = true;
  for (let mask = 0; mask <= full; mask++) {
    if (!dp[mask]) continue;
    const remainder = sumOfMask[mask] % target; // how full the current bucket is
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) continue;
      if (remainder + nums[i] > target) continue;
      const next = mask | (1 << i);
      if (!dp[next]) {
        dp[next] = true;
        sumOfMask[next] = sumOfMask[mask] + nums[i];
      }
    }
  }
  return dp[full];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation]) {
  assert.strictEqual(solve([4, 3, 2, 3, 5, 2, 1], 4), true);
  assert.strictEqual(solve([1, 2, 3, 4], 3), false);
  assert.strictEqual(solve([2, 1, 3], 2), true);
  assert.strictEqual(solve([1], 1), true);
  assert.strictEqual(solve([10, 1, 1], 2), false);     // 10 > target 6
  assert.strictEqual(solve([2, 2, 2, 2, 3, 4, 5], 4), false);
  assert.strictEqual(solve([1, 1, 1, 1, 2, 2, 2, 2], 4), true);
}
console.log('✓ 11-partition-k-equal-sum-subsets passed');

module.exports = { bruteForce, memo, tabulation };

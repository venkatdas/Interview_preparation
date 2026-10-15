/**
 * 08. Subarray Sums Divisible by K   (LeetCode 974 — Medium)
 *
 * PROBLEM
 * Given an integer array nums and an integer k, return the number of non-empty
 * contiguous subarrays whose sum is divisible by k.
 *
 * EXAMPLES
 * Input: nums = [4, 5, 0, -2, -3, 1], k = 5   Output: 7
 *   Explanation: [4,5,0,-2,-3,1], [5], [5,0], [5,0,-2,-3], [0], [0,-2,-3], [-2,-3]
 * Input: nums = [5], k = 9                    Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Negatives? (yes -> careful with JS modulo: -3 % 5 === -3)
 * - k >= 1? (yes)
 * - Count, not list? (count)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * Every (start, end) with a running sum; count when sum % k === 0.
 *
 * APPROACH 2 — Optimal (prefix remainders + counts)   O(n + k) time, O(k) space
 * (prefix[i] - prefix[j]) is divisible by k  <=>  prefix[i] % k === prefix[j] % k.
 * So count how many earlier prefixes had each remainder. For the current remainder r,
 * every earlier prefix with remainder r closes a valid subarray.
 * Remainders live in [0, k), so an array of size k works instead of a Map.
 * Normalise negatives: ((x % k) + k) % k. Seed remainder 0 with 1 (empty prefix).
 *
 * Dry run on [4, 5, 0, -2, -3, 1], k = 5:
 *   counts [1,0,0,0,0], running 0, answer 0
 *   4:  running 4, rem 4  -> +0, counts[4]=1
 *   5:  running 9, rem 4  -> +1 (1), counts[4]=2
 *   0:  running 9, rem 4  -> +2 (3), counts[4]=3
 *   -2: running 7, rem 2  -> +0, counts[2]=1
 *   -3: running 4, rem 4  -> +3 (6), counts[4]=4
 *   1:  running 5, rem 0  -> +1 (7), counts[0]=2
 *   7
 *
 * EDGE CASES
 * - Single element not divisible -> 0
 * - All multiples of k -> n(n+1)/2
 * - k = 1 -> every subarray counts
 * - Negative running sums
 */

function bruteForce(nums, k) {
  let count = 0;
  for (let start = 0; start < nums.length; start++) {
    let sum = 0;
    for (let end = start; end < nums.length; end++) {
      sum += nums[end];
      if (sum % k === 0) count++;
    }
  }
  return count;
}

function optimal(nums, k) {
  const remainderCount = new Array(k).fill(0);
  remainderCount[0] = 1; // empty prefix
  let remainder = 0;
  let count = 0;

  for (const num of nums) {
    remainder = (((remainder + num) % k) + k) % k; // keep in [0, k) even for negatives
    count += remainderCount[remainder];              // earlier prefixes with the same remainder
    remainderCount[remainder]++;
  }
  return count;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([4, 5, 0, -2, -3, 1], 5), 7);
  assert.strictEqual(solve([5], 9), 0);
  assert.strictEqual(solve([5, 10, 15], 5), 6);
  assert.strictEqual(solve([1, 2, 3], 1), 6);
  assert.strictEqual(solve([-1, 2, 9], 2), 2);
  assert.strictEqual(solve([], 3), 0);
  assert.strictEqual(solve([-5, -5], 5), 3);
}
console.log('✓ 08-subarray-sums-divisible-by-k passed');

module.exports = { optimal, bruteForce };

/**
 * 14. Ways to Split Array Into Three Subarrays   (LeetCode 1712 — Hard)
 *
 * PROBLEM
 * Given an array of NON-NEGATIVE integers nums, count the ways to split it into three
 * non-empty contiguous parts left | mid | right such that
 * sum(left) <= sum(mid) <= sum(right). Return the count modulo 10^9 + 7.
 *
 * EXAMPLES
 * Input: [1, 1, 1]        Output: 1   Explanation: [1] [1] [1]
 * Input: [1, 2, 2, 2, 5, 0]   Output: 3   Explanation: [1]|[2]|[2,2,5,0], [1]|[2,2]|[2,5,0], [1,2]|[2,2]|[5,0]
 * Input: [3, 2, 1]        Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Non-negative? (YES: that makes prefix sums monotonic, which enables binary search)
 * - All three parts non-empty? (yes)
 * - n up to 10^5 -> O(n^2) = 10^10 is too slow; need O(n log n) or O(n)
 *
 * Setup: prefix[i] = sum of nums[0..i-1]. A split is a pair of cut points (i, j) with
 *   left  = nums[0..i-1]   sum prefix[i]
 *   mid   = nums[i..j-1]   sum prefix[j] - prefix[i]
 *   right = nums[j..n-1]   sum total - prefix[j]
 * and 1 <= i < j <= n - 1.
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(n) space
 * For every i, try every j and check the two inequalities with prefix sums.
 *
 * APPROACH 2 — Optimal (prefix sums + binary search for the j range)   O(n log n) time, O(n) space
 * Fix the first cut i (left sum L = prefix[i]). Which j work?
 *   sum(mid) >= L         <=>  prefix[j] >= 2L                         -> j >= some lowest jMin
 *   sum(mid) <= sum(right) <=>  prefix[j] - L <= total - prefix[j]
 *                          <=>  prefix[j] <= (total + L) / 2             -> j <= some highest jMax
 * Because prefix is non-decreasing, both bounds are found by binary search
 * (first index with prefix >= 2L; last index with prefix <= (total + L) / 2).
 * Also j must be in [i + 1, n - 1]. Count max(0, jMax - jMin + 1) for each i.
 * (Two moving pointers also work in O(n): both bounds only move right as i grows.)
 *
 * Dry run on [1, 2, 2, 2, 5, 0], prefix = [0, 1, 3, 5, 7, 12, 12], total 12:
 *   i=1 L=1: need prefix[j] >= 2 -> jMin = 2; prefix[j] <= 6.5 -> jMax = 3; j in [2,3] -> 2 ways
 *   i=2 L=3: need prefix[j] >= 6 -> jMin = 4; prefix[j] <= 7.5 -> jMax = 4; j in [4,4] -> 1 way
 *   i=3 L=5: need prefix[j] >= 10 -> jMin = 5; prefix[j] <= 8.5 -> jMax = 4; empty
 *   i=4 L=7: prefix[j] >= 14 -> none
 *   total 3
 *
 * EDGE CASES
 * - Fewer than 3 elements -> 0
 * - All zeros -> every (i, j) pair works: C(n-1, 2)
 * - Decreasing values -> 0
 * - Big counts -> apply the modulo
 */

const MOD = 1_000_000_007;

function buildPrefix(nums) {
  const prefix = new Array(nums.length + 1).fill(0);
  for (let i = 0; i < nums.length; i++) prefix[i + 1] = prefix[i] + nums[i];
  return prefix;
}

function bruteForce(nums) {
  const n = nums.length;
  const prefix = buildPrefix(nums);
  const total = prefix[n];
  let ways = 0;
  for (let i = 1; i <= n - 2; i++) {
    for (let j = i + 1; j <= n - 1; j++) {
      const left = prefix[i];
      const mid = prefix[j] - prefix[i];
      const right = total - prefix[j];
      if (left <= mid && mid <= right) ways = (ways + 1) % MOD;
    }
  }
  return ways;
}

// first index in [lo, hi] with prefix[index] >= target, or hi + 1 if none
function firstAtLeast(prefix, target, lo, hi) {
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (prefix[mid] >= target) hi = mid - 1;
    else lo = mid + 1;
  }
  return lo;
}

// last index in [lo, hi] with prefix[index] <= target, or lo - 1 if none
function lastAtMost(prefix, target, lo, hi) {
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (prefix[mid] <= target) lo = mid + 1;
    else hi = mid - 1;
  }
  return hi;
}

function optimal(nums) {
  const n = nums.length;
  if (n < 3) return 0;
  const prefix = buildPrefix(nums);
  const total = prefix[n];
  let ways = 0;

  for (let i = 1; i <= n - 2; i++) {
    const left = prefix[i];
    if (left * 3 > total) break; // left can't be <= mid <= right any more

    // j ranges over [i + 1, n - 1]
    const jMin = firstAtLeast(prefix, 2 * left, i + 1, n - 1);        // mid >= left
    const jMax = lastAtMost(prefix, (total + left) / 2, i + 1, n - 1); // mid <= right
    if (jMax >= jMin) ways = (ways + (jMax - jMin + 1)) % MOD;
  }
  return ways;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 1, 1]), 1);
  assert.strictEqual(solve([1, 2, 2, 2, 5, 0]), 3);
  assert.strictEqual(solve([3, 2, 1]), 0);
  assert.strictEqual(solve([0, 0, 0, 0]), 3);
  assert.strictEqual(solve([1, 2]), 0);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([0, 0, 0, 0, 0]), 6);
  assert.strictEqual(solve([2, 3, 5, 10]), 3); // [2]|[3]|[5,10], [2]|[3,5]|[10], [2,3]|[5]|[10]
}
// cross-check on a random-ish larger input
const big = Array.from({ length: 60 }, (_, i) => (i * 7919) % 13);
assert.strictEqual(optimal(big), bruteForce(big));
console.log('✓ 14-ways-to-split-array passed');

module.exports = { optimal, bruteForce };

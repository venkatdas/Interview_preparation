/**
 * 06. Count of Range Sum   (LeetCode 327 — Hard)
 *
 * PROBLEM
 * Given an integer array nums and two integers lower and upper, count how many
 * subarrays have a sum in the inclusive range [lower, upper].
 *
 * EXAMPLES
 * Input: nums = [-2,5,-1], lower = -2, upper = 2   Output: 3
 *   subarrays [-2], [-1], [-2,5,-1] have sums -2, -1, 2
 * Input: nums = [0], lower = 0, upper = 0   Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 10^5, values up to +-2^31 -> sums fit in a double exactly (< 2^53)
 * - Subarrays are contiguous and non-empty
 * - lower <= upper always
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * For every start, extend the end and keep a running sum; count when it is in range.
 *
 * APPROACH 2 — Optimal (Prefix sums + segment tree counting)   O(n log n) time, O(n) space
 * Let P[i] = sum of nums[0..i-1], P[0] = 0. The sum of nums[j..i-1] is P[i] - P[j].
 * For each i we want the number of earlier j with  lower <= P[i] - P[j] <= upper,
 * i.e.  P[i] - upper <= P[j] <= P[i] - lower.  That is: "how many SEEN prefix sums lie
 * in a value range?" -- a counting segment tree indexed by VALUE.
 * 1. Compute all prefix sums, sort + dedupe them -> compressed indices.
 * 2. Tree over the compressed values, each leaf counts how many times that prefix sum
 *    has been inserted so far.
 * 3. Sweep i from 0..n: before inserting P[i], find [lowIdx, highIdx] with binary search
 *    (first value >= P[i]-upper, last value <= P[i]-lower) and add query(lowIdx, highIdx).
 *    Then insert P[i].
 * (The same sweep works with a Fenwick tree - see ../../34_Range_Query_Data_Structures/02_Fenwick_Tree/ - and a
 * merge-sort variant lives in ../../../30_Divide_And_Conquer/.)
 *
 * Dry run: nums = [-2,5,-1], lower=-2, upper=2
 *   P = [0, -2, 3, 2]; sorted unique = [-2, 0, 2, 3]
 *   i=0 P=0: need P[j] in [0-2, 0+2] = [-2, 2] -> nothing inserted yet -> 0; insert 0
 *   i=1 P=-2: need [-4, 0] -> inserted {0} -> 1; insert -2
 *   i=2 P=3: need [1, 5] -> inserted {0,-2} -> 0; insert 3
 *   i=3 P=2: need [0, 4] -> inserted {0,-2,3} -> 0 and 3 -> 2; total 3
 *
 * EDGE CASES
 * - single element equal to lower/upper boundary
 * - all zeros with lower = upper = 0 -> n(n+1)/2
 * - no subarray in range -> 0
 * - negative lower/upper
 */

function bruteForce(nums, lower, upper) {
  let count = 0;
  for (let start = 0; start < nums.length; start++) {
    let sum = 0;
    for (let end = start; end < nums.length; end++) {
      sum += nums[end];
      if (sum >= lower && sum <= upper) count++;
    }
  }
  return count;
}

// first index whose value >= target (lower bound)
function lowerBound(sorted, target) {
  let lo = 0;
  let hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

// first index whose value > target (upper bound)
function upperBound(sorted, target) {
  let lo = 0;
  let hi = sorted.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (sorted[mid] <= target) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function optimal(nums, lower, upper) {
  const prefix = [0];
  for (const x of nums) prefix.push(prefix[prefix.length - 1] + x);

  const sorted = [...new Set(prefix)].sort((a, b) => a - b);
  const m = sorted.length;
  const tree = new Array(2 * m).fill(0);     // iterative counting tree

  function insert(valueIndex) {
    for (let i = valueIndex + m; i >= 1; i >>= 1) tree[i]++;
  }

  function countRange(l, r) {                 // inclusive compressed indices
    let total = 0;
    for (let lo = l + m, hi = r + m + 1; lo < hi; lo >>= 1, hi >>= 1) {
      if (lo & 1) total += tree[lo++];
      if (hi & 1) total += tree[--hi];
    }
    return total;
  }

  let count = 0;
  for (const p of prefix) {
    const lowIdx = lowerBound(sorted, p - upper);
    const highIdx = upperBound(sorted, p - lower) - 1;
    if (lowIdx <= highIdx) count += countRange(lowIdx, highIdx);
    insert(lowerBound(sorted, p));            // exact index of p
  }
  return count;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([-2, 5, -1], -2, 2), 3);
  assert.strictEqual(solve([0], 0, 0), 1);
  assert.strictEqual(solve([0, 0, 0], 0, 0), 6);
  assert.strictEqual(solve([1, 2, 3], 10, 20), 0);
  assert.strictEqual(solve([-3], -3, -3), 1);
  assert.strictEqual(solve([2147483647, -2147483648, -1, 0], -1, 0), 4);
}
for (let trial = 0; trial < 100; trial++) {
  const n = 1 + Math.floor(Math.random() * 10);
  const nums = Array.from({ length: n }, () => Math.floor(Math.random() * 21) - 10);
  const lower = Math.floor(Math.random() * 21) - 15;
  const upper = lower + Math.floor(Math.random() * 15);
  assert.strictEqual(optimal(nums, lower, upper), bruteForce(nums, lower, upper));
}
console.log('✓ 06-count-of-range-sum passed');

module.exports = { optimal, bruteForce };

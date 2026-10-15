/**
 * 02. Count of Smaller Numbers After Self   (LeetCode 315 — Hard)
 *
 * PROBLEM
 * Given an integer array nums, return an array counts where counts[i] is the number of
 * elements to the RIGHT of i that are strictly smaller than nums[i].
 *
 * EXAMPLES
 * Input: [5,2,6,1]   Output: [2,1,1,0]
 *   right of 5: 2 and 1 are smaller -> 2; right of 2: 1 -> 1; right of 6: 1 -> 1; right of 1: 0
 * Input: [-1,-1]     Output: [0,0]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 10^5, values in [-10^4, 10^4] -> O(n^2) is too slow; values are small enough
 *   to index directly, but compression works for any range.
 * - Strictly smaller (equal values do not count).
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) extra space
 * For each i, loop j > i and count nums[j] < nums[i].
 *
 * APPROACH 2 — Optimal (Fenwick tree over values, sweep from the right)   O(n log n)
 * Walk from right to left keeping a Fenwick tree of COUNTS indexed by compressed value.
 * For nums[i]: counts[i] = prefixSum(rank(nums[i]) - 1) = how many already-seen (to the
 * right) values are smaller. Then add 1 at rank(nums[i]).
 *
 * Dry run on [5,2,6,1]: ranks 1->0, 2->1, 5->2, 6->3
 *   i=3 (1, rank 0): prefixSum(-1) = 0; insert rank 0           tree counts: [1,0,0,0]
 *   i=2 (6, rank 3): prefixSum(2) = 1; insert rank 3             [1,0,0,1]
 *   i=1 (2, rank 1): prefixSum(0) = 1; insert rank 1             [1,1,0,1]
 *   i=0 (5, rank 2): prefixSum(1) = 2; insert rank 2             [1,1,1,1]
 *   counts = [2,1,1,0]
 *
 * EDGE CASES
 * - empty array -> []
 * - all equal -> all zeros
 * - strictly decreasing -> [n-1, n-2, ..., 0]
 * - negative numbers (compression handles them)
 */

function bruteForce(nums) {
  const counts = new Array(nums.length).fill(0);
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[j] < nums[i]) counts[i]++;
    }
  }
  return counts;
}

function optimal(nums) {
  const n = nums.length;
  const sorted = [...new Set(nums)].sort((a, b) => a - b);
  const rank = new Map(sorted.map((v, i) => [v, i]));
  const m = sorted.length;
  const tree = new Array(m + 1).fill(0);           // 1-indexed BIT of counts

  function add(index) {
    for (let i = index + 1; i <= m; i += i & -i) tree[i]++;
  }
  function prefixCount(index) {                    // count of ranks 0..index
    let sum = 0;
    for (let i = index + 1; i > 0; i -= i & -i) sum += tree[i];
    return sum;
  }

  const counts = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    const r = rank.get(nums[i]);
    counts[i] = prefixCount(r - 1);                // seen values with a smaller rank
    add(r);
  }
  return counts;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([5, 2, 6, 1]), [2, 1, 1, 0]);
  assert.deepStrictEqual(solve([-1, -1]), [0, 0]);
  assert.deepStrictEqual(solve([]), []);
  assert.deepStrictEqual(solve([7]), [0]);
  assert.deepStrictEqual(solve([5, 4, 3, 2, 1]), [4, 3, 2, 1, 0]);
  assert.deepStrictEqual(solve([1, 2, 3]), [0, 0, 0]);
  assert.deepStrictEqual(solve([2, 0, 1]), [2, 0, 0]);
}
for (let trial = 0; trial < 100; trial++) {
  const n = Math.floor(Math.random() * 15);
  const nums = Array.from({ length: n }, () => Math.floor(Math.random() * 21) - 10);
  assert.deepStrictEqual(optimal(nums), bruteForce(nums));
}
console.log('✓ 02-count-of-smaller-numbers-after-self passed');

module.exports = { optimal, bruteForce };

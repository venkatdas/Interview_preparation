/**
 * 05. Partition Array Into Two Arrays to Minimize Sum Difference   (LeetCode 2035 — Hard)
 *
 * PROBLEM
 * nums has exactly 2n integers (n <= 15, values may be negative). Split nums into two
 * arrays of exactly n elements each. Return the smallest possible
 * |sum(first) - sum(second)|.
 *
 * EXAMPLES
 * nums=[3,9,7,3]            -> 2   ([3,9] vs [7,3])
 * nums=[-36,36]             -> 72
 * nums=[2,-1,0,4,-2,-9]     -> 0   ([2,4,-9] vs [-1,0,-2])
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 2n <= 30, so C(30,15) ≈ 1.5e8 splits is too slow; 2^15 = 32768 per half is fast.
 * - Both groups must have EXACTLY n elements — the size constraint is the twist.
 *
 * APPROACH 1 — Brute force   O(C(2n, n) * n) time
 * Try every mask with exactly n bits set, compute the difference.
 *
 * APPROACH 2 — Optimal (meet in the middle by subset SIZE + binary search)
 *              O(2^n * n) time, O(2^n) space
 * Let total = sum(nums). If the first group has sum S, the difference is |total - 2S|,
 * so we want S as close as possible to total / 2.
 * Split nums into left half and right half (n elements each).
 * If the first group takes k elements from the left, it must take n - k from the right.
 *   bySizeL[k]     = sums of k-element subsets of the left
 *   bySizeR[n - k] = sums of (n-k)-element subsets of the right, sorted
 * For every k and every a in bySizeL[k], binary search bySizeR[n-k] for the value
 * closest to total/2 - a. Check both neighbours.
 *
 * Dry run nums=[3,9,7,3], total 22, target S ≈ 11, n=2:
 *   left=[3,9]: size0 [0], size1 [3,9], size2 [12]
 *   right=[7,3]: size0 [0], size1 [3,7] (sorted), size2 [10]
 *   k=0: a=0 + right size2 [10] -> S=10 -> |22-20| = 2
 *   k=1: a=3 + [3,7] -> S=6 or 10 -> best 2; a=9 + [3,7] -> 12 -> |22-24| = 2
 *   k=2: a=12 + [0] -> S=12 -> 2
 *   answer 2
 *
 * EDGE CASES
 * - n = 1: just |a - b|
 * - negatives: target total/2 may be negative or fractional — compare with 2*S to stay in integers
 */
const { subsetSumsBySize, lowerBound } = require('../../02_Implementations/meet_in_the_middle');

function bruteForce(nums) {
  const m = nums.length, n = m / 2;
  const total = nums.reduce((a, b) => a + b, 0);
  let best = Infinity;
  for (let mask = 0; mask < 1 << m; mask++) {
    let bits = 0, s = 0;
    for (let i = 0; i < m; i++) if (mask & (1 << i)) { bits++; s += nums[i]; }
    if (bits === n) best = Math.min(best, Math.abs(total - 2 * s));
  }
  return best;
}

function optimal(nums) {
  const n = nums.length / 2;
  const total = nums.reduce((a, b) => a + b, 0);
  const left = subsetSumsBySize(nums.slice(0, n));
  const right = subsetSumsBySize(nums.slice(n)).map(list => list.sort((a, b) => a - b));
  let best = Infinity;
  for (let k = 0; k <= n; k++) {
    const R = right[n - k];
    for (const a of left[k]) {
      // want a + r ≈ total / 2  ->  r ≈ (total - 2a) / 2 ; lowerBound on the real-valued target
      const pos = lowerBound(R, (total - 2 * a) / 2);
      if (pos < R.length) best = Math.min(best, Math.abs(total - 2 * (a + R[pos])));
      if (pos > 0) best = Math.min(best, Math.abs(total - 2 * (a + R[pos - 1])));
      if (best === 0) return 0;
    }
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([3, 9, 7, 3]), 2);
  assert.strictEqual(solve([-36, 36]), 72);
  assert.strictEqual(solve([2, -1, 0, 4, -2, -9]), 0);
  assert.strictEqual(solve([1, 1]), 0);
  assert.strictEqual(solve([5, 5, 5, 5]), 0);
  assert.strictEqual(solve([1, 2, 3, 100]), 96);
}
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(5);
for (let t = 0; t < 200; t++) {
  const n = 1 + Math.floor(rand() * 6);
  const nums = Array.from({ length: 2 * n }, () => Math.floor(rand() * 201) - 100);
  assert.strictEqual(optimal(nums), bruteForce(nums));
}
// full size n = 15 runs fast
const big = Array.from({ length: 30 }, () => Math.floor(rand() * 2e7) - 1e7);
assert.ok(optimal(big) >= 0);
console.log('✓ 05_partition_min_sum_difference passed');

module.exports = { optimal, bruteForce };

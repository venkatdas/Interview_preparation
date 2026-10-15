/**
 * 10. Partition Array Into Two Arrays to Minimize Sum Difference   (LeetCode 2035 — Hard)
 *
 * PROBLEM
 * nums has 2n elements. Split it into two arrays of EXACTLY n elements each so that the
 * absolute difference of their sums is as small as possible. Return that difference.
 *
 * EXAMPLES
 * Input: [3,9,7,3]          Output: 2   ([3,9] and [7,3]: 12 vs 10)
 * Input: [-36,36]           Output: 72
 * Input: [2,-1,0,4,-2,-9]   Output: 0   ([2,4,-9] and [-1,0,-2]: -3 vs -3)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n <= 15 (so 2n <= 30): C(30, 15) ~ 1.5 * 10^8 subsets is too many to enumerate directly
 * - Both parts must have exactly n elements (that is what makes it hard)
 *
 * APPROACH 1 — Brute force   O(C(2n, n) * n) time
 * Enumerate every bitmask with exactly n bits set; compute the difference. Fine for 2n <= 16.
 *
 * APPROACH 2 — Optimal (Meet in the middle, grouped by subset size)   O(2^n * n) time
 * Split into left half L and right half R (n each). For every subset of L record its sum,
 * grouped by SIZE k (0..n); same for R, with each size group sorted.
 * We pick k elements from L and n - k from R for the first array. Its sum is a + b; the other
 * array has total - (a + b). The difference is |total - 2(a + b)|, so we want a + b as close
 * to total / 2 as possible: for each a in L[k], binary search R[n-k] for the value closest
 * to total/2 - a.
 * 2^15 subsets per side, each binary search O(log 2^15) -> fast.
 *
 * Dry run on [3,9,7,3]: n = 2, L = [3,9], R = [7,3], total = 22, target sum 11
 *   L by size: {0: [0], 1: [3, 9], 2: [12]};  R by size: {0: [0], 1: [3, 7], 2: [10]}
 *   k=0: a=0, need 11 from R[2]=[10] -> 10 -> diff |22 - 20| = 2
 *   k=1: a=3, need 8 from R[1]=[3,7] -> 7 -> sum 10 -> diff 2;  a=9, need 2 -> 3 -> sum 12 -> diff 2
 *   k=2: a=12, need -1 from R[0]=[0] -> 12 -> diff 2
 *   answer 2
 *
 * EDGE CASES
 * - 2n = 2 -> |a - b|
 * - negative numbers (sums go negative, binary search still fine)
 * - perfect split -> 0
 */

function bruteForce(nums) {
  const m = nums.length;
  const n = m / 2;
  const total = nums.reduce((a, b) => a + b, 0);
  let best = Infinity;
  for (let mask = 0; mask < (1 << m); mask++) {
    let bits = 0;
    for (let x = mask; x; x &= x - 1) bits++;
    if (bits !== n) continue;
    let sum = 0;
    for (let i = 0; i < m; i++) if (mask & (1 << i)) sum += nums[i];
    best = Math.min(best, Math.abs(total - 2 * sum));
  }
  return best;
}

// subset sums of arr grouped by subset size: groups[k] = array of sums using k elements
function sumsBySize(arr) {
  const n = arr.length;
  const groups = Array.from({ length: n + 1 }, () => []);
  for (let mask = 0; mask < (1 << n); mask++) {
    let sum = 0;
    let bits = 0;
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) {
        sum += arr[i];
        bits++;
      }
    }
    groups[bits].push(sum);
  }
  return groups;
}

function optimal(nums) {
  const n = nums.length / 2;
  const total = nums.reduce((a, b) => a + b, 0);
  const left = sumsBySize(nums.slice(0, n));
  const right = sumsBySize(nums.slice(n));
  for (const group of right) group.sort((a, b) => a - b);

  let best = Infinity;
  for (let k = 0; k <= n; k++) {
    const candidates = right[n - k];
    for (const a of left[k]) {
      const need = total / 2 - a;                      // we want a + b ~ total / 2
      let lo = 0;
      let hi = candidates.length;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (candidates[mid] < need) lo = mid + 1;
        else hi = mid;
      }
      for (const idx of [lo - 1, lo]) {
        if (idx >= 0 && idx < candidates.length) {
          best = Math.min(best, Math.abs(total - 2 * (a + candidates[idx])));
        }
      }
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
  assert.strictEqual(solve([1, 2, 3, 4]), 0);
  assert.strictEqual(solve([5, 5, 5, 1]), 4);
}
for (let trial = 0; trial < 200; trial++) {
  const n = 1 + Math.floor(Math.random() * 4);
  const nums = Array.from({ length: 2 * n }, () => Math.floor(Math.random() * 21) - 10);
  assert.strictEqual(optimal(nums), bruteForce(nums));
}
// full-size instance (2n = 30) finishes quickly with the optimal version
{
  const nums = Array.from({ length: 30 }, (_, i) => ((i * 7919) % 2001) - 1000);
  const start = Date.now();
  assert.ok(optimal(nums) >= 0);
  assert.ok(Date.now() - start < 15000);
}
console.log('✓ 10-partition-array-minimize-sum-difference passed');

module.exports = { optimal, bruteForce };

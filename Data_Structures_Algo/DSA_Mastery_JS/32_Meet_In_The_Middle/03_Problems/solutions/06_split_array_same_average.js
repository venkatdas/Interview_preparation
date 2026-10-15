/**
 * 06. Split Array With Same Average   (LeetCode 805 — Hard)
 *
 * PROBLEM
 * Given nums (length 1..30, values 0..10^4), decide whether you can move every element
 * into one of two NON-EMPTY arrays A and B so that average(A) === average(B).
 *
 * EXAMPLES
 * nums=[1,2,3,4,5,6,7,8] -> true   ([1,4,5,8] and [2,3,6,7], both average 4.5)
 * nums=[3,1]             -> false
 * nums=[5,5,5]           -> true
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n <= 30, so 2^30 ≈ 1e9 subsets is too slow; 2^15 per half is fast.
 * - Both arrays must be non-empty.
 *
 * KEY OBSERVATION
 * If A and B have the same average, both equal the overall average avg = total / n.
 * Subtract avg from every value: b[i] = nums[i] * n - total (multiply by n to stay in integers).
 * Now the question is: is there a non-empty PROPER subset of b with sum 0?
 * (Its complement then also sums to 0, because sum(b) = 0.)
 *
 * APPROACH 1 — Brute force   O(2^n * n) time
 * Try every non-empty proper mask; check sum(mask) * n === total * size(mask).
 *
 * APPROACH 2 — Optimal (meet in the middle + hash set)   O(2^(n/2)) time and space
 * Split b into left and right halves.
 *   1. Any non-empty left subset with sum 0 -> true (it is proper: the right half is non-empty).
 *   2. Any non-empty right subset with sum 0 -> true (the left half is non-empty, so proper).
 *   3. Combine: non-empty left subset (NOT the whole left) with sum x, plus non-empty right
 *      subset with sum -x -> true. Excluding the full left avoids picking the WHOLE array
 *      (whole left + whole right). Using the full left with a partial right is covered by
 *      step 2 via the complement, so nothing is lost.
 *
 * Dry run nums=[5,5,5]: total 15, n 3 -> b=[0,0,0]; left=[0] has non-empty sum 0 -> true.
 * Dry run nums=[3,1]: total 4, n 2 -> b=[2,-2]; left {2}, right {-2}; step 3 would need the full
 *   left -> excluded; steps 1/2 fail -> false. Correct: [3] and [1] have different averages.
 *
 * EDGE CASES
 * - n = 1 -> false (cannot make two non-empty arrays)
 * - all equal values -> true for n >= 2
 */

function bruteForce(nums) {
  const n = nums.length;
  const total = nums.reduce((a, b) => a + b, 0);
  for (let mask = 1; mask < (1 << n) - 1; mask++) {
    let s = 0, size = 0;
    for (let i = 0; i < n; i++) if (mask & (1 << i)) { s += nums[i]; size++; }
    if (s * n === total * size) return true;
  }
  return false;
}

function allMaskSums(arr) {
  const sums = new Array(1 << arr.length).fill(0);
  for (let mask = 1; mask < sums.length; mask++) {
    const low = mask & -mask;
    sums[mask] = sums[mask ^ low] + arr[31 - Math.clz32(low)];
  }
  return sums;                       // sums[mask] for mask = 0 .. 2^k - 1
}

function optimal(nums) {
  const n = nums.length;
  if (n < 2) return false;
  const total = nums.reduce((a, b) => a + b, 0);
  const b = nums.map(x => x * n - total);
  const mid = n >> 1;
  const leftSums = allMaskSums(b.slice(0, mid));
  const rightSums = allMaskSums(b.slice(mid));
  const fullLeft = leftSums.length - 1;

  const leftSet = new Set();
  for (let mask = 1; mask < leftSums.length; mask++) {
    if (leftSums[mask] === 0) return true;          // step 1
    if (mask !== fullLeft) leftSet.add(leftSums[mask]);
  }
  for (let mask = 1; mask < rightSums.length; mask++) {
    const s = rightSums[mask];
    if (s === 0) return true;                        // step 2
    if (leftSet.has(-s)) return true;                // step 3
  }
  return false;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 2, 3, 4, 5, 6, 7, 8]), true);
  assert.strictEqual(solve([3, 1]), false);
  assert.strictEqual(solve([5, 5, 5]), true);
  assert.strictEqual(solve([7]), false);
  assert.strictEqual(solve([0, 0]), true);
  assert.strictEqual(solve([1, 6, 1]), false);
  assert.strictEqual(solve([18, 0, 16, 2]), true);
}
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(6);
for (let t = 0; t < 300; t++) {
  const n = 1 + Math.floor(rand() * 12);
  const nums = Array.from({ length: n }, () => Math.floor(rand() * 10));
  assert.strictEqual(optimal(nums), bruteForce(nums), JSON.stringify(nums));
}
// n = 30 runs fast
const big = Array.from({ length: 30 }, (_, i) => (i * 7919) % 10001);
assert.strictEqual(typeof optimal(big), 'boolean');
console.log('✓ 06_split_array_same_average passed');

module.exports = { optimal, bruteForce };

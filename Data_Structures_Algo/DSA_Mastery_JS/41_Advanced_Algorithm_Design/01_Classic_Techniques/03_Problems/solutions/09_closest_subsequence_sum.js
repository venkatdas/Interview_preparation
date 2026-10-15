/**
 * 09. Closest Subsequence Sum   (LeetCode 1755 — Hard)
 *
 * PROBLEM
 * Given nums (length up to 40) and a goal, choose a subsequence (possibly empty) whose sum
 * is as close as possible to goal. Return the minimum |sum - goal|.
 *
 * EXAMPLES
 * Input: nums = [5,-7,3,5], goal = 6      Output: 0   (5 - 7 + 3 + 5 = 6)
 * Input: nums = [7,-9,15,-2], goal = -5   Output: 1   (7 - 9 - 2 = -4)
 * Input: nums = [1,2,3], goal = -7        Output: 7   (empty subsequence)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n <= 40: 2^40 subsets is too many, but 2^20 ~ 10^6 is fine -> meet in the middle
 * - Values up to +-10^7, goal up to +-10^9: sums fit in doubles exactly
 * - Empty subsequence allowed (sum 0)
 *
 * APPROACH 1 — Brute force   O(2^n) time
 * Enumerate every subset with a bitmask and track the closest sum. Only for n <= ~20.
 *
 * APPROACH 2 — Optimal (Meet in the middle)   O(2^(n/2) * n) time, O(2^(n/2)) space
 * Split nums into two halves A and B. Enumerate all subset sums of A (2^20 at most) and all
 * of B. Sort B's sums. For each sum a in A we need b closest to goal - a: binary search
 * (or two pointers over both sorted lists) finds it in O(log). Total O(2^(n/2) * n/2).
 *
 * Dry run: nums = [5,-7,3,5], goal = 6
 *   A = [5,-7] -> sums {0, 5, -7, -2};  B = [3,5] -> sums sorted [0, 3, 5, 8]
 *   a=0: need 6 -> closest 5 or 8 -> diff 1
 *   a=5: need 1 -> closest 0 or 3 -> diff 1
 *   a=-7: need 13 -> closest 8 -> diff 5
 *   a=-2: need 8 -> exact -> diff 0   => answer 0
 *
 * EDGE CASES
 * - goal reachable exactly -> 0 (can stop early)
 * - all numbers positive with negative goal -> |goal| (empty subsequence)
 * - n = 1
 */

function subsetSums(arr) {
  const sums = [0];
  for (const x of arr) {
    const len = sums.length;
    for (let i = 0; i < len; i++) sums.push(sums[i] + x);   // each existing sum with and without x
  }
  return sums;
}

function bruteForce(nums, goal) {
  let best = Infinity;
  for (const sum of subsetSums(nums)) best = Math.min(best, Math.abs(sum - goal));
  return best;
}

function optimal(nums, goal) {
  const mid = nums.length >> 1;
  const left = subsetSums(nums.slice(0, mid));
  const right = subsetSums(nums.slice(mid)).sort((a, b) => a - b);

  let best = Infinity;
  for (const a of left) {
    const need = goal - a;
    // binary search the first right sum >= need; check it and its predecessor
    let lo = 0;
    let hi = right.length;
    while (lo < hi) {
      const m = (lo + hi) >> 1;
      if (right[m] < need) lo = m + 1;
      else hi = m;
    }
    if (lo < right.length) best = Math.min(best, Math.abs(a + right[lo] - goal));
    if (lo > 0) best = Math.min(best, Math.abs(a + right[lo - 1] - goal));
    if (best === 0) return 0;
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([5, -7, 3, 5], 6), 0);
  assert.strictEqual(solve([7, -9, 15, -2], -5), 1);
  assert.strictEqual(solve([1, 2, 3], -7), 7);
  assert.strictEqual(solve([4], 3), 1);
  assert.strictEqual(solve([10, 10], 5), 5);
  assert.strictEqual(solve([], 3), 3);
}
for (let trial = 0; trial < 200; trial++) {
  const n = Math.floor(Math.random() * 13);
  const nums = Array.from({ length: n }, () => Math.floor(Math.random() * 41) - 20);
  const goal = Math.floor(Math.random() * 101) - 50;
  assert.strictEqual(optimal(nums, goal), bruteForce(nums, goal));
}
// a full-size instance (n = 40) to show the optimal version finishes quickly
{
  const nums = Array.from({ length: 40 }, (_, i) => ((i * 7919) % 2001) - 1000);
  const start = Date.now();
  const result = optimal(nums, 123456);
  assert.ok(result >= 0);
  assert.ok(Date.now() - start < 15000);
}
console.log('✓ 09-closest-subsequence-sum passed');

module.exports = { optimal, bruteForce };

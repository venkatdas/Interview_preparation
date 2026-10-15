/**
 * 04. Closest Subsequence Sum   (LeetCode 1755 — Hard)
 *
 * PROBLEM
 * Given an integer array nums (length up to 40, values may be negative) and an
 * integer goal, choose any subsequence (any subset of positions, possibly empty)
 * so that |sum - goal| is as small as possible. Return that smallest difference.
 *
 * EXAMPLES
 * nums=[5,-7,3,5], goal=6   -> 0   (5 + -7 + 3 + 5 = 6)
 * nums=[7,-9,15,-2], goal=-5 -> 1  (7 + -9 + -2 = -4)
 * nums=[1,2,3], goal=-7     -> 7   (empty subsequence, sum 0)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n <= 40, |nums[i]| <= 1e7, |goal| <= 1e9. 2^40 is too many; 2^20 is fine.
 * - Is the empty subsequence allowed? (yes, sum 0)
 *
 * APPROACH 1 — Brute force   O(2^n) time (incremental sums), O(n) recursion
 * Recurse include/exclude for every element, track the best |sum - goal|.
 *
 * APPROACH 2 — Optimal (meet in the middle + binary search)   O(2^(n/2) * n) time, O(2^(n/2)) space
 * Split nums into halves. L = all subset sums of the left half, R = all subset sums
 * of the right half, sorted. For each l in L we want r closest to goal - l: binary
 * search R for the insertion point and check the two neighbours.
 * (Two pointers on sorted L and sorted R also works in O(2^(n/2)).)
 *
 * Dry run nums=[7,-9,15,-2], goal=-5:
 *   L (from [7,-9]) = [0, 7, -9, -2]
 *   R (from [15,-2]) sorted = [-2, 0, 13, 15]
 *   l=0  want -5 -> neighbours -2 (diff 3)        best 3
 *   l=7  want -12 -> neighbour -2 -> 7-2=5 diff 10 best 3
 *   l=-9 want 4  -> 0 gives -9 (diff 4), 13 gives 4 (diff 9)  best 3
 *   l=-2 want -3 -> -2 gives -4 (diff 1)          best 1
 *
 * EDGE CASES
 * - goal reachable exactly -> 0 (early exit)
 * - single element, empty choice may be best
 * - all negative values with a positive goal -> answer = goal (empty set)
 */
const { closestSubsetSum } = require('../../02_Implementations/meet_in_the_middle');

function bruteForce(nums, goal) {
  let best = Infinity;
  (function go(i, sum) {
    if (i === nums.length) { best = Math.min(best, Math.abs(sum - goal)); return; }
    go(i + 1, sum);
    go(i + 1, sum + nums[i]);
  })(0, 0);
  return best;
}

function optimal(nums, goal) {
  return closestSubsetSum(nums, goal);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([5, -7, 3, 5], 6), 0);
  assert.strictEqual(solve([7, -9, 15, -2], -5), 1);
  assert.strictEqual(solve([1, 2, 3], -7), 7);
  assert.strictEqual(solve([], 4), 4);
  assert.strictEqual(solve([10], 6), 4);
  assert.strictEqual(solve([-1, -2, -3], 5), 5);
}
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(4);
for (let t = 0; t < 200; t++) {
  const n = Math.floor(rand() * 14);
  const nums = Array.from({ length: n }, () => Math.floor(rand() * 201) - 100);
  const goal = Math.floor(rand() * 601) - 300;
  assert.strictEqual(optimal(nums, goal), bruteForce(nums, goal));
}
// n = 40 runs fast: powers of two can make every value 0..2^20-1 from the low part
const big = Array.from({ length: 40 }, (_, i) => (i < 20 ? 2 ** i : 3_000_000));
assert.strictEqual(optimal(big, 123456), 0);
console.log('✓ 04_closest_subsequence_sum passed');

module.exports = { optimal, bruteForce };

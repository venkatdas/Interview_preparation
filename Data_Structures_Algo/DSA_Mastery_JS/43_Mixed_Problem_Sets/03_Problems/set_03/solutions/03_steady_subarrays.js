/**
 * 03. Steady Subarrays   (Original — Medium)
 *
 * PROBLEM
 * A sensor reports readings `nums`. A contiguous non-empty stretch of readings is
 * "steady" if (max - min) within it is at most `limit`. Return the number of steady
 * subarrays.
 *
 * EXAMPLES
 * Input: nums = [1, 3, 2], limit = 1      Output: 4   Explanation: [1], [3], [2], [3,2]
 * Input: nums = [5, 5, 5], limit = 0      Output: 6   Explanation: every subarray
 * Input: nums = [], limit = 3             Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Up to 10^5 readings, so O(n^2) is too slow. limit >= 0. Values may be negative.
 * - Answer can be about n^2 / 2 (fits in a JS number).
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * For every start, extend the end while tracking running max/min; count while steady.
 *
 * APPROACH 2 — Optimal (sliding window + two monotonic deques)   O(n) time, O(n) space
 * If a window is steady, every smaller window inside it is too, so for each right end the
 * steady starts form a range [left, right]. Move right forward; keep a decreasing deque of
 * indices (front = window max) and an increasing deque (front = window min). While
 * max - min > limit, advance left and drop deque fronts that fell out. Then add
 * right - left + 1 (all steady subarrays ending at right).
 *
 * Dry run on [1, 3, 2], limit = 1:
 *   r=0: maxQ [0] minQ [0]    window [1]       +1  total 1
 *   r=1: maxQ [1] minQ [0,1]  max 3 - min 1 = 2 > 1 -> left=1, minQ [1]   +1  total 2
 *   r=2: maxQ [1,2] minQ [2]  3 - 2 = 1 ok     +2 ([3,2],[2])  total 4
 *   answer 4
 *
 * EDGE CASES
 * - empty -> 0
 * - limit huge -> n(n+1)/2
 * - limit 0 -> counts runs of equal values
 *
 * COMMON MISTAKES
 * - Storing values instead of indices in the deques: you cannot tell when they leave the window.
 * - Using strict < / > when maintaining deques: duplicates are dropped too early or too late
 *   (either works if you pop fronts by index, as here).
 */

function bruteForce(nums, limit) {
  let total = 0;
  for (let i = 0; i < nums.length; i++) {
    let mx = -Infinity, mn = Infinity;
    for (let j = i; j < nums.length; j++) {
      mx = Math.max(mx, nums[j]); mn = Math.min(mn, nums[j]);
      if (mx - mn <= limit) total++; else break;
    }
  }
  return total;
}

function optimal(nums, limit) {
  const maxQ = [], minQ = []; // indices; arrays with head pointers act as deques
  let maxH = 0, minH = 0, left = 0, total = 0;
  for (let r = 0; r < nums.length; r++) {
    while (maxQ.length > maxH && nums[maxQ[maxQ.length - 1]] <= nums[r]) maxQ.pop();
    maxQ.push(r);
    while (minQ.length > minH && nums[minQ[minQ.length - 1]] >= nums[r]) minQ.pop();
    minQ.push(r);
    while (nums[maxQ[maxH]] - nums[minQ[minH]] > limit) {
      left++;
      if (maxQ[maxH] < left) maxH++;
      if (minQ[minH] < left) minH++;
    }
    total += r - left + 1;
  }
  return total;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 3, 2], 1), 4);
  assert.strictEqual(solve([5, 5, 5], 0), 6);
  assert.strictEqual(solve([], 3), 0);
  assert.strictEqual(solve([1, 100], 1000), 3);
  assert.strictEqual(solve([-2, 2, -2], 3), 3);
  assert.strictEqual(solve([7], 0), 1);
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(303);
for (let t = 0; t < 300; t++) {
  const nums = Array.from({ length: Math.floor(rand() * 14) }, () => Math.floor(rand() * 10) - 3);
  const limit = Math.floor(rand() * 6);
  assert.strictEqual(optimal(nums, limit), bruteForce(nums, limit));
}
console.log('✓ set_03/03_steady_subarrays passed');
module.exports = { optimal, bruteForce };

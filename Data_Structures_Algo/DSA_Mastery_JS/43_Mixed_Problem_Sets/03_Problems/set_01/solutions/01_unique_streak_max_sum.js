/**
 * 01. Unique Streak Max Sum   (Original — Easy)
 *
 * PROBLEM
 * A game records the point value of every round in an array `nums`. A "streak" is any
 * k consecutive rounds whose point values are all different from each other.
 * Return the largest total of any streak. If no streak of length k exists, return null.
 *
 * EXAMPLES
 * Input: nums = [4, 2, 4, 5, 6], k = 3   Output: 15    Explanation: [4,5,6]; [4,2,4] repeats 4
 * Input: nums = [1, 1, 1], k = 2         Output: null  Explanation: every window repeats a value
 * Input: nums = [-3, -1, -2], k = 1      Output: -1    Explanation: any single round is a streak
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= k; nums may be shorter than k (then return null).
 * - Values can be negative, so "no streak" cannot be signalled with 0 -> return null.
 * - Integers fit safely in a JS number.
 *
 * APPROACH 1 — Brute force   O(n * k) time, O(k) space
 * For every start index i, build a Set of nums[i..i+k-1] and add up the window.
 * If the Set has k elements, the window is a streak; keep the best sum.
 *
 * APPROACH 2 — Optimal (fixed sliding window + frequency map)   O(n) time, O(k) space
 * Slide a window of size k. Keep a running sum and a Map value -> count, plus a counter
 * `dupes` = how many values currently appear more than once. Add the new right value,
 * remove the value that leaves on the left, update sum/dupes in O(1). A full window with
 * dupes === 0 is a streak.
 *
 * Dry run on nums = [4, 2, 4, 5, 6], k = 3:
 *   right=0 add 4   sum=4  counts{4:1}            dupes=0  (window not full)
 *   right=1 add 2   sum=6  counts{4:1,2:1}        dupes=0  (window not full)
 *   right=2 add 4   sum=10 counts{4:2,2:1}        dupes=1  full, dupes>0 -> skip
 *   right=3 add 5, drop 4  sum=11 counts{4:1,2:1,5:1} dupes=0 -> best=11
 *   right=4 add 6, drop 2  sum=15 counts{4:1,5:1,6:1} dupes=0 -> best=15
 *   answer 15
 *
 * EDGE CASES
 * - nums.length < k              -> null
 * - all values negative          -> answer is negative (do not start best at 0)
 * - k === 1                      -> max element
 *
 * COMMON MISTAKES
 * - Starting best at 0 and returning 0 for "none": wrong when every streak is negative.
 * - Checking distinctness by rebuilding a Set every step: correct but O(n * k).
 * - Forgetting to decrement `dupes` when a count drops from 2 to 1.
 */

function bruteForce(nums, k) {
  let best = null;
  for (let i = 0; i + k <= nums.length; i++) {
    const seen = new Set();
    let sum = 0;
    for (let j = i; j < i + k; j++) { seen.add(nums[j]); sum += nums[j]; }
    if (seen.size === k && (best === null || sum > best)) best = sum;
  }
  return best;
}

function optimal(nums, k) {
  const counts = new Map();
  let sum = 0, dupes = 0, best = null;
  for (let right = 0; right < nums.length; right++) {
    const v = nums[right];
    const c = (counts.get(v) || 0) + 1;
    counts.set(v, c);
    if (c === 2) dupes++; // this value just became a duplicate
    sum += v;
    if (right >= k) { // drop the value leaving the window
      const old = nums[right - k];
      const oc = counts.get(old) - 1;
      if (oc === 1) dupes--; // it stopped being a duplicate
      if (oc === 0) counts.delete(old); else counts.set(old, oc);
      sum -= old;
    }
    if (right >= k - 1 && dupes === 0 && (best === null || sum > best)) best = sum;
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([4, 2, 4, 5, 6], 3), 15);
  assert.strictEqual(solve([1, 1, 1], 2), null);
  assert.strictEqual(solve([-3, -1, -2], 1), -1);
  assert.strictEqual(solve([], 1), null);
  assert.strictEqual(solve([5, 6], 3), null);
  assert.strictEqual(solve([1, 2, 1, 2, 3], 3), 6);
  assert.strictEqual(solve([7, 7, 7, 1, 2], 2), 8);
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(101);
for (let t = 0; t < 300; t++) {
  const n = Math.floor(rand() * 12);
  const nums = Array.from({ length: n }, () => Math.floor(rand() * 9) - 4);
  const k = 1 + Math.floor(rand() * 5);
  assert.strictEqual(optimal(nums, k), bruteForce(nums, k));
}
console.log('✓ set_01/01_unique_streak_max_sum passed');
module.exports = { optimal, bruteForce };

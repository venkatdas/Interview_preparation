/**
 * 03. Rotated Range Count   (Original — Medium)
 *
 * PROBLEM
 * A list of DISTINCT integers was sorted in increasing order and then rotated at an
 * unknown point (for example [1,3,5,8,9] -> [8,9,1,3,5]). Given the rotated array `nums`
 * and two numbers lo <= hi, return how many values v in nums satisfy lo <= v <= hi.
 * Aim for O(log n).
 *
 * EXAMPLES
 * Input: nums = [8, 9, 1, 3, 5], lo = 2, hi = 8   Output: 3   Explanation: 3, 5, 8
 * Input: nums = [1, 2, 3], lo = 4, hi = 9         Output: 0
 * Input: nums = [], lo = 0, hi = 1                Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Values distinct? (yes — with duplicates, finding the rotation point can degrade to O(n))
 * - Could the array be not rotated at all? (yes, rotation by 0)
 * - Many queries on the same array later? (then find the pivot once and reuse it)
 *
 * APPROACH 1 — Brute force   O(n) time, O(1) space
 * Scan and count values inside [lo, hi].
 *
 * APPROACH 2 — Optimal (binary search for the pivot + lower/upper bound on each half)   O(log n) time, O(1) space
 * 1. Binary search the index p of the minimum: compare nums[mid] with nums[right];
 *    if nums[mid] > nums[right] the minimum is to the right of mid.
 * 2. nums[p..n-1] and nums[0..p-1] are each sorted. In each sorted part, count =
 *    upperBound(hi) - lowerBound(lo).
 *
 * Dry run on nums = [8, 9, 1, 3, 5], lo = 2, hi = 8:
 *   pivot search: l=0 r=4 mid=2 nums[2]=1 <= 5 -> r=2; l=0 r=2 mid=1 9 > 1 -> l=2; p=2
 *   part A = nums[2..4] = [1,3,5]: first >= 2 is index 3, first > 8 is index 5 -> 2
 *   part B = nums[0..1] = [8,9]:   first >= 2 is index 0, first > 8 is index 1 -> 1
 *   answer 3
 *
 * EDGE CASES
 * - empty array                 -> 0
 * - not rotated (p = 0)         -> part B is empty
 * - lo > every value or hi < every value -> 0
 *
 * COMMON MISTAKES
 * - Comparing nums[mid] with nums[left] for the pivot: breaks on the non-rotated case.
 * - Using lowerBound for hi too: excludes values equal to hi.
 */

function bruteForce(nums, lo, hi) {
  let c = 0;
  for (const v of nums) if (v >= lo && v <= hi) c++;
  return c;
}

// first index in [from, to) with nums[i] >= x (or > x when strict)
function bound(nums, from, to, x, strict) {
  while (from < to) {
    const mid = (from + to) >> 1;
    if (strict ? nums[mid] <= x : nums[mid] < x) from = mid + 1; else to = mid;
  }
  return from;
}

function optimal(nums, lo, hi) {
  const n = nums.length;
  if (n === 0 || lo > hi) return 0;
  let l = 0, r = n - 1;
  while (l < r) {
    const mid = (l + r) >> 1;
    if (nums[mid] > nums[r]) l = mid + 1; else r = mid;
  }
  const p = l;
  const countIn = (from, to) => bound(nums, from, to, hi, true) - bound(nums, from, to, lo, false);
  return countIn(p, n) + countIn(0, p);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([8, 9, 1, 3, 5], 2, 8), 3);
  assert.strictEqual(solve([1, 2, 3], 4, 9), 0);
  assert.strictEqual(solve([], 0, 1), 0);
  assert.strictEqual(solve([5], 5, 5), 1);
  assert.strictEqual(solve([3, 4, 5, 1, 2], -10, 10), 5);
  assert.strictEqual(solve([2, 1], 1, 1), 1);
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(203);
for (let t = 0; t < 400; t++) {
  const set = new Set();
  const n = Math.floor(rand() * 10);
  while (set.size < n) set.add(Math.floor(rand() * 40) - 20);
  const sorted = [...set].sort((x, y) => x - y);
  const k = n ? Math.floor(rand() * n) : 0;
  const nums = sorted.slice(k).concat(sorted.slice(0, k));
  const a = Math.floor(rand() * 50) - 25, b = a + Math.floor(rand() * 20);
  assert.strictEqual(optimal(nums, a, b), bruteForce(nums, a, b));
}
console.log('✓ set_02/03_rotated_range_count passed');
module.exports = { optimal, bruteForce };

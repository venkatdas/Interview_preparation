/**
 * 03. Equal-Sum Split   (Original — Medium)
 *
 * PROBLEM
 * You have n <= 40 integers (values may be negative, |value| <= 1e9). Put each one
 * into group A or group B. Count the assignments where sum(A) === sum(B).
 * Assignments are by index, and A/B are labelled (A={x}, B={y} differs from A={y}, B={x}).
 *
 * EXAMPLES
 * nums=[1,1]      -> 2   (A={first},B={second}) and the mirror
 * nums=[1,2,3]    -> 2   (A={1,2},B={3}) and the mirror
 * nums=[]         -> 1   (both groups empty)
 * nums=[0]        -> 2   (0 can go to either side)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Are the groups labelled? (yes; divide by 2 if the interviewer wants unlabelled)
 * - May a group be empty? (yes)
 *
 * APPROACH 1 — Brute force   O(2^n * n) time
 * Try every assignment as a bitmask; compute sum(A) - sum(B).
 *
 * APPROACH 2 — Optimal (meet in the middle over SIGNED sums + hash)   O(2^(n/2)) time and space
 * Rewrite the goal: give each value a sign, +1 for A and -1 for B. We need the
 * signed total to be 0. Split into halves. For each half enumerate all 2^(n/2)
 * signed totals. A left total x pairs with a right total y when x + y === 0,
 * so count with a frequency map of the right totals: answer += freq[-x].
 *
 * Dry run nums=[1,2,3]: left=[1] -> {+1, -1}; right=[2,3] -> {5, -1, 1, -5}
 *   x=+1 needs -1 -> 1 ; x=-1 needs +1 -> 1 ; total 2
 *
 * EDGE CASES
 * - zeros: each zero doubles the count
 * - odd total sum -> 0 immediately (nice early exit, but MITM handles it anyway)
 */

function signedSums(arr) {
  let cur = [0];
  for (const x of arr) {
    const next = new Array(cur.length * 2);
    for (let i = 0; i < cur.length; i++) { next[2 * i] = cur[i] + x; next[2 * i + 1] = cur[i] - x; }
    cur = next;
  }
  return cur;
}

function bruteForce(nums) {
  let count = 0;
  for (let mask = 0; mask < 2 ** nums.length; mask++) {
    let diff = 0;
    for (let i = 0; i < nums.length; i++) diff += mask & (1 << i) ? nums[i] : -nums[i];
    if (diff === 0) count++;
  }
  return count;
}

function optimal(nums) {
  const mid = nums.length >> 1;
  const leftSums = signedSums(nums.slice(0, mid));
  const rightSums = signedSums(nums.slice(mid));
  const freq = new Map();
  for (const y of rightSums) freq.set(y, (freq.get(y) || 0) + 1);
  let count = 0;
  for (const x of leftSums) count += freq.get(-x) || 0;
  return count;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 1]), 2);
  assert.strictEqual(solve([1, 2, 3]), 2);
  assert.strictEqual(solve([]), 1);
  assert.strictEqual(solve([0]), 2);
  assert.strictEqual(solve([0, 0, 0]), 8);
  assert.strictEqual(solve([1, 2]), 0);
  assert.strictEqual(solve([-3, 3]), 2);       // both in A (sum 0 = sum of empty B) or both in B
  assert.strictEqual(solve([5, 5, 10]), 2);    // {5,5} vs {10}, and the mirror
}
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(3);
for (let t = 0; t < 200; t++) {
  const n = Math.floor(rand() * 14);
  const nums = Array.from({ length: n }, () => Math.floor(rand() * 9) - 4);
  assert.strictEqual(optimal(nums), bruteForce(nums));
}
// n = 40 of ones: choose 20 for A -> C(40,20)
assert.strictEqual(optimal(new Array(40).fill(1)), 137846528820);
console.log('✓ 03_equal_sum_split passed');

module.exports = { optimal, bruteForce, signedSums };

/**
 * 02. Shortest Burst   (Original — Hard)
 *
 * PROBLEM
 * A trading bot records the profit of each minute in `nums` (can be negative). A "burst"
 * is a contiguous run of minutes whose total profit is at least k. Return the length of
 * the shortest burst, or -1 if none exists.
 *
 * EXAMPLES
 * Input: nums = [2, -1, 2], k = 3          Output: 3
 * Input: nums = [1, 2, -5, 4, 1], k = 5    Output: 2   Explanation: [4, 1]
 * Input: nums = [-1, -2], k = 1            Output: -1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 10^5, values in [-10^5, 10^5], k >= 1.
 * - Negative profits are allowed (that is what makes it hard).
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * For each start, extend the end with a running sum; stop at the first end reaching k.
 *
 * APPROACH 2 — Optimal (prefix sums + monotonic deque of candidate starts)   O(n) time, O(n) space
 * Prefix sums P (P[0] = 0). We want the shortest j - i with P[j] - P[i] >= k, i < j.
 * Keep a deque of start indices with INCREASING prefix values:
 *   - while P[j] - P[front] >= k: record j - front and pop the front (any later j would
 *     only give a longer burst for that start);
 *   - while P[back] >= P[j]: pop the back (j is a later AND not-larger start, so it
 *     dominates);
 *   - push j.
 *
 * Dry run on [1, 2, -5, 4, 1], k = 5:  P = [0, 1, 3, -2, 2, 3]
 *   j=0 dq [0]
 *   j=1 P=1: 1-0<5; push        dq [0,1]
 *   j=2 P=3: 3-0<5; push        dq [0,1,2]
 *   j=3 P=-2: pop backs 2,1,0 (all >= -2); push  dq [3]
 *   j=4 P=2: 2-(-2)=4<5; push   dq [3,4]
 *   j=5 P=3: 3-(-2)=5>=5 -> len 2, pop 3; 3-2=1<5; pop back 4 (2 >= 3? no) push dq [4,5]
 *   answer 2
 *
 * EDGE CASES
 * - a single element >= k -> 1
 * - all negative -> -1
 * - large positive at the end after big negatives
 *
 * COMMON MISTAKES
 * - Using the classic two-pointer window: with negatives, shrinking may skip answers.
 * - Popping the back with > instead of >= (keeps a dominated start; still correct, slower).
 */

function bruteForce(nums, k) {
  let best = Infinity;
  for (let i = 0; i < nums.length; i++) {
    let s = 0;
    for (let j = i; j < nums.length && j - i + 1 < best; j++) {
      s += nums[j];
      if (s >= k) { best = j - i + 1; break; }
    }
  }
  return best === Infinity ? -1 : best;
}

function optimal(nums, k) {
  const n = nums.length;
  const P = [0];
  for (const v of nums) P.push(P[P.length - 1] + v);
  const dq = new Array(n + 1);
  let head = 0, tail = 0, best = Infinity;
  for (let j = 0; j <= n; j++) {
    while (head < tail && P[j] - P[dq[head]] >= k) { best = Math.min(best, j - dq[head]); head++; }
    while (head < tail && P[dq[tail - 1]] >= P[j]) tail--;
    dq[tail++] = j;
  }
  return best === Infinity ? -1 : best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([2, -1, 2], 3), 3);
  assert.strictEqual(solve([1, 2, -5, 4, 1], 5), 2);
  assert.strictEqual(solve([-1, -2], 1), -1);
  assert.strictEqual(solve([], 1), -1);
  assert.strictEqual(solve([10], 10), 1);
  assert.strictEqual(solve([84, -37, 32, 40, 95], 167), 3);
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(602);
for (let t = 0; t < 400; t++) {
  const nums = Array.from({ length: Math.floor(rand() * 12) }, () => Math.floor(rand() * 21) - 8);
  const k = 1 + Math.floor(rand() * 25);
  assert.strictEqual(optimal(nums, k), bruteForce(nums, k));
}
console.log('✓ set_06/02_shortest_burst passed');
module.exports = { optimal, bruteForce };

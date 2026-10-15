/**
 * 02. Shortest Unsorted Continuous Subarray   (LeetCode 581 — Medium)
 *
 * PROBLEM
 * Find the length of the shortest contiguous subarray such that sorting only that
 * subarray makes the whole array sorted in non-decreasing order.
 *
 * EXAMPLES
 * Input: [2,6,4,8,10,9,15]   Output: 5   Explanation: sort [6,4,8,10,9]
 * Input: [1,2,3,4]           Output: 0
 * Input: [1]                 Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Non-decreasing counts as sorted (duplicates allowed)
 * - n up to 10^4; O(n log n) via sorting is accepted, O(n) is the follow-up
 *
 * APPROACH 1 — Brute force (sort and compare)   O(n log n) time, O(n) space
 * Sort a copy; the answer spans from the first index where the arrays differ to the last.
 *
 * APPROACH 2 — Optimal (Monotonic stack, then O(1)-space prefix-max / suffix-min)   O(n)
 * Stack version: scan left to right with an increasing stack; whenever nums[i] is smaller
 * than the stack top, every popped index is "out of place", so left = min(left, popped).
 * Mirror with a decreasing stack from the right to get `right`.
 * O(1)-space version (same idea without a stack): scanning left to right, an element that is
 * smaller than the running max is misplaced -> right = i. Scanning right to left, an element
 * larger than the running min is misplaced -> left = i. Answer right - left + 1 (or 0).
 *
 * Dry run on [2,6,4,8,10,9,15] (O(1)-space version):
 *   left-to-right (running max):
 *     i=0: 2 (max 2)   i=1: 6 (max 6)   i=2: 4 < 6 -> right = 2   i=3: 8 (max 8)
 *     i=4: 10 (max 10) i=5: 9 < 10 -> right = 5   i=6: 15 (max 15)            => right = 5
 *   right-to-left (running min):
 *     i=6: 15 (min 15) i=5: 9 (min 9)   i=4: 10 > 9 -> left = 4   i=3: 8 (min 8)
 *     i=2: 4 (min 4)   i=1: 6 > 4 -> left = 1   i=0: 2 (min 2)                 => left = 1
 *   answer 5 - 1 + 1 = 5
 *
 * EDGE CASES
 * - already sorted -> 0
 * - single element -> 0
 * - duplicates: [1,3,2,2,2] -> 4
 * - fully reversed -> n
 */

function bruteForce(nums) {
  const sorted = nums.slice().sort((a, b) => a - b);
  let left = 0;
  while (left < nums.length && nums[left] === sorted[left]) left++;
  if (left === nums.length) return 0;
  let right = nums.length - 1;
  while (nums[right] === sorted[right]) right--;
  return right - left + 1;
}

// monotonic stack version, O(n) time, O(n) space
function withStack(nums) {
  const n = nums.length;
  let left = n;
  let right = -1;
  const stack = [];
  for (let i = 0; i < n; i++) {                         // increasing stack
    while (stack.length && nums[stack[stack.length - 1]] > nums[i]) left = Math.min(left, stack.pop());
    stack.push(i);
  }
  stack.length = 0;
  for (let i = n - 1; i >= 0; i--) {                    // decreasing stack
    while (stack.length && nums[stack[stack.length - 1]] < nums[i]) right = Math.max(right, stack.pop());
    stack.push(i);
  }
  return right > left ? right - left + 1 : 0;
}

// prefix-max / suffix-min version, O(n) time, O(1) space
function optimal(nums) {
  const n = nums.length;
  let right = -1;
  let maxSoFar = -Infinity;
  for (let i = 0; i < n; i++) {
    if (nums[i] < maxSoFar) right = i;    // smaller than something before it -> must move
    else maxSoFar = nums[i];
  }
  let left = n;
  let minSoFar = Infinity;
  for (let i = n - 1; i >= 0; i--) {
    if (nums[i] > minSoFar) left = i;     // larger than something after it -> must move
    else minSoFar = nums[i];
  }
  return right > left ? right - left + 1 : 0;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, withStack, optimal]) {
  assert.strictEqual(solve([2, 6, 4, 8, 10, 9, 15]), 5);
  assert.strictEqual(solve([1, 2, 3, 4]), 0);
  assert.strictEqual(solve([1]), 0);
  assert.strictEqual(solve([1, 3, 2, 2, 2]), 4);
  assert.strictEqual(solve([3, 2, 1]), 3);
  assert.strictEqual(solve([1, 2, 3, 3, 3]), 0);
  assert.strictEqual(solve([2, 1]), 2);
}
for (let trial = 0; trial < 200; trial++) {
  const n = 1 + Math.floor(Math.random() * 12);
  const nums = Array.from({ length: n }, () => Math.floor(Math.random() * 6));
  assert.strictEqual(optimal(nums), bruteForce(nums));
  assert.strictEqual(withStack(nums), bruteForce(nums));
}
console.log('✓ 02-shortest-unsorted-continuous-subarray passed');

module.exports = { optimal, bruteForce, withStack };

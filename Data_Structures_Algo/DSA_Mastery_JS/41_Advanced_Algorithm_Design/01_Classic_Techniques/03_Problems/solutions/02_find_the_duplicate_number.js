/**
 * 02. Find the Duplicate Number   (LeetCode 287 — Medium)
 *
 * PROBLEM
 * nums has n + 1 integers, each in the range [1, n]. Exactly one value is repeated (it may
 * appear more than twice). Find it WITHOUT modifying the array and using O(1) extra space.
 *
 * EXAMPLES
 * Input: [1,3,4,2,2]   Output: 2
 * Input: [3,1,3,4,2]   Output: 3
 * Input: [3,3,3,3,3]   Output: 3
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can we sort / modify? (no) Extra space? (O(1)) -> rules out Set and sorting
 * - Exactly one duplicated value (but possibly many copies)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * Compare every pair. (A sort or a Set would be O(n log n) / O(n) space - not allowed.)
 * Also possible: binary search on the VALUE - count how many elements are <= mid; if more
 * than mid, the duplicate is in [1, mid]. O(n log n), O(1) space.
 *
 * APPROACH 2 — Optimal (Floyd's tortoise and hare)   O(n) time, O(1) space
 * View index i as a node with an edge i -> nums[i]. Index 0 is never a target (values are
 * >= 1), so starting at 0 we walk into a rho-shaped path: a tail, then a cycle. The node
 * where the tail enters the cycle is pointed to by two indices = the duplicate value.
 * Phase 1: slow += 1 step, fast += 2 steps until they meet (inside the cycle).
 * Phase 2: reset slow to the start; move both one step at a time; they meet at the entrance.
 *
 * Dry run on [1,3,4,2,2]  (walk on VALUES: next(x) = nums[x], start at nums[0] = 1):
 *   path: 1 -> 3 -> 2 -> 4 -> 2 -> 4 -> ...      (tail 1, 3; cycle 2 <-> 4; entrance 2)
 *   phase 1 (slow x1, fast x2), both start at 1:
 *     slow = 3, fast = 2;   slow = 2, fast = 2  -> meet at 2
 *   phase 2 (both x1), slow restarts at nums[0] = 1, fast stays at 2:
 *     slow = 3, fast = 4;   slow = 2, fast = 2  -> meet at 2 = the duplicate
 *
 * EDGE CASES
 * - duplicate appears many times
 * - n = 1: [1,1] -> 1
 * - duplicate is the largest or smallest value
 */

function bruteForce(nums) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) if (nums[i] === nums[j]) return nums[i];
  }
  return -1;
}

function binarySearchOnValue(nums) {
  let lo = 1;
  let hi = nums.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    let count = 0;
    for (const x of nums) if (x <= mid) count++;
    if (count > mid) hi = mid;      // pigeonhole: too many values in [1, mid]
    else lo = mid + 1;
  }
  return lo;
}

function optimal(nums) {
  let slow = nums[0];
  let fast = nums[0];
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);
  slow = nums[0];
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[fast];
  }
  return slow;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, binarySearchOnValue, optimal]) {
  assert.strictEqual(solve([1, 3, 4, 2, 2]), 2);
  assert.strictEqual(solve([3, 1, 3, 4, 2]), 3);
  assert.strictEqual(solve([3, 3, 3, 3, 3]), 3);
  assert.strictEqual(solve([1, 1]), 1);
  assert.strictEqual(solve([2, 2, 1]), 2);
  assert.strictEqual(solve([4, 1, 2, 3, 4]), 4);
}
for (let trial = 0; trial < 300; trial++) {
  const n = 1 + Math.floor(Math.random() * 12);
  const dup = 1 + Math.floor(Math.random() * n);
  const others = Array.from({ length: n }, (_, i) => i + 1).filter((v) => v !== dup);
  const keep = others.slice(0, Math.floor(Math.random() * (others.length + 1)));
  const nums = keep.slice();
  while (nums.length < n + 1) nums.push(dup);
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  assert.strictEqual(optimal(nums), dup);
  assert.strictEqual(binarySearchOnValue(nums), dup);
  assert.strictEqual(bruteForce(nums), dup);
}
console.log('✓ 02-find-the-duplicate-number passed');

module.exports = { optimal, bruteForce, binarySearchOnValue };

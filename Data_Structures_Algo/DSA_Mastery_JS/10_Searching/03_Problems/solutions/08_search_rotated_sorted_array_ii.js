/**
 * 08. Search in Rotated Sorted Array II   (LeetCode 81 — Medium)
 *
 * PROBLEM
 * Same as problem 07, but the array MAY contain duplicates. Return true if target
 * exists, false otherwise.
 *
 * EXAMPLES
 * Input: [2,5,6,0,0,1,2], 0   Output: true
 * Input: [2,5,6,0,0,1,2], 3   Output: false
 * Input: [1,0,1,1,1], 0       Output: true   (the tricky case: nums[left] === nums[mid] === nums[right])
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Duplicates allowed -> worst case becomes O(n) ([1,1,1,1,1,1,0,1]: no half is provably sorted)
 * - Return boolean, not index
 *
 * APPROACH 1 — Brute force   O(n)
 * nums.includes(target).
 *
 * APPROACH 2 — Optimal (rotated search + shrink on ties)   O(log n) average, O(n) worst, O(1) space
 * Same as problem 07 with one extra rule: when nums[left] === nums[mid] === nums[right]
 * we cannot tell which half is sorted, so just drop both ends (left++, right--) and
 * continue. Neither can be the target (we already compared mid). Everything else is
 * identical: decide the sorted half, check the range, move.
 *
 * Dry run [1,0,1,1,1], target 0:
 *   l=0 r=4 mid=2 (1): nums[0]=1 === nums[2] === nums[4] -> l=1 r=3
 *   l=1 r=3 mid=2 (1): nums[1]=0 <= 1 -> left half [0,1] sorted; 0 <= 0 < 1 yes -> r=1
 *   l=1 r=1 mid=1 (0) === target -> true
 *
 * EDGE CASES
 * - all duplicates and target absent -> O(n) but correct
 * - [] -> false
 * - target at the ends
 */

function bruteForce(nums, target) {
  return nums.includes(target);
}

function optimal(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = left + ((right - left) >> 1);
    if (nums[mid] === target) return true;

    if (nums[left] === nums[mid] && nums[mid] === nums[right]) {
      left++; right--;                               // cannot decide: shrink both ends
    } else if (nums[left] <= nums[mid]) {            // left half sorted
      if (nums[left] <= target && target < nums[mid]) right = mid - 1;
      else left = mid + 1;
    } else {                                         // right half sorted
      if (nums[mid] < target && target <= nums[right]) left = mid + 1;
      else right = mid - 1;
    }
  }
  return false;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([2, 5, 6, 0, 0, 1, 2], 0), true);
  assert.strictEqual(solve([2, 5, 6, 0, 0, 1, 2], 3), false);
  assert.strictEqual(solve([1, 0, 1, 1, 1], 0), true);
  assert.strictEqual(solve([1, 1, 1, 0, 1], 0), true);
  assert.strictEqual(solve([1, 1, 1, 1], 2), false);
  assert.strictEqual(solve([], 1), false);
  assert.strictEqual(solve([1], 1), true);
  assert.strictEqual(solve([3, 1], 1), true);
  assert.strictEqual(solve([1, 3, 1, 1, 1], 3), true);
}
for (let trial = 0; trial < 500; trial++) {
  const n = 1 + Math.floor(Math.random() * 10);
  const base = Array.from({ length: n }, () => Math.floor(Math.random() * 4)).sort((a, b) => a - b);
  const k = Math.floor(Math.random() * n);
  const rotated = base.slice(k).concat(base.slice(0, k));
  const target = Math.floor(Math.random() * 5);
  assert.strictEqual(optimal(rotated, target), rotated.includes(target), JSON.stringify([rotated, target]));
}
console.log('✓ 08-search-rotated-sorted-array-ii passed');

module.exports = { optimal, bruteForce };

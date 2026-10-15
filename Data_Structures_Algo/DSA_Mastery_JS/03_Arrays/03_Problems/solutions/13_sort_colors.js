/**
 * 13. Sort Colors   (LeetCode 75 — Medium)
 *
 * PROBLEM
 * An array holds only the values 0, 1 and 2 (red, white, blue). Sort it in place so
 * that all 0s come first, then all 1s, then all 2s. Do not use the library sort.
 *
 * EXAMPLES
 * Input: [2, 0, 2, 1, 1, 0]   Output: [0, 0, 1, 1, 2, 2]
 * Input: [2, 0, 1]            Output: [0, 1, 2]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Only the three values 0, 1, 2? (yes)
 * - One pass and O(1) space? (that is the follow-up; counting sort is two passes)
 * - Stable sort needed? (no, values are indistinguishable)
 *
 * APPROACH 1 — Brute force (counting sort)   O(n) time, O(1) space, TWO passes
 * Count how many 0s, 1s and 2s. Then overwrite the array: that many 0s, then 1s, then 2s.
 * Already linear, but it is two passes and does not generalize to "partition around a pivot".
 *
 * APPROACH 2 — Optimal (Dutch national flag, three pointers)   O(n) time, O(1) space, ONE pass
 * Keep three regions:
 *   [0 .. low-1]   all 0s
 *   [low .. mid-1] all 1s
 *   [mid .. high]  unknown
 *   [high+1 .. n-1] all 2s
 * Look at nums[mid]:
 *   0 -> swap with nums[low], low++, mid++  (the swapped-in value is a known 1 or the same 0)
 *   1 -> mid++
 *   2 -> swap with nums[high], high--       (do NOT move mid: the swapped-in value is unknown)
 * Stop when mid > high.
 *
 * Dry run on [2, 0, 2, 1, 1, 0]:
 *   low=0 mid=0 high=5: 2 -> swap(0,5) [0,0,2,1,1,2] high=4
 *   low=0 mid=0 high=4: 0 -> swap(0,0) low=1 mid=1
 *   low=1 mid=1 high=4: 0 -> swap(1,1) low=2 mid=2
 *   low=2 mid=2 high=4: 2 -> swap(2,4) [0,0,1,1,2,2] high=3
 *   low=2 mid=2 high=3: 1 -> mid=3
 *   low=2 mid=3 high=3: 1 -> mid=4
 *   mid > high -> done: [0,0,1,1,2,2]
 *
 * EDGE CASES
 * - Already sorted
 * - All the same value
 * - Single element / empty
 * - Only two of the three values present
 */

function bruteForce(nums) {
  const counts = [0, 0, 0];
  for (const num of nums) counts[num]++;
  let write = 0;
  for (let color = 0; color <= 2; color++) {
    for (let c = 0; c < counts[color]; c++) nums[write++] = color;
  }
  return nums;
}

function optimal(nums) {
  let low = 0;                 // next slot for a 0
  let mid = 0;                 // current element being examined
  let high = nums.length - 1;  // next slot for a 2

  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;                   // whatever came from `low` was already examined (a 1 or this 0)
    } else if (nums[mid] === 2) {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;                  // mid stays: the value that came from `high` is still unknown
    } else {
      mid++;                   // a 1 is already in the right region
    }
  }
  return nums;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([2, 0, 2, 1, 1, 0]), [0, 0, 1, 1, 2, 2]);
  assert.deepStrictEqual(solve([2, 0, 1]), [0, 1, 2]);
  assert.deepStrictEqual(solve([0, 1, 2]), [0, 1, 2]);
  assert.deepStrictEqual(solve([1, 1, 1]), [1, 1, 1]);
  assert.deepStrictEqual(solve([2, 2, 0, 0]), [0, 0, 2, 2]);
  assert.deepStrictEqual(solve([1]), [1]);
  assert.deepStrictEqual(solve([]), []);
  assert.deepStrictEqual(solve([2, 1, 2, 0, 2]), [0, 1, 2, 2, 2]);
}
console.log('✓ 13-sort-colors passed');

module.exports = { optimal, bruteForce };

/**
 * 16. Sort Colors   (LeetCode 75 — Medium)
 *
 * PROBLEM
 * Given an array with values 0, 1 and 2 (red, white, blue), sort it in place so that
 * all 0s come first, then 1s, then 2s. Do NOT use the library sort. One pass, O(1) space.
 *
 * EXAMPLES
 * Input: [2, 0, 2, 1, 1, 0]   Output: [0, 0, 1, 1, 2, 2]
 * Input: [2, 0, 1]            Output: [0, 1, 2]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Only values 0, 1, 2? (yes)
 * - One pass required? (follow-up: yes, that is the Dutch national flag algorithm)
 * - In place? (yes)
 *
 * APPROACH 1 — Brute force (counting sort, two passes)   O(n) time, O(1) space
 * Count the 0s, 1s and 2s, then overwrite the array with that many of each.
 * Already O(n), but two passes and it only works because the values are tiny.
 *
 * APPROACH 2 — Optimal (Dutch national flag, three pointers, one pass)   O(n) time, O(1) space
 * Maintain three regions with pointers low, mid, high:
 *   [0, low)      all 0s
 *   [low, mid)    all 1s
 *   [mid, high]   unknown (mid scans this)
 *   (high, n)     all 2s
 * Look at nums[mid]:
 *   0 -> swap with nums[low], low++, mid++ (the swapped-in element came from the 1s region or is mid itself, so it's known)
 *   1 -> mid++
 *   2 -> swap with nums[high], high-- (do NOT move mid: the swapped-in element is unknown)
 * Stop when mid > high.
 *
 * Dry run on [2, 0, 2, 1, 1, 0]:
 *   low=0 mid=0 high=5: nums[0]=2 -> swap with nums[5]: [0,0,2,1,1,2] high=4
 *   mid=0: 0 -> swap(low=0,mid=0) no-op, low=1 mid=1
 *   mid=1: 0 -> swap(1,1), low=2 mid=2
 *   mid=2: 2 -> swap with nums[4]: [0,0,1,1,2,2] high=3
 *   mid=2: 1 -> mid=3
 *   mid=3: 1 -> mid=4 > high=3 stop
 *   [0, 0, 1, 1, 2, 2]
 *
 * EDGE CASES
 * - Already sorted
 * - All one value
 * - Single element / empty
 * - No 1s at all: [2, 0, 2, 0]
 */

function bruteForce(nums) {
  const counts = [0, 0, 0];
  for (const value of nums) counts[value]++;
  let write = 0;
  for (let color = 0; color <= 2; color++) {
    for (let k = 0; k < counts[color]; k++) nums[write++] = color;
  }
  return nums;
}

function optimal(nums) {
  let low = 0;
  let mid = 0;
  let high = nums.length - 1;

  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++;
      mid++;
    } else if (nums[mid] === 2) {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--; // mid stays: the element we just pulled from `high` is unexamined
    } else {
      mid++; // a 1 is already in the right region
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
  assert.deepStrictEqual(solve([2, 0, 2, 0]), [0, 0, 2, 2]);
  assert.deepStrictEqual(solve([]), []);
  assert.deepStrictEqual(solve([2]), [2]);
  assert.deepStrictEqual(solve([2, 2, 1, 1, 0, 0]), [0, 0, 1, 1, 2, 2]);
}
console.log('✓ 16-sort-colors passed');

module.exports = { optimal, bruteForce };

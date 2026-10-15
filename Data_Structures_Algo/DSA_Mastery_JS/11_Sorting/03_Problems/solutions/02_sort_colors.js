/**
 * 02. Sort Colors   (LeetCode 75 — Medium)
 *
 * PROBLEM
 * An array contains only 0s, 1s and 2s (red, white, blue). Sort it in place so all
 * 0s come first, then 1s, then 2s. Do it in ONE pass with O(1) extra space, without
 * using the library sort.
 *
 * EXAMPLES
 * Input: [2,0,2,1,1,0]   Output: [0,0,1,1,2,2]
 * Input: [2,0,1]         Output: [0,1,2]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Exactly three distinct values? (yes: 0, 1, 2)
 * - Must be in place? (yes) One pass? (the follow-up asks for it)
 *
 * APPROACH 1 — Brute force (counting sort, two passes)   O(n) time, O(1) space
 * Count the 0s, 1s, 2s, then overwrite the array: count0 zeros, count1 ones, count2 twos.
 * Two passes, but simple and also O(n). Interviewers accept it, then ask for one pass.
 *
 * APPROACH 2 — Optimal (Dutch National Flag, three pointers)   O(n) time, O(1) space
 * Keep three regions:  [0..low-1] = 0s   [low..mid-1] = 1s   [high+1..end] = 2s
 * `mid` scans the unknown region [mid..high]:
 *   nums[mid] === 0 -> swap with nums[low], low++, mid++   (the swapped-in value was a 1 or already seen)
 *   nums[mid] === 1 -> mid++
 *   nums[mid] === 2 -> swap with nums[high], high--         (do NOT move mid: the new nums[mid] is unseen)
 * Loop while mid <= high.
 *
 * Dry run [2,0,2,1,1,0]:  low=0 mid=0 high=5
 *   mid=0 val 2 -> swap(0,5) -> [0,0,2,1,1,2] high=4
 *   mid=0 val 0 -> swap(0,0) low=1 mid=1
 *   mid=1 val 0 -> swap(1,1) low=2 mid=2
 *   mid=2 val 2 -> swap(2,4) -> [0,0,1,1,2,2] high=3
 *   mid=2 val 1 -> mid=3
 *   mid=3 val 1 -> mid=4 > high=3 -> stop. Sorted.
 *
 * EDGE CASES
 * - [] -> []
 * - all one colour [1,1,1]
 * - already sorted; reverse sorted [2,2,1,1,0,0]
 */

function bruteForce(nums) {
  const counts = [0, 0, 0];
  for (const value of nums) counts[value]++;
  let index = 0;
  for (let colour = 0; colour < 3; colour++) {
    for (let c = 0; c < counts[colour]; c++) nums[index++] = colour;
  }
  return nums;
}

function optimal(nums) {
  let low = 0, mid = 0, high = nums.length - 1;
  while (mid <= high) {
    if (nums[mid] === 0) {
      [nums[low], nums[mid]] = [nums[mid], nums[low]];
      low++; mid++;
    } else if (nums[mid] === 2) {
      [nums[mid], nums[high]] = [nums[high], nums[mid]];
      high--;                    // mid stays: the element swapped in has not been examined yet
    } else {
      mid++;                     // a 1 is already in the middle region
    }
  }
  return nums;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([2, 0, 2, 1, 1, 0]), [0, 0, 1, 1, 2, 2]);
  assert.deepStrictEqual(solve([2, 0, 1]), [0, 1, 2]);
  assert.deepStrictEqual(solve([]), []);
  assert.deepStrictEqual(solve([1]), [1]);
  assert.deepStrictEqual(solve([1, 1, 1]), [1, 1, 1]);
  assert.deepStrictEqual(solve([2, 2, 1, 1, 0, 0]), [0, 0, 1, 1, 2, 2]);
  assert.deepStrictEqual(solve([0, 1, 2]), [0, 1, 2]);
  assert.deepStrictEqual(solve([2, 2, 2, 0]), [0, 2, 2, 2]);
}
for (let trial = 0; trial < 100; trial++) {
  const input = Array.from({ length: Math.floor(Math.random() * 30) }, () => Math.floor(Math.random() * 3));
  assert.deepStrictEqual(optimal([...input]), [...input].sort((a, b) => a - b));
}
console.log('✓ 02-sort-colors passed');

module.exports = { optimal, bruteForce };

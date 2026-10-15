/**
 * 17. 3Sum   (LeetCode 15 — Medium)
 *
 * PROBLEM
 * Given an integer array, return all UNIQUE triplets [a, b, c] (taken from three
 * different indices) such that a + b + c === 0. The order of triplets does not matter.
 *
 * Also covered in 06_Two_Pointers; here it shows how "sort first" turns an array
 * problem into a two-pointer problem.
 *
 * EXAMPLES
 * Input: [-1, 0, 1, 2, -1, -4]   Output: [[-1, -1, 2], [-1, 0, 1]]
 * Input: [0, 1, 1]               Output: []
 * Input: [0, 0, 0]               Output: [[0, 0, 0]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can the same VALUE be used in a triplet if it appears at different indices? (yes: [-1,-1,2])
 * - Must triplets be unique? (yes, no duplicate triplets in the output)
 * - Can I sort / modify the input? (yes)
 * - Output order? (any; tests sort before comparing)
 *
 * APPROACH 1 — Brute force   O(n^3) time, O(k) space for the answer
 * Three nested loops over i < j < k. Use a Set of sorted-triplet strings to drop duplicates.
 *
 * APPROACH 2 — Optimal (sort + two pointers)   O(n^2) time, O(1) extra space (ignoring output and sort)
 * Sort the array. Fix the first number nums[i]. Now we need two numbers to the RIGHT
 * of i that sum to -nums[i]: a sorted array lets us do that with two pointers in O(n):
 *   left = i + 1, right = n - 1
 *   sum < 0 -> need bigger  -> left++
 *   sum > 0 -> need smaller -> right--
 *   sum === 0 -> record, then move BOTH and skip duplicates
 * Skip duplicate values for i as well, so each unique triplet is produced once.
 * Early exit: if nums[i] > 0 nothing to its right can bring the sum back to 0.
 *
 * Dry run on sorted [-4, -1, -1, 0, 1, 2]:
 *   i=0 (-4): left=1(-1) right=5(2) sum=-3 <0 -> left=2(-1) sum=-3 -> left=3(0) sum=-2 -> left=4(1) sum=-1 -> left=5 stop
 *   i=1 (-1): left=2(-1) right=5(2) sum=0 -> record [-1,-1,2]; left=3 right=4
 *             left=3(0) right=4(1) sum=0 -> record [-1,0,1]; left=4 right=3 stop
 *   i=2 (-1): same as i=1 -> SKIP (duplicate first value)
 *   i=3 (0):  left=4(1) right=5(2) sum=3 > 0 -> right=4 stop
 *   i=4 (1):  nums[i] > 0 -> break
 *   result [[-1,-1,2],[-1,0,1]]
 *
 * EDGE CASES
 * - Fewer than 3 elements -> []
 * - All zeros [0,0,0,0] -> exactly one triplet [0,0,0]
 * - No solution
 * - Many duplicates: must not produce the same triplet twice
 */

function bruteForce(nums) {
  const seen = new Set();
  const result = [];
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      for (let k = j + 1; k < nums.length; k++) {
        if (nums[i] + nums[j] + nums[k] === 0) {
          const triplet = [nums[i], nums[j], nums[k]].sort((a, b) => a - b);
          const key = triplet.join(',');
          if (!seen.has(key)) {
            seen.add(key);
            result.push(triplet);
          }
        }
      }
    }
  }
  return result;
}

function optimal(nums) {
  nums.sort((a, b) => a - b); // sorting makes duplicates adjacent and enables two pointers
  const result = [];

  for (let i = 0; i < nums.length - 2; i++) {
    if (nums[i] > 0) break;                        // everything to the right is also > 0
    if (i > 0 && nums[i] === nums[i - 1]) continue; // same first value -> same triplets

    let left = i + 1;
    let right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum < 0) {
        left++;
      } else if (sum > 0) {
        right--;
      } else {
        result.push([nums[i], nums[left], nums[right]]);
        left++;
        right--;
        while (left < right && nums[left] === nums[left - 1]) left++;    // skip duplicate second values
        while (left < right && nums[right] === nums[right + 1]) right--; // skip duplicate third values
      }
    }
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
function normalize(triplets) {
  return triplets
    .map((t) => [...t].sort((a, b) => a - b))
    .sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
}
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(normalize(solve([-1, 0, 1, 2, -1, -4])), [[-1, -1, 2], [-1, 0, 1]]);
  assert.deepStrictEqual(normalize(solve([0, 1, 1])), []);
  assert.deepStrictEqual(normalize(solve([0, 0, 0])), [[0, 0, 0]]);
  assert.deepStrictEqual(normalize(solve([0, 0, 0, 0])), [[0, 0, 0]]);
  assert.deepStrictEqual(normalize(solve([1, 2])), []);
  assert.deepStrictEqual(normalize(solve([])), []);
  assert.deepStrictEqual(normalize(solve([-2, 0, 1, 1, 2])), [[-2, 0, 2], [-2, 1, 1]]);
  assert.deepStrictEqual(normalize(solve([3, -2, 1, 0])), []);
}
console.log('✓ 17-3sum passed');

module.exports = { optimal, bruteForce };

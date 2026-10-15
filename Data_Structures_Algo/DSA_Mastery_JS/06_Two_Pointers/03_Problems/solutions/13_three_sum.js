/**
 * 13. 3Sum   (LeetCode 15 — Medium)
 *
 * PROBLEM
 * Given an integer array nums, return all UNIQUE triplets [a, b, c] (by value) such that
 * a + b + c === 0, using three different indices.
 *
 * EXAMPLES
 * Input: [-1, 0, 1, 2, -1, -4]   Output: [[-1, -1, 2], [-1, 0, 1]]
 * Input: [0, 1, 1]               Output: []
 * Input: [0, 0, 0]               Output: [[0, 0, 0]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Unique by VALUE, so [-1,0,1] once even if -1 appears twice? (yes)
 * - Order of triplets / inside triplets? (any; tests sort them)
 * - Can I sort the input? (yes, O(n log n) is dwarfed by the O(n^2) main loop)
 *
 * APPROACH 1 — Brute force   O(n^3) time, O(k) space for de-duplication
 * Three nested loops, collect triplets that sum to 0, de-duplicate with a Set of sorted keys.
 *
 * APPROACH 2 — Optimal (sort, fix one, two pointers on the rest)   O(n^2) time, O(1) extra space
 *   1. Sort.
 *   2. For each index i (the "fixed" first element):
 *      - if nums[i] > 0, stop: three positives can't sum to 0.
 *      - if nums[i] === nums[i - 1], skip: we already produced all triplets starting with this value.
 *      - run Two Sum II on nums[i+1..] for target -nums[i] with left/right pointers.
 *      - on a hit, record it, then skip duplicates on BOTH sides before continuing.
 *
 * Dry run on sorted [-4, -1, -1, 0, 1, 2]:
 *   i=0 (-4): target 4. L=1(-1) R=5(2): 1 < 4 -> L++... never reaches 4. nothing.
 *   i=1 (-1): target 1. L=2(-1) R=5(2): 1 == 1 -> record [-1,-1,2]; L=3, R=4
 *             L=3(0) R=4(1): 1 == 1 -> record [-1,0,1]; L=4 R=3 stop
 *   i=2 (-1): same as previous -> skip
 *   i=3 (0):  target 0. L=4(1) R=5(2): 3 > 0 -> R-- -> stop
 *   i=4 (1):  > 0 -> break
 *   [[-1,-1,2],[-1,0,1]]
 *
 * EDGE CASES
 * - Fewer than 3 numbers -> []
 * - All zeros -> one triplet [0,0,0]
 * - No solution -> []
 * - Heavy duplicates: [-2,0,0,2,2] -> [[-2,0,2]] exactly once
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
  const sorted = [...nums].sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < sorted.length - 2; i++) {
    if (sorted[i] > 0) break;                       // all remaining are positive
    if (i > 0 && sorted[i] === sorted[i - 1]) continue; // duplicate fixed element

    let left = i + 1;
    let right = sorted.length - 1;
    const target = -sorted[i];

    while (left < right) {
      const sum = sorted[left] + sorted[right];
      if (sum === target) {
        result.push([sorted[i], sorted[left], sorted[right]]);
        // skip duplicate values so the same triplet isn't produced again
        while (left < right && sorted[left] === sorted[left + 1]) left++;
        while (left < right && sorted[right] === sorted[right - 1]) right--;
        left++;
        right--;
      } else if (sum < target) {
        left++;
      } else {
        right--;
      }
    }
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
const normalise = (triplets) =>
  triplets.map((t) => [...t].sort((a, b) => a - b)).sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);

for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(normalise(solve([-1, 0, 1, 2, -1, -4])), [[-1, -1, 2], [-1, 0, 1]]);
  assert.deepStrictEqual(solve([0, 1, 1]), []);
  assert.deepStrictEqual(solve([0, 0, 0]), [[0, 0, 0]]);
  assert.deepStrictEqual(solve([0, 0, 0, 0]), [[0, 0, 0]]);
  assert.deepStrictEqual(solve([1, 2]), []);
  assert.deepStrictEqual(solve([]), []);
  assert.deepStrictEqual(normalise(solve([-2, 0, 0, 2, 2])), [[-2, 0, 2]]);
  assert.deepStrictEqual(normalise(solve([3, -2, 1, 0])), []);
  assert.deepStrictEqual(normalise(solve([-2, -1, 0, 1, 2, 3])), [[-2, -1, 3], [-2, 0, 2], [-1, 0, 1]]);
}
console.log('✓ 13-three-sum passed');

module.exports = { optimal, bruteForce };

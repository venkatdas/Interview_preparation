/**
 * 15. Next Permutation   (LeetCode 31 — Medium)
 *
 * PROBLEM
 * Rearrange the array into the next lexicographically greater permutation of its
 * numbers (the arrangement that would come right after it if all permutations were
 * sorted). If no greater permutation exists, rearrange into the smallest one (sorted
 * ascending). In place, O(1) extra space.
 *
 * EXAMPLES
 * Input: [1, 2, 3]   Output: [1, 3, 2]
 * Input: [3, 2, 1]   Output: [1, 2, 3]   Explanation: already the largest, wrap to smallest
 * Input: [1, 1, 5]   Output: [1, 5, 1]
 * Input: [1, 3, 2]   Output: [2, 1, 3]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Duplicates allowed? (yes - use strict comparisons so equal values are skipped)
 * - In place? (yes)
 * - Single element / empty? (unchanged)
 *
 * APPROACH 1 — Brute force   O(n! * n) time, O(n! * n) space
 * Generate every permutation, sort them, find the current one and return the next
 * (or the first). Only feasible for tiny arrays; here it is used to validate the optimal.
 *
 * APPROACH 2 — Optimal (scan from the right + swap + reverse)   O(n) time, O(1) space
 * Think of the number as digits. To make it only slightly bigger:
 *   1. From the right, find the first index `pivot` where nums[pivot] < nums[pivot+1].
 *      Everything right of pivot is non-increasing (it is the largest arrangement of
 *      those digits, so it cannot grow). If no pivot, the whole array is descending:
 *      reverse it and return.
 *   2. From the right, find the first `successor` with nums[successor] > nums[pivot]
 *      (the smallest digit on the right that is bigger than the pivot). Swap them.
 *   3. The suffix after pivot is still descending; reverse it to make it the SMALLEST
 *      arrangement.
 *
 * Dry run on [1, 3, 2]:
 *   step 1: from right, 3 > 2 no; 1 < 3 yes -> pivot = 0 (value 1)
 *   step 2: from right, first value > 1 is 2 at index 2 -> swap -> [2, 3, 1]
 *   step 3: reverse suffix [3, 1] -> [2, 1, 3]
 *
 * Dry run on [1, 5, 8, 4, 7, 6, 5, 3, 1]:
 *   pivot = index 3 (4 < 7); successor = index 6 (5, first from right > 4)
 *   swap -> [1,5,8,5,7,6,4,3,1]; reverse suffix -> [1,5,8,5,1,3,4,6,7]
 *
 * EDGE CASES
 * - Fully descending -> sorted ascending
 * - All equal [2, 2, 2] -> unchanged (no pivot, reverse gives the same thing)
 * - Two elements -> swap
 * - Single element / empty
 */

function bruteForce(nums) {
  // generate all permutations (indices to handle duplicates), sort, pick next
  const permutations = [];
  function build(current, used) {
    if (current.length === nums.length) { permutations.push(current.join(',')); return; }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      build([...current, nums[i]], used);
      used[i] = false;
    }
  }
  if (nums.length === 0) return nums;
  build([], new Array(nums.length).fill(false));

  const toArray = (key) => key.split(',').map(Number);
  const unique = [...new Set(permutations)].map(toArray);
  unique.sort((a, b) => {
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i];
    return 0;
  });
  const currentKey = nums.join(',');
  const position = unique.findIndex((perm) => perm.join(',') === currentKey);
  const next = unique[(position + 1) % unique.length];
  for (let i = 0; i < nums.length; i++) nums[i] = next[i];
  return nums;
}

function reverseRange(arr, left, right) {
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
}

function optimal(nums) {
  const n = nums.length;

  // step 1: find the pivot (first index from the right whose value is smaller than its neighbour)
  let pivot = n - 2;
  while (pivot >= 0 && nums[pivot] >= nums[pivot + 1]) pivot--; // >= so duplicates are skipped

  if (pivot >= 0) {
    // step 2: find the smallest value on the right that is bigger than the pivot and swap
    let successor = n - 1;
    while (nums[successor] <= nums[pivot]) successor--;
    [nums[pivot], nums[successor]] = [nums[successor], nums[pivot]];
  }

  // step 3: the suffix is descending; reverse it so it becomes the smallest arrangement
  reverseRange(nums, pivot + 1, n - 1);
  return nums;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([1, 2, 3]), [1, 3, 2]);
  assert.deepStrictEqual(solve([3, 2, 1]), [1, 2, 3]);
  assert.deepStrictEqual(solve([1, 1, 5]), [1, 5, 1]);
  assert.deepStrictEqual(solve([1, 3, 2]), [2, 1, 3]);
  assert.deepStrictEqual(solve([2, 2, 2]), [2, 2, 2]);
  assert.deepStrictEqual(solve([1, 2]), [2, 1]);
  assert.deepStrictEqual(solve([1]), [1]);
  assert.deepStrictEqual(solve([]), []);
}
assert.deepStrictEqual(optimal([1, 5, 8, 4, 7, 6, 5, 3, 1]), [1, 5, 8, 5, 1, 3, 4, 6, 7]);
console.log('✓ 15-next-permutation passed');

module.exports = { optimal, bruteForce };

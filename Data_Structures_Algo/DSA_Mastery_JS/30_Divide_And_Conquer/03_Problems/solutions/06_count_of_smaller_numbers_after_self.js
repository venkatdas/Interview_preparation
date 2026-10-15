/**
 * 06. Count of Smaller Numbers After Self, merge-sort version   (LeetCode 315 — Hard)
 *
 * PROBLEM
 * For each index i, count how many elements to its right are strictly smaller than nums[i].
 *
 * EXAMPLES
 * Input: [5,2,6,1]   Output: [2,1,1,0]
 * Input: [-1,-1]     Output: [0,0]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 10^5 -> O(n^2) too slow
 * - Strictly smaller
 * - (A Fenwick-tree version lives in ../../../34_Range_Query_Data_Structures/02_Fenwick_Tree/)
 *
 * APPROACH 1 — Brute force   O(n^2)
 * For each i scan j > i.
 *
 * APPROACH 2 — Optimal (Merge sort on INDICES, count while merging)   O(n log n) time, O(n) space
 * Sort indices by value with merge sort. When merging a left half and a right half (all
 * left indices are < all right indices in position), each time we take an element from the
 * LEFT half, every right-half element already taken is smaller than it and sits to its right
 * in the original array. So counts[leftIndex] += (number of right elements taken so far).
 * Ties: take the right element first only if it is strictly smaller, so equal values do
 * not count.
 *
 * Dry run on [5,2,6,1] (indices 0..3):
 *   split [0,1] | [2,3]
 *   left: merge [0] and [1]: 2 < 5 -> take 1 (rightTaken = 1); take 0 -> counts[0] += 1 -> order [1,0]
 *   right: merge [2] and [3]: 1 < 6 -> take 3; take 2 -> counts[2] += 1 -> order [3,2]
 *   top: merge [1,0] (values 2,5) with [3,2] (values 1,6):
 *     1 < 2 -> take 3 (rightTaken 1); 2 < 6 -> take 1, counts[1] += 1; 5 < 6 -> take 0, counts[0] += 1;
 *     take 2
 *   counts = [2,1,1,0]
 *
 * EDGE CASES
 * - empty -> []
 * - all equal -> zeros
 * - descending -> [n-1, ..., 0]
 */

function bruteForce(nums) {
  const counts = new Array(nums.length).fill(0);
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) if (nums[j] < nums[i]) counts[i]++;
  }
  return counts;
}

function optimal(nums) {
  const n = nums.length;
  const counts = new Array(n).fill(0);
  let indices = Array.from({ length: n }, (_, i) => i);

  function sort(idx) {
    if (idx.length <= 1) return idx;
    const mid = idx.length >> 1;
    const left = sort(idx.slice(0, mid));
    const right = sort(idx.slice(mid));
    const merged = [];
    let i = 0;
    let j = 0;
    while (i < left.length || j < right.length) {
      // take from the right only when it is STRICTLY smaller
      if (j < right.length && (i === left.length || nums[right[j]] < nums[left[i]])) {
        merged.push(right[j++]);
      } else {
        counts[left[i]] += j;              // j right elements (all smaller) were already taken
        merged.push(left[i++]);
      }
    }
    return merged;
  }

  indices = sort(indices);
  return counts;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([5, 2, 6, 1]), [2, 1, 1, 0]);
  assert.deepStrictEqual(solve([-1, -1]), [0, 0]);
  assert.deepStrictEqual(solve([]), []);
  assert.deepStrictEqual(solve([3]), [0]);
  assert.deepStrictEqual(solve([5, 4, 3, 2, 1]), [4, 3, 2, 1, 0]);
  assert.deepStrictEqual(solve([1, 2, 3]), [0, 0, 0]);
}
for (let trial = 0; trial < 300; trial++) {
  const n = Math.floor(Math.random() * 15);
  const nums = Array.from({ length: n }, () => Math.floor(Math.random() * 11) - 5);
  assert.deepStrictEqual(optimal(nums), bruteForce(nums));
}
console.log('✓ 06-count-of-smaller-numbers-after-self passed');

module.exports = { optimal, bruteForce };

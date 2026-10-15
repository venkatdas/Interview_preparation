/**
 * 13. Count of Smaller Numbers After Self   (LeetCode 315 — Hard)
 *
 * PROBLEM
 * For each nums[i], count how many elements to its RIGHT are strictly smaller.
 * Return the array of counts.
 *
 * EXAMPLES
 * Input: [5,2,6,1]   Output: [2,1,1,0]
 *   5: 2 and 1 are smaller to the right -> 2
 *   2: 1 -> 1;  6: 1 -> 1;  1: nothing -> 0
 * Input: [-1,-1]     Output: [0,0]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n <= 10^5 (so O(n^2) is too slow), values can be negative
 * - Strictly smaller (equal elements do not count)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) extra
 * For each i, scan j > i and count nums[j] < nums[i].
 *
 * APPROACH 2 — Optimal (merge sort over INDICES, count during merge)   O(n log n) time, O(n) space
 * Merge sort the array of indices by their values. While merging a left half and a
 * right half (both sorted, and every right element is originally to the RIGHT of every
 * left element), each time we take an element from the LEFT, every element already
 * taken from the RIGHT is (a) smaller than it and (b) positioned after it in the
 * original array. So counts[leftIndex] += (number taken from right so far).
 * Sorting indices (not values) lets us know which original position to credit.
 * (Alternatives: Binary Indexed Tree / Segment Tree, see 35_Advanced_Data_Structures.)
 *
 * Dry run [5,2,6,1] -> indices [0,1,2,3]:
 *   split [0,1] [2,3]
 *   sort [0,1]: values 5,2 -> merge: take idx1 (2) from right (rightTaken=1); take idx0 (5) from left -> counts[0] += 1 -> [1,2]
 *   sort [2,3]: values 6,1 -> take idx3 (1) right (rightTaken=1); take idx2 (6) -> counts[2] += 1 -> [3,2]
 *   merge [1,0] (2,5) with [3,2] (1,6):
 *     2 vs 1 -> take idx3 (right, rightTaken=1)
 *     2 vs 6 -> take idx1 (left) counts[1] += 1
 *     5 vs 6 -> take idx0 (left) counts[0] += 1 -> counts[0] = 2
 *     leftover idx2
 *   counts = [2,1,1,0]
 *
 * EDGE CASES
 * - [] -> []; single element -> [0]
 * - all equal -> all zeros (use strict < when taking from the right first)
 * - descending input -> [n-1, n-2, ..., 0]
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
  const indices = Array.from({ length: n }, (_, i) => i);
  const buffer = new Array(n);

  function sort(lo, hi) {                  // sorts indices[lo..hi] by nums value
    if (hi - lo < 1) return;
    const mid = (lo + hi) >> 1;
    sort(lo, mid);
    sort(mid + 1, hi);
    merge(lo, mid, hi);
  }

  function merge(lo, mid, hi) {
    let i = lo, j = mid + 1, k = lo;
    let rightTaken = 0;                    // how many right-half elements are already placed
    while (i <= mid && j <= hi) {
      if (nums[indices[j]] < nums[indices[i]]) {
        buffer[k++] = indices[j++];        // strictly smaller element from the right goes first
        rightTaken++;
      } else {
        counts[indices[i]] += rightTaken;  // all right elements taken so far are smaller than this one
        buffer[k++] = indices[i++];
      }
    }
    while (i <= mid) { counts[indices[i]] += rightTaken; buffer[k++] = indices[i++]; }
    while (j <= hi) buffer[k++] = indices[j++];
    for (let t = lo; t <= hi; t++) indices[t] = buffer[t];
  }

  sort(0, n - 1);
  return counts;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([5, 2, 6, 1]), [2, 1, 1, 0]);
  assert.deepStrictEqual(solve([-1]), [0]);
  assert.deepStrictEqual(solve([-1, -1]), [0, 0]);
  assert.deepStrictEqual(solve([]), []);
  assert.deepStrictEqual(solve([5, 4, 3, 2, 1]), [4, 3, 2, 1, 0]);
  assert.deepStrictEqual(solve([1, 2, 3, 4]), [0, 0, 0, 0]);
  assert.deepStrictEqual(solve([2, 0, 1]), [2, 0, 0]);
  assert.deepStrictEqual(solve([-5, 3, -5, 10, -6]), [1, 2, 1, 1, 0]);
}
for (let trial = 0; trial < 300; trial++) {
  const input = Array.from({ length: Math.floor(Math.random() * 25) }, () => Math.floor(Math.random() * 21) - 10);
  assert.deepStrictEqual(optimal(input), bruteForce(input), JSON.stringify(input));
}
console.log('✓ 13-count-smaller-after-self passed');

module.exports = { optimal, bruteForce };

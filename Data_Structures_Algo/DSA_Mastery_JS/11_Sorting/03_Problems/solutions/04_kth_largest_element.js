/**
 * 04. Kth Largest Element in an Array   (LeetCode 215 — Medium)
 *
 * PROBLEM
 * Return the k-th largest element in an unsorted array (k-th largest in SORTED order,
 * not the k-th distinct element). Can you do it without fully sorting?
 *
 * EXAMPLES
 * Input: nums = [3,2,1,5,6,4], k = 2           Output: 5
 * Input: nums = [3,2,3,1,2,4,5,5,6], k = 4     Output: 4   (sorted desc: 6,5,5,4 -> 4)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= k <= n <= 10^5
 * - Duplicates count separately ([5,5] k=2 -> 5)
 * - Can I modify the input? (quickselect mutates; copy if not)
 *
 * APPROACH 1 — Brute force (sort)   O(n log n) time, O(n) space
 * Sort descending, return index k - 1. Clean and correct; mention it, then improve.
 * (A min-heap of size k gives O(n log k); see 19_Heaps_And_Priority_Queues.)
 *
 * APPROACH 2 — Optimal (Quickselect)   O(n) average, O(n^2) worst, O(1) extra space
 * k-th largest = (n - k)-th smallest (0-based). Partition around a random pivot:
 * the pivot lands at its final sorted index p. If p === target -> answer. If p < target,
 * the answer is on the right -> continue there; else continue on the left. Each round
 * discards part of the array -> n + n/2 + n/4 + ... = O(n) expected.
 *
 * Dry run [3,2,1,5,6,4], k=2 -> target index 4:
 *   pivot 4 (say): partition -> [3,2,1,4,6,5], p = 3 < 4 -> search [4..5]
 *   pivot 5: partition [6,5] -> [5,6], p = 4 === target -> return 5
 *
 * EDGE CASES
 * - k = 1 -> max; k = n -> min
 * - all duplicates [2,2,2], any k -> 2 (three-way partition keeps this O(n); plain Lomuto is O(n^2) but still correct)
 * - negatives
 */

function bruteForce(nums, k) {
  return [...nums].sort((a, b) => b - a)[k - 1];
}

function optimal(nums, k) {
  const arr = [...nums];
  const target = arr.length - k;                  // index in ascending order
  let lo = 0, hi = arr.length - 1;

  while (lo < hi) {
    // three-way partition around a random pivot: [< pivot][== pivot][> pivot]
    const pivot = arr[lo + Math.floor(Math.random() * (hi - lo + 1))];
    let lessEnd = lo, scan = lo, greaterStart = hi;
    while (scan <= greaterStart) {
      if (arr[scan] < pivot) {
        [arr[scan], arr[lessEnd]] = [arr[lessEnd], arr[scan]];
        scan++; lessEnd++;
      } else if (arr[scan] > pivot) {
        [arr[scan], arr[greaterStart]] = [arr[greaterStart], arr[scan]];
        greaterStart--;
      } else {
        scan++;
      }
    }
    if (target < lessEnd) hi = lessEnd - 1;            // answer in the "<" block
    else if (target > greaterStart) lo = greaterStart + 1; // answer in the ">" block
    else return pivot;                                  // target is inside the "==" block
  }
  return arr[lo];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([3, 2, 1, 5, 6, 4], 2), 5);
  assert.strictEqual(solve([3, 2, 3, 1, 2, 4, 5, 5, 6], 4), 4);
  assert.strictEqual(solve([1], 1), 1);
  assert.strictEqual(solve([2, 2, 2], 2), 2);
  assert.strictEqual(solve([7, 6, 5, 4, 3, 2, 1], 7), 1);
  assert.strictEqual(solve([7, 6, 5, 4, 3, 2, 1], 1), 7);
  assert.strictEqual(solve([-1, -5, -3], 2), -3);
}
for (let trial = 0; trial < 200; trial++) {
  const size = 1 + Math.floor(Math.random() * 30);
  const input = Array.from({ length: size }, () => Math.floor(Math.random() * 11) - 5);
  const k = 1 + Math.floor(Math.random() * size);
  assert.strictEqual(optimal(input, k), bruteForce(input, k));
}
console.log('✓ 04-kth-largest-element passed');

module.exports = { optimal, bruteForce };

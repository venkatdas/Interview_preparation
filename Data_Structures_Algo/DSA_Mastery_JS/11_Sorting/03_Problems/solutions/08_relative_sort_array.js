/**
 * 08. Relative Sort Array   (LeetCode 1122 — Easy)
 *
 * PROBLEM
 * Given arr1 and arr2 (arr2 has distinct values, all of which appear in arr1), sort
 * arr1 so that its elements follow the relative order of arr2. Elements not in arr2
 * go at the end in ascending order.
 *
 * EXAMPLES
 * Input: arr1 = [2,3,1,3,2,4,6,7,9,2,19], arr2 = [2,1,4,3,9,6]
 * Output: [2,2,2,1,4,3,3,9,6,7,19]
 * Input: arr1 = [28,6,22,8,44,17], arr2 = [22,28,8,6]   Output: [22,28,8,6,17,44]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Values 0..1000 (small range -> counting sort is natural)
 * - arr2 distinct and a subset of arr1's values? (yes)
 *
 * APPROACH 1 — Brute force (custom comparator)   O(n log n) time
 * Build a Map value -> position in arr2. Sort arr1 with: both in arr2 -> compare
 * positions; one in arr2 -> it goes first; neither -> compare values. Clean and fine.
 *
 * APPROACH 2 — Optimal (counting sort)   O(n + m + k) time, O(k) space  (k = 1001)
 * Count every value of arr1 in a counts array of size 1001. Then:
 *   1. for each value in arr2 order, emit it counts[value] times and zero the count
 *   2. for value from 0..1000, emit whatever counts are left (these are the "others",
 *      and walking the index ascending sorts them for free)
 *
 * Dry run arr1=[2,3,1,3,2,4,6,7,9,2,19], arr2=[2,1,4,3,9,6]:
 *   counts: 1:1 2:3 3:2 4:1 6:1 7:1 9:1 19:1
 *   emit arr2 order: 2,2,2 | 1 | 4 | 3,3 | 9 | 6
 *   leftovers ascending: 7, 19
 *   -> [2,2,2,1,4,3,3,9,6,7,19]
 *
 * EDGE CASES
 * - arr2 empty -> plain ascending sort of arr1
 * - all of arr1 in arr2 -> no leftovers
 * - duplicates in arr1 (handled by counts)
 */

function bruteForce(arr1, arr2) {
  const rank = new Map(arr2.map((v, i) => [v, i]));
  return [...arr1].sort((a, b) => {
    const inA = rank.has(a), inB = rank.has(b);
    if (inA && inB) return rank.get(a) - rank.get(b);
    if (inA) return -1;
    if (inB) return 1;
    return a - b;
  });
}

function optimal(arr1, arr2) {
  const MAX_VALUE = 1000;
  const counts = new Array(MAX_VALUE + 1).fill(0);
  for (const value of arr1) counts[value]++;

  const result = [];
  for (const value of arr2) {                      // 1. arr2 order first
    while (counts[value] > 0) { result.push(value); counts[value]--; }
  }
  for (let value = 0; value <= MAX_VALUE; value++) { // 2. leftovers in ascending order
    while (counts[value] > 0) { result.push(value); counts[value]--; }
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([2, 3, 1, 3, 2, 4, 6, 7, 9, 2, 19], [2, 1, 4, 3, 9, 6]),
    [2, 2, 2, 1, 4, 3, 3, 9, 6, 7, 19]);
  assert.deepStrictEqual(solve([28, 6, 22, 8, 44, 17], [22, 28, 8, 6]), [22, 28, 8, 6, 17, 44]);
  assert.deepStrictEqual(solve([5, 3, 1], []), [1, 3, 5]);
  assert.deepStrictEqual(solve([1, 1, 1], [1]), [1, 1, 1]);
  assert.deepStrictEqual(solve([], []), []);
  assert.deepStrictEqual(solve([0, 1000, 0], [1000, 0]), [1000, 0, 0]);
}
console.log('✓ 08-relative-sort-array passed');

module.exports = { optimal, bruteForce };

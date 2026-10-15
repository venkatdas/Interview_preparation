/**
 * 05. Interval List Intersections   (LeetCode 986 — Medium)
 *
 * PROBLEM
 * Two lists of closed intervals, each sorted and pairwise disjoint. Return the intersection
 * of the two lists (every range that lies inside an interval of BOTH lists).
 *
 * EXAMPLES
 * Input: A = [[0,2],[5,10],[13,23],[24,25]], B = [[1,5],[8,12],[15,24],[25,26]]
 * Output: [[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Closed intervals, so [5,5] is a valid (single point) intersection? (yes)
 * - Both lists sorted and disjoint? (yes)
 *
 * APPROACH 1 — Brute force   O(n * m) time
 * For every pair (a, b) compute the overlap and push it if non-empty. Sort the output.
 *
 * APPROACH 2 — Optimal (two pointers)   O(n + m) time, O(1) extra
 * Pointers i, j. The candidate intersection is [max(starts), min(ends)]; push it if
 * start <= end. Then advance whichever interval ENDS first: it cannot intersect anything
 * further in the other list (that list is sorted and disjoint), so it is done.
 *
 * Dry run (first steps) on the example:
 *   A[0]=[0,2], B[0]=[1,5]: [1,2] push. A ends first -> i=1
 *   A[1]=[5,10], B[0]=[1,5]: [5,5] push. B ends first -> j=1
 *   A[1]=[5,10], B[1]=[8,12]: [8,10] push. A ends first -> i=2 ...
 *
 * EDGE CASES
 * - either list empty -> []
 * - no overlaps at all -> []
 * - single-point overlaps -> [x,x]
 */

function bruteForce(firstList, secondList) {
  const result = [];
  for (const [aStart, aEnd] of firstList) {
    for (const [bStart, bEnd] of secondList) {
      const start = Math.max(aStart, bStart);
      const end = Math.min(aEnd, bEnd);
      if (start <= end) result.push([start, end]);
    }
  }
  return result.sort((a, b) => a[0] - b[0]);
}

function optimal(firstList, secondList) {
  const result = [];
  let i = 0;
  let j = 0;
  while (i < firstList.length && j < secondList.length) {
    const start = Math.max(firstList[i][0], secondList[j][0]);
    const end = Math.min(firstList[i][1], secondList[j][1]);
    if (start <= end) result.push([start, end]);

    // the interval that ends first is finished; the other may still hit later intervals
    if (firstList[i][1] < secondList[j][1]) i++;
    else j++;
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(
    solve([[0, 2], [5, 10], [13, 23], [24, 25]], [[1, 5], [8, 12], [15, 24], [25, 26]]),
    [[1, 2], [5, 5], [8, 10], [15, 23], [24, 24], [25, 25]]
  );
  assert.deepStrictEqual(solve([[1, 3], [5, 9]], []), []);
  assert.deepStrictEqual(solve([], [[4, 8], [10, 12]]), []);
  assert.deepStrictEqual(solve([[1, 2]], [[3, 4]]), []);
  assert.deepStrictEqual(solve([[1, 7]], [[3, 10]]), [[3, 7]]);
  assert.deepStrictEqual(solve([[1, 10]], [[2, 3], [5, 6]]), [[2, 3], [5, 6]]);
}
console.log('✓ 05-interval-list-intersections passed');

module.exports = { optimal, bruteForce };

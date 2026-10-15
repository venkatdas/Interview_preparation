/**
 * 03. Merge Intervals   (LeetCode 56 — Medium)
 *
 * PROBLEM
 * Given an array of intervals [start, end], merge all overlapping intervals and
 * return the non-overlapping intervals that cover the same ranges.
 * (The full intervals topic lives in 31_Intervals; this file shows the sort-based core.)
 *
 * EXAMPLES
 * Input: [[1,3],[2,6],[8,10],[15,18]]   Output: [[1,6],[8,10],[15,18]]
 * Input: [[1,4],[4,5]]                  Output: [[1,5]]    (touching counts as overlap)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Do touching intervals [1,4],[4,5] merge? (yes, start <= end)
 * - Is the input sorted? (no, that is the whole point)
 * - Can start > end? (no)
 *
 * APPROACH 1 — Brute force   O(n^2) time
 * Repeatedly scan all pairs, merge any overlapping pair, restart until no pair
 * overlaps. Up to n merges, each costing O(n) scanning.
 *
 * APPROACH 2 — Optimal (sort by start, then one sweep)   O(n log n) time, O(n) space
 * Sort by start. Walk through: if the current interval starts at or before the end
 * of the last merged interval, they overlap -> extend the last one's end to the max.
 * Otherwise push it as a new interval. Sorting guarantees that any interval that
 * could overlap the last merged one is adjacent to it.
 *
 * Dry run [[1,3],[2,6],[8,10],[15,18]] (already sorted by start):
 *   merged = [[1,3]]
 *   [2,6]: 2 <= 3 -> extend -> [[1,6]]
 *   [8,10]: 8 > 6 -> push -> [[1,6],[8,10]]
 *   [15,18]: 15 > 10 -> push -> [[1,6],[8,10],[15,18]]
 *
 * EDGE CASES
 * - [] -> []
 * - one interval -> itself
 * - an interval fully inside another: [[1,10],[2,3]] -> [[1,10]] (max of ends matters)
 * - unsorted input with overlaps far apart: [[5,6],[1,10]]
 */

function bruteForce(intervals) {
  const list = intervals.map(([s, e]) => [s, e]);
  let mergedSomething = true;
  while (mergedSomething) {
    mergedSomething = false;
    outer:
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const overlap = list[i][0] <= list[j][1] && list[j][0] <= list[i][1];
        if (overlap) {
          list[i] = [Math.min(list[i][0], list[j][0]), Math.max(list[i][1], list[j][1])];
          list.splice(j, 1);
          mergedSomething = true;
          break outer;
        }
      }
    }
  }
  return list.sort((a, b) => a[0] - b[0]);
}

function optimal(intervals) {
  if (intervals.length === 0) return [];
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);  // by start
  const merged = [[...sorted[0]]];
  for (let i = 1; i < sorted.length; i++) {
    const [start, end] = sorted[i];
    const last = merged[merged.length - 1];
    if (start <= last[1]) {
      last[1] = Math.max(last[1], end);   // overlap: extend (max handles nested intervals)
    } else {
      merged.push([start, end]);          // gap: start a new interval
    }
  }
  return merged;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([[1, 3], [2, 6], [8, 10], [15, 18]]), [[1, 6], [8, 10], [15, 18]]);
  assert.deepStrictEqual(solve([[1, 4], [4, 5]]), [[1, 5]]);
  assert.deepStrictEqual(solve([]), []);
  assert.deepStrictEqual(solve([[1, 2]]), [[1, 2]]);
  assert.deepStrictEqual(solve([[1, 10], [2, 3]]), [[1, 10]]);
  assert.deepStrictEqual(solve([[5, 6], [1, 10]]), [[1, 10]]);
  assert.deepStrictEqual(solve([[1, 4], [0, 4]]), [[0, 4]]);
  assert.deepStrictEqual(solve([[1, 4], [0, 0]]), [[0, 0], [1, 4]]);
  assert.deepStrictEqual(solve([[-5, -1], [-3, 2], [3, 4]]), [[-5, 2], [3, 4]]);
}
console.log('✓ 03-merge-intervals passed');

module.exports = { optimal, bruteForce };

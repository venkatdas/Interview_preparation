/**
 * 03. Merge Intervals   (LeetCode 56 — Medium)
 *
 * PROBLEM
 * Given a list of intervals [start, end], merge every pair that overlaps (touching counts)
 * and return the non-overlapping result.
 *
 * EXAMPLES
 * Input: [[1,3],[2,6],[8,10],[15,18]]   Output: [[1,6],[8,10],[15,18]]
 * Input: [[1,4],[4,5]]                  Output: [[1,5]]   Explanation: touching merges
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is the input sorted? (no)
 * - Does [1,4] and [4,5] merge? (yes)
 * - Should the output be sorted? (yes, by start)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(n) space
 * Repeat: find any two intervals that overlap, replace them with their union. Stop when
 * no pair overlaps. Each pass is O(n^2) and there can be n passes -> O(n^3) worst case.
 *
 * APPROACH 2 — Optimal (sort by start + scan)   O(n log n) time, O(n) space
 * Sort by start. Keep the last merged interval. For each next interval: if it starts at or
 * before the last one's end, extend the end (max); otherwise push it as a new block.
 * After sorting, anything that overlaps the current block must start before its end, so a
 * single pass catches every merge.
 *
 * Dry run on [[1,3],[2,6],[8,10],[15,18]]:
 *   result=[[1,3]]
 *   [2,6]: 2 <= 3 -> extend to [1,6]
 *   [8,10]: 8 > 6 -> push -> [[1,6],[8,10]]
 *   [15,18]: 15 > 10 -> push -> [[1,6],[8,10],[15,18]]
 *
 * EDGE CASES
 * - [] -> []
 * - single interval -> same
 * - one interval contains all others ([1,10],[2,3]) -> [[1,10]]; max() handles it
 * - unsorted with negatives
 */

function bruteForce(intervals) {
  let current = intervals.map((x) => x.slice());
  let mergedSomething = true;
  while (mergedSomething) {
    mergedSomething = false;
    outer: for (let i = 0; i < current.length; i++) {
      for (let j = i + 1; j < current.length; j++) {
        const [aStart, aEnd] = current[i];
        const [bStart, bEnd] = current[j];
        if (aStart <= bEnd && bStart <= aEnd) {
          const union = [Math.min(aStart, bStart), Math.max(aEnd, bEnd)];
          current = current.filter((_, k) => k !== i && k !== j);
          current.push(union);
          mergedSomething = true;
          break outer;
        }
      }
    }
  }
  return current.sort((a, b) => a[0] - b[0]);
}

function optimal(intervals) {
  if (intervals.length === 0) return [];
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const result = [sorted[0].slice()];       // copy so we can mutate the end safely
  for (let i = 1; i < sorted.length; i++) {
    const last = result[result.length - 1];
    const [start, end] = sorted[i];
    if (start <= last[1]) {
      last[1] = Math.max(last[1], end);     // overlap or touch -> extend the block
    } else {
      result.push([start, end]);
    }
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([[1, 3], [2, 6], [8, 10], [15, 18]]), [[1, 6], [8, 10], [15, 18]]);
  assert.deepStrictEqual(solve([[1, 4], [4, 5]]), [[1, 5]]);
  assert.deepStrictEqual(solve([]), []);
  assert.deepStrictEqual(solve([[1, 4]]), [[1, 4]]);
  assert.deepStrictEqual(solve([[1, 10], [2, 3], [4, 5]]), [[1, 10]]);
  assert.deepStrictEqual(solve([[5, 6], [1, 2], [3, 4]]), [[1, 2], [3, 4], [5, 6]]);
  assert.deepStrictEqual(solve([[-3, -1], [-2, 2], [4, 4]]), [[-3, 2], [4, 4]]);
}
console.log('✓ 03-merge-intervals passed');

module.exports = { optimal, bruteForce };

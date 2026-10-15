/**
 * 04. Insert Interval   (LeetCode 57 — Medium)
 *
 * PROBLEM
 * intervals is sorted by start and non-overlapping. Insert newInterval, merging as needed,
 * and return the still-sorted, non-overlapping result.
 *
 * EXAMPLES
 * Input: intervals = [[1,3],[6,9]], newInterval = [2,5]   Output: [[1,5],[6,9]]
 * Input: intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]
 * Output: [[1,2],[3,10],[12,16]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Input is sorted and non-overlapping? (yes - so no sort needed)
 * - Touching merges? (yes, [1,3] + [3,5] -> [1,5])
 *
 * APPROACH 1 — Brute force   O(n log n) time, O(n) space
 * Append the new interval and run Merge Intervals. Correct, but wastes the sorted input.
 *
 * APPROACH 2 — Optimal (three-phase scan)   O(n) time, O(n) space
 * Phase 1: copy intervals that end BEFORE newInterval starts (entirely to the left).
 * Phase 2: every interval that starts at or before newInterval's end overlaps it -> absorb:
 *          start = min, end = max. Then push the merged interval once.
 * Phase 3: copy the rest (entirely to the right).
 *
 * Dry run on [[1,2],[3,5],[6,7],[8,10],[12,16]], new [4,8]:
 *   phase 1: [1,2] ends 2 < 4 -> push
 *   phase 2: [3,5] starts 3 <= 8 -> new = [3,8]; [6,7] -> [3,8]; [8,10] starts 8 <= 8 -> [3,10]
 *            [12,16] starts 12 > 10 -> stop; push [3,10]
 *   phase 3: push [12,16]
 *
 * EDGE CASES
 * - empty intervals -> [newInterval]
 * - new interval before everything / after everything
 * - new interval swallows everything
 */

function bruteForce(intervals, newInterval) {
  const all = [...intervals, newInterval].sort((a, b) => a[0] - b[0]);
  const result = [];
  for (const [start, end] of all) {
    const last = result[result.length - 1];
    if (last && start <= last[1]) last[1] = Math.max(last[1], end);
    else result.push([start, end]);
  }
  return result;
}

function optimal(intervals, newInterval) {
  const result = [];
  let [start, end] = newInterval;
  let i = 0;

  while (i < intervals.length && intervals[i][1] < start) result.push(intervals[i++]); // left of new

  while (i < intervals.length && intervals[i][0] <= end) {   // overlapping: absorb
    start = Math.min(start, intervals[i][0]);
    end = Math.max(end, intervals[i][1]);
    i++;
  }
  result.push([start, end]);

  while (i < intervals.length) result.push(intervals[i++]); // right of new
  return result;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([[1, 3], [6, 9]], [2, 5]), [[1, 5], [6, 9]]);
  assert.deepStrictEqual(solve([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]), [[1, 2], [3, 10], [12, 16]]);
  assert.deepStrictEqual(solve([], [5, 7]), [[5, 7]]);
  assert.deepStrictEqual(solve([[1, 5]], [6, 8]), [[1, 5], [6, 8]]);
  assert.deepStrictEqual(solve([[3, 5]], [1, 2]), [[1, 2], [3, 5]]);
  assert.deepStrictEqual(solve([[2, 3], [5, 6]], [0, 10]), [[0, 10]]);
  assert.deepStrictEqual(solve([[1, 5]], [5, 7]), [[1, 7]]);
}
console.log('✓ 04-insert-interval passed');

module.exports = { optimal, bruteForce };

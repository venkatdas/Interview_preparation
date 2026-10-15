/**
 * 08. Remove Covered Intervals   (LeetCode 1288 — Medium)
 *
 * PROBLEM
 * Interval [a,b) is covered by [c,d) if c <= a and b <= d. Remove every interval that is
 * covered by another one and return how many intervals remain.
 *
 * EXAMPLES
 * Input: [[1,4],[3,6],[2,8]]   Output: 2   Explanation: [3,6] is inside [2,8]
 * Input: [[1,4],[2,3]]         Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Are all intervals distinct? (yes, per problem)
 * - Does an interval cover itself? (not relevant since they are distinct)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * For each interval, check if any OTHER interval covers it.
 *
 * APPROACH 2 — Optimal (sort by start asc, end DESC; track max end)   O(n log n) time, O(1) extra
 * Sort by start ascending; for equal starts put the LONGER one first (end descending).
 * Scan with `maxEnd` = the largest end seen so far. If the current end <= maxEnd, the current
 * interval is covered by an earlier one (earlier start, bigger-or-equal end). Otherwise it
 * survives and becomes the new maxEnd.
 * The tie-break matters: with [1,4],[1,6], putting [1,6] first lets it cover [1,4].
 *
 * Dry run on [[1,4],[3,6],[2,8]]:
 *   sorted: [1,4],[2,8],[3,6]
 *   [1,4]: 4 > -inf -> keep, maxEnd=4
 *   [2,8]: 8 > 4    -> keep, maxEnd=8
 *   [3,6]: 6 <= 8   -> covered   -> 2
 *
 * EDGE CASES
 * - single interval -> 1
 * - same start, different ends -> only the longest survives
 * - chain of nested intervals -> 1
 */

function bruteForce(intervals) {
  let remaining = 0;
  for (let i = 0; i < intervals.length; i++) {
    const [a, b] = intervals[i];
    let covered = false;
    for (let j = 0; j < intervals.length && !covered; j++) {
      if (i === j) continue;
      const [c, d] = intervals[j];
      if (c <= a && b <= d) covered = true;
    }
    if (!covered) remaining++;
  }
  return remaining;
}

function optimal(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0] || b[1] - a[1]); // start asc, end desc
  let remaining = 0;
  let maxEnd = -Infinity;
  for (const [, end] of sorted) {
    if (end > maxEnd) {          // reaches beyond everything before it -> not covered
      remaining++;
      maxEnd = end;
    }
  }
  return remaining;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([[1, 4], [3, 6], [2, 8]]), 2);
  assert.strictEqual(solve([[1, 4], [2, 3]]), 1);
  assert.strictEqual(solve([[1, 2]]), 1);
  assert.strictEqual(solve([[1, 4], [1, 6], [1, 5]]), 1);
  assert.strictEqual(solve([[1, 10], [2, 9], [3, 8], [4, 7]]), 1);
  assert.strictEqual(solve([[1, 2], [3, 4], [5, 6]]), 3);
  assert.strictEqual(solve([[3, 10], [4, 10], [5, 11]]), 2);
}
console.log('✓ 08-remove-covered-intervals passed');

module.exports = { optimal, bruteForce };

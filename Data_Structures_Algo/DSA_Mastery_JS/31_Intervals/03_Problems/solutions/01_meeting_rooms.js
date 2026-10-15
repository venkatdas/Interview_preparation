/**
 * 01. Meeting Rooms   (LeetCode 252 — Easy)
 *
 * PROBLEM
 * Given meeting time intervals [start, end), return true if one person could attend all
 * of them (no two meetings overlap). A meeting ending at 10 and one starting at 10 are fine.
 *
 * EXAMPLES
 * Input: [[0,30],[5,10],[15,20]]   Output: false   Explanation: [0,30] overlaps both others
 * Input: [[7,10],[2,4]]            Output: true
 * Input: [[1,5],[5,8]]             Output: true    Explanation: touching is allowed
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Are ends exclusive (touching allowed)? (yes)
 * - Is the input sorted? (no)
 * - Empty list? (true)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * Check every pair with the overlap formula a.start < b.end && b.start < a.end.
 *
 * APPROACH 2 — Optimal (sort by start, compare neighbours)   O(n log n) time, O(1) extra
 * After sorting by start, an overlap can only happen between ADJACENT meetings: if meeting i
 * overlaps some later meeting j, then it also overlaps meeting i+1 (which starts no later
 * than j). So one pass comparing each start with the previous end is enough.
 *
 * Dry run on [[0,30],[5,10],[15,20]]:
 *   sorted: [0,30],[5,10],[15,20]
 *   5 < 30 -> conflict -> false
 *
 * EDGE CASES
 * - [] or one meeting -> true
 * - identical meetings -> false
 * - touching [1,5],[5,8] -> true
 */

function bruteForce(intervals) {
  for (let i = 0; i < intervals.length; i++) {
    for (let j = i + 1; j < intervals.length; j++) {
      const [aStart, aEnd] = intervals[i];
      const [bStart, bEnd] = intervals[j];
      if (aStart < bEnd && bStart < aEnd) return false; // strict: touching is fine
    }
  }
  return true;
}

function optimal(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i][0] < sorted[i - 1][1]) return false; // starts before the previous one ends
  }
  return true;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([[0, 30], [5, 10], [15, 20]]), false);
  assert.strictEqual(solve([[7, 10], [2, 4]]), true);
  assert.strictEqual(solve([[1, 5], [5, 8]]), true);
  assert.strictEqual(solve([]), true);
  assert.strictEqual(solve([[1, 2]]), true);
  assert.strictEqual(solve([[3, 4], [3, 4]]), false);
  assert.strictEqual(solve([[1, 10], [2, 3]]), false);
}
console.log('✓ 01-meeting-rooms passed');

module.exports = { optimal, bruteForce };

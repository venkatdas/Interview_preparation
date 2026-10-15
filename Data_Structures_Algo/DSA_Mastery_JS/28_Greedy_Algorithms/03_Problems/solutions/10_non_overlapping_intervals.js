/**
 * 10. Non-overlapping Intervals   (LeetCode 435 — Medium)
 *
 * PROBLEM
 * Given intervals [start, end], return the minimum number of intervals to remove so that
 * the rest do not overlap. Touching intervals ([1,2] and [2,3]) do NOT overlap.
 *
 * EXAMPLES
 * Input: [[1,2],[2,3],[3,4],[1,3]]   Output: 1   Explanation: remove [1,3]
 * Input: [[1,2],[1,2],[1,2]]         Output: 2
 * Input: [[1,2],[2,3]]               Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Do touching intervals count as overlapping? (no)
 * - Is the input sorted? (no)
 *
 * APPROACH 1 — Brute force   O(2^n) time
 * Try every subset, keep the largest subset that is pairwise non-overlapping. Answer is
 * n - (size of that subset).
 *
 * APPROACH 2 — Optimal (interval scheduling: sort by END)   O(n log n) time, O(1) extra
 * "Minimum removals" = n - "maximum non-overlapping intervals you can keep". Sort by end.
 * Keep an interval if it starts at or after the end of the last kept one.
 *
 * WHY GREEDY WORKS
 * Among all intervals that could come first, the one that ENDS earliest leaves the most room
 * for the rest. Exchange argument: take any optimal kept set; replace its earliest-ending
 * interval by the globally earliest-ending one. It still fits (it ends no later), the set is
 * the same size. Repeat for the rest -> the greedy set is optimal.
 *
 * Dry run on [[1,2],[2,3],[3,4],[1,3]]:
 *   sorted by end: [1,2],[2,3],[1,3],[3,4]
 *   keep [1,2]      lastEnd=2
 *   [2,3] 2>=2 keep lastEnd=3
 *   [1,3] 1<3  remove (count 1)
 *   [3,4] 3>=3 keep lastEnd=4   -> 1
 *
 * EDGE CASES
 * - empty or single interval -> 0
 * - all identical -> n - 1
 * - one giant interval covering all others -> remove the giant one (sorting by end handles it)
 */

function bruteForce(intervals) {
  const n = intervals.length;
  let bestKept = 0;
  for (let mask = 0; mask < (1 << n); mask++) {
    const chosen = [];
    for (let i = 0; i < n; i++) if (mask & (1 << i)) chosen.push(intervals[i]);
    chosen.sort((a, b) => a[0] - b[0]);
    let ok = true;
    for (let i = 1; i < chosen.length; i++) {
      if (chosen[i][0] < chosen[i - 1][1]) { ok = false; break; }
    }
    if (ok) bestKept = Math.max(bestKept, chosen.length);
  }
  return n - bestKept;
}

function optimal(intervals) {
  if (intervals.length === 0) return 0;
  const sorted = [...intervals].sort((a, b) => a[1] - b[1]); // earliest end first
  let removed = 0;
  let lastEnd = sorted[0][1];
  for (let i = 1; i < sorted.length; i++) {
    const [start, end] = sorted[i];
    if (start >= lastEnd) {
      lastEnd = end;        // compatible: keep it
    } else {
      removed++;            // overlaps the kept one that ends earliest -> drop this one
    }
  }
  return removed;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([[1, 2], [2, 3], [3, 4], [1, 3]]), 1);
  assert.strictEqual(solve([[1, 2], [1, 2], [1, 2]]), 2);
  assert.strictEqual(solve([[1, 2], [2, 3]]), 0);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([[1, 100], [2, 3], [4, 5]]), 1);
  assert.strictEqual(solve([[1, 2]]), 0);
  assert.strictEqual(solve([[-5, -1], [-2, 0], [0, 3]]), 1);
}
console.log('✓ 10-non-overlapping-intervals passed');

module.exports = { optimal, bruteForce };

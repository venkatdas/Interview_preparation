/**
 * 06. Non-overlapping Intervals   (LeetCode 435 — Medium)
 *
 * PROBLEM
 * Return the minimum number of intervals to remove so that the remaining intervals do not
 * overlap. Touching intervals ([1,2],[2,3]) do not overlap.
 *
 * EXAMPLES
 * Input: [[1,2],[2,3],[3,4],[1,3]]   Output: 1   Explanation: remove [1,3]
 * Input: [[1,2],[1,2],[1,2]]         Output: 2
 * Input: [[1,2],[2,3]]               Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Touching is fine? (yes)
 * - Sorted input? (no)
 *
 * APPROACH 1 — Brute force   O(2^n) time
 * Try every subset of intervals to keep; the largest pairwise non-overlapping one wins.
 * Answer = n - its size.
 *
 * APPROACH 2 — Optimal (sort by END, keep greedily)   O(n log n) time, O(1) extra
 * "Minimum removals" = n - "maximum intervals you can keep". The classic interval-scheduling
 * greedy: sort by end, keep an interval if it starts at or after the last kept end.
 * (Alternative that interviewers also accept: sort by START and, on overlap, drop the one
 * with the LARGER end - same count.)
 *
 * WHY GREEDY WORKS
 * Keeping the interval that ends earliest leaves the most room for everything after it; any
 * optimal set can be rewritten to start with it (exchange argument) without losing size.
 *
 * Dry run on [[1,2],[2,3],[3,4],[1,3]]:
 *   sorted by end: [1,2],[2,3],[1,3],[3,4]
 *   keep [1,2] (end 2); keep [2,3] (end 3); [1,3] starts 1 < 3 -> remove; keep [3,4]  -> 1
 *
 * EDGE CASES
 * - empty -> 0
 * - all the same -> n - 1
 * - one big interval covering all small ones -> 1 (remove the big one)
 */

function bruteForce(intervals) {
  const n = intervals.length;
  let bestKept = 0;
  for (let mask = 0; mask < (1 << n); mask++) {
    const chosen = [];
    for (let i = 0; i < n; i++) if (mask & (1 << i)) chosen.push(intervals[i]);
    chosen.sort((a, b) => a[0] - b[0]);
    let ok = true;
    for (let i = 1; i < chosen.length && ok; i++) if (chosen[i][0] < chosen[i - 1][1]) ok = false;
    if (ok) bestKept = Math.max(bestKept, chosen.length);
  }
  return n - bestKept;
}

function optimal(intervals) {
  if (intervals.length === 0) return 0;
  const sorted = [...intervals].sort((a, b) => a[1] - b[1]);
  let removed = 0;
  let lastEnd = sorted[0][1];
  for (let i = 1; i < sorted.length; i++) {
    const [start, end] = sorted[i];
    if (start >= lastEnd) lastEnd = end;   // compatible, keep
    else removed++;                        // overlaps the earliest-ending kept one, drop
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
  assert.strictEqual(solve([[1, 100], [2, 3], [4, 5], [6, 7]]), 1);
  assert.strictEqual(solve([[0, 5]]), 0);
  assert.strictEqual(solve([[-1, 1], [0, 2], [1, 3]]), 1);
}
console.log('✓ 06-non-overlapping-intervals passed');

module.exports = { optimal, bruteForce };

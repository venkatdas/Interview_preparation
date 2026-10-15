/**
 * 14. Employee Free Time   (LeetCode 759 — Hard)
 *
 * PROBLEM
 * schedule[i] is the sorted list of working intervals [start, end) of employee i.
 * Return the list of finite intervals during which EVERY employee is free, sorted.
 * Ignore the infinite free time before the first job and after the last.
 *
 * EXAMPLES
 * Input: [[[1,2],[5,6]],[[1,3]],[[4,10]]]   Output: [[3,4]]
 * Input: [[[1,3],[6,7]],[[2,4]],[[2,5],[9,12]]]   Output: [[5,6],[7,9]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can zero-length gaps like [3,3] count? (no, only positive length)
 * - Each employee's list is sorted and disjoint? (yes)
 *
 * APPROACH 1 — Brute force   O(T * n) time where T = coordinate range
 * Mark every busy unit of time in a Set from every employee; then scan from the global min to
 * max and collect unmarked runs. Only for small integer coordinates.
 *
 * APPROACH 2 — Optimal (flatten, sort, merge, read the gaps)   O(N log N) time, O(N) space
 * (N = total number of intervals.) Who owns an interval does not matter: free-for-everyone
 * time is exactly the complement of the UNION of all busy intervals. So flatten everything
 * into one list, sort by start, and walk with `busyUntil` = the max end seen so far.
 * Whenever the next interval starts AFTER busyUntil, the gap [busyUntil, start] is free.
 * (A k-way merge with a heap gives O(N log k) but the same idea; sorting is simpler.)
 *
 * Dry run on [[[1,2],[5,6]],[[1,3]],[[4,10]]]:
 *   flat sorted: [1,2],[1,3],[4,10],[5,6]
 *   busyUntil=2; [1,3] 1<=2 -> busyUntil=3; [4,10] 4>3 -> free [3,4], busyUntil=10; [5,6] -> 10
 *   -> [[3,4]]
 *
 * EDGE CASES
 * - one employee with gaps -> their own gaps
 * - fully overlapping schedules -> []
 * - touching intervals ([1,3],[3,5]) -> no gap
 */

function bruteForce(schedule) {
  const busy = new Set();
  let min = Infinity;
  let max = -Infinity;
  for (const employee of schedule) {
    for (const [start, end] of employee) {
      for (let t = start; t < end; t++) busy.add(t);
      min = Math.min(min, start);
      max = Math.max(max, end);
    }
  }
  const result = [];
  let gapStart = null;
  for (let t = min; t < max; t++) {
    if (!busy.has(t)) { if (gapStart === null) gapStart = t; }
    else if (gapStart !== null) { result.push([gapStart, t]); gapStart = null; }
  }
  return result;
}

function optimal(schedule) {
  const all = schedule.flat().sort((a, b) => a[0] - b[0]);
  const result = [];
  if (all.length === 0) return result;
  let busyUntil = all[0][1];
  for (let i = 1; i < all.length; i++) {
    const [start, end] = all[i];
    if (start > busyUntil) result.push([busyUntil, start]); // nobody works in this gap
    busyUntil = Math.max(busyUntil, end);
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([[[1, 2], [5, 6]], [[1, 3]], [[4, 10]]]), [[3, 4]]);
  assert.deepStrictEqual(solve([[[1, 3], [6, 7]], [[2, 4]], [[2, 5], [9, 12]]]), [[5, 6], [7, 9]]);
  assert.deepStrictEqual(solve([[[1, 3], [5, 7]]]), [[3, 5]]);
  assert.deepStrictEqual(solve([[[1, 10]], [[2, 3]]]), []);
  assert.deepStrictEqual(solve([[[1, 3]], [[3, 5]]]), []);
  assert.deepStrictEqual(solve([[[1, 2]], [[4, 5]], [[7, 8]]]), [[2, 4], [5, 7]]);
}
console.log('✓ 14-employee-free-time passed');

module.exports = { optimal, bruteForce };

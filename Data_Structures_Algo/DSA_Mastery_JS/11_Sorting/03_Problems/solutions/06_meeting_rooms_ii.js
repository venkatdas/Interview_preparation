/**
 * 06. Meeting Rooms II   (LeetCode 253 — Medium)
 *
 * PROBLEM
 * Given meeting time intervals [start, end), return the minimum number of
 * conference rooms required so that no two overlapping meetings share a room.
 * (Teaser for 31_Intervals; the sort-based trick here is worth knowing on its own.)
 *
 * EXAMPLES
 * Input: [[0,30],[5,10],[15,20]]   Output: 2   ([0,30] overlaps both others; they do not overlap each other)
 * Input: [[7,10],[2,4]]            Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - If one meeting ends at 10 and another starts at 10, can they share a room? (yes, half-open)
 * - Empty list -> 0
 *
 * APPROACH 1 — Brute force   O(n^2) time
 * For every meeting, count how many other meetings overlap it; the answer is the max
 * over all meetings of (overlaps with meetings that started at or before it) + 1.
 * Simpler: for every start time, count meetings that are "in progress" at that moment.
 *
 * APPROACH 2 — Optimal (sort starts and ends separately, two pointers)   O(n log n) time, O(n) space
 * The number of rooms needed at any moment = meetings started - meetings ended.
 * Sort all starts, sort all ends. Walk through the starts in order; before taking a
 * new start, if the earliest unprocessed end is <= this start, that room is free
 * (advance the end pointer, do not add a room). Otherwise add a room. The max rooms
 * in use is the answer. We do not care WHICH meeting ended, only that one did.
 * (A min-heap of end times is the other classic solution, see 14-heaps.)
 *
 * Dry run [[0,30],[5,10],[15,20]]:
 *   starts = [0,5,15]  ends = [10,20,30]  endPtr=0 rooms=0 best=0
 *   start 0:  ends[0]=10 > 0  -> rooms=1
 *   start 5:  ends[0]=10 > 5  -> rooms=2
 *   start 15: ends[0]=10 <= 15 -> free a room (endPtr=1), then take it: rooms stays 2
 *   answer 2
 *
 * EDGE CASES
 * - [] -> 0
 * - all meetings identical -> n rooms
 * - back-to-back [[1,5],[5,10]] -> 1 room
 */

function bruteForce(intervals) {
  let best = 0;
  for (const [start] of intervals) {
    // meetings in progress at time `start`: started <= start and end > start
    let inProgress = 0;
    for (const [s, e] of intervals) if (s <= start && e > start) inProgress++;
    best = Math.max(best, inProgress);
  }
  return best;
}

function optimal(intervals) {
  const starts = intervals.map((m) => m[0]).sort((a, b) => a - b);
  const ends = intervals.map((m) => m[1]).sort((a, b) => a - b);
  let rooms = 0, best = 0, endPtr = 0;
  for (const start of starts) {
    if (ends[endPtr] <= start) {
      endPtr++;              // some meeting finished before this one starts: reuse its room
    } else {
      rooms++;               // no room free: open a new one
    }
    best = Math.max(best, rooms);
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([[0, 30], [5, 10], [15, 20]]), 2);
  assert.strictEqual(solve([[7, 10], [2, 4]]), 1);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([[1, 5]]), 1);
  assert.strictEqual(solve([[1, 5], [5, 10]]), 1);
  assert.strictEqual(solve([[1, 10], [2, 7], [3, 19], [8, 12], [10, 20], [11, 30]]), 4);
  assert.strictEqual(solve([[2, 4], [2, 4], [2, 4]]), 3);
  assert.strictEqual(solve([[1, 3], [2, 6], [8, 10], [15, 18]]), 2);
}
for (let trial = 0; trial < 100; trial++) {
  const input = Array.from({ length: Math.floor(Math.random() * 10) }, () => {
    const s = Math.floor(Math.random() * 20);
    return [s, s + 1 + Math.floor(Math.random() * 10)];
  });
  assert.strictEqual(optimal(input), bruteForce(input));
}
console.log('✓ 06-meeting-rooms-ii passed');

module.exports = { optimal, bruteForce };

/**
 * 11. Meeting Rooms II   (LeetCode 253 — Medium)
 *
 * PROBLEM
 * Given meeting intervals [start, end), return the minimum number of
 * conference rooms needed so that no two overlapping meetings share a room.
 *
 * EXAMPLES
 * Input: [[0,30],[5,10],[15,20]]   Output: 2   Explanation: [0,30] overlaps both others
 * Input: [[7,10],[2,4]]            Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - If one meeting ends at 10 and another starts at 10, can they share? (yes, [start, end) )
 * - Empty input -> 0
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(n) space
 * For every meeting, count how many meetings are "in progress" at its start
 * time (start_j <= start_i < end_j). The max over all meetings is the answer,
 * because the room count peaks at some meeting's start.
 *
 * APPROACH 2 — Optimal (sort by start + min-heap of end times)   O(n log n) time, O(n) space
 * Sort by start. Walk the meetings in order and keep a MIN-heap of the end
 * times of meetings currently occupying a room. The top is the room that
 * frees up FIRST.
 *   - if heap.top <= meeting.start: that room is free -> pop it (reuse)
 *   - push this meeting's end (it now occupies a room)
 * The heap size after processing is the number of rooms in use; the maximum
 * size ever reached is the answer (it's also just the final size since we
 * never shrink by more than we grow... but tracking the max is clearer).
 *
 * Dry run on [[0,30],[5,10],[15,20]] (already sorted by start):
 *   [0,30]:  heap empty -> push 30          heap={30}     rooms=1
 *   [5,10]:  top 30 > 5, no free room -> push 10   heap={10,30}  rooms=2
 *   [15,20]: top 10 <= 15 -> pop 10 (reuse) -> push 20  heap={20,30} rooms=2
 *   answer 2
 *
 * (See 31_Intervals for the "sweep line / two sorted arrays" version.)
 *
 * EDGE CASES
 * - [] -> 0
 * - all meetings at the same time -> n rooms
 * - back-to-back meetings [1,5],[5,9] -> 1 room
 */

const { MinHeap } = require('../../02_Implementations/min_heap');

function bruteForce(intervals) {
  let rooms = 0;
  for (const [start] of intervals) {
    let inProgress = 0;
    for (const [otherStart, otherEnd] of intervals) {
      if (otherStart <= start && start < otherEnd) inProgress++;
    }
    rooms = Math.max(rooms, inProgress);
  }
  return rooms;
}

function optimal(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const endTimes = new MinHeap(); // one entry per occupied room; top = earliest to free up
  let rooms = 0;
  for (const [start, end] of sorted) {
    if (!endTimes.isEmpty() && endTimes.peek() <= start) endTimes.pop(); // reuse that room
    endTimes.push(end);
    rooms = Math.max(rooms, endTimes.size());
  }
  return rooms;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([[0, 30], [5, 10], [15, 20]]), 2);
  assert.strictEqual(solve([[7, 10], [2, 4]]), 1);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([[1, 5], [5, 9]]), 1);
  assert.strictEqual(solve([[1, 10], [2, 10], [3, 10]]), 3);
  assert.strictEqual(solve([[9, 10], [4, 9], [4, 17]]), 2);
  assert.strictEqual(solve([[1, 3], [2, 6], [8, 10], [9, 12], [11, 13]]), 2);
}
console.log('✓ 11-meeting-rooms-ii passed');

module.exports = { optimal, bruteForce };

/**
 * 09. Meeting Rooms II   (LeetCode 253 — Medium)
 *
 * PROBLEM
 * Given meeting intervals [start, end), return the minimum number of conference rooms
 * needed so that no two meetings in the same room overlap. A meeting may start exactly when
 * another ends in the same room.
 *
 * EXAMPLES
 * Input: [[0,30],[5,10],[15,20]]   Output: 2
 * Input: [[7,10],[2,4]]            Output: 1
 * Input: [[1,5],[5,8]]             Output: 1   Explanation: touching shares a room
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Touching allowed in the same room? (yes)
 * - Need room assignments or just the count? (count)
 *
 * APPROACH 1 — Brute force   O(n * T) time, where T = coordinate range
 * For every unit of time count how many meetings cover it; take the max. Only works for
 * small integer coordinates; shown with a Map keyed by time.
 *
 * APPROACH 2 — Optimal A (sweep line / two sorted arrays)   O(n log n) time, O(n) space
 * The answer is the max number of meetings alive at once. Sort starts and ends separately.
 * Walk the starts; for each start, if the smallest unprocessed end <= start, a room was
 * freed (advance the end pointer, do not count a new room). Otherwise open a new room.
 *
 * APPROACH 2 — Optimal B (min-heap of end times)   O(n log n) time, O(n) space
 * Sort by start. Heap holds the end times of meetings occupying rooms. For each meeting pop
 * every end <= its start (those rooms are free again), push its end. Max heap size = rooms.
 * Both are implemented below; `optimal` uses the two-array sweep, `optimalHeap` the heap.
 *
 * Dry run (sweep) on [[0,30],[5,10],[15,20]]:
 *   starts [0,5,15], ends [10,20,30]
 *   start 0 : ends[0]=10 > 0  -> rooms 1
 *   start 5 : ends[0]=10 > 5  -> rooms 2
 *   start 15: ends[0]=10 <=15 -> reuse, endPtr=1; rooms stays 2   -> 2
 *
 * EDGE CASES
 * - empty -> 0
 * - all meetings at the same time -> n
 * - touching -> 1
 */

function bruteForce(intervals) {
  const alive = new Map();
  for (const [start, end] of intervals) {
    for (let t = start; t < end; t++) alive.set(t, (alive.get(t) || 0) + 1);
  }
  let rooms = 0;
  for (const count of alive.values()) rooms = Math.max(rooms, count);
  return rooms;
}

function optimal(intervals) {
  const starts = intervals.map((x) => x[0]).sort((a, b) => a - b);
  const ends = intervals.map((x) => x[1]).sort((a, b) => a - b);
  let rooms = 0;
  let endPtr = 0;
  for (const start of starts) {
    if (ends[endPtr] <= start) endPtr++;   // a meeting finished before this one starts: reuse its room
    else rooms++;                          // everyone is still busy: open a new room
  }
  return rooms;
}

// tiny min-heap of numbers, enough for this file (see 19_Heaps_And_Priority_Queues/ for a full one)
class MinHeap {
  #data = [];
  size() { return this.#data.length; }
  peek() { return this.#data[0]; }
  push(value) {
    const data = this.#data;
    data.push(value);
    let i = data.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (data[parent] <= data[i]) break;
      [data[parent], data[i]] = [data[i], data[parent]];
      i = parent;
    }
  }
  pop() {
    const data = this.#data;
    const top = data[0];
    const last = data.pop();
    if (data.length) {
      data[0] = last;
      let i = 0;
      while (true) {
        const left = 2 * i + 1, right = left + 1;
        let smallest = i;
        if (left < data.length && data[left] < data[smallest]) smallest = left;
        if (right < data.length && data[right] < data[smallest]) smallest = right;
        if (smallest === i) break;
        [data[smallest], data[i]] = [data[i], data[smallest]];
        i = smallest;
      }
    }
    return top;
  }
}

function optimalHeap(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const endTimes = new MinHeap();
  let rooms = 0;
  for (const [start, end] of sorted) {
    while (endTimes.size() && endTimes.peek() <= start) endTimes.pop(); // free finished rooms
    endTimes.push(end);
    rooms = Math.max(rooms, endTimes.size());
  }
  return rooms;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal, optimalHeap]) {
  assert.strictEqual(solve([[0, 30], [5, 10], [15, 20]]), 2);
  assert.strictEqual(solve([[7, 10], [2, 4]]), 1);
  assert.strictEqual(solve([[1, 5], [5, 8]]), 1);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([[1, 4], [1, 4], [1, 4]]), 3);
  assert.strictEqual(solve([[1, 10], [2, 3], [4, 5], [6, 7]]), 2);
  assert.strictEqual(solve([[13, 15], [1, 13], [6, 9]]), 2);
}
console.log('✓ 09-meeting-rooms-ii passed');

module.exports = { optimal, optimalHeap, bruteForce };

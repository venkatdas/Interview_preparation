/**
 * 04. My Calendar III   (LeetCode 732 — Hard)
 *
 * PROBLEM
 * Implement MyCalendarThree with book(start, end) (half-open interval [start, end)).
 * After each booking return k, the maximum number of events that overlap at any
 * single point in time, considering ALL bookings so far.
 *
 * EXAMPLES
 * book(10, 20) -> 1
 * book(50, 60) -> 1
 * book(10, 40) -> 2     ([10,20) and [10,40) overlap)
 * book(5, 15)  -> 3     (at time 10..15 three events overlap)
 * book(5, 10)  -> 3
 * book(25, 55) -> 3
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Number of calls? (up to 400 -> even O(n^2) total works; interviewers want the idea)
 * - Times up to 10^9 -> cannot allocate an array per unit of time.
 * - Touching intervals ([10,20) and [20,30)) do not overlap.
 *
 * APPROACH 1 — Brute force / Sweep line with a sorted map   O(n^2) time per call (n calls)
 * Keep a map time -> delta where start gets +1 and end gets -1. After each booking,
 * walk the keys in sorted order and keep a running sum; the max running sum is k.
 * Sorting the keys each call costs O(n log n), the walk O(n). Simple and it passes.
 *
 * APPROACH 2 — Optimal (Dynamic segment tree, range add + global max)   O(log C) per call
 * Think of a segment tree over the whole time axis [0, 1e9). We cannot allocate it, so
 * we create nodes only when a booking touches them (a "dynamic" / "sparse" tree).
 * Each node stores: max = largest overlap count anywhere in its range,
 *                   lazy = +value that applies to the whole range (not yet pushed down).
 * book(start, end) = rangeAdd(start, end - 1, +1); answer = root.max.
 * A node that is fully covered just increments its max and its lazy and stops, so a
 * booking touches O(log C) nodes, C = 1e9 -> about 30 levels.
 *
 * Dry run (small axis 0..7 for readability):
 *   book(1, 4) -> add +1 on [1,3]
 *     root[0,7] partial -> left[0,3] partial -> [0,1] partial -> [1,1] covered: max 1, lazy 1
 *                                               [2,3] covered: max 1, lazy 1
 *     root.max = 1 -> return 1
 *   book(2, 6) -> add +1 on [2,5]
 *     [2,3] covered again: max 2, lazy 2
 *     [4,5] covered: max 1
 *     root.max = 2 -> return 2
 *
 * EDGE CASES
 * - identical bookings repeated (k grows by 1 each time)
 * - touching intervals (should not count as overlap -> use end - 1)
 * - a booking that spans everything
 */

class MyCalendarThreeBrute {
  constructor() {
    this.delta = new Map(); // time -> +1 for starts, -1 for ends
  }
  book(start, end) {
    this.delta.set(start, (this.delta.get(start) || 0) + 1);
    this.delta.set(end, (this.delta.get(end) || 0) - 1);
    const times = [...this.delta.keys()].sort((a, b) => a - b);
    let active = 0;
    let best = 0;
    for (const t of times) {
      active += this.delta.get(t);
      best = Math.max(best, active);
    }
    return best;
  }
}

// Dynamic segment tree node: created on demand
class Node {
  constructor() {
    this.max = 0;
    this.lazy = 0;
    this.left = null;
    this.right = null;
  }
}

class MyCalendarThree {
  constructor() {
    this.root = new Node();
    this.LO = 0;
    this.HI = 1e9;
  }

  book(start, end) {
    this.#add(this.root, this.LO, this.HI, start, end - 1);
    return this.root.max;
  }

  #add(node, lo, hi, l, r) {
    if (r < lo || hi < l) return;
    if (l <= lo && hi <= r) {
      node.max += 1;     // every point in this range gets one more event
      node.lazy += 1;    // remember to tell the children later
      return;
    }
    if (!node.left) node.left = new Node();
    if (!node.right) node.right = new Node();
    // push the pending lazy value down before descending
    if (node.lazy) {
      for (const child of [node.left, node.right]) {
        child.max += node.lazy;
        child.lazy += node.lazy;
      }
      node.lazy = 0;
    }
    const mid = Math.floor((lo + hi) / 2);
    this.#add(node.left, lo, mid, l, r);
    this.#add(node.right, mid + 1, hi, l, r);
    node.max = Math.max(node.left.max, node.right.max);
  }
}

// ---------- tests ----------
const assert = require('assert');
for (const Cls of [MyCalendarThreeBrute, MyCalendarThree]) {
  const cal = new Cls();
  assert.strictEqual(cal.book(10, 20), 1);
  assert.strictEqual(cal.book(50, 60), 1);
  assert.strictEqual(cal.book(10, 40), 2);
  assert.strictEqual(cal.book(5, 15), 3);
  assert.strictEqual(cal.book(5, 10), 3);
  assert.strictEqual(cal.book(25, 55), 3);

  const touching = new Cls();
  assert.strictEqual(touching.book(10, 20), 1);
  assert.strictEqual(touching.book(20, 30), 1);   // touching, no overlap
  assert.strictEqual(touching.book(0, 1e9), 2);   // spans everything

  const same = new Cls();
  assert.strictEqual(same.book(1, 2), 1);
  assert.strictEqual(same.book(1, 2), 2);
  assert.strictEqual(same.book(1, 2), 3);
}
for (let trial = 0; trial < 20; trial++) {
  const a = new MyCalendarThreeBrute();
  const b = new MyCalendarThree();
  for (let op = 0; op < 40; op++) {
    const start = Math.floor(Math.random() * 50);
    const end = start + 1 + Math.floor(Math.random() * 20);
    assert.strictEqual(b.book(start, end), a.book(start, end));
  }
}
console.log('✓ 04-my-calendar-iii passed');

module.exports = {
  MyCalendarThree,
  MyCalendarThreeBrute,
  optimal: MyCalendarThree,
  bruteForce: MyCalendarThreeBrute,
};

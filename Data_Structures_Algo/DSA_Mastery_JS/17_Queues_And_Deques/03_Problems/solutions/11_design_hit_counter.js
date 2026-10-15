/**
 * 11. Design Hit Counter   (LeetCode 362 — Medium)
 *
 * PROBLEM
 * Design a counter that records hits and returns the number of hits in the
 * past 5 minutes (300 seconds). Timestamps are in seconds and arrive in
 * non-decreasing order (several hits can share a timestamp).
 *   hit(timestamp)      record one hit
 *   getHits(timestamp)  hits in (timestamp - 300, timestamp]
 *
 * EXAMPLES
 * hit(1) hit(2) hit(3)  getHits(4) -> 3
 * hit(300)              getHits(300) -> 4
 *                       getHits(301) -> 3   Explanation: the hit at t=1 is now outside
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Timestamps monotonic? (yes -> queue works. If not, you'd need a sorted structure)
 * - Many hits at the SAME second? (yes -> follow-up: store [timestamp, count] pairs
 *   instead of one entry per hit, so memory stays O(300))
 * - Window is (t-300, t]: a hit exactly 300s old does NOT count
 *
 * NAIVE APPROACH   O(n) per getHits, unbounded memory
 * Store all timestamps in an array; getHits filters. Memory never shrinks.
 *
 * APPROACH — Optimal (queue of [timestamp, count], expire from the front)
 *   hit(t):     if the back has the same timestamp, count++ ; else enqueue [t, 1]. total++
 *   getHits(t): while front.timestamp <= t - 300: total -= front.count, dequeue
 *               return total
 * Memory is bounded by 300 distinct seconds. Each entry is enqueued and
 * dequeued once -> amortized O(1).
 *
 * Dry run: hit 1,2,3 ; getHits 4 ; hit 300 ; getHits 300 ; getHits 301
 *   hits        queue [[1,1],[2,1],[3,1]]   total 3
 *   getHits 4   front 1 > 4-300 -> keep. -> 3
 *   hit 300     queue [...,[300,1]]         total 4
 *   getHits 300 -> 4
 *   getHits 301 front 1 <= 1 -> drop. 2 <= 1? no. -> 3
 *
 * EDGE CASES
 * - getHits before any hit -> 0
 * - many hits in one second (count compression)
 * - huge gap in time clears the whole queue
 */

const { Queue } = require('../../02_Implementations/queue');

const WINDOW = 300;

class HitCounterNaive {
  #hits = [];
  hit(timestamp) { this.#hits.push(timestamp); }
  getHits(timestamp) {
    return this.#hits.filter((t) => t > timestamp - WINDOW && t <= timestamp).length;
  }
}

class HitCounter {
  #queue = new Queue(); // entries [timestamp, count], oldest at the front
  #total = 0;
  #last = null;         // the most recent entry, for same-second compression

  hit(timestamp) {
    if (this.#last && this.#last[0] === timestamp) {
      this.#last[1]++;
    } else {
      this.#last = [timestamp, 1];
      this.#queue.enqueue(this.#last);
    }
    this.#total++;
  }

  getHits(timestamp) {
    while (!this.#queue.isEmpty() && this.#queue.peek()[0] <= timestamp - WINDOW) {
      this.#total -= this.#queue.dequeue()[1];
    }
    if (this.#queue.isEmpty()) this.#last = null;
    return this.#total;
  }
}

// ---------- tests ----------
const assert = require('assert');
for (const Impl of [HitCounterNaive, HitCounter]) {
  const counter = new Impl();
  assert.strictEqual(counter.getHits(1), 0);
  counter.hit(1); counter.hit(2); counter.hit(3);
  assert.strictEqual(counter.getHits(4), 3);
  counter.hit(300);
  assert.strictEqual(counter.getHits(300), 4);
  assert.strictEqual(counter.getHits(301), 3);

  // many hits in the same second
  for (let i = 0; i < 1000; i++) counter.hit(301);
  assert.strictEqual(counter.getHits(301), 1003);
  assert.strictEqual(counter.getHits(600), 1000);   // window (300,600]: t=300 is exactly 300s old -> out
  assert.strictEqual(counter.getHits(601), 0);      // window (301,601]: the 301 hits are out too
  assert.strictEqual(counter.getHits(100000), 0);
  counter.hit(100001);
  assert.strictEqual(counter.getHits(100001), 1);
}
console.log('✓ 11-design-hit-counter passed');

module.exports = { HitCounter, HitCounterNaive };

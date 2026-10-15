/**
 * 05. Number of Recent Calls   (LeetCode 933 — Easy)
 *
 * PROBLEM
 * Implement RecentCounter with ping(t): record a request at time t (ms) and
 * return how many requests happened in [t - 3000, t]. Calls to ping use
 * strictly increasing t.
 *
 * EXAMPLES
 * ping(1) -> 1   ping(100) -> 2   ping(3001) -> 3   ping(3002) -> 3
 * Explanation: at t=3002 the window is [2, 3002]; the ping at t=1 is out.
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is t strictly increasing? (yes - so old pings leave the window in order)
 * - Window inclusive on both ends? (yes)
 *
 * NAIVE APPROACH   O(n) per ping, O(n) space
 * Store every t in an array; on each ping, count how many are >= t - 3000.
 * The array grows forever and every ping re-scans it.
 *
 * APPROACH — Optimal (queue of timestamps, drop the old ones)   amortized O(1) per ping, O(window) space
 * Because times only increase, the OLDEST pings expire first. That's a queue:
 *   enqueue t at the back
 *   while front < t - 3000: dequeue
 *   return size
 * Each timestamp is enqueued once and dequeued once -> amortized O(1).
 *
 * Dry run: ping 1, 100, 3001, 3002
 *   ping 1     queue [1]                 -> 1
 *   ping 100   queue [1,100]             -> 2
 *   ping 3001  window [1,3001]: 1 stays   queue [1,100,3001]   -> 3
 *   ping 3002  window [2,3002]: drop 1    queue [100,3001,3002] -> 3
 *
 * EDGE CASES
 * - first ping -> 1
 * - a gap larger than 3000 clears the queue down to the new ping
 * - t exactly 3000 later is still inside the window
 */

const { Queue } = require('../../02_Implementations/queue');

class RecentCounterNaive {
  #times = [];
  ping(t) {
    this.#times.push(t);
    return this.#times.filter((time) => time >= t - 3000).length;
  }
}

class RecentCounter {
  #queue = new Queue();

  ping(t) {
    this.#queue.enqueue(t);
    while (this.#queue.peek() < t - 3000) this.#queue.dequeue(); // expire old pings
    return this.#queue.size();
  }
}

// ---------- tests ----------
const assert = require('assert');
for (const Impl of [RecentCounterNaive, RecentCounter]) {
  const counter = new Impl();
  assert.strictEqual(counter.ping(1), 1);
  assert.strictEqual(counter.ping(100), 2);
  assert.strictEqual(counter.ping(3001), 3);
  assert.strictEqual(counter.ping(3002), 3);
  assert.strictEqual(counter.ping(10000), 1);   // big gap clears everything
  assert.strictEqual(counter.ping(13000), 2);   // exactly 3000 later still counts
  assert.strictEqual(counter.ping(13001), 2);   // now 10000 is out
}
console.log('✓ 05-number-of-recent-calls passed');

module.exports = { RecentCounter, RecentCounterNaive };

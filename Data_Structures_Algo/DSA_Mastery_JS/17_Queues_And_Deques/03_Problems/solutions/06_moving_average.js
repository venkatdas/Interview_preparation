/**
 * 06. Moving Average from Data Stream   (LeetCode 346 — Easy)
 *
 * PROBLEM
 * Implement MovingAverage(size) with next(val): add val to the stream and
 * return the average of the last `size` values.
 *
 * EXAMPLES
 * MovingAverage(3): next(1) -> 1,  next(10) -> 5.5,  next(3) -> 4.667,  next(5) -> 6
 * Explanation: (1+10)/2, (1+10+3)/3, (10+3+5)/3
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Before the window fills, average over however many values exist? (yes)
 * - Floating point result is fine? (yes)
 *
 * NAIVE APPROACH   O(size) per next
 * Keep all values in an array; on each next, slice the last `size` values and
 * sum them. Re-summing the window every time is wasted work.
 *
 * APPROACH — Optimal (queue + running sum)   O(1) per next, O(size) space
 * Keep a queue of the last `size` values and the running `sum`.
 *   enqueue val, sum += val
 *   if queue.size > size: sum -= dequeue()
 *   return sum / queue.size
 * The sum is updated incrementally: add the newcomer, subtract the one that fell out.
 *
 * Dry run, size 3: 1, 10, 3, 5
 *   next 1    queue [1]        sum 1    -> 1
 *   next 10   queue [1,10]     sum 11   -> 5.5
 *   next 3    queue [1,10,3]   sum 14   -> 4.667
 *   next 5    queue [1,10,3,5] -> too big, drop 1: [10,3,5]  sum 18 -> 6
 *
 * A CircularQueue of capacity `size` works too (fixed memory, no allocation).
 *
 * EDGE CASES
 * - size 1 -> always the latest value
 * - negative values
 * - fewer values than size so far
 */

const { Queue } = require('../../02_Implementations/queue');

class MovingAverageNaive {
  #values = [];
  constructor(size) { this.size = size; }
  next(val) {
    this.#values.push(val);
    const window = this.#values.slice(-this.size);
    return window.reduce((sum, value) => sum + value, 0) / window.length;
  }
}

class MovingAverage {
  #queue = new Queue();
  #sum = 0;

  constructor(size) {
    this.size = size;
  }

  next(val) {
    this.#queue.enqueue(val);
    this.#sum += val;
    if (this.#queue.size() > this.size) {
      this.#sum -= this.#queue.dequeue(); // the oldest value leaves the window
    }
    return this.#sum / this.#queue.size();
  }
}

// ---------- tests ----------
const assert = require('assert');
const close = (a, b) => Math.abs(a - b) < 1e-9;
for (const Impl of [MovingAverageNaive, MovingAverage]) {
  const avg = new Impl(3);
  assert.strictEqual(avg.next(1), 1);
  assert.strictEqual(avg.next(10), 5.5);
  assert.ok(close(avg.next(3), 14 / 3));
  assert.strictEqual(avg.next(5), 6);
  assert.strictEqual(avg.next(-9), (3 + 5 - 9) / 3);

  const single = new Impl(1);
  assert.strictEqual(single.next(4), 4);
  assert.strictEqual(single.next(8), 8);
}
console.log('✓ 06-moving-average passed');

module.exports = { MovingAverage, MovingAverageNaive };

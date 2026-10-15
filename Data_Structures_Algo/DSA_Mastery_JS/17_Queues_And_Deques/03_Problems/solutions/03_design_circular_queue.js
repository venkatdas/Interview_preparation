/**
 * 03. Design Circular Queue   (LeetCode 622 — Medium)
 *
 * PROBLEM
 * Design a queue of fixed size k with these operations, all O(1):
 *   enQueue(value) -> true if inserted, false if full
 *   deQueue()      -> true if removed, false if empty
 *   Front()        -> front value or -1
 *   Rear()         -> back value or -1
 *   isEmpty(), isFull()
 *
 * EXAMPLES
 * MyCircularQueue(3): enQueue(1) true, enQueue(2) true, enQueue(3) true,
 * enQueue(4) false, Rear() 3, isFull() true, deQueue() true, enQueue(4) true, Rear() 4
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Values are non-negative, so -1 can mean "empty"? (yes)
 * - Must I use a fixed-size array (no built-in push/shift)? (yes, that's the point)
 *
 * NAIVE APPROACH   O(n) deQueue
 * Use a JS array with push() and shift() and check length against k. shift()
 * moves every element left, so deQueue is O(n). Also misses the point of the
 * exercise (the ring buffer).
 *
 * APPROACH — Optimal (ring buffer: array + head index + count)   O(1) all ops, O(k) space
 * Keep `head` (index of the front) and `count`. The back slot is
 * (head + count) % k. Enqueue writes there; dequeue moves head forward with
 * wrap-around: head = (head + 1) % k. Nothing is ever shifted.
 *
 * Dry run, k = 3:
 *   enQueue 1,2,3    items [1,2,3]  head=0 count=3  (full)
 *   deQueue          items [_,2,3]  head=1 count=2
 *   enQueue 4        back=(1+2)%3=0 -> items [4,2,3]  head=1 count=3
 *   Front -> items[1]=2 ; Rear -> items[(1+3-1)%3]=items[0]=4
 *
 * EDGE CASES
 * - k = 1
 * - Rear when the back has wrapped to index 0
 * - enQueue on full / deQueue on empty return false and change nothing
 */

class MyCircularQueueNaive {
  #items = [];
  constructor(k) { this.k = k; }
  enQueue(value) {
    if (this.isFull()) return false;
    this.#items.push(value);
    return true;
  }
  deQueue() {
    if (this.isEmpty()) return false;
    this.#items.shift(); // O(n)
    return true;
  }
  Front() { return this.isEmpty() ? -1 : this.#items[0]; }
  Rear() { return this.isEmpty() ? -1 : this.#items[this.#items.length - 1]; }
  isEmpty() { return this.#items.length === 0; }
  isFull() { return this.#items.length === this.k; }
}

class MyCircularQueue {
  #items;
  #head = 0;
  #count = 0;

  constructor(k) {
    this.k = k;
    this.#items = new Array(k);
  }

  enQueue(value) {
    if (this.isFull()) return false;
    const back = (this.#head + this.#count) % this.k; // wraps around
    this.#items[back] = value;
    this.#count++;
    return true;
  }

  deQueue() {
    if (this.isEmpty()) return false;
    this.#head = (this.#head + 1) % this.k;
    this.#count--;
    return true;
  }

  Front() {
    return this.isEmpty() ? -1 : this.#items[this.#head];
  }

  Rear() {
    if (this.isEmpty()) return -1;
    const backIndex = (this.#head + this.#count - 1) % this.k;
    return this.#items[backIndex];
  }

  isEmpty() {
    return this.#count === 0;
  }

  isFull() {
    return this.#count === this.k;
  }
}

// ---------- tests ----------
const assert = require('assert');
for (const Impl of [MyCircularQueueNaive, MyCircularQueue]) {
  const q = new Impl(3);
  assert.strictEqual(q.enQueue(1), true);
  assert.strictEqual(q.enQueue(2), true);
  assert.strictEqual(q.enQueue(3), true);
  assert.strictEqual(q.enQueue(4), false);
  assert.strictEqual(q.Rear(), 3);
  assert.strictEqual(q.isFull(), true);
  assert.strictEqual(q.deQueue(), true);
  assert.strictEqual(q.enQueue(4), true); // wraps
  assert.strictEqual(q.Rear(), 4);
  assert.strictEqual(q.Front(), 2);

  assert.strictEqual(q.deQueue(), true);
  assert.strictEqual(q.deQueue(), true);
  assert.strictEqual(q.deQueue(), true);
  assert.strictEqual(q.deQueue(), false);
  assert.strictEqual(q.Front(), -1);
  assert.strictEqual(q.Rear(), -1);
  assert.strictEqual(q.isEmpty(), true);

  const one = new Impl(1);
  assert.strictEqual(one.enQueue(9), true);
  assert.strictEqual(one.enQueue(8), false);
  assert.strictEqual(one.Front(), 9);
  assert.strictEqual(one.Rear(), 9);
  assert.strictEqual(one.deQueue(), true);
  assert.strictEqual(one.enQueue(8), true);
  assert.strictEqual(one.Rear(), 8);
}
console.log('✓ 03-design-circular-queue passed');

module.exports = { MyCircularQueue, MyCircularQueueNaive };

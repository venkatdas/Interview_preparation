/**
 * 04. Design Circular Deque   (LeetCode 641 — Medium)
 *
 * PROBLEM
 * Design a fixed-size double-ended queue of capacity k:
 *   insertFront(v), insertLast(v) -> true/false (false if full)
 *   deleteFront(), deleteLast()   -> true/false (false if empty)
 *   getFront(), getRear()         -> value or -1
 *   isEmpty(), isFull()
 * All in O(1).
 *
 * EXAMPLES
 * MyCircularDeque(3): insertLast(1) true, insertLast(2) true, insertFront(3) true,
 * insertFront(4) false, getRear() 2, isFull() true, deleteLast() true,
 * insertFront(4) true, getFront() 4
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Values non-negative (so -1 means empty)? (yes)
 * - Fixed array, no push/unshift/shift? (yes)
 *
 * NAIVE APPROACH   O(n) for front operations
 * A JS array with unshift/shift for the front and push/pop for the back.
 * unshift and shift are O(n).
 *
 * APPROACH — Optimal (ring buffer with head index + count)   O(1) all ops, O(k) space
 * Same as the circular queue, plus:
 *   insertFront: head = (head - 1 + k) % k, write there.   (+k avoids negative modulo!)
 *   deleteLast:  count-- (the back slot is simply forgotten)
 * The back index is always (head + count - 1) % k.
 *
 * Dry run, k = 3:
 *   insertLast 1, 2     [1,2,_]  head=0 count=2
 *   insertFront 3       head=(0-1+3)%3=2 -> [1,2,3]  head=2 count=3   (3 sits at index 2 but is the FRONT)
 *   getRear  -> items[(2+3-1)%3]=items[1]=2
 *   deleteLast          count=2  -> logical order: 3,1
 *   insertFront 4       head=(2-1+3)%3=1 -> items[1]=4 -> logical order 4,3,1
 *   getFront -> 4
 *
 * EDGE CASES
 * - negative modulo in JavaScript: (-1) % 3 === -1, so always add k first
 * - k = 1
 * - mixing front and back inserts until the buffer wraps both ways
 */

class MyCircularDequeNaive {
  #items = [];
  constructor(k) { this.k = k; }
  insertFront(v) { if (this.isFull()) return false; this.#items.unshift(v); return true; }
  insertLast(v) { if (this.isFull()) return false; this.#items.push(v); return true; }
  deleteFront() { if (this.isEmpty()) return false; this.#items.shift(); return true; }
  deleteLast() { if (this.isEmpty()) return false; this.#items.pop(); return true; }
  getFront() { return this.isEmpty() ? -1 : this.#items[0]; }
  getRear() { return this.isEmpty() ? -1 : this.#items[this.#items.length - 1]; }
  isEmpty() { return this.#items.length === 0; }
  isFull() { return this.#items.length === this.k; }
}

class MyCircularDeque {
  #items;
  #head = 0;
  #count = 0;

  constructor(k) {
    this.k = k;
    this.#items = new Array(k);
  }

  insertFront(value) {
    if (this.isFull()) return false;
    this.#head = (this.#head - 1 + this.k) % this.k; // step back with wrap
    this.#items[this.#head] = value;
    this.#count++;
    return true;
  }

  insertLast(value) {
    if (this.isFull()) return false;
    const back = (this.#head + this.#count) % this.k;
    this.#items[back] = value;
    this.#count++;
    return true;
  }

  deleteFront() {
    if (this.isEmpty()) return false;
    this.#head = (this.#head + 1) % this.k;
    this.#count--;
    return true;
  }

  deleteLast() {
    if (this.isEmpty()) return false;
    this.#count--; // the back index is derived from count, so nothing else changes
    return true;
  }

  getFront() {
    return this.isEmpty() ? -1 : this.#items[this.#head];
  }

  getRear() {
    if (this.isEmpty()) return -1;
    return this.#items[(this.#head + this.#count - 1) % this.k];
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
for (const Impl of [MyCircularDequeNaive, MyCircularDeque]) {
  const d = new Impl(3);
  assert.strictEqual(d.insertLast(1), true);
  assert.strictEqual(d.insertLast(2), true);
  assert.strictEqual(d.insertFront(3), true);
  assert.strictEqual(d.insertFront(4), false);
  assert.strictEqual(d.getRear(), 2);
  assert.strictEqual(d.isFull(), true);
  assert.strictEqual(d.deleteLast(), true);
  assert.strictEqual(d.insertFront(4), true);
  assert.strictEqual(d.getFront(), 4);
  assert.strictEqual(d.getRear(), 1);

  assert.strictEqual(d.deleteFront(), true);
  assert.strictEqual(d.deleteFront(), true);
  assert.strictEqual(d.deleteFront(), true);
  assert.strictEqual(d.deleteFront(), false);
  assert.strictEqual(d.deleteLast(), false);
  assert.strictEqual(d.getFront(), -1);
  assert.strictEqual(d.getRear(), -1);

  // wrap in both directions
  const w = new Impl(4);
  w.insertFront(1); w.insertFront(2); w.insertLast(3); w.insertLast(4);
  assert.strictEqual(w.isFull(), true);
  assert.strictEqual(w.getFront(), 2);
  assert.strictEqual(w.getRear(), 4);
  w.deleteLast(); w.deleteLast();
  w.insertFront(5);
  assert.strictEqual(w.getFront(), 5);
  assert.strictEqual(w.getRear(), 1);

  const one = new Impl(1);
  assert.strictEqual(one.insertFront(7), true);
  assert.strictEqual(one.insertLast(8), false);
  assert.strictEqual(one.getRear(), 7);
}
console.log('✓ 04-design-circular-deque passed');

module.exports = { MyCircularDeque, MyCircularDequeNaive };

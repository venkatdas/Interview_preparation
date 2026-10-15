/**
 * Queue implementations in JavaScript.
 *
 * 1. Queue           - linked-list based, O(1) enqueue AND dequeue
 *                      (an array with shift() is O(n) per dequeue - avoid it)
 * 2. CircularQueue   - fixed capacity ring buffer over an array, O(1) everything
 * 3. Deque           - double-ended queue over a doubly linked list, O(1) at both ends
 * 4. MonotonicDeque  - helper for sliding-window max/min, amortized O(1) per push
 *
 * A queue is FIFO: the first thing in is the first thing out.
 */

// ---------- 1. Linked-list queue ----------
// Enqueue at the TAIL, dequeue from the HEAD. Both ends are O(1) because we
// keep pointers to both and never walk the list.
class Queue {
  #head = null;
  #tail = null;
  #size = 0;

  enqueue(value) {
    const node = { value, next: null };
    if (this.#tail) {
      this.#tail.next = node; // old tail points to the new node
    } else {
      this.#head = node;      // queue was empty: node is also the head
    }
    this.#tail = node;
    this.#size++;
    return this;
  }

  dequeue() {
    if (!this.#head) return undefined;
    const { value } = this.#head;
    this.#head = this.#head.next;
    if (!this.#head) this.#tail = null; // removed the last node
    this.#size--;
    return value;
  }

  peek() {
    return this.#head ? this.#head.value : undefined;
  }

  isEmpty() {
    return this.#size === 0;
  }

  size() {
    return this.#size;
  }

  toArray() {
    const out = [];
    for (let node = this.#head; node; node = node.next) out.push(node.value);
    return out; // front -> back
  }
}

// ---------- 2. Circular queue (ring buffer) ----------
// Fixed-size array. `front` is the index of the first element, `count` how
// many are stored. The back index is (front + count) % capacity, so when we
// reach the end of the array we wrap around to index 0 instead of shifting.
//
//   capacity 4, after enqueue 1,2,3 and dequeue:   [_, 2, 3, _]  front=1 count=2
//   enqueue 4, enqueue 5:                          [5, 2, 3, 4]  front=1 count=4 (wrapped)
class CircularQueue {
  #items;
  #front = 0;
  #count = 0;

  constructor(capacity) {
    this.capacity = capacity;
    this.#items = new Array(capacity);
  }

  enqueue(value) {
    if (this.isFull()) return false;
    const back = (this.#front + this.#count) % this.capacity;
    this.#items[back] = value;
    this.#count++;
    return true;
  }

  dequeue() {
    if (this.isEmpty()) return undefined;
    const value = this.#items[this.#front];
    this.#items[this.#front] = undefined; // let the GC reclaim it
    this.#front = (this.#front + 1) % this.capacity;
    this.#count--;
    return value;
  }

  peek() {
    return this.isEmpty() ? undefined : this.#items[this.#front];
  }

  peekBack() {
    if (this.isEmpty()) return undefined;
    const backIndex = (this.#front + this.#count - 1) % this.capacity;
    return this.#items[backIndex];
  }

  isEmpty() {
    return this.#count === 0;
  }

  isFull() {
    return this.#count === this.capacity;
  }

  size() {
    return this.#count;
  }

  toArray() {
    const out = [];
    for (let i = 0; i < this.#count; i++) {
      out.push(this.#items[(this.#front + i) % this.capacity]);
    }
    return out;
  }
}

// ---------- 3. Deque (double-ended queue) ----------
// A doubly linked list gives O(1) push/pop at BOTH ends.
class Deque {
  #head = null;
  #tail = null;
  #size = 0;

  pushBack(value) {
    const node = { value, prev: this.#tail, next: null };
    if (this.#tail) this.#tail.next = node;
    else this.#head = node;
    this.#tail = node;
    this.#size++;
    return this;
  }

  pushFront(value) {
    const node = { value, prev: null, next: this.#head };
    if (this.#head) this.#head.prev = node;
    else this.#tail = node;
    this.#head = node;
    this.#size++;
    return this;
  }

  popBack() {
    if (!this.#tail) return undefined;
    const { value } = this.#tail;
    this.#tail = this.#tail.prev;
    if (this.#tail) this.#tail.next = null;
    else this.#head = null;
    this.#size--;
    return value;
  }

  popFront() {
    if (!this.#head) return undefined;
    const { value } = this.#head;
    this.#head = this.#head.next;
    if (this.#head) this.#head.prev = null;
    else this.#tail = null;
    this.#size--;
    return value;
  }

  peekFront() {
    return this.#head ? this.#head.value : undefined;
  }

  peekBack() {
    return this.#tail ? this.#tail.value : undefined;
  }

  isEmpty() {
    return this.#size === 0;
  }

  size() {
    return this.#size;
  }

  toArray() {
    const out = [];
    for (let node = this.#head; node; node = node.next) out.push(node.value);
    return out;
  }
}

// ---------- 4. Monotonic deque (sliding window max / min) ----------
// Stores INDICES of an array so that the values are decreasing (for max) from
// front to back. The front is always the index of the current window's max.
//
//   push(i):  pop from the back every index whose value is <= nums[i]
//             (they can never be the max again while i is in the window),
//             then push i.
//   expire(leftIndex): drop the front if it has slid out of the window.
//   best(): nums[front]
//
// For a MIN deque pass compare = (a, b) => a >= b  ... see sliding-window problems.
class MonotonicDeque {
  constructor(nums, shouldPop = (back, incoming) => back <= incoming) {
    this.nums = nums;
    this.shouldPop = shouldPop; // "back is useless once incoming arrives"
    this.indices = [];          // plain array; shift() is O(n) but windows are small
    this.frontPointer = 0;      // we use a moving pointer instead of shift() to stay O(1)
  }

  push(index) {
    const { nums, indices } = this;
    while (indices.length > this.frontPointer && this.shouldPop(nums[indices[indices.length - 1]], nums[index])) {
      indices.pop();
    }
    indices.push(index);
  }

  // Remove the front index if it is < windowStart.
  expire(windowStart) {
    if (this.frontPointer < this.indices.length && this.indices[this.frontPointer] < windowStart) {
      this.frontPointer++;
    }
  }

  best() {
    return this.nums[this.indices[this.frontPointer]];
  }

  bestIndex() {
    return this.indices[this.frontPointer];
  }

  isEmpty() {
    return this.frontPointer >= this.indices.length;
  }
}

// ---------- self-test ----------
// Runs only when you execute `node queue.js` directly, not when a problem
// file requires this module.
if (require.main === module) {
const assert = require('assert');

const q = new Queue();
assert.strictEqual(q.isEmpty(), true);
assert.strictEqual(q.dequeue(), undefined);
q.enqueue(1).enqueue(2).enqueue(3);
assert.strictEqual(q.peek(), 1);
assert.strictEqual(q.dequeue(), 1);
assert.strictEqual(q.dequeue(), 2);
assert.deepStrictEqual(q.toArray(), [3]);
assert.strictEqual(q.dequeue(), 3);
assert.strictEqual(q.isEmpty(), true);
q.enqueue(4); // works again after emptying
assert.strictEqual(q.peek(), 4);

const cq = new CircularQueue(3);
assert.strictEqual(cq.enqueue(1), true);
assert.strictEqual(cq.enqueue(2), true);
assert.strictEqual(cq.enqueue(3), true);
assert.strictEqual(cq.enqueue(4), false); // full
assert.strictEqual(cq.isFull(), true);
assert.strictEqual(cq.dequeue(), 1);
assert.strictEqual(cq.enqueue(4), true);  // wraps around to index 0
assert.deepStrictEqual(cq.toArray(), [2, 3, 4]);
assert.strictEqual(cq.peek(), 2);
assert.strictEqual(cq.peekBack(), 4);
assert.strictEqual(cq.dequeue(), 2);
assert.strictEqual(cq.dequeue(), 3);
assert.strictEqual(cq.dequeue(), 4);
assert.strictEqual(cq.dequeue(), undefined);
assert.strictEqual(cq.isEmpty(), true);

const dq = new Deque();
dq.pushBack(2).pushBack(3).pushFront(1);
assert.deepStrictEqual(dq.toArray(), [1, 2, 3]);
assert.strictEqual(dq.peekFront(), 1);
assert.strictEqual(dq.peekBack(), 3);
assert.strictEqual(dq.popFront(), 1);
assert.strictEqual(dq.popBack(), 3);
assert.strictEqual(dq.popBack(), 2);
assert.strictEqual(dq.popBack(), undefined);
assert.strictEqual(dq.isEmpty(), true);
dq.pushFront(9);
assert.strictEqual(dq.size(), 1);
assert.strictEqual(dq.popBack(), 9);

// sliding window max of [1,3,-1,-3,5,3,6,7], k=3 -> [3,3,5,5,6,7]
const nums = [1, 3, -1, -3, 5, 3, 6, 7];
const k = 3;
const md = new MonotonicDeque(nums);
const maxes = [];
for (let i = 0; i < nums.length; i++) {
  md.push(i);
  md.expire(i - k + 1);
  if (i >= k - 1) maxes.push(md.best());
}
assert.deepStrictEqual(maxes, [3, 3, 5, 5, 6, 7]);

console.log('✓ queue.js self-test passed');
}

module.exports = { Queue, CircularQueue, Deque, MonotonicDeque };

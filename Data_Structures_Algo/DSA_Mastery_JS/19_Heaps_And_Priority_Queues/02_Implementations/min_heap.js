/**
 * Binary heap / priority queue in JavaScript.
 *
 * JavaScript has NO built-in priority queue, so in interviews you write one.
 * This file has ONE class, MinHeap, that takes a comparator:
 *
 *   new MinHeap()                      -> min-heap of numbers
 *   new MinHeap((a, b) => b - a)       -> max-heap of numbers
 *   new MinHeap((a, b) => a.dist - b.dist) -> priority queue of objects
 *
 * The comparator works like Array.prototype.sort: negative means "a comes
 * before b" (a has higher priority). Whatever "comes first" sits at the top.
 *
 * Storage: a plain array that represents a COMPLETE binary tree.
 *   parent(i)     = (i - 1) >> 1       (>> 1 is integer divide by 2)
 *   leftChild(i)  = 2 * i + 1
 *   rightChild(i) = 2 * i + 2
 *
 * Operations:
 *   push    O(log n)   append, then sift UP
 *   pop     O(log n)   swap top with last, remove last, sift DOWN
 *   peek    O(1)
 *   from    O(n)       heapify an array (sift down from the last parent)
 */

class MinHeap {
  #data = [];
  #compare;

  constructor(compareFn = (a, b) => a - b) {
    this.#compare = compareFn;
  }

  /** Build a heap from an array in O(n). */
  static from(array, compareFn) {
    const heap = new MinHeap(compareFn);
    heap.#data = [...array];
    // Leaves are already valid 1-node heaps. Start at the last parent and
    // sift each node down. Most nodes are near the bottom and move little,
    // so the total work sums to O(n), not O(n log n).
    for (let i = (heap.#data.length - 2) >> 1; i >= 0; i--) {
      heap.#siftDown(i);
    }
    return heap;
  }

  size() {
    return this.#data.length;
  }

  isEmpty() {
    return this.#data.length === 0;
  }

  peek() {
    return this.#data[0]; // undefined when empty
  }

  push(value) {
    this.#data.push(value); // put it in the only spot that keeps the tree complete
    this.#siftUp(this.#data.length - 1);
    return this;
  }

  pop() {
    if (this.#data.length === 0) return undefined;
    const top = this.#data[0];
    const last = this.#data.pop(); // shrink the tree from the end
    if (this.#data.length > 0) {
      this.#data[0] = last; // move the last leaf to the root ...
      this.#siftDown(0); // ... and let it sink to its correct place
    }
    return top;
  }

  /** Copy of the internal array (heap order, NOT sorted). */
  toArray() {
    return [...this.#data];
  }

  // ---- private helpers ----

  #siftUp(index) {
    const data = this.#data;
    while (index > 0) {
      const parent = (index - 1) >> 1;
      // stop as soon as the parent is "smaller or equal" (higher/equal priority)
      if (this.#compare(data[index], data[parent]) >= 0) break;
      [data[index], data[parent]] = [data[parent], data[index]];
      index = parent;
    }
  }

  #siftDown(index) {
    const data = this.#data;
    const length = data.length;
    while (true) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let smallest = index;
      if (left < length && this.#compare(data[left], data[smallest]) < 0) smallest = left;
      if (right < length && this.#compare(data[right], data[smallest]) < 0) smallest = right;
      if (smallest === index) break; // both children are bigger: heap property holds
      [data[index], data[smallest]] = [data[smallest], data[index]];
      index = smallest;
    }
  }
}

// ---------- self-test ----------
// Runs only with `node min-heap.js`, not when a problem file requires this module.
if (require.main === module) {
const assert = require('assert');

// 1. basic min-heap behaviour
const heap = new MinHeap();
assert.strictEqual(heap.isEmpty(), true);
assert.strictEqual(heap.pop(), undefined);
heap.push(5).push(3).push(8).push(1).push(3);
assert.strictEqual(heap.size(), 5);
assert.strictEqual(heap.peek(), 1);
assert.deepStrictEqual([heap.pop(), heap.pop(), heap.pop(), heap.pop(), heap.pop()], [1, 3, 3, 5, 8]);
assert.strictEqual(heap.isEmpty(), true);

// 2. max-heap via comparator
const maxHeap = new MinHeap((a, b) => b - a);
[4, 9, 2, 7].forEach((x) => maxHeap.push(x));
assert.strictEqual(maxHeap.pop(), 9);
assert.strictEqual(maxHeap.pop(), 7);

// 3. priority queue of objects
const pq = new MinHeap((a, b) => a.priority - b.priority);
pq.push({ task: 'low', priority: 5 }).push({ task: 'high', priority: 1 }).push({ task: 'mid', priority: 3 });
assert.strictEqual(pq.pop().task, 'high');
assert.strictEqual(pq.peek().task, 'mid');

// 4. heapify in O(n) and the heap property on every index
const built = MinHeap.from([9, 4, 7, 1, 8, 2, 6, 3, 5, 0]);
const arr = built.toArray();
for (let i = 1; i < arr.length; i++) {
  assert.ok(arr[(i - 1) >> 1] <= arr[i], 'parent must be <= child');
}
assert.strictEqual(built.pop(), 0);

// 5. thorough random test against sorting
function randomInts(count, max) {
  return Array.from({ length: count }, () => Math.floor(Math.random() * max));
}
for (let round = 0; round < 50; round++) {
  const nums = randomInts(1 + Math.floor(Math.random() * 60), 100);
  const expected = [...nums].sort((a, b) => a - b);

  const viaPush = new MinHeap();
  nums.forEach((x) => viaPush.push(x));
  const viaFrom = MinHeap.from(nums);

  const drainedPush = [];
  while (!viaPush.isEmpty()) drainedPush.push(viaPush.pop());
  const drainedFrom = [];
  while (!viaFrom.isEmpty()) drainedFrom.push(viaFrom.pop());

  assert.deepStrictEqual(drainedPush, expected);
  assert.deepStrictEqual(drainedFrom, expected);
}

// 6. interleaved push/pop keeps the invariant
const mixed = new MinHeap();
const mirror = [];
for (let step = 0; step < 500; step++) {
  if (mirror.length === 0 || Math.random() < 0.6) {
    const x = Math.floor(Math.random() * 1000);
    mixed.push(x);
    mirror.push(x);
  } else {
    mirror.sort((a, b) => a - b);
    assert.strictEqual(mixed.pop(), mirror.shift());
  }
}

console.log('✓ min-heap.js self-test passed');
}

module.exports = { MinHeap };

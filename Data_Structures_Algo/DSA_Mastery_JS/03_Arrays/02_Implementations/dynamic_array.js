/**
 * DynamicArray - a hand-built growable array on top of a fixed-capacity store.
 *
 * JavaScript's Array already does this for you. We build it anyway to SEE why
 * push is "amortized O(1)" and why insertAt / removeAt / shift are O(n).
 *
 * The backing store is `new Array(capacity)`: a fixed block of slots.
 * `#size` counts how many slots are actually used (the array's "length").
 *
 * Amortized O(1) push:
 *   When the store is full we allocate a block twice as big and copy everything.
 *   To grow from capacity 1 to n we copied 1 + 2 + 4 + ... + n/2 items in total,
 *   and that sum is < n. So n pushes cost n (writes) + n (copies) < 2n total work,
 *   which is O(1) per push ON AVERAGE, even though one single push can cost O(n).
 *   Doubling (not adding a fixed amount) is what makes the sum geometric.
 */

class DynamicArray {
  #items;        // backing store: fixed-size block
  #size = 0;     // how many slots are in use
  #capacity;

  constructor(capacity = 4) {
    if (capacity < 1) throw new Error('capacity must be >= 1');
    this.#capacity = capacity;
    this.#items = new Array(capacity);
  }

  get length() {
    return this.#size;
  }

  get capacity() {
    return this.#capacity; // exposed so the self-test can watch the doubling
  }

  // O(1) amortized
  push(value) {
    if (this.#size === this.#capacity) this.#resize(this.#capacity * 2); // the rare O(n) step
    this.#items[this.#size] = value;
    this.#size++;
    return this.#size;
  }

  // O(1)
  pop() {
    if (this.#size === 0) return undefined;
    this.#size--;
    const value = this.#items[this.#size];
    this.#items[this.#size] = undefined; // let the value be garbage collected
    return value;
  }

  // O(1) - direct index math, the whole point of arrays
  get(index) {
    this.#checkIndex(index);
    return this.#items[index];
  }

  // O(1)
  set(index, value) {
    this.#checkIndex(index);
    this.#items[index] = value;
  }

  // O(n) - every element from `index` onward moves one slot right
  insertAt(index, value) {
    if (index < 0 || index > this.#size) throw new RangeError(`index ${index} out of bounds`);
    if (this.#size === this.#capacity) this.#resize(this.#capacity * 2);
    for (let i = this.#size; i > index; i--) {
      this.#items[i] = this.#items[i - 1]; // shift right, starting from the end
    }
    this.#items[index] = value;
    this.#size++;
  }

  // O(n) - every element after `index` moves one slot left (this is what shift() does with index 0)
  removeAt(index) {
    this.#checkIndex(index);
    const removed = this.#items[index];
    for (let i = index; i < this.#size - 1; i++) {
      this.#items[i] = this.#items[i + 1]; // shift left
    }
    this.#size--;
    this.#items[this.#size] = undefined;
    return removed;
  }

  // O(n)
  toArray() {
    const result = [];
    for (let i = 0; i < this.#size; i++) result.push(this.#items[i]);
    return result;
  }

  // O(n) - allocate bigger block, copy used slots over
  #resize(newCapacity) {
    const bigger = new Array(newCapacity);
    for (let i = 0; i < this.#size; i++) bigger[i] = this.#items[i];
    this.#items = bigger;
    this.#capacity = newCapacity;
  }

  #checkIndex(index) {
    if (index < 0 || index >= this.#size) throw new RangeError(`index ${index} out of bounds`);
  }
}

// ---------- self-test ----------
const assert = require('assert');

const arr = new DynamicArray(2);
assert.strictEqual(arr.length, 0);
assert.strictEqual(arr.capacity, 2);

arr.push(10);
arr.push(20);
assert.strictEqual(arr.capacity, 2);   // exactly full, no resize yet
arr.push(30);                          // triggers resize 2 -> 4
assert.strictEqual(arr.capacity, 4);
arr.push(40);
arr.push(50);                          // triggers resize 4 -> 8
assert.strictEqual(arr.capacity, 8);
assert.strictEqual(arr.length, 5);
assert.deepStrictEqual(arr.toArray(), [10, 20, 30, 40, 50]);

assert.strictEqual(arr.get(0), 10);
assert.strictEqual(arr.get(4), 50);
arr.set(1, 21);
assert.strictEqual(arr.get(1), 21);
assert.throws(() => arr.get(5), RangeError);
assert.throws(() => arr.get(-1), RangeError);

assert.strictEqual(arr.pop(), 50);
assert.strictEqual(arr.length, 4);

arr.insertAt(0, 5);                    // insert at front: everything shifts right
assert.deepStrictEqual(arr.toArray(), [5, 10, 21, 30, 40]);
arr.insertAt(5, 99);                   // insert at end (index === size is allowed)
assert.deepStrictEqual(arr.toArray(), [5, 10, 21, 30, 40, 99]);
assert.throws(() => arr.insertAt(7, 1), RangeError);

assert.strictEqual(arr.removeAt(0), 5); // same cost as shift()
assert.deepStrictEqual(arr.toArray(), [10, 21, 30, 40, 99]);
assert.strictEqual(arr.removeAt(2), 30);
assert.deepStrictEqual(arr.toArray(), [10, 21, 40, 99]);

const empty = new DynamicArray();
assert.strictEqual(empty.pop(), undefined);
assert.deepStrictEqual(empty.toArray(), []);

// Count how many resizes happen for n pushes: only log2(n) of them, so copies total < 2n
const big = new DynamicArray(1);
let resizes = 0;
let lastCapacity = big.capacity;
for (let i = 0; i < 1000; i++) {
  big.push(i);
  if (big.capacity !== lastCapacity) { resizes++; lastCapacity = big.capacity; }
}
assert.strictEqual(resizes, 10);       // 1 -> 2 -> 4 -> ... -> 1024
assert.strictEqual(big.length, 1000);

console.log('✓ dynamic-array.js self-test passed');

module.exports = { DynamicArray };

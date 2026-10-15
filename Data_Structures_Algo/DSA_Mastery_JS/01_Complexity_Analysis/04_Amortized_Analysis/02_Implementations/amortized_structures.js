/**
 * Data structures whose operations are cheap on average over ANY sequence (amortized),
 * instrumented with counters so the bounds can be asserted.
 *
 * 1. DynamicArray       - push/pop with configurable growth (x2, x1.5, +k) and shrink rule; counts element copies
 * 2. TwoStackQueue      - FIFO queue from two LIFO stacks; counts element moves
 * 3. ResizingHashTable  - separate chaining, doubles at load factor 0.75; counts rehashed entries
 */

// ---------- 1. Dynamic array ----------
class DynamicArray {
  /**
   * @param {object} opts
   *   grow:   'double' | 'factor' | 'add'
   *   factor: growth factor when grow = 'factor' (e.g. 1.5)
   *   add:    slots added when grow = 'add'
   *   shrinkAt: shrink to half when size <= capacity * shrinkAt (0 disables shrinking)
   */
  constructor({ grow = 'double', factor = 2, add = 8, shrinkAt = 0.25 } = {}) {
    this.grow = grow; this.factor = factor; this.add = add; this.shrinkAt = shrinkAt;
    this.capacity = 1;
    this.data = new Array(1);
    this.size = 0;
    this.copies = 0;   // elements copied during resizes (the "expensive" work)
    this.writes = 0;   // ordinary element writes
    this.resizes = 0;
  }

  #resize(newCap) {
    newCap = Math.max(1, newCap);
    const next = new Array(newCap);
    for (let i = 0; i < this.size; i++) next[i] = this.data[i]; // cost = size
    this.copies += this.size;
    this.resizes++;
    this.data = next;
    this.capacity = newCap;
  }

  #nextCapacity() {
    if (this.grow === 'add') return this.capacity + this.add;
    if (this.grow === 'factor') return Math.max(this.capacity + 1, Math.floor(this.capacity * this.factor));
    return this.capacity * 2;
  }

  push(x) {
    if (this.size === this.capacity) this.#resize(this.#nextCapacity());
    this.data[this.size++] = x;
    this.writes++;
    return this.size;
  }

  pop() {
    if (this.size === 0) throw new RangeError('pop from empty array');
    const x = this.data[--this.size];
    this.data[this.size] = undefined;
    // WHY 1/4 and not 1/2: after shrinking to half, the array is half full, so it takes
    // Θ(capacity) more operations before the next resize in EITHER direction.
    if (this.shrinkAt > 0 && this.capacity > 1 && this.size <= this.capacity * this.shrinkAt) {
      this.#resize(Math.floor(this.capacity / 2));
    }
    return x;
  }

  get(i) {
    if (i < 0 || i >= this.size) throw new RangeError('index out of range');
    return this.data[i];
  }

  toArray() { return this.data.slice(0, this.size); }
}

// ---------- 2. Two-stack queue ----------
class TwoStackQueue {
  constructor() { this.in = []; this.out = []; this.moves = 0; this.ops = 0; }

  enqueue(x) { this.ops++; this.in.push(x); }

  #refill() {
    // Only when out is EMPTY. Each element makes this trip at most once in its life.
    if (this.out.length === 0) {
      while (this.in.length) { this.out.push(this.in.pop()); this.moves++; }
    }
  }

  dequeue() {
    this.ops++;
    this.#refill();
    if (this.out.length === 0) throw new RangeError('dequeue from empty queue');
    return this.out.pop();
  }

  peek() {
    this.#refill();
    return this.out[this.out.length - 1];
  }

  get size() { return this.in.length + this.out.length; }
}

// ---------- 3. Resizing hash table ----------
class ResizingHashTable {
  constructor(initialBuckets = 4, maxLoad = 0.75) {
    this.buckets = Array.from({ length: initialBuckets }, () => []);
    this.size = 0;
    this.maxLoad = maxLoad;
    this.rehashed = 0;  // entries moved during resizes
    this.resizes = 0;
  }

  static hash(key) {
    const s = String(key);
    let h = 2166136261; // FNV-1a
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  #bucket(key, buckets = this.buckets) { return buckets[ResizingHashTable.hash(key) % buckets.length]; }

  #grow() {
    const next = Array.from({ length: this.buckets.length * 2 }, () => []);
    for (const b of this.buckets) for (const entry of b) { this.#bucket(entry[0], next).push(entry); this.rehashed++; }
    this.buckets = next;
    this.resizes++;
  }

  set(key, value) {
    const b = this.#bucket(key);
    for (const entry of b) if (entry[0] === key) { entry[1] = value; return this; }
    b.push([key, value]);
    this.size++;
    if (this.size / this.buckets.length > this.maxLoad) this.#grow();
    return this;
  }

  get(key) {
    for (const [k, v] of this.#bucket(key)) if (k === key) return v;
    return undefined;
  }

  has(key) { return this.#bucket(key).some(e => e[0] === key); }

  delete(key) {
    const b = this.#bucket(key);
    const i = b.findIndex(e => e[0] === key);
    if (i < 0) return false;
    b.splice(i, 1);
    this.size--;
    return true;
  }
}

function mulberry32(a) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// ---------- self-test ----------
if (require.main === module) {
  const assert = require('assert');
  const rand = mulberry32(501);

  // doubling: n pushes cost < 3n total work
  for (const n of [1, 2, 3, 10, 1000, 100000]) {
    const a = new DynamicArray({ shrinkAt: 0 });
    for (let i = 0; i < n; i++) a.push(i);
    assert.ok(a.copies < 2 * n, `copies ${a.copies} for n=${n}`);
    assert.ok(a.copies + a.writes < 3 * n);
    assert.deepStrictEqual(a.toArray().slice(-3), Array.from({ length: Math.min(3, n) }, (_, k) => n - Math.min(3, n) + k));
  }
  // +k growth: quadratic copies
  const slow = new DynamicArray({ grow: 'add', add: 10, shrinkAt: 0 });
  for (let i = 0; i < 10000; i++) slow.push(i);
  assert.ok(slow.copies > 4_000_000, 'additive growth copies ~ n^2 / (2k)');

  // random push/pop mix with shrink at 1/4: total copies <= 3 * ops, and behaves like an array
  for (let t = 0; t < 50; t++) {
    const a = new DynamicArray();
    const ref = [];
    let ops = 0;
    for (let k = 0; k < 2000; k++) {
      ops++;
      if (ref.length && rand() < 0.45) assert.strictEqual(a.pop(), ref.pop());
      else { const x = Math.floor(rand() * 100); a.push(x); ref.push(x); }
    }
    assert.deepStrictEqual(a.toArray(), ref);
    assert.ok(a.copies <= 3 * ops, `copies ${a.copies} ops ${ops}`);
  }
  assert.throws(() => new DynamicArray().pop(), RangeError);

  // two-stack queue: matches a reference queue, moves <= enqueues
  for (let t = 0; t < 50; t++) {
    const q = new TwoStackQueue();
    const ref = [];
    let enq = 0;
    for (let k = 0; k < 1000; k++) {
      if (ref.length && rand() < 0.5) assert.strictEqual(q.dequeue(), ref.shift());
      else { q.enqueue(k); ref.push(k); enq++; }
    }
    assert.ok(q.moves <= enq);
    assert.ok(q.moves * 2 + q.ops <= 3 * q.ops, 'accounting: real cost <= 3 per op');
  }
  assert.throws(() => new TwoStackQueue().dequeue(), RangeError);

  // hash table: correct, and total rehash work < 2n
  const h = new ResizingHashTable();
  const m = new Map();
  for (let k = 0; k < 20000; k++) {
    const key = 'k' + Math.floor(rand() * 15000);
    if (rand() < 0.1) { assert.strictEqual(h.delete(key), m.delete(key)); continue; }
    h.set(key, k); m.set(key, k);
  }
  for (const [k, v] of m) assert.strictEqual(h.get(k), v);
  assert.strictEqual(h.size, m.size);
  assert.ok(h.rehashed < 2 * 20000, `rehashed ${h.rehashed}`);

  console.log('✓ amortized_structures.js self-test passed');
}

module.exports = { DynamicArray, TwoStackQueue, ResizingHashTable, mulberry32 };

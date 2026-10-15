/**
 * Hash table implementations in JavaScript (from scratch).
 *
 * 1. hashString(key, size)  - a simple polynomial string hash (djb2-style)
 * 2. HashTable              - separate chaining, resizes at load factor 0.75
 *                             get / set / has / delete / keys / values / entries / size
 * 3. HashSet                - a set built ON TOP of HashTable (value -> true)
 *
 * In real code you use the built-in Map / Set. You write this in interviews
 * to show you understand what happens behind `map.get(key)`.
 *
 * Average time per operation: O(1). Worst case (all keys collide): O(n).
 */

// ---------- 1. Hash function ----------
// Turn a string into a bucket index in [0, size).
// Multiply-and-add (polynomial rolling hash): "abc" -> ((a*31 + b)*31 + c) % size.
// The `| 0` keeps the number inside 32-bit integer range so it never becomes Infinity.
function hashString(key, size) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % size;
}

// ---------- 2. HashTable with separate chaining ----------
// Each bucket is an array of [key, value] pairs (the "chain").
// Keys are converted to strings before hashing, so 1 and "1" collide on purpose
// (just like a plain object). Use the built-in Map when you need true identity keys.
class HashTable {
  static LOAD_FACTOR = 0.75;

  #buckets;
  #count = 0;

  constructor(capacity = 8) {
    this.#buckets = new Array(capacity).fill(null).map(() => []);
  }

  #index(key) {
    return hashString(String(key), this.#buckets.length);
  }

  set(key, value) {
    const bucket = this.#buckets[this.#index(key)];
    // Update in place if the key already exists in this chain.
    for (const pair of bucket) {
      if (pair[0] === key) {
        pair[1] = value;
        return this;
      }
    }
    bucket.push([key, value]);
    this.#count++;
    // Too many items per bucket makes chains long -> grow before that happens.
    if (this.#count / this.#buckets.length > HashTable.LOAD_FACTOR) this.#resize();
    return this;
  }

  get(key) {
    const bucket = this.#buckets[this.#index(key)];
    for (const [storedKey, value] of bucket) {
      if (storedKey === key) return value;
    }
    return undefined;
  }

  has(key) {
    const bucket = this.#buckets[this.#index(key)];
    return bucket.some(([storedKey]) => storedKey === key);
  }

  delete(key) {
    const bucket = this.#buckets[this.#index(key)];
    const position = bucket.findIndex(([storedKey]) => storedKey === key);
    if (position === -1) return false;
    bucket.splice(position, 1);
    this.#count--;
    return true;
  }

  keys() {
    const result = [];
    for (const bucket of this.#buckets) for (const [key] of bucket) result.push(key);
    return result;
  }

  values() {
    const result = [];
    for (const bucket of this.#buckets) for (const [, value] of bucket) result.push(value);
    return result;
  }

  entries() {
    const result = [];
    for (const bucket of this.#buckets) for (const pair of bucket) result.push([...pair]);
    return result;
  }

  get size() {
    return this.#count;
  }

  get capacity() {
    return this.#buckets.length;
  }

  // Double the bucket array and re-insert every pair (their index changes
  // because the modulus changed). This is O(n) but happens rarely, so the
  // amortized cost per insert stays O(1).
  #resize() {
    const oldBuckets = this.#buckets;
    this.#buckets = new Array(oldBuckets.length * 2).fill(null).map(() => []);
    this.#count = 0;
    for (const bucket of oldBuckets) {
      for (const [key, value] of bucket) this.set(key, value);
    }
  }
}

// ---------- 3. HashSet built on HashTable ----------
// A set is just a hash table where we only care about the keys.
class HashSet {
  #table = new HashTable();

  add(value) {
    this.#table.set(value, true);
    return this;
  }

  has(value) {
    return this.#table.has(value);
  }

  delete(value) {
    return this.#table.delete(value);
  }

  values() {
    return this.#table.keys();
  }

  get size() {
    return this.#table.size;
  }
}

// ---------- self-test ----------
const assert = require('assert');

// hash function: deterministic and inside range
assert.strictEqual(hashString('apple', 16), hashString('apple', 16));
for (const word of ['a', 'zebra', 'hello world', '']) {
  const index = hashString(word, 16);
  assert.ok(index >= 0 && index < 16);
}

const table = new HashTable(4);
assert.strictEqual(table.size, 0);
assert.strictEqual(table.get('missing'), undefined);
assert.strictEqual(table.has('missing'), false);

table.set('name', 'Ada').set('lang', 'JS');
assert.strictEqual(table.get('name'), 'Ada');
assert.strictEqual(table.has('lang'), true);
assert.strictEqual(table.size, 2);

table.set('name', 'Grace'); // update, not insert
assert.strictEqual(table.get('name'), 'Grace');
assert.strictEqual(table.size, 2);

// resize: capacity 4, load factor 0.75 -> the 4th insert triggers growth
table.set('a', 1).set('b', 2);
assert.strictEqual(table.size, 4);
assert.strictEqual(table.capacity, 8);
assert.strictEqual(table.get('a'), 1);
assert.strictEqual(table.get('lang'), 'JS'); // survived re-hashing

assert.strictEqual(table.delete('a'), true);
assert.strictEqual(table.delete('a'), false);
assert.strictEqual(table.has('a'), false);
assert.strictEqual(table.size, 3);
assert.deepStrictEqual(table.keys().sort(), ['b', 'lang', 'name']);
assert.deepStrictEqual(table.values().sort(), [2, 'Grace', 'JS'].sort());
assert.strictEqual(table.entries().length, 3);

// stress: many keys, all retrievable after several resizes
const big = new HashTable();
for (let i = 0; i < 1000; i++) big.set('key' + i, i);
assert.strictEqual(big.size, 1000);
for (let i = 0; i < 1000; i++) assert.strictEqual(big.get('key' + i), i);

const set = new HashSet();
set.add('x').add('y').add('x');
assert.strictEqual(set.size, 2);
assert.strictEqual(set.has('x'), true);
assert.strictEqual(set.has('z'), false);
set.delete('x');
assert.strictEqual(set.has('x'), false);
assert.deepStrictEqual(set.values(), ['y']);

console.log('✓ hash-table.js self-test passed');

module.exports = { hashString, HashTable, HashSet };

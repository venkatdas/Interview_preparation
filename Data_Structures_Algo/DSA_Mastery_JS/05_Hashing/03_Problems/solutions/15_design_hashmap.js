/**
 * 15. Design HashMap   (LeetCode 706 — Easy)
 *
 * PROBLEM
 * Design a HashMap without using any built-in hash table library.
 * Implement put(key, value), get(key) (-1 if missing) and remove(key).
 * Keys and values are non-negative integers.
 *
 * EXAMPLES
 * put(1, 1); put(2, 2); get(1) -> 1; get(3) -> -1; put(2, 1); get(2) -> 1;
 * remove(2); get(2) -> -1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Key range? (0 <= key <= 10^6 on LeetCode -> a direct array of size 10^6+1 works, but
 *   it's the "cheat" answer; the interviewer wants buckets + hash function)
 * - How many operations? (up to 10^4)
 * - Should it resize? (nice to have; we implement it)
 *
 * APPROACH 1 — Brute force (direct-address array)   O(1) time, O(maxKey) space
 * Allocate an array of size maxKey + 1 and index directly. Works only because keys are
 * small non-negative integers; wastes memory and can't handle strings or huge keys.
 *
 * APPROACH 2 — Optimal (buckets with separate chaining + resizing)   O(1) average, O(n) space
 *   - buckets: array of lists of [key, value]
 *   - hash(key) = key % buckets.length
 *   - put: find key in its bucket -> update, else push; count++, resize when load > 0.75
 *   - get: scan the bucket
 *   - remove: splice from the bucket
 *   - resize: double buckets, re-insert all pairs (indexes change with the modulus)
 *
 * Dry run with 4 buckets: put(1,1) -> bucket 1; put(5,5) -> 5 % 4 = 1 -> same bucket
 *   (collision, chain [[1,1],[5,5]]); get(5) -> bucket 1, scan, find 5 -> 5.
 *   put(2,2), put(3,3) -> count 4, load 4/4 = 1.0 > 0.75 -> resize to 8:
 *   1 -> bucket 1, 5 -> bucket 5 (no longer collide), 2 -> 2, 3 -> 3.
 *
 * EDGE CASES
 * - get on a missing key -> -1
 * - put on an existing key overwrites (count must NOT grow)
 * - remove on a missing key does nothing
 * - key 0
 * - many colliding keys (multiples of the bucket count)
 */

// Approach 1: direct addressing (only valid because keys are small non-negative ints)
class DirectAddressMap {
  #table = new Array(1_000_001).fill(-1);
  put(key, value) { this.#table[key] = value; }
  get(key) { return this.#table[key]; }
  remove(key) { this.#table[key] = -1; }
}

// Approach 2: real hash map with chaining
class MyHashMap {
  #buckets;
  #count = 0;
  static LOAD_FACTOR = 0.75;

  constructor(capacity = 16) {
    this.#buckets = Array.from({ length: capacity }, () => []);
  }

  #hash(key) {
    return key % this.#buckets.length;
  }

  put(key, value) {
    const bucket = this.#buckets[this.#hash(key)];
    for (const pair of bucket) {
      if (pair[0] === key) { pair[1] = value; return; } // overwrite
    }
    bucket.push([key, value]);
    this.#count++;
    if (this.#count / this.#buckets.length > MyHashMap.LOAD_FACTOR) this.#resize();
  }

  get(key) {
    const bucket = this.#buckets[this.#hash(key)];
    for (const [storedKey, value] of bucket) if (storedKey === key) return value;
    return -1;
  }

  remove(key) {
    const bucket = this.#buckets[this.#hash(key)];
    const position = bucket.findIndex(([storedKey]) => storedKey === key);
    if (position !== -1) {
      bucket.splice(position, 1);
      this.#count--;
    }
  }

  #resize() {
    const oldBuckets = this.#buckets;
    this.#buckets = Array.from({ length: oldBuckets.length * 2 }, () => []);
    this.#count = 0;
    for (const bucket of oldBuckets) for (const [key, value] of bucket) this.put(key, value);
  }

  get bucketCount() {
    return this.#buckets.length;
  }
}

// Keep the folder's naming convention: optimal = the chained map, bruteForce = direct array.
const optimal = MyHashMap;
const bruteForce = DirectAddressMap;

// ---------- tests ----------
const assert = require('assert');
for (const MapClass of [bruteForce, optimal]) {
  const map = new MapClass();
  map.put(1, 1);
  map.put(2, 2);
  assert.strictEqual(map.get(1), 1);
  assert.strictEqual(map.get(3), -1);
  map.put(2, 1); // overwrite
  assert.strictEqual(map.get(2), 1);
  map.remove(2);
  assert.strictEqual(map.get(2), -1);
  map.remove(999); // missing key: no error
  map.put(0, 42);
  assert.strictEqual(map.get(0), 42);
}

// collisions + resize
const small = new MyHashMap(4);
for (let key = 0; key < 40; key += 4) small.put(key, key * 10); // all collide in bucket 0 at first
assert.ok(small.bucketCount > 4, 'should have resized');
for (let key = 0; key < 40; key += 4) assert.strictEqual(small.get(key), key * 10);
small.put(4, 'updated');
assert.strictEqual(small.get(4), 'updated');
small.remove(8);
assert.strictEqual(small.get(8), -1);
assert.strictEqual(small.get(12), 120);

console.log('✓ 15-design-hashmap passed');

module.exports = { optimal, bruteForce, MyHashMap, DirectAddressMap };

/**
 * 01. LRU Cache   (LeetCode 146 — Medium)
 *
 * PROBLEM
 * Design a cache with a fixed capacity:
 *   - get(key): return the value, or -1 if absent. Counts as a "use".
 *   - put(key, value): insert or update. If inserting makes the cache exceed capacity,
 *     evict the LEAST RECENTLY USED key first.
 * Both must run in O(1) average time.
 *
 * EXAMPLES
 * LRUCache(2); put(1,1); put(2,2); get(1) -> 1; put(3,3) evicts 2; get(2) -> -1;
 * put(4,4) evicts 1; get(1) -> -1; get(3) -> 3; get(4) -> 4
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Does get count as a use? (yes) Does put on an existing key count as a use? (yes)
 * - Capacity >= 1? (yes for this problem; capacity 0 should still not crash)
 * - Keys: integers; values: integers (any hashable type works with a Map)
 *
 * APPROACH 1 — Brute force   O(n) per operation
 * Keep an array of entries ordered from least to most recently used. get = linear search,
 * move the entry to the end. put = linear search / update / push, shift() to evict.
 * Correct, but every operation scans the array.
 *
 * APPROACH 2 — Optimal (Doubly linked list + hash map)   O(1) per operation
 * We need two things in O(1): find a key (-> Map), and move an entry to the "most recent"
 * end or drop the "least recent" end (-> doubly linked list, because unlinking a node in
 * the middle is O(1) when you have pointers to both neighbours).
 *   Map: key -> node.  List: head <-> ... <-> tail, with dummy head/tail so there are no
 *   null checks. head.next is the LRU node, tail.prev is the MRU node.
 *   get: lookup node, unlink, re-link before tail.
 *   put: if present, update + move to tail; else if full, unlink head.next and delete its
 *        key from the Map; then create node, link before tail, add to Map.
 *
 * Dry run (capacity 2):
 *   put(1,1):  list H <-> 1 <-> T              map {1}
 *   put(2,2):  list H <-> 1 <-> 2 <-> T        map {1,2}
 *   get(1):    move 1 to tail: H <-> 2 <-> 1 <-> T   -> 1
 *   put(3,3):  full; LRU = head.next = 2, unlink, map.delete(2); add 3:
 *              H <-> 1 <-> 3 <-> T             map {1,3}
 *   get(2):    not in map -> -1
 *
 * A JS-only shortcut: a Map keeps insertion order, so delete+set moves a key to the end and
 * map.keys().next().value is the oldest. See LRUCacheMap in ../lru-cache.js. Mention it as a
 * trick, but be ready to write the linked list version.
 *
 * EDGE CASES
 * - put on an existing key must NOT evict anything and must refresh recency
 * - capacity 1 (every new key evicts the previous one)
 * - get on a missing key must not change the order
 */

class LRUCacheBrute {
  constructor(capacity) {
    this.capacity = capacity;
    this.items = []; // least recent first
  }
  get(key) {
    const i = this.items.findIndex((e) => e.key === key);
    if (i === -1) return -1;
    const [entry] = this.items.splice(i, 1);
    this.items.push(entry);
    return entry.value;
  }
  put(key, value) {
    const i = this.items.findIndex((e) => e.key === key);
    if (i !== -1) this.items.splice(i, 1);
    this.items.push({ key, value });
    if (this.items.length > this.capacity) this.items.shift();
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
    this.head = { key: null, value: null, prev: null, next: null }; // dummy
    this.tail = { key: null, value: null, prev: null, next: null }; // dummy
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  #unlink(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  #linkBeforeTail(node) {
    node.prev = this.tail.prev;
    node.next = this.tail;
    this.tail.prev.next = node;
    this.tail.prev = node;
  }

  get(key) {
    const node = this.map.get(key);
    if (!node) return -1;
    this.#unlink(node);
    this.#linkBeforeTail(node);   // now the most recently used
    return node.value;
  }

  put(key, value) {
    const node = this.map.get(key);
    if (node) {
      node.value = value;
      this.#unlink(node);
      this.#linkBeforeTail(node);
      return;
    }
    if (this.capacity === 0) return;
    if (this.map.size === this.capacity) {
      const lru = this.head.next;
      this.#unlink(lru);
      this.map.delete(lru.key);   // this is why nodes store their key
    }
    const fresh = { key, value, prev: null, next: null };
    this.#linkBeforeTail(fresh);
    this.map.set(key, fresh);
  }
}

// ---------- tests ----------
const assert = require('assert');
for (const Cls of [LRUCacheBrute, LRUCache]) {
  const cache = new Cls(2);
  cache.put(1, 1);
  cache.put(2, 2);
  assert.strictEqual(cache.get(1), 1);
  cache.put(3, 3);
  assert.strictEqual(cache.get(2), -1);
  cache.put(4, 4);
  assert.strictEqual(cache.get(1), -1);
  assert.strictEqual(cache.get(3), 3);
  assert.strictEqual(cache.get(4), 4);

  const one = new Cls(1);
  one.put(5, 50);
  one.put(5, 51);                          // update, no eviction
  assert.strictEqual(one.get(5), 51);
  one.put(6, 60);
  assert.strictEqual(one.get(5), -1);
  assert.strictEqual(one.get(99), -1);     // missing key does not break order
  assert.strictEqual(one.get(6), 60);
}
for (let trial = 0; trial < 20; trial++) {
  const capacity = 1 + Math.floor(Math.random() * 4);
  const a = new LRUCacheBrute(capacity);
  const b = new LRUCache(capacity);
  for (let op = 0; op < 200; op++) {
    const key = Math.floor(Math.random() * 7);
    if (Math.random() < 0.5) {
      const value = Math.floor(Math.random() * 50);
      a.put(key, value);
      b.put(key, value);
    } else {
      assert.strictEqual(b.get(key), a.get(key));
    }
  }
}
console.log('✓ 01-lru-cache passed');

module.exports = { LRUCache, LRUCacheBrute, optimal: LRUCache, bruteForce: LRUCacheBrute };

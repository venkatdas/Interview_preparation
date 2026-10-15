/**
 * 20. LRU Cache   (LeetCode 146 — Medium)
 *
 * PROBLEM
 * Design a cache with a fixed capacity that supports
 *   get(key)        -> value, or -1 if missing. Counts as a "use".
 *   put(key, value) -> insert or update. If the cache is full, evict the
 *                      LEAST RECENTLY USED key first.
 * Both operations must run in O(1) average time.
 *
 * EXAMPLES
 * LRUCache(2)
 * put(1,1) put(2,2) get(1)->1  put(3,3) [evicts 2]  get(2)->-1
 * put(4,4) [evicts 1]  get(1)->-1  get(3)->3  get(4)->4
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Does get() count as "using" the key? (yes)
 * - Does put() on an existing key count as using it? (yes, and it updates the value)
 * - Capacity >= 1? (yes)
 *
 * APPROACH 1 — Brute force (array of entries)   O(n) per operation
 * Keep an array ordered from least to most recently used. get: find the entry
 * (O(n)), move it to the end. put: same search, evict index 0 if full.
 * Correct but O(n) per operation - fails the requirement.
 *
 * APPROACH 2 — Optimal (Map + doubly linked list)   O(1) per operation, O(capacity) space
 * We need two things in O(1):
 *   - jump to a node by key            -> Map(key -> node)
 *   - move a node to "most recent" and remove the "least recent" -> doubly linked list
 * Layout:  head(dummy) <-> LRU ... MRU <-> tail(dummy)
 * get:  look up node, unlink it, re-insert right before tail (most recent).
 * put:  if key exists -> update value and move to MRU.
 *       else create node, add before tail, map it;
 *       if size > capacity -> remove head.next (the LRU node) and delete it from the map.
 * Dummy head/tail mean we never check for null when linking.
 *
 * Dry run, capacity 2:
 *   put(1,1)   list: 1
 *   put(2,2)   list: 1 2
 *   get(1)     list: 2 1         (1 moved to the MRU end)
 *   put(3,3)   full: evict head.next = 2.  list: 1 3
 *   get(2)     -1
 *
 * Note: JavaScript's Map keeps insertion order, so a Map alone (delete + re-set
 * to move to the end, and map.keys().next() for the oldest) is also O(1).
 * Show that as a bonus, but interviewers want to see the linked list.
 *
 * EDGE CASES
 * - capacity 1
 * - put on an existing key must NOT evict anything
 * - get on a missing key must not change the order
 */

// ---------- brute force ----------
class LRUCacheBrute {
  constructor(capacity) {
    this.capacity = capacity;
    this.entries = []; // [key, value], index 0 = least recently used
  }
  get(key) {
    const index = this.entries.findIndex(([k]) => k === key);
    if (index === -1) return -1;
    const [entry] = this.entries.splice(index, 1);
    this.entries.push(entry);
    return entry[1];
  }
  put(key, value) {
    const index = this.entries.findIndex(([k]) => k === key);
    if (index !== -1) this.entries.splice(index, 1);
    this.entries.push([key, value]);
    if (this.entries.length > this.capacity) this.entries.shift();
  }
}

// ---------- optimal ----------
class DNode {
  constructor(key, value) {
    this.key = key;   // needed so we can delete the key from the map when evicting
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
    // dummy ends: head.next is LRU, tail.prev is MRU
    this.head = new DNode(null, null);
    this.tail = new DNode(null, null);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  #unlink(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  #addBeforeTail(node) {
    node.prev = this.tail.prev;
    node.next = this.tail;
    this.tail.prev.next = node;
    this.tail.prev = node;
  }

  get(key) {
    const node = this.map.get(key);
    if (!node) return -1;
    this.#unlink(node);        // move to most-recent position
    this.#addBeforeTail(node);
    return node.value;
  }

  put(key, value) {
    const existing = this.map.get(key);
    if (existing) {
      existing.value = value;
      this.#unlink(existing);
      this.#addBeforeTail(existing);
      return;
    }
    const node = new DNode(key, value);
    this.map.set(key, node);
    this.#addBeforeTail(node);

    if (this.map.size > this.capacity) {
      const lru = this.head.next;
      this.#unlink(lru);
      this.map.delete(lru.key);
    }
  }
}

// ---------- bonus: Map-only version (uses insertion order) ----------
class LRUCacheMapOnly {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }
  get(key) {
    if (!this.map.has(key)) return -1;
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value); // re-insert = move to the end (most recent)
    return value;
  }
  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.capacity) {
      const oldestKey = this.map.keys().next().value;
      this.map.delete(oldestKey);
    }
  }
}

// ---------- tests ----------
const assert = require('assert');
for (const Cache of [LRUCacheBrute, LRUCache, LRUCacheMapOnly]) {
  const cache = new Cache(2);
  cache.put(1, 1);
  cache.put(2, 2);
  assert.strictEqual(cache.get(1), 1);
  cache.put(3, 3);                      // evicts 2
  assert.strictEqual(cache.get(2), -1);
  cache.put(4, 4);                      // evicts 1
  assert.strictEqual(cache.get(1), -1);
  assert.strictEqual(cache.get(3), 3);
  assert.strictEqual(cache.get(4), 4);

  // updating an existing key does not evict
  const c2 = new Cache(2);
  c2.put(1, 1);
  c2.put(2, 2);
  c2.put(1, 10);
  assert.strictEqual(c2.get(2), 2);
  assert.strictEqual(c2.get(1), 10);

  // capacity 1
  const c3 = new Cache(1);
  c3.put(5, 50);
  assert.strictEqual(c3.get(5), 50);
  c3.put(6, 60);
  assert.strictEqual(c3.get(5), -1);
  assert.strictEqual(c3.get(6), 60);

  // get on a missing key does not disturb order
  const c4 = new Cache(2);
  c4.put(1, 1);
  c4.put(2, 2);
  assert.strictEqual(c4.get(9), -1);
  c4.put(3, 3);                         // evicts 1, not 2
  assert.strictEqual(c4.get(1), -1);
  assert.strictEqual(c4.get(2), 2);
}
console.log('✓ 20-lru-cache passed');

module.exports = { LRUCache, LRUCacheBrute, LRUCacheMapOnly };

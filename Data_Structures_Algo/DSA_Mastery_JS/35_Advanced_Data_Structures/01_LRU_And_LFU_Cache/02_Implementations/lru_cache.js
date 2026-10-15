/**
 * LRU (Least Recently Used) cache implementations in JavaScript.
 *
 * 1. LRUCacheMap - uses the fact that a JS Map remembers INSERTION ORDER.
 *                  "Touch" a key = delete it and set it again (moves it to the end).
 *                  Evict = delete the first key (map.keys().next().value).
 *                  Shortest possible code; all operations O(1).
 * 2. LRUCache    - the interview standard: doubly linked list (most recent at the tail,
 *                  least recent at the head) + Map from key -> list node.
 *                  Works in any language, and shows you understand WHY it is O(1).
 *
 * Both: get(key) returns -1 when absent; put(key, value) inserts/updates and evicts
 * the least recently used entry when capacity is exceeded.
 */

// ---------- 1. Map insertion-order version ----------
class LRUCacheMap {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const value = this.map.get(key);
    this.map.delete(key);           // re-insert so the key becomes the newest
    this.map.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);          // refresh position
    this.map.set(key, value);
    if (this.map.size > this.capacity) {
      const oldestKey = this.map.keys().next().value;     // first inserted = least recent
      this.map.delete(oldestKey);
    }
  }
}

// ---------- 2. Doubly linked list + Map version ----------
class ListNode {
  constructor(key, value) {
    this.key = key;       // we store the key so eviction can remove it from the Map
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();                 // key -> node
    // Two dummy sentinels remove every "is this the first/last node?" special case.
    this.head = new ListNode(null, null); // head.next = least recently used
    this.tail = new ListNode(null, null); // tail.prev = most recently used
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  #remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  #addToTail(node) {
    node.prev = this.tail.prev;
    node.next = this.tail;
    this.tail.prev.next = node;
    this.tail.prev = node;
  }

  get(key) {
    const node = this.map.get(key);
    if (!node) return -1;
    this.#remove(node);          // move to tail = mark as most recently used
    this.#addToTail(node);
    return node.value;
  }

  put(key, value) {
    const existing = this.map.get(key);
    if (existing) {
      existing.value = value;
      this.#remove(existing);
      this.#addToTail(existing);
      return;
    }
    if (this.map.size === this.capacity) {
      const lru = this.head.next;    // least recently used lives right after head
      this.#remove(lru);
      this.map.delete(lru.key);
    }
    const node = new ListNode(key, value);
    this.#addToTail(node);
    this.map.set(key, node);
  }
}

// ---------- self-test ----------
const assert = require('assert');

// Naive reference: array of {key, value}, most recent at the end. O(n) per op.
class NaiveLRU {
  constructor(capacity) {
    this.capacity = capacity;
    this.items = [];
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

for (const Cls of [LRUCacheMap, LRUCache]) {
  const cache = new Cls(2);
  cache.put(1, 1);
  cache.put(2, 2);
  assert.strictEqual(cache.get(1), 1);
  cache.put(3, 3);                        // evicts key 2
  assert.strictEqual(cache.get(2), -1);
  cache.put(4, 4);                        // evicts key 1
  assert.strictEqual(cache.get(1), -1);
  assert.strictEqual(cache.get(3), 3);
  assert.strictEqual(cache.get(4), 4);
  cache.put(4, 40);                       // update existing, no eviction
  assert.strictEqual(cache.get(4), 40);
  assert.strictEqual(cache.get(3), 3);

  // random ops vs naive reference
  for (let trial = 0; trial < 20; trial++) {
    const capacity = 1 + Math.floor(Math.random() * 5);
    const fast = new Cls(capacity);
    const slow = new NaiveLRU(capacity);
    for (let op = 0; op < 300; op++) {
      const key = Math.floor(Math.random() * 8);
      if (Math.random() < 0.5) {
        const value = Math.floor(Math.random() * 100);
        fast.put(key, value);
        slow.put(key, value);
      } else {
        assert.strictEqual(fast.get(key), slow.get(key));
      }
    }
  }
}

console.log('✓ lru-cache.js self-test passed');

module.exports = { LRUCache, LRUCacheMap };

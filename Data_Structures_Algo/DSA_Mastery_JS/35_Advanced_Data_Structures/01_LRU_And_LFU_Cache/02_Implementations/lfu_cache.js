/**
 * LFU (Least Frequently Used) cache in JavaScript, all operations O(1).
 *
 * Idea: group keys into FREQUENCY BUCKETS.
 *   keyToNode : Map key  -> { key, value, freq }
 *   buckets   : Map freq -> Set of keys with that frequency (a JS Set keeps INSERTION
 *               order, so the first key in a bucket is the least recently used one
 *               among keys with that frequency - exactly the tie-break the problem wants)
 *   minFreq   : the smallest frequency currently present (the bucket we evict from)
 *
 * Why minFreq stays correct without searching:
 *   - inserting a brand-new key always gives it freq 1, so minFreq = 1
 *   - when we bump a key from f to f+1 and bucket f becomes empty, and f was minFreq,
 *     then minFreq becomes f+1 (no key can have a frequency between f and f+1)
 *   - eviction always removes from bucket minFreq, so minFreq never needs to go DOWN
 *     except by the "new key -> 1" rule
 *
 * In languages without ordered sets you use a doubly linked list per bucket; the JS Set
 * gives the same O(1) add / delete / "first element" operations.
 */

class LFUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.keyToNode = new Map();   // key -> { key, value, freq }
    this.buckets = new Map();     // freq -> Set<key> in LRU order (oldest first)
    this.minFreq = 0;
  }

  // move key from its current bucket to the next frequency bucket
  #touch(node) {
    const bucket = this.buckets.get(node.freq);
    bucket.delete(node.key);
    if (bucket.size === 0) {
      this.buckets.delete(node.freq);
      if (this.minFreq === node.freq) this.minFreq++;   // that bucket was the smallest
    }
    node.freq++;
    if (!this.buckets.has(node.freq)) this.buckets.set(node.freq, new Set());
    this.buckets.get(node.freq).add(node.key);          // added last = most recent
  }

  get(key) {
    const node = this.keyToNode.get(key);
    if (!node) return -1;
    this.#touch(node);
    return node.value;
  }

  put(key, value) {
    if (this.capacity === 0) return;
    const existing = this.keyToNode.get(key);
    if (existing) {
      existing.value = value;
      this.#touch(existing);
      return;
    }
    if (this.keyToNode.size === this.capacity) {
      // evict: least frequent bucket, its oldest key
      const bucket = this.buckets.get(this.minFreq);
      const victim = bucket.values().next().value;
      bucket.delete(victim);
      if (bucket.size === 0) this.buckets.delete(this.minFreq);
      this.keyToNode.delete(victim);
    }
    const node = { key, value, freq: 1 };
    this.keyToNode.set(key, node);
    if (!this.buckets.has(1)) this.buckets.set(1, new Set());
    this.buckets.get(1).add(key);
    this.minFreq = 1;                                  // a new key is always the least used
  }
}

// ---------- self-test ----------
const assert = require('assert');

// Naive reference: array of {key, value, freq, lastUsed}; evict by (freq, lastUsed). O(n).
class NaiveLFU {
  constructor(capacity) {
    this.capacity = capacity;
    this.items = [];
    this.clock = 0;
  }
  get(key) {
    const entry = this.items.find((e) => e.key === key);
    if (!entry) return -1;
    entry.freq++;
    entry.lastUsed = ++this.clock;
    return entry.value;
  }
  put(key, value) {
    if (this.capacity === 0) return;
    const entry = this.items.find((e) => e.key === key);
    if (entry) {
      entry.value = value;
      entry.freq++;
      entry.lastUsed = ++this.clock;
      return;
    }
    if (this.items.length === this.capacity) {
      let victim = 0;
      for (let i = 1; i < this.items.length; i++) {
        const a = this.items[i];
        const b = this.items[victim];
        if (a.freq < b.freq || (a.freq === b.freq && a.lastUsed < b.lastUsed)) victim = i;
      }
      this.items.splice(victim, 1);
    }
    this.items.push({ key, value, freq: 1, lastUsed: ++this.clock });
  }
}

const cache = new LFUCache(2);
cache.put(1, 1);
cache.put(2, 2);
assert.strictEqual(cache.get(1), 1);        // freq(1) = 2
cache.put(3, 3);                            // evicts 2 (freq 1)
assert.strictEqual(cache.get(2), -1);
assert.strictEqual(cache.get(3), 3);        // freq(3) = 2
cache.put(4, 4);                            // tie freq 2: 1 is older than 3 -> evict 1
assert.strictEqual(cache.get(1), -1);
assert.strictEqual(cache.get(3), 3);
assert.strictEqual(cache.get(4), 4);

const zero = new LFUCache(0);
zero.put(1, 1);
assert.strictEqual(zero.get(1), -1);

for (let trial = 0; trial < 30; trial++) {
  const capacity = Math.floor(Math.random() * 5);
  const fast = new LFUCache(capacity);
  const slow = new NaiveLFU(capacity);
  for (let op = 0; op < 300; op++) {
    const key = Math.floor(Math.random() * 7);
    if (Math.random() < 0.5) {
      const value = Math.floor(Math.random() * 100);
      fast.put(key, value);
      slow.put(key, value);
    } else {
      assert.strictEqual(fast.get(key), slow.get(key));
    }
  }
}

console.log('✓ lfu-cache.js self-test passed');

module.exports = { LFUCache };

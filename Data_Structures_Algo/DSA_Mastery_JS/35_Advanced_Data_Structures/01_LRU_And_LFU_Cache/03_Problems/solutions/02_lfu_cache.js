/**
 * 02. LFU Cache   (LeetCode 460 — Hard)
 *
 * PROBLEM
 * Design a cache with fixed capacity where eviction removes the LEAST FREQUENTLY USED
 * key; if several keys tie on frequency, evict the least RECENTLY used among them.
 *   - get(key): value or -1; increases the key's use counter
 *   - put(key, value): insert/update (also counts as a use); evict first if full
 * Both in O(1) average time.
 *
 * EXAMPLES
 * LFUCache(2); put(1,1); put(2,2); get(1) -> 1 (freq 1:2, 2:1); put(3,3) evicts 2;
 * get(2) -> -1; get(3) -> 3 (freq 3:2); put(4,4): 1 and 3 tie on freq 2, 1 is older -> evict 1;
 * get(1) -> -1; get(3) -> 3; get(4) -> 4
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Capacity can be 0 (then put does nothing)
 * - Updating an existing key's value counts as a use
 * - Do we evict on get? (never; only when inserting a NEW key into a full cache)
 *
 * APPROACH 1 — Brute force   O(n) per operation
 * Array of {key, value, freq, lastUsed}. get/put scan the array. Evict by scanning for the
 * minimum (freq, lastUsed) pair.
 *
 * APPROACH 2 — Optimal (Frequency buckets + minFreq)   O(1) per operation
 * keyToNode: Map key -> {key, value, freq}
 * buckets:   Map freq -> Set of keys (JS Set keeps insertion order => first = least recent)
 * minFreq:   smallest frequency present
 * touch(node): remove key from bucket[freq]; if that bucket is now empty and freq === minFreq,
 *   minFreq++; freq++; add key to bucket[freq] (at the end = most recent).
 * put new key when full: victim = first key of bucket[minFreq]; delete it; then insert the
 *   new key into bucket[1] and set minFreq = 1.
 *
 * Dry run (capacity 2):
 *   put(1,1): buckets {1: [1]}            minFreq 1
 *   put(2,2): buckets {1: [1, 2]}         minFreq 1
 *   get(1):   bucket1 = [2], bucket2 = [1]  (bucket 1 not empty -> minFreq stays 1)
 *   put(3,3): full; victim = first of bucket[1] = 2; evict; insert 3: {1: [3], 2: [1]}, minFreq 1
 *   get(3):   {2: [1, 3]} bucket 1 emptied and 1 === minFreq -> minFreq 2
 *   put(4,4): full; victim = first of bucket[2] = 1; {2: [3]} then {1: [4], 2: [3]} minFreq 1
 *
 * EDGE CASES
 * - capacity 0
 * - repeated puts on the same key (frequency keeps growing, nothing evicted)
 * - all keys have equal frequency -> behaves like LRU
 */

class LFUCacheBrute {
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

class LFUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.keyToNode = new Map();
    this.buckets = new Map();   // freq -> Set<key>, oldest first
    this.minFreq = 0;
  }

  #touch(node) {
    const bucket = this.buckets.get(node.freq);
    bucket.delete(node.key);
    if (bucket.size === 0) {
      this.buckets.delete(node.freq);
      if (this.minFreq === node.freq) this.minFreq++;
    }
    node.freq++;
    if (!this.buckets.has(node.freq)) this.buckets.set(node.freq, new Set());
    this.buckets.get(node.freq).add(node.key);
  }

  get(key) {
    const node = this.keyToNode.get(key);
    if (!node) return -1;
    this.#touch(node);
    return node.value;
  }

  put(key, value) {
    if (this.capacity === 0) return;
    const node = this.keyToNode.get(key);
    if (node) {
      node.value = value;
      this.#touch(node);
      return;
    }
    if (this.keyToNode.size === this.capacity) {
      const bucket = this.buckets.get(this.minFreq);
      const victim = bucket.values().next().value;   // oldest key at the lowest frequency
      bucket.delete(victim);
      if (bucket.size === 0) this.buckets.delete(this.minFreq);
      this.keyToNode.delete(victim);
    }
    this.keyToNode.set(key, { key, value, freq: 1 });
    if (!this.buckets.has(1)) this.buckets.set(1, new Set());
    this.buckets.get(1).add(key);
    this.minFreq = 1;
  }
}

// ---------- tests ----------
const assert = require('assert');
for (const Cls of [LFUCacheBrute, LFUCache]) {
  const cache = new Cls(2);
  cache.put(1, 1);
  cache.put(2, 2);
  assert.strictEqual(cache.get(1), 1);
  cache.put(3, 3);
  assert.strictEqual(cache.get(2), -1);
  assert.strictEqual(cache.get(3), 3);
  cache.put(4, 4);
  assert.strictEqual(cache.get(1), -1);
  assert.strictEqual(cache.get(3), 3);
  assert.strictEqual(cache.get(4), 4);

  const zero = new Cls(0);
  zero.put(1, 1);
  assert.strictEqual(zero.get(1), -1);

  const same = new Cls(1);
  same.put(1, 1);
  same.put(1, 2);
  same.put(1, 3);
  assert.strictEqual(same.get(1), 3);
}
for (let trial = 0; trial < 30; trial++) {
  const capacity = Math.floor(Math.random() * 4);
  const a = new LFUCacheBrute(capacity);
  const b = new LFUCache(capacity);
  for (let op = 0; op < 200; op++) {
    const key = Math.floor(Math.random() * 6);
    if (Math.random() < 0.5) {
      const value = Math.floor(Math.random() * 50);
      a.put(key, value);
      b.put(key, value);
    } else {
      assert.strictEqual(b.get(key), a.get(key));
    }
  }
}
console.log('✓ 02-lfu-cache passed');

module.exports = { LFUCache, LFUCacheBrute, optimal: LFUCache, bruteForce: LFUCacheBrute };

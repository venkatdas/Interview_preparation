// node --test 35_Advanced_Data_Structures/01_LRU_And_LFU_Cache/tests/lru_and_lfu_cache.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { LRUCache, LRUCacheMap } = require('../02_Implementations/lru_cache');
const { LFUCache } = require('../02_Implementations/lfu_cache');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(3501);
const rint = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));

// Naive reference LRU: array ordered from least to most recently used. O(n) per op.
class ArrayLRU {
  constructor(cap) { this.cap = cap; this.items = []; }
  get(key) {
    const i = this.items.findIndex((e) => e.key === key);
    if (i === -1) return -1;
    const [e] = this.items.splice(i, 1);
    this.items.push(e);
    return e.value;
  }
  put(key, value) {
    const i = this.items.findIndex((e) => e.key === key);
    if (i !== -1) this.items.splice(i, 1);
    this.items.push({ key, value });
    if (this.items.length > this.cap) this.items.shift();
  }
}

// Naive reference LFU: array of entries; evict smallest (freq, lastUsed). O(n) per op.
class ArrayLFU {
  constructor(cap) { this.cap = cap; this.items = []; this.clock = 0; }
  get(key) {
    const e = this.items.find((x) => x.key === key);
    if (!e) return -1;
    e.freq++; e.last = ++this.clock;
    return e.value;
  }
  put(key, value) {
    if (this.cap === 0) return;
    const e = this.items.find((x) => x.key === key);
    if (e) { e.value = value; e.freq++; e.last = ++this.clock; return; }
    if (this.items.length === this.cap) {
      let victim = 0;
      for (let i = 1; i < this.items.length; i++) {
        const a = this.items[i], b = this.items[victim];
        if (a.freq < b.freq || (a.freq === b.freq && a.last < b.last)) victim = i;
      }
      this.items.splice(victim, 1);
    }
    this.items.push({ key, value, freq: 1, last: ++this.clock });
  }
}

function compareRandom(make, makeRef, { trials = 150, ops = 200, minCap = 1 } = {}) {
  for (let t = 0; t < trials; t++) {
    const cap = rint(minCap, 5), keys = rint(1, 10);
    const a = make(cap), b = makeRef(cap);
    for (let q = 0; q < ops; q++) {
      const key = rint(0, keys);
      if (rand() < 0.5) assert.equal(a.get(key), b.get(key), `trial ${t} op ${q} get(${key}) cap ${cap}`);
      else { const v = rint(0, 100); a.put(key, v); b.put(key, v); }
    }
  }
}

for (const Impl of [LRUCache, LRUCacheMap]) {
  describe(Impl.name, () => {
    it('LeetCode example', () => {
      const c = new Impl(2);
      c.put(1, 1); c.put(2, 2);
      assert.equal(c.get(1), 1);
      c.put(3, 3);                 // evicts 2
      assert.equal(c.get(2), -1);
      c.put(4, 4);                 // evicts 1
      assert.equal(c.get(1), -1);
      assert.equal(c.get(3), 3);
      assert.equal(c.get(4), 4);
    });
    it('capacity 1 and updating an existing key refreshes recency', () => {
      const c = new Impl(1);
      c.put(1, 1); c.put(2, 2);
      assert.equal(c.get(1), -1);
      assert.equal(c.get(2), 2);
      const d = new Impl(2);
      d.put(1, 1); d.put(2, 2); d.put(1, 10); d.put(3, 3);   // 2 is LRU now
      assert.equal(d.get(2), -1);
      assert.equal(d.get(1), 10);
    });
    it('matches a naive array-based LRU on random operation sequences', () => {
      compareRandom((c) => new Impl(c), (c) => new ArrayLRU(c));
    });
  });
}

describe('LFUCache', () => {
  it('LeetCode example (ties broken by least recently used)', () => {
    const c = new LFUCache(2);
    c.put(1, 1); c.put(2, 2);
    assert.equal(c.get(1), 1);   // freq(1) = 2
    c.put(3, 3);                 // evicts 2 (freq 1)
    assert.equal(c.get(2), -1);
    assert.equal(c.get(3), 3);   // freq(3) = 2, tie with 1; 1 is older
    c.put(4, 4);                 // evicts 1
    assert.equal(c.get(1), -1);
    assert.equal(c.get(3), 3);
    assert.equal(c.get(4), 4);
  });
  it('capacity 0 stores nothing; capacity 1 always evicts the single key', () => {
    const z = new LFUCache(0);
    z.put(1, 1);
    assert.equal(z.get(1), -1);
    const one = new LFUCache(1);
    one.put(1, 1); one.get(1); one.get(1); one.put(2, 2);
    assert.equal(one.get(1), -1);
    assert.equal(one.get(2), 2);
  });
  it('tie-breaking by recency among equal frequencies', () => {
    const c = new LFUCache(3);
    c.put(1, 1); c.put(2, 2); c.put(3, 3);   // all freq 1, order 1,2,3
    c.get(1);                                 // 1 -> freq 2
    c.put(4, 4);                              // evict 2 (oldest of freq 1)
    assert.equal(c.get(2), -1);
    assert.equal(c.get(3), 3);
  });
  it('matches a naive array-based LFU on random operation sequences', () => {
    compareRandom((c) => new LFUCache(c), (c) => new ArrayLFU(c), { minCap: 0 });
  });
});

describe('solution files: optimal vs bruteForce', () => {
  const p01 = require('../03_Problems/solutions/01_lru_cache');
  const p02 = require('../03_Problems/solutions/02_lfu_cache');
  const p03 = require('../03_Problems/solutions/03_design_browser_history');
  const p04 = require('../03_Problems/solutions/04_time_based_key_value_store');
  it('LRU / LFU solutions match the naive references', () => {
    compareRandom((c) => new p01.optimal(c), (c) => new ArrayLRU(c), { trials: 80 });
    compareRandom((c) => new p01.bruteForce(c), (c) => new ArrayLRU(c), { trials: 40 });
    compareRandom((c) => new p02.optimal(c), (c) => new ArrayLFU(c), { trials: 80 });
    compareRandom((c) => new p02.bruteForce(c), (c) => new ArrayLFU(c), { trials: 40 });
  });
  it('browser history: random visit/back/forward sequences agree', () => {
    for (let t = 0; t < 100; t++) {
      const a = new p03.optimal('home'), b = new p03.bruteForce('home');
      for (let q = 0; q < 50; q++) {
        const r = rand();
        if (r < 0.4) { const u = 'u' + rint(0, 20); a.visit(u); b.visit(u); }
        else if (r < 0.7) { const s = rint(1, 5); assert.equal(a.back(s), b.back(s)); }
        else { const s = rint(1, 5); assert.equal(a.forward(s), b.forward(s)); }
      }
    }
  });
  it('time map: increasing timestamps, random gets agree (incl. before first set)', () => {
    for (let t = 0; t < 100; t++) {
      const a = new p04.optimal(), b = new p04.bruteForce();
      let ts = 1;
      for (let q = 0; q < 50; q++) {
        const key = 'k' + rint(0, 3);
        if (rand() < 0.5) { ts += rint(1, 3); a.set(key, 'v' + q, ts); b.set(key, 'v' + q, ts); }
        else { const at = rint(0, ts + 2); assert.equal(a.get(key, at), b.get(key, at)); }
      }
    }
  });
});

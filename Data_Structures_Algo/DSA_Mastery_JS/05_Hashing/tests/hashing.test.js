const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { hashString, HashTable, HashSet } = require('../02_Implementations/hash_table');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(9);
const randInt = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));

describe('hashString', () => {
  it('is deterministic and always inside [0, size)', () => {
    assert.equal(hashString('abc', 16), hashString('abc', 16));
    assert.equal(hashString('', 7), 0);
    for (let t = 0; t < 300; t++) {
      const key = Math.random().toString(36).repeat(randInt(1, 20));
      const size = randInt(1, 100);
      const h = hashString(key, size);
      assert.ok(Number.isInteger(h) && h >= 0 && h < size, key);
    }
  });
});

describe('HashTable', () => {
  it('set / get / has / delete normal flow', () => {
    const t = new HashTable();
    t.set('a', 1).set('b', 2);
    assert.equal(t.get('a'), 1);
    assert.equal(t.has('b'), true);
    assert.equal(t.size, 2);
    assert.equal(t.delete('a'), true);
    assert.equal(t.delete('a'), false);
    assert.equal(t.get('a'), undefined);
    assert.equal(t.size, 1);
  });
  it('empty table', () => {
    const t = new HashTable();
    assert.equal(t.size, 0);
    assert.equal(t.get('x'), undefined);
    assert.equal(t.has('x'), false);
    assert.deepEqual(t.keys(), []);
    assert.deepEqual(t.entries(), []);
  });
  it('overwrites duplicate keys without growing size', () => {
    const t = new HashTable();
    t.set('k', 1).set('k', 2).set('k', 3);
    assert.equal(t.size, 1);
    assert.equal(t.get('k'), 3);
  });
  it('keeps number 1 and string "1" as different keys (same bucket, strict equality)', () => {
    const t = new HashTable();
    t.set(1, 'num').set('1', 'str');
    assert.equal(t.get(1), 'num');
    assert.equal(t.get('1'), 'str');
    assert.equal(t.size, 2);
  });
  it('stores falsy values and negative number keys', () => {
    const t = new HashTable();
    t.set(-5, 0).set('', false).set(0, null);
    assert.equal(t.get(-5), 0);
    assert.equal(t.has(''), true);
    assert.equal(t.get(0), null);
  });
  it('resizes when the load factor passes 0.75 and keeps every entry', () => {
    const t = new HashTable(4);
    for (let i = 0; i < 100; i++) t.set('key' + i, i);
    assert.equal(t.size, 100);
    assert.ok(t.capacity >= Math.ceil(100 / HashTable.LOAD_FACTOR));
    for (let i = 0; i < 100; i++) assert.equal(t.get('key' + i), i);
  });
  it('matches the built-in Map on random operations', () => {
    for (let round = 0; round < 50; round++) {
      const t = new HashTable(randInt(1, 8));
      const ref = new Map();
      for (let step = 0; step < 200; step++) {
        const key = rand() < 0.5 ? randInt(-20, 20) : 'k' + randInt(0, 20);
        const op = rand();
        if (op < 0.5) { const v = randInt(0, 99); t.set(key, v); ref.set(key, v); }
        else if (op < 0.75) assert.equal(t.delete(key), ref.delete(key));
        else assert.equal(t.get(key), ref.get(key));
        assert.equal(t.size, ref.size);
      }
      const sortKey = (e) => typeof e[0] + String(e[0]);
      assert.deepEqual(t.entries().sort((a, b) => sortKey(a).localeCompare(sortKey(b))), [...ref.entries()].sort((a, b) => sortKey(a).localeCompare(sortKey(b))));
      assert.equal(t.keys().length, t.values().length);
    }
  });
});

describe('HashSet', () => {
  it('ignores duplicates and supports delete', () => {
    const s = new HashSet();
    s.add(1).add(1).add(2);
    assert.equal(s.size, 2);
    assert.equal(s.has(1), true);
    assert.equal(s.delete(1), true);
    assert.equal(s.has(1), false);
    assert.equal(s.delete(1), false);
  });
  it('matches the built-in Set on random input', () => {
    const s = new HashSet(); const ref = new Set();
    for (let i = 0; i < 1000; i++) {
      const v = randInt(-50, 50);
      if (rand() < 0.7) { s.add(v); ref.add(v); } else assert.equal(s.delete(v), ref.delete(v));
    }
    assert.equal(s.size, ref.size);
    assert.deepEqual(s.values().sort((a, b) => a - b), [...ref].sort((a, b) => a - b));
  });
});

describe('solution files: extra edge cases', () => {
  const iso = require('../03_Problems/solutions/05_isomorphic_strings');
  const topK = require('../03_Problems/solutions/09_top_k_frequent_elements');
  const lcs = require('../03_Problems/solutions/10_longest_consecutive_sequence');
  const subK = require('../03_Problems/solutions/11_subarray_sum_equals_k');
  const hm = require('../03_Problems/solutions/15_design_hashmap');

  it('Isomorphic Strings: needs both directions', () => {
    assert.equal(iso.optimal('ab', 'aa'), false);
    assert.equal(iso.optimal('aa', 'ab'), false);
    assert.equal(iso.optimal('paper', 'title'), true);
    assert.equal(iso.optimal('', ''), true);
    const randStr = (n) => Array.from({ length: n }, () => 'abc'[randInt(0, 2)]).join('');
    for (let t = 0; t < 200; t++) {
      const n = randInt(0, 6);
      const s = randStr(n), u = randStr(n);
      assert.equal(iso.optimal(s, u), iso.bruteForce(s, u));
    }
  });
  it('Top K Frequent Elements: k equals number of distinct values, negatives', () => {
    assert.deepEqual(topK.optimal([1], 1), [1]);
    assert.deepEqual(topK.optimal([-1, -1, 2], 2).sort((a, b) => a - b), [-1, 2]);
    assert.deepEqual(topK.optimal([4, 4, 4, -3, -3, 7], 2).sort((a, b) => a - b), [-3, 4]);
  });
  it('Longest Consecutive Sequence: empty, duplicates, negatives, random vs brute force', () => {
    assert.equal(lcs.optimal([]), 0);
    assert.equal(lcs.optimal([1, 2, 2, 3]), 3);
    assert.equal(lcs.optimal([-2, -1, 0, 5]), 3);
    for (let t = 0; t < 200; t++) {
      const a = Array.from({ length: randInt(0, 20) }, () => randInt(-15, 15));
      assert.equal(lcs.optimal(a), lcs.bruteForce(a));
    }
  });
  it('Subarray Sum Equals K: k = 0, negatives, random vs brute force', () => {
    assert.equal(subK.optimal([0, 0, 0], 0), 6);
    assert.equal(subK.optimal([1, -1, 1, -1], 0), 4);
    assert.equal(subK.optimal([], 0), 0);
    for (let t = 0; t < 200; t++) {
      const a = Array.from({ length: randInt(0, 20) }, () => randInt(-5, 5));
      const k = randInt(-6, 6);
      assert.equal(subK.optimal(a, k), subK.bruteForce(a, k));
    }
  });
  it('Design HashMap: put overwrites, remove missing key, get missing returns -1', () => {
    const m = new hm.MyHashMap();
    assert.equal(m.get(5), -1);
    m.put(5, 1); m.put(5, 2);
    assert.equal(m.get(5), 2);
    m.remove(7);
    m.remove(5);
    assert.equal(m.get(5), -1);
  });
});

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { sameValueZero, copyGrid, jsonClone, deepClone, deepEqual, keyOf } = require('../02_Implementations/copy_and_equality');
const { countMultiples, windowStarts, pairs, Range, range, memoize } = require('../02_Implementations/loops_and_iteration');
const fizz = require('../03_Problems/solutions/01_fizzbuzz_range_count');
const rotate = require('../03_Problems/solutions/04_rotate_in_place');
const flatten = require('../03_Problems/solutions/05_flatten_depth');
const equal = require('../03_Problems/solutions/06_deep_equal');
const clone = require('../03_Problems/solutions/09_deep_clone');

function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

describe('copy and equality', () => {
  it('handles normal case', () => {
    const g = [[1, 2], [3, 4]];
    const c = copyGrid(g);
    c[0][0] = 9;
    assert.equal(g[0][0], 1);
    assert.ok(deepEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] }));
  });
  it('handles empty input', () => {
    assert.deepEqual(copyGrid([]), []);
    assert.ok(deepEqual({}, {}));
    assert.ok(deepEqual([], []));
    assert.ok(!deepEqual([], {}));
    assert.deepEqual(deepClone([]), []);
  });
  it('handles NaN, -0 and cycles', () => {
    assert.ok(sameValueZero(NaN, NaN));
    assert.ok(sameValueZero(0, -0));
    const o = { v: NaN }; o.self = o;
    const c = deepClone(o);
    assert.equal(c.self, c);
    assert.ok(deepEqual(c, o));
    assert.throws(() => jsonClone(o));
  });
  it('keyOf makes arrays usable as Set keys', () => {
    assert.equal(new Set([[1, 2], [1, 2], [2, 1]].map(keyOf)).size, 2);
  });
  it('matches brute force on random inputs (deepClone vs structuredClone)', () => {
    const rand = mulberry32(11);
    const gen = d => (d === 0 || rand() < 0.3 ? Math.floor(rand() * 5) : rand() < 0.5
      ? Array.from({ length: Math.floor(rand() * 3) }, () => gen(d - 1))
      : Object.fromEntries(Array.from({ length: Math.floor(rand() * 3) }, (_, i) => ['k' + i, gen(d - 1)])));
    for (let t = 0; t < 200; t++) {
      const x = gen(4);
      assert.deepEqual(deepClone(x), structuredClone(x));
    }
  });
});

describe('loops and iteration', () => {
  it('handles boundaries', () => {
    assert.equal(countMultiples(1, 15, 3), 5);
    assert.equal(countMultiples(-6, -1, 3), 2);
    assert.equal(countMultiples(5, 4, 3), 0);
    assert.deepEqual(windowStarts(4, 4), [0]);
    assert.deepEqual(windowStarts(3, 4), []);
    assert.equal(pairs(0).length, 0);
    assert.equal(pairs(6).length, 15);
  });
  it('Range and range agree, including negative steps', () => {
    assert.deepEqual([...new Range(10, 0, -3)], [10, 7, 4, 1]);
    assert.deepEqual([...range(10, 0, -3)], [10, 7, 4, 1]);
    assert.throws(() => [...range(0, 1, 0)], RangeError);
  });
  it('memoize caches per closure', () => {
    let calls = 0;
    const f = memoize(x => { calls++; return x + 1; });
    f(1); f(1); f(2);
    assert.equal(calls, 2);
  });
});

describe('selected solutions', () => {
  it('fizzbuzz counts handle negatives and lcm', () => {
    assert.deepEqual(fizz.optimal(-3, 3, 3, 5), fizz.bruteForce(-3, 3, 3, 5));
    assert.equal(fizz.optimal(1, 24, 4, 6).fizzbuzz, 2);
  });
  it('rotate handles huge and negative k', () => {
    assert.deepEqual(rotate.optimal([1, 2, 3, 4, 5], 1e9 + 2), [4, 5, 1, 2, 3]);
    assert.deepEqual(rotate.optimal([1, 2, 3, 4, 5], -7), [3, 4, 5, 1, 2]);
  });
  it('flatten matches Array.prototype.flat on random input', () => {
    const rand = mulberry32(12);
    const gen = l => Array.from({ length: Math.floor(rand() * 4) }, () => (l > 0 && rand() < 0.5 ? gen(l - 1) : 1));
    for (let t = 0; t < 200; t++) { const a = gen(4); const d = Math.floor(rand() * 4); assert.deepEqual(flatten.optimal(a, d), a.flat(d)); }
  });
  it('deepEqual brute and optimal agree on tricky pairs', () => {
    const pairsToCheck = [[{ a: undefined }, {}], [[0], [-0]], [{ a: 1, b: 2 }, { b: 2, a: 1 }], [[NaN], [NaN]], [null, undefined]];
    for (const [a, b] of pairsToCheck) assert.equal(equal.optimal(a, b), equal.bruteForce(a, b));
  });
  it('deepClone keeps Map/Set/Date working', () => {
    const src = { m: new Map([['k', [1]]]), s: new Set([1]), d: new Date(3) };
    const c = clone.optimal(src);
    assert.ok(c.m.get('k') !== src.m.get('k'));
    assert.ok(c.s.has(1) && c.d.getTime() === 3);
  });
});

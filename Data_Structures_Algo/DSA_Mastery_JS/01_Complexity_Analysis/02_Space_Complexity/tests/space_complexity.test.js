const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const S = require('../02_Implementations/space_examples');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(13);
const randInt = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const randArray = (n) => Array.from({ length: n }, () => randInt(-100, 100));

describe('in place vs copy', () => {
  it('reverseInPlace mutates and returns the same array', () => {
    const a = [1, 2, 3];
    const r = S.reverseInPlace(a);
    assert.equal(r, a);
    assert.deepEqual(a, [3, 2, 1]);
    assert.deepEqual(S.reverseInPlace([]), []);
    assert.deepEqual(S.reverseInPlace([7]), [7]);
  });
  it('reversedCopy leaves the input untouched', () => {
    const a = [1, 2, 3];
    const r = S.reversedCopy(a);
    assert.notEqual(r, a);
    assert.deepEqual(a, [1, 2, 3]);
    assert.deepEqual(r, [3, 2, 1]);
  });
  it('both agree with the built-in reverse on random input (even and odd lengths, duplicates)', () => {
    for (let t = 0; t < 200; t++) {
      const a = randArray(randInt(0, 25));
      const expected = [...a].reverse();
      assert.deepEqual(S.reversedCopy(a), expected);
      assert.deepEqual(S.reverseInPlace([...a]), expected);
    }
  });
});

describe('recursion depth', () => {
  it('sumToLinear and powerLog compute correct values', () => {
    assert.equal(S.sumToLinear(0), 0);
    assert.equal(S.sumToLinear(100), 5050);
    assert.equal(S.powerLog(2, 0), 1);
    assert.equal(S.powerLog(2, 10), 1024);
    assert.equal(S.powerLog(3, 5), 243);
  });
  it('recursive and iterative sums agree', () => {
    for (let n = 0; n <= 500; n += 7) assert.equal(S.sumToRecursive(n), S.sumToIterative(n));
  });
  it('the iterative version survives inputs that overflow the recursive one', () => {
    const limit = S.findStackLimit();
    assert.ok(limit > 1000 && Number.isFinite(limit));
    assert.equal(S.sumToIterative(1e6), 500000500000);
    assert.throws(() => S.sumToRecursive(limit * 10), RangeError);
  });
});

describe('slice trap vs index parameter', () => {
  it('sumWithSlice and sumWithIndex agree on random arrays', () => {
    assert.equal(S.sumWithSlice([]), 0);
    assert.equal(S.sumWithIndex([]), 0);
    for (let t = 0; t < 200; t++) {
      const a = randArray(randInt(0, 40));
      const ref = a.reduce((x, y) => x + y, 0);
      assert.equal(S.sumWithSlice(a), ref);
      assert.equal(S.sumWithIndex(a), ref);
    }
  });
});

describe('string building', () => {
  it('concat and join produce the same string', () => {
    for (const n of [0, 1, 5, 1000]) {
      assert.equal(S.buildWithConcat(n), 'a'.repeat(n));
      assert.equal(S.buildWithJoin(n), 'a'.repeat(n));
    }
  });
});

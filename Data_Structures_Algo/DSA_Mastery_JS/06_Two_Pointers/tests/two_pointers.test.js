const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { oppositeEnds, readWrite, twoArrays, partition, floydCycle } = require('../02_Implementations/two_pointer_templates');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(21);
const randInt = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const randArray = (n, lo = -20, hi = 20) => Array.from({ length: n }, () => randInt(lo, hi));
const asc = (a, b) => a - b;

describe('oppositeEnds (sorted pair sum)', () => {
  it('finds a pair in the normal case', () => {
    assert.deepEqual(oppositeEnds([1, 2, 4, 7, 11], 9), [1, 3]);
  });
  it('returns null for empty, single element and impossible targets', () => {
    assert.equal(oppositeEnds([], 1), null);
    assert.equal(oppositeEnds([5], 10), null);
    assert.equal(oppositeEnds([1, 2, 3], 100), null);
  });
  it('handles duplicates and negatives', () => {
    assert.deepEqual(oppositeEnds([3, 3], 6), [0, 1]);
    assert.deepEqual(oppositeEnds([-5, -2, 0, 4], -7), [0, 1]);
  });
  it('agrees with a brute-force existence check on random sorted arrays', () => {
    for (let t = 0; t < 300; t++) {
      const a = randArray(randInt(0, 15)).sort(asc);
      const target = randInt(-40, 40);
      let exists = false;
      for (let i = 0; i < a.length; i++) for (let j = i + 1; j < a.length; j++) if (a[i] + a[j] === target) exists = true;
      const r = oppositeEnds(a, target);
      assert.equal(r !== null, exists);
      if (r) assert.ok(r[0] < r[1] && a[r[0]] + a[r[1]] === target);
    }
  });
});

describe('readWrite (in-place filter)', () => {
  it('keeps order and returns the new length', () => {
    const a = [0, 1, 0, 3, 12];
    const k = readWrite(a, (x) => x !== 0);
    assert.equal(k, 3);
    assert.deepEqual(a.slice(0, k), [1, 3, 12]);
  });
  it('handles empty, keep-all and keep-none', () => {
    assert.equal(readWrite([], () => true), 0);
    const all = [1, 2];
    assert.equal(readWrite(all, () => true), 2);
    assert.deepEqual(all, [1, 2]);
    assert.equal(readWrite([1, 2], () => false), 0);
  });
  it('matches Array.filter on random input', () => {
    for (let t = 0; t < 300; t++) {
      const a = randArray(randInt(0, 20));
      const keep = (x) => x % 3 !== 0;
      const expected = a.filter(keep);
      const copy = [...a];
      const k = readWrite(copy, keep);
      assert.deepEqual(copy.slice(0, k), expected);
    }
  });
});

describe('twoArrays (merge two sorted arrays)', () => {
  it('handles empty inputs and duplicates', () => {
    assert.deepEqual(twoArrays([], []), []);
    assert.deepEqual(twoArrays([], [1, 2]), [1, 2]);
    assert.deepEqual(twoArrays([2, 2], [2]), [2, 2, 2]);
  });
  it('matches concat + sort on random sorted arrays (including negatives)', () => {
    for (let t = 0; t < 300; t++) {
      const a = randArray(randInt(0, 12)).sort(asc), b = randArray(randInt(0, 12)).sort(asc);
      assert.deepEqual(twoArrays(a, b), [...a, ...b].sort(asc));
    }
  });
});

describe('partition (Dutch national flag)', () => {
  const check = (arr, pivot) => {
    const before = [...arr].sort(asc);
    const out = partition(arr, pivot);
    assert.deepEqual([...out].sort(asc), before, 'same multiset');
    let phase = 0; // 0: < pivot, 1: === pivot, 2: > pivot
    for (const x of out) {
      const p = x < pivot ? 0 : x === pivot ? 1 : 2;
      assert.ok(p >= phase, 'regions out of order: ' + out);
      phase = p;
    }
  };
  it('handles empty, all-equal, sorted and reverse-sorted input', () => {
    check([], 1);
    check([2, 2, 2], 2);
    check([1, 2, 3, 4], 2);
    check([4, 3, 2, 1], 3);
  });
  it('handles a pivot that is not in the array', () => {
    check([5, 1, 9, 3], 4);
  });
  it('is correct on random input', () => {
    for (let t = 0; t < 300; t++) check(randArray(randInt(0, 20), 0, 4), randInt(0, 4));
  });
});

describe('floydCycle', () => {
  const build = (n, cycleTo) => {
    const nodes = Array.from({ length: n }, (_, i) => ({ value: i, next: null }));
    for (let i = 0; i + 1 < n; i++) nodes[i].next = nodes[i + 1];
    if (cycleTo >= 0 && n) nodes[n - 1].next = nodes[cycleTo];
    return nodes[0] ?? null;
  };
  it('handles empty and single-node lists', () => {
    assert.equal(floydCycle(null), false);
    assert.equal(floydCycle(build(1, -1)), false);
    assert.equal(floydCycle(build(1, 0)), true); // self loop
  });
  it('detects cycles at any entry point on random lists', () => {
    for (let t = 0; t < 200; t++) {
      const n = randInt(1, 30);
      const cycleTo = rand() < 0.5 ? -1 : randInt(0, n - 1);
      assert.equal(floydCycle(build(n, cycleTo)), cycleTo >= 0);
    }
  });
});

describe('solution files: extra edge cases', () => {
  const vp2 = require('../03_Problems/solutions/02_valid_palindrome_ii');
  const water = require('../03_Problems/solutions/11_container_with_most_water');
  const rain = require('../03_Problems/solutions/12_trapping_rain_water');
  const threeSum = require('../03_Problems/solutions/13_three_sum');
  const boats = require('../03_Problems/solutions/17_boats_to_save_people');
  const norm = (ts) => ts.map((t) => [...t].sort(asc).join(',')).sort();

  it('Valid Palindrome II: deletion on either side, random vs brute force', () => {
    assert.equal(vp2.optimal('abca'), true);
    assert.equal(vp2.optimal('cbbcc'), true);
    assert.equal(vp2.optimal('abc'), false);
    assert.equal(vp2.optimal(''), true);
    for (let t = 0; t < 300; t++) {
      const s = Array.from({ length: randInt(0, 8) }, () => 'ab'[randInt(0, 1)]).join('');
      assert.equal(vp2.optimal(s), vp2.bruteForce(s));
    }
  });
  it('Container With Most Water: two bars, equal heights, random vs brute force', () => {
    assert.equal(water.optimal([1, 1]), 1);
    assert.equal(water.optimal([5, 5, 5]), 10);
    for (let t = 0; t < 200; t++) {
      const h = randArray(randInt(2, 20), 0, 15);
      assert.equal(water.optimal(h), water.bruteForce(h));
    }
  });
  it('Trapping Rain Water: empty, monotone, random vs brute force', () => {
    assert.equal(rain.optimal([]), 0);
    assert.equal(rain.optimal([1, 2, 3]), 0);
    assert.equal(rain.optimal([3, 2, 1]), 0);
    for (let t = 0; t < 200; t++) {
      const h = randArray(randInt(0, 20), 0, 8);
      assert.equal(rain.optimal(h), rain.bruteForce(h));
    }
  });
  it('3Sum: all zeros, no answer, random vs brute force', () => {
    assert.deepEqual(norm(threeSum.optimal([0, 0, 0, 0])), ['0,0,0']);
    assert.deepEqual(threeSum.optimal([1, 2, 3]), []);
    for (let t = 0; t < 200; t++) {
      const a = randArray(randInt(0, 12), -5, 5);
      assert.deepEqual(norm(threeSum.optimal([...a])), norm(threeSum.bruteForce([...a])));
    }
  });
  it('Boats to Save People: everyone at the limit, random vs brute force', () => {
    assert.equal(boats.optimal([3, 3, 3], 3), 3);
    assert.equal(boats.optimal([1], 3), 1);
    for (let t = 0; t < 200; t++) {
      const limit = randInt(5, 10);
      const people = randArray(randInt(1, 10), 1, limit);
      assert.equal(boats.optimal([...people], limit), boats.bruteForce([...people], limit));
    }
  });
});

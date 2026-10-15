// Tests for 38_Probability_And_Randomization.
// Every random test uses a SEEDED generator (mulberry32) and a WIDE tolerance band
// (about 6 standard deviations), so results are reproducible and never flaky.
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const R = require('../02_Implementations/randomization');
const shuffle = require('../03_Problems/solutions/01_shuffle_an_array');
const weighted = require('../03_Problems/solutions/04_random_pick_with_weight');
const rand10 = require('../03_Problems/solutions/05_rand10_using_rand7');
const randomizedSet = require('../03_Problems/solutions/07_insert_delete_getrandom');
const new21 = require('../03_Problems/solutions/10_new_21_game');

const { mulberry32, looksUniform } = R;

describe('mulberry32 (seeded PRNG)', () => {
  it('is reproducible for the same seed and differs across seeds', () => {
    const a = mulberry32(99);
    const b = mulberry32(99);
    const c = mulberry32(100);
    const sa = Array.from({ length: 20 }, a);
    assert.deepEqual(sa, Array.from({ length: 20 }, b));
    assert.notDeepEqual(sa, Array.from({ length: 20 }, c));
  });
  it('stays in [0, 1) and has mean about 0.5', () => {
    const rng = mulberry32(1);
    let sum = 0;
    for (let i = 0; i < 100000; i++) {
      const x = rng();
      assert.ok(x >= 0 && x < 1);
      sum += x;
    }
    assert.ok(Math.abs(sum / 100000 - 0.5) < 0.01); // sd of mean ~0.0009
  });
});

describe('fisherYates', () => {
  it('returns a permutation and handles empty / single arrays', () => {
    const rng = mulberry32(2);
    assert.deepEqual(R.fisherYates([], rng), []);
    assert.deepEqual(R.fisherYates([1], rng), [1]);
    const p = R.fisherYates([3, 1, 2, 2, -1], rng);
    assert.deepEqual(p.slice().sort((x, y) => x - y), [-1, 1, 2, 2, 3]);
  });
  it('is uniform over all 24 orders of 4 items; naive shuffle is caught', () => {
    const rng = mulberry32(3);
    const fy = R.bucketCounts(() => R.fisherYates([1, 2, 3, 4], rng), 48000, (a) => a.join(''));
    assert.equal(fy.size, 24);
    assert.ok(looksUniform([...fy.values()]));
    const nv = R.bucketCounts(() => R.naiveBiasedShuffle([1, 2, 3, 4], rng), 48000, (a) => a.join(''));
    assert.ok(!looksUniform([...nv.values()]));
  });
  it('each element lands in each position with probability 1/n', () => {
    const rng = mulberry32(4);
    const n = 6;
    const grid = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let t = 0; t < 36000; t++) R.fisherYates([0, 1, 2, 3, 4, 5], rng).forEach((v, pos) => grid[v][pos]++);
    for (const row of grid) assert.ok(looksUniform(row));
  });
});

describe('reservoirSample', () => {
  it('returns everything when k >= n and nothing when k = 0', () => {
    assert.deepEqual(R.reservoirSample([1, 2, 3], 5, mulberry32(5)), [1, 2, 3]);
    assert.deepEqual(R.reservoirSample([1, 2, 3], 0, mulberry32(5)), []);
    assert.deepEqual(R.reservoirSample([], 2, mulberry32(5)), []);
  });
  it('works on a generator (unknown length) and is uniform', () => {
    const rng = mulberry32(6);
    function* stream() { for (let i = 0; i < 20; i++) yield i; }
    const counts = new Array(20).fill(0);
    for (let t = 0; t < 20000; t++) for (const x of R.reservoirSample(stream(), 4, rng)) counts[x]++;
    assert.ok(looksUniform(counts));
  });
});

describe('WeightedPicker and AliasTable', () => {
  it('rejects bad input', () => {
    assert.throws(() => new R.WeightedPicker([]));
    assert.throws(() => new R.WeightedPicker([0, 0]));
    assert.throws(() => new R.WeightedPicker([1, -1]));
  });
  it('match the weights (including a zero weight)', () => {
    const rng = mulberry32(7);
    const w = [5, 0, 1, 4];
    const probs = [0.5, 0, 0.1, 0.4];
    for (const picker of [new R.WeightedPicker(w, rng), new R.AliasTable(w, rng)]) {
      const counts = [0, 0, 0, 0];
      for (let t = 0; t < 40000; t++) counts[picker.pick()]++;
      assert.equal(counts[1], 0);
      assert.ok(looksUniform(counts, probs));
    }
  });
  it('single weight always returns 0', () => {
    const p = new R.WeightedPicker([3], mulberry32(8));
    for (let t = 0; t < 100; t++) assert.equal(p.pick(), 0);
  });
});

describe('quickselect and randomizedQuicksort', () => {
  it('handles sorted, reverse-sorted, all-equal and negative inputs', () => {
    const rng = mulberry32(9);
    const sorted = Array.from({ length: 2000 }, (_, i) => i);
    assert.equal(R.quickselect(sorted, 1234, rng), 1234);
    assert.equal(R.quickselect(sorted.slice().reverse(), 0, rng), 0);
    assert.equal(R.quickselect(new Array(5000).fill(7), 2500, rng), 7); // 3-way partition: O(n)
    assert.deepEqual(R.randomizedQuicksort([3, -1, -1, 0, 2], rng), [-1, -1, 0, 2, 3]);
  });
  it('matches brute force (sort) on random inputs', () => {
    const rng = mulberry32(10);
    for (let t = 0; t < 200; t++) {
      const n = 1 + Math.floor(rng() * 40);
      const arr = Array.from({ length: n }, () => Math.floor(rng() * 21) - 10);
      const s = arr.slice().sort((a, b) => a - b);
      const k = Math.floor(rng() * n);
      assert.equal(R.quickselect(arr, k, rng), s[k]);
      assert.deepEqual(R.randomizedQuicksort(arr, rng), s);
    }
  });
});

describe('rejection sampling and statistics helpers', () => {
  it('rand10FromRand7 is uniform with ~2.45 expected calls', () => {
    const rng = mulberry32(11);
    let calls = 0;
    const base = R.makeRand7(rng);
    const counts = new Array(10).fill(0);
    for (let t = 0; t < 40000; t++) counts[R.rand10FromRand7(() => { calls++; return base(); }) - 1]++;
    assert.ok(looksUniform(counts));
    assert.ok(Math.abs(calls / 40000 - 2.45) < 0.1);
  });
  it('chiSquare is 0 for a perfect fit and Infinity for an impossible bucket', () => {
    assert.equal(R.chiSquare([10, 10, 10]), 0);
    assert.equal(R.chiSquare([5, 1], [1, 0]), Infinity);
    assert.ok(!looksUniform([1000, 0, 0, 0]));
  });
  it('monte carlo pi and geometric expectation are close', () => {
    const rng = mulberry32(12);
    assert.ok(Math.abs(R.monteCarloPi(100000, rng) - Math.PI) < 0.05);
    assert.equal(R.expectedTrialsUntilSuccess(1), 1);
    assert.throws(() => R.expectedTrialsUntilSuccess(0));
  });
});

describe('problem solutions', () => {
  it('01 shuffle: reset restores, shuffle is a permutation, both versions uniform', () => {
    const rng = mulberry32(13);
    const s = new shuffle.Solution([9, 8, 7], rng);
    s.shuffle();
    assert.deepEqual(s.reset(), [9, 8, 7]);
    const counts = new Map();
    for (let t = 0; t < 12000; t++) {
      const k = shuffle.bruteForce([1, 2, 3], rng).join('');
      counts.set(k, (counts.get(k) || 0) + 1);
    }
    assert.ok(looksUniform([...counts.values()]));
  });
  it('04 weighted pick: optimal equals linear scan for the same random number', () => {
    const rng = mulberry32(14);
    for (let t = 0; t < 200; t++) {
      const w = Array.from({ length: 1 + Math.floor(rng() * 10) }, () => 1 + Math.floor(rng() * 9));
      const v = rng();
      assert.equal(weighted.optimal(w, () => v), weighted.bruteForce(w, () => v));
    }
  });
  it('05 rand10: never returns outside 1..10', () => {
    const rng = mulberry32(15);
    const r7 = R.makeRand7(rng);
    for (let t = 0; t < 5000; t++) {
      const v = rand10.optimal(r7);
      assert.ok(v >= 1 && v <= 10);
    }
  });
  it('07 randomized set: remove of last element and of absent value', () => {
    const s = new randomizedSet.RandomizedSet(mulberry32(16));
    assert.equal(s.remove(1), false);
    assert.equal(s.insert(1), true);
    assert.equal(s.remove(1), true);
    assert.equal(s.size(), 0);
    assert.equal(s.getRandom(), undefined);
  });
  it('10 new 21 game: shortcuts and agreement with brute force', () => {
    assert.equal(new21.optimal(0, 0, 5), 1);
    assert.equal(new21.optimal(30, 5, 10), 1);
    const rng = mulberry32(17);
    for (let t = 0; t < 100; t++) {
      const k = Math.floor(rng() * 20);
      const n = k + Math.floor(rng() * 20);
      const m = 1 + Math.floor(rng() * 10);
      assert.ok(Math.abs(new21.optimal(n, k, m) - new21.bruteForce(n, k, m)) < 1e-9);
    }
  });
});

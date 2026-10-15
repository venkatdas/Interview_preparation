const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { factorial, sumArray, traceCalls, recursionTreeStats, fibMemo } = require('../02_Implementations/recursion_basics');
const { measureMaxDepth, sumToTail, sumToLoop, deepCountExplicit, postorderFrames, postorderRecursive, trampoline } = require('../02_Implementations/stack_depth');
const digits = require('../03_Problems/solutions/01_sum_of_digits');
const power = require('../03_Problems/solutions/04_modular_power');
const grid = require('../03_Problems/solutions/05_grid_paths');
const weighted = require('../03_Problems/solutions/07_depth_weighted_sum');
const hanoi = require('../03_Problems/solutions/08_hanoi_explicit_stack');

function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

describe('recursion basics', () => {
  it('handles normal case', () => {
    assert.equal(factorial(6), 720);
    assert.equal(sumArray([5, 5, 5]), 15);
    assert.equal(fibMemo(30), 832040);
  });
  it('handles empty / base inputs', () => {
    assert.equal(factorial(0), 1);
    assert.equal(sumArray([]), 0);
    assert.equal(fibMemo(0), 0);
    assert.equal(recursionTreeStats(0).calls, 1);
  });
  it('trace shows the call stack', () => {
    const { lines } = traceCalls('s', (self, n) => (n === 0 ? 0 : n + self(n - 1))).run(2);
    assert.equal(lines[0], '-> s(2)');
    assert.equal(lines.at(-1), '<- s(2) = 3');
    assert.equal(lines.length, 6);
  });
});

describe('stack depth and conversions', () => {
  it('measures a finite stack and shows no TCO', () => {
    assert.ok(measureMaxDepth() > 1000);
    assert.throws(() => sumToTail(1e6), RangeError);
    assert.equal(sumToLoop(1e6), 500000500000);
  });
  it('trampoline runs a million tail calls', () => {
    const countDown = trampoline(function go(n) { return n === 0 ? 'done' : () => go(n - 1); });
    assert.equal(countDown(1e6), 'done');
  });
  it('explicit stacks match recursion on random trees and arrays', () => {
    const rand = mulberry32(31);
    let id = 0;
    const gen = d => (d === 0 || rand() < 0.3 ? null : { val: id++, left: gen(d - 1), right: gen(d - 1) });
    for (let t = 0; t < 200; t++) {
      const tree = gen(7);
      assert.deepEqual(postorderFrames(tree), postorderRecursive(tree));
    }
    assert.equal(deepCountExplicit([]), 0);
    assert.equal(deepCountExplicit([1, [2, [3]]]), 3);
  });
});

describe('selected solutions', () => {
  it('sum of digits on edge values', () => {
    assert.deepEqual(digits.optimal(Number.MAX_SAFE_INTEGER), digits.bruteForce(Number.MAX_SAFE_INTEGER));
    assert.deepEqual(digits.optimal(10), { sumDigits: 1, superDigit: 1 });
  });
  it('modular power: halving makes O(log e) calls', () => {
    assert.equal(power.optimal(2n, 64n, 2n ** 64n).value, 0n);
    assert.ok(power.optimal(3n, 2n ** 40n, 1000003n).calls <= 42);
  });
  it('grid paths: brute and memo agree on random grids', () => {
    const rand = mulberry32(32);
    for (let t = 0; t < 200; t++) {
      const R = 1 + Math.floor(rand() * 5), C = 1 + Math.floor(rand() * 5);
      const g = Array.from({ length: R }, () => Array.from({ length: C }, () => (rand() < 0.25 ? 1 : 0)));
      assert.equal(grid.optimal(g).count, grid.bruteForce(g).count);
    }
  });
  it('depth-weighted sum handles deep nesting iteratively', () => {
    let d = [2];
    for (let i = 0; i < 50000; i++) d = [d];
    assert.equal(weighted.optimal(d), 2 * 50001);
  });
  it('hanoi iterative equals recursive and is legal', () => {
    for (let n = 0; n <= 10; n++) {
      const m = hanoi.optimal(n);
      assert.deepEqual(m, hanoi.bruteForce(n));
      assert.ok(hanoi.isLegal(n, m));
    }
  });
});

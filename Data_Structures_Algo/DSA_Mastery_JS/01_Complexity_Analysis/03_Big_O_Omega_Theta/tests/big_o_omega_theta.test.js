const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { doublingRatio, estimateExponent, masterTheorem, evalRecurrence, growthTable, isBoundedBy, mulberry32 } = require('../02_Implementations/growth');
const nested = require('../03_Problems/solutions/01_dependent_nested_loops');
const doubling = require('../03_Problems/solutions/04_doubling_inner_loop');
const harmonic = require('../03_Problems/solutions/05_harmonic_loop');
const merge = require('../03_Problems/solutions/06_divide_two_linear_merge');
const fib = require('../03_Problems/solutions/09_fibonacci_call_tree');

describe('growth.js', () => {
  it('handles normal case: classic recurrences', () => {
    assert.equal(masterTheorem(2, 2, 1).bound, 'Theta(n log n)');
    assert.equal(masterTheorem(1, 2, 0).bound, 'Theta(log n)');
    assert.equal(masterTheorem(4, 2, 1).bound, 'Theta(n^2)');
    assert.equal(masterTheorem(1, 2, 1).case, 3);
  });
  it('handles trivial / edge input', () => {
    assert.equal(masterTheorem(1, 2, 0).case, 2);
    assert.equal(evalRecurrence({ a: 2, b: 2, f: n => n }, 1), 1);
    assert.equal(evalRecurrence({ a: 2, b: 2, f: n => n }, 0), 1);
    assert.throws(() => masterTheorem(0.5, 2, 1), RangeError);
    assert.throws(() => masterTheorem(2, 1, 1), RangeError);
  });
  it('doubling ratios and exponents identify classes', () => {
    assert.ok(Math.abs(doublingRatio(n => n * n * n, 100) - 8) < 1e-9);
    assert.ok(Math.abs(estimateExponent(n => 7 * n * n + n, 1e4, 1e6) - 2) < 0.01);
  });
  it('formal definition check', () => {
    const ns = Array.from({ length: 500 }, (_, i) => i + 1);
    assert.ok(isBoundedBy(n => 5 * n + 100, n => n, 6, 100, ns));
    assert.ok(!isBoundedBy(n => n * Math.log2(n + 1), n => n, 3, 1, ns));
    assert.equal(growthTable([2])[0].n_fact, 2);
  });
  it('master theorem matches evaluated recurrences on random (a, b, d)', () => {
    const rand = mulberry32(410);
    for (let t = 0; t < 40; t++) {
      const a = 1 + Math.floor(rand() * 4), b = 2, d = Math.floor(rand() * 3);
      const T = n => evalRecurrence({ a, b, f: m => m ** d }, n);
      const n = 2 ** 18;
      const ratio = T(2 * n) / T(n);
      const crit = Math.log2(a);
      const expected = 2 ** Math.max(d, crit);
      const res = masterTheorem(a, b, d);
      // case 2 adds a log factor: ratio slightly above 2^d
      assert.ok(ratio >= expected * 0.98 && ratio <= expected * (res.case === 2 ? 1.12 : 1.02), `a=${a} d=${d} ratio=${ratio}`);
    }
  });
});

describe('selected solutions', () => {
  it('closed forms equal counted steps', () => {
    for (const n of [0, 1, 2, 17, 64, 100]) {
      assert.equal(nested.optimal(n), nested.bruteForce(n));
      assert.equal(doubling.optimal(n), doubling.bruteForce(n));
      assert.equal(harmonic.optimal(n), harmonic.bruteForce(n));
      assert.equal(merge.optimal(n), merge.bruteForce(n));
    }
  });
  it('fib call counts and memo counts', () => {
    assert.equal(fib.optimal(20), fib.bruteForce(20));
    assert.equal(fib.memoCalls(50), 99);
  });
});

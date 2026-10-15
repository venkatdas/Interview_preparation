// node --test 16_Stacks/tests/stacks.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { Stack, LinkedStack, MinStack } = require('../02_Implementations/stack');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

for (const StackClass of [Stack, LinkedStack]) {
  describe(StackClass.name, () => {
    it('is LIFO and supports chaining', () => {
      const s = new StackClass();
      s.push(1).push(2).push(3);
      assert.equal(s.size(), 3);
      assert.equal(s.peek(), 3);
      assert.equal(s.pop(), 3);
      assert.equal(s.pop(), 2);
      assert.equal(s.pop(), 1);
    });
    it('empty stack: peek is undefined, pop throws', () => {
      const s = new StackClass();
      assert.equal(s.isEmpty(), true);
      assert.equal(s.size(), 0);
      assert.equal(s.peek(), undefined);
      assert.throws(() => s.pop(), /empty/);
    });
    it('stores falsy values and duplicates correctly', () => {
      const s = new StackClass();
      s.push(0).push(0).push(null).push('');
      assert.equal(s.size(), 4);
      assert.equal(s.pop(), '');
      assert.equal(s.pop(), null);
      assert.equal(s.pop(), 0);
      assert.equal(s.isEmpty(), false);
    });
    it('matches an array model on random operations', () => {
      const rnd = mulberry32(16);
      const s = new StackClass(), model = [];
      for (let i = 0; i < 3000; i++) {
        if (rnd() < 0.55) { const v = Math.floor(rnd() * 41) - 20; s.push(v); model.push(v); }
        else if (model.length) assert.equal(s.pop(), model.pop());
        else assert.throws(() => s.pop());
        assert.equal(s.size(), model.length);
        assert.equal(s.peek(), model[model.length - 1]);
      }
    });
  });
}

describe('Stack extras', () => {
  it('toArray is bottom -> top and a copy; clear empties', () => {
    const s = new Stack(); s.push(1).push(2);
    const arr = s.toArray(); arr.push(99);
    assert.deepEqual(s.toArray(), [1, 2]);
    s.clear();
    assert.equal(s.isEmpty(), true);
  });
});

describe('MinStack', () => {
  it('tracks the minimum through duplicate minimums', () => {
    const m = new MinStack();
    m.push(2); m.push(1); m.push(1); m.push(3);
    assert.equal(m.getMin(), 1);
    m.pop(); m.pop();
    assert.equal(m.getMin(), 1); // the second 1 is still there
    m.pop();
    assert.equal(m.getMin(), 2);
    assert.equal(m.top(), 2);
  });
  it('matches a brute-force Math.min on random ops (negatives, sorted, reverse-sorted)', () => {
    const rnd = mulberry32(155);
    for (const mode of ['random', 'asc', 'desc']) {
      const m = new MinStack(), model = [];
      for (let i = 0; i < 1500; i++) {
        if (model.length === 0 || rnd() < 0.6) {
          const v = mode === 'asc' ? i : mode === 'desc' ? -i : Math.floor(rnd() * 21) - 10;
          m.push(v); model.push(v);
        } else assert.equal(m.pop(), model.pop());
        if (model.length) {
          assert.equal(m.getMin(), Math.min(...model));
          assert.equal(m.top(), model[model.length - 1]);
        }
      }
    }
  });
});

describe('selected solutions on extra edge cases', () => {
  const vp = require('../03_Problems/solutions/01_valid_parentheses');
  const dt = require('../03_Problems/solutions/05_daily_temperatures');
  const ds = require('../03_Problems/solutions/08_decode_string');
  const rk = require('../03_Problems/solutions/09_remove_k_digits');
  const lr = require('../03_Problems/solutions/12_largest_rectangle_histogram');
  it('valid parentheses: empty, only closers, deep nesting', () => {
    assert.equal(vp.optimal(''), true);
    assert.equal(vp.optimal(']'), false);
    assert.equal(vp.optimal('('.repeat(5000) + ')'.repeat(5000)), true);
    assert.equal(vp.optimal('(]'), false);
  });
  it('daily temperatures: strictly decreasing, equal values, random vs brute', () => {
    assert.deepEqual(dt.optimal([5, 4, 3]), [0, 0, 0]);
    assert.deepEqual(dt.optimal([70, 70, 71]), [2, 1, 0]);
    const rnd = mulberry32(739);
    for (let t = 0; t < 200; t++) {
      const arr = Array.from({ length: Math.floor(rnd() * 25) }, () => 30 + Math.floor(rnd() * 10));
      assert.deepEqual(dt.optimal(arr), dt.bruteForce(arr));
    }
  });
  it('decode string: nested, multi-digit counts, no brackets', () => {
    assert.equal(ds.optimal('abc'), 'abc');
    assert.equal(ds.optimal('10[a]'), 'a'.repeat(10));
    assert.equal(ds.optimal('2[a2[bc]]'), 'abcbcabcbc');
  });
  it('remove k digits: remove all, leading zeros, already increasing', () => {
    assert.equal(rk.optimal('10', 2), '0');
    assert.equal(rk.optimal('10200', 1), '200');
    assert.equal(rk.optimal('12345', 2), '123');
    assert.equal(rk.optimal('9', 1), '0');
  });
  it('largest rectangle: empty, single bar, random vs brute', () => {
    assert.equal(lr.optimal([]), 0);
    assert.equal(lr.optimal([7]), 7);
    const rnd = mulberry32(84);
    for (let t = 0; t < 200; t++) {
      const h = Array.from({ length: Math.floor(rnd() * 20) }, () => Math.floor(rnd() * 10));
      assert.equal(lr.optimal(h), lr.bruteForce(h));
    }
  });
});

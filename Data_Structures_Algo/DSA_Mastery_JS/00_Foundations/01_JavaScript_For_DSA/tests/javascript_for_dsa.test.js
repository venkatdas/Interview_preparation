const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { positiveMod, Stack, ListNode, makeCounter, memoize, factorialIterative } = require('../02_Implementations/js_cheatsheet');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(7);
const randInt = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));

describe('positiveMod', () => {
  it('handles positive and zero values', () => {
    assert.equal(positiveMod(7, 3), 1);
    assert.equal(positiveMod(0, 5), 0);
    assert.equal(positiveMod(6, 3), 0);
  });
  it('handles negatives (where % alone returns a negative)', () => {
    assert.equal(-7 % 3, -1);
    assert.equal(positiveMod(-7, 3), 2);
    assert.equal(positiveMod(-3, 3), 0);
    assert.equal(positiveMod(-1, 26), 25);
  });
  it('matches a brute-force reference on random inputs', () => {
    for (let t = 0; t < 200; t++) {
      const x = randInt(-1000, 1000), m = randInt(1, 50);
      let ref = x;
      while (ref < 0) ref += m;
      while (ref >= m) ref -= m;
      assert.equal(positiveMod(x, m), ref);
    }
  });
});

describe('Stack (class with #private field)', () => {
  it('push / pop / size in LIFO order', () => {
    const s = new Stack();
    assert.equal(s.size, 0);
    s.push(1).push(2).push(3);
    assert.equal(s.size, 3);
    assert.equal(s.pop(), 3);
    assert.equal(s.pop(), 2);
    assert.equal(s.size, 1);
  });
  it('pop on empty returns undefined', () => {
    assert.equal(new Stack().pop(), undefined);
  });
  it('Stack.from keeps order and allows duplicates', () => {
    const s = Stack.from([5, 5, 6]);
    assert.equal(s.size, 3);
    assert.equal(s.pop(), 6);
    assert.equal(s.pop(), 5);
  });
  it('items are private', () => {
    const s = Stack.from([1]);
    assert.equal(s.items, undefined);
    assert.deepEqual(Object.keys(s), []);
  });
  it('matches an array used as a stack on random operations', () => {
    const s = new Stack(); const ref = [];
    for (let t = 0; t < 500; t++) {
      if (rand() < 0.6) { const v = randInt(-50, 50); s.push(v); ref.push(v); }
      else assert.equal(s.pop(), ref.pop());
      assert.equal(s.size, ref.length);
    }
  });
});

describe('ListNode', () => {
  it('builds and walks a list', () => {
    const head = new ListNode(1, new ListNode(2, new ListNode(3)));
    const values = [];
    for (let node = head; node; node = node.next) values.push(node.value);
    assert.deepEqual(values, [1, 2, 3]);
  });
  it('defaults next to null', () => {
    assert.equal(new ListNode(9).next, null);
  });
});

describe('closures: makeCounter and memoize', () => {
  it('each counter keeps its own state', () => {
    const a = makeCounter(), b = makeCounter();
    assert.equal(a(), 1); assert.equal(a(), 2); assert.equal(b(), 1);
  });
  it('memoize calls the function once per distinct argument', () => {
    let calls = 0;
    const square = memoize((n) => { calls++; return n * n; });
    assert.equal(square(4), 16);
    assert.equal(square(4), 16);
    assert.equal(square(-4), 16);
    assert.equal(calls, 2);
  });
  it('memoize caches falsy results too', () => {
    let calls = 0;
    const zero = memoize(() => { calls++; return 0; });
    zero(1); zero(1);
    assert.equal(calls, 1);
  });
});

describe('factorialIterative', () => {
  it('handles 0, 1 and small n', () => {
    assert.equal(factorialIterative(0), 1);
    assert.equal(factorialIterative(1), 1);
    assert.equal(factorialIterative(5), 120);
  });
  it('matches a recursive reference for n up to 20', () => {
    const rec = (n) => (n <= 1 ? 1 : n * rec(n - 1));
    for (let n = 0; n <= 20; n++) assert.equal(factorialIterative(n), rec(n));
  });
  it('works where deep recursion would overflow the call stack', () => {
    assert.equal(factorialIterative(100000), Infinity); // no RangeError, just overflow to Infinity
  });
});

describe('language traps the topic teaches', () => {
  it('default sort is lexicographic; comparator sorts numerically', () => {
    assert.deepEqual([10, 9, 1].sort(), [1, 10, 9]);
    assert.deepEqual([10, 9, 1].sort((a, b) => a - b), [1, 9, 10]);
  });
  it('fill([]) shares one row; Array.from creates separate rows', () => {
    const shared = new Array(3).fill([]); shared[0].push(1);
    assert.equal(shared[2].length, 1);
    const separate = Array.from({ length: 3 }, () => []); separate[0].push(1);
    assert.equal(separate[2].length, 0);
  });
  it('Map compares array keys by reference', () => {
    const m = new Map([[[1, 2], 'x']]);
    assert.equal(m.get([1, 2]), undefined);
  });
});

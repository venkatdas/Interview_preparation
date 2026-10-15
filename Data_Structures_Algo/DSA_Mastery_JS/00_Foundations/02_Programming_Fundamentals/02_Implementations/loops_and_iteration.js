/**
 * Loops, boundaries, closures and iteration protocols for DSA.
 *
 * 1. countMultiples(lo, hi, k)   - multiples of k in [lo, hi] without a loop
 * 2. windowStarts(n, k)          - every start index of a size-k window (boundary-safe)
 * 3. pairs(n)                    - every index pair i < j (the classic nested loop)
 * 4. Range                       - a class implementing the iterable protocol by hand
 * 5. range(start, end, step)     - the same thing as a generator (lazy)
 * 6. memoize(fn)                 - a closure-based cache
 * 7. makeCounter()               - minimal closure: private state between calls
 */

// ---------- 1. Count multiples ----------
// floor(x / k) = how many multiples of k are in [1, x]. Subtract the ones below lo.
function countMultiples(lo, hi, k) {
  if (k <= 0) throw new RangeError('k must be positive');
  if (hi < lo) return 0;
  return Math.floor(hi / k) - Math.floor((lo - 1) / k);
}

// ---------- 2. Window starts ----------
// A window [s, s + k) fits when s + k <= n. So s runs 0 .. n - k inclusive.
function windowStarts(n, k) {
  const out = [];
  for (let s = 0; s + k <= n; s++) out.push(s);
  return out; // empty when k > n
}

// ---------- 3. All pairs i < j ----------
// Inner loop starts at i + 1: no (i, i) and no duplicates (j, i).
function pairs(n) {
  const out = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) out.push([i, j]);
  return out; // n*(n-1)/2 pairs
}

// ---------- 4. Iterable class ----------
// Any object with [Symbol.iterator]() returning { next() { return { value, done } } }
// works with for...of, spread, Array.from, destructuring, new Set(...).
class Range {
  constructor(start, end, step = 1) {
    if (step === 0) throw new RangeError('step cannot be 0');
    this.start = start; this.end = end; this.step = step;
  }
  [Symbol.iterator]() {
    let cur = this.start;
    const { end, step } = this;
    return {
      next() {
        const inRange = step > 0 ? cur < end : cur > end; // half-open: end excluded
        if (!inRange) return { value: undefined, done: true };
        const value = cur;
        cur += step;
        return { value, done: false };
      },
    };
  }
  get length() {
    const span = this.step > 0 ? this.end - this.start : this.start - this.end;
    return Math.max(0, Math.ceil(span / Math.abs(this.step)));
  }
}

// ---------- 5. Generator version ----------
function* range(start, end, step = 1) {
  if (step === 0) throw new RangeError('step cannot be 0');
  for (let i = start; step > 0 ? i < end : i > end; i += step) yield i;
}

// ---------- 6. Memoize ----------
// The cache lives in the closure: private, and fresh for every memoize() call.
function memoize(fn, keyFn = (...args) => JSON.stringify(args)) {
  const cache = new Map();
  const wrapped = (...args) => {
    const key = keyFn(...args);
    if (cache.has(key)) return cache.get(key);
    const value = fn(...args);
    cache.set(key, value);
    return value;
  };
  wrapped.cache = cache;
  return wrapped;
}

// ---------- 7. Counter ----------
function makeCounter() {
  let count = 0; // not reachable from outside: only through the returned functions
  return { inc: () => ++count, get: () => count };
}

// ---------- self-test ----------
if (require.main === module) {
  const assert = require('assert');

  // countMultiples vs brute loop
  const brute = (lo, hi, k) => { let c = 0; for (let x = lo; x <= hi; x++) if (x % k === 0) c++; return c; };
  for (let lo = -20; lo <= 20; lo++) for (let hi = lo - 2; hi <= 25; hi++) for (const k of [1, 2, 3, 7]) {
    assert.strictEqual(countMultiples(lo, hi, k), brute(lo, hi, k), `${lo},${hi},${k}`);
  }

  assert.deepStrictEqual(windowStarts(5, 3), [0, 1, 2]);
  assert.deepStrictEqual(windowStarts(3, 3), [0]);
  assert.deepStrictEqual(windowStarts(2, 3), []);
  assert.deepStrictEqual(windowStarts(0, 1), []);

  assert.strictEqual(pairs(5).length, 10);
  assert.deepStrictEqual(pairs(3), [[0, 1], [0, 2], [1, 2]]);
  assert.deepStrictEqual(pairs(1), []);

  assert.deepStrictEqual([...new Range(0, 5)], [0, 1, 2, 3, 4]);
  assert.deepStrictEqual([...new Range(5, 0, -2)], [5, 3, 1]);
  assert.deepStrictEqual([...new Range(3, 3)], []);
  assert.strictEqual(new Range(0, 10, 3).length, 4);
  assert.strictEqual(new Range(10, 0, -3).length, 4);
  for (let s = -5; s <= 5; s++) for (let e = -5; e <= 5; e++) for (const st of [1, 2, 3, -1, -2]) {
    const r = new Range(s, e, st);
    assert.deepStrictEqual([...r], [...range(s, e, st)]);
    assert.strictEqual(r.length, [...r].length);
  }
  assert.throws(() => new Range(0, 1, 0), RangeError);

  // a generator is lazy: we can take 3 items from an "infinite" range
  const firstThree = [];
  for (const x of range(0, Infinity)) { if (firstThree.length === 3) break; firstThree.push(x); }
  assert.deepStrictEqual(firstThree, [0, 1, 2]);

  let calls = 0;
  const slowSquare = memoize(x => { calls++; return x * x; });
  assert.strictEqual(slowSquare(4), 16);
  assert.strictEqual(slowSquare(4), 16);
  assert.strictEqual(calls, 1);

  const c1 = makeCounter(), c2 = makeCounter();
  c1.inc(); c1.inc(); c2.inc();
  assert.strictEqual(c1.get(), 2);
  assert.strictEqual(c2.get(), 1);

  console.log('✓ loops_and_iteration.js self-test passed');
}

module.exports = { countMultiples, windowStarts, pairs, Range, range, memoize, makeCounter };

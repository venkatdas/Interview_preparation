/**
 * 08. Lazy Range Iterable   (Original — Medium)
 *
 * PROBLEM
 * Implement lazyRange(start, end, step = 1) that returns an ITERABLE (usable with
 * for...of and spread) producing start, start + step, ... and stopping BEFORE end
 * (half-open, like Python's range). It must:
 *   - support negative steps (counting down: stop when value <= end)
 *   - throw RangeError for step 0
 *   - be lazy: lazyRange(0, Infinity) must not hang until you consume it
 *   - be re-iterable: spreading the same range twice gives the same values twice
 * Also expose size(): how many values it will produce, computed WITHOUT iterating.
 *
 * EXAMPLES
 * Input: lazyRange(0, 5)          Values: [0, 1, 2, 3, 4]      size 5
 * Input: lazyRange(1, 10, 3)      Values: [1, 4, 7]            size 3
 * Input: lazyRange(5, 0, -2)      Values: [5, 3, 1]            size 3
 * Input: lazyRange(3, 3)          Values: []                   size 0
 * Input: lazyRange(0, 5, -1)      Values: []  (wrong direction) size 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Integers only? (assume integer start, end, step)
 * - Is end inclusive? (no, excluded)
 * - Re-iterable or one-shot like a generator object? (re-iterable)
 *
 * APPROACH 1 — Brute force (eager array)   O(size) time and space at creation
 * Build an array with a while loop and return it. Arrays are iterable, but this
 * hangs on infinite ranges and wastes memory for huge ones.
 *
 * APPROACH 2 — Optimal (iteration protocol)   O(1) creation, O(1) per value, O(1) space
 * Return an object whose [Symbol.iterator]() creates a FRESH cursor each time and
 * returns { next() }. next() checks the half-open condition
 *   step > 0 ? cur < end : cur > end
 * and returns { value, done }. Because each call to [Symbol.iterator] starts a new
 * cursor, the range is re-iterable (a generator OBJECT would be exhausted after one pass).
 * size = max(0, ceil((end - start) / step)): positive when direction and step agree.
 *
 * Dry run lazyRange(5, 0, -2):
 *   cur 5: 5 > 0 yes -> 5, cur 3
 *   cur 3: yes -> 3, cur 1
 *   cur 1: yes -> 1, cur -1
 *   cur -1: -1 > 0 no -> done
 *   size = ceil((0 - 5) / -2) = ceil(2.5) = 3
 *
 * EDGE CASES
 * - start === end          -> empty
 * - step in wrong direction -> empty (not infinite!)
 * - step 0                 -> RangeError (would be infinite)
 * - Infinity end           -> fine as long as the consumer breaks
 *
 * COMMON MISTAKES
 * - Using cur !== end as the stop test: overshoots when step does not divide the distance -> infinite loop.
 * - Returning a generator object (one-shot) instead of an iterable.
 * - Off-by-one in size (floor instead of ceil).
 */

function validate(step) {
  if (step === 0) throw new RangeError('step cannot be 0');
}

function bruteForce(start, end, step = 1) {
  validate(step);
  const out = [];
  let cur = start;
  while (step > 0 ? cur < end : cur > end) { out.push(cur); cur += step; }
  return out; // arrays are iterable; size is out.length
}

function optimal(start, end, step = 1) {
  validate(step);
  return {
    [Symbol.iterator]() {
      let cur = start; // fresh cursor per iteration -> re-iterable
      return {
        next() {
          if (step > 0 ? cur < end : cur > end) {
            const value = cur;
            cur += step;
            return { value, done: false };
          }
          return { value: undefined, done: true };
        },
        [Symbol.iterator]() { return this; },
      };
    },
    size() {
      return Math.max(0, Math.ceil((end - start) / step));
    },
  };
}

// ---------- tests ----------
const assert = require('assert');
const cases = [[0, 5, 1, [0, 1, 2, 3, 4]], [1, 10, 3, [1, 4, 7]], [5, 0, -2, [5, 3, 1]], [3, 3, 1, []], [0, 5, -1, []]];
for (const [s, e, st, want] of cases) {
  assert.deepStrictEqual(bruteForce(s, e, st), want);
  const r = optimal(s, e, st);
  assert.deepStrictEqual([...r], want);
  assert.deepStrictEqual([...r], want, 're-iterable');
  assert.strictEqual(r.size(), want.length);
}
assert.throws(() => optimal(0, 1, 0), RangeError);
assert.throws(() => bruteForce(0, 1, 0), RangeError);
// lazy: infinite range is fine if we stop
const taken = [];
for (const x of optimal(10, Infinity, 5)) { if (taken.length === 3) break; taken.push(x); }
assert.deepStrictEqual(taken, [10, 15, 20]);
// works with destructuring and Set
const [first, second] = optimal(7, 100);
assert.deepStrictEqual([first, second], [7, 8]);
assert.strictEqual(new Set(optimal(0, 10, 2)).size, 5);

function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(8);
for (let t = 0; t < 500; t++) {
  const s = Math.floor(rand() * 40) - 20, e = Math.floor(rand() * 40) - 20;
  let st = Math.floor(rand() * 11) - 5; if (st === 0) st = 1;
  const want = bruteForce(s, e, st);
  const r = optimal(s, e, st);
  assert.deepStrictEqual([...r], want);
  assert.strictEqual(r.size(), want.length);
}
console.log('✓ 08_range_iterable passed');

module.exports = { optimal, bruteForce };

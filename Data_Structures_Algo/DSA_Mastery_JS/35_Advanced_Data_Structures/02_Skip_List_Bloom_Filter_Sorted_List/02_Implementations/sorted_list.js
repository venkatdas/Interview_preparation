/**
 * SortedList: a TreeMap / TreeSet substitute for JavaScript.
 *
 * JS has no built-in ordered map. The simplest practical substitute is a plain array that
 * we keep SORTED and search with binary search ("bisect"):
 *   search / floor / ceiling / rank   O(log n)
 *   add / remove                      O(log n) search + O(n) splice (memmove, very fast in practice)
 * For up to ~10^5 elements this beats hand-written balanced trees in real interviews and
 * is what most people write for "sorted window" problems in JS.
 *
 * API (all values compared with `compare`, default numeric ascending):
 *   add(x)            insert (duplicates allowed, kept together)
 *   remove(x)         remove ONE occurrence, returns true/false
 *   has(x)
 *   bisectLeft(x)     first index i with list[i] >= x   (number of elements < x)
 *   bisectRight(x)    first index i with list[i] >  x   (number of elements <= x)
 *   floor(x)          largest element <= x, or undefined
 *   ceiling(x)        smallest element >= x, or undefined
 *   lower(x)          largest element <  x
 *   higher(x)         smallest element > x
 *   at(i)             i-th smallest (0-indexed); negative i counts from the end
 *   indexOf(x)        index of first occurrence or -1
 *   countBetween(lo, hi)  number of elements with lo <= x <= hi
 *   size, length, toArray(), min(), max()
 */

class SortedList {
  constructor(iterable = [], compare = (a, b) => a - b) {
    this.compare = compare;
    this.items = [...iterable].sort(compare);
  }

  get length() {
    return this.items.length;
  }

  get size() {
    return this.items.length;
  }

  bisectLeft(x) {
    let lo = 0;
    let hi = this.items.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.compare(this.items[mid], x) < 0) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  bisectRight(x) {
    let lo = 0;
    let hi = this.items.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.compare(this.items[mid], x) <= 0) lo = mid + 1;
      else hi = mid;
    }
    return lo;
  }

  add(x) {
    this.items.splice(this.bisectRight(x), 0, x);   // after equal elements: stable
    return this;
  }

  remove(x) {
    const i = this.bisectLeft(x);
    if (i < this.items.length && this.compare(this.items[i], x) === 0) {
      this.items.splice(i, 1);
      return true;
    }
    return false;
  }

  has(x) {
    const i = this.bisectLeft(x);
    return i < this.items.length && this.compare(this.items[i], x) === 0;
  }

  indexOf(x) {
    return this.has(x) ? this.bisectLeft(x) : -1;
  }

  at(i) {
    if (i < 0) i += this.items.length;
    return this.items[i];
  }

  floor(x) {
    const i = this.bisectRight(x) - 1;
    return i >= 0 ? this.items[i] : undefined;
  }

  ceiling(x) {
    const i = this.bisectLeft(x);
    return i < this.items.length ? this.items[i] : undefined;
  }

  lower(x) {
    const i = this.bisectLeft(x) - 1;
    return i >= 0 ? this.items[i] : undefined;
  }

  higher(x) {
    const i = this.bisectRight(x);
    return i < this.items.length ? this.items[i] : undefined;
  }

  countBetween(lo, hi) {
    return Math.max(0, this.bisectRight(hi) - this.bisectLeft(lo));
  }

  min() {
    return this.items[0];
  }

  max() {
    return this.items[this.items.length - 1];
  }

  toArray() {
    return this.items.slice();
  }

  [Symbol.iterator]() {
    return this.items[Symbol.iterator]();
  }
}

// ---------- self-test ----------
const assert = require('assert');

function randomInt(lo, hi) {
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}

// Reference: an unsorted array that is sorted from scratch for every question.
for (let trial = 0; trial < 50; trial++) {
  const list = new SortedList();
  const ref = [];
  for (let op = 0; op < 200; op++) {
    const x = randomInt(-10, 10);
    const r = Math.random();
    if (r < 0.45) {
      list.add(x);
      ref.push(x);
    } else if (r < 0.65) {
      const i = ref.indexOf(x);
      const expected = i !== -1;
      if (expected) ref.splice(i, 1);
      assert.strictEqual(list.remove(x), expected);
    } else {
      const sorted = ref.slice().sort((a, b) => a - b);
      assert.deepStrictEqual(list.toArray(), sorted);
      assert.strictEqual(list.bisectLeft(x), sorted.filter((v) => v < x).length);
      assert.strictEqual(list.bisectRight(x), sorted.filter((v) => v <= x).length);
      assert.strictEqual(list.has(x), sorted.includes(x));
      const le = sorted.filter((v) => v <= x);
      const ge = sorted.filter((v) => v >= x);
      assert.strictEqual(list.floor(x), le.length ? le[le.length - 1] : undefined);
      assert.strictEqual(list.ceiling(x), ge.length ? ge[0] : undefined);
      const lt = sorted.filter((v) => v < x);
      const gt = sorted.filter((v) => v > x);
      assert.strictEqual(list.lower(x), lt.length ? lt[lt.length - 1] : undefined);
      assert.strictEqual(list.higher(x), gt.length ? gt[0] : undefined);
      const hi = x + randomInt(0, 5);
      assert.strictEqual(list.countBetween(x, hi), sorted.filter((v) => v >= x && v <= hi).length);
      if (sorted.length) {
        assert.strictEqual(list.at(-1), sorted[sorted.length - 1]);
        assert.strictEqual(list.min(), sorted[0]);
      }
    }
  }
}

// custom comparator: intervals sorted by start
const byStart = new SortedList([[5, 6], [1, 2]], (a, b) => a[0] - b[0]);
byStart.add([3, 4]);
assert.deepStrictEqual(byStart.toArray(), [[1, 2], [3, 4], [5, 6]]);
assert.deepStrictEqual(byStart.floor([4, 0]), [3, 4]);

console.log('✓ sorted-list.js self-test passed');

module.exports = { SortedList };

/**
 * Segment Tree implementations in JavaScript.
 *
 * 1. SegmentTree          - recursive, top-down (easiest to reason about, easiest to extend)
 * 2. IterativeSegmentTree - bottom-up, array of size 2n (shortest code, fastest in practice)
 * 3. LazySegmentTree      - range ADD + range SUM with lazy propagation (range updates)
 *
 * All three take a `merge(a, b)` function and an `identity` value so the same
 * class answers sum / min / max / gcd questions:
 *   sum: merge = (a, b) => a + b,            identity = 0
 *   min: merge = Math.min,                   identity = Infinity
 *   max: merge = Math.max,                   identity = -Infinity
 *
 * Complexity: build O(n), point update O(log n), range query O(log n), space O(n).
 * Ranges in this file are CLOSED on both ends: query(l, r) covers indices l..r inclusive.
 */

// ---------- 1. Recursive segment tree ----------
// Node i covers [lo, hi]. Its children are 2i+1 (left half) and 2i+2 (right half).
// We allocate 4n slots: that is always enough for any n (not just powers of two).
class SegmentTree {
  constructor(values, merge = (a, b) => a + b, identity = 0) {
    this.n = values.length;
    this.merge = merge;
    this.identity = identity;
    this.tree = new Array(4 * Math.max(1, this.n)).fill(identity);
    if (this.n > 0) this.#build(0, 0, this.n - 1, values);
  }

  #build(node, lo, hi, values) {
    if (lo === hi) {            // leaf: holds one array element
      this.tree[node] = values[lo];
      return;
    }
    const mid = (lo + hi) >> 1;
    this.#build(2 * node + 1, lo, mid, values);
    this.#build(2 * node + 2, mid + 1, hi, values);
    this.tree[node] = this.merge(this.tree[2 * node + 1], this.tree[2 * node + 2]);
  }

  // set values[index] = value, then fix every ancestor on the way back up
  update(index, value) {
    this.#update(0, 0, this.n - 1, index, value);
  }

  #update(node, lo, hi, index, value) {
    if (lo === hi) {
      this.tree[node] = value;
      return;
    }
    const mid = (lo + hi) >> 1;
    if (index <= mid) this.#update(2 * node + 1, lo, mid, index, value);
    else this.#update(2 * node + 2, mid + 1, hi, index, value);
    this.tree[node] = this.merge(this.tree[2 * node + 1], this.tree[2 * node + 2]);
  }

  // merge of values[l..r] (inclusive)
  query(l, r) {
    if (l > r) return this.identity;
    return this.#query(0, 0, this.n - 1, l, r);
  }

  #query(node, lo, hi, l, r) {
    if (r < lo || hi < l) return this.identity;       // no overlap: contributes nothing
    if (l <= lo && hi <= r) return this.tree[node];   // fully inside: use the stored answer
    const mid = (lo + hi) >> 1;                       // partial overlap: ask both children
    return this.merge(
      this.#query(2 * node + 1, lo, mid, l, r),
      this.#query(2 * node + 2, mid + 1, hi, l, r)
    );
  }
}

// ---------- 2. Iterative (bottom-up) segment tree ----------
// Leaves live at tree[n .. 2n-1]; node i's parent is i >> 1 (i / 2).
// Works for ANY n (no padding to a power of two needed) because we only ever
// combine nodes that sit inside the query range, in the right order.
class IterativeSegmentTree {
  constructor(values, merge = (a, b) => a + b, identity = 0) {
    this.n = values.length;
    this.merge = merge;
    this.identity = identity;
    this.tree = new Array(2 * this.n).fill(identity);
    for (let i = 0; i < this.n; i++) this.tree[this.n + i] = values[i];
    // parents are built from the last internal node down to 1
    for (let i = this.n - 1; i >= 1; i--) {
      this.tree[i] = merge(this.tree[2 * i], this.tree[2 * i + 1]);
    }
  }

  update(index, value) {
    let i = index + this.n;
    this.tree[i] = value;
    while (i > 1) {
      i >>= 1;                      // go to parent
      this.tree[i] = this.merge(this.tree[2 * i], this.tree[2 * i + 1]);
    }
  }

  // merge of values[l..r] inclusive. We walk two pointers upward; whenever a
  // pointer is a RIGHT child (odd index on the left side) or a LEFT child (on the
  // right side) its sibling is outside the range, so we consume it and step over.
  query(l, r) {
    let resLeft = this.identity;   // accumulates pieces from the left side (in order)
    let resRight = this.identity;  // accumulates pieces from the right side (in order)
    let lo = l + this.n;
    let hi = r + this.n + 1;       // make the range half-open [lo, hi)
    while (lo < hi) {
      if (lo & 1) resLeft = this.merge(resLeft, this.tree[lo++]);  // lo is a right child
      if (hi & 1) resRight = this.merge(this.tree[--hi], resRight); // hi-1 is a left child
      lo >>= 1;
      hi >>= 1;
    }
    return this.merge(resLeft, resRight);
  }
}

// ---------- 3. Lazy segment tree: range ADD, range SUM ----------
// Each node stores the sum of its range plus a `lazy` tag = "every element in my
// range still needs +lazy added, but I have not told my children yet".
//
// For a range ASSIGN (set everything to v) you would store the pending value plus
// a boolean "hasPending", and a node's sum under assign becomes v * (hi - lo + 1).
// For range-add + range-MAX, the node value becomes max + lazy (no multiplication).
class LazySegmentTree {
  constructor(values) {
    this.n = values.length;
    const size = 4 * Math.max(1, this.n);
    this.sum = new Array(size).fill(0);
    this.lazy = new Array(size).fill(0);
    if (this.n > 0) this.#build(0, 0, this.n - 1, values);
  }

  #build(node, lo, hi, values) {
    if (lo === hi) {
      this.sum[node] = values[lo];
      return;
    }
    const mid = (lo + hi) >> 1;
    this.#build(2 * node + 1, lo, mid, values);
    this.#build(2 * node + 2, mid + 1, hi, values);
    this.sum[node] = this.sum[2 * node + 1] + this.sum[2 * node + 2];
  }

  // apply a pending +delta to a node that covers (hi - lo + 1) elements
  #apply(node, lo, hi, delta) {
    this.sum[node] += delta * (hi - lo + 1);
    this.lazy[node] += delta;     // children still owe this delta
  }

  // push the pending tag of `node` down to its two children
  #pushDown(node, lo, hi) {
    if (this.lazy[node] === 0) return;
    const mid = (lo + hi) >> 1;
    this.#apply(2 * node + 1, lo, mid, this.lazy[node]);
    this.#apply(2 * node + 2, mid + 1, hi, this.lazy[node]);
    this.lazy[node] = 0;
  }

  // add delta to every element in [l, r]
  rangeAdd(l, r, delta) {
    this.#rangeAdd(0, 0, this.n - 1, l, r, delta);
  }

  #rangeAdd(node, lo, hi, l, r, delta) {
    if (r < lo || hi < l) return;
    if (l <= lo && hi <= r) {           // fully covered: tag it and stop (that's the laziness)
      this.#apply(node, lo, hi, delta);
      return;
    }
    this.#pushDown(node, lo, hi);       // must push before touching children
    const mid = (lo + hi) >> 1;
    this.#rangeAdd(2 * node + 1, lo, mid, l, r, delta);
    this.#rangeAdd(2 * node + 2, mid + 1, hi, l, r, delta);
    this.sum[node] = this.sum[2 * node + 1] + this.sum[2 * node + 2];
  }

  // sum of [l, r]
  rangeSum(l, r) {
    return this.#rangeSum(0, 0, this.n - 1, l, r);
  }

  #rangeSum(node, lo, hi, l, r) {
    if (r < lo || hi < l) return 0;
    if (l <= lo && hi <= r) return this.sum[node];
    this.#pushDown(node, lo, hi);
    const mid = (lo + hi) >> 1;
    return this.#rangeSum(2 * node + 1, lo, mid, l, r) +
           this.#rangeSum(2 * node + 2, mid + 1, hi, l, r);
  }
}

// ---------- self-test ----------
const assert = require('assert');

function randomInt(lo, hi) {
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}

// brute-force reference: a plain array and a loop
function bruteQuery(arr, l, r, merge, identity) {
  let result = identity;
  for (let i = l; i <= r; i++) result = merge(result, arr[i]);
  return result;
}

// 1 & 2: random point updates + range queries, for sum, min and max, many sizes
const variants = [
  { merge: (a, b) => a + b, identity: 0, name: 'sum' },
  { merge: Math.min, identity: Infinity, name: 'min' },
  { merge: Math.max, identity: -Infinity, name: 'max' },
];
for (const { merge, identity } of variants) {
  for (let trial = 0; trial < 30; trial++) {
    const n = randomInt(1, 40);                          // includes non-powers of two
    const arr = Array.from({ length: n }, () => randomInt(-50, 50));
    const rec = new SegmentTree(arr, merge, identity);
    const it = new IterativeSegmentTree(arr, merge, identity);
    for (let op = 0; op < 100; op++) {
      if (Math.random() < 0.4) {
        const i = randomInt(0, n - 1);
        const v = randomInt(-50, 50);
        arr[i] = v;
        rec.update(i, v);
        it.update(i, v);
      } else {
        const l = randomInt(0, n - 1);
        const r = randomInt(l, n - 1);
        const expected = bruteQuery(arr, l, r, merge, identity);
        assert.strictEqual(rec.query(l, r), expected);
        assert.strictEqual(it.query(l, r), expected);
      }
    }
  }
}

// fixed sanity checks
const st = new SegmentTree([1, 3, 5, 7, 9, 11]);
assert.strictEqual(st.query(0, 5), 36);
assert.strictEqual(st.query(1, 3), 15);
st.update(1, 10);
assert.strictEqual(st.query(0, 2), 16);
assert.strictEqual(st.query(3, 2), 0);          // empty range -> identity
assert.strictEqual(new SegmentTree([], Math.min, Infinity).query(0, -1), Infinity);

// 3: lazy tree vs brute force under random range adds and range sums
for (let trial = 0; trial < 30; trial++) {
  const n = randomInt(1, 40);
  const arr = Array.from({ length: n }, () => randomInt(-20, 20));
  const lazy = new LazySegmentTree(arr);
  for (let op = 0; op < 100; op++) {
    const l = randomInt(0, n - 1);
    const r = randomInt(l, n - 1);
    if (Math.random() < 0.5) {
      const delta = randomInt(-10, 10);
      for (let i = l; i <= r; i++) arr[i] += delta;
      lazy.rangeAdd(l, r, delta);
    } else {
      assert.strictEqual(lazy.rangeSum(l, r), bruteQuery(arr, l, r, (a, b) => a + b, 0));
    }
  }
}

console.log('✓ segment-tree.js self-test passed');

module.exports = { SegmentTree, IterativeSegmentTree, LazySegmentTree };

/**
 * Union-Find (Disjoint Set Union, DSU) - advanced variants in JavaScript.
 *
 * 1. UnionFind          - the standard one: path compression + union by size, component count
 * 2. UnionFindRollback  - union by size ONLY (no path compression) + a history stack so
 *                         unions can be undone in reverse order. Used for offline dynamic
 *                         connectivity / "try an edge, then undo it" searches.
 *                         No path compression because compression rewrites many parent
 *                         pointers at once, which would make exact undo expensive; union by
 *                         size alone still guarantees O(log n) per find.
 * 3. WeightedUnionFind  - every node stores a weight to its parent: value[x] = weight * value[parent].
 *                         find() accumulates the product along the path (and compresses).
 *                         union(a, b, ratio) records "a / b = ratio". Used by Evaluate Division.
 *                         (Additive version: replace * with + and / with -, used for
 *                         "a - b = d" relations; see comment in the class.)
 * 4. MapUnionFind       - keys are arbitrary strings/ids held in Maps; unknown keys are auto-added.
 */

// ---------- 1. Standard union-find ----------
class UnionFind {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.size = new Array(n).fill(1);
    this.count = n;                   // number of components
  }

  find(x) {
    // iterative path compression: point every node on the path straight at the root
    let root = x;
    while (this.parent[root] !== root) root = this.parent[root];
    while (this.parent[x] !== root) {
      const next = this.parent[x];
      this.parent[x] = root;
      x = next;
    }
    return root;
  }

  union(a, b) {
    let ra = this.find(a);
    let rb = this.find(b);
    if (ra === rb) return false;
    if (this.size[ra] < this.size[rb]) [ra, rb] = [rb, ra];  // attach smaller under larger
    this.parent[rb] = ra;
    this.size[ra] += this.size[rb];
    this.count--;
    return true;
  }

  connected(a, b) {
    return this.find(a) === this.find(b);
  }
}

// ---------- 2. Union-find with rollback ----------
class UnionFindRollback {
  constructor(n) {
    this.parent = Array.from({ length: n }, (_, i) => i);
    this.size = new Array(n).fill(1);
    this.count = n;
    this.history = [];               // stack of { child, parent } for real merges, or null for no-ops
  }

  find(x) {
    while (this.parent[x] !== x) x = this.parent[x];   // NO compression
    return x;
  }

  union(a, b) {
    let ra = this.find(a);
    let rb = this.find(b);
    if (ra === rb) {
      this.history.push(null);       // still push, so every union has exactly one rollback
      return false;
    }
    if (this.size[ra] < this.size[rb]) [ra, rb] = [rb, ra];
    this.parent[rb] = ra;
    this.size[ra] += this.size[rb];
    this.count--;
    this.history.push({ child: rb, parent: ra });
    return true;
  }

  // undo the most recent union
  rollback() {
    const last = this.history.pop();
    if (!last) return;
    this.parent[last.child] = last.child;
    this.size[last.parent] -= this.size[last.child];
    this.count++;
  }

  // a checkpoint is just the history length; rollbackTo undoes everything after it
  snapshot() {
    return this.history.length;
  }

  rollbackTo(snapshot) {
    while (this.history.length > snapshot) this.rollback();
  }

  connected(a, b) {
    return this.find(a) === this.find(b);
  }
}

// ---------- 3. Weighted union-find (multiplicative) ----------
// Invariant: value[x] = weight[x] * value[parent[x]].
// So after find(x) with compression, weight[x] = value[x] / value[root].
class WeightedUnionFind {
  constructor() {
    this.parent = new Map();
    this.weight = new Map();        // weight to parent
  }

  add(x) {
    if (!this.parent.has(x)) {
      this.parent.set(x, x);
      this.weight.set(x, 1);
    }
  }

  has(x) {
    return this.parent.has(x);
  }

  // returns the root; afterwards weight[x] = value[x] / value[root]
  find(x) {
    if (this.parent.get(x) === x) return x;
    const p = this.parent.get(x);
    const root = this.find(p);                              // compresses p first
    // x -> p has weight w(x), p -> root now has weight w(p): x -> root = w(x) * w(p)
    this.weight.set(x, this.weight.get(x) * this.weight.get(p));
    this.parent.set(x, root);
    return root;
  }

  // record a / b = ratio   (so value[a] = ratio * value[b])
  union(a, b, ratio) {
    this.add(a);
    this.add(b);
    const ra = this.find(a);
    const rb = this.find(b);
    if (ra === rb) return;
    // value[a] = w(a) * value[ra],  value[b] = w(b) * value[rb],  value[a] = ratio * value[b]
    // attach ra under rb:  value[ra] = (ratio * w(b) / w(a)) * value[rb]
    this.parent.set(ra, rb);
    this.weight.set(ra, (ratio * this.weight.get(b)) / this.weight.get(a));
  }

  // a / b, or null if not connected / unknown
  query(a, b) {
    if (!this.has(a) || !this.has(b)) return null;
    if (this.find(a) !== this.find(b)) return null;
    return this.weight.get(a) / this.weight.get(b);
  }
  // Additive variant ("a - b = d"): weight starts at 0, find does w(x) += w(p),
  // union sets w(ra) = d + w(b) - w(a), and query returns w(a) - w(b).
}

// ---------- 4. Union-find over arbitrary keys ----------
class MapUnionFind {
  constructor() {
    this.parent = new Map();
    this.size = new Map();
  }

  add(key) {
    if (!this.parent.has(key)) {
      this.parent.set(key, key);
      this.size.set(key, 1);
    }
  }

  find(key) {
    this.add(key);
    let root = key;
    while (this.parent.get(root) !== root) root = this.parent.get(root);
    while (this.parent.get(key) !== root) {
      const next = this.parent.get(key);
      this.parent.set(key, root);
      key = next;
    }
    return root;
  }

  union(a, b) {
    let ra = this.find(a);
    let rb = this.find(b);
    if (ra === rb) return false;
    if (this.size.get(ra) < this.size.get(rb)) [ra, rb] = [rb, ra];
    this.parent.set(rb, ra);
    this.size.set(ra, this.size.get(ra) + this.size.get(rb));
    return true;
  }

  connected(a, b) {
    return this.find(a) === this.find(b);
  }
}

// ---------- self-test ----------
const assert = require('assert');

function randomInt(lo, hi) {
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}

// Naive reference: component label per node; union relabels with a loop. O(n) per union.
class NaiveComponents {
  constructor(n) {
    this.label = Array.from({ length: n }, (_, i) => i);
  }
  union(a, b) {
    const la = this.label[a];
    const lb = this.label[b];
    if (la === lb) return false;
    for (let i = 0; i < this.label.length; i++) if (this.label[i] === lb) this.label[i] = la;
    return true;
  }
  connected(a, b) {
    return this.label[a] === this.label[b];
  }
  count() {
    return new Set(this.label).size;
  }
}

// 1. standard vs naive
for (let trial = 0; trial < 30; trial++) {
  const n = randomInt(1, 25);
  const uf = new UnionFind(n);
  const naive = new NaiveComponents(n);
  for (let op = 0; op < 80; op++) {
    const a = randomInt(0, n - 1);
    const b = randomInt(0, n - 1);
    if (Math.random() < 0.5) assert.strictEqual(uf.union(a, b), naive.union(a, b));
    else assert.strictEqual(uf.connected(a, b), naive.connected(a, b));
    assert.strictEqual(uf.count, naive.count());
  }
}

// 2. rollback: apply a random batch, snapshot, apply more, rollback, compare to a fresh copy
for (let trial = 0; trial < 30; trial++) {
  const n = randomInt(1, 20);
  const uf = new UnionFindRollback(n);
  const naive = new NaiveComponents(n);
  for (let op = 0; op < 20; op++) {
    const a = randomInt(0, n - 1), b = randomInt(0, n - 1);
    uf.union(a, b);
    naive.union(a, b);
  }
  const snap = uf.snapshot();
  const countBefore = uf.count;
  for (let op = 0; op < 20; op++) uf.union(randomInt(0, n - 1), randomInt(0, n - 1));
  uf.rollbackTo(snap);
  assert.strictEqual(uf.count, countBefore);
  for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) {
    assert.strictEqual(uf.connected(a, b), naive.connected(a, b));
  }
}

// 3. weighted: a/b = 2, b/c = 3 -> a/c = 6, c/a = 1/6
const w = new WeightedUnionFind();
w.union('a', 'b', 2);
w.union('b', 'c', 3);
assert.strictEqual(w.query('a', 'c'), 6);
assert.strictEqual(w.query('c', 'a'), 1 / 6);
assert.strictEqual(w.query('a', 'a'), 1);
assert.strictEqual(w.query('a', 'x'), null);
w.union('x', 'y', 5);
assert.strictEqual(w.query('a', 'x'), null);       // different components
w.union('y', 'c', 0.5);                            // y = 0.5 c -> x = 2.5 c -> a = 6c -> a/x = 2.4
assert.ok(Math.abs(w.query('a', 'x') - 2.4) < 1e-9);
// random weighted check: assign hidden values, give random ratios, verify every query
for (let trial = 0; trial < 30; trial++) {
  const n = randomInt(2, 8);
  const hidden = Array.from({ length: n }, () => randomInt(1, 9));
  const wuf = new WeightedUnionFind();
  const naive = new NaiveComponents(n);
  for (let i = 0; i < n; i++) wuf.add(i);        // every node is known, even if never unioned
  for (let op = 0; op < 10; op++) {
    const a = randomInt(0, n - 1), b = randomInt(0, n - 1);
    wuf.union(a, b, hidden[a] / hidden[b]);
    naive.union(a, b);
  }
  for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) {
    const expected = naive.connected(a, b) ? hidden[a] / hidden[b] : null;
    const got = wuf.query(a, b);
    if (expected === null) assert.strictEqual(got, null);
    else assert.ok(Math.abs(got - expected) < 1e-9);
  }
}

// 4. map-based
const m = new MapUnionFind();
m.union('alice', 'bob');
m.union('carol', 'dave');
assert.strictEqual(m.connected('alice', 'bob'), true);
assert.strictEqual(m.connected('alice', 'carol'), false);
m.union('bob', 'dave');
assert.strictEqual(m.connected('alice', 'carol'), true);
assert.strictEqual(m.connected('alice', 'zed'), false);   // unknown key auto-added as singleton

console.log('✓ union-find.js self-test passed');

module.exports = { UnionFind, UnionFindRollback, WeightedUnionFind, MapUnionFind };

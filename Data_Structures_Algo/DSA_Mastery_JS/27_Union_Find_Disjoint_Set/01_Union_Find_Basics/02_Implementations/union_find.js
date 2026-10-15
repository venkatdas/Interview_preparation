/**
 * Union-Find (Disjoint Set Union, DSU) in JavaScript.
 *
 * 1. UnionFind          - find with path compression + union by size.
 *                         Tracks the number of sets and the size of each set.
 * 2. UnionFindMap       - same idea for arbitrary keys (strings, objects) via a Map.
 *
 * Both find and union run in ~O(1) amortized (inverse Ackermann, alpha(n) <= 4 for any
 * realistic n). Space O(n).
 */

// ---------- 1. UnionFind over 0..n-1 ----------
class UnionFind {
  #parent;
  #size;
  #count;

  constructor(n) {
    this.#parent = Array.from({ length: n }, (_, i) => i); // everyone is their own root
    this.#size = new Array(n).fill(1);
    this.#count = n;                                       // number of disjoint sets
  }

  // Walk up to the root. On the way back, point every node DIRECTLY at the root
  // (path compression) so the next find is O(1).
  find(x) {
    if (this.#parent[x] !== x) {
      this.#parent[x] = this.find(this.#parent[x]);
    }
    return this.#parent[x];
  }

  // Iterative find (no recursion) - same result, safer for very deep chains.
  findIterative(x) {
    let root = x;
    while (this.#parent[root] !== root) root = this.#parent[root];
    while (this.#parent[x] !== root) {        // second pass: compress
      const next = this.#parent[x];
      this.#parent[x] = root;
      x = next;
    }
    return root;
  }

  // Merge the sets containing a and b. Returns false if they were already together
  // (that "false" is how you detect a cycle / redundant edge).
  union(a, b) {
    let rootA = this.find(a);
    let rootB = this.find(b);
    if (rootA === rootB) return false;
    // union by size: attach the SMALLER tree under the BIGGER root to keep trees shallow
    if (this.#size[rootA] < this.#size[rootB]) [rootA, rootB] = [rootB, rootA];
    this.#parent[rootB] = rootA;
    this.#size[rootA] += this.#size[rootB];
    this.#count--;
    return true;
  }

  connected(a, b) {
    return this.find(a) === this.find(b);
  }

  sizeOf(x) {
    return this.#size[this.find(x)];
  }

  count() {
    return this.#count;
  }
}

// ---------- 2. UnionFind over arbitrary keys ----------
class UnionFindMap {
  #parent = new Map();
  #size = new Map();
  #count = 0;

  add(key) {
    if (!this.#parent.has(key)) {
      this.#parent.set(key, key);
      this.#size.set(key, 1);
      this.#count++;
    }
    return this;
  }

  has(key) {
    return this.#parent.has(key);
  }

  find(key) {
    this.add(key);                                   // auto-register unknown keys
    const parent = this.#parent.get(key);
    if (parent !== key) this.#parent.set(key, this.find(parent));
    return this.#parent.get(key);
  }

  union(a, b) {
    let rootA = this.find(a);
    let rootB = this.find(b);
    if (rootA === rootB) return false;
    if (this.#size.get(rootA) < this.#size.get(rootB)) [rootA, rootB] = [rootB, rootA];
    this.#parent.set(rootB, rootA);
    this.#size.set(rootA, this.#size.get(rootA) + this.#size.get(rootB));
    this.#count--;
    return true;
  }

  connected(a, b) {
    return this.find(a) === this.find(b);
  }

  count() {
    return this.#count;
  }
}

// ---------- self-test ----------
// (runs only when this file is executed directly, not when required by a problem)
if (require.main === module) {
const assert = require('assert');

const uf = new UnionFind(6);
assert.strictEqual(uf.count(), 6);
assert.strictEqual(uf.union(0, 1), true);
assert.strictEqual(uf.union(1, 2), true);
assert.strictEqual(uf.union(0, 2), false);     // already connected -> cycle edge
assert.strictEqual(uf.count(), 4);
assert.strictEqual(uf.connected(0, 2), true);
assert.strictEqual(uf.connected(0, 3), false);
assert.strictEqual(uf.sizeOf(2), 3);
assert.strictEqual(uf.sizeOf(5), 1);
uf.union(3, 4);
uf.union(4, 5);
assert.strictEqual(uf.count(), 2);
assert.strictEqual(uf.findIterative(5), uf.find(3));
uf.union(2, 3);
assert.strictEqual(uf.count(), 1);
assert.strictEqual(uf.sizeOf(0), 6);

// path compression: after a long chain, every node points straight at the root
const chain = new UnionFind(5);
for (let i = 0; i < 4; i++) chain.union(i, i + 1);
const root = chain.find(4);
for (let i = 0; i < 5; i++) assert.strictEqual(chain.find(i), root);

const ufm = new UnionFindMap();
ufm.union('alice', 'bob');
ufm.union('carol', 'dave');
assert.strictEqual(ufm.count(), 2);
assert.strictEqual(ufm.connected('alice', 'bob'), true);
assert.strictEqual(ufm.connected('alice', 'dave'), false);
ufm.union('bob', 'dave');
assert.strictEqual(ufm.connected('alice', 'carol'), true);
assert.strictEqual(ufm.count(), 1);
assert.strictEqual(ufm.has('zed'), false);

console.log('✓ union-find.js self-test passed');
}

module.exports = { UnionFind, UnionFindMap };

// Tests for 27_Union_Find_Disjoint_Set/02_Advanced_Union_Find: UnionFind, UnionFindRollback,
// WeightedUnionFind and MapUnionFind from 02_Implementations/union_find.js, plus solution files.
// Note: in this module `count` is a PROPERTY (uf.count), not a method.
// Run: node --test 27_Union_Find_Disjoint_Set/02_Advanced_Union_Find/tests/advanced_union_find.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  UnionFind, UnionFindRollback, WeightedUnionFind, MapUnionFind,
} = require('../02_Implementations/union_find');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const randInt = (rand, lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));

// BFS component labels for the reference answer
function bfsLabels(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  const label = new Array(n).fill(-1);
  let c = 0;
  for (let s = 0; s < n; s++) {
    if (label[s] !== -1) continue;
    label[s] = c;
    const q = [s];
    for (let h = 0; h < q.length; h++) for (const w of adj[q[h]]) if (label[w] === -1) { label[w] = c; q.push(w); }
    c++;
  }
  return { label, count: c };
}

describe('UnionFind (iterative path compression)', () => {
  it('basic merges and the count property', () => {
    const uf = new UnionFind(5);
    assert.equal(uf.count, 5);
    assert.equal(uf.union(0, 1), true);
    assert.equal(uf.union(1, 0), false);
    uf.union(3, 4);
    assert.equal(uf.count, 3);
    assert.equal(uf.connected(0, 4), false);
    uf.union(1, 4);
    assert.equal(uf.connected(0, 3), true);
    assert.equal(uf.size[uf.find(0)], 4);
  });
  it('compresses: after find every node on the path points at the root', () => {
    const uf = new UnionFind(4);
    uf.parent = [0, 0, 1, 2];            // hand-built chain 3 -> 2 -> 1 -> 0
    assert.equal(uf.find(3), 0);
    assert.deepEqual(uf.parent, [0, 0, 0, 0]);
  });
  it('matches BFS components on random graphs', () => {
    const rand = mulberry32(1);
    for (let t = 0; t < 200; t++) {
      const n = randInt(rand, 1, 12);
      const uf = new UnionFind(n);
      const edges = [];
      for (let k = randInt(rand, 0, 15); k > 0; k--) {
        const e = [randInt(rand, 0, n - 1), randInt(rand, 0, n - 1)];
        edges.push(e); uf.union(...e);
      }
      const { label, count } = bfsLabels(n, edges);
      assert.equal(uf.count, count);
      for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) assert.equal(uf.connected(a, b), label[a] === label[b]);
    }
  });
});

describe('UnionFindRollback', () => {
  it('rollback undoes exactly one union, including no-op unions', () => {
    const uf = new UnionFindRollback(4);
    uf.union(0, 1);
    uf.union(1, 0);                       // no-op, still recorded
    assert.equal(uf.count, 3);
    uf.rollback();                        // undoes the no-op
    assert.equal(uf.connected(0, 1), true);
    uf.rollback();                        // undoes the real merge
    assert.equal(uf.connected(0, 1), false);
    assert.equal(uf.count, 4);
    assert.deepEqual(uf.size, [1, 1, 1, 1]);
  });
  it('rollback on an empty history does nothing', () => {
    const uf = new UnionFindRollback(2);
    uf.rollback();
    assert.equal(uf.count, 2);
  });
  it('does not compress paths (parent array unchanged by find)', () => {
    const uf = new UnionFindRollback(4);
    uf.union(0, 1); uf.union(2, 3); uf.union(0, 2);
    const before = [...uf.parent];
    uf.find(3);
    assert.deepEqual(uf.parent, before);
  });
  it('rollbackTo(snapshot) restores the exact earlier state (random)', () => {
    const rand = mulberry32(2);
    for (let t = 0; t < 200; t++) {
      const n = randInt(rand, 1, 12);
      const uf = new UnionFindRollback(n);
      const edges = [];
      for (let k = randInt(rand, 0, 10); k > 0; k--) {
        const e = [randInt(rand, 0, n - 1), randInt(rand, 0, n - 1)];
        edges.push(e); uf.union(...e);
      }
      const snap = uf.snapshot();
      const parentBefore = [...uf.parent], sizeBefore = [...uf.size], countBefore = uf.count;
      for (let k = randInt(rand, 0, 10); k > 0; k--) uf.union(randInt(rand, 0, n - 1), randInt(rand, 0, n - 1));
      uf.rollbackTo(snap);
      assert.deepEqual(uf.parent, parentBefore);
      assert.deepEqual(uf.size, sizeBefore);
      assert.equal(uf.count, countBefore);
      const { label } = bfsLabels(n, edges);
      for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) assert.equal(uf.connected(a, b), label[a] === label[b]);
    }
  });
});

describe('WeightedUnionFind', () => {
  it('derives a / c from a / b and b / c, in both directions', () => {
    const w = new WeightedUnionFind();
    w.union('a', 'b', 2);
    w.union('b', 'c', 3);
    assert.equal(w.query('a', 'c'), 6);
    assert.ok(Math.abs(w.query('c', 'a') - 1 / 6) < 1e-12);
    assert.equal(w.query('b', 'b'), 1);
  });
  it('returns null for unknown variables (even x / x) and for different components', () => {
    const w = new WeightedUnionFind();
    assert.equal(w.query('x', 'x'), null);
    w.union('a', 'b', 2); w.union('c', 'd', 4);
    assert.equal(w.query('a', 'd'), null);
    assert.equal(w.query('a', 'zzz'), null);
  });
  it('a redundant but consistent equation leaves answers unchanged', () => {
    const w = new WeightedUnionFind();
    w.union('a', 'b', 2); w.union('b', 'c', 5);
    w.union('a', 'c', 10);
    assert.equal(w.query('a', 'c'), 10);
  });
  it('matches hidden values on random equations (vs BFS connectivity)', () => {
    const rand = mulberry32(3);
    for (let t = 0; t < 200; t++) {
      const n = randInt(rand, 2, 9);
      const hidden = Array.from({ length: n }, () => randInt(rand, 1, 20));
      const w = new WeightedUnionFind();
      for (let i = 0; i < n; i++) w.add(i);
      const edges = [];
      for (let k = randInt(rand, 0, 10); k > 0; k--) {
        const a = randInt(rand, 0, n - 1), b = randInt(rand, 0, n - 1);
        w.union(a, b, hidden[a] / hidden[b]);
        edges.push([a, b]);
      }
      const { label } = bfsLabels(n, edges);
      for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) {
        const got = w.query(a, b);
        if (label[a] !== label[b]) assert.equal(got, null);
        else assert.ok(Math.abs(got - hidden[a] / hidden[b]) < 1e-9);
      }
    }
  });
});

describe('MapUnionFind', () => {
  it('works with string keys and auto-adds unknown keys', () => {
    const m = new MapUnionFind();
    m.union('x', 'y');
    assert.equal(m.connected('x', 'y'), true);
    assert.equal(m.connected('x', 'new'), false);
    assert.equal(m.parent.has('new'), true);
  });
  it('agrees with UnionFind on random operations', () => {
    const rand = mulberry32(4);
    for (let t = 0; t < 100; t++) {
      const n = randInt(rand, 1, 10);
      const a = new UnionFind(n), b = new MapUnionFind();
      for (let k = 0; k < 20; k++) {
        const u = randInt(rand, 0, n - 1), v = randInt(rand, 0, n - 1);
        assert.equal(b.union('k' + u, 'k' + v), a.union(u, v));
      }
    }
  });
});

describe('solution files', () => {
  const s01 = require('../03_Problems/solutions/01_satisfiability_of_equality_equations');
  const s02 = require('../03_Problems/solutions/02_lexicographically_smallest_equivalent_string');
  const s03 = require('../03_Problems/solutions/03_evaluate_division');
  const s04 = require('../03_Problems/solutions/04_number_of_islands_ii');

  it('01 equality equations: a!=a, inequality before equality, chains', () => {
    for (const f of [s01.optimal, s01.bruteForce]) {
      assert.equal(f(['a!=a']), false);
      assert.equal(f(['a!=c', 'a==b', 'b==c']), false);
      assert.equal(f(['a==b', 'c==d', 'a!=d']), true);
    }
  });
  it('02 smallest equivalent string: unrelated letters stay, transitive groups map to min', () => {
    for (const f of [s02.optimal, s02.bruteForce]) {
      assert.equal(f('ab', 'bc', 'cxa'), 'axa');
      assert.equal(f('z', 'z', 'zz'), 'zz');
    }
  });
  it('03 evaluate division: x/x unknown is -1, known x/x is 1', () => {
    for (const f of [s03.optimal, s03.bruteForce]) {
      const res = f([['a', 'b']], [4], [['a', 'b'], ['b', 'a'], ['x', 'x'], ['a', 'a'], ['a', 'x']]);
      assert.deepEqual(res, [4, 0.25, -1, 1, -1]);
    }
  });
  it('04 islands II: repeated position and merging three islands at once', () => {
    for (const f of [s04.optimal, s04.bruteForce]) {
      assert.deepEqual(f(3, 3, [[0, 1], [1, 0], [1, 2], [1, 2], [1, 1]]), [1, 2, 3, 3, 1]);
    }
  });
});

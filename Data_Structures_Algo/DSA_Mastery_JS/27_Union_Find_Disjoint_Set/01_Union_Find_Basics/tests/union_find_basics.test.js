// Tests for 27_Union_Find_Disjoint_Set/01_Union_Find_Basics: UnionFind and UnionFindMap
// from 02_Implementations/union_find.js, plus a few solution files on extra edge cases.
// Run: node --test 27_Union_Find_Disjoint_Set/01_Union_Find_Basics/tests/union_find_basics.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { UnionFind, UnionFindMap } = require('../02_Implementations/union_find');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Reference: label every node with its BFS component over the edges added so far.
function bfsComponents(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  const label = new Array(n).fill(-1);
  let count = 0;
  for (let s = 0; s < n; s++) {
    if (label[s] !== -1) continue;
    const queue = [s];
    label[s] = count;
    for (let h = 0; h < queue.length; h++) {
      for (const w of adj[queue[h]]) if (label[w] === -1) { label[w] = count; queue.push(w); }
    }
    count++;
  }
  return { label, count };
}

describe('UnionFind', () => {
  it('starts with n singleton sets', () => {
    const uf = new UnionFind(4);
    assert.equal(uf.count(), 4);
    for (let i = 0; i < 4; i++) {
      assert.equal(uf.find(i), i);
      assert.equal(uf.sizeOf(i), 1);
    }
  });
  it('handles n = 0', () => {
    assert.equal(new UnionFind(0).count(), 0);
  });
  it('union merges, is transitive and tracks sizes', () => {
    const uf = new UnionFind(6);
    assert.equal(uf.union(0, 1), true);
    assert.equal(uf.union(2, 3), true);
    assert.equal(uf.union(1, 3), true);
    assert.equal(uf.connected(0, 2), true);
    assert.equal(uf.connected(0, 4), false);
    assert.equal(uf.sizeOf(3), 4);
    assert.equal(uf.count(), 3);
  });
  it('union returns false for a redundant edge (cycle) and for self-union', () => {
    const uf = new UnionFind(3);
    uf.union(0, 1); uf.union(1, 2);
    assert.equal(uf.union(2, 0), false);
    assert.equal(uf.union(1, 1), false);
    assert.equal(uf.count(), 1);
  });
  it('findIterative agrees with find, even on a long chain', () => {
    const n = 20000;
    const uf = new UnionFind(n);
    for (let i = 1; i < n; i++) uf.union(i - 1, i);
    const root = uf.findIterative(n - 1);
    assert.equal(uf.find(0), root);
    assert.equal(uf.sizeOf(12345), n);
  });
  it('matches BFS components on random graphs (incrementally)', () => {
    const rand = mulberry32(42);
    for (let t = 0; t < 200; t++) {
      const n = 1 + Math.floor(rand() * 12);
      const uf = new UnionFind(n);
      const edges = [];
      const m = Math.floor(rand() * 15);
      for (let k = 0; k < m; k++) {
        const u = Math.floor(rand() * n), v = Math.floor(rand() * n);
        const before = bfsComponents(n, edges);
        const merged = uf.union(u, v);
        assert.equal(merged, before.label[u] !== before.label[v]);
        edges.push([u, v]);
      }
      const { label, count } = bfsComponents(n, edges);
      assert.equal(uf.count(), count);
      for (let a = 0; a < n; a++) {
        assert.equal(uf.sizeOf(a), label.filter((x) => x === label[a]).length);
        for (let b = 0; b < n; b++) assert.equal(uf.connected(a, b), label[a] === label[b]);
      }
    }
  });
});

describe('UnionFindMap', () => {
  it('auto-registers string keys and counts sets', () => {
    const uf = new UnionFindMap();
    assert.equal(uf.count(), 0);
    uf.union('a@x.com', 'b@x.com');
    uf.add('c@x.com');
    assert.equal(uf.count(), 2);
    assert.equal(uf.connected('a@x.com', 'b@x.com'), true);
    assert.equal(uf.connected('a@x.com', 'c@x.com'), false);
  });
  it('add is idempotent and has() reports membership', () => {
    const uf = new UnionFindMap();
    uf.add('k').add('k');
    assert.equal(uf.count(), 1);
    assert.equal(uf.has('k'), true);
    assert.equal(uf.has('z'), false);
  });
  it('find on an unknown key creates a new singleton', () => {
    const uf = new UnionFindMap();
    assert.equal(uf.find('new'), 'new');
    assert.equal(uf.count(), 1);
  });
  it('keeps number keys and string keys apart (1 !== "1")', () => {
    const uf = new UnionFindMap();
    uf.add(1); uf.add('1');
    assert.equal(uf.connected(1, '1'), false);
    assert.equal(uf.count(), 2);
  });
  it('agrees with UnionFind on random operations', () => {
    const rand = mulberry32(99);
    for (let t = 0; t < 100; t++) {
      const n = 1 + Math.floor(rand() * 10);
      const a = new UnionFind(n), b = new UnionFindMap();
      for (let i = 0; i < n; i++) b.add('n' + i);
      for (let k = 0; k < 20; k++) {
        const u = Math.floor(rand() * n), v = Math.floor(rand() * n);
        assert.equal(b.union('n' + u, 'n' + v), a.union(u, v));
        assert.equal(b.count(), a.count());
      }
    }
  });
});

describe('solution files', () => {
  const s01 = require('../03_Problems/solutions/01_number_of_connected_components');
  const s02 = require('../03_Problems/solutions/02_graph_valid_tree');
  const s03 = require('../03_Problems/solutions/03_redundant_connection');
  const s07 = require('../03_Problems/solutions/07_most_stones_removed');
  const s10 = require('../03_Problems/solutions/10_number_of_islands_ii');

  it('01 connected components: isolated nodes, single node, all connected', () => {
    for (const f of [s01.optimal, s01.dfsVersion]) {
      assert.equal(f(5, []), 5);
      assert.equal(f(1, []), 1);
      assert.equal(f(3, [[0, 1], [1, 2], [2, 0]]), 1);
    }
  });
  it('02 graph valid tree: single node, forest, cycle', () => {
    for (const f of [s02.optimal, s02.dfsVersion]) {
      assert.equal(f(1, []), true);
      assert.equal(f(4, [[0, 1], [2, 3]]), false);
      assert.equal(f(3, [[0, 1], [1, 2], [2, 0]]), false);
      assert.equal(f(4, [[0, 1], [0, 2], [0, 3]]), true);
    }
  });
  it('03 redundant connection: returns the LAST edge that closes the cycle', () => {
    for (const f of [s03.optimal, s03.bruteForce]) {
      assert.deepEqual(f([[1, 2], [2, 3], [3, 1]]), [3, 1]);
      assert.deepEqual(f([[1, 2], [1, 3], [2, 3]]), [2, 3]);
    }
  });
  it('07 most stones removed: one stone, no shared lines, all in one row', () => {
    for (const f of [s07.optimal, s07.bruteForce]) {
      assert.equal(f([[0, 0]]), 0);
      assert.equal(f([[0, 0], [1, 1], [2, 2]]), 0);
      assert.equal(f([[0, 0], [0, 5], [0, 9]]), 2);
    }
  });
  it('10 number of islands II: duplicate positions do not change the count', () => {
    for (const f of [s10.optimal, s10.bruteForce]) {
      assert.deepEqual(f(2, 2, [[0, 0], [0, 0], [1, 1], [0, 1]]), [1, 1, 2, 1]);
      assert.deepEqual(f(1, 3, [[0, 0], [0, 2], [0, 1]]), [1, 2, 1]);
    }
  });
});

// Tests for 26_Topological_Sorting: the implementations in 02_Implementations/topological_sort.js
// plus a few solution files on extra edge cases.
// Run: node --test 26_Topological_Sorting/tests/topological_sorting.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  topoSortKahn, topoSortDfs, hasCycleDirected, longestPathInDag,
} = require('../02_Implementations/topological_sort');

// ---------- helpers ----------
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// valid = a permutation of 0..n-1 where every edge u -> v has u before v
function isValidTopoOrder(order, n, edges) {
  if (order.length !== n) return false;
  const pos = new Array(n).fill(-1);
  order.forEach((v, i) => { pos[v] = i; });
  if (pos.some((p) => p === -1)) return false;
  return edges.every(([u, v]) => pos[u] < pos[v]);
}

// brute-force cycle check: does any node reach itself? (DFS reachability from each node)
function bruteHasCycle(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) adj[u].push(v);
  for (let s = 0; s < n; s++) {
    const seen = new Array(n).fill(false);
    const stack = [...adj[s]];
    while (stack.length) {
      const x = stack.pop();
      if (x === s) return true;
      if (seen[x]) continue;
      seen[x] = true;
      stack.push(...adj[x]);
    }
  }
  return false;
}

// brute-force longest path (edges) by plain recursion; only for small DAGs
function bruteLongest(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) adj[u].push(v);
  const from = (v) => adj[v].reduce((best, w) => Math.max(best, 1 + from(w)), 0);
  let best = 0;
  for (let v = 0; v < n; v++) best = Math.max(best, from(v));
  return best;
}

// random DAG: pick a hidden permutation, only add edges forward in it
function randomDag(rand, n, m) {
  const perm = Array.from({ length: n }, (_, i) => i).sort(() => rand() - 0.5);
  const edges = [];
  for (let k = 0; k < m && n > 1; k++) {
    let i = Math.floor(rand() * n), j = Math.floor(rand() * n);
    if (i === j) continue;
    if (i > j) [i, j] = [j, i];
    edges.push([perm[i], perm[j]]);
  }
  return edges;
}

function randomDigraph(rand, n, m) {
  const edges = [];
  for (let k = 0; k < m; k++) edges.push([Math.floor(rand() * n), Math.floor(rand() * n)]);
  return edges;
}

// ---------- implementations ----------
describe('topoSortKahn', () => {
  it('orders a diamond DAG with an isolated node', () => {
    const edges = [[0, 1], [0, 2], [1, 3], [2, 3]];
    const order = topoSortKahn(5, edges);
    assert.ok(isValidTopoOrder(order, 5, edges));
    assert.deepEqual(order, [0, 4, 1, 2, 3]);   // FIFO queue -> deterministic
  });
  it('handles a graph with no nodes and a single node', () => {
    assert.deepEqual(topoSortKahn(0, []), []);
    assert.deepEqual(topoSortKahn(1, []), [0]);
  });
  it('returns every node when there are no edges (fully disconnected)', () => {
    assert.deepEqual(topoSortKahn(4, []), [0, 1, 2, 3]);
  });
  it('returns [] on a cycle, a self loop, and a cycle in only one component', () => {
    assert.deepEqual(topoSortKahn(3, [[0, 1], [1, 2], [2, 0]]), []);
    assert.deepEqual(topoSortKahn(1, [[0, 0]]), []);
    assert.deepEqual(topoSortKahn(5, [[0, 1], [2, 3], [3, 4], [4, 2]]), []);
  });
  it('tolerates duplicate edges', () => {
    const edges = [[0, 1], [0, 1], [1, 2]];
    assert.deepEqual(topoSortKahn(3, edges), [0, 1, 2]);
  });
  it('gives the only order of a chain', () => {
    assert.deepEqual(topoSortKahn(4, [[2, 3], [1, 2], [0, 1]]), [0, 1, 2, 3]);
  });
});

describe('topoSortDfs', () => {
  it('gives a valid order on a diamond DAG', () => {
    const edges = [[0, 1], [0, 2], [1, 3], [2, 3]];
    assert.ok(isValidTopoOrder(topoSortDfs(5, edges), 5, edges));
  });
  it('handles empty graph and isolated nodes', () => {
    assert.deepEqual(topoSortDfs(0, []), []);
    assert.equal(topoSortDfs(3, []).length, 3);
  });
  it('returns [] on cycles (including self loops)', () => {
    assert.deepEqual(topoSortDfs(3, [[0, 1], [1, 2], [2, 0]]), []);
    assert.deepEqual(topoSortDfs(2, [[1, 1]]), []);
  });
});

describe('hasCycleDirected', () => {
  it('does NOT report a diamond as a cycle (black node revisited)', () => {
    assert.equal(hasCycleDirected(4, [[0, 1], [0, 2], [1, 3], [2, 3]]), false);
  });
  it('finds a back edge, a self loop and a 2-cycle', () => {
    assert.equal(hasCycleDirected(3, [[0, 1], [1, 2], [2, 0]]), true);
    assert.equal(hasCycleDirected(1, [[0, 0]]), true);
    assert.equal(hasCycleDirected(2, [[0, 1], [1, 0]]), true);
  });
  it('finds a cycle in a later, disconnected component', () => {
    assert.equal(hasCycleDirected(6, [[0, 1], [3, 4], [4, 5], [5, 3]]), true);
  });
  it('is false for empty graphs', () => {
    assert.equal(hasCycleDirected(0, []), false);
    assert.equal(hasCycleDirected(3, []), false);
  });
});

describe('longestPathInDag', () => {
  it('counts edges on the longest path', () => {
    assert.equal(longestPathInDag(4, [[0, 1], [1, 2], [2, 3]]), 3);
    assert.equal(longestPathInDag(5, [[0, 1], [0, 2], [1, 3], [2, 3]]), 2);
  });
  it('is 0 with no edges and -1 on a cycle', () => {
    assert.equal(longestPathInDag(3, []), 0);
    assert.equal(longestPathInDag(3, [[0, 1], [1, 0]]), -1);
  });
});

describe('random comparison against brute force', () => {
  it('Kahn and DFS give valid orders on random DAGs; longest path matches brute force', () => {
    const rand = mulberry32(2026);
    for (let t = 0; t < 200; t++) {
      const n = 1 + Math.floor(rand() * 8);
      const edges = randomDag(rand, n, Math.floor(rand() * 14));
      assert.ok(isValidTopoOrder(topoSortKahn(n, edges), n, edges));
      assert.ok(isValidTopoOrder(topoSortDfs(n, edges), n, edges));
      assert.equal(hasCycleDirected(n, edges), false);
      assert.equal(longestPathInDag(n, edges), bruteLongest(n, edges));
    }
  });
  it('all three cycle detectors agree with brute-force reachability on random digraphs', () => {
    const rand = mulberry32(7);
    for (let t = 0; t < 300; t++) {
      const n = 1 + Math.floor(rand() * 7);
      const edges = randomDigraph(rand, n, Math.floor(rand() * 10));
      const expected = bruteHasCycle(n, edges);
      assert.equal(hasCycleDirected(n, edges), expected);
      assert.equal(topoSortKahn(n, edges).length === 0 && n > 0, expected);
      assert.equal(topoSortDfs(n, edges).length === 0 && n > 0, expected);
    }
  });
});

// ---------- solution files on extra edge cases ----------
describe('solution files', () => {
  const s01 = require('../03_Problems/solutions/01_course_schedule');
  const s02 = require('../03_Problems/solutions/02_course_schedule_ii');
  const s04 = require('../03_Problems/solutions/04_minimum_height_trees');
  const s05 = require('../03_Problems/solutions/05_parallel_courses');
  const s08 = require('../03_Problems/solutions/08_alien_dictionary');

  it('01 Course Schedule: no prerequisites, self prerequisite, long chain', () => {
    for (const f of [s01.optimal, s01.bruteForce]) {
      assert.equal(f(1, []), true);
      assert.equal(f(2, [[1, 1]]), false);
      assert.equal(f(3, [[1, 0], [2, 1]]), true);
      assert.equal(f(3, [[1, 0], [2, 1], [0, 2]]), false);
    }
  });
  it('02 Course Schedule II: order respects "[a, b] = b before a"; cycle gives []', () => {
    const prereqs = [[1, 0], [2, 0], [3, 1], [3, 2]];
    for (const f of [s02.optimal, s02.dfsVersion]) {
      const order = f(4, prereqs);
      assert.ok(isValidTopoOrder(order, 4, prereqs.map(([a, b]) => [b, a])));
      assert.deepEqual(f(2, [[0, 1], [1, 0]]), []);
      assert.deepEqual(f(1, []), [0]);
    }
  });
  it('04 Minimum Height Trees: single node, two nodes, path of 5', () => {
    const sorted = (a) => [...a].sort((x, y) => x - y);
    for (const f of [s04.optimal, s04.bruteForce]) {
      assert.deepEqual(sorted(f(1, [])), [0]);
      assert.deepEqual(sorted(f(2, [[0, 1]])), [0, 1]);
      assert.deepEqual(sorted(f(5, [[0, 1], [1, 2], [2, 3], [3, 4]])), [2]);
    }
  });
  it('05 Parallel Courses: independent courses take 1 semester; a cycle gives -1', () => {
    for (const f of [s05.optimal, s05.dfsVersion]) {
      assert.equal(f(3, []), 1);
      assert.equal(f(3, [[1, 2], [2, 3]]), 3);
      assert.equal(f(2, [[1, 2], [2, 1]]), -1);
    }
  });
  it('08 Alien Dictionary: single word, invalid prefix, contradiction', () => {
    for (const f of [s08.optimal, s08.dfsVersion]) {
      assert.equal([...f(['abc'])].sort().join(''), 'abc');
      assert.equal(f(['abc', 'ab']), '');
      assert.equal(f(['a', 'b', 'a']), '');
      assert.equal(f(['wrt', 'wrf', 'er', 'ett', 'rftt']), 'wertf');
    }
  });
});

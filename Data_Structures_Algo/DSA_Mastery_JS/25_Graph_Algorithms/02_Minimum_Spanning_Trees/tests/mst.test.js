const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { kruskal, prim } = require('../02_Implementations/mst');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Tiny independent DSU so the checks do not trust the code under test.
function components(n, edges) {
  const p = Array.from({ length: n }, (_, i) => i);
  const find = (x) => (p[x] === x ? x : (p[x] = find(p[x])));
  let count = n;
  for (const [u, v] of edges) {
    const a = find(u), b = find(v);
    if (a !== b) { p[a] = b; count--; }
  }
  return count;
}
// Brute force: try every subset of n - 1 edges, keep the cheapest one that is a tree.
function bruteMST(n, edges) {
  if (n === 1) return 0;
  let best = Infinity;
  const m = edges.length;
  for (let mask = 0; mask < 1 << m; mask++) {
    let bits = 0;
    for (let x = mask; x; x &= x - 1) bits++;
    if (bits !== n - 1) continue;
    const chosen = edges.filter((_, i) => mask & (1 << i));
    if (components(n, chosen) !== 1) continue;
    best = Math.min(best, chosen.reduce((s, e) => s + e[2], 0));
  }
  return best === Infinity ? -1 : best;
}
function assertIsSpanningTree(n, result) {
  assert.equal(result.edges.length, n - 1);
  assert.equal(components(n, result.edges), 1);
  assert.equal(result.edges.reduce((s, e) => s + e[2], 0), result.weight);
}

const sample = [[0, 1, 1], [0, 2, 4], [0, 3, 3], [1, 3, 2], [2, 3, 5]];

describe('kruskal', () => {
  it('normal case', () => {
    const r = kruskal(4, sample);
    assert.equal(r.weight, 7);
    assertIsSpanningTree(4, r);
  });
  it('does not mutate the input edge list', () => {
    const copy = sample.map((e) => [...e]);
    kruskal(4, sample);
    assert.deepEqual(sample, copy);
  });
  it('single node, no edges -> weight 0', () => {
    assert.deepEqual(kruskal(1, []), { weight: 0, edges: [] });
  });
  it('disconnected graph -> -1', () => {
    assert.deepEqual(kruskal(4, [[0, 1, 1], [2, 3, 1]]), { weight: -1, edges: [] });
    assert.deepEqual(kruskal(2, []), { weight: -1, edges: [] });
  });
  it('self loops and parallel edges are handled', () => {
    const r = kruskal(3, [[0, 0, -5], [0, 1, 9], [0, 1, 2], [1, 2, 3], [1, 2, 3]]);
    assert.equal(r.weight, 5);
    assertIsSpanningTree(3, r);
  });
  it('negative weights are fine for MST', () => {
    assert.equal(kruskal(3, [[0, 1, -4], [1, 2, -1], [0, 2, 2]]).weight, -5);
  });
});

describe('prim', () => {
  it('normal case', () => {
    const r = prim(4, sample);
    assert.equal(r.weight, 7);
    assertIsSpanningTree(4, r);
  });
  it('any start node gives the same weight', () => {
    for (let s = 0; s < 4; s++) assert.equal(prim(4, sample, s).weight, 7);
  });
  it('single node and disconnected graph', () => {
    assert.deepEqual(prim(1, []), { weight: 0, edges: [] });
    assert.deepEqual(prim(4, [[0, 1, 1], [2, 3, 1]]), { weight: -1, edges: [] });
  });
  it('ties: all equal weights -> n - 1 times the weight', () => {
    const edges = [[0, 1, 2], [1, 2, 2], [2, 3, 2], [3, 0, 2], [0, 2, 2]];
    assert.equal(prim(4, edges).weight, 6);
    assert.equal(kruskal(4, edges).weight, 6);
  });
});

describe('cross-check: Kruskal vs Prim vs brute force', () => {
  it('match brute force on small random graphs (incl. disconnected, ties, negatives)', () => {
    const rand = mulberry32(42);
    for (let t = 0; t < 200; t++) {
      const n = 1 + Math.floor(rand() * 5);
      const m = Math.floor(rand() * 9);
      const edges = [];
      for (let i = 0; i < m; i++) {
        edges.push([Math.floor(rand() * n), Math.floor(rand() * n), Math.floor(rand() * 7) - 2]);
      }
      const expected = bruteMST(n, edges);
      const k = kruskal(n, edges);
      const p = prim(n, edges);
      assert.equal(k.weight, expected);
      assert.equal(p.weight, expected);
      if (expected !== -1) { assertIsSpanningTree(n, k); assertIsSpanningTree(n, p); }
    }
  });
  it('Kruskal and Prim agree on larger dense random graphs', () => {
    const rand = mulberry32(7);
    for (let t = 0; t < 30; t++) {
      const n = 20 + Math.floor(rand() * 20);
      const edges = [];
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (rand() < 0.3) edges.push([i, j, Math.floor(rand() * 100)]);
      assert.equal(kruskal(n, edges).weight, prim(n, edges).weight);
    }
  });
});

describe('solution files: extra edge cases', () => {
  const basic = require('../03_Problems/solutions/01_minimum_spanning_tree_weight');
  const points = require('../03_Problems/solutions/02_min_cost_to_connect_all_points');
  const cities = require('../03_Problems/solutions/03_connecting_cities_with_minimum_cost');
  const water = require('../03_Problems/solutions/04_optimize_water_distribution');
  const critical = require('../03_Problems/solutions/05_critical_and_pseudo_critical_edges');

  it('MST weight basic: all three versions agree with the brute force here', () => {
    const rand = mulberry32(3);
    for (let t = 0; t < 50; t++) {
      const n = 1 + Math.floor(rand() * 4);
      const edges = Array.from({ length: Math.floor(rand() * 6) }, () => [Math.floor(rand() * n), Math.floor(rand() * n), Math.floor(rand() * 5)]);
      const expected = bruteMST(n, edges);
      assert.equal(basic.optimal(n, edges), expected);
      assert.equal(basic.primVersion(n, edges), expected);
    }
  });
  it('Min Cost to Connect All Points: single point, duplicate points, a line', () => {
    for (const f of [points.optimal, points.kruskalVersion]) {
      assert.equal(f([[5, 5]]), 0);
      assert.equal(f([[1, 1], [1, 1]]), 0);
      assert.equal(f([[0, 0], [0, 3], [0, 1]]), 3);
    }
  });
  it('Connecting Cities: disconnected -> -1, 1-indexed cities', () => {
    for (const f of [cities.optimal, cities.primVersion]) {
      assert.equal(f(3, [[1, 2, 5]]), -1);
      assert.equal(f(2, [[1, 2, 5], [1, 2, 1]]), 1);
    }
  });
  it('Water distribution: wells cheaper than any pipe', () => {
    for (const f of [water.optimal, water.bruteForce]) {
      assert.equal(f(2, [1, 1], [[1, 2, 10]]), 2);
      assert.equal(f(2, [1, 10], [[1, 2, 1]]), 2);
    }
  });
  it('Critical edges: a tree makes every edge critical', () => {
    for (const f of [critical.optimal, critical.bruteForce]) {
      assert.deepEqual(f(4, [[0, 1, 3], [1, 2, 1], [1, 3, 2]]), [[0, 1, 2], []]);
    }
  });
});

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  buildAdjacency, bfsDistances, treeDiameter, treeCenters, eulerTour, SubtreeSumQuery,
  sumOfDistances, centroidDecomposition, countPairsWithinDistance, HeavyLightDecomposition,
  areIsomorphic, binaryLiftingLCA,
} = require('../02_Implementations/tree_techniques');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(2024);
const ri = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const randomTree = n => Array.from({ length: n - 1 }, (_, i) => [i + 1, ri(0, i)]);
const allDist = (n, edges) => { const adj = buildAdjacency(n, edges); return Array.from({ length: n }, (_, s) => bfsDistances(adj, s).dist); };

// 0 - 1 - 2 - 3 ; 1 - 4 - 5
const E = [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5]];

describe('tree diameter and centers', () => {
  it('handles a normal tree', () => {
    assert.equal(treeDiameter(6, E).length, 4);
    assert.deepEqual(treeCenters(6, E), [1]);
  });
  it('handles a single node and a single edge', () => {
    assert.equal(treeDiameter(1, []).length, 0);
    assert.deepEqual(treeCenters(1, []), [0]);
    assert.deepEqual(treeCenters(2, [[0, 1]]), [0, 1]);
  });
  it('rejects an edge list that is not a tree', () => {
    assert.throws(() => buildAdjacency(4, [[0, 1]]));
    assert.throws(() => buildAdjacency(2, [[0, 5]]));
  });
  it('matches brute force on random trees', () => {
    for (let t = 0; t < 200; t++) {
      const n = ri(1, 15), edges = randomTree(n), D = allDist(n, edges);
      assert.equal(treeDiameter(n, edges).length, Math.max(...D.flat()));
    }
  });
});

describe('Euler tour + Fenwick subtree sums', () => {
  it('gives contiguous subtree ranges', () => {
    const { tin, tout, size } = eulerTour(6, E, 0);
    assert.equal(tout[0] - tin[0] + 1, 6);
    assert.equal(size[1], 5);
    for (const v of [2, 3, 4, 5]) assert.ok(tin[1] <= tin[v] && tin[v] <= tout[1]);
  });
  it('supports updates', () => {
    const q = new SubtreeSumQuery(6, E, [1, 1, 1, 1, 1, 1], 0);
    assert.equal(q.subtreeSum(4), 2);
    q.update(5, 10);
    assert.equal(q.subtreeSum(4), 11);
    assert.equal(q.subtreeSum(0), 15);
  });
});

describe('rerooting, centroid, HLD, isomorphism', () => {
  it('sum of distances matches brute force on random trees', () => {
    for (let t = 0; t < 200; t++) {
      const n = ri(1, 15), edges = randomTree(n), D = allDist(n, edges);
      assert.deepEqual(sumOfDistances(n, edges), D.map(r => r.reduce((a, b) => a + b, 0)));
    }
  });
  it('centroid pair counting matches brute force and depth is logarithmic', () => {
    for (let t = 0; t < 200; t++) {
      const n = ri(1, 15), edges = randomTree(n), D = allDist(n, edges), k = ri(0, 6);
      let pairs = 0;
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (D[i][j] <= k) pairs++;
      assert.equal(countPairsWithinDistance(n, edges, k), pairs);
      assert.ok(Math.max(...centroidDecomposition(n, edges).level) <= Math.log2(n));
    }
  });
  it('HLD path sums handle a deep path (no recursion) and updates', () => {
    const N = 50000;
    const line = Array.from({ length: N - 1 }, (_, i) => [i, i + 1]);
    const hld = new HeavyLightDecomposition(N, line, new Array(N).fill(2));
    assert.equal(hld.pathSum(N - 1, 0), 2 * N);
    hld.update(10, 0);
    assert.equal(hld.pathSum(0, 10), 20);
    assert.equal(hld.pathSum(7, 7), 2);
  });
  it('isomorphism: path vs star differ, relabelled copy matches', () => {
    assert.equal(areIsomorphic(4, [[0, 1], [1, 2], [2, 3]], 4, [[0, 1], [0, 2], [0, 3]]), false);
    assert.equal(areIsomorphic(6, E, 6, [[5, 4], [4, 3], [3, 2], [4, 1], [1, 0]]), true);
    assert.equal(areIsomorphic(3, [[0, 1], [1, 2]], 4, [[0, 1], [1, 2], [2, 3]]), false);
  });
  it('re-exports binary lifting from 01_Classic_Techniques', () => {
    const { lca, kthAncestor } = binaryLiftingLCA(6, [-1, 0, 1, 2, 1, 4], 0);
    assert.equal(lca(3, 5), 1);
    assert.equal(kthAncestor(5, 2), 1);
    assert.equal(kthAncestor(5, 9), -1);
  });
});

describe('problem solutions on extra edge cases', () => {
  const diameter = require('../03_Problems/solutions/01_tree_diameter');
  const mht = require('../03_Problems/solutions/02_minimum_height_trees');
  const sod = require('../03_Problems/solutions/06_sum_of_distances_in_tree');
  const good = require('../03_Problems/solutions/07_number_of_good_paths');
  const paths = require('../03_Problems/solutions/05_path_sum_queries_with_updates');
  it('tree diameter on a caterpillar', () => {
    const edges = [[0, 1], [1, 2], [2, 3], [1, 4], [2, 5], [3, 6]];
    assert.equal(diameter.optimal(edges), diameter.bruteForce(edges));
    assert.equal(diameter.optimal(edges), 4);
  });
  it('minimum height trees on a star', () => {
    assert.deepEqual(mht.optimal(5, [[0, 4], [1, 4], [2, 4], [3, 4]]), [4]);
  });
  it('sum of distances on a star', () => {
    assert.deepEqual(sod.optimal(4, [[3, 0], [3, 1], [3, 2]]), [5, 5, 5, 3]);
  });
  it('good paths with equal values separated by a bigger value', () => {
    assert.equal(good.optimal([1, 9, 1, 1], [[0, 1], [1, 2], [2, 3]]), good.bruteForce([1, 9, 1, 1], [[0, 1], [1, 2], [2, 3]]));
    assert.equal(good.optimal([1, 9, 1, 1], [[0, 1], [1, 2], [2, 3]]), 5);
  });
  it('path sums with negative values', () => {
    assert.deepEqual(paths.optimal(3, [[0, 1], [1, 2]], [-1, -1, -1], [['path', 0, 2]]), [-3]);
  });
});

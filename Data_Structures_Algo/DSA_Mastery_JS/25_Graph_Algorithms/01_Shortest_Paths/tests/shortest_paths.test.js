const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  MinHeap, Deque, bfsShortest, dijkstra, dijkstraWithPath, bellmanFord, floydWarshall, zeroOneBfs,
} = require('../02_Implementations/shortest_paths');

// Seeded PRNG so random failures are reproducible.
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function randomEdges(rand, n, m, minW, maxW, directed = true) {
  const edges = [];
  for (let i = 0; i < m; i++) {
    const u = Math.floor(rand() * n);
    const v = Math.floor(rand() * n);
    const w = minW + Math.floor(rand() * (maxW - minW + 1));
    edges.push([u, v, w]);
  }
  return edges;
}
// Undirected edge list -> directed list with both directions (for Bellman-Ford, which
// only treats edges as directed).
const bothWays = (edges) => edges.flatMap(([u, v, w]) => [[u, v, w], [v, u, w]]);

const wEdges = [[0, 1, 4], [1, 2, 1], [0, 3, 1], [1, 4, 2], [3, 4, 5]];

describe('MinHeap', () => {
  it('pops in ascending priority order, including duplicates', () => {
    const h = new MinHeap();
    for (const p of [5, 1, 5, 3, 0, 3]) h.push([p]);
    const out = [];
    while (!h.isEmpty()) out.push(h.pop()[0]);
    assert.deepEqual(out, [0, 1, 3, 3, 5, 5]);
  });
  it('handles empty heap', () => {
    const h = new MinHeap();
    assert.equal(h.pop(), undefined);
    assert.equal(h.peek(), undefined);
    assert.equal(h.size(), 0);
  });
  it('sorts random input like Array.sort', () => {
    const rand = mulberry32(1);
    for (let t = 0; t < 50; t++) {
      const arr = Array.from({ length: 40 }, () => Math.floor(rand() * 20) - 10);
      const h = new MinHeap();
      arr.forEach((x) => h.push([x]));
      const out = [];
      while (h.size()) out.push(h.pop()[0]);
      assert.deepEqual(out, [...arr].sort((a, b) => a - b));
    }
  });
});

describe('Deque', () => {
  it('supports both ends', () => {
    const d = new Deque();
    d.pushBack(2); d.pushFront(1); d.pushBack(3); d.pushFront(0);
    assert.equal(d.size(), 4);
    assert.equal(d.peekFront(), 0);
    assert.equal(d.peekBack(), 3);
    assert.equal(d.popBack(), 3);
    assert.equal(d.popFront(), 0);
    assert.equal(d.popFront(), 1);
    assert.equal(d.popFront(), 2);
    assert.equal(d.size(), 0);
  });
});

describe('bfsShortest', () => {
  it('counts edges, not weights', () => {
    assert.deepEqual(bfsShortest(5, wEdges.map(([u, v]) => [u, v]), 0), [0, 1, 2, 1, 2]);
  });
  it('leaves unreachable vertices at Infinity (disconnected graph)', () => {
    assert.deepEqual(bfsShortest(4, [[0, 1], [2, 3]], 0), [0, 1, Infinity, Infinity]);
  });
  it('respects direction', () => {
    assert.deepEqual(bfsShortest(3, [[0, 1], [2, 1]], 0, true), [0, 1, Infinity]);
  });
});

describe('dijkstra', () => {
  it('handles the normal weighted case', () => {
    assert.deepEqual(dijkstra(5, wEdges, 0), [0, 4, 5, 1, 6]);
  });
  it('single vertex, no edges', () => {
    assert.deepEqual(dijkstra(1, [], 0), [0]);
  });
  it('handles cycles, zero weights and parallel edges', () => {
    const edges = [[0, 1, 5], [0, 1, 2], [1, 2, 0], [2, 0, 0], [2, 3, 1]];
    assert.deepEqual(dijkstra(4, edges, 0, true), [0, 2, 2, 3]);
  });
  it('unreachable vertices stay Infinity', () => {
    assert.deepEqual(dijkstra(4, [[0, 1, 3]], 0), [0, 3, Infinity, Infinity]);
  });
  it('ties: equal-cost paths give the same distance', () => {
    assert.deepEqual(dijkstra(4, [[0, 1, 1], [0, 2, 1], [1, 3, 1], [2, 3, 1]], 0), [0, 1, 1, 2]);
  });
});

describe('dijkstraWithPath', () => {
  it('returns a valid shortest path', () => {
    assert.deepEqual(dijkstraWithPath(5, wEdges, 0, 2), { distance: 5, path: [0, 1, 2] });
  });
  it('source === target', () => {
    assert.deepEqual(dijkstraWithPath(3, [[0, 1, 1]], 1, 1), { distance: 0, path: [1] });
  });
  it('unreachable target', () => {
    assert.deepEqual(dijkstraWithPath(3, [[0, 1, 1]], 0, 2), { distance: Infinity, path: [] });
  });
  it('path weight equals the reported distance on random graphs', () => {
    const rand = mulberry32(7);
    for (let t = 0; t < 100; t++) {
      const n = 2 + Math.floor(rand() * 7);
      const edges = randomEdges(rand, n, Math.floor(rand() * 15), 0, 9);
      const target = Math.floor(rand() * n);
      const { distance, path } = dijkstraWithPath(n, edges, 0, target, true);
      assert.equal(distance, dijkstra(n, edges, 0, true)[target]);
      if (distance === Infinity) { assert.deepEqual(path, []); continue; }
      assert.equal(path[0], 0);
      assert.equal(path.at(-1), target);
      let sum = 0;
      for (let i = 0; i + 1 < path.length; i++) {
        const best = Math.min(...edges.filter(([u, v]) => u === path[i] && v === path[i + 1]).map((e) => e[2]));
        sum += best;
      }
      assert.equal(sum, distance);
    }
  });
});

describe('bellmanFord', () => {
  it('handles negative edges without a negative cycle', () => {
    assert.deepEqual(bellmanFord(3, [[0, 1, 4], [0, 2, 5], [2, 1, -3]], 0), { dist: [0, 2, 5], hasNegativeCycle: false });
  });
  it('detects a reachable negative cycle', () => {
    assert.equal(bellmanFord(3, [[0, 1, 1], [1, 2, -1], [2, 0, -1]], 0).hasNegativeCycle, true);
  });
  it('ignores a negative cycle that is not reachable from the source', () => {
    const r = bellmanFord(4, [[0, 1, 2], [2, 3, -5], [3, 2, 1]], 0);
    assert.equal(r.hasNegativeCycle, false);
    assert.deepEqual(r.dist, [0, 2, Infinity, Infinity]);
  });
  it('single vertex and empty edge list', () => {
    assert.deepEqual(bellmanFord(1, [], 0), { dist: [0], hasNegativeCycle: false });
  });
  it('negative self-loop is a negative cycle', () => {
    assert.equal(bellmanFord(2, [[0, 1, 1], [1, 1, -1]], 0).hasNegativeCycle, true);
  });
});

describe('floydWarshall', () => {
  it('directed all-pairs with unreachable pairs', () => {
    const fw = floydWarshall(4, [[0, 1, 3], [1, 2, 1], [0, 2, 7], [2, 3, 2]], true);
    assert.deepEqual(fw[0], [0, 3, 4, 6]);
    assert.equal(fw[3][0], Infinity);
  });
  it('keeps the cheaper of parallel edges', () => {
    assert.deepEqual(floydWarshall(2, [[0, 1, 5], [0, 1, 2]]), [[0, 2], [2, 0]]);
  });
  it('negative cycle shows up as dist[i][i] < 0', () => {
    const fw = floydWarshall(3, [[0, 1, 1], [1, 2, -1], [2, 0, -1]], true);
    assert.ok(fw[0][0] < 0);
  });
  it('handles negative edges like Bellman-Ford', () => {
    const edges = [[0, 1, 4], [0, 2, 5], [2, 1, -3]];
    assert.deepEqual(floydWarshall(3, edges, true)[0], bellmanFord(3, edges, 0).dist);
  });
});

describe('zeroOneBfs', () => {
  it('handles 0/1 weights', () => {
    assert.deepEqual(zeroOneBfs(4, [[0, 1, 0], [1, 2, 1], [2, 3, 0], [0, 3, 1]], 0), [0, 0, 1, 1]);
  });
  it('all-zero graph and unreachable vertex', () => {
    assert.deepEqual(zeroOneBfs(4, [[0, 1, 0], [1, 2, 0]], 0), [0, 0, 0, Infinity]);
  });
});

describe('cross-check: Dijkstra vs Bellman-Ford vs Floyd-Warshall vs 0-1 BFS', () => {
  it('agree on random non-negative graphs (directed and undirected)', () => {
    const rand = mulberry32(2024);
    for (let t = 0; t < 200; t++) {
      const n = 1 + Math.floor(rand() * 8);
      const directed = rand() < 0.5;
      const edges = randomEdges(rand, n, Math.floor(rand() * 20), 0, 10);
      const src = Math.floor(rand() * n);
      const d = dijkstra(n, edges, src, directed);
      const bf = bellmanFord(n, directed ? edges : bothWays(edges), src);
      const fw = floydWarshall(n, edges, directed);
      assert.equal(bf.hasNegativeCycle, false);
      assert.deepEqual(d, bf.dist);
      assert.deepEqual(d, fw[src]);
    }
  });
  it('0-1 BFS matches Dijkstra when weights are 0 or 1', () => {
    const rand = mulberry32(99);
    for (let t = 0; t < 200; t++) {
      const n = 1 + Math.floor(rand() * 8);
      const edges = randomEdges(rand, n, Math.floor(rand() * 20), 0, 1);
      const directed = rand() < 0.5;
      assert.deepEqual(zeroOneBfs(n, edges, 0, directed), dijkstra(n, edges, 0, directed));
    }
  });
  it('BFS matches Dijkstra when every weight is 1', () => {
    const rand = mulberry32(5);
    for (let t = 0; t < 200; t++) {
      const n = 1 + Math.floor(rand() * 8);
      const edges = randomEdges(rand, n, Math.floor(rand() * 15), 1, 1);
      assert.deepEqual(bfsShortest(n, edges.map(([u, v]) => [u, v]), 0), dijkstra(n, edges, 0));
    }
  });
  it('Bellman-Ford matches Floyd-Warshall on random DAGs with negative edges', () => {
    const rand = mulberry32(31337);
    for (let t = 0; t < 200; t++) {
      const n = 1 + Math.floor(rand() * 7);
      const edges = [];
      // u < v only -> no cycles at all, so negative weights are safe
      for (let i = 0; i < 15; i++) {
        const u = Math.floor(rand() * n), v = Math.floor(rand() * n);
        if (u < v) edges.push([u, v, Math.floor(rand() * 21) - 10]);
      }
      const bf = bellmanFord(n, edges, 0);
      assert.equal(bf.hasNegativeCycle, false);
      assert.deepEqual(bf.dist, floydWarshall(n, edges, true)[0]);
    }
  });
});

describe('solution files: extra edge cases', () => {
  const networkDelay = require('../03_Problems/solutions/01_network_delay_time');
  const cheapest = require('../03_Problems/solutions/02_cheapest_flights_within_k_stops');
  const effort = require('../03_Problems/solutions/03_path_with_minimum_effort');
  const city = require('../03_Problems/solutions/07_find_the_city');
  const validPath = require('../03_Problems/solutions/08_minimum_cost_valid_path');

  it('Network Delay Time: single node, unreachable node', () => {
    for (const f of [networkDelay.optimal, networkDelay.bruteForce]) {
      assert.equal(f([], 1, 1), 0);
      assert.equal(f([[1, 2, 1]], 3, 1), -1);
      assert.equal(f([[1, 2, 1], [2, 3, 2], [1, 3, 4]], 3, 1), 3);
    }
  });
  it('Cheapest Flights: k = 0 forbids stopovers; src === dst', () => {
    for (const f of [cheapest.optimal, cheapest.bruteForce]) {
      assert.equal(f(3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 0), 500);
      assert.equal(f(3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 1), 200);
      assert.equal(f(3, [[0, 1, 100], [1, 2, 100]], 0, 2, 0), -1);
    }
  });
  it('Path With Minimum Effort: 1x1 grid and flat grid', () => {
    for (const f of [effort.optimal, effort.bruteForce]) {
      assert.equal(f([[7]]), 0);
      assert.equal(f([[3, 3], [3, 3]]), 0);
      assert.equal(f([[1, 10, 1]]), 9);
    }
  });
  it('Find the City: ties go to the larger index', () => {
    for (const f of [city.optimal, city.dijkstraVersion]) {
      assert.equal(f(2, [[0, 1, 5]], 1), 1);
      assert.equal(f(3, [], 10), 2);
    }
  });
  it('Minimum Cost Valid Path: 1x1 grid and all-correct arrows', () => {
    for (const f of [validPath.optimal, validPath.dijkstraVersion]) {
      assert.equal(f([[4]]), 0);
      assert.equal(f([[1, 1, 3], [2, 2, 3]]), 0);
    }
  });
});

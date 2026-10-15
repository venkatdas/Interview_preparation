const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { EdmondsKarp, Dinic, MinCostMaxFlow, bruteForceMinCut, maxFlow, mulberry32 } = require('../02_Implementations/max_flow');
const { kuhn, hopcroftKarp, matchingViaFlow, bruteForceMatching, isValidMatching, randomBipartite } = require('../02_Implementations/bipartite_matching');

const CLRS = [[0, 1, 16], [0, 2, 13], [1, 2, 10], [2, 1, 4], [1, 3, 12], [3, 2, 9],
  [2, 4, 14], [4, 3, 7], [3, 5, 20], [4, 5, 4]];

describe('Max flow (Edmonds-Karp, Dinic)', () => {
  it('handles the classic CLRS network', () => {
    assert.equal(maxFlow(6, CLRS, 0, 5, EdmondsKarp), 23);
    assert.equal(maxFlow(6, CLRS, 0, 5, Dinic), 23);
  });

  it('returns 0 when the sink is unreachable or there are no edges', () => {
    assert.equal(maxFlow(4, [[0, 1, 5], [2, 3, 5]], 0, 3), 0);
    assert.equal(maxFlow(2, [], 0, 1, EdmondsKarp), 0);
  });

  it('handles parallel, anti-parallel and self-loop edges', () => {
    assert.equal(maxFlow(2, [[0, 1, 3], [0, 1, 4]], 0, 1), 7);
    assert.equal(maxFlow(3, [[0, 1, 5], [1, 0, 5], [1, 2, 2], [1, 1, 9]], 0, 2), 2);
  });

  it('needs reverse edges (greedy trap graph)', () => {
    const edges = [[0, 1, 1], [1, 2, 1], [2, 3, 1], [0, 2, 1], [1, 3, 1]];
    assert.equal(maxFlow(4, edges, 0, 3, EdmondsKarp), 2);
    assert.equal(maxFlow(4, edges, 0, 3, Dinic), 2);
  });

  it('rejects bad input', () => {
    assert.throws(() => new Dinic(0));
    assert.throws(() => new Dinic(2).addEdge(0, 5, 1));
    assert.throws(() => new Dinic(2).addEdge(0, 1, -1));
    assert.throws(() => new EdmondsKarp(2).maxFlow(1, 1));
  });

  it('min cut edges sum to the max flow and disconnect s from t', () => {
    const g = new EdmondsKarp(6);
    for (const [u, v, c] of CLRS) g.addEdge(u, v, c);
    const f = g.maxFlow(0, 5);
    const { sSide, cutEdges } = g.minCut(0);
    assert.equal(cutEdges.reduce((a, [, , c]) => a + c, 0), f);
    assert.equal(sSide[0], true);
    assert.equal(sSide[5], false);
  });

  it('matches brute-force min cut and each other on random graphs', () => {
    const rnd = mulberry32(12345);
    for (let t = 0; t < 200; t++) {
      const n = 2 + Math.floor(rnd() * 6);
      const edges = Array.from({ length: Math.floor(rnd() * 14) },
        () => [Math.floor(rnd() * n), Math.floor(rnd() * n), Math.floor(rnd() * 8)]);
      const expected = bruteForceMinCut(n, edges, 0, n - 1);
      assert.equal(maxFlow(n, edges, 0, n - 1, EdmondsKarp), expected);
      assert.equal(maxFlow(n, edges, 0, n - 1, Dinic), expected);
    }
  });

  it('Dinic handles a long path without stack overflow', () => {
    const n = 50000;
    const edges = [];
    for (let i = 0; i + 1 < n; i++) edges.push([i, i + 1, 3]);
    assert.equal(maxFlow(n, edges, 0, n - 1, Dinic), 3);
  });
});

describe('Min-cost max-flow', () => {
  it('solves a small assignment problem', () => {
    const cost = [[4, 1, 3], [2, 0, 5], [3, 2, 2]]; // best = 1 + 2 + 2 = 5
    const g = new MinCostMaxFlow(8);
    for (let i = 0; i < 3; i++) {
      g.addEdge(6, i, 1, 0);
      g.addEdge(3 + i, 7, 1, 0);
      for (let j = 0; j < 3; j++) g.addEdge(i, 3 + j, 1, cost[i][j]);
    }
    assert.deepEqual(g.run(6, 7), { flow: 3, cost: 5 });
  });

  it('respects a flow limit', () => {
    const g = new MinCostMaxFlow(3);
    g.addEdge(0, 1, 5, 1);
    g.addEdge(1, 2, 5, 1);
    assert.deepEqual(g.run(0, 2, 3), { flow: 3, cost: 6 });
  });
});

describe('Bipartite matching (Kuhn, Hopcroft-Karp, via flow)', () => {
  const algos = [kuhn, hopcroftKarp, matchingViaFlow];

  it('finds a perfect matching when one exists', () => {
    for (const algo of algos) {
      const res = algo(3, 3, [[0, 1], [0], [1, 2]]);
      assert.equal(res.size, 3);
      assert.ok(isValidMatching(3, [[0, 1], [0], [1, 2]], res.matchLeft));
    }
  });

  it('handles empty sides and empty lists', () => {
    for (const algo of algos) {
      assert.equal(algo(0, 3, []).size, 0);
      assert.equal(algo(2, 2, [[], []]).size, 0);
    }
  });

  it('handles everyone competing for one node (duplicates of demand)', () => {
    for (const algo of algos) assert.equal(algo(4, 1, [[0], [0], [0], [0]]).size, 1);
  });

  it('rejects out-of-range right nodes', () => {
    assert.throws(() => kuhn(1, 1, [[3]]));
  });

  it('matches brute force on random inputs', () => {
    const rnd = mulberry32(999);
    for (let t = 0; t < 200; t++) {
      const { nLeft, nRight, adj } = randomBipartite(rnd);
      const expected = bruteForceMatching(nLeft, nRight, adj);
      for (const algo of algos) {
        const res = algo(nLeft, nRight, adj);
        assert.equal(res.size, expected);
        assert.ok(isValidMatching(nRight, adj, res.matchLeft));
      }
    }
  });
});

describe('Selected problem solutions', () => {
  const p1 = require('../03_Problems/solutions/01_maximum_bipartite_matching');
  const p3 = require('../03_Problems/solutions/03_minimum_cut_network');
  const p5 = require('../03_Problems/solutions/05_project_selection');
  const p6 = require('../03_Problems/solutions/06_maximum_students_taking_exam');

  it('01 hiring applicants: greedy trap and empty job list', () => {
    assert.equal(p1.optimal([[0, 1], [0]], 2), 2);
    assert.equal(p1.optimal([[0], [1]], 2), 2);
    assert.equal(p1.bruteForce([[], [], []], 3), 0);
  });

  it('03 min cut: chain picks the cheapest link', () => {
    assert.deepEqual(p3.optimal(4, [[0, 1, 5], [1, 2, 1], [2, 3, 5]], 0, 3), { cost: 1, cut: [1] });
  });

  it('05 project selection: chain of dependencies', () => {
    assert.equal(p5.optimal([10, -3, -3, -3], [[0, 1], [1, 2], [2, 3]]), 1);
    assert.equal(p5.optimal([10, -3, -3, -5], [[0, 1], [1, 2], [2, 3]]), 0);
  });

  it('06 exam seats: full 2x3 grid and wide single row', () => {
    for (const fn of [p6.optimal, p6.bitmaskDP, p6.bruteForce]) {
      assert.equal(fn(['...', '...']), 4);
      assert.equal(fn(['.......']), 4);
    }
  });
});

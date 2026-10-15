// node --test 23_Graphs/tests/graphs.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { Graph, buildAdjList, buildAdjMatrix, DIRS, DIRS_8 } = require('../02_Implementations/graph');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// Brute-force reachability via repeated relaxation over the edge list (no BFS/DFS code shared).
function reachable(n, edges, directed, s) {
  const seen = new Array(n).fill(false); seen[s] = true;
  let changed = true;
  while (changed) {
    changed = false;
    for (const [u, v] of edges) {
      if (seen[u] && !seen[v]) { seen[v] = true; changed = true; }
      if (!directed && seen[v] && !seen[u]) { seen[u] = true; changed = true; }
    }
  }
  return seen;
}
const randEdges = (rnd, n, m) => Array.from({ length: m }, () => [Math.floor(rnd() * n), Math.floor(rnd() * n)]);

describe('buildAdjList / buildAdjMatrix', () => {
  it('undirected, directed and weighted lists', () => {
    assert.deepEqual(buildAdjList(3, [[0, 1], [1, 2]]), [[1], [0, 2], [1]]);
    assert.deepEqual(buildAdjList(3, [[0, 1], [1, 2]], true), [[1], [2], []]);
    assert.deepEqual(buildAdjList(2, [[0, 1, 7]]), [[[1, 7]], [[0, 7]]]);
    assert.deepEqual(buildAdjList(0, []), []);
    assert.deepEqual(buildAdjList(3, []), [[], [], []]); // isolated vertices
  });
  it('matrix: diagonal 0, missing edges Infinity (or custom), default weight 1', () => {
    const m = buildAdjMatrix(3, [[0, 1], [1, 2, 5]], true);
    assert.deepEqual(m, [[0, 1, Infinity], [Infinity, 0, 5], [Infinity, Infinity, 0]]);
    const u = buildAdjMatrix(2, [[0, 1]], false, -1);
    assert.deepEqual(u, [[0, 1], [1, 0]]);
  });
  it('list and matrix agree on random graphs', () => {
    const rnd = mulberry32(23);
    for (let t = 0; t < 200; t++) {
      const n = 1 + Math.floor(rnd() * 8), directed = rnd() < 0.5;
      const edges = randEdges(rnd, n, Math.floor(rnd() * 12)).filter(([u, v]) => u !== v);
      const adj = buildAdjList(n, edges, directed), m = buildAdjMatrix(n, edges, directed);
      for (let u = 0; u < n; u++) for (let v = 0; v < n; v++) {
        if (u === v) continue;
        assert.equal(adj[u].includes(v), m[u][v] === 1);
      }
    }
  });
  it('direction constants', () => {
    assert.equal(DIRS.length, 4);
    assert.equal(DIRS_8.length, 8);
    assert.equal(new Set(DIRS_8.map(String)).size, 8);
  });
});

describe('Graph class', () => {
  it('empty graph and unknown vertices', () => {
    const g = new Graph();
    assert.equal(g.vertexCount(), 0);
    assert.equal(g.edgeCount(), 0);
    assert.deepEqual(g.bfs('x'), []);
    assert.deepEqual(g.dfsIterative('x'), []);
    assert.deepEqual(g.dfsRecursive('x'), []);
    assert.deepEqual(g.neighbors('x'), []);
    assert.deepEqual(g.edgesFrom('x'), []);
    assert.equal(g.hasPath('a', 'b'), false);
    assert.deepEqual(g.connectedComponents(), []);
  });
  it('undirected edges go both ways; directed only one way', () => {
    const u = new Graph().addEdge('A', 'B');
    assert.equal(u.hasEdge('B', 'A'), true);
    assert.equal(u.edgeCount(), 1);
    const d = new Graph({ directed: true }).addEdge('A', 'B');
    assert.equal(d.hasEdge('B', 'A'), false);
    assert.equal(d.hasPath('B', 'A'), false);
    assert.equal(d.hasPath('A', 'B'), true);
    assert.equal(d.directed, true);
  });
  it('isolated vertex, self loop, weighted toString', () => {
    const g = new Graph({ weighted: true });
    g.addVertex('Z').addEdge('A', 'A', 4).addEdge('A', 'B', 2);
    assert.equal(g.vertexCount(), 3);
    assert.equal(g.hasPath('A', 'A'), true);
    assert.equal(g.hasPath('A', 'Z'), false); // unreachable
    assert.deepEqual(g.bfs('Z'), ['Z']);
    assert.ok(g.toString().includes('B(2)'));
    assert.equal(g.weighted, true);
  });
  it('known BFS / DFS orders on a small graph with a cycle', () => {
    const g = new Graph();
    [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4]].forEach(([a, b]) => g.addEdge(a, b));
    assert.deepEqual(g.bfs(0), [0, 1, 2, 3, 4]);
    assert.deepEqual(g.dfsRecursive(0), [0, 1, 3, 2, 4]);
    assert.deepEqual(g.dfsIterative(0), g.dfsRecursive(0));
  });
  it('disconnected graph: components partition the vertices', () => {
    const g = new Graph();
    g.addEdge(1, 2).addEdge(3, 4).addVertex(5);
    const comps = g.connectedComponents().map((c) => [...c].sort()).sort();
    assert.deepEqual(comps, [[1, 2], [3, 4], [5]]);
  });
  it('random graphs: traversals and hasPath match brute-force reachability', () => {
    const rnd = mulberry32(2023);
    for (let t = 0; t < 200; t++) {
      const n = 1 + Math.floor(rnd() * 10), directed = rnd() < 0.5;
      const edges = randEdges(rnd, n, Math.floor(rnd() * 15));
      const g = new Graph({ directed });
      for (let v = 0; v < n; v++) g.addVertex(v);
      edges.forEach(([u, v]) => g.addEdge(u, v));
      const s = Math.floor(rnd() * n);
      const seen = reachable(n, edges, directed, s);
      const expected = [...Array(n).keys()].filter((v) => seen[v]).sort((a, b) => a - b);
      for (const f of ['bfs', 'dfsIterative', 'dfsRecursive']) {
        const order = g[f](s);
        assert.equal(order[0], s);
        assert.equal(new Set(order).size, order.length, `${f} visits a vertex twice`);
        assert.deepEqual([...order].sort((a, b) => a - b), expected, f);
      }
      for (let v = 0; v < n; v++) assert.equal(g.hasPath(s, v), seen[v]);
      if (!directed) {
        const comps = g.connectedComponents();
        assert.equal(comps.flat().length, n);
        for (const c of comps) {
          const r = reachable(n, edges, false, c[0]);
          assert.deepEqual([...c].sort((a, b) => a - b), [...Array(n).keys()].filter((v) => r[v]));
        }
      }
    }
  });
});

describe('original exercises in 03_Problems', () => {
  const e1 = require('../03_Problems/solutions/01_edge_list_to_adjacency_list');
  const e2 = require('../03_Problems/solutions/02_degree_report');
  const e3 = require('../03_Problems/solutions/03_matrix_list_conversion');
  const e4 = require('../03_Problems/solutions/04_reverse_directed_graph');
  const e5 = require('../03_Problems/solutions/05_find_the_hub_server');
  const e6 = require('../03_Problems/solutions/06_grid_to_graph');
  it('edge list -> adjacency list agrees with buildAdjList (deduped, sorted)', () => {
    const rnd = mulberry32(1);
    for (let t = 0; t < 100; t++) {
      const n = 1 + Math.floor(rnd() * 8), directed = rnd() < 0.5;
      const edges = randEdges(rnd, n, Math.floor(rnd() * 12));
      const ref = buildAdjList(n, edges, directed).map((l) => [...new Set(l)].sort((a, b) => a - b));
      assert.deepEqual(e1.optimal(n, edges, directed), ref);
    }
  });
  it('degree report: sum of in-degrees equals sum of out-degrees equals E', () => {
    const r = e2.optimal(5, [[0, 1], [1, 1], [2, 3], [2, 3]]);
    const sum = (a) => a.reduce((x, y) => x + y, 0);
    assert.equal(sum(r.inDegree), 4);
    assert.equal(sum(r.outDegree), 4);
    assert.deepEqual(r.sources, [0, 2, 4]);
  });
  it('matrix/list round trip and reverse-twice identity', () => {
    const adj = [[1, 2], [2], [0]];
    assert.deepEqual(e3.optimal(e3.listToMatrix(adj)), adj);
    assert.deepEqual(e4.optimal(e4.optimal(adj)), adj);
    assert.deepEqual(e4.optimal(adj), [[2], [0], [0, 1]]);
  });
  it('hub server: hub at the end, no hub, n = 1', () => {
    assert.equal(e5.optimal([[0, 0, 1], [0, 0, 1], [0, 0, 0]]), 2);
    assert.equal(e5.optimal([[0, 1, 0], [0, 0, 1], [1, 0, 0]]), -1);
    assert.equal(e5.optimal([[0]]), 0);
  });
  it('grid to graph: edgeCount matches the Graph class edge count', () => {
    const grid = ['..#', '...', '#..'];
    const { adj, edgeCount } = e6.optimal(grid);
    const g = new Graph();
    adj.forEach((list, u) => list.forEach((v) => { if (u < v) g.addEdge(u, v); }));
    assert.equal(g.edgeCount(), edgeCount);
    assert.equal(edgeCount, 8);
  });
});

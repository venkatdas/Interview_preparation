const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  isBipartite, tarjanSCC, kosarajuSCC, findBridges, articulationPoints, hierholzer,
} = require('../02_Implementations/advanced_graph_algorithms');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const adjOf = (n, edges, directed) => {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { adj[u].push(v); if (!directed) adj[v].push(u); }
  return adj;
};
// canonical form: each component sorted, components sorted by first element
const canon = (comps) => comps.map((c) => [...c].sort((a, b) => a - b)).sort((a, b) => a[0] - b[0]);
const canonEdges = (es) => es.map(([a, b]) => (a < b ? [a, b] : [b, a])).sort((x, y) => x[0] - y[0] || x[1] - y[1]);

// ---- brute-force references ----
function reachMatrix(n, adj) {
  const r = Array.from({ length: n }, () => new Array(n).fill(false));
  for (let s = 0; s < n; s++) {
    const stack = [s]; r[s][s] = true;
    while (stack.length) { const u = stack.pop(); for (const v of adj[u]) if (!r[s][v]) { r[s][v] = true; stack.push(v); } }
  }
  return r;
}
function bruteSCC(n, adj) {
  const r = reachMatrix(n, adj), seen = new Array(n).fill(false), out = [];
  for (let u = 0; u < n; u++) {
    if (seen[u]) continue;
    const comp = [];
    for (let v = 0; v < n; v++) if (r[u][v] && r[v][u]) { comp.push(v); seen[v] = true; }
    out.push(comp);
  }
  return out;
}
function countComponents(n, edges, removedVertex = -1) {
  const p = Array.from({ length: n }, (_, i) => i);
  const find = (x) => (p[x] === x ? x : (p[x] = find(p[x])));
  let c = removedVertex === -1 ? n : n - 1;
  for (const [u, v] of edges) {
    if (u === removedVertex || v === removedVertex) continue;
    const a = find(u), b = find(v);
    if (a !== b) { p[a] = b; c--; }
  }
  return c;
}
function bruteBridges(n, edges) {
  const base = countComponents(n, edges);
  return edges.filter((_, i) => countComponents(n, edges.filter((__, j) => j !== i)) > base);
}
function bruteArticulation(n, edges) {
  const base = countComponents(n, edges);
  const out = [];
  for (let v = 0; v < n; v++) {
    // removing an isolated vertex lowers the count by one; anything above base - 1 means a split
    const isolated = !edges.some(([a, b]) => a === v || b === v);
    if (!isolated && countComponents(n, edges, v) > base) out.push(v);
  }
  return out;
}
function bruteBipartite(n, edges) {
  for (let mask = 0; mask < 1 << n; mask++) {
    if (edges.every(([u, v]) => ((mask >> u) & 1) !== ((mask >> v) & 1))) return true;
  }
  return false;
}
function randomSimpleEdges(rand, n, p) {
  const edges = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (rand() < p) edges.push([i, j]);
  return edges;
}

describe('isBipartite', () => {
  it('even cycle yes, odd cycle no', () => {
    assert.equal(isBipartite(4, adjOf(4, [[0, 1], [1, 2], [2, 3], [3, 0]])), true);
    assert.equal(isBipartite(3, adjOf(3, [[0, 1], [1, 2], [2, 0]])), false);
  });
  it('empty graph and single vertex', () => {
    assert.equal(isBipartite(0, []), true);
    assert.equal(isBipartite(1, [[]]), true);
  });
  it('checks every component of a disconnected graph', () => {
    assert.equal(isBipartite(6, adjOf(6, [[0, 1], [3, 4], [4, 5], [5, 3]])), false);
    assert.equal(isBipartite(5, adjOf(5, [[0, 1], [2, 3]])), true);
  });
  it('self loop is never bipartite', () => {
    assert.equal(isBipartite(2, adjOf(2, [[0, 0]], true)), false);
  });
  it('matches brute-force 2-colouring on random graphs', () => {
    const rand = mulberry32(11);
    for (let t = 0; t < 200; t++) {
      const n = 1 + Math.floor(rand() * 8);
      const edges = randomSimpleEdges(rand, n, 0.3);
      assert.equal(isBipartite(n, adjOf(n, edges)), bruteBipartite(n, edges));
    }
  });
});

describe('tarjanSCC and kosarajuSCC', () => {
  const dir = [[0, 1], [1, 2], [2, 0], [2, 3], [3, 4], [4, 3]];
  it('normal case with two cycles and an isolated vertex', () => {
    const adj = adjOf(6, dir, true);
    assert.deepEqual(canon(tarjanSCC(6, adj)), [[0, 1, 2], [3, 4], [5]]);
    assert.deepEqual(canon(kosarajuSCC(6, adj)), [[0, 1, 2], [3, 4], [5]]);
  });
  it('empty graph', () => {
    assert.deepEqual(tarjanSCC(0, []), []);
    assert.deepEqual(kosarajuSCC(0, []), []);
  });
  it('DAG: every vertex alone', () => {
    const adj = adjOf(4, [[0, 1], [0, 2], [1, 3], [2, 3]], true);
    assert.equal(tarjanSCC(4, adj).length, 4);
    assert.equal(kosarajuSCC(4, adj).length, 4);
  });
  it('cross edge into a finished SCC does not merge components', () => {
    // 0 <-> 1, 2 <-> 3, 2 -> 1 (cross edge)
    const adj = adjOf(4, [[0, 1], [1, 0], [2, 3], [3, 2], [2, 1]], true);
    assert.deepEqual(canon(tarjanSCC(4, adj)), [[0, 1], [2, 3]]);
  });
  it('Tarjan returns SCCs in reverse topological order of the condensation', () => {
    const comps = tarjanSCC(6, adjOf(6, dir, true));
    const pos = new Map();
    comps.forEach((c, i) => c.forEach((v) => pos.set(v, i)));
    for (const [u, v] of dir) assert.ok(pos.get(u) >= pos.get(v));
  });
  it('Tarjan vs Kosaraju vs brute-force reachability on random digraphs', () => {
    const rand = mulberry32(1234);
    for (let t = 0; t < 200; t++) {
      const n = 1 + Math.floor(rand() * 9);
      const edges = [];
      for (let i = 0; i < n * 2; i++) edges.push([Math.floor(rand() * n), Math.floor(rand() * n)]);
      const adj = adjOf(n, edges, true);
      const expected = canon(bruteSCC(n, adj));
      assert.deepEqual(canon(tarjanSCC(n, adj)), expected);
      assert.deepEqual(canon(kosarajuSCC(n, adj)), expected);
    }
  });
});

describe('findBridges', () => {
  it('triangle with a tail', () => {
    assert.deepEqual(canonEdges(findBridges(5, [[0, 1], [1, 2], [2, 0], [1, 3], [3, 4]])), [[1, 3], [3, 4]]);
  });
  it('no edges -> no bridges; a tree -> every edge', () => {
    assert.deepEqual(findBridges(3, []), []);
    assert.deepEqual(canonEdges(findBridges(4, [[0, 1], [1, 2], [1, 3]])), [[0, 1], [1, 2], [1, 3]]);
  });
  it('parallel edges are not bridges', () => {
    assert.deepEqual(findBridges(3, [[0, 1], [0, 1], [1, 2]]), [[1, 2]]);
  });
  it('disconnected graph: bridges in every component', () => {
    assert.deepEqual(canonEdges(findBridges(5, [[0, 1], [2, 3], [3, 4], [4, 2]])), [[0, 1]]);
  });
  it('matches remove-each-edge brute force on random graphs', () => {
    const rand = mulberry32(77);
    for (let t = 0; t < 200; t++) {
      const n = 1 + Math.floor(rand() * 8);
      const edges = randomSimpleEdges(rand, n, 0.35);
      assert.deepEqual(canonEdges(findBridges(n, edges)), canonEdges(bruteBridges(n, edges)));
    }
  });
});

describe('articulationPoints', () => {
  it('path and cycle', () => {
    assert.deepEqual(articulationPoints(3, [[0, 1], [1, 2]]), [1]);
    assert.deepEqual(articulationPoints(3, [[0, 1], [1, 2], [2, 0]]), []);
  });
  it('root with two DFS children is a cut vertex (star)', () => {
    assert.deepEqual(articulationPoints(4, [[0, 1], [0, 2], [0, 3]]), [0]);
  });
  it('isolated vertices are never cut vertices', () => {
    assert.deepEqual(articulationPoints(3, []), []);
  });
  it('matches remove-each-vertex brute force on random simple graphs', () => {
    const rand = mulberry32(555);
    for (let t = 0; t < 200; t++) {
      const n = 1 + Math.floor(rand() * 8);
      const edges = randomSimpleEdges(rand, n, 0.35);
      assert.deepEqual(articulationPoints(n, edges), bruteArticulation(n, edges));
    }
  });
});

describe('hierholzer', () => {
  it('itinerary example in lexical order', () => {
    const adj = new Map([['JFK', ['ATL', 'SFO']], ['SFO', ['ATL']], ['ATL', ['JFK', 'SFO']]]);
    assert.deepEqual(hierholzer(adj, 'JFK'), ['JFK', 'ATL', 'JFK', 'SFO', 'ATL', 'SFO']);
  });
  it('no edges -> just the start', () => {
    assert.deepEqual(hierholzer(new Map(), 'A'), ['A']);
  });
  it('handles a dead-end branch that must be visited last', () => {
    // 0 -> 1 (dead end), 0 -> 2 -> 0 : greedy takes 0->1 first, gets stuck, still correct
    const path = hierholzer(new Map([[0, [1, 2]], [2, [0]]]), 0);
    assert.deepEqual(path, [0, 2, 0, 1]);
  });
  it('uses every edge exactly once on random Eulerian circuits', () => {
    const rand = mulberry32(9);
    for (let t = 0; t < 100; t++) {
      // build a random closed walk -> its edge multiset always has an Eulerian circuit
      const n = 2 + Math.floor(rand() * 5);
      const walk = [0];
      const len = 1 + Math.floor(rand() * 12);
      for (let i = 0; i < len; i++) walk.push(Math.floor(rand() * n));
      walk.push(0);
      const adj = new Map();
      const multiset = new Map();
      for (let i = 0; i + 1 < walk.length; i++) {
        const [u, v] = [walk[i], walk[i + 1]];
        if (!adj.has(u)) adj.set(u, []);
        adj.get(u).push(v);
        multiset.set(`${u}>${v}`, (multiset.get(`${u}>${v}`) ?? 0) + 1);
      }
      const path = hierholzer(adj, 0);
      assert.equal(path.length, walk.length);
      assert.equal(path[0], 0);
      for (let i = 0; i + 1 < path.length; i++) {
        const key = `${path[i]}>${path[i + 1]}`;
        assert.ok(multiset.get(key) > 0, `edge ${key} used too often`);
        multiset.set(key, multiset.get(key) - 1);
      }
    }
  });
});

describe('solution files: extra edge cases', () => {
  const bip = require('../03_Problems/solutions/01_is_graph_bipartite');
  const bipart = require('../03_Problems/solutions/02_possible_bipartition');
  const bus = require('../03_Problems/solutions/05_bus_routes');
  const crit = require('../03_Problems/solutions/07_critical_connections');
  const itin = require('../03_Problems/solutions/08_reconstruct_itinerary');

  it('Is Graph Bipartite: disconnected odd cycle', () => {
    for (const f of [bip.optimal, bip.bruteForce]) {
      assert.equal(f([[1], [0], [3, 4], [2, 4], [2, 3]]), false);
      assert.equal(f([[]]), true);
    }
  });
  it('Possible Bipartition: no dislikes, odd cycle of dislikes', () => {
    for (const f of [bipart.optimal, bipart.unionFindVersion]) {
      assert.equal(f(3, []), true);
      assert.equal(f(3, [[1, 2], [2, 3], [1, 3]]), false);
    }
  });
  it('Bus Routes: source === target, unreachable target', () => {
    for (const f of [bus.optimal, bus.routeGraphVersion]) {
      assert.equal(f([[1, 2, 3]], 5, 5), 0);
      assert.equal(f([[1, 2], [3, 4]], 1, 4), -1);
    }
  });
  it('Critical Connections: cycle has none, path has all', () => {
    for (const f of [crit.optimal, crit.bruteForce]) {
      assert.deepEqual(f(3, [[0, 1], [1, 2], [2, 0]]), []);
      assert.deepEqual(canonEdges(f(3, [[0, 1], [1, 2]])), [[0, 1], [1, 2]]);
    }
  });
  it('Reconstruct Itinerary: single ticket, forced dead end', () => {
    for (const f of [itin.optimal, itin.bruteForce]) {
      assert.deepEqual(f([['JFK', 'AAA']]), ['JFK', 'AAA']);
      assert.deepEqual(f([['JFK', 'KUL'], ['JFK', 'NRT'], ['NRT', 'JFK']]), ['JFK', 'NRT', 'JFK', 'KUL']);
    }
  });
});

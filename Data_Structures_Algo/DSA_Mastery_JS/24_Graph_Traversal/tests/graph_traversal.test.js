// node --test 24_Graph_Traversal/tests/graph_traversal.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const T = require('../02_Implementations/traversals');
const { buildAdjList } = require('../../23_Graphs/02_Implementations/graph');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// Brute-force unit-weight distances: Bellman-Ford style relaxation (n - 1 rounds over every edge).
function relaxDistances(adj, s) {
  const n = adj.length, dist = new Array(n).fill(Infinity);
  dist[s] = 0;
  for (let round = 0; round < n; round++) {
    for (let u = 0; u < n; u++) for (const v of adj[u]) if (dist[u] + 1 < dist[v]) dist[v] = dist[u] + 1;
  }
  return dist.map((d) => (d === Infinity ? -1 : d));
}
function randomGraph(rnd, directed) {
  const n = 1 + Math.floor(rnd() * 12);
  const edges = Array.from({ length: Math.floor(rnd() * 20) }, () => [Math.floor(rnd() * n), Math.floor(rnd() * n)]); // may include self loops, repeats
  return { n, edges, adj: buildAdjList(n, edges, directed) };
}
function randomGrid(rnd, wallChance = 0.3) {
  const rows = 1 + Math.floor(rnd() * 6), cols = 1 + Math.floor(rnd() * 6);
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => (rnd() < wallChance ? 1 : 0)));
}
// Grid -> adjacency list so grid BFS can be checked with the same relaxation reference.
function gridAdj(grid) {
  const R = grid.length, C = grid[0].length, adj = Array.from({ length: R * C }, () => []);
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    if (grid[r][c] === 1) continue;
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nc >= 0 && nr < R && nc < C && grid[nr][nc] === 0) adj[r * C + c].push(nr * C + nc);
    }
  }
  return adj;
}

describe('bfs / bfsLevels', () => {
  it('single vertex and unreachable vertices', () => {
    assert.deepEqual(T.bfs([[]], 0), [0]);
    assert.deepEqual(T.bfs(buildAdjList(3, [[0, 1]]), 0), [0, 1, -1]);
    assert.deepEqual(T.bfsLevels([[]], 0), [[0]]);
  });
  it('cycle: distances go both ways around', () => {
    const adj = buildAdjList(6, [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]]);
    assert.deepEqual(T.bfs(adj, 0), [0, 1, 2, 3, 2, 1]);
  });
  it('directed edges are one-way', () => {
    const adj = buildAdjList(3, [[0, 1], [1, 2]], true);
    assert.deepEqual(T.bfs(adj, 2), [-1, -1, 0]);
    assert.deepEqual(T.bfs(adj, 0), [0, 1, 2]);
  });
  it('random graphs: BFS distances equal relaxation distances; levels agree', () => {
    const rnd = mulberry32(24);
    for (let t = 0; t < 300; t++) {
      const { n, adj } = randomGraph(rnd, rnd() < 0.5);
      const s = Math.floor(rnd() * n);
      const dist = T.bfs(adj, s);
      assert.deepEqual(dist, relaxDistances(adj, s));
      const levels = T.bfsLevels(adj, s);
      levels.forEach((level, d) => level.forEach((v) => assert.equal(dist[v], d)));
      assert.equal(levels.flat().length, dist.filter((d) => d !== -1).length);
    }
  });
});

describe('dfsRecursive / dfsIterative', () => {
  it('same order on a known graph; self loop does not loop forever', () => {
    const adj = buildAdjList(5, [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [4, 4]]);
    assert.deepEqual(T.dfsRecursive(adj, 0), [0, 1, 3, 2, 4]);
    assert.deepEqual(T.dfsIterative(adj, 0), T.dfsRecursive(adj, 0));
  });
  it('random graphs: identical orders, each vertex once, same reachable set as BFS', () => {
    const rnd = mulberry32(7);
    for (let t = 0; t < 300; t++) {
      const { n, adj } = randomGraph(rnd, rnd() < 0.5);
      const s = Math.floor(rnd() * n);
      const rec = T.dfsRecursive(adj, s), it2 = T.dfsIterative(adj, s);
      assert.deepEqual(it2, rec);
      assert.equal(new Set(rec).size, rec.length);
      const reach = T.bfs(adj, s).map((d, v) => (d !== -1 ? v : -1)).filter((v) => v !== -1);
      assert.deepEqual([...rec].sort((a, b) => a - b), reach);
    }
  });
});

describe('countComponents', () => {
  it('no edges, all connected, disconnected with isolated vertices', () => {
    assert.equal(T.countComponents(4, []), 4);
    assert.equal(T.countComponents(1, []), 1);
    assert.equal(T.countComponents(3, [[0, 1], [1, 2]]), 1);
    assert.equal(T.countComponents(5, [[0, 1], [3, 4]]), 3);
    assert.equal(T.countComponents(3, [[0, 0], [1, 2], [2, 1]]), 2); // self loop, repeated edge
  });
  it('matches a union-find count on random graphs', () => {
    const rnd = mulberry32(323);
    for (let t = 0; t < 300; t++) {
      const { n, edges } = randomGraph(rnd, false);
      const parent = [...Array(n).keys()];
      const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
      let comps = n;
      for (const [u, v] of edges) { const a = find(u), b = find(v); if (a !== b) { parent[a] = b; comps--; } }
      assert.equal(T.countComponents(n, edges), comps);
    }
  });
});

describe('grid BFS', () => {
  it('walls block, unreachable cells stay -1, 1x1 grid', () => {
    assert.deepEqual(T.bfsGrid([[0]], 0, 0), [[0]]);
    assert.deepEqual(T.bfsGrid([[0, 1, 0]], 0, 0), [[0, -1, -1]]);
  });
  it('single-source grid BFS matches relaxation on random grids', () => {
    const rnd = mulberry32(1091);
    for (let t = 0; t < 200; t++) {
      const grid = randomGrid(rnd);
      const C = grid[0].length;
      const opens = [];
      grid.forEach((row, r) => row.forEach((x, c) => { if (x === 0) opens.push([r, c]); }));
      if (!opens.length) continue;
      const [sr, sc] = opens[Math.floor(rnd() * opens.length)];
      const ref = relaxDistances(gridAdj(grid), sr * C + sc);
      assert.deepEqual(T.bfsGrid(grid, sr, sc).flat(), ref);
    }
  });
  it('multi-source BFS equals the minimum over single-source runs', () => {
    const rnd = mulberry32(994);
    for (let t = 0; t < 150; t++) {
      const grid = randomGrid(rnd);
      const opens = [];
      grid.forEach((row, r) => row.forEach((x, c) => { if (x === 0) opens.push([r, c]); }));
      if (!opens.length) continue;
      const sources = opens.filter(() => rnd() < 0.3);
      if (!sources.length) sources.push(opens[0]);
      const multi = T.multiSourceBfs(grid, sources);
      const singles = sources.map(([r, c]) => T.bfsGrid(grid, r, c));
      multi.forEach((row, r) => row.forEach((d, c) => {
        const ds = singles.map((s) => s[r][c]).filter((x) => x !== -1);
        assert.equal(d, ds.length ? Math.min(...ds) : -1);
      }));
    }
  });
});

describe('floodFill', () => {
  it('same colour returns image unchanged; diagonal cells are not connected', () => {
    const img = [[1, 1], [0, 1]];
    assert.deepEqual(T.floodFill(img.map((r) => [...r]), 0, 0, 1), img);
    assert.deepEqual(T.floodFill([[1, 0], [0, 1]], 0, 0, 2), [[2, 0], [0, 1]]);
  });
  it('matches a BFS reference on random images', () => {
    const rnd = mulberry32(733);
    for (let t = 0; t < 200; t++) {
      const img = randomGrid(rnd, 0.5).map((row) => row.map((x) => x + Math.floor(rnd() * 2)));
      const r0 = Math.floor(rnd() * img.length), c0 = Math.floor(rnd() * img[0].length), color = 5;
      const ref = img.map((r) => [...r]), old = ref[r0][c0], q = [[r0, c0]];
      ref[r0][c0] = color;
      while (q.length) {
        const [r, c] = q.shift();
        for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nc >= 0 && nr < ref.length && nc < ref[0].length && ref[nr][nc] === old) { ref[nr][nc] = color; q.push([nr, nc]); }
        }
      }
      assert.deepEqual(T.floodFill(img.map((r) => [...r]), r0, c0, color), ref);
    }
  });
});

describe('selected solutions on extra edge cases', () => {
  const islands = require('../03_Problems/solutions/05_number_of_islands');
  const validTree = require('../03_Problems/solutions/08_graph_valid_tree');
  const rot = require('../03_Problems/solutions/10_rotting_oranges');
  const lock = require('../03_Problems/solutions/17_open_the_lock');
  const ladder = require('../03_Problems/solutions/18_word_ladder');
  const rnd = mulberry32(200);
  it('number of islands: random grids, optimal vs brute (fresh copies, both mutate)', () => {
    for (let t = 0; t < 150; t++) {
      const g = randomGrid(rnd, 0.5).map((row) => row.map((x) => String(x)));
      assert.equal(islands.optimal(g.map((r) => [...r])), islands.bruteForce(g.map((r) => [...r])));
    }
  });
  it('graph valid tree: single node, cycle, disconnected forest, random vs brute', () => {
    assert.equal(validTree.optimal(1, []), true);
    assert.equal(validTree.optimal(3, [[0, 1], [1, 2], [2, 0]]), false);
    assert.equal(validTree.optimal(4, [[0, 1], [2, 3]]), false);
    for (let t = 0; t < 200; t++) {
      const n = 1 + Math.floor(rnd() * 7);
      const edges = Array.from({ length: Math.floor(rnd() * n + 1) }, () => [Math.floor(rnd() * n), Math.floor(rnd() * n)]).filter(([a, b]) => a !== b);
      assert.equal(validTree.optimal(n, edges), validTree.bruteForce(n, edges));
    }
  });
  it('rotting oranges: no fresh oranges, isolated fresh orange', () => {
    assert.equal(rot.optimal([[0, 2]]), 0);
    assert.equal(rot.optimal([[1]]), -1);
    assert.equal(rot.optimal([[2, 1, 1], [0, 1, 1], [1, 0, 1]]), -1);
  });
  it('open the lock: target is a deadend, start is a deadend, wrap-around 0 -> 9', () => {
    assert.equal(lock.optimal(['0009'], '0009'), -1);
    assert.equal(lock.optimal(['0000'], '0001'), -1);
    assert.equal(lock.optimal([], '0009'), 1);
  });
  it('word ladder: endWord missing, begin equals a list word, unreachable', () => {
    assert.equal(ladder.optimal('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log']), 0);
    assert.equal(ladder.optimal('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog']), 5);
    assert.equal(ladder.optimal('a', 'c', ['a', 'b', 'c']), 2);
    assert.equal(ladder.optimal('abc', 'xyz', ['xyz']), 0);
  });
});

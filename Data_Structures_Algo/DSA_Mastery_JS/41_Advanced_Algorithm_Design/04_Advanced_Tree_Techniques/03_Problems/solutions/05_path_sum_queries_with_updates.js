/**
 * 05. Path Sum Queries with Updates   (Original — Hard)
 *
 * PROBLEM
 * A tree has n nodes 0..n-1 (root it anywhere you like). Node v holds values[v].
 * Process queries in order:
 *   ['update', v, x]  -> set values[v] = x
 *   ['path', u, v]    -> report the sum of values of every node on the path u..v
 *                        (both endpoints included)
 * Return the answers of all 'path' queries, in order.
 *
 * EXAMPLES
 *        0(1) - 1(2) - 2(3)
 *               |
 *               3(4) - 4(5)
 * edges = [[0,1],[1,2],[1,3],[3,4]], values = [1,2,3,4,5]
 * queries = [['path',0,4], ['path',2,4], ['update',1,10], ['path',0,2], ['path',3,3]]
 *   -> [12, 14, 14, 4]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n, q up to 10^5; values fit comfortably in a double.
 * - u may equal v -> just values[u].
 *
 * APPROACH 1 — Brute force   O(n) per query
 * Root at 0, store parent and depth. For a path query, repeatedly lift the deeper endpoint
 * (adding its value) until both meet at the LCA, then add the LCA once.
 *
 * APPROACH 2 — Optimal (heavy-light decomposition + Fenwick)   O(n + q log^2 n)
 * - size[v] = subtree size; heavy[v] = child with the largest subtree.
 * - Heavy edges form chains. Any root path crosses O(log n) light edges (each light edge at
 *   least halves the subtree size), so any u..v path is O(log n) chain pieces.
 * - Lay out each chain contiguously: pos[v]; head[v] = top of v's chain.
 * - Store values[v] at pos[v] in a Fenwick tree.
 * - Query: while u and v are in different chains, take the one whose chain head is DEEPER,
 *   add range pos[head]..pos[node], jump to parent[head]. When in the same chain, add the
 *   range between them. Update: point add at pos[v].
 *
 * Dry run on the example, root 0:
 *   size = [5,4,1,2,1]; heavy[0]=1, heavy[1]=3, heavy[3]=4
 *   chain A: 0,1,3,4 -> pos 0,1,2,3   chain B: 2 -> pos 4    head = [0,0,2,0,0]
 *   path(2,4): head[2]=2 (depth 2) vs head[4]=0 (depth 0) -> take 2: add pos 4..4 = 3,
 *              u = parent[2] = 1. Same chain now: add pos 1..3 = 2+4+5 = 11 -> 14
 *
 * EDGE CASES
 * - n = 1
 * - u = v
 * - u is an ancestor of v (one chain piece may be the whole answer)
 * - long path tree (one chain, iterative build)
 */

function adjacency(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  return adj;
}

function rootTree(adj) {
  const n = adj.length;
  const parent = new Array(n).fill(-1);
  const depth = new Array(n).fill(0);
  const order = [0];
  const seen = new Array(n).fill(false);
  seen[0] = true;
  for (let h = 0; h < order.length; h++) {
    const u = order[h];
    for (const v of adj[u]) if (!seen[v]) { seen[v] = true; parent[v] = u; depth[v] = depth[u] + 1; order.push(v); }
  }
  return { parent, depth, order };
}

function bruteForce(n, edges, values, queries) {
  const { parent, depth } = rootTree(adjacency(n, edges));
  const vals = values.slice();
  const out = [];
  for (const q of queries) {
    if (q[0] === 'update') { vals[q[1]] = q[2]; continue; }
    let [, u, v] = q;
    let s = 0;
    while (u !== v) {
      if (depth[u] < depth[v]) [u, v] = [v, u];
      s += vals[u];
      u = parent[u];
    }
    out.push(s + vals[u]);
  }
  return out;
}

function optimal(n, edges, values, queries) {
  const adj = adjacency(n, edges);
  const { parent, depth, order } = rootTree(adj); // BFS order: parents before children
  const size = new Array(n).fill(1);
  for (let i = n - 1; i > 0; i--) size[parent[order[i]]] += size[order[i]];
  const heavy = new Array(n).fill(-1);
  for (let u = 0; u < n; u++) {
    let best = 0;
    for (const v of adj[u]) if (v !== parent[u] && size[v] > best) { best = size[v]; heavy[u] = v; }
  }
  const head = new Array(n);
  const pos = new Array(n);
  let cur = 0;
  const heads = [0];
  while (heads.length) {
    const h = heads.pop();
    for (let u = h; u !== -1; u = heavy[u]) {
      head[u] = h;
      pos[u] = cur++;
      for (const v of adj[u]) if (v !== parent[u] && v !== heavy[u]) heads.push(v);
    }
  }

  const bit = new Array(n + 1).fill(0);
  const add = (i, d) => { for (i++; i <= n; i += i & -i) bit[i] += d; };
  const prefix = i => { let s = 0; for (i++; i > 0; i -= i & -i) s += bit[i]; return s; };
  const range = (l, r) => prefix(r) - prefix(l - 1);
  const vals = values.slice();
  for (let v = 0; v < n; v++) add(pos[v], vals[v]);

  const out = [];
  for (const q of queries) {
    if (q[0] === 'update') {
      add(pos[q[1]], q[2] - vals[q[1]]);
      vals[q[1]] = q[2];
      continue;
    }
    let [, u, v] = q;
    let s = 0;
    while (head[u] !== head[v]) {
      if (depth[head[u]] < depth[head[v]]) [u, v] = [v, u];
      s += range(pos[head[u]], pos[u]);
      u = parent[head[u]];
    }
    if (depth[u] > depth[v]) [u, v] = [v, u];
    out.push(s + range(pos[u], pos[v]));
  }
  return out;
}

// ---------- tests ----------
const assert = require('assert');
const E = [[0, 1], [1, 2], [1, 3], [3, 4]];
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(5, E, [1, 2, 3, 4, 5], [['path', 0, 4], ['path', 2, 4], ['update', 1, 10], ['path', 0, 2], ['path', 3, 3]]), [12, 14, 14, 4]);
  assert.deepStrictEqual(solve(1, [], [5], [['path', 0, 0], ['update', 0, -1], ['path', 0, 0]]), [5, -1]);
  assert.deepStrictEqual(solve(5, E, [1, 2, 3, 4, 5], [['path', 4, 0]]), [12]); // order does not matter
  assert.deepStrictEqual(solve(5, E, [0, 0, 0, 0, 0], [['path', 2, 4]]), [0]);
  assert.deepStrictEqual(solve(4, [[0, 1], [0, 2], [0, 3]], [1, -1, -2, -3], [['path', 1, 3], ['path', 2, 2]]), [-3, -2]);
}
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(5);
const ri = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
for (let t = 0; t < 200; t++) {
  const n = ri(1, 20);
  const edges = [];
  for (let i = 1; i < n; i++) edges.push([i, ri(0, i - 1)]);
  const values = Array.from({ length: n }, () => ri(-9, 9));
  const queries = Array.from({ length: 20 }, () => (rand() < 0.3 ? ['update', ri(0, n - 1), ri(-9, 9)] : ['path', ri(0, n - 1), ri(0, n - 1)]));
  assert.deepStrictEqual(optimal(n, edges, values, queries), bruteForce(n, edges, values, queries));
}
console.log('✓ 05_path_sum_queries_with_updates passed');

module.exports = { optimal, bruteForce };

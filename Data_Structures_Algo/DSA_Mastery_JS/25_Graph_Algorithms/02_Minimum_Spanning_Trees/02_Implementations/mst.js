/**
 * Minimum Spanning Tree (MST) algorithms in JavaScript.
 *
 * 1. kruskal   - sort edges by weight, add each edge unless it closes a cycle (union-find)
 * 2. prim      - grow one tree from a start node, always adding the cheapest edge that
 *                leaves the tree (min-heap)
 *
 * Both return { weight, edges } where edges are the chosen [u, v, w] triples, or
 * weight = -1 if the graph is not connected (no spanning tree exists).
 *
 * Kruskal: O(E log E) time, O(V) space.      Prim: O(E log V) time, O(V + E) space.
 */

const { UnionFind } = require('../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/02_Implementations/union_find');
const { MinHeap } = require('../../01_Shortest_Paths/02_Implementations/shortest_paths');

// ---------- 1. Kruskal ----------
function kruskal(n, edges) {
  const sorted = [...edges].sort((a, b) => a[2] - b[2]);   // cheapest first
  const uf = new UnionFind(n);
  const chosen = [];
  let weight = 0;
  for (const [u, v, w] of sorted) {
    if (uf.union(u, v)) {              // false => u and v already connected => skip
      chosen.push([u, v, w]);
      weight += w;
      if (chosen.length === n - 1) break;   // a tree on n nodes has n - 1 edges
    }
  }
  return chosen.length === n - 1 ? { weight, edges: chosen } : { weight: -1, edges: [] };
}

// ---------- 2. Prim ----------
function prim(n, edges, start = 0) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) {
    adj[u].push([v, w]);
    adj[v].push([u, w]);
  }
  const inTree = new Array(n).fill(false);
  const heap = new MinHeap();              // [weight, node, from]
  heap.push([0, start, -1]);
  const chosen = [];
  let weight = 0;
  let count = 0;
  while (!heap.isEmpty() && count < n) {
    const [w, node, from] = heap.pop();
    if (inTree[node]) continue;            // stale entry: node joined via a cheaper edge
    inTree[node] = true;
    count++;
    if (from !== -1) {
      chosen.push([from, node, w]);
      weight += w;
    }
    for (const [next, nextW] of adj[node]) {
      if (!inTree[next]) heap.push([nextW, next, node]);
    }
  }
  return count === n ? { weight, edges: chosen } : { weight: -1, edges: [] };
}

// ---------- self-test ----------
// (runs only when this file is executed directly, not when required by a problem)
if (require.main === module) {
const assert = require('assert');

//   0 --1-- 1
//   | \     |
//   4   3   2
//   |     \ |
//   2 --5-- 3
const edges = [[0, 1, 1], [0, 2, 4], [0, 3, 3], [1, 3, 2], [2, 3, 5]];
const k = kruskal(4, edges);
assert.strictEqual(k.weight, 7);                  // 1 + 2 + 4
assert.deepStrictEqual(k.edges, [[0, 1, 1], [1, 3, 2], [0, 2, 4]]);
const p = prim(4, edges);
assert.strictEqual(p.weight, 7);
assert.strictEqual(p.edges.length, 3);

// disconnected graph -> no spanning tree
assert.deepStrictEqual(kruskal(4, [[0, 1, 1], [2, 3, 1]]), { weight: -1, edges: [] });
assert.deepStrictEqual(prim(4, [[0, 1, 1], [2, 3, 1]]), { weight: -1, edges: [] });

// single node
assert.deepStrictEqual(kruskal(1, []), { weight: 0, edges: [] });
assert.deepStrictEqual(prim(1, []), { weight: 0, edges: [] });

// both agree on a bigger random graph
const big = [];
for (let i = 0; i < 30; i++) for (let j = i + 1; j < 30; j++) big.push([i, j, ((i * 7 + j * 13) % 17) + 1]);
assert.strictEqual(kruskal(30, big).weight, prim(30, big).weight);

console.log('✓ mst.js self-test passed');
}

module.exports = { kruskal, prim };

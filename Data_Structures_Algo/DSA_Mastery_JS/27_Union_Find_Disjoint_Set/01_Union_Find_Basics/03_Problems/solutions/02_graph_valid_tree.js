/**
 * 02. Graph Valid Tree   (LeetCode 261 — Medium)
 *
 * PROBLEM
 * n nodes and an undirected edge list. Return true if they form a tree: connected and
 * acyclic. (Also in 24_Graph_Traversal/problems/08 - here with union-find.)
 *
 * EXAMPLES
 * Input: n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]         Output: true
 * Input: n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]   Output: false (cycle)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n = 1, no edges -> true
 * - duplicate edge = cycle -> false
 *
 * APPROACH 1 — Alternative (DFS with parent + connectivity check)   O(V + E)
 * See the BFS/DFS folder. Shown as `dfsVersion`.
 *
 * APPROACH 2 — Optimal (Union-Find)   O(E * alpha(V)) time, O(V) space
 * A tree = no cycle + one component.
 *   1. For each edge: if union(u, v) returns false -> the edge closes a cycle -> false.
 *   2. After all edges: uf.count() === 1 -> connected -> true.
 * (Shortcut: if edges.length !== n - 1 return false immediately; then connectivity alone
 *  is enough. We keep the explicit cycle check because it is the reusable idea.)
 *
 * Dry run n=5, edges [[0,1],[1,2],[2,3],[1,3],[1,4]]:
 *   union(0,1) ok, union(1,2) ok, union(2,3) ok, union(1,3): find(1)=0, find(3)=0 -> false
 *   -> cycle -> return false
 *
 * EDGE CASES
 * - two separate trees (no cycle, count 2) -> false
 * - self loop [[0,0]] -> union returns false -> false
 */

const { UnionFind } = require('../../02_Implementations/union_find');
const { buildAdjList } = require('../../../../23_Graphs/02_Implementations/graph');

function dfsVersion(n, edges) {
  if (edges.length !== n - 1) return false;
  const adj = buildAdjList(n, edges);
  const visited = new Array(n).fill(false);
  let seen = 0;
  const stack = [0];
  visited[0] = true;
  while (stack.length) {
    const node = stack.pop();
    seen++;
    for (const next of adj[node]) {
      if (!visited[next]) { visited[next] = true; stack.push(next); }
    }
  }
  return seen === n;
}

function optimal(n, edges) {
  const uf = new UnionFind(n);
  for (const [u, v] of edges) {
    if (!uf.union(u, v)) return false;   // already connected -> this edge makes a cycle
  }
  return uf.count() === 1;               // everything merged into one set
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [dfsVersion, optimal]) {
  assert.strictEqual(solve(5, [[0, 1], [0, 2], [0, 3], [1, 4]]), true);
  assert.strictEqual(solve(5, [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]]), false);
  assert.strictEqual(solve(2, []), false);
  assert.strictEqual(solve(1, []), true);
  assert.strictEqual(solve(4, [[0, 1], [2, 3]]), false);           // two components
  assert.strictEqual(solve(4, [[0, 1], [1, 0], [2, 3]]), false);   // duplicate edge
  assert.strictEqual(solve(3, [[0, 1], [1, 2], [2, 0]]), false);
}
console.log('✓ 02-graph-valid-tree passed');

module.exports = { optimal, dfsVersion };

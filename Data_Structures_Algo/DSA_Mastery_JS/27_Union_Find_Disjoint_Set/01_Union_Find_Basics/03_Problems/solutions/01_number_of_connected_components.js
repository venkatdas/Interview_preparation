/**
 * 01. Number of Connected Components in an Undirected Graph   (LeetCode 323 — Medium)
 *
 * PROBLEM
 * n nodes 0..n-1 and an undirected edge list. Return the number of connected components.
 * (Same problem as 24_Graph_Traversal/problems/07 - here we solve it with union-find.)
 *
 * EXAMPLES
 * Input: n = 5, edges = [[0,1],[1,2],[3,4]]        Output: 2
 * Input: n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]  Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Isolated nodes count as components? (yes)
 * - Duplicate edges? (harmless - the second union returns false)
 *
 * APPROACH 1 — Alternative (DFS over adjacency list)   O(V + E) time, O(V + E) space
 * Build the adjacency list, DFS from every unvisited node, count the starts.
 * Shown as `dfsVersion`; it is the standard solution when the graph is static.
 *
 * APPROACH 2 — Optimal (Union-Find)   O(E * alpha(V)) time, O(V) space
 *   1. uf = new UnionFind(n)  -> count = n
 *   2. for each edge union(u, v); each SUCCESSFUL union merges two components -> count--
 *   3. return uf.count()
 * No adjacency list at all, and it keeps working if edges keep arriving.
 *
 * Dry run n=5, edges [[0,1],[1,2],[3,4]]:
 *   count 5
 *   union(0,1) true -> 4
 *   union(1,2) true -> 3
 *   union(3,4) true -> 2
 *   answer 2
 *
 * EDGE CASES
 * - no edges -> n
 * - n = 1 -> 1
 * - duplicate edge -> no double-decrement (union returns false)
 */

const { UnionFind } = require('../../02_Implementations/union_find');
const { buildAdjList } = require('../../../../23_Graphs/02_Implementations/graph');

function dfsVersion(n, edges) {
  const adj = buildAdjList(n, edges);
  const visited = new Array(n).fill(false);
  let count = 0;
  for (let start = 0; start < n; start++) {
    if (visited[start]) continue;
    count++;
    const stack = [start];
    visited[start] = true;
    while (stack.length) {
      const node = stack.pop();
      for (const next of adj[node]) {
        if (!visited[next]) { visited[next] = true; stack.push(next); }
      }
    }
  }
  return count;
}

function optimal(n, edges) {
  const uf = new UnionFind(n);
  for (const [u, v] of edges) uf.union(u, v);   // count drops on every real merge
  return uf.count();
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [dfsVersion, optimal]) {
  assert.strictEqual(solve(5, [[0, 1], [1, 2], [3, 4]]), 2);
  assert.strictEqual(solve(5, [[0, 1], [1, 2], [2, 3], [3, 4]]), 1);
  assert.strictEqual(solve(4, []), 4);
  assert.strictEqual(solve(1, []), 1);
  assert.strictEqual(solve(3, [[0, 1], [0, 1]]), 2);
  assert.strictEqual(solve(6, [[0, 1], [2, 3], [4, 5], [1, 2]]), 2);
}
console.log('✓ 01-number-of-connected-components passed');

module.exports = { optimal, dfsVersion };

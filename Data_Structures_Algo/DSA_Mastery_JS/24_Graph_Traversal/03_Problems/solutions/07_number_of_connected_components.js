/**
 * 07. Number of Connected Components in an Undirected Graph   (LeetCode 323 — Medium)
 *
 * PROBLEM
 * n nodes 0..n-1 and an undirected edge list. Return how many connected components
 * (separate "islands" of nodes) the graph has.
 *
 * EXAMPLES
 * Input: n = 5, edges = [[0,1],[1,2],[3,4]]        Output: 2   ({0,1,2} and {3,4})
 * Input: n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]  Output: 1
 * Input: n = 4, edges = []                         Output: 4   (every node is alone)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can there be isolated nodes not in any edge? (yes - that is why we loop 0..n-1)
 * - Duplicate edges? (harmless)
 *
 * APPROACH 1 — Brute force (label propagation)   O(n * E) time, O(n) space
 * Give each node label = its own id. Repeat: for every edge (u, v) set both labels to the
 * smaller one. Stop when a pass changes nothing. Count distinct labels. Up to n passes,
 * each O(E).
 *
 * APPROACH 2 — Optimal (DFS, count starts)   O(V + E) time, O(V + E) space
 *   1. Build adjacency list.
 *   2. For node in 0..n-1: if unvisited -> count++, DFS marks its whole component.
 * Every time we need to START a new DFS, we have found a new component.
 *
 * Dry run n=5, edges [[0,1],[1,2],[3,4]]:
 *   node 0 unvisited -> count=1, DFS marks 0,1,2
 *   node 1, 2 visited, skip
 *   node 3 unvisited -> count=2, DFS marks 3,4
 *   node 4 visited. Answer 2.
 *
 * (Union-Find version in 27_Union_Find_Disjoint_Set/01_Union_Find_Basics/problems/01.)
 *
 * EDGE CASES
 * - no edges -> n
 * - n = 1 -> 1
 * - complete graph -> 1
 */

const { buildAdjList } = require('../../../23_Graphs/02_Implementations/graph');

function bruteForce(n, edges) {
  const label = Array.from({ length: n }, (_, i) => i);
  let changed = true;
  while (changed) {
    changed = false;
    for (const [u, v] of edges) {
      const smaller = Math.min(label[u], label[v]);
      if (label[u] !== smaller || label[v] !== smaller) {
        label[u] = smaller;
        label[v] = smaller;
        changed = true;
      }
    }
  }
  return new Set(label).size;
}

function optimal(n, edges) {
  const adj = buildAdjList(n, edges);
  const visited = new Array(n).fill(false);

  function dfs(node) {
    visited[node] = true;
    for (const next of adj[node]) {
      if (!visited[next]) dfs(next);
    }
  }

  let count = 0;
  for (let node = 0; node < n; node++) {
    if (!visited[node]) {
      count++;        // a fresh start = a new component
      dfs(node);
    }
  }
  return count;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(5, [[0, 1], [1, 2], [3, 4]]), 2);
  assert.strictEqual(solve(5, [[0, 1], [1, 2], [2, 3], [3, 4]]), 1);
  assert.strictEqual(solve(4, []), 4);
  assert.strictEqual(solve(1, []), 1);
  assert.strictEqual(solve(3, [[0, 1], [0, 1]]), 2);          // duplicate edge
  assert.strictEqual(solve(6, [[0, 1], [2, 3], [4, 5], [1, 2]]), 2);
}
console.log('✓ 07-number-of-connected-components passed');

module.exports = { optimal, bruteForce };

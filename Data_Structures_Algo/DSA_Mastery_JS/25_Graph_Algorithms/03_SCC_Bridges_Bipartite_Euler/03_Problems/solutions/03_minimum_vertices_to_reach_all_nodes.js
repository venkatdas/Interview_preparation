/**
 * 03. Minimum Number of Vertices to Reach All Nodes   (LeetCode 1557 — Medium)
 *
 * PROBLEM
 * A directed ACYCLIC graph with n nodes and an edge list. Return the smallest set of
 * nodes from which every node in the graph is reachable. The answer is unique.
 *
 * EXAMPLES
 * Input: n = 6, edges = [[0,1],[0,2],[2,5],[3,4],[4,2]]   Output: [0,3]
 * Input: n = 5, edges = [[0,1],[2,1],[3,1],[1,4],[2,4]]   Output: [0,2,3]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Guaranteed acyclic? (yes - this matters: in a cycle no node has in-degree 0, and the
 *   simple rule would fail)
 * - Output order? (any; we return ascending)
 *
 * KEY INSIGHT: a node with an incoming edge is reachable from its predecessor, so it
 * never needs to be in the set. A node with NO incoming edge can only be reached by
 * starting there. In a DAG the answer is exactly the nodes with in-degree 0.
 *
 * APPROACH 1 — Brute force (greedy with reachability)   O(n * (n + E))
 * For each node compute the set it reaches (DFS). Then a node is needed iff no OTHER
 * node reaches it. Correct, but n DFS runs.
 *
 * APPROACH 2 — Optimal (in-degree 0)   O(n + E) time, O(n) space
 * Mark every node that appears as a destination; return the unmarked ones.
 *
 * Dry run n=6, edges [[0,1],[0,2],[2,5],[3,4],[4,2]]:
 *   destinations {1,2,5,4} -> unmarked {0,3} -> [0,3]
 *
 * EDGE CASES
 * - no edges -> every node
 * - a single chain -> just the head
 */

function bruteForce(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) adj[u].push(v);
  const reachedByOther = new Array(n).fill(false);
  for (let start = 0; start < n; start++) {
    const visited = new Array(n).fill(false);
    const stack = [start];
    visited[start] = true;
    while (stack.length) {
      const u = stack.pop();
      for (const v of adj[u]) {
        if (!visited[v]) { visited[v] = true; stack.push(v); reachedByOther[v] = true; }
      }
    }
  }
  return reachedByOther.map((r, i) => (r ? -1 : i)).filter((i) => i !== -1);
}

function optimal(n, edges) {
  const hasIncoming = new Array(n).fill(false);
  for (const [, to] of edges) hasIncoming[to] = true;
  const result = [];
  for (let node = 0; node < n; node++) if (!hasIncoming[node]) result.push(node);
  return result;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(6, [[0, 1], [0, 2], [2, 5], [3, 4], [4, 2]]), [0, 3]);
  assert.deepStrictEqual(solve(5, [[0, 1], [2, 1], [3, 1], [1, 4], [2, 4]]), [0, 2, 3]);
  assert.deepStrictEqual(solve(3, []), [0, 1, 2]);
  assert.deepStrictEqual(solve(4, [[0, 1], [1, 2], [2, 3]]), [0]);
  assert.deepStrictEqual(solve(1, []), [0]);
  assert.deepStrictEqual(solve(4, [[3, 0], [3, 1], [3, 2]]), [3]);
}
console.log('✓ 03-minimum-vertices-to-reach-all-nodes passed');

module.exports = { optimal, bruteForce };

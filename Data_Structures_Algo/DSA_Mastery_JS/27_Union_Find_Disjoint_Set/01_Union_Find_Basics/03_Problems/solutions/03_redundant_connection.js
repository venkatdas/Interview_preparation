/**
 * 03. Redundant Connection   (LeetCode 684 — Medium)
 *
 * PROBLEM
 * A tree with n nodes (1..n) had ONE extra edge added, creating exactly one cycle. Given
 * the resulting edge list, return the edge that can be removed to make it a tree again.
 * If several answers exist, return the one that appears LAST in the input.
 *
 * EXAMPLES
 * Input: [[1,2],[1,3],[2,3]]                 Output: [2,3]
 * Input: [[1,2],[2,3],[3,4],[1,4],[1,5]]     Output: [1,4]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Nodes are 1-indexed? (yes, allocate n + 1)
 * - Exactly one extra edge? (yes -> exactly one union will fail)
 * - "Last in input" tie-break -> process edges in order, the FIRST failing union is the
 *   last edge of the cycle in input order, which is what we want.
 *
 * APPROACH 1 — Brute force (remove each edge from the end, test for tree)   O(E * (V+E))
 * Iterate edges from last to first; remove it and check whether the remaining graph is
 * connected (DFS). The first such edge is the answer.
 *
 * APPROACH 2 — Optimal (Union-Find, first failed union)   O(E * alpha(V)) time, O(V)
 * Add edges one by one. The moment union(u, v) returns false, u and v are already
 * connected, so [u, v] closes the cycle. Because edges are processed in input order, this
 * is the last cycle edge in the input.
 *
 * Dry run [[1,2],[2,3],[3,4],[1,4],[1,5]]:
 *   union(1,2) ok, union(2,3) ok, union(3,4) ok, union(1,4): same root -> return [1,4]
 *
 * EDGE CASES
 * - the redundant edge is the very first one that completes a triangle
 * - n = 3 triangle
 */

const { UnionFind } = require('../../02_Implementations/union_find');

function bruteForce(edges) {
  const n = edges.length;                            // n edges = n nodes (tree + 1 edge)
  function isConnectedWithout(skip) {
    const adj = Array.from({ length: n + 1 }, () => []);
    edges.forEach(([u, v], i) => {
      if (i === skip) return;
      adj[u].push(v);
      adj[v].push(u);
    });
    const visited = new Array(n + 1).fill(false);
    const stack = [1];
    visited[1] = true;
    let seen = 0;
    while (stack.length) {
      const node = stack.pop();
      seen++;
      for (const next of adj[node]) if (!visited[next]) { visited[next] = true; stack.push(next); }
    }
    return seen === n;
  }
  for (let i = n - 1; i >= 0; i--) {
    if (isConnectedWithout(i)) return edges[i];
  }
  return [];
}

function optimal(edges) {
  const uf = new UnionFind(edges.length + 1);         // 1-indexed nodes
  for (const [u, v] of edges) {
    if (!uf.union(u, v)) return [u, v];                // closes a cycle
  }
  return [];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([[1, 2], [1, 3], [2, 3]]), [2, 3]);
  assert.deepStrictEqual(solve([[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]), [1, 4]);
  assert.deepStrictEqual(solve([[1, 2], [2, 3], [1, 3]]), [1, 3]);
  assert.deepStrictEqual(solve([[1, 2], [2, 1]]), [2, 1]);
  assert.deepStrictEqual(solve([[3, 4], [1, 2], [2, 4], [3, 5], [2, 5]]), [2, 5]);
}
console.log('✓ 03-redundant-connection passed');

module.exports = { optimal, bruteForce };

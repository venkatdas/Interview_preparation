/**
 * 01. Minimum Spanning Tree Weight (basic)   (classic — Easy)
 *
 * PROBLEM
 * Given n nodes 0..n-1 and an undirected weighted edge list [u, v, w], return the total
 * weight of a minimum spanning tree, or -1 if the graph is not connected.
 *
 * EXAMPLES
 * Input: n = 4, edges = [[0,1,1],[0,2,4],[0,3,3],[1,3,2],[2,3,5]]   Output: 7
 * Explanation: edges 0-1 (1), 1-3 (2), 0-2 (4).
 * Input: n = 3, edges = [[0,1,1]]   Output: -1   (node 2 is unreachable)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Duplicate edges / self loops? (fine, skipped by union-find)
 * - n = 1 -> 0
 *
 * APPROACH 1 — Brute force (try every subset of n - 1 edges)   O(C(E, n-1) * n)
 * Enumerate every subset of exactly n - 1 edges, keep those that form a tree (connected,
 * via union-find), take the minimum weight. Exponential; fine for tests with <= 10 edges.
 *
 * APPROACH 2 — Optimal (Kruskal)   O(E log E) time, O(V) space
 *   1. Sort edges by weight.
 *   2. For each edge, union(u, v); if it succeeds add the weight.
 *   3. Stop after n - 1 successful unions. Fewer -> -1.
 * (`primVersion` shows the heap-based alternative; same answer.)
 *
 * Dry run on example 1:
 *   sorted: (0,1,1) (1,3,2) (0,3,3) (0,2,4) (2,3,5)
 *   take 1, take 2, skip 3 (0-3 already connected), take 4 -> 3 edges, total 7
 *
 * EDGE CASES
 * - disconnected -> -1
 * - exactly n - 1 edges forming a tree -> their sum
 * - heavier duplicate of an edge is ignored
 */

const { UnionFind } = require('../../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/02_Implementations/union_find');
const { prim } = require('../../02_Implementations/mst');

function bruteForce(n, edges) {
  if (n === 1) return 0;
  const need = n - 1;
  let best = Infinity;
  function choose(start, picked, weight) {
    if (picked.length === need) {
      const uf = new UnionFind(n);
      for (const i of picked) if (!uf.union(edges[i][0], edges[i][1])) return;
      best = Math.min(best, weight);
      return;
    }
    for (let i = start; i < edges.length; i++) {
      picked.push(i);
      choose(i + 1, picked, weight + edges[i][2]);
      picked.pop();
    }
  }
  choose(0, [], 0);
  return best === Infinity ? -1 : best;
}

function optimal(n, edges) {
  const sorted = [...edges].sort((a, b) => a[2] - b[2]);
  const uf = new UnionFind(n);
  let total = 0;
  let used = 0;
  for (const [u, v, w] of sorted) {
    if (!uf.union(u, v)) continue;            // would close a cycle
    total += w;
    if (++used === n - 1) break;              // tree complete
  }
  return used === n - 1 ? total : -1;
}

function primVersion(n, edges) {
  return prim(n, edges).weight;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal, primVersion]) {
  assert.strictEqual(solve(4, [[0, 1, 1], [0, 2, 4], [0, 3, 3], [1, 3, 2], [2, 3, 5]]), 7);
  assert.strictEqual(solve(3, [[0, 1, 1]]), -1);
  assert.strictEqual(solve(1, []), 0);
  assert.strictEqual(solve(2, [[0, 1, 9], [0, 1, 2]]), 2);
  assert.strictEqual(solve(3, [[0, 1, 1], [1, 2, 1], [0, 2, 1]]), 2);
  assert.strictEqual(solve(5, [[0, 1, 2], [1, 2, 3], [2, 3, 1], [3, 4, 4], [0, 4, 10]]), 10);
}
console.log('✓ 01-minimum-spanning-tree-weight passed');

module.exports = { optimal, bruteForce, primVersion };

/**
 * 05. Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree
 *     (LeetCode 1489 — Hard)
 *
 * PROBLEM
 * n nodes, edges[i] = [u, v, weight]. An edge is CRITICAL if removing it increases the
 * MST weight (or makes an MST impossible). An edge is PSEUDO-CRITICAL if it appears in
 * SOME MST but not all. Return [criticalIndices, pseudoCriticalIndices].
 *
 * EXAMPLES
 * Input: n = 5, edges = [[0,1,1],[1,2,1],[2,3,2],[0,3,2],[0,4,3],[3,4,3],[1,4,6]]
 * Output: [[0,1], [2,3,4,5]]
 * Explanation: MST weight is 7. Edges 0 and 1 are in every MST. Edges 2/3 are
 * interchangeable, so are 4/5. Edge 6 is in no MST.
 * Input: n = 4, edges = [[0,1,1],[1,2,1],[2,3,1],[0,3,1]]   Output: [[], [0,1,2,3]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n <= 100, edges <= 200 -> O(E^2 * alpha) is fine
 * - Output order inside each list? (any, we return ascending)
 *
 * APPROACH 1 — Brute force (enumerate all spanning trees)   exponential
 * Enumerate every subset of n - 1 edges that is a tree; among those with minimum weight,
 * an edge in ALL of them is critical, in SOME is pseudo-critical. Only for tiny inputs;
 * used as a test oracle.
 *
 * APPROACH 2 — Optimal (Kruskal with exclude / include)   O(E^2 * alpha(V))
 *   1. base = MST weight with plain Kruskal.
 *   2. For each edge i:
 *      a. Kruskal SKIPPING edge i. If the weight > base (or no tree) -> critical.
 *      b. Otherwise Kruskal with edge i FORCED first (union its ends, add its weight).
 *         If the weight === base -> pseudo-critical (it fits in some MST).
 *
 * Dry run on example 2 (4-cycle, all weight 1, base = 3):
 *   edge 0 skipped: 1+1+1 = 3 = base -> not critical. Forced: 1 + 2 more = 3 -> pseudo.
 *   same for every edge -> [[], [0,1,2,3]]
 *
 * EDGE CASES
 * - all weights equal in a cycle -> all pseudo-critical
 * - a bridge (only connection to some node) -> critical
 * - an edge heavier than any alternative -> neither
 */

const { UnionFind } = require('../../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/02_Implementations/union_find');

// Kruskal that can skip one edge index and/or force one edge index first.
function mstWeight(n, edges, order, skip = -1, force = -1) {
  const uf = new UnionFind(n);
  let total = 0;
  let used = 0;
  if (force !== -1) {
    const [u, v, w] = edges[force];
    uf.union(u, v);
    total += w;
    used++;
  }
  for (const i of order) {
    if (i === skip || i === force) continue;
    const [u, v, w] = edges[i];
    if (uf.union(u, v)) {
      total += w;
      used++;
    }
  }
  return used === n - 1 ? total : Infinity;
}

function bruteForce(n, edges) {
  const m = edges.length;
  const trees = [];                                   // minimum spanning trees as index sets
  let best = Infinity;
  function choose(start, picked, weight) {
    if (picked.length === n - 1) {
      const uf = new UnionFind(n);
      for (const i of picked) if (!uf.union(edges[i][0], edges[i][1])) return;
      if (weight < best) { best = weight; trees.length = 0; }
      if (weight === best) trees.push(new Set(picked));
      return;
    }
    for (let i = start; i < m; i++) {
      picked.push(i);
      choose(i + 1, picked, weight + edges[i][2]);
      picked.pop();
    }
  }
  choose(0, [], 0);
  const critical = [];
  const pseudo = [];
  for (let i = 0; i < m; i++) {
    const inHowMany = trees.filter((t) => t.has(i)).length;
    if (inHowMany === trees.length) critical.push(i);
    else if (inHowMany > 0) pseudo.push(i);
  }
  return [critical, pseudo];
}

function optimal(n, edges) {
  const order = edges.map((_, i) => i).sort((a, b) => edges[a][2] - edges[b][2]);
  const base = mstWeight(n, edges, order);
  const critical = [];
  const pseudo = [];
  for (let i = 0; i < edges.length; i++) {
    if (mstWeight(n, edges, order, i) > base) {       // without it, cost rises
      critical.push(i);
    } else if (mstWeight(n, edges, order, -1, i) === base) { // forced in, still optimal
      pseudo.push(i);
    }
  }
  return [critical, pseudo];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(
    solve(5, [[0, 1, 1], [1, 2, 1], [2, 3, 2], [0, 3, 2], [0, 4, 3], [3, 4, 3], [1, 4, 6]]),
    [[0, 1], [2, 3, 4, 5]],
  );
  assert.deepStrictEqual(solve(4, [[0, 1, 1], [1, 2, 1], [2, 3, 1], [0, 3, 1]]), [[], [0, 1, 2, 3]]);
  assert.deepStrictEqual(solve(2, [[0, 1, 5]]), [[0], []]);
  assert.deepStrictEqual(solve(3, [[0, 1, 1], [1, 2, 2], [0, 2, 3]]), [[0, 1], []]);
  assert.deepStrictEqual(solve(3, [[0, 1, 1], [1, 2, 1], [0, 2, 1]]), [[], [0, 1, 2]]);
  assert.deepStrictEqual(solve(4, [[0, 1, 1], [1, 2, 1], [2, 3, 1], [0, 2, 1], [1, 3, 5]]), [[2], [0, 1, 3]]);
}
console.log('✓ 05-critical-and-pseudo-critical-edges passed');

module.exports = { optimal, bruteForce };

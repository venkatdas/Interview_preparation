/**
 * 02. Min Cost to Connect All Points   (LeetCode 1584 — Medium)
 *
 * PROBLEM
 * points[i] = [x, y]. The cost of connecting two points is their Manhattan distance
 * |x1 - x2| + |y1 - y2|. Return the minimum cost to connect all points so that there is
 * a path between every pair.
 *
 * EXAMPLES
 * Input: [[0,0],[2,2],[3,10],[5,2],[7,0]]   Output: 20
 * Input: [[3,12],[-2,5],[-4,1]]             Output: 18
 * Input: [[0,0]]                            Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Up to 1000 points -> ~500k candidate edges; O(n^2) or O(n^2 log n) is fine
 * - Any two points can be connected directly? (yes, it is a complete graph)
 *
 * APPROACH 1 — Alternative (Kruskal on all n^2/2 edges)   O(n^2 log n) time, O(n^2) space
 * Generate every pair, sort by distance, union-find. Simple, but the sort of 500k edges
 * and the memory are the cost. Shown as `kruskalVersion`.
 *
 * APPROACH 2 — Optimal (Prim, array version, no heap)   O(n^2) time, O(n) space
 * On a COMPLETE graph the heap gains nothing (every node sees every other). Keep
 * minDist[i] = cheapest known edge from the tree to point i. Each round: pick the
 * unvisited point with the smallest minDist (O(n) scan), add it, update minDist for all
 * others (O(n)). n rounds -> O(n^2), and no edge list is ever materialised.
 *
 * Dry run on [[0,0],[2,2],[3,10],[5,2],[7,0]]:
 *   add 0: minDist = [_, 4, 13, 7, 7]
 *   add 1 (4): minDist = [_, _, 9, 3, 7]
 *   add 3 (3): minDist = [_, _, 9, _, 4]
 *   add 4 (4): minDist = [_, _, 9, _, _]   (3 -> 2 is 10, 4 -> 2 is 14)
 *   add 2 (9): total 4 + 3 + 4 + 9 = 20
 *
 * EDGE CASES
 * - single point -> 0
 * - two points -> their distance
 * - duplicate points -> distance 0 edge
 */

const { UnionFind } = require('../../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/02_Implementations/union_find');

const manhattan = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);

function kruskalVersion(points) {
  const n = points.length;
  const edges = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) edges.push([i, j, manhattan(points[i], points[j])]);
  }
  edges.sort((a, b) => a[2] - b[2]);
  const uf = new UnionFind(n);
  let total = 0;
  let used = 0;
  for (const [u, v, w] of edges) {
    if (uf.union(u, v)) {
      total += w;
      if (++used === n - 1) break;
    }
  }
  return total;
}

function optimal(points) {
  const n = points.length;
  const inTree = new Array(n).fill(false);
  const minDist = new Array(n).fill(Infinity);   // cheapest edge from the tree to i
  minDist[0] = 0;
  let total = 0;
  for (let round = 0; round < n; round++) {
    // 1. pick the closest point not yet in the tree
    let best = -1;
    for (let i = 0; i < n; i++) {
      if (!inTree[i] && (best === -1 || minDist[i] < minDist[best])) best = i;
    }
    inTree[best] = true;
    total += minDist[best];
    // 2. the new point may offer cheaper edges to the rest
    for (let i = 0; i < n; i++) {
      if (!inTree[i]) minDist[i] = Math.min(minDist[i], manhattan(points[best], points[i]));
    }
  }
  return total;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [kruskalVersion, optimal]) {
  assert.strictEqual(solve([[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]]), 20);
  assert.strictEqual(solve([[3, 12], [-2, 5], [-4, 1]]), 18);
  assert.strictEqual(solve([[0, 0]]), 0);
  assert.strictEqual(solve([[0, 0], [1, 1]]), 2);
  assert.strictEqual(solve([[0, 0], [0, 0], [5, 5]]), 10);
  assert.strictEqual(solve([[-1000000, -1000000], [1000000, 1000000]]), 4000000);
}
console.log('✓ 02-min-cost-to-connect-all-points passed');

module.exports = { optimal, kruskalVersion };

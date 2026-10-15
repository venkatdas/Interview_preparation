/**
 * 03. Connecting Cities With Minimum Cost   (LeetCode 1135 — Medium)
 *
 * PROBLEM
 * n cities labelled 1..n and connections[i] = [city1, city2, cost]. Return the minimum
 * cost to connect all cities (every pair reachable), or -1 if impossible.
 *
 * EXAMPLES
 * Input: n = 3, connections = [[1,2,5],[1,3,6],[2,3,1]]   Output: 6   (2-3 and 1-2)
 * Input: n = 4, connections = [[1,2,3],[3,4,4]]           Output: -1  (two separate pairs)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1-indexed cities? (yes -> allocate n + 1 or subtract 1)
 * - Multiple connections between the same pair? (possible; take the cheapest naturally)
 *
 * This is the textbook MST question; the only twist is detecting "impossible".
 *
 * APPROACH 1 — Alternative (Prim with a heap)   O(E log V)
 * Build adjacency, grow from city 1, count added cities; fewer than n -> -1.
 * Shown as `primVersion`.
 *
 * APPROACH 2 — Optimal (Kruskal)   O(E log E) time, O(V) space
 *   1. Sort connections by cost.
 *   2. union; add cost on success; count edges used.
 *   3. used === n - 1 ? total : -1
 *
 * Dry run n=3, [[1,2,5],[1,3,6],[2,3,1]]:
 *   sorted (2,3,1) (1,2,5) (1,3,6)
 *   take 1 -> {2,3}; take 5 -> {1,2,3} used 2 = n-1 -> 6
 *
 * EDGE CASES
 * - n = 1, no connections -> 0
 * - connections insufficient to connect -> -1
 * - redundant expensive edges are never picked
 */

const { UnionFind } = require('../../../../27_Union_Find_Disjoint_Set/01_Union_Find_Basics/02_Implementations/union_find');
const { MinHeap } = require('../../../01_Shortest_Paths/02_Implementations/shortest_paths');

function primVersion(n, connections) {
  const adj = Array.from({ length: n + 1 }, () => []);
  for (const [a, b, cost] of connections) { adj[a].push([b, cost]); adj[b].push([a, cost]); }
  const inTree = new Array(n + 1).fill(false);
  const heap = new MinHeap();
  heap.push([0, 1]);
  let total = 0;
  let added = 0;
  while (!heap.isEmpty() && added < n) {
    const [cost, city] = heap.pop();
    if (inTree[city]) continue;
    inTree[city] = true;
    added++;
    total += cost;
    for (const [next, c] of adj[city]) if (!inTree[next]) heap.push([c, next]);
  }
  return added === n ? total : -1;
}

function optimal(n, connections) {
  const sorted = [...connections].sort((a, b) => a[2] - b[2]);
  const uf = new UnionFind(n + 1);             // index 0 unused (cities are 1..n)
  let total = 0;
  let used = 0;
  for (const [a, b, cost] of sorted) {
    if (!uf.union(a, b)) continue;
    total += cost;
    if (++used === n - 1) return total;        // all cities connected
  }
  return used === n - 1 ? total : -1;          // n = 1 reaches here with used 0
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [primVersion, optimal]) {
  assert.strictEqual(solve(3, [[1, 2, 5], [1, 3, 6], [2, 3, 1]]), 6);
  assert.strictEqual(solve(4, [[1, 2, 3], [3, 4, 4]]), -1);
  assert.strictEqual(solve(1, []), 0);
  assert.strictEqual(solve(2, []), -1);
  assert.strictEqual(solve(2, [[1, 2, 7], [1, 2, 3]]), 3);
  assert.strictEqual(solve(4, [[1, 2, 1], [2, 3, 1], [3, 4, 1], [1, 4, 100], [2, 4, 50]]), 3);
}
console.log('✓ 03-connecting-cities-with-minimum-cost passed');

module.exports = { optimal, primVersion };

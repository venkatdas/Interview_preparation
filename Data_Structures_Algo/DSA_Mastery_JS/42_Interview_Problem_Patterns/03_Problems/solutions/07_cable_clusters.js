/**
 * 07. Cable Clusters   (Original — Medium)
 *
 * PROBLEM
 * A data center has n servers (0..n-1), none connected at first. Technicians plug in cables
 * one by one: cables[i] = [a, b] connects servers a and b (both directions). After EACH cable,
 * report [number of clusters, size of the largest cluster], where a cluster is a group of
 * servers connected directly or indirectly. Return the list of reports.
 *
 * EXAMPLES
 * n = 5, cables = [[0,1],[2,3],[1,2],[0,3],[4,4]]
 *   -> [[4,2], [3,2], [2,4], [2,4], [2,4]]
 *   ([0,3] joins two servers already in one cluster; [4,4] is a self-loop: no change)
 * n = 3, cables = [] -> []
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= n <= 10^5, 0 <= cables.length <= 10^5. Cables are never removed.
 * - Duplicate cables and self-loops can appear.
 *
 * PATTERN: union-find (disjoint set union) with sizes. Clues: "connected directly or
 * indirectly", edges arrive one at a time, answer needed after each, never removed.
 *
 * APPROACH 1 — Brute force   O(m * (n + m)) time, O(n + m) space
 * After each cable, rebuild the adjacency list and count components with DFS.
 *
 * APPROACH 2 — Optimal (union-find by size + path compression)   O(m * α(n) + n) time, O(n) space
 * Keep parent[] and size[]. A successful union merges two clusters: clusters--, and the new
 * size is size[a] + size[b], which may become the new largest. Sizes only grow, so a running
 * maximum is enough.
 *
 * Dry run on n=5, cables [[0,1],[2,3],[1,2],[0,3],[4,4]]:
 *   start: clusters 5, largest 1
 *   [0,1]: merge -> clusters 4, size 2 -> [4,2]
 *   [2,3]: merge -> clusters 3, size 2 -> [3,2]
 *   [1,2]: merge {0,1}+{2,3} -> clusters 2, size 4 -> [2,4]
 *   [0,3]: same root -> [2,4]
 *   [4,4]: same root -> [2,4]
 *
 * EDGE CASES
 * - no cables -> [];  self-loops / duplicates do not change anything;  n = 1.
 */

function bruteForce(n, cables) {
  const reports = [];
  for (let k = 1; k <= cables.length; k++) {
    const adj = Array.from({ length: n }, () => []);
    for (let i = 0; i < k; i++) { const [a, b] = cables[i]; adj[a].push(b); adj[b].push(a); }
    const seen = new Array(n).fill(false);
    let clusters = 0;
    let largest = 0;
    for (let s = 0; s < n; s++) {
      if (seen[s]) continue;
      clusters++;
      let size = 0;
      const stack = [s];
      seen[s] = true;
      while (stack.length) {
        const u = stack.pop();
        size++;
        for (const v of adj[u]) if (!seen[v]) { seen[v] = true; stack.push(v); }
      }
      largest = Math.max(largest, size);
    }
    reports.push([clusters, largest]);
  }
  return reports;
}

function optimal(n, cables) {
  const parent = Array.from({ length: n }, (_, i) => i);
  const size = new Array(n).fill(1);
  const find = (x) => {
    while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } // iterative, path halving
    return x;
  };
  let clusters = n;
  let largest = n > 0 ? 1 : 0;
  const reports = [];
  for (const [a, b] of cables) {
    let ra = find(a);
    let rb = find(b);
    if (ra !== rb) {
      if (size[ra] < size[rb]) [ra, rb] = [rb, ra]; // hang the smaller tree under the bigger
      parent[rb] = ra;
      size[ra] += size[rb];
      clusters--;
      largest = Math.max(largest, size[ra]);
    }
    reports.push([clusters, largest]);
  }
  return reports;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(5, [[0, 1], [2, 3], [1, 2], [0, 3], [4, 4]]), [[4, 2], [3, 2], [2, 4], [2, 4], [2, 4]]);
  assert.deepStrictEqual(solve(3, []), []);
  assert.deepStrictEqual(solve(1, [[0, 0]]), [[1, 1]]);
  assert.deepStrictEqual(solve(2, [[0, 1], [1, 0]]), [[1, 2], [1, 2]]);
}
function mulberry32(seed) {
  return function rand() {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(7);
for (let t = 0; t < 200; t++) {
  const n = 1 + Math.floor(rand() * 10);
  const cables = Array.from({ length: Math.floor(rand() * 12) }, () => [Math.floor(rand() * n), Math.floor(rand() * n)]);
  assert.deepStrictEqual(optimal(n, cables), bruteForce(n, cables));
}
console.log('✓ 07_cable_clusters passed');

module.exports = { optimal, bruteForce };

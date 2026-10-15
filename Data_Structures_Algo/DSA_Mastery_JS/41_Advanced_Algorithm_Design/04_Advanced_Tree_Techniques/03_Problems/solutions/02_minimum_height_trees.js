/**
 * 02. Minimum Height Trees   (LeetCode 310 — Medium)
 *
 * PROBLEM
 * A tree has n nodes 0..n-1. If you pick a node as the root, the tree gets a height
 * (edges on the longest root-to-leaf path). Return every node whose choice as the root
 * gives the MINIMUM height (any order; we return them sorted).
 *
 * EXAMPLES
 * n = 4, edges = [[1,0],[1,2],[1,3]]               -> [1]
 * n = 6, edges = [[3,0],[3,1],[3,2],[3,4],[5,4]]   -> [3, 4]
 * n = 1, edges = []                                -> [0]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 2 * 10^4; input is guaranteed to be a tree.
 * - Order of the output does not matter.
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(n) space
 * BFS from every node to get its height (eccentricity); keep nodes with the minimum.
 *
 * APPROACH 2 — Optimal (peel leaves / tree centers)   O(n) time, O(n) space
 * The answer is the CENTER of the tree: the middle 1 or 2 nodes of any diameter.
 * Peel all current leaves layer by layer (like a topological sort on degrees). When <= 2
 * nodes remain, they are the centers. At most 2 because a diameter has 1 or 2 middles.
 *
 * Dry run on n = 6, edges = [[3,0],[3,1],[3,2],[3,4],[5,4]]:
 *   degree = [1,1,1,4,2,1], leaves = [0,1,2,5], remaining = 6
 *   peel 4 leaves -> remaining 2; degree[3] 4->1, degree[4] 2->1 -> new leaves [3,4]
 *   remaining <= 2 -> answer [3,4]
 *
 * EDGE CASES
 * - n = 1 -> [0]   (no leaves have degree 1, handle first)
 * - n = 2 -> [0, 1]
 */

function adjacency(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  return adj;
}

function bruteForce(n, edges) {
  const adj = adjacency(n, edges);
  const height = [];
  for (let s = 0; s < n; s++) {
    const dist = new Array(n).fill(-1);
    dist[s] = 0;
    const q = [s];
    for (let h = 0; h < q.length; h++) for (const v of adj[q[h]]) if (dist[v] === -1) { dist[v] = dist[q[h]] + 1; q.push(v); }
    height.push(Math.max(...dist));
  }
  const best = Math.min(...height);
  return height.map((h, i) => (h === best ? i : -1)).filter(i => i >= 0);
}

function optimal(n, edges) {
  if (n <= 2) return Array.from({ length: n }, (_, i) => i);
  const adj = adjacency(n, edges);
  const degree = adj.map(a => a.length);
  let leaves = [];
  for (let i = 0; i < n; i++) if (degree[i] === 1) leaves.push(i);
  let remaining = n;
  while (remaining > 2) {
    remaining -= leaves.length;
    const next = [];
    for (const leaf of leaves) {
      for (const v of adj[leaf]) if (--degree[v] === 1) next.push(v); // v just became a leaf
    }
    leaves = next;
  }
  return leaves.sort((a, b) => a - b);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(4, [[1, 0], [1, 2], [1, 3]]), [1]);
  assert.deepStrictEqual(solve(6, [[3, 0], [3, 1], [3, 2], [3, 4], [5, 4]]), [3, 4]);
  assert.deepStrictEqual(solve(1, []), [0]);
  assert.deepStrictEqual(solve(2, [[0, 1]]), [0, 1]);
  assert.deepStrictEqual(solve(5, [[0, 1], [1, 2], [2, 3], [3, 4]]), [2]);
  assert.deepStrictEqual(solve(4, [[0, 1], [1, 2], [2, 3]]), [1, 2]);
}
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(310);
for (let t = 0; t < 200; t++) {
  const n = 1 + Math.floor(rand() * 15);
  const edges = [];
  for (let i = 1; i < n; i++) edges.push([i, Math.floor(rand() * i)]);
  assert.deepStrictEqual(optimal(n, edges), bruteForce(n, edges));
}
console.log('✓ 02_minimum_height_trees passed');

module.exports = { optimal, bruteForce };

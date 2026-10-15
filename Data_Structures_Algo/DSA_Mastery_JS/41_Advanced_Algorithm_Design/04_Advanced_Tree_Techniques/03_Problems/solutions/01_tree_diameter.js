/**
 * 01. Tree Diameter   (LeetCode 1245 — Medium)
 *
 * PROBLEM
 * An undirected tree has n nodes 0..n-1 given as an edge list. Return its diameter:
 * the number of EDGES on the longest path between any two nodes.
 *
 * EXAMPLES
 * edges = [[0,1],[0,2]]                         -> 2   (1 - 0 - 2)
 * edges = [[0,1],[1,2],[2,3],[1,4],[4,5]]       -> 4   (3 - 2 - 1 - 4 - 5)
 * edges = []  (n = 1)                           -> 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 10^4 (LeetCode); is it guaranteed to be a tree (connected, n - 1 edges)? yes
 * - Length in edges or in nodes? (edges)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(n) space
 * BFS from every node, take the largest distance seen anywhere.
 *
 * APPROACH 2 — Optimal (two BFS)   O(n) time, O(n) space
 * BFS from any node s; the farthest node a is an endpoint of SOME diameter. BFS from a;
 * the farthest distance is the diameter.
 * Why: suppose a diameter is x..y. The farthest node from s can always be swapped in for
 * x or y without making the path shorter (exchange argument on the paths through s).
 *
 * Dry run on edges [[0,1],[1,2],[2,3],[1,4],[4,5]]:
 *   BFS from 0: dist = [0,1,2,3,2,3] -> farthest a = 3 (first max)
 *   BFS from 3: dist = [3,2,1,0,3,4] -> farthest b = 5, distance 4 -> answer 4
 *
 * EDGE CASES
 * - n = 1 (no edges) -> 0
 * - path graph -> n - 1
 * - star graph -> 2
 */

function adjacency(edges) {
  const n = edges.length + 1;
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  return adj;
}

function bfs(adj, src) {
  const dist = new Array(adj.length).fill(-1);
  dist[src] = 0;
  const q = [src];
  for (let h = 0; h < q.length; h++) {
    for (const v of adj[q[h]]) if (dist[v] === -1) { dist[v] = dist[q[h]] + 1; q.push(v); }
  }
  return dist;
}

function bruteForce(edges) {
  const adj = adjacency(edges);
  let best = 0;
  for (let s = 0; s < adj.length; s++) best = Math.max(best, ...bfs(adj, s));
  return best;
}

function optimal(edges) {
  const adj = adjacency(edges);
  const d0 = bfs(adj, 0);
  let a = 0;
  for (let i = 1; i < d0.length; i++) if (d0[i] > d0[a]) a = i; // farthest from 0
  return Math.max(...bfs(adj, a)); // farthest from a = diameter
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([[0, 1], [0, 2]]), 2);
  assert.strictEqual(solve([[0, 1], [1, 2], [2, 3], [1, 4], [4, 5]]), 4);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([[0, 1]]), 1);
  assert.strictEqual(solve([[0, 1], [0, 2], [0, 3], [0, 4]]), 2); // star
  assert.strictEqual(solve([[0, 1], [1, 2], [2, 3], [3, 4]]), 4); // path
}
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(1245);
for (let t = 0; t < 200; t++) {
  const n = 1 + Math.floor(rand() * 15);
  const edges = [];
  for (let i = 1; i < n; i++) edges.push([i, Math.floor(rand() * i)]);
  assert.strictEqual(optimal(edges), bruteForce(edges));
}
// long path: still fast and no recursion
assert.strictEqual(optimal(Array.from({ length: 99999 }, (_, i) => [i, i + 1])), 99999);
console.log('✓ 01_tree_diameter passed');

module.exports = { optimal, bruteForce };

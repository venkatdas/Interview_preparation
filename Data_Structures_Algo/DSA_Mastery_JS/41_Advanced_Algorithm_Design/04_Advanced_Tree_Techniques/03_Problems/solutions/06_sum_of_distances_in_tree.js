/**
 * 06. Sum of Distances in Tree   (LeetCode 834 — Hard)
 *
 * PROBLEM
 * A tree has n nodes 0..n-1. Return an array ans where ans[i] is the sum of the distances
 * (in edges) from node i to every other node.
 *
 * EXAMPLES
 * n = 6, edges = [[0,1],[0,2],[2,3],[2,4],[2,5]]  -> [8,12,6,10,10,10]
 * n = 1, edges = []                               -> [0]
 * n = 2, edges = [[1,0]]                          -> [1,1]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 3 * 10^4 -> O(n^2) = 9 * 10^8 is too slow; need O(n).
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(n) space
 * BFS from every node and add up the distances.
 *
 * APPROACH 2 — Optimal (rerooting DP)   O(n) time, O(n) space
 * Pass 1 (post-order from root 0):
 *   count[v] = nodes in v's subtree, down[v] = sum of distances from v into its subtree
 *   down[p] += down[c] + count[c]   (each of the count[c] nodes is one edge farther from p)
 * Pass 2 (pre-order): ans[0] = down[0]. Moving the root from p to its child c:
 *   the count[c] nodes in c's subtree get 1 closer, the other n - count[c] get 1 farther
 *   ans[c] = ans[p] - count[c] + (n - count[c])
 *
 * Dry run on example 1 (root 0):
 *   count = [6,1,4,1,1,1], down = [8,0,3,0,0,0] -> ans[0] = 8
 *   ans[1] = 8 - 1 + 5 = 12;  ans[2] = 8 - 4 + 2 = 6;  ans[3] = 6 - 1 + 5 = 10 (same for 4, 5)
 *
 * EDGE CASES
 * - n = 1 -> [0]
 * - path of length 3*10^4 -> must be iterative (recursion depth)
 */

function adjacency(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  return adj;
}

function bruteForce(n, edges) {
  const adj = adjacency(n, edges);
  const ans = [];
  for (let s = 0; s < n; s++) {
    const dist = new Array(n).fill(-1);
    dist[s] = 0;
    const q = [s];
    let total = 0;
    for (let h = 0; h < q.length; h++) {
      total += dist[q[h]];
      for (const v of adj[q[h]]) if (dist[v] === -1) { dist[v] = dist[q[h]] + 1; q.push(v); }
    }
    ans.push(total);
  }
  return ans;
}

function optimal(n, edges) {
  const adj = adjacency(n, edges);
  // BFS order from 0 gives parents before children (works as a pre-order for our purpose)
  const parent = new Array(n).fill(-1);
  const order = [0];
  const seen = new Array(n).fill(false);
  seen[0] = true;
  for (let h = 0; h < order.length; h++) {
    for (const v of adj[order[h]]) if (!seen[v]) { seen[v] = true; parent[v] = order[h]; order.push(v); }
  }
  const count = new Array(n).fill(1);
  const down = new Array(n).fill(0);
  for (let i = n - 1; i > 0; i--) {             // children before parents
    const v = order[i], p = parent[v];
    count[p] += count[v];
    down[p] += down[v] + count[v];
  }
  const ans = new Array(n);
  ans[0] = down[0];
  for (let i = 1; i < n; i++) {                 // parents before children
    const v = order[i];
    ans[v] = ans[parent[v]] - count[v] + (n - count[v]);
  }
  return ans;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(6, [[0, 1], [0, 2], [2, 3], [2, 4], [2, 5]]), [8, 12, 6, 10, 10, 10]);
  assert.deepStrictEqual(solve(1, []), [0]);
  assert.deepStrictEqual(solve(2, [[1, 0]]), [1, 1]);
  assert.deepStrictEqual(solve(4, [[0, 1], [1, 2], [2, 3]]), [6, 4, 4, 6]);
  assert.deepStrictEqual(solve(4, [[0, 1], [0, 2], [0, 3]]), [3, 5, 5, 5]);
}
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(834);
for (let t = 0; t < 200; t++) {
  const n = 1 + Math.floor(rand() * 20);
  const edges = [];
  for (let i = 1; i < n; i++) edges.push([Math.floor(rand() * i), i]);
  assert.deepStrictEqual(optimal(n, edges), bruteForce(n, edges));
}
const N = 30000;
const line = optimal(N, Array.from({ length: N - 1 }, (_, i) => [i, i + 1]));
assert.strictEqual(line[0], (N - 1) * N / 2);
console.log('✓ 06_sum_of_distances_in_tree passed');

module.exports = { optimal, bruteForce };

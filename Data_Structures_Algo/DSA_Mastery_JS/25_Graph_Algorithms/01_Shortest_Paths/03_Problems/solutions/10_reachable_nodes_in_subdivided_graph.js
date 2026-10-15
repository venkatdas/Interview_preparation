/**
 * 10. Reachable Nodes in Subdivided Graph   (LeetCode 882 — Hard)
 *
 * PROBLEM
 * Undirected graph with n nodes; edges[i] = [u, v, cnt] means the edge u-v is subdivided
 * into cnt NEW tiny nodes in a chain (so walking u -> v takes cnt + 1 moves). Starting at
 * node 0 with maxMoves moves, how many nodes (original + tiny) can you reach?
 *
 * EXAMPLES
 * Input: edges = [[0,1,10],[0,2,1],[1,2,2]], maxMoves = 6, n = 3   Output: 13
 * Input: edges = [[0,1,4],[1,2,6],[0,2,8],[1,3,1]], maxMoves = 10, n = 4   Output: 23
 * Input: edges = [[1,2,4],[1,4,5],[1,3,1],[2,3,4],[3,4,5]], maxMoves = 17, n = 5   Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - cnt can be up to 10^4 and there can be 10^4 edges -> we cannot build the subdivided
 *   graph (10^8 nodes). We must count tiny nodes with arithmetic.
 * - Node 0 is always reachable (counts as 1 even if isolated)
 *
 * APPROACH 1 — Brute force (actually build the subdivided graph and BFS)
 *   O(sum of cnt + E) time and space
 * Create the tiny nodes, BFS from 0 with a move budget, count visited. Correct and a
 * great test oracle for small inputs; impossible at the upper constraints.
 *
 * APPROACH 2 — Optimal (Dijkstra on the original graph + per-edge accounting)
 *   O(E log V) time, O(V + E) space
 *   1. Dijkstra from 0 with weight cnt + 1 -> dist[] to original nodes.
 *   2. Original nodes with dist <= maxMoves are reachable: count them.
 *   3. For each edge (u, v, cnt): from u we can walk max(0, maxMoves - dist[u]) tiny
 *      nodes into the edge; from v similarly. The edge contributes
 *      min(cnt, fromU + fromV) tiny nodes (never more than exist).
 *
 * Dry run example 1 (maxMoves 6):
 *   dist[0]=0, dist[2]=2 (via 1 tiny node), dist[1]=5 (0-2-1: 2 + 3)
 *   originals reachable: 0, 1, 2 -> 3
 *   edge 0-1 (10): from 0: 6, from 1: 1 -> min(10, 7) = 7
 *   edge 0-2 (1):  from 0: 6, from 2: 4 -> min(1, 10) = 1
 *   edge 1-2 (2):  from 1: 1, from 2: 4 -> min(2, 5) = 2
 *   total 3 + 7 + 1 + 2 = 13
 *
 * EDGE CASES
 * - node 0 isolated -> 1
 * - maxMoves = 0 -> 1
 * - an edge reachable from both ends whose tiny nodes overlap -> the min() caps it
 */

const { MinHeap } = require('../../02_Implementations/shortest_paths');

function bruteForce(edges, maxMoves, n) {
  // build the expanded graph with ids: originals 0..n-1, tiny nodes n, n+1, ...
  const adj = Array.from({ length: n }, () => []);
  let nextId = n;
  for (const [u, v, cnt] of edges) {
    let prev = u;
    for (let i = 0; i < cnt; i++) {
      const tiny = nextId++;
      adj.push([]);
      adj[prev].push(tiny);
      adj[tiny].push(prev);
      prev = tiny;
    }
    adj[prev].push(v);
    adj[v].push(prev);
  }
  const dist = new Array(adj.length).fill(-1);
  dist[0] = 0;
  const queue = [0];
  let head = 0;
  let reached = 0;
  while (head < queue.length) {
    const node = queue[head++];
    reached++;
    if (dist[node] === maxMoves) continue;
    for (const next of adj[node]) {
      if (dist[next] === -1) { dist[next] = dist[node] + 1; queue.push(next); }
    }
  }
  return reached;
}

function optimal(edges, maxMoves, n) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v, cnt] of edges) {
    adj[u].push([v, cnt + 1]);
    adj[v].push([u, cnt + 1]);
  }
  const dist = new Array(n).fill(Infinity);
  dist[0] = 0;
  const heap = new MinHeap();
  heap.push([0, 0]);
  while (!heap.isEmpty()) {
    const [d, u] = heap.pop();
    if (d > dist[u]) continue;
    for (const [v, w] of adj[u]) {
      if (d + w < dist[v]) { dist[v] = d + w; heap.push([dist[v], v]); }
    }
  }

  let reached = 0;
  for (let node = 0; node < n; node++) if (dist[node] <= maxMoves) reached++;

  for (const [u, v, cnt] of edges) {
    const fromU = Math.max(0, maxMoves - dist[u]);     // tiny nodes reachable entering from u
    const fromV = Math.max(0, maxMoves - dist[v]);     // ... and from v
    reached += Math.min(cnt, fromU + fromV);           // cannot exceed what exists
  }
  return reached;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([[0, 1, 10], [0, 2, 1], [1, 2, 2]], 6, 3), 13);
  assert.strictEqual(solve([[0, 1, 4], [1, 2, 6], [0, 2, 8], [1, 3, 1]], 10, 4), 23);
  assert.strictEqual(solve([[1, 2, 4], [1, 4, 5], [1, 3, 1], [2, 3, 4], [3, 4, 5]], 17, 5), 1);
  assert.strictEqual(solve([], 5, 1), 1);
  assert.strictEqual(solve([[0, 1, 3]], 0, 2), 1);
  assert.strictEqual(solve([[0, 1, 3]], 2, 2), 3);        // 0 + two tiny nodes
  assert.strictEqual(solve([[0, 1, 3]], 4, 2), 5);        // everything
}
console.log('✓ 10-reachable-nodes-in-subdivided-graph passed');

module.exports = { optimal, bruteForce };

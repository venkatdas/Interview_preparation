/**
 * 01. Network Delay Time   (LeetCode 743 — Medium)
 *
 * PROBLEM
 * n nodes labelled 1..n. times[i] = [u, v, w]: a signal sent from u reaches v after w
 * time units (directed). A signal starts at node k. Return the time until ALL nodes have
 * received it, or -1 if some node never does.
 *
 * EXAMPLES
 * Input: times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2   Output: 2
 * Input: times = [[1,2,1]], n = 2, k = 1                   Output: 1
 * Input: times = [[1,2,1]], n = 2, k = 2                   Output: -1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1-indexed nodes? (yes, allocate n + 1)
 * - Weights non-negative? (yes, 0 <= w <= 100 -> Dijkstra is safe)
 * - Directed? (yes)
 *
 * "Time until all receive" = the LARGEST shortest-path distance from k.
 *
 * APPROACH 1 — Brute force (Bellman-Ford)   O(V * E) time, O(V) space
 * Relax all edges n - 1 times. Works, slower than Dijkstra, but a good sanity check.
 *
 * APPROACH 2 — Optimal (Dijkstra)   O((V + E) log V) time, O(V + E) space
 *   1. Build weighted adjacency list.
 *   2. Dijkstra from k.
 *   3. Answer = max(dist[1..n]); if any is Infinity -> -1.
 *
 * Dry run times [[2,1,1],[2,3,1],[3,4,1]], k=2:
 *   dist[2]=0, heap [(0,2)]
 *   pop 2: 1 -> 1, 3 -> 1                  heap [(1,1),(1,3)]
 *   pop 1: no out-edges;  pop 3: 4 -> 2    heap [(2,4)]
 *   pop 4: done. dist = [_,1,0,1,2] max 2
 *
 * EDGE CASES
 * - n = 1 -> 0 (k already has it)
 * - unreachable node -> -1
 * - parallel edges with different weights -> relaxation picks the smaller
 */

const { MinHeap } = require('../../02_Implementations/shortest_paths');

function bruteForce(times, n, k) {
  const dist = new Array(n + 1).fill(Infinity);
  dist[k] = 0;
  for (let round = 0; round < n - 1; round++) {
    for (const [u, v, w] of times) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) dist[v] = dist[u] + w;
    }
  }
  let answer = 0;
  for (let node = 1; node <= n; node++) {
    if (dist[node] === Infinity) return -1;
    answer = Math.max(answer, dist[node]);
  }
  return answer;
}

function optimal(times, n, k) {
  const adj = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of times) adj[u].push([v, w]);

  const dist = new Array(n + 1).fill(Infinity);
  dist[k] = 0;
  const heap = new MinHeap();
  heap.push([0, k]);
  while (!heap.isEmpty()) {
    const [d, u] = heap.pop();
    if (d > dist[u]) continue;                 // stale
    for (const [v, w] of adj[u]) {
      if (d + w < dist[v]) {
        dist[v] = d + w;
        heap.push([dist[v], v]);
      }
    }
  }

  let answer = 0;
  for (let node = 1; node <= n; node++) {
    if (dist[node] === Infinity) return -1;    // someone never hears the signal
    answer = Math.max(answer, dist[node]);     // the last one to hear it
  }
  return answer;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([[2, 1, 1], [2, 3, 1], [3, 4, 1]], 4, 2), 2);
  assert.strictEqual(solve([[1, 2, 1]], 2, 1), 1);
  assert.strictEqual(solve([[1, 2, 1]], 2, 2), -1);
  assert.strictEqual(solve([], 1, 1), 0);
  assert.strictEqual(solve([[1, 2, 5], [1, 2, 2], [2, 3, 1]], 3, 1), 3);     // parallel edges
  assert.strictEqual(solve([[1, 2, 1], [2, 3, 2], [1, 3, 4]], 3, 1), 3);
}
console.log('✓ 01-network-delay-time passed');

module.exports = { optimal, bruteForce };

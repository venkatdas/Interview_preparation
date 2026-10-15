/**
 * 04. Path With Maximum Probability   (LeetCode 1514 — Medium)
 *
 * PROBLEM
 * Undirected graph with n nodes; edges[i] = [a, b] has success probability succProb[i].
 * Return the maximum probability of a path from start to end (product of edge
 * probabilities). Return 0 if there is no path.
 *
 * EXAMPLES
 * Input: n=3, edges=[[0,1],[1,2],[0,2]], succProb=[0.5,0.5,0.2], start=0, end=2
 * Output: 0.25   (0 -> 1 -> 2 = 0.5 * 0.5 beats the direct 0.2)
 * Input: same, succProb=[0.5,0.5,0.3]   Output: 0.3
 * Input: n=3, edges=[[0,1]], succProb=[0.5], start=0, end=2   Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Probabilities in [0, 1]? (yes - multiplying never increases, so "longest" product
 *   path behaves like a shortest path: Dijkstra's greedy argument holds with a MAX heap)
 * - Precision tolerance? (1e-5)
 *
 * APPROACH 1 — Brute force (Bellman-Ford style, n - 1 rounds of relaxation)   O(V * E)
 * prob[v] = max(prob[v], prob[u] * p). Repeat n - 1 times (or until no change).
 *
 * APPROACH 2 — Optimal (Dijkstra with a max-heap)   O((V + E) log V)
 * Our MinHeap pops the smallest key; push NEGATIVE probabilities to get a max-heap.
 * Relax: candidate = prob[u] * p; keep it if larger.
 *
 * Dry run example 1:
 *   prob [1, 0, 0]  heap [(-1, 0)]
 *   pop 0 (1.0): 1 -> 0.5, 2 -> 0.2      heap [(-0.5,1), (-0.2,2)]
 *   pop 1 (0.5): 2 -> 0.25 > 0.2 update  heap [(-0.25,2), (-0.2,2)]
 *   pop 2 (0.25): end reached -> 0.25
 *
 * EDGE CASES
 * - start === end -> 1
 * - unreachable -> 0
 * - edge with probability 0 -> never helps
 */

const { MinHeap } = require('../../02_Implementations/shortest_paths');

function bruteForce(n, edges, succProb, start, end) {
  const prob = new Array(n).fill(0);
  prob[start] = 1;
  for (let round = 0; round < n - 1; round++) {
    let changed = false;
    edges.forEach(([a, b], i) => {
      const p = succProb[i];
      if (prob[a] * p > prob[b]) { prob[b] = prob[a] * p; changed = true; }
      if (prob[b] * p > prob[a]) { prob[a] = prob[b] * p; changed = true; }
    });
    if (!changed) break;
  }
  return prob[end];
}

function optimal(n, edges, succProb, start, end) {
  const adj = Array.from({ length: n }, () => []);
  edges.forEach(([a, b], i) => {
    adj[a].push([b, succProb[i]]);
    adj[b].push([a, succProb[i]]);
  });

  const prob = new Array(n).fill(0);
  prob[start] = 1;
  const heap = new MinHeap();
  heap.push([-1, start]);                      // negate -> max-heap behaviour
  while (!heap.isEmpty()) {
    const [negP, u] = heap.pop();
    const p = -negP;
    if (p < prob[u]) continue;                 // stale
    if (u === end) return p;
    for (const [v, edgeProb] of adj[u]) {
      const candidate = p * edgeProb;
      if (candidate > prob[v]) {
        prob[v] = candidate;
        heap.push([-candidate, v]);
      }
    }
  }
  return 0;
}

// ---------- tests ----------
const assert = require('assert');
const close = (a, b) => Math.abs(a - b) < 1e-9;
for (const solve of [bruteForce, optimal]) {
  assert.ok(close(solve(3, [[0, 1], [1, 2], [0, 2]], [0.5, 0.5, 0.2], 0, 2), 0.25));
  assert.ok(close(solve(3, [[0, 1], [1, 2], [0, 2]], [0.5, 0.5, 0.3], 0, 2), 0.3));
  assert.strictEqual(solve(3, [[0, 1]], [0.5], 0, 2), 0);
  assert.strictEqual(solve(1, [], [], 0, 0), 1);
  assert.ok(close(solve(4, [[0, 1], [1, 2], [2, 3]], [0.9, 0.9, 0.9], 0, 3), 0.729));
  assert.strictEqual(solve(2, [[0, 1]], [0], 0, 1), 0);
}
console.log('✓ 04-path-with-maximum-probability passed');

module.exports = { optimal, bruteForce };

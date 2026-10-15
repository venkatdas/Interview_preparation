/**
 * 02. Count Edge-Disjoint Paths   (Original — Medium)
 *
 * PROBLEM
 * A data center has n routers (0..n-1) and one-way cables edges[i] = [u, v].
 * Two routes from router s to router t are "independent" if they never share a cable
 * (they may share routers). Return the maximum number of pairwise independent routes.
 *
 * EXAMPLES
 * n=4, edges=[[0,1],[0,2],[1,3],[2,3],[1,2]], s=0, t=3   -> 2
 * n=3, edges=[[0,1],[1,2]], s=0, t=2                     -> 1
 * n=3, edges=[[0,1],[0,1],[1,2],[1,2]], s=0, t=2         -> 2  (parallel cables count separately)
 * n=3, edges=[[0,1]], s=0, t=2                           -> 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Directed or undirected cables? (directed here; undirected = add both directions)
 * - Parallel cables? (allowed, each is its own edge)
 * - May routes share routers? (yes; if NOT, that is vertex-disjoint paths -> split nodes)
 * - n up to 500, edges up to 5000.
 *
 * APPROACH 1 — Brute force   exponential time, O(E) space
 * Backtracking: find any s->t path over unused edges, mark its edges used, recurse,
 * and try every possible path at every level. Memoise on the used-edge bitmask.
 * Only for E <= ~15.
 *
 * APPROACH 2 — Optimal (max flow with unit capacities, Menger's theorem)
 *   O(E * min(E, V)) with Edmonds-Karp-style augmenting; Dinic is faster.
 * Give every cable capacity 1. Any integral flow of value k splits into k paths that
 * share no edge (each edge carries 0 or 1). Conversely k such paths give flow k.
 * So the answer is exactly the max flow from s to t.
 *
 * Dry run (example 1):
 *   BFS path 0->1->3, push 1.   residual: 1->0, 3->1 reversed
 *   BFS path 0->2->3, push 1.
 *   BFS: 0 has no residual out-edge -> stop. flow = 2.
 *   The edge 1->2 is not needed; flow found the best combination by itself.
 *
 * EDGE CASES
 * - s === t (define as 0 routes; ask the interviewer)
 * - t unreachable -> 0
 * - self-loops (never help, harmless)
 */

function bruteForce(n, edges, s, t) {
  if (s === t) return 0;
  const memo = new Map();
  function best(usedMask) {
    if (memo.has(usedMask)) return memo.get(usedMask);
    let result = 0;
    // enumerate every simple s->t path over unused edges
    const onPath = new Array(n).fill(false);
    function dfs(u, mask) {
      if (u === t) { result = Math.max(result, 1 + best(mask)); return; }
      onPath[u] = true;
      for (let i = 0; i < edges.length; i++) {
        const [a, b] = edges[i];
        if (a === u && !(mask >> i & 1) && !onPath[b]) dfs(b, mask | (1 << i));
      }
      onPath[u] = false;
    }
    dfs(s, usedMask);
    memo.set(usedMask, result);
    return result;
  }
  return best(0);
}

// Self-contained unit-capacity Edmonds-Karp (what you would write in an interview).
function optimal(n, edges, s, t) {
  if (s === t) return 0;
  const to = [], cap = [], adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(to.length); to.push(v); cap.push(1);
    adj[v].push(to.length); to.push(u); cap.push(0);
  }
  let flow = 0;
  while (true) {
    const inEdge = new Array(n).fill(-1);
    const seen = new Array(n).fill(false);
    seen[s] = true;
    const queue = [s];
    for (let h = 0; h < queue.length && !seen[t]; h++) {
      for (const e of adj[queue[h]]) {
        if (cap[e] > 0 && !seen[to[e]]) { seen[to[e]] = true; inEdge[to[e]] = e; queue.push(to[e]); }
      }
    }
    if (!seen[t]) return flow;
    for (let v = t; v !== s; v = to[inEdge[v] ^ 1]) { cap[inEdge[v]]--; cap[inEdge[v] ^ 1]++; }
    flow++; // unit capacities: every augmenting path carries exactly 1
  }
}

// ---------- tests ----------
const assert = require('assert');
const { maxFlow, Dinic, mulberry32 } = require('../../02_Implementations/max_flow');

for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(4, [[0, 1], [0, 2], [1, 3], [2, 3], [1, 2]], 0, 3), 2);
  assert.strictEqual(solve(3, [[0, 1], [1, 2]], 0, 2), 1);
  assert.strictEqual(solve(3, [[0, 1], [0, 1], [1, 2], [1, 2]], 0, 2), 2);
  assert.strictEqual(solve(3, [[0, 1]], 0, 2), 0);
  assert.strictEqual(solve(2, [[0, 0], [0, 1]], 0, 1), 1);
  assert.strictEqual(solve(2, [[0, 1]], 1, 1), 0);
  // the "trap" graph where a greedy path choice blocks the second path
  assert.strictEqual(solve(4, [[0, 1], [1, 2], [2, 3], [0, 2], [1, 3]], 0, 3), 2);
}
const rnd = mulberry32(202);
for (let tr = 0; tr < 300; tr++) {
  const n = 2 + Math.floor(rnd() * 4);
  const m = Math.floor(rnd() * 11);
  const edges = Array.from({ length: m }, () => [Math.floor(rnd() * n), Math.floor(rnd() * n)]);
  const expected = bruteForce(n, edges, 0, n - 1);
  assert.strictEqual(optimal(n, edges, 0, n - 1), expected);
  assert.strictEqual(maxFlow(n, edges.map(([u, v]) => [u, v, 1]), 0, n - 1, Dinic), expected);
}
console.log('✓ 02_edge_disjoint_paths passed');

module.exports = { optimal, bruteForce };

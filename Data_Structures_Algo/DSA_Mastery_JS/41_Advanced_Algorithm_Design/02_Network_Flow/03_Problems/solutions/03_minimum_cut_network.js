/**
 * 03. Cheapest Way to Disconnect Two Servers (Minimum s-t Cut)   (Original — Medium)
 *
 * PROBLEM
 * A network has n servers and two-way cables cables[i] = [u, v, cost]. Cutting cable i
 * costs `cost`. Find the minimum total cost to cut cables so that server s can no longer
 * reach server t, and return { cost, cut } where cut = sorted indices of the cables to cut.
 *
 * EXAMPLES
 * n=4, cables=[[0,1,3],[0,2,2],[1,3,2],[2,3,3],[1,2,1]], s=0, t=3
 *   -> cost 5. Returned cut: cables [0,1] (0-1 cost 3 + 0-2 cost 2).
 * n=2, cables=[[0,1,7],[0,1,4]], s=0, t=1   -> cost 11, cut [0,1] (parallel cables both go)
 * n=3, cables=[[0,1,5]], s=0, t=2           -> cost 0, cut []    (already disconnected)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Cables are two-way? (yes -> each becomes two directed edges with capacity cost)
 * - Costs non-negative? (yes; negative costs break max-flow min-cut)
 * - If several cuts tie, any is fine? (yes; we return the one closest to s)
 * - n up to 200, cables up to 2000.
 *
 * APPROACH 1 — Brute force   O(2^n * E) time, O(n) space
 * A cut is a split of servers into S (contains s) and T (contains t). Its cost is the
 * total cost of cables with one end in S and one in T. Try all 2^(n-2) splits.
 *
 * APPROACH 2 — Optimal (max flow -> min cut)   O(V^2 * E) with Dinic
 * Max-flow min-cut theorem: the maximum flow value equals the minimum cut cost.
 * After running max flow, BFS from s in the RESIDUAL graph. The reached set is S.
 * Every original cable with one end reached and the other not is saturated, and those
 * cables are exactly a minimum cut.
 *
 * Dry run (example 1, each cable = two directed edges):
 *   augment 0->1->3 by 2        flow 2
 *   augment 0->2->3 by 2        flow 4
 *   augment 0->1->2->3 by 1     flow 5   (0->1 now carries 3 = full, 0->2 carries 2 = full)
 *   no augmenting path left.
 *   residual BFS from 0: both 0->1 and 0->2 are saturated -> S = {0}
 *   cables crossing S/T: #0 (0-1, cost 3) + #1 (0-2, cost 2) = 5 = max flow.
 *   (The cut {#1, #2, #4} also costs 5; ties are fine. The residual BFS always returns
 *    the min cut closest to s.)
 *
 * EDGE CASES
 * - s and t already disconnected -> cost 0, empty cut
 * - parallel cables, zero-cost cables (cutting a 0-cost cable is free; we skip them)
 */
const { Dinic, mulberry32 } = require('../../02_Implementations/max_flow');

function cutCost(cables, inS) {
  let cost = 0;
  const cut = [];
  cables.forEach(([u, v, c], i) => {
    if (inS[u] !== inS[v] && c > 0) { cost += c; cut.push(i); }
  });
  return { cost, cut };
}

function bruteForce(n, cables, s, t) {
  let best = null;
  for (let mask = 0; mask < 1 << n; mask++) {
    if (!(mask >> s & 1) || (mask >> t & 1)) continue;
    const inS = Array.from({ length: n }, (_, v) => (mask >> v & 1) === 1);
    const res = cutCost(cables, inS);
    if (best === null || res.cost < best.cost) best = res;
  }
  return best;
}

function optimal(n, cables, s, t) {
  const g = new Dinic(n);
  for (const [u, v, c] of cables) {
    g.addEdge(u, v, c); // two-way cable = capacity c in BOTH directions
    g.addEdge(v, u, c);
  }
  g.maxFlow(s, t);
  const { sSide } = g.minCut(s);
  return cutCost(cables, sSide);
}

// helper for tests: after removing the cut, t must be unreachable from s
function disconnects(n, cables, cut, s, t) {
  const removed = new Set(cut);
  const adj = Array.from({ length: n }, () => []);
  cables.forEach(([u, v], i) => { if (!removed.has(i)) { adj[u].push(v); adj[v].push(u); } });
  const seen = new Set([s]);
  const stack = [s];
  while (stack.length) for (const w of adj[stack.pop()]) if (!seen.has(w)) { seen.add(w); stack.push(w); }
  return !seen.has(t);
}

// ---------- tests ----------
const assert = require('assert');
const ex1 = [[0, 1, 3], [0, 2, 2], [1, 3, 2], [2, 3, 3], [1, 2, 1]];
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(4, ex1, 0, 3).cost, 5);
  assert.deepStrictEqual(solve(2, [[0, 1, 7], [0, 1, 4]], 0, 1), { cost: 11, cut: [0, 1] });
  assert.deepStrictEqual(solve(3, [[0, 1, 5]], 0, 2), { cost: 0, cut: [] });
  assert.strictEqual(solve(3, [[0, 1, 1], [1, 2, 9]], 0, 2).cost, 1);
  assert.strictEqual(solve(3, [[0, 1, 0], [1, 2, 0]], 0, 2).cost, 0);
}
assert.deepStrictEqual(optimal(4, ex1, 0, 3), { cost: 5, cut: [0, 1] });
assert.ok(disconnects(4, ex1, optimal(4, ex1, 0, 3).cut, 0, 3));

const rnd = mulberry32(303);
for (let tr = 0; tr < 300; tr++) {
  const n = 2 + Math.floor(rnd() * 6);
  const m = Math.floor(rnd() * 12);
  const cables = Array.from({ length: m }, () => [Math.floor(rnd() * n), Math.floor(rnd() * n), 1 + Math.floor(rnd() * 9)]);
  const want = bruteForce(n, cables, 0, n - 1);
  const got = optimal(n, cables, 0, n - 1);
  assert.strictEqual(got.cost, want.cost);
  assert.ok(disconnects(n, cables, got.cut, 0, n - 1));
}
console.log('✓ 03_minimum_cut_network passed');

module.exports = { optimal, bruteForce };

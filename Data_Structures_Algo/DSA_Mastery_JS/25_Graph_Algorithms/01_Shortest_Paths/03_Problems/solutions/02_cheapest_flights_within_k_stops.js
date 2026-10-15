/**
 * 02. Cheapest Flights Within K Stops   (LeetCode 787 — Medium)
 *
 * PROBLEM
 * n cities, flights[i] = [from, to, price] (directed). Find the cheapest price from src
 * to dst using AT MOST k stops (so at most k + 1 flights). Return -1 if impossible.
 *
 * EXAMPLES
 * Input: n=4, flights=[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src=0, dst=3, k=1
 * Output: 700   (0 -> 1 -> 3; the cheaper 0 -> 1 -> 2 -> 3 = 400 needs 2 stops)
 * Input: n=3, flights=[[0,1,100],[1,2,100],[0,2,500]], src=0, dst=2, k=1   Output: 200
 * Input: same, k=0   Output: 500
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - "k stops" = k intermediate cities = k + 1 edges? (yes)
 * - Prices non-negative? (yes)
 * - Why not plain Dijkstra? Because the cheapest path to an intermediate city may use
 *   too many stops; Dijkstra's "popped = final" breaks under the stop limit.
 *
 * APPROACH 1 — Brute force (DFS all paths up to k+1 edges)   O(n^(k+1)) time
 * Explore every route with at most k + 1 flights, track the minimum. Exponential.
 *
 * APPROACH 2 — Optimal (Bellman-Ford limited to k + 1 rounds)   O(k * E) time, O(n) space
 * After i rounds of relaxation, dist[v] = cheapest price using at most i flights.
 * We want at most k + 1 flights -> run k + 1 rounds. CRUCIAL: relax from a COPY of the
 * previous round, otherwise one round could chain two flights.
 *
 * Dry run n=3, flights [[0,1,100],[1,2,100],[0,2,500]], src 0, dst 2, k=1 (2 rounds):
 *   dist [0, inf, inf]
 *   round 1 (from copy): 0->1: 100, 0->2: 500          dist [0,100,500]
 *   round 2 (from copy): 1->2: 100+100 = 200 < 500     dist [0,100,200]
 *   answer 200.  With k=0 only round 1 runs -> 500.
 *
 * (Alternative: Dijkstra over state (city, stopsUsed) - see 25_Graph_Algorithms/03_SCC_Bridges_Bipartite_Euler/06.)
 *
 * EDGE CASES
 * - src === dst -> 0
 * - dst unreachable within k -> -1
 * - k larger than n -> same as unlimited
 */

function bruteForce(n, flights, src, dst, k) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v, w] of flights) adj[u].push([v, w]);
  let best = Infinity;
  function dfs(city, flightsLeft, cost) {
    if (cost >= best) return;
    if (city === dst) { best = cost; return; }
    if (flightsLeft === 0) return;
    for (const [next, price] of adj[city]) dfs(next, flightsLeft - 1, cost + price);
  }
  dfs(src, k + 1, 0);
  return best === Infinity ? -1 : best;
}

function optimal(n, flights, src, dst, k) {
  let dist = new Array(n).fill(Infinity);
  dist[src] = 0;
  for (let round = 0; round <= k; round++) {   // k + 1 rounds = at most k + 1 flights
    const next = [...dist];                    // relax using LAST round's values only
    for (const [u, v, price] of flights) {
      if (dist[u] !== Infinity && dist[u] + price < next[v]) {
        next[v] = dist[u] + price;
      }
    }
    dist = next;
  }
  return dist[dst] === Infinity ? -1 : dist[dst];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  const f1 = [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]];
  assert.strictEqual(solve(4, f1, 0, 3, 1), 700);
  assert.strictEqual(solve(4, f1, 0, 3, 2), 400);
  const f2 = [[0, 1, 100], [1, 2, 100], [0, 2, 500]];
  assert.strictEqual(solve(3, f2, 0, 2, 1), 200);
  assert.strictEqual(solve(3, f2, 0, 2, 0), 500);
  assert.strictEqual(solve(3, f2, 0, 0, 0), 0);
  assert.strictEqual(solve(3, [[0, 1, 1]], 0, 2, 5), -1);
  assert.strictEqual(solve(4, [[0, 1, 1], [1, 2, 1], [2, 3, 1], [0, 3, 10]], 0, 3, 1), 10);
}
console.log('✓ 02-cheapest-flights-within-k-stops passed');

module.exports = { optimal, bruteForce };

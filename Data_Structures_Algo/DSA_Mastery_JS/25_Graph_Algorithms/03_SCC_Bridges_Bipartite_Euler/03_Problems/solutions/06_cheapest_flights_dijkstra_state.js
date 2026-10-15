/**
 * 06. Cheapest Flights Within K Stops (revisited: Dijkstra + state)   (LeetCode 787 — Medium)
 *
 * PROBLEM
 * Same as 25_Graph_Algorithms/01_Shortest_Paths/problems/02: n cities, directed flights [from, to, price],
 * cheapest route from src to dst with at most k stops, or -1.
 * This time we solve it as a STATE-SPACE shortest path to show the technique.
 *
 * EXAMPLES
 * Input: n=4, flights=[[0,1,100],[1,2,100],[2,0,100],[1,3,600],[2,3,200]], src=0, dst=3, k=1
 * Output: 700
 * Input: n=3, flights=[[0,1,100],[1,2,100],[0,2,500]], src=0, dst=2, k=1   Output: 200
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Why does plain Dijkstra on cities fail? Because "popped = final" ignores that a
 *   slightly costlier route to a city may have used FEWER stops and therefore lead to a
 *   valid (cheaper overall) route later. The fix: make the state (city, stopsUsed).
 *
 * APPROACH 1 — Alternative (BFS by levels = Bellman-Ford in disguise)   O(k * E)
 * Level i of the BFS = routes with i flights. Keep best price per city per level.
 * Shown as `bfsLevelsVersion`.
 *
 * APPROACH 2 — Optimal (Dijkstra over (city, stops))   O(E * k log(E * k)) worst case
 *   heap entries: [price, city, stopsUsed]
 *   pruning: bestStops[city] = fewest stops with which we have popped this city. If we
 *   pop a city with MORE stops than before, that state is dominated (the earlier pop was
 *   cheaper AND used fewer stops) - skip it. Otherwise relax every outgoing flight if
 *   stopsUsed <= k.
 * The first time dst is popped, its price is minimal among valid routes.
 *
 * Dry run n=3, [[0,1,100],[1,2,100],[0,2,500]], k=1:
 *   heap [(0, city0, stops 0)]
 *   pop (0,0,0): push (100,1,1), (500,2,1)
 *   pop (100,1,1): stops 1 <= k so can fly: push (200,2,2)
 *   pop (200,2,2): dst -> 200
 *
 * EDGE CASES
 * - src === dst -> 0
 * - k = 0 -> direct flights only
 * - unreachable -> -1
 */

const { MinHeap } = require('../../../01_Shortest_Paths/02_Implementations/shortest_paths');

function bfsLevelsVersion(n, flights, src, dst, k) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v, w] of flights) adj[u].push([v, w]);
  let best = new Array(n).fill(Infinity);
  best[src] = 0;
  let frontier = [src];
  for (let flight = 0; flight <= k && frontier.length; flight++) {
    const next = [...best];
    const nextFrontier = [];
    for (const city of frontier) {
      for (const [to, price] of adj[city]) {
        if (best[city] + price < next[to]) {
          next[to] = best[city] + price;
          nextFrontier.push(to);
        }
      }
    }
    best = next;
    frontier = nextFrontier;
  }
  return best[dst] === Infinity ? -1 : best[dst];
}

function optimal(n, flights, src, dst, k) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v, w] of flights) adj[u].push([v, w]);

  const bestStops = new Array(n).fill(Infinity);   // fewest stops used when popped
  const heap = new MinHeap();
  heap.push([0, src, 0]);                          // [price, city, stopsUsed]
  while (!heap.isEmpty()) {
    const [price, city, stops] = heap.pop();
    if (city === dst) return price;                // cheapest valid route
    if (stops > k || stops >= bestStops[city]) continue; // too many stops or dominated
    bestStops[city] = stops;
    for (const [next, cost] of adj[city]) {
      heap.push([price + cost, next, stops + 1]);
    }
  }
  return -1;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bfsLevelsVersion, optimal]) {
  const f1 = [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]];
  assert.strictEqual(solve(4, f1, 0, 3, 1), 700);
  assert.strictEqual(solve(4, f1, 0, 3, 2), 400);
  const f2 = [[0, 1, 100], [1, 2, 100], [0, 2, 500]];
  assert.strictEqual(solve(3, f2, 0, 2, 1), 200);
  assert.strictEqual(solve(3, f2, 0, 2, 0), 500);
  assert.strictEqual(solve(3, f2, 0, 0, 0), 0);
  assert.strictEqual(solve(3, [[0, 1, 1]], 0, 2, 5), -1);
  // the case where plain Dijkstra on cities fails: cheap-but-long vs costly-but-short to city 2
  assert.strictEqual(solve(5, [[0, 1, 1], [1, 2, 1], [0, 2, 10], [2, 3, 1], [3, 4, 1], [2, 4, 100]], 0, 4, 2), 12);
}
console.log('✓ 06-cheapest-flights-dijkstra-state passed');

module.exports = { optimal, bfsLevelsVersion };

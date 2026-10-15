/**
 * 07. Find the City With the Smallest Number of Neighbors at a Threshold Distance
 *     (LeetCode 1334 — Medium)
 *
 * PROBLEM
 * n cities, edges[i] = [u, v, weight] (undirected), and distanceThreshold. For each city
 * count how many OTHER cities are reachable with total path weight <= threshold. Return
 * the city with the SMALLEST count; on a tie return the city with the GREATEST index.
 *
 * EXAMPLES
 * Input: n=4, edges=[[0,1,3],[1,2,1],[1,3,4],[2,3,1]], threshold=4   Output: 3
 * Explanation: counts are 0:2 (1,2), 1:3, 2:3, 3:2 (1,2). Tie between 0 and 3 -> 3.
 * Input: n=5, edges=[[0,1,2],[0,4,8],[1,2,3],[1,4,2],[2,3,1],[3,4,1]], threshold=2
 * Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n <= 100 -> O(n^3) is only 10^6, so Floyd-Warshall is ideal
 * - Weights positive? (yes)
 *
 * We need distances from EVERY city to every other: an all-pairs shortest path problem.
 *
 * APPROACH 1 — Alternative (Dijkstra from each city)   O(n * (V + E) log V)
 * Run Dijkstra n times. Asymptotically better on sparse graphs, more code.
 * Shown as `dijkstraVersion`.
 *
 * APPROACH 2 — Optimal for small n (Floyd-Warshall)   O(n^3) time, O(n^2) space
 *   1. dist[i][j] = weight, dist[i][i] = 0, else Infinity.
 *   2. Triple loop with k outermost.
 *   3. For each city count dist <= threshold (excluding itself); pick min count, ties ->
 *      larger index (iterate i ascending and use <= when updating).
 *
 * Dry run example 1 after Floyd-Warshall:
 *   dist[0] = [0,3,4,5]  count (<=4, not self) = 2
 *   dist[1] = [3,0,1,2]  count 3
 *   dist[2] = [4,1,0,1]  count 3
 *   dist[3] = [5,2,1,0]  count 2   -> tie with 0, pick 3
 *
 * EDGE CASES
 * - no edges -> every count 0 -> return n - 1 (largest index)
 * - threshold 0 -> same as no edges
 */

const { MinHeap } = require('../../02_Implementations/shortest_paths');

function pickCity(n, countOf) {
  let bestCity = -1;
  let bestCount = Infinity;
  for (let city = 0; city < n; city++) {
    const count = countOf(city);
    if (count <= bestCount) {                     // <= so later (bigger) index wins ties
      bestCount = count;
      bestCity = city;
    }
  }
  return bestCity;
}

function dijkstraVersion(n, edges, distanceThreshold) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v, w] of edges) { adj[u].push([v, w]); adj[v].push([u, w]); }
  function reachableFrom(source) {
    const dist = new Array(n).fill(Infinity);
    dist[source] = 0;
    const heap = new MinHeap();
    heap.push([0, source]);
    while (!heap.isEmpty()) {
      const [d, u] = heap.pop();
      if (d > dist[u]) continue;
      for (const [v, w] of adj[u]) {
        if (d + w < dist[v]) { dist[v] = d + w; heap.push([dist[v], v]); }
      }
    }
    return dist.filter((d, city) => city !== source && d <= distanceThreshold).length;
  }
  return pickCity(n, reachableFrom);
}

function optimal(n, edges, distanceThreshold) {
  const dist = Array.from({ length: n }, () => new Array(n).fill(Infinity));
  for (let i = 0; i < n; i++) dist[i][i] = 0;
  for (const [u, v, w] of edges) {
    dist[u][v] = Math.min(dist[u][v], w);
    dist[v][u] = Math.min(dist[v][u], w);
  }
  for (let k = 0; k < n; k++) {                   // intermediate city - OUTER loop
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) dist[i][j] = dist[i][k] + dist[k][j];
      }
    }
  }
  return pickCity(n, (city) =>
    dist[city].filter((d, other) => other !== city && d <= distanceThreshold).length);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [dijkstraVersion, optimal]) {
  assert.strictEqual(solve(4, [[0, 1, 3], [1, 2, 1], [1, 3, 4], [2, 3, 1]], 4), 3);
  assert.strictEqual(solve(5, [[0, 1, 2], [0, 4, 8], [1, 2, 3], [1, 4, 2], [2, 3, 1], [3, 4, 1]], 2), 0);
  assert.strictEqual(solve(3, [], 5), 2);
  assert.strictEqual(solve(1, [], 5), 0);
  assert.strictEqual(solve(3, [[0, 1, 1], [1, 2, 1]], 1), 2);
  assert.strictEqual(solve(2, [[0, 1, 5], [0, 1, 1]], 2), 1);        // parallel edges
}
console.log('✓ 07-find-the-city passed');

module.exports = { optimal, dijkstraVersion };

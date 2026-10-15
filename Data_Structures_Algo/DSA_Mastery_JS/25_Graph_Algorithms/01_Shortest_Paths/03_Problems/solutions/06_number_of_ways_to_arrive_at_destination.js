/**
 * 06. Number of Ways to Arrive at Destination   (LeetCode 1976 — Medium)
 *
 * PROBLEM
 * n intersections 0..n-1, roads[i] = [u, v, time] (undirected). Return the number of
 * different ways to travel from 0 to n-1 in the SHORTEST possible time, modulo 1e9 + 7.
 *
 * EXAMPLES
 * Input: n = 7, roads = [[0,6,7],[0,1,2],[1,2,3],[1,3,3],[6,3,3],[3,5,1],[6,5,1],
 *                        [2,5,1],[0,4,5],[4,6,2]]
 * Output: 4   (shortest time is 7; four routes achieve it)
 * Input: n = 2, roads = [[1,0,10]]   Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Times positive? (yes -> Dijkstra)
 * - Count can overflow? (mod 1e9+7)
 * - Graph connected? (yes per constraints)
 *
 * APPROACH 1 — Brute force (DFS enumerating every simple path)   exponential
 * Explore all simple paths 0 -> n-1, track the best time and how many paths hit it.
 *
 * APPROACH 2 — Optimal (Dijkstra + ways counter)   O((V + E) log V)
 * Run Dijkstra and carry ways[v] = number of shortest paths to v:
 *   - strictly better distance found:  dist[v] = d + w;  ways[v] = ways[u]
 *   - equal distance found:            ways[v] += ways[u]
 * Because Dijkstra finalises u before relaxing from it (non-negative weights), ways[u]
 * is complete when it is used.
 *
 * Dry run on a diamond 0-1 (1), 0-2 (1), 1-3 (1), 2-3 (1):
 *   pop 0: dist[1]=1 ways 1, dist[2]=1 ways 1
 *   pop 1: dist[3]=2 ways 1
 *   pop 2: dist[3]=2 equal -> ways[3] = 1 + 1 = 2
 *   answer 2
 *
 * EDGE CASES
 * - n = 1 -> 1 (you are already there)
 * - a single road -> 1
 * - parallel roads with equal time count as separate ways
 */

const { MinHeap } = require('../../02_Implementations/shortest_paths');
const MOD = 1_000_000_007;

function bruteForce(n, roads) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v, t] of roads) { adj[u].push([v, t]); adj[v].push([u, t]); }
  let best = Infinity;
  let count = 0;
  const visited = new Array(n).fill(false);
  function dfs(node, time) {
    if (time > best) return;
    if (node === n - 1) {
      if (time < best) { best = time; count = 1; } else count++;
      return;
    }
    visited[node] = true;
    for (const [next, t] of adj[node]) if (!visited[next]) dfs(next, time + t);
    visited[node] = false;
  }
  dfs(0, 0);
  return count % MOD;
}

function optimal(n, roads) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v, t] of roads) { adj[u].push([v, t]); adj[v].push([u, t]); }

  const dist = new Array(n).fill(Infinity);
  const ways = new Array(n).fill(0);
  dist[0] = 0;
  ways[0] = 1;
  const heap = new MinHeap();
  heap.push([0, 0]);
  while (!heap.isEmpty()) {
    const [d, u] = heap.pop();
    if (d > dist[u]) continue;
    for (const [v, t] of adj[u]) {
      const candidate = d + t;
      if (candidate < dist[v]) {               // new best: inherit u's count
        dist[v] = candidate;
        ways[v] = ways[u];
        heap.push([candidate, v]);
      } else if (candidate === dist[v]) {      // another way of equal length
        ways[v] = (ways[v] + ways[u]) % MOD;
      }
    }
  }
  return ways[n - 1];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  const roads = [[0, 6, 7], [0, 1, 2], [1, 2, 3], [1, 3, 3], [6, 3, 3], [3, 5, 1], [6, 5, 1], [2, 5, 1], [0, 4, 5], [4, 6, 2]];
  assert.strictEqual(solve(7, roads), 4);
  assert.strictEqual(solve(2, [[1, 0, 10]]), 1);
  assert.strictEqual(solve(1, []), 1);
  assert.strictEqual(solve(4, [[0, 1, 1], [0, 2, 1], [1, 3, 1], [2, 3, 1]]), 2);
  assert.strictEqual(solve(3, [[0, 1, 1], [1, 2, 1], [0, 2, 5]]), 1);
  assert.strictEqual(solve(2, [[0, 1, 3], [0, 1, 3]]), 2);      // parallel roads
}
console.log('✓ 06-number-of-ways-to-arrive-at-destination passed');

module.exports = { optimal, bruteForce };

/**
 * 07. Critical Connections in a Network   (LeetCode 1192 — Hard)
 *
 * PROBLEM
 * n servers 0..n-1 connected by undirected connections. A connection is CRITICAL if
 * removing it makes some server unreachable from some other. Return all critical
 * connections (any order).
 *
 * EXAMPLES
 * Input: n = 4, connections = [[0,1],[1,2],[2,0],[1,3]]   Output: [[1,3]]
 * Explanation: 0-1-2 is a cycle (no single edge is critical); 1-3 is the only link to 3.
 * Input: n = 2, connections = [[0,1]]                     Output: [[0,1]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Graph is connected? (yes)
 * - Up to 10^5 edges -> we need O(V + E); the brute force is O(E * (V + E))
 * - Output order / pair order? (any)
 *
 * Critical connection = BRIDGE.
 *
 * APPROACH 1 — Brute force (remove each edge, test connectivity)   O(E * (V + E))
 * For each edge: delete it, BFS from 0, if some node is unreachable the edge is a
 * bridge. Great oracle for tests.
 *
 * APPROACH 2 — Optimal (Tarjan low-link)   O(V + E) time, O(V) space
 *   ids[u] = DFS discovery time; low[u] = lowest id reachable from u's subtree using at
 *   most one back edge (and never the edge we came in by).
 *   After exploring child v of u: low[u] = min(low[u], low[v]).
 *   If low[v] > ids[u], the subtree under v has NO way back to u or above except through
 *   u-v -> u-v is a bridge.
 *
 * Dry run n=4, [[0,1],[1,2],[2,0],[1,3]]:
 *   dfs(0): id 0.  -> dfs(1): id 1.  -> dfs(2): id 2; 2 sees 0 (back edge) low[2]=0
 *     back in 1: low[1] = min(1, 0) = 0; low[2]=0 > ids[1]=1? no -> 1-2 not a bridge
 *     -> dfs(3): id 3, low 3. back in 1: low[3]=3 > ids[1]=1 -> 1-3 IS a bridge
 *   back in 0: low[1]=0 > ids[0]=0? no -> 0-1 not a bridge
 *
 * EDGE CASES
 * - a tree -> every edge is critical
 * - a single cycle -> none
 * - parallel edges between the same pair -> not critical (handled by skipping by edge index)
 */

const { findBridges } = require('../../02_Implementations/advanced_graph_algorithms');

function bruteForce(n, connections) {
  function connectedWithout(skip) {
    const adj = Array.from({ length: n }, () => []);
    connections.forEach(([u, v], i) => {
      if (i === skip) return;
      adj[u].push(v);
      adj[v].push(u);
    });
    const visited = new Array(n).fill(false);
    const stack = [0];
    visited[0] = true;
    let seen = 1;
    while (stack.length) {
      const u = stack.pop();
      for (const v of adj[u]) if (!visited[v]) { visited[v] = true; seen++; stack.push(v); }
    }
    return seen === n;
  }
  return connections.filter((_, i) => !connectedWithout(i)).map(([u, v]) => [u, v]);
}

function optimal(n, connections) {
  const adj = Array.from({ length: n }, () => []);  // [neighbour, edgeIndex]
  connections.forEach(([u, v], i) => {
    adj[u].push([v, i]);
    adj[v].push([u, i]);
  });
  const ids = new Array(n).fill(-1);
  const low = new Array(n).fill(0);
  const bridges = [];
  let timer = 0;

  function dfs(u, parentEdge) {
    ids[u] = low[u] = timer++;
    for (const [v, edgeIndex] of adj[u]) {
      if (edgeIndex === parentEdge) continue;        // do not go back along the same edge
      if (ids[v] === -1) {
        dfs(v, edgeIndex);
        low[u] = Math.min(low[u], low[v]);
        if (low[v] > ids[u]) bridges.push([u, v]);   // v's subtree cannot climb above u
      } else {
        low[u] = Math.min(low[u], ids[v]);           // back edge
      }
    }
  }

  for (let u = 0; u < n; u++) if (ids[u] === -1) dfs(u, -1);
  return bridges;
}

// ---------- tests ----------
const assert = require('assert');
const norm = (list) => list.map(([a, b]) => (a < b ? `${a}-${b}` : `${b}-${a}`)).sort();
for (const solve of [bruteForce, optimal, findBridges]) {
  assert.deepStrictEqual(norm(solve(4, [[0, 1], [1, 2], [2, 0], [1, 3]])), ['1-3']);
  assert.deepStrictEqual(norm(solve(2, [[0, 1]])), ['0-1']);
  assert.deepStrictEqual(norm(solve(3, [[0, 1], [1, 2], [2, 0]])), []);
  assert.deepStrictEqual(norm(solve(4, [[0, 1], [1, 2], [2, 3]])), ['0-1', '1-2', '2-3']);
  assert.deepStrictEqual(norm(solve(2, [[0, 1], [1, 0]])), []);                 // parallel edges
  assert.deepStrictEqual(norm(solve(6, [[0, 1], [1, 2], [2, 0], [2, 3], [3, 4], [4, 5], [5, 3]])), ['2-3']);
}
console.log('✓ 07-critical-connections passed');

module.exports = { optimal, bruteForce };

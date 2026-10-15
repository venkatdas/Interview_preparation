/**
 * 03. Find if Path Exists in Graph   (LeetCode 1971 — Easy)
 *
 * PROBLEM
 * There are n nodes 0..n-1 and an undirected edge list. Return true if there is a path
 * from `source` to `destination`.
 *
 * EXAMPLES
 * Input: n = 3, edges = [[0,1],[1,2],[2,0]], source = 0, destination = 2   Output: true
 * Input: n = 6, edges = [[0,1],[0,2],[3,5],[5,4],[4,3]], source = 0, destination = 5
 * Output: false   Explanation: {0,1,2} and {3,4,5} are separate components
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can source === destination? (yes -> true)
 * - Duplicate edges / self loops? (possible, harmless with a visited set)
 * - n up to 2*10^5, so the solution must be O(n + e)
 *
 * APPROACH 1 — Brute force (DFS over the raw edge list)   O(V * E) time, O(V) space
 * Do not build an adjacency list; for every node we visit, scan ALL edges to find its
 * neighbours. Correct, but each of the V visits costs O(E).
 *
 * APPROACH 2 — Optimal (BFS on adjacency list)   O(V + E) time, O(V + E) space
 *   1. Build the adjacency list (both directions).
 *   2. BFS from source with a visited array. If we ever pop destination -> true.
 *   3. Queue empties -> false.
 *
 * Dry run on n=3, edges [[0,1],[1,2],[2,0]], 0 -> 2:
 *   adj = {0:[1,2], 1:[0,2], 2:[1,0]}
 *   queue [0]  visited {0}
 *   pop 0: push 1, 2         visited {0,1,2}
 *   pop 1: 1 !== 2, neighbours already visited
 *   pop 2: === destination -> true
 *
 * (Union-Find also solves this; see 27_Union_Find_Disjoint_Set/01_Union_Find_Basics.)
 *
 * EDGE CASES
 * - source === destination -> true even with no edges
 * - n = 1
 * - no edges at all -> false unless source === destination
 */

const { buildAdjList } = require('../../../23_Graphs/02_Implementations/graph');

function bruteForce(n, edges, source, destination) {
  const visited = new Array(n).fill(false);
  const stack = [source];
  visited[source] = true;
  while (stack.length) {
    const current = stack.pop();
    if (current === destination) return true;
    for (const [u, v] of edges) {           // O(E) scan per visited node
      const next = u === current ? v : v === current ? u : -1;
      if (next !== -1 && !visited[next]) {
        visited[next] = true;
        stack.push(next);
      }
    }
  }
  return false;
}

function optimal(n, edges, source, destination) {
  if (source === destination) return true;
  const adj = buildAdjList(n, edges);
  const visited = new Array(n).fill(false);
  visited[source] = true;
  const queue = [source];
  let head = 0;
  while (head < queue.length) {
    const current = queue[head++];
    for (const next of adj[current]) {
      if (next === destination) return true;  // early exit
      if (!visited[next]) {
        visited[next] = true;
        queue.push(next);
      }
    }
  }
  return false;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(3, [[0, 1], [1, 2], [2, 0]], 0, 2), true);
  assert.strictEqual(solve(6, [[0, 1], [0, 2], [3, 5], [5, 4], [4, 3]], 0, 5), false);
  assert.strictEqual(solve(1, [], 0, 0), true);
  assert.strictEqual(solve(2, [], 0, 1), false);
  assert.strictEqual(solve(4, [[0, 1], [1, 2], [2, 3]], 3, 0), true);
  assert.strictEqual(solve(3, [[0, 0], [1, 1]], 0, 1), false); // self loops only
}
console.log('✓ 03-find-if-path-exists passed');

module.exports = { optimal, bruteForce };

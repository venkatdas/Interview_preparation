/**
 * 08. Graph Valid Tree   (LeetCode 261 — Medium)
 *
 * PROBLEM
 * n nodes 0..n-1 and an undirected edge list. Return true if the edges form a valid
 * tree: connected AND no cycles.
 *
 * EXAMPLES
 * Input: n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]         Output: true
 * Input: n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]   Output: false  (1-2-3 is a cycle)
 * Input: n = 2, edges = []                                 Output: false  (not connected)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can edges contain duplicates or self loops? (treat as cycle -> false)
 * - n = 1 with no edges? (true, a single node is a tree)
 *
 * KEY FACT: a tree on n nodes has EXACTLY n - 1 edges. So:
 *   edges.length !== n - 1  -> not a tree, instantly.
 *   edges.length === n - 1  -> it is a tree IF connected (then it cannot have a cycle,
 *                              because a cycle would "waste" an edge and leave something
 *                              disconnected).
 *
 * APPROACH 1 — Brute force (DFS with parent tracking + connectivity)   O(V + E)
 * DFS from 0, passing the parent. If we meet a visited node that is not our parent, there
 * is a cycle. After DFS, every node must be visited. Works without the edge-count trick,
 * and is the general "detect a cycle in an undirected graph" technique - worth knowing.
 *
 * APPROACH 2 — Optimal (edge count + one connectivity BFS)   O(V + E) time, O(V) space
 *   1. if edges.length !== n - 1 return false
 *   2. BFS from 0, count visited; return visited === n
 *
 * Dry run n=5, edges [[0,1],[0,2],[0,3],[1,4]]: 4 edges = n-1 ok.
 *   BFS from 0 -> 1,2,3 -> 4. visited 5 === n -> true.
 * Dry run n=5, edges [[0,1],[1,2],[2,3],[1,3],[1,4]]: 5 edges !== 4 -> false immediately.
 *
 * EDGE CASES
 * - n = 1, edges [] -> true
 * - correct edge count but two components + a cycle (e.g. n=4, [[0,1],[1,0],[2,3]])
 *   -> BFS from 0 visits only {0,1} -> false. The count trick + connectivity is enough.
 */

const { buildAdjList } = require('../../../23_Graphs/02_Implementations/graph');

function bruteForce(n, edges) {
  const adj = buildAdjList(n, edges);
  const visited = new Array(n).fill(false);

  // returns false when a cycle is found
  function dfs(node, parent) {
    visited[node] = true;
    for (const next of adj[node]) {
      if (next === parent) {
        // the edge we came from. (If the same edge appears twice, the second copy will
        // also look like "parent" - handle duplicates by counting them.)
        continue;
      }
      if (visited[next]) return false;          // reached an already-seen node = cycle
      if (!dfs(next, node)) return false;
    }
    return true;
  }

  // duplicate edges / self loops are cycles by definition
  const seen = new Set();
  for (const [u, v] of edges) {
    if (u === v) return false;
    const key = u < v ? `${u}-${v}` : `${v}-${u}`;
    if (seen.has(key)) return false;
    seen.add(key);
  }

  if (!dfs(0, -1)) return false;
  return visited.every(Boolean);                 // connected?
}

function optimal(n, edges) {
  if (edges.length !== n - 1) return false;      // a tree has exactly n - 1 edges
  const adj = buildAdjList(n, edges);
  const visited = new Array(n).fill(false);
  visited[0] = true;
  const queue = [0];
  let head = 0;
  let seenCount = 1;
  while (head < queue.length) {
    const current = queue[head++];
    for (const next of adj[current]) {
      if (!visited[next]) {
        visited[next] = true;
        seenCount++;
        queue.push(next);
      }
    }
  }
  return seenCount === n;                        // n - 1 edges + connected => tree
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(5, [[0, 1], [0, 2], [0, 3], [1, 4]]), true);
  assert.strictEqual(solve(5, [[0, 1], [1, 2], [2, 3], [1, 3], [1, 4]]), false);
  assert.strictEqual(solve(2, []), false);
  assert.strictEqual(solve(1, []), true);
  assert.strictEqual(solve(4, [[0, 1], [1, 0], [2, 3]]), false);   // duplicate edge
  assert.strictEqual(solve(4, [[0, 1], [2, 3], [1, 2]]), true);
  assert.strictEqual(solve(3, [[0, 1], [1, 2], [2, 0]]), false);   // triangle
}
console.log('✓ 08-graph-valid-tree passed');

module.exports = { optimal, bruteForce };

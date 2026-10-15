/**
 * 10. Shortest Path Visiting All Nodes   (LeetCode 847 — Hard)
 *
 * PROBLEM
 * An undirected connected graph with n nodes (graph[i] = neighbours of i). Return the
 * length of the shortest walk that visits EVERY node at least once. You may start at any
 * node, revisit nodes and reuse edges.
 *
 * EXAMPLES
 * Input: [[1,2,3],[0],[0],[0]]           Output: 4   (e.g. 1 -> 0 -> 2 -> 0 -> 3)
 * Input: [[1],[0,2,4],[1,3,4],[2],[1,2]] Output: 4   (e.g. 0 -> 1 -> 4 -> 2 -> 3)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n <= 12 -> 2^12 * 12 = 49k states, BFS is fine
 * - Single node -> 0
 *
 * The position alone is not enough: we need to remember WHICH nodes we have seen.
 * State = (currentNode, visitedMask). All moves cost 1 -> BFS.
 *
 * APPROACH 1 — Brute force (all-pairs BFS distances + try every visiting order)   O(n! * n)
 * Compute dist[i][j] with BFS from each node, then try every permutation of nodes as the
 * order in which they are FIRST visited, summing the pairwise distances. Correct because
 * between consecutive "new" nodes the walk takes a shortest path. Works for n <= 8 or so.
 *
 * APPROACH 2 — Optimal (BFS over (node, mask))   O(2^n * n^2) time, O(2^n * n) space
 *   1. Start from EVERY node simultaneously: state (i, 1 << i) at distance 0.
 *   2. BFS: from (u, mask), move to (v, mask | 1 << v) for every neighbour v.
 *   3. The first state with mask === (1 << n) - 1 gives the answer.
 *
 * Dry run on the star [[1,2,3],[0],[0],[0]]:
 *   level 0: (0,0001) (1,0010) (2,0100) (3,1000)
 *   level 1: from leaves: (0,0011) (0,0101) (0,1001); from centre: (1,0011) (2,0101) (3,1001)
 *   level 2: (2,0111) (3,1011) ... (0,0111)...
 *   level 3: (0,0111)->(3,1111)? (0, 0111) came at level 3 from (2,0111) at level 2
 *   level 4: (3,1111) full mask -> 4
 *
 * EDGE CASES
 * - n = 1 -> 0
 * - a path graph of n nodes -> n - 1
 * - complete graph -> n - 1
 */

function bruteForce(graph) {
  const n = graph.length;
  if (n === 1) return 0;
  const dist = Array.from({ length: n }, (_, s) => {
    const d = new Array(n).fill(-1);
    d[s] = 0;
    const queue = [s];
    let head = 0;
    while (head < queue.length) {
      const u = queue[head++];
      for (const v of graph[u]) if (d[v] === -1) { d[v] = d[u] + 1; queue.push(v); }
    }
    return d;
  });
  let best = Infinity;
  const used = new Array(n).fill(false);
  function permute(last, count, length) {
    if (length >= best) return;
    if (count === n) { best = length; return; }
    for (let v = 0; v < n; v++) {
      if (used[v]) continue;
      used[v] = true;
      permute(v, count + 1, last === -1 ? 0 : length + dist[last][v]);
      used[v] = false;
    }
  }
  permute(-1, 0, 0);
  return best;
}

function optimal(graph) {
  const n = graph.length;
  const fullMask = (1 << n) - 1;
  if (n === 1) return 0;
  const visited = Array.from({ length: n }, () => new Uint8Array(1 << n));
  let frontier = [];
  for (let node = 0; node < n; node++) {        // every node is a possible start
    visited[node][1 << node] = 1;
    frontier.push([node, 1 << node]);
  }
  let steps = 0;
  while (frontier.length) {
    steps++;
    const next = [];
    for (const [node, mask] of frontier) {
      for (const nb of graph[node]) {
        const nextMask = mask | (1 << nb);
        if (nextMask === fullMask) return steps;   // everything seen
        if (visited[nb][nextMask]) continue;
        visited[nb][nextMask] = 1;
        next.push([nb, nextMask]);
      }
    }
    frontier = next;
  }
  return -1; // unreachable for a connected graph
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([[1, 2, 3], [0], [0], [0]]), 4);
  assert.strictEqual(solve([[1], [0, 2, 4], [1, 3, 4], [2], [1, 2]]), 4);
  assert.strictEqual(solve([[]]), 0);
  assert.strictEqual(solve([[1], [0]]), 1);
  assert.strictEqual(solve([[1], [0, 2], [1, 3], [2]]), 3);             // path
  assert.strictEqual(solve([[1, 2], [0, 2], [0, 1]]), 2);                // triangle
  assert.strictEqual(solve([[1, 2, 3, 4], [0], [0], [0], [0]]), 6);      // star with 4 leaves: 2*4-2
}
console.log('✓ 10-shortest-path-visiting-all-nodes passed');

module.exports = { optimal, bruteForce };

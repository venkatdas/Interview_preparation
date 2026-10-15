/**
 * 04. Minimum Height Trees   (LeetCode 310 — Medium)
 *
 * PROBLEM
 * A tree with n nodes (0..n-1) is given as an undirected edge list. You can pick any node
 * as the root; the height is the longest path from the root to a leaf. Return all roots
 * that give the MINIMUM height.
 *
 * EXAMPLES
 * Input: n = 4, edges = [[1,0],[1,2],[1,3]]              Output: [1]
 * Input: n = 6, edges = [[3,0],[3,1],[3,2],[3,4],[5,4]]  Output: [3,4]
 * Input: n = 1, edges = []                               Output: [0]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Input is guaranteed to be a tree? (yes)
 * - How many answers can there be? (at most 2 - the middle of the longest path)
 *
 * APPROACH 1 — Brute force (BFS from every node, measure height)   O(n^2) time
 * For each node run a BFS to find the farthest node (= height). Keep the nodes with the
 * minimal height. n BFS runs of O(n).
 *
 * APPROACH 2 — Optimal (peel the leaves layer by layer - "topological sort on a tree")
 *   O(n) time, O(n) space
 * The best roots are the CENTRE of the tree: the middle node(s) of the longest path.
 * Find the centre by trimming leaves (degree 1 nodes) round by round, like Kahn's
 * algorithm with "in-degree 1" instead of 0. When 1 or 2 nodes remain, they are the
 * answer.
 *
 * Dry run n=6, edges [[3,0],[3,1],[3,2],[3,4],[5,4]]:
 *   degree [1,1,1,4,2,1]   leaves [0,1,2,5]   remaining 6
 *   round 1: remove 0,1,2,5 -> remaining 2. degree[3]=1, degree[4]=1 -> new leaves [3,4]
 *   remaining <= 2 -> stop. answer [3,4]
 *
 * EDGE CASES
 * - n = 1 -> [0]; n = 2 -> [0, 1]
 * - a straight line of odd length -> one centre; even length -> two centres
 */

const { buildAdjList } = require('../../../23_Graphs/02_Implementations/graph');

function bruteForce(n, edges) {
  const adj = buildAdjList(n, edges);
  function height(root) {
    const dist = new Array(n).fill(-1);
    dist[root] = 0;
    const queue = [root];
    let head = 0;
    let farthest = 0;
    while (head < queue.length) {
      const cur = queue[head++];
      farthest = Math.max(farthest, dist[cur]);
      for (const next of adj[cur]) {
        if (dist[next] === -1) { dist[next] = dist[cur] + 1; queue.push(next); }
      }
    }
    return farthest;
  }
  const heights = Array.from({ length: n }, (_, root) => height(root));
  const best = Math.min(...heights);
  return heights.map((h, i) => (h === best ? i : -1)).filter((i) => i !== -1);
}

function optimal(n, edges) {
  if (n <= 2) return Array.from({ length: n }, (_, i) => i);
  const adj = buildAdjList(n, edges);
  const degree = adj.map((list) => list.length);

  let leaves = [];
  for (let node = 0; node < n; node++) if (degree[node] === 1) leaves.push(node);

  let remaining = n;
  while (remaining > 2) {
    remaining -= leaves.length;              // peel this whole layer
    const nextLeaves = [];
    for (const leaf of leaves) {
      for (const neighbor of adj[leaf]) {
        if (--degree[neighbor] === 1) nextLeaves.push(neighbor); // became a leaf
      }
    }
    leaves = nextLeaves;
  }
  return leaves;                             // 1 or 2 centre nodes
}

// ---------- tests ----------
const assert = require('assert');
const sorted = (arr) => [...arr].sort((a, b) => a - b);
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(sorted(solve(4, [[1, 0], [1, 2], [1, 3]])), [1]);
  assert.deepStrictEqual(sorted(solve(6, [[3, 0], [3, 1], [3, 2], [3, 4], [5, 4]])), [3, 4]);
  assert.deepStrictEqual(sorted(solve(1, [])), [0]);
  assert.deepStrictEqual(sorted(solve(2, [[0, 1]])), [0, 1]);
  assert.deepStrictEqual(sorted(solve(5, [[0, 1], [1, 2], [2, 3], [3, 4]])), [2]);   // odd line
  assert.deepStrictEqual(sorted(solve(4, [[0, 1], [1, 2], [2, 3]])), [1, 2]);        // even line
}
console.log('✓ 04-minimum-height-trees passed');

module.exports = { optimal, bruteForce };

/**
 * 01. Is Graph Bipartite?   (LeetCode 785 — Medium)
 *
 * PROBLEM
 * graph[u] is the list of nodes adjacent to u (undirected, no self loops, no parallel
 * edges, possibly disconnected). Return true if the nodes can be split into two sets so
 * that every edge connects a node from one set to a node from the other.
 *
 * EXAMPLES
 * Input: [[1,2,3],[0,2],[0,1,3],[0,2]]   Output: false   (0-1-2 is a triangle)
 * Input: [[1,3],[0,2],[1,3],[0,2]]       Output: true    ({0,2} and {1,3})
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Disconnected graph allowed? (yes -> loop over every start node)
 * - Empty graph / isolated nodes? (bipartite)
 *
 * APPROACH 1 — Brute force (try every 2-colouring)   O(2^n * E) time
 * Enumerate all 2^n assignments of colours; accept if some assignment has no
 * same-colour edge. Fine for n <= 20, useless beyond.
 *
 * APPROACH 2 — Optimal (BFS 2-colouring)   O(V + E) time, O(V) space
 *   1. color[] = -1 for all.
 *   2. For every uncoloured node: colour it 0, BFS. Each neighbour gets 1 - colour.
 *      If a neighbour already has the SAME colour -> odd cycle -> false.
 *   3. Finished every component -> true.
 *
 * Dry run on [[1,3],[0,2],[1,3],[0,2]]:
 *   color 0 = 0; queue [0]
 *   pop 0: 1 -> 1, 3 -> 1
 *   pop 1: 0 is 0 (different, ok), 2 -> 0
 *   pop 3: 0 ok, 2 is 0 (different, ok)
 *   pop 2: 1 is 1 ok, 3 is 1 ok -> true
 * On the triangle: 0=0, 1=1, 2=1 (from 0)... then edge 1-2 both 1 -> false.
 *
 * EDGE CASES
 * - graph = [] -> true
 * - single node with no edges -> true
 * - two components, one bipartite one not -> false
 */

const { isBipartite } = require('../../02_Implementations/advanced_graph_algorithms');

function bruteForce(graph) {
  const n = graph.length;
  for (let mask = 0; mask < 1 << n; mask++) {
    let ok = true;
    for (let u = 0; u < n && ok; u++) {
      for (const v of graph[u]) {
        if (((mask >> u) & 1) === ((mask >> v) & 1)) { ok = false; break; }
      }
    }
    if (ok) return true;
  }
  return false;
}

function optimal(graph) {
  const n = graph.length;
  const color = new Array(n).fill(-1);
  for (let start = 0; start < n; start++) {
    if (color[start] !== -1) continue;       // already handled by another component
    color[start] = 0;
    const queue = [start];
    let head = 0;
    while (head < queue.length) {
      const u = queue[head++];
      for (const v of graph[u]) {
        if (color[v] === -1) {
          color[v] = 1 - color[u];           // opposite colour
          queue.push(v);
        } else if (color[v] === color[u]) {
          return false;                      // same colour on both ends = odd cycle
        }
      }
    }
  }
  return true;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal, (g) => isBipartite(g.length, g)]) {
  assert.strictEqual(solve([[1, 2, 3], [0, 2], [0, 1, 3], [0, 2]]), false);
  assert.strictEqual(solve([[1, 3], [0, 2], [1, 3], [0, 2]]), true);
  assert.strictEqual(solve([]), true);
  assert.strictEqual(solve([[]]), true);
  assert.strictEqual(solve([[1], [0], [3], [2]]), true);                  // two components
  assert.strictEqual(solve([[1], [0], [3, 4], [2, 4], [2, 3]]), false);   // second has triangle
  assert.strictEqual(solve([[1, 4], [0, 2], [1, 3], [2, 4], [3, 0]]), false); // 5-cycle
}
console.log('✓ 01-is-graph-bipartite passed');

module.exports = { optimal, bruteForce };

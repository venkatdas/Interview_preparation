/**
 * 03. Find Eventual Safe States   (LeetCode 802 — Medium)
 *
 * PROBLEM
 * Directed graph given as graph[i] = list of nodes i points to. A node is "terminal" if
 * it has no outgoing edges. A node is "safe" if EVERY path from it leads to a terminal
 * node (i.e. you can never get stuck in a cycle). Return all safe nodes in ascending order.
 *
 * EXAMPLES
 * Input: [[1,2],[2,3],[5],[0],[5],[],[]]   Output: [2,4,5,6]
 * Explanation: 5 and 6 are terminal. 2 -> 5 and 4 -> 5 only reach terminals.
 * 0,1,3 can enter the cycle 0 -> 1 -> 3 -> 0.
 * Input: [[1,2,3,4],[1,2],[3,4],[0,4],[]]   Output: [4]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Output sorted? (yes)
 * - Self loops? (a node with a self loop is unsafe)
 *
 * APPROACH 1 — Alternative (3-colour DFS with memo)   O(V + E) time, O(V) space
 * DFS from each node. GRAY = on the current path. If we reach a gray node the current
 * node is unsafe. A node is safe iff all its neighbours are safe. Memoise the colour so
 * each node is resolved once: BLACK after the DFS returns, with safe[node] stored.
 * Shown as `dfsVersion`.
 *
 * APPROACH 2 — Optimal (reverse graph + Kahn)   O(V + E) time, O(V + E) space
 * Flip every edge. In the reversed graph, terminal nodes have in-degree 0... wait, no:
 * in the reversed graph the OUT-degree of the original becomes the in-degree. So:
 *   1. outdeg[i] = graph[i].length; reverse adjacency rev[j].push(i) for each i -> j.
 *   2. Queue every node with outdeg 0 (terminals). They are safe.
 *   3. Pop node u: for each predecessor p (rev[u]), decrement outdeg[p]; when it reaches
 *      0 ALL of p's successors have been proven safe -> p is safe, push it.
 *   4. Nodes never popped are stuck in / lead into cycles.
 *
 * Dry run on [[1,2],[2,3],[5],[0],[5],[],[]]:
 *   outdeg [2,2,1,1,1,0,0]  rev: 5:[2,4] 0:[3] 1:[0] 2:[0,1] 3:[1]
 *   queue [5,6]
 *   pop 5: outdeg[2]=0 push 2, outdeg[4]=0 push 4
 *   pop 6: no predecessors
 *   pop 2: outdeg[0]=1, outdeg[1]=1
 *   pop 4: no predecessors
 *   done. safe = {2,4,5,6} sorted -> [2,4,5,6]
 *
 * EDGE CASES
 * - all terminal -> all nodes
 * - single node self loop -> []
 * - graph with no edges at all
 */

function dfsVersion(graph) {
  const n = graph.length;
  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Array(n).fill(WHITE);
  const safe = new Array(n).fill(false);

  function dfs(node) {
    if (color[node] === GRAY) return false;       // on current path -> cycle
    if (color[node] === BLACK) return safe[node]; // memoised
    color[node] = GRAY;
    let allSafe = true;
    for (const next of graph[node]) {
      if (!dfs(next)) { allSafe = false; break; }
    }
    color[node] = BLACK;
    safe[node] = allSafe;
    return allSafe;
  }

  const result = [];
  for (let node = 0; node < n; node++) if (dfs(node)) result.push(node);
  return result;
}

function optimal(graph) {
  const n = graph.length;
  const outdeg = graph.map((list) => list.length);
  const rev = Array.from({ length: n }, () => []);
  for (let from = 0; from < n; from++) {
    for (const to of graph[from]) rev[to].push(from);   // reversed edge to -> from
  }

  const queue = [];
  for (let node = 0; node < n; node++) if (outdeg[node] === 0) queue.push(node);

  const safe = new Array(n).fill(false);
  let head = 0;
  while (head < queue.length) {
    const node = queue[head++];
    safe[node] = true;
    for (const pred of rev[node]) {
      if (--outdeg[pred] === 0) queue.push(pred);   // all of pred's exits are safe
    }
  }

  const result = [];
  for (let node = 0; node < n; node++) if (safe[node]) result.push(node);
  return result;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [dfsVersion, optimal]) {
  assert.deepStrictEqual(solve([[1, 2], [2, 3], [5], [0], [5], [], []]), [2, 4, 5, 6]);
  assert.deepStrictEqual(solve([[1, 2, 3, 4], [1, 2], [3, 4], [0, 4], []]), [4]);
  assert.deepStrictEqual(solve([[]]), [0]);
  assert.deepStrictEqual(solve([[0]]), []);
  assert.deepStrictEqual(solve([[], [], []]), [0, 1, 2]);
  assert.deepStrictEqual(solve([[1], [2], [0], [1]]), []);
  assert.deepStrictEqual(solve([[1], [2], []]), [0, 1, 2]);
}
console.log('✓ 03-find-eventual-safe-states passed');

module.exports = { optimal, dfsVersion };

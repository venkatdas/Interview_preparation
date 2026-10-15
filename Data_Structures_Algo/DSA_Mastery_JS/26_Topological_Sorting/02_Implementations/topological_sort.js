/**
 * Topological sort in JavaScript.
 *
 * 1. topoSortKahn       - BFS style: in-degrees + queue. Returns [] if the graph has a cycle.
 * 2. topoSortDfs        - DFS post-order, reversed. Detects cycles with 3 colours.
 * 3. hasCycleDirected   - white / gray / black DFS cycle detection
 * 4. longestPathInDag   - DP in topological order (bonus, used by "longest path" problems)
 *
 * All O(V + E) time, O(V) space. Only meaningful on DIRECTED graphs.
 */

const { buildAdjList } = require('../../23_Graphs/02_Implementations/graph');

// ---------- 1. Kahn's algorithm ----------
// A node with in-degree 0 has no prerequisites, so it can go first. Remove it and its
// outgoing edges; any neighbour whose in-degree drops to 0 is now free. Repeat.
// If fewer than n nodes come out, the leftovers are stuck in a cycle.
function topoSortKahn(n, edges) {
  const adj = buildAdjList(n, edges, true);
  const indegree = new Array(n).fill(0);
  for (const [, to] of edges) indegree[to]++;

  const queue = [];
  for (let node = 0; node < n; node++) if (indegree[node] === 0) queue.push(node);

  const order = [];
  let head = 0;
  while (head < queue.length) {
    const current = queue[head++];
    order.push(current);
    for (const next of adj[current]) {
      indegree[next]--;                      // "remove" the edge current -> next
      if (indegree[next] === 0) queue.push(next);
    }
  }
  return order.length === n ? order : [];    // [] signals a cycle
}

// ---------- 2. DFS post-order ----------
// When DFS FINISHES a node, every node reachable from it has already finished.
// So "finish order" is a reverse topological order. Reverse it at the end.
const WHITE = 0; // never seen
const GRAY = 1;  // currently on the recursion stack
const BLACK = 2; // completely finished

function topoSortDfs(n, edges) {
  const adj = buildAdjList(n, edges, true);
  const color = new Array(n).fill(WHITE);
  const finished = [];
  let hasCycle = false;

  function dfs(node) {
    color[node] = GRAY;
    for (const next of adj[node]) {
      if (color[next] === GRAY) { hasCycle = true; return; } // back edge = cycle
      if (color[next] === WHITE) dfs(next);
      if (hasCycle) return;
    }
    color[node] = BLACK;
    finished.push(node);                     // post-order
  }

  for (let node = 0; node < n; node++) {
    if (color[node] === WHITE) dfs(node);
    if (hasCycle) return [];
  }
  return finished.reverse();
}

// ---------- 3. Cycle detection in a directed graph ----------
// A GRAY neighbour means we walked in a circle back onto the current path.
// A BLACK neighbour is just a node finished earlier - NOT a cycle (this is the mistake
// people make when they reuse the undirected "visited means cycle" logic).
function hasCycleDirected(n, edges) {
  const adj = buildAdjList(n, edges, true);
  const color = new Array(n).fill(WHITE);

  function dfs(node) {
    color[node] = GRAY;
    for (const next of adj[node]) {
      if (color[next] === GRAY) return true;
      if (color[next] === WHITE && dfs(next)) return true;
    }
    color[node] = BLACK;
    return false;
  }

  for (let node = 0; node < n; node++) {
    if (color[node] === WHITE && dfs(node)) return true;
  }
  return false;
}

// ---------- 4. Longest path in a DAG ----------
// Process nodes in topological order; by the time we reach a node, all its predecessors
// have their final answer. dist[node] = max over predecessors of dist[pred] + weight.
// Returns the length of the longest path (in edges) ending anywhere, or -1 on a cycle.
function longestPathInDag(n, edges) {
  const order = topoSortKahn(n, edges);
  if (order.length !== n) return -1;
  const adj = buildAdjList(n, edges, true);
  const dist = new Array(n).fill(0);
  for (const node of order) {
    for (const next of adj[node]) {
      dist[next] = Math.max(dist[next], dist[node] + 1);
    }
  }
  return Math.max(...dist);
}

// ---------- self-test ----------
// (runs only when this file is executed directly, not when required by a problem)
if (require.main === module) {
const assert = require('assert');

// DAG:  0 -> 1 -> 3,  0 -> 2 -> 3,  4 isolated
const dag = [[0, 1], [0, 2], [1, 3], [2, 3]];
const isValidOrder = (order, edges) => {
  const pos = new Map(order.map((node, i) => [node, i]));
  return edges.every(([u, v]) => pos.get(u) < pos.get(v));
};

const kahn = topoSortKahn(5, dag);
assert.strictEqual(kahn.length, 5);
assert.ok(isValidOrder(kahn, dag));
assert.deepStrictEqual(kahn, [0, 4, 1, 2, 3]);

const dfsOrder = topoSortDfs(5, dag);
assert.strictEqual(dfsOrder.length, 5);
assert.ok(isValidOrder(dfsOrder, dag));

// cycle: 0 -> 1 -> 2 -> 0
const cyclic = [[0, 1], [1, 2], [2, 0]];
assert.deepStrictEqual(topoSortKahn(3, cyclic), []);
assert.deepStrictEqual(topoSortDfs(3, cyclic), []);
assert.strictEqual(hasCycleDirected(3, cyclic), true);
assert.strictEqual(hasCycleDirected(5, dag), false);
// diamond is NOT a cycle (black neighbour)
assert.strictEqual(hasCycleDirected(4, [[0, 1], [0, 2], [1, 3], [2, 3]]), false);
assert.strictEqual(hasCycleDirected(1, [[0, 0]]), true); // self loop

assert.strictEqual(longestPathInDag(5, dag), 2);
assert.strictEqual(longestPathInDag(4, [[0, 1], [1, 2], [2, 3]]), 3);
assert.strictEqual(longestPathInDag(3, cyclic), -1);
assert.strictEqual(longestPathInDag(3, []), 0);

console.log('✓ topological-sort.js self-test passed');
}

module.exports = { topoSortKahn, topoSortDfs, hasCycleDirected, longestPathInDag, WHITE, GRAY, BLACK };

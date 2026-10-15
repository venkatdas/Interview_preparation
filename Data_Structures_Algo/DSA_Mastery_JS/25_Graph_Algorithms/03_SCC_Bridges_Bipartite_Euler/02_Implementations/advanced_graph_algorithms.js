/**
 * Advanced graph algorithms in JavaScript.
 *
 * 1. isBipartite        - BFS 2-colouring (undirected)
 * 2. tarjanSCC          - strongly connected components, one DFS with low-link values
 * 3. kosarajuSCC        - strongly connected components, two DFS passes (simpler to explain)
 * 4. findBridges        - edges whose removal disconnects the graph (undirected, low-link)
 * 5. articulationPoints - vertices whose removal disconnects the graph (undirected, low-link)
 * 6. hierholzer         - Eulerian path / circuit in a directed graph (use every edge once)
 *
 * All O(V + E) time, O(V) space. Adjacency lists are plain arrays of neighbours
 * (adj[u] = [v, ...]) unless stated otherwise.
 */

const { buildAdjList } = require('../../../23_Graphs/02_Implementations/graph');

// ---------- 1. Bipartite check ----------
// Colour the start node 0; every neighbour must get the opposite colour. If an edge ever
// joins two nodes of the same colour the graph has an odd cycle -> not bipartite.
// Loop over all nodes so disconnected pieces are checked too.
function isBipartite(n, adj) {
  const color = new Array(n).fill(-1);
  for (let start = 0; start < n; start++) {
    if (color[start] !== -1) continue;
    color[start] = 0;
    const queue = [start];
    let head = 0;
    while (head < queue.length) {
      const u = queue[head++];
      for (const v of adj[u]) {
        if (color[v] === -1) {
          color[v] = 1 - color[u];
          queue.push(v);
        } else if (color[v] === color[u]) {
          return false;
        }
      }
    }
  }
  return true;
}

// ---------- 2. Tarjan SCC ----------
// ids[u]  = order in which u was discovered
// low[u]  = smallest id reachable from u using tree edges + ONE back edge to a node still
//           on the stack. If low[u] === ids[u], u is the "root" of an SCC: pop until u.
function tarjanSCC(n, adj) {
  const ids = new Array(n).fill(-1);
  const low = new Array(n).fill(0);
  const onStack = new Array(n).fill(false);
  const stack = [];
  const components = [];
  let timer = 0;

  function dfs(u) {
    ids[u] = low[u] = timer++;
    stack.push(u);
    onStack[u] = true;
    for (const v of adj[u]) {
      if (ids[v] === -1) {
        dfs(v);
        low[u] = Math.min(low[u], low[v]);          // propagate child's reach upward
      } else if (onStack[v]) {
        low[u] = Math.min(low[u], ids[v]);          // back edge to an active node
      }
      // else: v belongs to an already-finished SCC - ignore (cross edge)
    }
    if (low[u] === ids[u]) {                        // u is the root of its SCC
      const component = [];
      let node;
      do {
        node = stack.pop();
        onStack[node] = false;
        component.push(node);
      } while (node !== u);
      components.push(component);
    }
  }

  for (let u = 0; u < n; u++) if (ids[u] === -1) dfs(u);
  return components;
}

// ---------- 3. Kosaraju SCC ----------
// Pass 1: DFS on the graph, record nodes in order of FINISHING.
// Pass 2: DFS on the REVERSED graph, starting from the last-finished node. Each DFS tree
//         in pass 2 is exactly one SCC. Why: reversing kills every edge that leaves an SCC
//         "downstream", so from the latest-finished node you can only reach its own SCC.
function kosarajuSCC(n, adj) {
  const visited = new Array(n).fill(false);
  const finishOrder = [];
  function dfs1(u) {
    visited[u] = true;
    for (const v of adj[u]) if (!visited[v]) dfs1(v);
    finishOrder.push(u);
  }
  for (let u = 0; u < n; u++) if (!visited[u]) dfs1(u);

  const rev = Array.from({ length: n }, () => []);
  for (let u = 0; u < n; u++) for (const v of adj[u]) rev[v].push(u);

  visited.fill(false);
  const components = [];
  function dfs2(u, component) {
    visited[u] = true;
    component.push(u);
    for (const v of rev[u]) if (!visited[v]) dfs2(v, component);
  }
  for (let i = finishOrder.length - 1; i >= 0; i--) {
    const u = finishOrder[i];
    if (!visited[u]) {
      const component = [];
      dfs2(u, component);
      components.push(component);
    }
  }
  return components;
}

// ---------- 4. Bridges (undirected) ----------
// Edge (u, v) with v a DFS child is a bridge iff low[v] > ids[u]: nothing in v's subtree
// can climb back to u or above without using the edge u-v itself.
// We skip the edge we arrived by using its INDEX (not the parent node) so parallel edges
// are handled correctly.
function findBridges(n, edges) {
  const adj = Array.from({ length: n }, () => []);     // adj[u] = [[v, edgeIndex], ...]
  edges.forEach(([u, v], i) => {
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
      if (edgeIndex === parentEdge) continue;
      if (ids[v] === -1) {
        dfs(v, edgeIndex);
        low[u] = Math.min(low[u], low[v]);
        if (low[v] > ids[u]) bridges.push([u, v]);   // subtree of v cannot reach u's ancestors
      } else {
        low[u] = Math.min(low[u], ids[v]);
      }
    }
  }

  for (let u = 0; u < n; u++) if (ids[u] === -1) dfs(u, -1);
  return bridges;
}

// ---------- 5. Articulation points (undirected) ----------
// Non-root u is an articulation point iff it has a child v with low[v] >= ids[u].
// The DFS root is one iff it has 2 or more DFS children.
function articulationPoints(n, edges) {
  const adj = buildAdjList(n, edges);
  const ids = new Array(n).fill(-1);
  const low = new Array(n).fill(0);
  const isCut = new Array(n).fill(false);
  let timer = 0;

  function dfs(u, parent) {
    ids[u] = low[u] = timer++;
    let children = 0;
    for (const v of adj[u]) {
      if (v === parent) continue;
      if (ids[v] === -1) {
        children++;
        dfs(v, u);
        low[u] = Math.min(low[u], low[v]);
        if (parent !== -1 && low[v] >= ids[u]) isCut[u] = true;   // >= (not >) for vertices
      } else {
        low[u] = Math.min(low[u], ids[v]);
      }
    }
    if (parent === -1 && children >= 2) isCut[u] = true;
  }

  for (let u = 0; u < n; u++) if (ids[u] === -1) dfs(u, -1);
  return isCut.map((cut, u) => (cut ? u : -1)).filter((u) => u !== -1);
}

// ---------- 6. Hierholzer (Eulerian path, directed) ----------
// adj: Map<node, Array<node>> - neighbours are consumed in ARRAY ORDER (sort them first if
// you need the lexicographically smallest path, as in Reconstruct Itinerary).
// Walk greedily from `start`; when stuck, the stuck node is appended to the result
// (post-order). The result reversed is the Eulerian path. Every edge is used once.
function hierholzer(adj, start) {
  const pointer = new Map();                       // node -> index of next unused edge
  const path = [];
  const stack = [start];
  while (stack.length) {
    const u = stack[stack.length - 1];
    const edges = adj.get(u) ?? [];
    const i = pointer.get(u) ?? 0;
    if (i < edges.length) {
      pointer.set(u, i + 1);                       // consume edge u -> edges[i]
      stack.push(edges[i]);
    } else {
      path.push(stack.pop());                      // dead end: finalise this node
    }
  }
  return path.reverse();
}

// ---------- self-test ----------
// (runs only when this file is executed directly, not when required by a problem)
if (require.main === module) {
const assert = require('assert');
const sortComponents = (comps) => comps.map((c) => [...c].sort((a, b) => a - b)).sort((a, b) => a[0] - b[0]);

// bipartite: square 0-1-2-3-0 yes; triangle no
assert.strictEqual(isBipartite(4, buildAdjList(4, [[0, 1], [1, 2], [2, 3], [3, 0]])), true);
assert.strictEqual(isBipartite(3, buildAdjList(3, [[0, 1], [1, 2], [2, 0]])), false);
assert.strictEqual(isBipartite(3, buildAdjList(3, [])), true);
assert.strictEqual(isBipartite(5, buildAdjList(5, [[0, 1], [2, 3], [3, 4], [4, 2]])), false);

// SCC: 0->1->2->0 (cycle), 2->3, 3->4->3 (cycle), 5 alone
const dirEdges = [[0, 1], [1, 2], [2, 0], [2, 3], [3, 4], [4, 3]];
const dirAdj = buildAdjList(6, dirEdges, true);
const expectedSCC = [[0, 1, 2], [3, 4], [5]];
assert.deepStrictEqual(sortComponents(tarjanSCC(6, dirAdj)), expectedSCC);
assert.deepStrictEqual(sortComponents(kosarajuSCC(6, dirAdj)), expectedSCC);
// a DAG: every node its own SCC
assert.strictEqual(tarjanSCC(4, buildAdjList(4, [[0, 1], [1, 2], [2, 3]], true)).length, 4);
assert.strictEqual(kosarajuSCC(4, buildAdjList(4, [[0, 1], [1, 2], [2, 3]], true)).length, 4);

// bridges / articulation points:
//   0 - 1 - 2 - 0 (triangle), 1 - 3 (bridge), 3 - 4 (bridge)
const undEdges = [[0, 1], [1, 2], [2, 0], [1, 3], [3, 4]];
assert.deepStrictEqual(findBridges(5, undEdges).map((e) => e.sort()).sort(), [[1, 3], [3, 4]]);
assert.deepStrictEqual(articulationPoints(5, undEdges), [1, 3]);
assert.deepStrictEqual(findBridges(3, [[0, 1], [1, 2], [2, 0]]), []);
assert.deepStrictEqual(findBridges(2, [[0, 1], [0, 1]]), []);         // parallel edges: no bridge
assert.deepStrictEqual(findBridges(2, [[0, 1]]), [[0, 1]]);
assert.deepStrictEqual(articulationPoints(3, [[0, 1], [1, 2]]), [1]);
assert.deepStrictEqual(articulationPoints(3, [[0, 1], [1, 2], [2, 0]]), []);

// Eulerian path: JFK -> SFO, JFK -> ATL, SFO -> ATL, ATL -> JFK, ATL -> SFO
const itin = new Map([
  ['JFK', ['ATL', 'SFO']],
  ['SFO', ['ATL']],
  ['ATL', ['JFK', 'SFO']],
]);
assert.deepStrictEqual(hierholzer(itin, 'JFK'), ['JFK', 'ATL', 'JFK', 'SFO', 'ATL', 'SFO']);
assert.deepStrictEqual(hierholzer(new Map([[0, [1]], [1, [2]]]), 0), [0, 1, 2]);
assert.deepStrictEqual(hierholzer(new Map(), 7), [7]);

console.log('✓ advanced-graph-algorithms.js self-test passed');
}

module.exports = { isBipartite, tarjanSCC, kosarajuSCC, findBridges, articulationPoints, hierholzer };

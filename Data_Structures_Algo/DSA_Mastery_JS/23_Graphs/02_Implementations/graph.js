/**
 * Graph implementation in JavaScript.
 *
 * 1. Graph            - adjacency-list graph (directed or undirected, optionally weighted)
 *                       with BFS, DFS (iterative + recursive), hasPath, connectedComponents
 * 2. buildAdjList     - the helper you will write in EVERY interview:
 *                       turn `n` + an edge list into an adjacency list (array of arrays)
 * 3. buildAdjMatrix   - same idea, but a 2-D matrix (dense graphs / Floyd-Warshall)
 * 4. DIRS             - the 4 grid directions (up, down, left, right)
 *
 * Problems in the sub-folders import these with:  require('../../graph')
 */

// ---------- 4. Grid directions ----------
// A grid is an "implicit graph": cell (r, c) is a node, its 4 neighbours are its edges.
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const DIRS_8 = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];

// ---------- 2. buildAdjList ----------
/**
 * Nodes are the integers 0 .. n-1.
 * edges: [[u, v], ...]        -> adj[u] contains v          (unweighted)
 * edges: [[u, v, w], ...]     -> adj[u] contains [v, w]     (weighted)
 * directed = false  -> every edge is added in both directions.
 *
 * Time O(n + e), space O(n + e).
 */
function buildAdjList(n, edges, directed = false) {
  const adj = Array.from({ length: n }, () => []);
  for (const edge of edges) {
    const [u, v, w] = edge;
    const weighted = edge.length === 3;
    adj[u].push(weighted ? [v, w] : v);
    if (!directed) adj[v].push(weighted ? [u, w] : u);
  }
  return adj;
}

// ---------- 3. buildAdjMatrix ----------
/**
 * matrix[u][v] = weight of edge u->v, or `noEdge` (default Infinity) when there is none.
 * matrix[u][u] = 0. Time and space O(n^2) - only for small / dense graphs.
 */
function buildAdjMatrix(n, edges, directed = false, noEdge = Infinity) {
  const matrix = Array.from({ length: n }, () => new Array(n).fill(noEdge));
  for (let i = 0; i < n; i++) matrix[i][i] = 0;
  for (const [u, v, w = 1] of edges) {
    matrix[u][v] = w;
    if (!directed) matrix[v][u] = w;
  }
  return matrix;
}

// ---------- 1. Graph class ----------
// Vertices can be anything (numbers, strings, objects) because we store them in a Map.
// adjacency: Map<vertex, Array<{ to, weight }>>
class Graph {
  #adj = new Map();
  #directed;
  #weighted;

  constructor({ directed = false, weighted = false } = {}) {
    this.#directed = directed;
    this.#weighted = weighted;
  }

  get directed() { return this.#directed; }
  get weighted() { return this.#weighted; }

  addVertex(vertex) {
    if (!this.#adj.has(vertex)) this.#adj.set(vertex, []);
    return this;
  }

  addEdge(from, to, weight = 1) {
    this.addVertex(from);
    this.addVertex(to);
    this.#adj.get(from).push({ to, weight });
    // an undirected edge is just two directed edges
    if (!this.#directed) this.#adj.get(to).push({ to: from, weight });
    return this;
  }

  hasVertex(vertex) {
    return this.#adj.has(vertex);
  }

  hasEdge(from, to) {
    if (!this.#adj.has(from)) return false;
    return this.#adj.get(from).some((edge) => edge.to === to);
  }

  // plain list of neighbour vertices (weights dropped) - what most algorithms want
  neighbors(vertex) {
    if (!this.#adj.has(vertex)) return [];
    return this.#adj.get(vertex).map((edge) => edge.to);
  }

  // [{ to, weight }, ...] - for Dijkstra / Prim style algorithms
  edgesFrom(vertex) {
    return this.#adj.get(vertex) ?? [];
  }

  vertices() {
    return [...this.#adj.keys()];
  }

  vertexCount() {
    return this.#adj.size;
  }

  edgeCount() {
    let count = 0;
    for (const list of this.#adj.values()) count += list.length;
    return this.#directed ? count : count / 2;
  }

  // ----- traversals -----

  /**
   * BFS: visit level by level using a QUEUE.
   * Returns the vertices in the order they were visited.
   * Mark a node visited WHEN YOU ENQUEUE it, never when you dequeue it,
   * otherwise the same node can sit in the queue many times.
   */
  bfs(start) {
    if (!this.#adj.has(start)) return [];
    const order = [];
    const visited = new Set([start]);
    const queue = [start];
    let head = 0; // index pointer instead of shift() -> O(1) dequeue
    while (head < queue.length) {
      const current = queue[head++];
      order.push(current);
      for (const next of this.neighbors(current)) {
        if (!visited.has(next)) {
          visited.add(next);
          queue.push(next);
        }
      }
    }
    return order;
  }

  /**
   * DFS (iterative): same as BFS but with a STACK.
   * Visit order is "one neighbour, then all of its descendants, then the next neighbour".
   * We push neighbours in reverse so the first neighbour is popped first,
   * which makes the order identical to the recursive version.
   */
  dfsIterative(start) {
    if (!this.#adj.has(start)) return [];
    const order = [];
    const visited = new Set();
    const stack = [start];
    while (stack.length) {
      const current = stack.pop();
      if (visited.has(current)) continue; // a node may be pushed twice - skip the second time
      visited.add(current);
      order.push(current);
      const nbrs = this.neighbors(current);
      for (let i = nbrs.length - 1; i >= 0; i--) {
        if (!visited.has(nbrs[i])) stack.push(nbrs[i]);
      }
    }
    return order;
  }

  /**
   * DFS (recursive): the call stack IS the stack.
   * Clean and short, but can overflow around ~10k deep in Node.
   */
  dfsRecursive(start) {
    if (!this.#adj.has(start)) return [];
    const order = [];
    const visited = new Set();
    const visit = (vertex) => {
      visited.add(vertex);
      order.push(vertex);
      for (const next of this.neighbors(vertex)) {
        if (!visited.has(next)) visit(next);
      }
    };
    visit(start);
    return order;
  }

  // Is there any path from -> to? (BFS, stop early when found)
  hasPath(from, to) {
    if (!this.#adj.has(from) || !this.#adj.has(to)) return false;
    if (from === to) return true;
    const visited = new Set([from]);
    const queue = [from];
    let head = 0;
    while (head < queue.length) {
      const current = queue[head++];
      for (const next of this.neighbors(current)) {
        if (next === to) return true;
        if (!visited.has(next)) {
          visited.add(next);
          queue.push(next);
        }
      }
    }
    return false;
  }

  /**
   * Connected components (undirected graphs).
   * Start a traversal from every unvisited vertex; each start = one new component.
   * Returns an array of arrays of vertices.
   */
  connectedComponents() {
    const visited = new Set();
    const components = [];
    for (const vertex of this.#adj.keys()) {
      if (visited.has(vertex)) continue;
      const component = [];
      const stack = [vertex];
      visited.add(vertex);
      while (stack.length) {
        const current = stack.pop();
        component.push(current);
        for (const next of this.neighbors(current)) {
          if (!visited.has(next)) {
            visited.add(next);
            stack.push(next);
          }
        }
      }
      components.push(component);
    }
    return components;
  }

  toString() {
    const lines = [];
    for (const [vertex, list] of this.#adj) {
      const edges = list.map((e) => (this.#weighted ? `${e.to}(${e.weight})` : `${e.to}`));
      lines.push(`${vertex} -> ${edges.join(', ')}`);
    }
    return lines.join('\n');
  }
}

// ---------- self-test ----------
// (runs only when this file is executed directly, not when required by a problem)
if (require.main === module) {
const assert = require('assert');

// undirected graph:   0 - 1 - 2      3 - 4      5
//                     |   |
//                     +---+ (triangle 0-1-2 plus edge 0-2)
const g = new Graph();
g.addEdge(0, 1).addEdge(1, 2).addEdge(0, 2).addEdge(3, 4).addVertex(5);
assert.strictEqual(g.vertexCount(), 6);
assert.strictEqual(g.edgeCount(), 4);
assert.deepStrictEqual(g.neighbors(0), [1, 2]);
assert.strictEqual(g.hasEdge(2, 0), true);     // undirected -> both ways
assert.strictEqual(g.hasEdge(0, 3), false);
assert.deepStrictEqual(g.bfs(0), [0, 1, 2]);
assert.deepStrictEqual(g.dfsRecursive(0), [0, 1, 2]);
assert.deepStrictEqual(g.dfsIterative(0), [0, 1, 2]);
assert.strictEqual(g.hasPath(0, 2), true);
assert.strictEqual(g.hasPath(0, 4), false);
assert.strictEqual(g.hasPath(5, 5), true);
assert.deepStrictEqual(g.connectedComponents(), [[0, 2, 1], [3, 4], [5]]);

// directed graph:  a -> b -> c,  a -> d
const dg = new Graph({ directed: true });
dg.addEdge('a', 'b').addEdge('b', 'c').addEdge('a', 'd');
assert.strictEqual(dg.edgeCount(), 3);
assert.strictEqual(dg.hasEdge('b', 'a'), false); // directed -> one way only
assert.deepStrictEqual(dg.bfs('a'), ['a', 'b', 'd', 'c']);
assert.deepStrictEqual(dg.dfsRecursive('a'), ['a', 'b', 'c', 'd']);
assert.deepStrictEqual(dg.dfsIterative('a'), ['a', 'b', 'c', 'd']);
assert.strictEqual(dg.hasPath('c', 'a'), false);
assert.deepStrictEqual(dg.bfs('zzz'), []);

// weighted graph
const wg = new Graph({ weighted: true });
wg.addEdge(0, 1, 7);
assert.deepStrictEqual(wg.edgesFrom(0), [{ to: 1, weight: 7 }]);
assert.strictEqual(wg.toString(), '0 -> 1(7)\n1 -> 0(7)');

// helpers
assert.deepStrictEqual(buildAdjList(3, [[0, 1], [1, 2]]), [[1], [0, 2], [1]]);
assert.deepStrictEqual(buildAdjList(3, [[0, 1], [1, 2]], true), [[1], [2], []]);
assert.deepStrictEqual(buildAdjList(2, [[0, 1, 5]], true), [[[1, 5]], []]);
assert.deepStrictEqual(buildAdjMatrix(2, [[0, 1, 5]]), [[0, 5], [5, 0]]);
assert.deepStrictEqual(buildAdjMatrix(2, [[0, 1, 5]], true), [[0, 5], [Infinity, 0]]);
assert.strictEqual(DIRS.length, 4);
assert.strictEqual(DIRS_8.length, 8);

console.log('✓ graph.js self-test passed');
}

module.exports = { Graph, buildAdjList, buildAdjMatrix, DIRS, DIRS_8 };

/**
 * Shortest-path algorithms in JavaScript.
 *
 * 0. MinHeap        - a tiny binary min-heap (priority queue). JavaScript has no built-in
 *                     priority queue, so every Dijkstra / Prim solution needs one.
 * 1. bfsShortest    - unweighted graphs: BFS gives shortest number of edges
 * 2. dijkstra       - non-negative weights, single source, O((V + E) log V)
 * 3. bellmanFord    - any weights, detects negative cycles, O(V * E)
 * 4. floydWarshall  - all pairs, O(V^3), tiny code
 * 5. zeroOneBfs     - weights only 0 or 1, deque trick, O(V + E)
 *
 * Adjacency lists here are WEIGHTED: adj[u] = [[v, w], ...]  (see buildAdjList in graph.js)
 */

const { buildAdjList } = require('../../../23_Graphs/02_Implementations/graph');

// ---------- 0. MinHeap ----------
// Stores [priority, ...payload] arrays; the smallest priority is at index 0.
// Why we need it: Dijkstra repeatedly asks "which unvisited node is closest?". A plain
// array makes that O(V) per query; a heap makes it O(log V).
class MinHeap {
  #data = [];

  size() { return this.#data.length; }
  isEmpty() { return this.#data.length === 0; }
  peek() { return this.#data[0]; }

  push(item) {
    this.#data.push(item);
    this.#siftUp(this.#data.length - 1);
  }

  pop() {
    const data = this.#data;
    if (data.length === 0) return undefined;
    const top = data[0];
    const last = data.pop();
    if (data.length > 0) {
      data[0] = last;            // move the last leaf to the root, then sink it
      this.#siftDown(0);
    }
    return top;
  }

  #siftUp(i) {
    const data = this.#data;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (data[parent][0] <= data[i][0]) break;
      [data[parent], data[i]] = [data[i], data[parent]];
      i = parent;
    }
  }

  #siftDown(i) {
    const data = this.#data;
    const n = data.length;
    while (true) {
      const left = 2 * i + 1;
      const right = left + 1;
      let smallest = i;
      if (left < n && data[left][0] < data[smallest][0]) smallest = left;
      if (right < n && data[right][0] < data[smallest][0]) smallest = right;
      if (smallest === i) break;
      [data[smallest], data[i]] = [data[i], data[smallest]];
      i = smallest;
    }
  }
}

// ---------- 1. BFS (unweighted) ----------
function bfsShortest(n, edges, source, directed = false) {
  const adj = buildAdjList(n, edges, directed);
  const dist = new Array(n).fill(Infinity);
  dist[source] = 0;
  const queue = [source];
  let head = 0;
  while (head < queue.length) {
    const u = queue[head++];
    for (const v of adj[u]) {
      if (dist[v] === Infinity) {
        dist[v] = dist[u] + 1;
        queue.push(v);
      }
    }
  }
  return dist;
}

// ---------- 2. Dijkstra ----------
// "Greedy BFS with a heap": always expand the closest unfinished node. With non-negative
// weights, once a node is popped its distance is final (nothing later can be shorter).
// Lazy deletion: we may push the same node several times; skip stale entries on pop.
function dijkstra(n, edges, source, directed = false) {
  const adj = buildAdjList(n, edges, directed);          // weighted edges [u, v, w]
  const dist = new Array(n).fill(Infinity);
  dist[source] = 0;
  const heap = new MinHeap();
  heap.push([0, source]);                                 // [distance, node]
  while (!heap.isEmpty()) {
    const [d, u] = heap.pop();
    if (d > dist[u]) continue;                            // stale entry, already improved
    for (const [v, w] of adj[u]) {
      const candidate = d + w;
      if (candidate < dist[v]) {                          // "relax" the edge
        dist[v] = candidate;
        heap.push([candidate, v]);
      }
    }
  }
  return dist;
}

// Same, but also returns the path source -> target (or [] if unreachable).
function dijkstraWithPath(n, edges, source, target, directed = false) {
  const adj = buildAdjList(n, edges, directed);
  const dist = new Array(n).fill(Infinity);
  const prev = new Array(n).fill(-1);
  dist[source] = 0;
  const heap = new MinHeap();
  heap.push([0, source]);
  while (!heap.isEmpty()) {
    const [d, u] = heap.pop();
    if (d > dist[u]) continue;
    if (u === target) break;                              // early exit: target is final
    for (const [v, w] of adj[u]) {
      if (d + w < dist[v]) {
        dist[v] = d + w;
        prev[v] = u;
        heap.push([dist[v], v]);
      }
    }
  }
  if (dist[target] === Infinity) return { distance: Infinity, path: [] };
  const path = [];
  for (let at = target; at !== -1; at = prev[at]) path.push(at);
  return { distance: dist[target], path: path.reverse() };
}

// ---------- 3. Bellman-Ford ----------
// Relax EVERY edge, V - 1 times. A shortest path has at most V - 1 edges, and each full
// round fixes at least one more edge of every shortest path. If a V-th round still
// improves something, a negative cycle is reachable.
function bellmanFord(n, edges, source) {
  const dist = new Array(n).fill(Infinity);
  dist[source] = 0;
  for (let round = 0; round < n - 1; round++) {
    let changed = false;
    for (const [u, v, w] of edges) {
      if (dist[u] !== Infinity && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        changed = true;
      }
    }
    if (!changed) break;                                  // early exit: already converged
  }
  let hasNegativeCycle = false;
  for (const [u, v, w] of edges) {
    if (dist[u] !== Infinity && dist[u] + w < dist[v]) hasNegativeCycle = true;
  }
  return { dist, hasNegativeCycle };
}

// ---------- 4. Floyd-Warshall ----------
// dist[i][j] = shortest i -> j. For each intermediate node k, ask: is i -> k -> j better
// than what we have? Three loops, k MUST be the outer one.
function floydWarshall(n, edges, directed = false) {
  const dist = Array.from({ length: n }, () => new Array(n).fill(Infinity));
  for (let i = 0; i < n; i++) dist[i][i] = 0;
  for (const [u, v, w] of edges) {
    dist[u][v] = Math.min(dist[u][v], w);
    if (!directed) dist[v][u] = Math.min(dist[v][u], w);
  }
  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      if (dist[i][k] === Infinity) continue;              // small speed-up
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) dist[i][j] = dist[i][k] + dist[k][j];
      }
    }
  }
  return dist;                                            // dist[i][i] < 0 => negative cycle
}

// ---------- 5. 0-1 BFS ----------
// Weights are only 0 or 1. Use a deque: a 0-weight edge keeps us on the same "level",
// so push to the FRONT; a 1-weight edge goes to the BACK. No heap needed: O(V + E).
// We simulate a deque with two stacks-as-arrays: `front` (reversed) and `back`.
function zeroOneBfs(n, edges, source, directed = false) {
  const adj = buildAdjList(n, edges, directed);
  const dist = new Array(n).fill(Infinity);
  dist[source] = 0;
  const deque = new Deque();
  deque.pushFront(source);
  while (deque.size() > 0) {
    const u = deque.popFront();
    for (const [v, w] of adj[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
        if (w === 0) deque.pushFront(v);
        else deque.pushBack(v);
      }
    }
  }
  return dist;
}

// Minimal deque (double-ended queue) with O(1) ops at both ends, using a Map-free
// "two-stack" layout: head index can go negative into a sparse object.
class Deque {
  #items = {};
  #head = 0;
  #tail = 0;                 // one past the last element

  size() { return this.#tail - this.#head; }
  pushBack(x) { this.#items[this.#tail++] = x; }
  pushFront(x) { this.#items[--this.#head] = x; }
  popFront() {
    const x = this.#items[this.#head];
    delete this.#items[this.#head++];
    return x;
  }
  popBack() {
    const x = this.#items[--this.#tail];
    delete this.#items[this.#tail];
    return x;
  }
  peekFront() { return this.#items[this.#head]; }
  peekBack() { return this.#items[this.#tail - 1]; }
}

// ---------- self-test ----------
// (runs only when this file is executed directly, not when required by a problem)
if (require.main === module) {
const assert = require('assert');

// MinHeap
const heap = new MinHeap();
for (const p of [5, 3, 8, 1, 9, 2]) heap.push([p, `item${p}`]);
const popped = [];
while (!heap.isEmpty()) popped.push(heap.pop()[0]);
assert.deepStrictEqual(popped, [1, 2, 3, 5, 8, 9]);
assert.strictEqual(new MinHeap().pop(), undefined);

// Deque
const dq = new Deque();
dq.pushBack(1); dq.pushBack(2); dq.pushFront(0);
assert.strictEqual(dq.popFront(), 0);
assert.strictEqual(dq.popBack(), 2);
assert.strictEqual(dq.popFront(), 1);
assert.strictEqual(dq.size(), 0);

// Weighted undirected graph:
//   0 --4-- 1 --1-- 2
//   |       |
//   1       2
//   |       |
//   3 --5-- 4
const wEdges = [[0, 1, 4], [1, 2, 1], [0, 3, 1], [1, 4, 2], [3, 4, 5]];
assert.deepStrictEqual(dijkstra(5, wEdges, 0), [0, 4, 5, 1, 6]);
assert.deepStrictEqual(dijkstraWithPath(5, wEdges, 0, 2), { distance: 5, path: [0, 1, 2] });
assert.deepStrictEqual(dijkstraWithPath(6, wEdges, 0, 5), { distance: Infinity, path: [] });

// unweighted BFS on the same shape (edge count, not weight)
assert.deepStrictEqual(bfsShortest(5, wEdges.map(([u, v]) => [u, v]), 0), [0, 1, 2, 1, 2]);

// Bellman-Ford with a negative edge (directed): 0->1 (4), 0->2 (5), 2->1 (-3)
const negEdges = [[0, 1, 4], [0, 2, 5], [2, 1, -3]];
assert.deepStrictEqual(bellmanFord(3, negEdges, 0), { dist: [0, 2, 5], hasNegativeCycle: false });
// Dijkstra gets this WRONG (pops 1 at 4 before seeing the -3 path)... unless lazy
// re-push happens to fix it; the point is it is not guaranteed. We only assert BF here.
const negCycle = [[0, 1, 1], [1, 2, -1], [2, 0, -1]];
assert.strictEqual(bellmanFord(3, negCycle, 0).hasNegativeCycle, true);
assert.deepStrictEqual(bellmanFord(3, [[0, 1, 2]], 0).dist, [0, 2, Infinity]);

// Floyd-Warshall
const fw = floydWarshall(4, [[0, 1, 3], [1, 2, 1], [0, 2, 7], [2, 3, 2]], true);
assert.deepStrictEqual(fw[0], [0, 3, 4, 6]);
assert.strictEqual(fw[3][0], Infinity);
assert.deepStrictEqual(floydWarshall(2, [[0, 1, 5]])[1], [5, 0]);

// 0-1 BFS: 0 -0- 1 -1- 2 -0- 3, and 0 -1- 3 directly
const zeroOne = [[0, 1, 0], [1, 2, 1], [2, 3, 0], [0, 3, 1]];
assert.deepStrictEqual(zeroOneBfs(4, zeroOne, 0), [0, 0, 1, 1]);
assert.deepStrictEqual(zeroOneBfs(4, zeroOne, 0), dijkstra(4, zeroOne, 0));

console.log('✓ shortest-paths.js self-test passed');
}

module.exports = { MinHeap, Deque, bfsShortest, dijkstra, dijkstraWithPath, bellmanFord, floydWarshall, zeroOneBfs };

/**
 * Maximum flow in JavaScript.
 *
 * 1. EdmondsKarp     - Ford-Fulkerson where every augmenting path is a SHORTEST path (BFS).
 *                      O(V * E^2). Easiest correct version to write in an interview.
 * 2. Dinic           - BFS builds a level graph, DFS pushes a blocking flow along it.
 *                      O(V^2 * E) in general, O(E * sqrt(V)) on unit-capacity bipartite graphs.
 * 3. MinCostMaxFlow  - (brief) successive shortest paths with Bellman-Ford on costs.
 * 4. bruteForceMinCut - tries every s/t partition (tiny graphs only) -> used to CHECK the above.
 *
 * Shared representation (the "edge list with paired reverse edges" trick):
 *   every edge is stored at index e, its reverse edge at index e ^ 1.
 *   Pushing f units along e means: cap[e] -= f, cap[e ^ 1] += f.
 *   Why? The reverse edge is how the algorithm "changes its mind" later
 *   (undoes flow it sent earlier). That remaining capacity graph is the RESIDUAL GRAPH.
 */

class FlowNetwork {
  constructor(n) {
    if (!Number.isInteger(n) || n <= 0) throw new Error('n must be a positive integer');
    this.n = n;
    this.head = new Array(n).fill(-1); // head[u] = index of the first edge out of u
    this.to = [];
    this.cap = [];     // REMAINING (residual) capacity
    this.next = [];    // next edge out of the same node (linked list in arrays)
    this.original = []; // original capacity, to report flow per edge
  }

  // Adds a directed edge u -> v with capacity c. Returns the edge index (useful to read its flow).
  addEdge(u, v, c) {
    if (u < 0 || u >= this.n || v < 0 || v >= this.n) throw new Error('node out of range');
    if (c < 0) throw new Error('capacity must be >= 0');
    const e = this.to.length;
    this.#push(u, v, c);
    this.#push(v, u, 0); // reverse edge starts with 0 residual capacity
    return e;
  }

  #push(u, v, c) {
    this.to.push(v);
    this.cap.push(c);
    this.original.push(c);
    this.next.push(this.head[u]);
    this.head[u] = this.to.length - 1;
  }

  // flow currently sent along the forward edge e
  flowOn(e) {
    return this.original[e] - this.cap[e];
  }

  // After max flow: nodes reachable from s in the residual graph form the S side of a MIN CUT.
  minCut(s) {
    const seen = new Array(this.n).fill(false);
    seen[s] = true;
    const queue = [s];
    for (let h = 0; h < queue.length; h++) {
      const u = queue[h];
      for (let e = this.head[u]; e !== -1; e = this.next[e]) {
        if (this.cap[e] > 0 && !seen[this.to[e]]) {
          seen[this.to[e]] = true;
          queue.push(this.to[e]);
        }
      }
    }
    // cut edges = ORIGINAL forward edges going from S side to T side
    const cutEdges = [];
    for (let e = 0; e < this.to.length; e += 2) {
      const u = this.to[e ^ 1];
      const v = this.to[e];
      if (seen[u] && !seen[v] && this.original[e] > 0) cutEdges.push([u, v, this.original[e]]);
    }
    return { sSide: seen, cutEdges };
  }
}

// ---------- 1. Edmonds-Karp ----------
class EdmondsKarp extends FlowNetwork {
  maxFlow(s, t) {
    if (s === t) throw new Error('source and sink must differ');
    let flow = 0;
    const parentEdge = new Array(this.n);
    while (true) {
      // BFS finds the SHORTEST augmenting path (fewest edges). That choice is what
      // bounds the number of rounds by O(V * E), unlike plain DFS Ford-Fulkerson.
      parentEdge.fill(-1);
      const visited = new Array(this.n).fill(false);
      visited[s] = true;
      const queue = [s];
      for (let h = 0; h < queue.length && !visited[t]; h++) {
        const u = queue[h];
        for (let e = this.head[u]; e !== -1; e = this.next[e]) {
          const v = this.to[e];
          if (!visited[v] && this.cap[e] > 0) {
            visited[v] = true;
            parentEdge[v] = e;
            queue.push(v);
          }
        }
      }
      if (!visited[t]) return flow; // no augmenting path left -> flow is maximum

      // bottleneck = smallest residual capacity on the path
      let push = Infinity;
      for (let v = t; v !== s; v = this.to[parentEdge[v] ^ 1]) push = Math.min(push, this.cap[parentEdge[v]]);
      for (let v = t; v !== s; v = this.to[parentEdge[v] ^ 1]) {
        this.cap[parentEdge[v]] -= push;
        this.cap[parentEdge[v] ^ 1] += push;
      }
      flow += push;
    }
  }
}

// ---------- 2. Dinic ----------
class Dinic extends FlowNetwork {
  maxFlow(s, t) {
    if (s === t) throw new Error('source and sink must differ');
    let flow = 0;
    const level = new Array(this.n);
    const it = new Array(this.n); // "current edge" pointer: never retry a dead edge in this phase

    const bfs = () => {
      level.fill(-1);
      level[s] = 0;
      const queue = [s];
      for (let h = 0; h < queue.length; h++) {
        const u = queue[h];
        for (let e = this.head[u]; e !== -1; e = this.next[e]) {
          if (this.cap[e] > 0 && level[this.to[e]] === -1) {
            level[this.to[e]] = level[u] + 1;
            queue.push(this.to[e]);
          }
        }
      }
      return level[t] !== -1;
    };

    // Iterative DFS that pushes ONE path at a time along edges with level[v] = level[u] + 1.
    // Iterative so a long path never overflows the JS call stack.
    const augment = () => {
      const pathEdges = [];
      let u = s;
      while (true) {
        if (u === t) {
          let push = Infinity;
          for (const e of pathEdges) push = Math.min(push, this.cap[e]);
          for (const e of pathEdges) {
            this.cap[e] -= push;
            this.cap[e ^ 1] += push;
          }
          return push;
        }
        let advanced = false;
        for (; it[u] !== -1; it[u] = this.next[it[u]]) {
          const e = it[u];
          const v = this.to[e];
          if (this.cap[e] > 0 && level[v] === level[u] + 1) {
            pathEdges.push(e);
            u = v;
            advanced = true;
            break;
          }
        }
        if (!advanced) {
          // dead end: u can't reach t in this level graph. Remove it and retreat.
          level[u] = -1;
          if (pathEdges.length === 0) return 0;
          const e = pathEdges.pop();
          u = this.to[e ^ 1];
          it[u] = this.next[it[u]]; // edge e led to a dead end, skip it from now on
        }
      }
    };

    while (bfs()) {
      for (let v = 0; v < this.n; v++) it[v] = this.head[v];
      let pushed;
      while ((pushed = augment()) > 0) flow += pushed; // blocking flow for this level graph
    }
    return flow;
  }
}

// ---------- 3. Min-cost max-flow (brief) ----------
// Repeatedly send flow along the CHEAPEST s->t path in the residual graph.
// Reverse edges carry cost -c (undoing flow refunds its cost), so we need Bellman-Ford
// (negative edges) — fine for interview-sized graphs. O(F * V * E).
class MinCostMaxFlow {
  constructor(n) {
    this.n = n;
    this.edges = []; // {to, cap, cost}; reverse at index ^ 1
    this.adj = Array.from({ length: n }, () => []);
  }

  addEdge(u, v, cap, cost) {
    this.adj[u].push(this.edges.length);
    this.edges.push({ to: v, cap, cost });
    this.adj[v].push(this.edges.length);
    this.edges.push({ to: u, cap: 0, cost: -cost });
  }

  run(s, t, maxFlowLimit = Infinity) {
    let flow = 0;
    let cost = 0;
    while (flow < maxFlowLimit) {
      const dist = new Array(this.n).fill(Infinity);
      const inEdge = new Array(this.n).fill(-1);
      dist[s] = 0;
      for (let round = 0; round < this.n - 1; round++) {
        let changed = false;
        for (let u = 0; u < this.n; u++) {
          if (dist[u] === Infinity) continue;
          for (const e of this.adj[u]) {
            const { to, cap, cost: c } = this.edges[e];
            if (cap > 0 && dist[u] + c < dist[to]) {
              dist[to] = dist[u] + c;
              inEdge[to] = e;
              changed = true;
            }
          }
        }
        if (!changed) break;
      }
      if (dist[t] === Infinity) break;
      let push = maxFlowLimit - flow;
      for (let v = t; v !== s; v = this.edges[inEdge[v] ^ 1].to) push = Math.min(push, this.edges[inEdge[v]].cap);
      for (let v = t; v !== s; v = this.edges[inEdge[v] ^ 1].to) {
        this.edges[inEdge[v]].cap -= push;
        this.edges[inEdge[v] ^ 1].cap += push;
      }
      flow += push;
      cost += push * dist[t];
    }
    return { flow, cost };
  }
}

// ---------- 4. Brute-force min cut (reference for tests) ----------
// Max-flow min-cut theorem: max flow value = minimum, over all partitions (S, T) with
// s in S and t in T, of the total capacity of edges S -> T. Exponential: n <= ~12 only.
function bruteForceMinCut(n, edges, s, t) {
  let best = Infinity;
  for (let mask = 0; mask < 1 << n; mask++) {
    if (!(mask >> s & 1) || (mask >> t & 1)) continue;
    let cut = 0;
    for (const [u, v, c] of edges) if ((mask >> u & 1) && !(mask >> v & 1)) cut += c;
    best = Math.min(best, cut);
  }
  return best;
}

// Convenience: build + solve in one call. edges = [[u, v, cap], ...]
function maxFlow(n, edges, s, t, Algo = Dinic) {
  const g = new Algo(n);
  for (const [u, v, c] of edges) g.addEdge(u, v, c);
  return g.maxFlow(s, t);
}

// Seeded PRNG so random tests are reproducible.
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let x = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- self-test ----------
if (require.main === module) {
  const assert = require('assert');

  // CLRS classic network, max flow = 23
  const clrs = [[0, 1, 16], [0, 2, 13], [1, 2, 10], [2, 1, 4], [1, 3, 12], [3, 2, 9],
    [2, 4, 14], [4, 3, 7], [3, 5, 20], [4, 5, 4]];
  assert.strictEqual(maxFlow(6, clrs, 0, 5, EdmondsKarp), 23);
  assert.strictEqual(maxFlow(6, clrs, 0, 5, Dinic), 23);
  assert.strictEqual(bruteForceMinCut(6, clrs, 0, 5), 23);

  // min cut edges sum to the flow
  const g = new Dinic(6);
  for (const [u, v, c] of clrs) g.addEdge(u, v, c);
  const f = g.maxFlow(0, 5);
  const { cutEdges } = g.minCut(0);
  assert.strictEqual(cutEdges.reduce((a, [, , c]) => a + c, 0), f);

  // disconnected sink -> 0
  assert.strictEqual(maxFlow(3, [[0, 1, 5]], 0, 2), 0);

  // random cross-check: EK == Dinic == brute-force min cut
  const rnd = mulberry32(42);
  for (let trial = 0; trial < 300; trial++) {
    const n = 2 + Math.floor(rnd() * 7);
    const m = Math.floor(rnd() * 16);
    const edges = [];
    for (let i = 0; i < m; i++) {
      edges.push([Math.floor(rnd() * n), Math.floor(rnd() * n), Math.floor(rnd() * 10)]);
    }
    const ek = maxFlow(n, edges, 0, n - 1, EdmondsKarp);
    const di = maxFlow(n, edges, 0, n - 1, Dinic);
    const bf = bruteForceMinCut(n, edges, 0, n - 1);
    assert.strictEqual(ek, bf, `EK mismatch on ${JSON.stringify(edges)}`);
    assert.strictEqual(di, bf, `Dinic mismatch on ${JSON.stringify(edges)}`);
  }

  // min-cost flow: assignment problem vs all permutations
  for (let trial = 0; trial < 50; trial++) {
    const k = 1 + Math.floor(rnd() * 5);
    const cost = Array.from({ length: k }, () => Array.from({ length: k }, () => Math.floor(rnd() * 20)));
    const mcmf = new MinCostMaxFlow(2 * k + 2);
    const S = 2 * k, T = 2 * k + 1;
    for (let i = 0; i < k; i++) {
      mcmf.addEdge(S, i, 1, 0);
      mcmf.addEdge(k + i, T, 1, 0);
      for (let j = 0; j < k; j++) mcmf.addEdge(i, k + j, 1, cost[i][j]);
    }
    const res = mcmf.run(S, T);
    let best = Infinity;
    const used = new Array(k).fill(false);
    (function perm(i, acc) {
      if (i === k) { best = Math.min(best, acc); return; }
      for (let j = 0; j < k; j++) if (!used[j]) { used[j] = true; perm(i + 1, acc + cost[i][j]); used[j] = false; }
    })(0, 0);
    assert.strictEqual(res.flow, k);
    assert.strictEqual(res.cost, best);
  }

  console.log('✓ max_flow.js self-test passed');
}

module.exports = { FlowNetwork, EdmondsKarp, Dinic, MinCostMaxFlow, bruteForceMinCut, maxFlow, mulberry32 };

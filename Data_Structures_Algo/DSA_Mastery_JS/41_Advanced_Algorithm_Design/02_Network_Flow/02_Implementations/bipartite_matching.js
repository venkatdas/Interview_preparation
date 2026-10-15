/**
 * Maximum bipartite matching in JavaScript.
 *
 * Setting: nLeft left nodes (0..nLeft-1), nRight right nodes (0..nRight-1),
 * adj[l] = list of right nodes that left node l may be paired with.
 * A MATCHING picks edges so no node is used twice. We want as many edges as possible.
 *
 * 1. kuhn            - try to find an augmenting path from each left node with DFS.  O(V * E)
 * 2. hopcroftKarp    - BFS layers, then many vertex-disjoint shortest augmenting
 *                      paths per phase.  O(E * sqrt(V))
 * 3. matchingViaFlow - source -> left (cap 1), left -> right (cap 1), right -> sink (cap 1),
 *                      then max flow (Dinic). Shows matching IS a flow problem.
 * 4. bruteForceMatching - tries every subset choice, tiny inputs only (reference for tests).
 *
 * All return { size, matchLeft } where matchLeft[l] = matched right node or -1.
 */
const { Dinic, mulberry32 } = require('./max_flow');

function validate(nLeft, nRight, adj) {
  if (!Array.isArray(adj) || adj.length !== nLeft) throw new Error('adj must have nLeft lists');
  for (const list of adj) for (const r of list) {
    if (r < 0 || r >= nRight) throw new Error('right node out of range');
  }
}

// ---------- 1. Kuhn's algorithm ----------
// For each left node u, DFS: "can u get SOME right node v?" Either v is free, or v's
// current partner can be moved to another right node (recursive question).
// That chain free-left -> ... -> free-right is an AUGMENTING PATH; flipping it adds 1.
function kuhn(nLeft, nRight, adj) {
  validate(nLeft, nRight, adj);
  const matchRight = new Array(nRight).fill(-1);
  let visitedStamp = new Array(nRight).fill(-1);

  function tryKuhn(u, stamp) {
    for (const v of adj[u]) {
      if (visitedStamp[v] === stamp) continue; // already tried v in this search
      visitedStamp[v] = stamp;
      if (matchRight[v] === -1 || tryKuhn(matchRight[v], stamp)) {
        matchRight[v] = u;
        return true;
      }
    }
    return false;
  }

  let size = 0;
  for (let u = 0; u < nLeft; u++) if (tryKuhn(u, u)) size++;
  const matchLeft = new Array(nLeft).fill(-1);
  for (let v = 0; v < nRight; v++) if (matchRight[v] !== -1) matchLeft[matchRight[v]] = v;
  return { size, matchLeft };
}

// ---------- 2. Hopcroft-Karp ----------
// Phase = BFS from ALL free left nodes at once to compute distances (layers), then DFS
// from each free left node using only edges that go one layer deeper. This finds a
// maximal set of disjoint SHORTEST augmenting paths in one phase. Only O(sqrt V) phases.
function hopcroftKarp(nLeft, nRight, adj) {
  validate(nLeft, nRight, adj);
  const matchLeft = new Array(nLeft).fill(-1);
  const matchRight = new Array(nRight).fill(-1);
  const dist = new Array(nLeft);
  const INF = Infinity;

  function bfs() {
    const queue = [];
    for (let u = 0; u < nLeft; u++) {
      if (matchLeft[u] === -1) { dist[u] = 0; queue.push(u); } else dist[u] = INF;
    }
    let foundFree = false;
    for (let h = 0; h < queue.length; h++) {
      const u = queue[h];
      for (const v of adj[u]) {
        const w = matchRight[v];
        if (w === -1) foundFree = true;            // a free right node ends a shortest path
        else if (dist[w] === INF) { dist[w] = dist[u] + 1; queue.push(w); }
      }
    }
    return foundFree;
  }

  function dfs(u) {
    for (const v of adj[u]) {
      const w = matchRight[v];
      if (w === -1 || (dist[w] === dist[u] + 1 && dfs(w))) {
        matchLeft[u] = v;
        matchRight[v] = u;
        return true;
      }
    }
    dist[u] = INF; // dead end: don't visit u again this phase
    return false;
  }

  let size = 0;
  while (bfs()) {
    for (let u = 0; u < nLeft; u++) if (matchLeft[u] === -1 && dfs(u)) size++;
  }
  return { size, matchLeft };
}

// ---------- 3. Matching via max flow ----------
function matchingViaFlow(nLeft, nRight, adj) {
  validate(nLeft, nRight, adj);
  const S = nLeft + nRight;
  const T = S + 1;
  const g = new Dinic(nLeft + nRight + 2);
  for (let u = 0; u < nLeft; u++) g.addEdge(S, u, 1);
  for (let v = 0; v < nRight; v++) g.addEdge(nLeft + v, T, 1);
  const middle = [];
  for (let u = 0; u < nLeft; u++) for (const v of adj[u]) middle.push([u, v, g.addEdge(u, nLeft + v, 1)]);
  const size = g.maxFlow(S, T);
  const matchLeft = new Array(nLeft).fill(-1);
  for (const [u, v, e] of middle) if (g.flowOn(e) === 1) matchLeft[u] = v;
  return { size, matchLeft };
}

// ---------- 4. Brute force ----------
function bruteForceMatching(nLeft, nRight, adj) {
  const usedRight = new Array(nRight).fill(false);
  function go(u) {
    if (u === nLeft) return 0;
    let best = go(u + 1); // leave u unmatched
    for (const v of adj[u]) {
      if (usedRight[v]) continue;
      usedRight[v] = true;
      best = Math.max(best, 1 + go(u + 1));
      usedRight[v] = false;
    }
    return best;
  }
  return go(0);
}

// Checks that matchLeft is a real matching that uses only allowed edges.
function isValidMatching(nRight, adj, matchLeft) {
  const used = new Set();
  for (let u = 0; u < matchLeft.length; u++) {
    const v = matchLeft[u];
    if (v === -1) continue;
    if (!adj[u].includes(v) || used.has(v)) return false;
    used.add(v);
  }
  return true;
}

function randomBipartite(rnd, maxSide = 6) {
  const nLeft = 1 + Math.floor(rnd() * maxSide);
  const nRight = 1 + Math.floor(rnd() * maxSide);
  const adj = Array.from({ length: nLeft }, () => {
    const list = [];
    for (let v = 0; v < nRight; v++) if (rnd() < 0.35) list.push(v);
    return list;
  });
  return { nLeft, nRight, adj };
}

// ---------- self-test ----------
if (require.main === module) {
  const assert = require('assert');

  // 3 applicants, 3 jobs: 0:{0,1} 1:{0} 2:{1,2} -> perfect matching of size 3
  const adj = [[0, 1], [0], [1, 2]];
  for (const algo of [kuhn, hopcroftKarp, matchingViaFlow]) {
    const res = algo(3, 3, adj);
    assert.strictEqual(res.size, 3);
    assert.ok(isValidMatching(3, adj, res.matchLeft));
  }
  // nobody can work -> 0
  assert.strictEqual(hopcroftKarp(2, 2, [[], []]).size, 0);
  // everyone wants the same job -> 1
  assert.strictEqual(kuhn(3, 1, [[0], [0], [0]]).size, 1);

  const rnd = mulberry32(7);
  for (let trial = 0; trial < 400; trial++) {
    const { nLeft, nRight, adj: a } = randomBipartite(rnd);
    const expected = bruteForceMatching(nLeft, nRight, a);
    for (const algo of [kuhn, hopcroftKarp, matchingViaFlow]) {
      const res = algo(nLeft, nRight, a);
      assert.strictEqual(res.size, expected, `${algo.name} on ${JSON.stringify(a)}`);
      assert.ok(isValidMatching(nRight, a, res.matchLeft));
      assert.strictEqual(res.matchLeft.filter(x => x !== -1).length, expected);
    }
  }
  console.log('✓ bipartite_matching.js self-test passed');
}

module.exports = { kuhn, hopcroftKarp, matchingViaFlow, bruteForceMatching, isValidMatching, randomBipartite };

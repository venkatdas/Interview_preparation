/**
 * Advanced tree techniques (Advanced level).
 *
 * Every tree here is UNROOTED input: n nodes labelled 0..n-1 and n-1 edges [u, v].
 * When a technique needs a root we pick one (default 0).
 *
 *  1. buildAdjacency        - edge list -> adjacency lists (validates the input)
 *  2. treeDiameter          - two BFS passes, O(n)
 *  3. treeCenters           - 1 or 2 middle nodes of the diameter (Minimum Height Trees)
 *  4. eulerTour             - tin / tout so every subtree is ONE contiguous range
 *  5. SubtreeSumQuery       - Euler tour + Fenwick tree: point update, subtree sum, O(log n)
 *  6. sumOfDistances        - rerooting DP: answer for EVERY root in O(n)
 *  7. centroidDecomposition - centroid tree, depth O(log n)
 *     countPairsWithinDistance - classic centroid application, O(n log^2 n)
 *  8. HeavyLightDecomposition - path sum + point update in O(log^2 n)
 *  9. rootedCanonicalId / areIsomorphic - tree isomorphism with canonical ids (AHU idea)
 *
 * Binary lifting (k-th ancestor, LCA) lives in ../../01_Classic_Techniques; we re-export it
 * instead of copying it, so there is one source of truth.
 *
 * All traversals are ITERATIVE: a path-shaped tree with 10^5 nodes would overflow the
 * JavaScript call stack with recursion.
 */

const { binaryLiftingLCA } = require('../../01_Classic_Techniques/02_Implementations/classic_techniques');

// ---------- 1. Adjacency ----------
function buildAdjacency(n, edges) {
  if (!Number.isInteger(n) || n < 1) throw new Error('n must be a positive integer');
  if (edges.length !== n - 1) throw new Error('a tree with n nodes has exactly n - 1 edges');
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    if (u < 0 || v < 0 || u >= n || v >= n) throw new Error(`edge [${u}, ${v}] out of range`);
    adj[u].push(v);
    adj[v].push(u);
  }
  return adj;
}

// BFS distances from one source. Used by diameter, centers and brute forces.
function bfsDistances(adj, src) {
  const dist = new Array(adj.length).fill(-1);
  const parent = new Array(adj.length).fill(-1);
  const queue = [src];
  dist[src] = 0;
  for (let head = 0; head < queue.length; head++) {
    const u = queue[head];
    for (const v of adj[u]) {
      if (dist[v] === -1) {
        dist[v] = dist[u] + 1;
        parent[v] = u;
        queue.push(v);
      }
    }
  }
  return { dist, parent, order: queue };
}

// ---------- 2. Diameter (two BFS) ----------
// WHY it works: the node farthest from ANY start node is an endpoint of some diameter.
// So BFS from 0 -> farthest a; BFS from a -> farthest b; dist(a, b) is the diameter.
function treeDiameter(n, edges) {
  const adj = buildAdjacency(n, edges);
  const first = bfsDistances(adj, 0);
  const a = argMax(first.dist);
  const second = bfsDistances(adj, a);
  const b = argMax(second.dist);
  const path = [];
  for (let v = b; v !== -1; v = second.parent[v]) path.push(v);
  return { length: second.dist[b], endpoints: [a, b], path };
}

function argMax(arr) {
  let best = 0;
  for (let i = 1; i < arr.length; i++) if (arr[i] > arr[best]) best = i;
  return best;
}

// ---------- 3. Centers ----------
// The middle node(s) of a diameter path minimise the height. A diameter of even length
// has one middle node, odd length has two.
function treeCenters(n, edges) {
  if (n === 1) return [0];
  const { length, path } = treeDiameter(n, edges);
  const mid = Math.floor(length / 2);
  return length % 2 === 0 ? [path[mid]] : [path[mid], path[mid + 1]].sort((x, y) => x - y);
}

// ---------- 4. Euler tour ----------
// Preorder number tin[v]; tout[v] = tin[v] + size[v] - 1. The subtree of v is exactly the
// positions tin[v]..tout[v]. A stack-based preorder keeps every subtree contiguous because
// when v is popped all of its descendants are pushed above anything still waiting below.
function eulerTour(n, edges, root = 0) {
  const adj = buildAdjacency(n, edges);
  const tin = new Array(n);
  const parent = new Array(n).fill(-1);
  const order = [];
  const stack = [root];
  const seen = new Array(n).fill(false);
  seen[root] = true;
  while (stack.length) {
    const u = stack.pop();
    tin[u] = order.length;
    order.push(u);
    for (const v of adj[u]) {
      if (!seen[v]) { seen[v] = true; parent[v] = u; stack.push(v); }
    }
  }
  const size = new Array(n).fill(1);
  for (let i = n - 1; i > 0; i--) size[parent[order[i]]] += size[order[i]];
  const tout = tin.map((t, v) => t + size[v] - 1);
  return { tin, tout, order, parent, size };
}

// Tiny Fenwick tree (see 34_Range_Query_Data_Structures/02_Fenwick_Tree for the full story).
class Fenwick {
  constructor(n) { this.n = n; this.tree = new Array(n + 1).fill(0); }
  add(i, delta) { for (i++; i <= this.n; i += i & -i) this.tree[i] += delta; }
  prefix(i) { let s = 0; for (i++; i > 0; i -= i & -i) s += this.tree[i]; return s; }
  range(l, r) { return l > r ? 0 : this.prefix(r) - this.prefix(l - 1); }
}

// ---------- 5. Subtree sums with updates ----------
class SubtreeSumQuery {
  constructor(n, edges, values, root = 0) {
    if (values.length !== n) throw new Error('need one value per node');
    const { tin, tout } = eulerTour(n, edges, root);
    this.tin = tin;
    this.tout = tout;
    this.values = values.slice();
    this.bit = new Fenwick(n);
    for (let v = 0; v < n; v++) this.bit.add(tin[v], values[v]); // store value at its tour position
  }
  update(v, newValue) {
    this.bit.add(this.tin[v], newValue - this.values[v]); // Fenwick stores deltas
    this.values[v] = newValue;
  }
  subtreeSum(v) { return this.bit.range(this.tin[v], this.tout[v]); }
}

// ---------- 6. Rerooting DP: sum of distances from every node ----------
// Pass 1 (root 0): count[v] = subtree size, down[v] = sum of distances into v's subtree.
// Pass 2: moving the root from parent p to child c makes count[c] nodes 1 closer and
// n - count[c] nodes 1 farther: ans[c] = ans[p] - count[c] + (n - count[c]).
function sumOfDistances(n, edges) {
  if (n === 1) return [0];
  const { order, parent, size } = eulerTour(n, edges, 0);
  const down = new Array(n).fill(0);
  for (let i = n - 1; i > 0; i--) {
    const v = order[i];
    down[parent[v]] += down[v] + size[v]; // every node below v is one edge farther from parent
  }
  const ans = new Array(n);
  ans[0] = down[0];
  for (let i = 1; i < n; i++) {
    const v = order[i];
    ans[v] = ans[parent[v]] - size[v] + (n - size[v]);
  }
  return ans;
}

// ---------- 7. Centroid decomposition ----------
// A centroid is a node whose removal leaves pieces of size <= n/2. Recursively removing
// centroids gives a "centroid tree" of depth O(log n), because every piece at least halves.
function centroidDecomposition(n, edges) {
  const adj = buildAdjacency(n, edges);
  const removed = new Array(n).fill(false);
  const size = new Array(n).fill(0);
  const centroidParent = new Array(n).fill(-1);
  const level = new Array(n).fill(0);
  const centroids = []; // processing order, each with its component

  // Iteratively compute subtree sizes of the component containing start, then walk
  // towards the heavy side until no child has more than half of the component.
  function findCentroid(start) {
    const order = [];
    const par = new Map([[start, -1]]);
    const stack = [start];
    while (stack.length) {
      const u = stack.pop();
      order.push(u);
      for (const v of adj[u]) if (!removed[v] && v !== par.get(u)) { par.set(v, u); stack.push(v); }
    }
    for (let i = order.length - 1; i >= 0; i--) {
      const u = order[i];
      size[u] = 1;
      for (const v of adj[u]) if (!removed[v] && v !== par.get(u)) size[u] += size[v];
    }
    const total = order.length;
    let c = start;
    for (;;) {
      let next = -1;
      for (const v of adj[c]) {
        if (!removed[v] && v !== par.get(c) && size[v] > total / 2) { next = v; break; }
      }
      if (next === -1) return { c, component: order };
      c = next;
    }
  }

  const work = [[0, -1, 0]]; // [any node in component, centroid parent, level]
  while (work.length) {
    const [start, cp, lvl] = work.pop();
    const { c, component } = findCentroid(start);
    centroidParent[c] = cp;
    level[c] = lvl;
    centroids.push({ centroid: c, component });
    removed[c] = true;
    for (const v of adj[c]) if (!removed[v]) work.push([v, c, lvl + 1]);
  }
  return { centroidParent, level, centroids, adj };
}

// Count unordered pairs (u, v), u != v, with dist(u, v) <= k.
// Every path passes through exactly one "highest" centroid. At centroid c we count pairs in
// c's component whose distance through c is <= k, then subtract the pairs that sit inside the
// same child piece (they do not really pass through c; they get counted deeper).
function countPairsWithinDistance(n, edges, k) {
  const adj = buildAdjacency(n, edges);
  const { centroids, level } = centroidDecomposition(n, edges);
  const blocked = (v, c) => level[v] < level[c]; // centroids removed before c

  function distancesFrom(src, c, startDist) {
    const out = [];
    const stack = [[src, -1, startDist]];
    while (stack.length) {
      const [u, p, d] = stack.pop();
      out.push(d);
      for (const v of adj[u]) if (v !== p && v !== c && !blocked(v, c)) stack.push([v, u, d + 1]);
    }
    return out;
  }
  function pairsAtMost(dists) {
    dists.sort((a, b) => a - b);
    let count = 0;
    for (let i = 0, j = dists.length - 1; i < j;) {
      if (dists[i] + dists[j] <= k) { count += j - i; i++; } else j--;
    }
    return count;
  }

  let total = 0;
  for (const { centroid: c } of centroids) {
    const all = [0]; // c itself at distance 0
    for (const v of adj[c]) {
      if (blocked(v, c)) continue;
      const piece = distancesFrom(v, c, 1);
      total -= pairsAtMost(piece.slice());
      all.push(...piece);
    }
    total += pairsAtMost(all);
  }
  return total;
}

// ---------- 8. Heavy-light decomposition ----------
// Heavy child = child with the biggest subtree. Following heavy edges forms "chains"; any
// root-to-node path crosses at most O(log n) light edges, hence O(log n) chains. We lay
// chains out contiguously in one array so each chain piece of a path is one Fenwick range.
class HeavyLightDecomposition {
  constructor(n, edges, values, root = 0) {
    if (values.length !== n) throw new Error('need one value per node');
    const adj = buildAdjacency(n, edges);
    const { order, parent, size } = eulerTour(n, edges, root);
    const depth = new Array(n).fill(0);
    for (let i = 1; i < n; i++) depth[order[i]] = depth[parent[order[i]]] + 1;
    const heavy = new Array(n).fill(-1);
    for (let u = 0; u < n; u++) {
      let best = 0;
      for (const v of adj[u]) if (v !== parent[u] && size[v] > best) { best = size[v]; heavy[u] = v; }
    }
    const head = new Array(n);
    const pos = new Array(n);
    let cur = 0;
    const heads = [root];
    while (heads.length) {
      const h = heads.pop();
      for (let u = h; u !== -1; u = heavy[u]) { // walk the whole chain
        head[u] = h;
        pos[u] = cur++;
        for (const v of adj[u]) if (v !== parent[u] && v !== heavy[u]) heads.push(v); // light child starts a chain
      }
    }
    Object.assign(this, { parent, depth, head, pos, values: values.slice(), bit: new Fenwick(n) });
    for (let v = 0; v < n; v++) this.bit.add(pos[v], values[v]);
  }
  update(v, newValue) {
    this.bit.add(this.pos[v], newValue - this.values[v]);
    this.values[v] = newValue;
  }
  pathSum(u, v) {
    let sum = 0;
    const { head, depth, parent, pos } = this;
    while (head[u] !== head[v]) {
      if (depth[head[u]] < depth[head[v]]) [u, v] = [v, u]; // lift the deeper chain head
      sum += this.bit.range(pos[head[u]], pos[u]);
      u = parent[head[u]];
    }
    if (depth[u] > depth[v]) [u, v] = [v, u];
    return sum + this.bit.range(pos[u], pos[v]);
  }
}

// ---------- 9. Isomorphism via canonical ids ----------
// Bottom-up: a node's id is decided by the SORTED list of its children's ids. Equal sorted
// lists -> equal ids. Sharing the `registry` Map between two trees makes ids comparable.
function rootedCanonicalId(n, edges, root, registry = new Map()) {
  const { order, parent } = eulerTour(n, edges, root);
  const adj = buildAdjacency(n, edges);
  const id = new Array(n);
  for (let i = n - 1; i >= 0; i--) {
    const u = order[i];
    const kids = [];
    for (const v of adj[u]) if (v !== parent[u]) kids.push(id[v]);
    kids.sort((a, b) => a - b);
    const key = kids.join(',');
    if (!registry.has(key)) registry.set(key, registry.size);
    id[u] = registry.get(key);
  }
  return id[root];
}

// Unrooted trees: root each at its center(s) (at most 2), compare.
function areIsomorphic(n1, edges1, n2, edges2) {
  if (n1 !== n2) return false;
  const registry = new Map();
  const c1 = treeCenters(n1, edges1);
  const c2 = treeCenters(n2, edges2);
  if (c1.length !== c2.length) return false;
  const a = rootedCanonicalId(n1, edges1, c1[0], registry);
  return c2.some(c => rootedCanonicalId(n2, edges2, c, registry) === a);
}

// ---------- self-test ----------
if (require.main === module) {
  const assert = require('assert');

  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rand = mulberry32(12345);
  const randInt = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
  function randomTree(n) {
    const perm = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) { const j = randInt(0, i); [perm[i], perm[j]] = [perm[j], perm[i]]; }
    const edges = [];
    for (let i = 1; i < n; i++) edges.push([perm[i], perm[randInt(0, i - 1)]]);
    return edges;
  }
  function bruteDist(n, edges) {
    const adj = buildAdjacency(n, edges);
    return Array.from({ length: n }, (_, s) => bfsDistances(adj, s).dist);
  }
  function brutePath(n, edges, u, v) {
    const { parent } = bfsDistances(buildAdjacency(n, edges), u);
    const path = [];
    for (let x = v; x !== -1; x = parent[x]) path.push(x);
    return path;
  }

  // fixed examples
  //   0 - 1 - 2 - 3
  //       |
  //       4 - 5
  const E = [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5]];
  assert.strictEqual(treeDiameter(6, E).length, 4);
  assert.deepStrictEqual(treeCenters(6, E), [1]);
  assert.deepStrictEqual(sumOfDistances(6, E), [11, 7, 9, 13, 9, 13]);
  assert.strictEqual(treeDiameter(1, []).length, 0);
  assert.deepStrictEqual(treeCenters(2, [[0, 1]]), [0, 1]);
  assert.throws(() => buildAdjacency(3, [[0, 1]]));

  // binary lifting is reused, not duplicated
  const lifting = binaryLiftingLCA(6, [-1, 0, 1, 2, 1, 4], 0);
  assert.strictEqual(lifting.lca(3, 5), 1);

  for (let t = 0; t < 150; t++) {
    const n = randInt(1, 14);
    const edges = randomTree(n);
    const D = bruteDist(n, edges);

    // diameter + centers
    const diam = Math.max(...D.flat());
    assert.strictEqual(treeDiameter(n, edges).length, diam);
    const ecc = D.map(row => Math.max(...row));
    const minEcc = Math.min(...ecc);
    assert.deepStrictEqual(treeCenters(n, edges), ecc.map((e, i) => (e === minEcc ? i : -1)).filter(i => i >= 0));

    // rerooting
    assert.deepStrictEqual(sumOfDistances(n, edges), D.map(row => row.reduce((a, b) => a + b, 0)));

    // centroid pairs
    const k = randInt(0, n);
    let pairs = 0;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (D[i][j] <= k) pairs++;
    assert.strictEqual(countPairsWithinDistance(n, edges, k), pairs);
    const { level } = centroidDecomposition(n, edges);
    assert.ok(Math.max(...level) <= Math.floor(Math.log2(n)), 'centroid tree depth is O(log n)');

    // subtree sums + HLD path sums, with updates
    const values = Array.from({ length: n }, () => randInt(-5, 9));
    const root = randInt(0, n - 1);
    const sq = new SubtreeSumQuery(n, edges, values, root);
    const hld = new HeavyLightDecomposition(n, edges, values, root);
    const vals = values.slice();
    for (let q = 0; q < 20; q++) {
      if (rand() < 0.4) {
        const v = randInt(0, n - 1), x = randInt(-5, 9);
        vals[v] = x; sq.update(v, x); hld.update(v, x);
      } else {
        const v = randInt(0, n - 1);
        // brute subtree: nodes w whose path to root passes through v
        let s = 0;
        for (let w = 0; w < n; w++) if (D[root][w] === D[root][v] + D[v][w]) s += vals[w];
        assert.strictEqual(sq.subtreeSum(v), s);
        const u = randInt(0, n - 1);
        assert.strictEqual(hld.pathSum(u, v), brutePath(n, edges, u, v).reduce((a, x) => a + vals[x], 0));
      }
    }

    // isomorphism: relabelled copy must match; brute force over permutations for n <= 6
    const perm = Array.from({ length: n }, (_, i) => i).sort(() => rand() - 0.5);
    const relabelled = edges.map(([a, b]) => [perm[a], perm[b]]);
    assert.strictEqual(areIsomorphic(n, edges, n, relabelled), true);
    if (n <= 6) {
      const other = randomTree(n);
      const key = es => new Set(es.map(([a, b]) => (a < b ? `${a}-${b}` : `${b}-${a}`)));
      const target = key(other);
      let brute = false;
      const p = [];
      const used = new Array(n).fill(false);
      (function go() {
        if (brute) return;
        if (p.length === n) {
          const mapped = key(edges.map(([a, b]) => [p[a], p[b]]));
          brute = [...mapped].every(e => target.has(e));
          return;
        }
        for (let i = 0; i < n; i++) if (!used[i]) { used[i] = true; p.push(i); go(); p.pop(); used[i] = false; }
      })();
      assert.strictEqual(areIsomorphic(n, edges, n, other), brute);
    }
  }

  // deep path (no stack overflow): 100k nodes in a line
  const N = 100000;
  const line = Array.from({ length: N - 1 }, (_, i) => [i, i + 1]);
  assert.strictEqual(treeDiameter(N, line).length, N - 1);
  assert.strictEqual(new HeavyLightDecomposition(N, line, new Array(N).fill(1)).pathSum(0, N - 1), N);

  console.log('✓ tree_techniques.js self-test passed');
}

module.exports = {
  buildAdjacency,
  bfsDistances,
  treeDiameter,
  treeCenters,
  eulerTour,
  Fenwick,
  SubtreeSumQuery,
  sumOfDistances,
  centroidDecomposition,
  countPairsWithinDistance,
  HeavyLightDecomposition,
  rootedCanonicalId,
  areIsomorphic,
  binaryLiftingLCA,
};

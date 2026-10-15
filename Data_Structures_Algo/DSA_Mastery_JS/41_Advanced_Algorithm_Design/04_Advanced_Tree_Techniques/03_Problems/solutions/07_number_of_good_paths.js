/**
 * 07. Number of Good Paths   (LeetCode 2421 — Hard)
 *
 * PROBLEM
 * A tree has n nodes 0..n-1; node i has value vals[i]. A "good path" is a simple path whose
 * two endpoints have the SAME value and every node on it has value <= that value.
 * A single node is a good path. Paths a..b and b..a count once. Return the count.
 *
 * EXAMPLES
 * vals = [1,3,2,1,3], edges = [[0,1],[0,2],[2,3],[2,4]]   -> 6
 *   (5 single nodes + the path 1-0-2-4 with values 3,1,2,3)
 * vals = [1,1,2,2,3], edges = [[0,1],[1,2],[2,3],[2,4]]   -> 7
 * vals = [1], edges = []                                  -> 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 3 * 10^4, vals up to 10^5.
 * - Does a single node count? (yes)
 *
 * APPROACH 1 — Brute force   O(n^3) time worst case
 * For every pair i <= j with vals[i] === vals[j], find the path (BFS parents from i) and
 * check its maximum.
 *
 * APPROACH 2 — Optimal (sort + union-find, "add nodes in increasing value")   O(n log n)
 * Process values from small to large. When handling value x, first union every edge whose
 * BOTH endpoints have value <= x (sort edges by max(vals[a], vals[b])). Now two nodes of
 * value x are connected by a good path exactly when they sit in the same component (the
 * component only contains values <= x). If a component has c nodes of value x it holds
 * c * (c + 1) / 2 good paths (pairs + singles) with that value.
 *
 * Dry run on example 1:
 *   edges by max value: [0,2]=2, [2,3]=2, [0,1]=3, [2,4]=3
 *   x = 1: no edges yet; nodes 0, 3 in separate comps -> 1 + 1 = 2
 *   x = 2: union 0-2, 2-3; node 2 alone with value 2 -> +1 = 3
 *   x = 3: union 0-1, 2-4; nodes 1 and 4 in one comp, c = 2 -> +3 = 6
 *
 * EDGE CASES
 * - n = 1 -> 1
 * - all values equal -> n * (n + 1) / 2
 * - strictly increasing path -> n (only singles)
 */

function bruteForce(vals, edges) {
  const n = vals.length;
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  let count = 0;
  for (let i = 0; i < n; i++) {
    const parent = new Array(n).fill(-2);
    parent[i] = -1;
    const q = [i];
    for (let h = 0; h < q.length; h++) for (const v of adj[q[h]]) if (parent[v] === -2) { parent[v] = q[h]; q.push(v); }
    for (let j = i; j < n; j++) {
      if (vals[j] !== vals[i]) continue;
      let ok = true;
      for (let x = j; x !== -1; x = parent[x]) if (vals[x] > vals[i]) { ok = false; break; }
      if (ok) count++;
    }
  }
  return count;
}

function optimal(vals, edges) {
  const n = vals.length;
  const dsu = Array.from({ length: n }, (_, i) => i);
  const find = x => { while (dsu[x] !== x) { dsu[x] = dsu[dsu[x]]; x = dsu[x]; } return x; };
  const sortedEdges = edges.slice().sort((a, b) => Math.max(vals[a[0]], vals[a[1]]) - Math.max(vals[b[0]], vals[b[1]]));
  const nodes = Array.from({ length: n }, (_, i) => i).sort((a, b) => vals[a] - vals[b]);
  let count = 0;
  let e = 0;
  for (let i = 0; i < n;) {
    const x = vals[nodes[i]];
    // 1. connect everything that uses only values <= x
    while (e < sortedEdges.length && Math.max(vals[sortedEdges[e][0]], vals[sortedEdges[e][1]]) <= x) {
      const ra = find(sortedEdges[e][0]), rb = find(sortedEdges[e][1]);
      if (ra !== rb) dsu[ra] = rb;
      e++;
    }
    // 2. group nodes of value x by component
    const perRoot = new Map();
    for (; i < n && vals[nodes[i]] === x; i++) {
      const r = find(nodes[i]);
      perRoot.set(r, (perRoot.get(r) || 0) + 1);
    }
    for (const c of perRoot.values()) count += (c * (c + 1)) / 2;
  }
  return count;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 3, 2, 1, 3], [[0, 1], [0, 2], [2, 3], [2, 4]]), 6);
  assert.strictEqual(solve([1, 1, 2, 2, 3], [[0, 1], [1, 2], [2, 3], [2, 4]]), 7);
  assert.strictEqual(solve([1], []), 1);
  assert.strictEqual(solve([4, 4, 4, 4], [[0, 1], [1, 2], [2, 3]]), 10);
  assert.strictEqual(solve([1, 2, 3, 4], [[0, 1], [1, 2], [2, 3]]), 4);
  assert.strictEqual(solve([2, 5, 2], [[0, 1], [1, 2]]), 3); // 5 blocks the 2..2 path
}
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(2421);
for (let t = 0; t < 200; t++) {
  const n = 1 + Math.floor(rand() * 15);
  const vals = Array.from({ length: n }, () => 1 + Math.floor(rand() * 4));
  const edges = [];
  for (let i = 1; i < n; i++) edges.push([i, Math.floor(rand() * i)]);
  assert.strictEqual(optimal(vals, edges), bruteForce(vals, edges));
}
console.log('✓ 07_number_of_good_paths passed');

module.exports = { optimal, bruteForce };

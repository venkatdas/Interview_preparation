/**
 * 03. Count Subtree Sums with Updates   (Original — Medium)
 *
 * PROBLEM
 * A tree with n nodes 0..n-1 is rooted at node 0. Node v holds an integer values[v].
 * Process queries in order:
 *   ['update', v, x]  -> set values[v] = x
 *   ['sum', v]        -> report the sum of values in the subtree of v (v included)
 * Return the answers of all 'sum' queries, in order.
 *
 * EXAMPLES
 *            0(1)
 *           /    \
 *        1(2)    2(3)
 *        /  \
 *     3(4)  4(5)
 * edges = [[0,1],[0,2],[1,3],[1,4]], values = [1,2,3,4,5]
 * queries = [['sum',1], ['update',3,10], ['sum',1], ['sum',0]]  -> [11, 17, 21]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n, q up to 10^5 -> O(n) per query (2 * 10^10 total) is too slow.
 * - Values can be negative? (yes; sums are plain numbers, stay below 2^53)
 * - Is the root fixed? (yes, node 0)
 *
 * APPROACH 1 — Brute force   O(n) per query, O(n) space
 * Keep the values array; for 'sum' walk the subtree of v with a stack.
 *
 * APPROACH 2 — Optimal (Euler tour + Fenwick tree)   O(n + q log n) time, O(n) space
 * Number nodes in DFS preorder: tin[v]. The subtree of v is EXACTLY the contiguous block
 * tin[v] .. tin[v] + size[v] - 1. Put values[v] at index tin[v] of a Fenwick tree.
 *   update -> point add (x - old) at tin[v]
 *   sum    -> range sum over the block
 * A tree question became an array question.
 *
 * Dry run on the example (stack preorder visits 0, 2, 1, 4, 3):
 *   tin = [0, 2, 1, 4, 3], size = [5, 3, 1, 1, 1]
 *   array by position = [v0=1, v2=3, v1=2, v4=5, v3=4]
 *   sum(1)   -> positions 2..4 -> 2 + 5 + 4 = 11
 *   update(3, 10): position 3 gets +6 -> [1,3,2,5,10]
 *   sum(1)   -> 2 + 5 + 10 = 17
 *   sum(0)   -> positions 0..4 -> 21
 *
 * EDGE CASES
 * - n = 1: the only subtree is the whole tree
 * - update to the same value -> delta 0
 * - leaf: block of length 1
 * - deep path tree: iterative DFS, no recursion
 */

function children(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
  return adj;
}

function bruteForce(n, edges, values, queries) {
  const adj = children(n, edges);
  const parent = new Array(n).fill(-1);
  const order = [0];
  const seen = new Array(n).fill(false);
  seen[0] = true;
  for (let h = 0; h < order.length; h++) for (const v of adj[order[h]]) if (!seen[v]) { seen[v] = true; parent[v] = order[h]; order.push(v); }
  const vals = values.slice();
  const out = [];
  for (const q of queries) {
    if (q[0] === 'update') { vals[q[1]] = q[2]; continue; }
    let s = 0;
    const stack = [q[1]];
    while (stack.length) {
      const u = stack.pop();
      s += vals[u];
      for (const v of adj[u]) if (v !== parent[u]) stack.push(v);
    }
    out.push(s);
  }
  return out;
}

function optimal(n, edges, values, queries) {
  const adj = children(n, edges);
  // 1. Euler tour (preorder) iteratively
  const tin = new Array(n);
  const parent = new Array(n).fill(-1);
  const order = [];
  const stack = [0];
  const seen = new Array(n).fill(false);
  seen[0] = true;
  while (stack.length) {
    const u = stack.pop();
    tin[u] = order.length;
    order.push(u);
    for (const v of adj[u]) if (!seen[v]) { seen[v] = true; parent[v] = u; stack.push(v); }
  }
  const size = new Array(n).fill(1);
  for (let i = n - 1; i > 0; i--) size[parent[order[i]]] += size[order[i]];

  // 2. Fenwick tree over tour positions (1-indexed internally)
  const bit = new Array(n + 1).fill(0);
  const add = (i, d) => { for (i++; i <= n; i += i & -i) bit[i] += d; };
  const prefix = i => { let s = 0; for (i++; i > 0; i -= i & -i) s += bit[i]; return s; };
  const vals = values.slice();
  for (let v = 0; v < n; v++) add(tin[v], vals[v]);

  const out = [];
  for (const q of queries) {
    if (q[0] === 'update') {
      const [, v, x] = q;
      add(tin[v], x - vals[v]);
      vals[v] = x;
    } else {
      const v = q[1];
      out.push(prefix(tin[v] + size[v] - 1) - prefix(tin[v] - 1));
    }
  }
  return out;
}

// ---------- tests ----------
const assert = require('assert');
const E = [[0, 1], [0, 2], [1, 3], [1, 4]];
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(5, E, [1, 2, 3, 4, 5], [['sum', 1], ['update', 3, 10], ['sum', 1], ['sum', 0]]), [11, 17, 21]);
  assert.deepStrictEqual(solve(1, [], [7], [['sum', 0], ['update', 0, -3], ['sum', 0]]), [7, -3]);
  assert.deepStrictEqual(solve(5, E, [1, 2, 3, 4, 5], [['sum', 4], ['sum', 2]]), [5, 3]);
  assert.deepStrictEqual(solve(5, E, [1, 2, 3, 4, 5], [['update', 0, 1], ['sum', 0]]), [15]); // same value
  assert.deepStrictEqual(solve(3, [[0, 1], [1, 2]], [-1, -2, -3], [['sum', 1]]), [-5]);
  assert.deepStrictEqual(solve(5, E, [1, 2, 3, 4, 5], []), []);
}
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(3);
const ri = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
for (let t = 0; t < 200; t++) {
  const n = ri(1, 15);
  const edges = [];
  for (let i = 1; i < n; i++) edges.push([i, ri(0, i - 1)]);
  const values = Array.from({ length: n }, () => ri(-9, 9));
  const queries = Array.from({ length: 15 }, () => (rand() < 0.4 ? ['update', ri(0, n - 1), ri(-9, 9)] : ['sum', ri(0, n - 1)]));
  assert.deepStrictEqual(optimal(n, edges, values, queries), bruteForce(n, edges, values, queries));
}
console.log('✓ 03_count_subtree_sums_with_updates passed');

module.exports = { optimal, bruteForce };

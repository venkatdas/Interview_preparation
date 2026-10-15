/**
 * 07. Lowest Common Ancestor with Binary Lifting   (classic — Hard)
 *
 * PROBLEM
 * A rooted tree with n nodes (0..n-1) is given as a parent array (parent[root] = -1).
 * Answer many queries lca(u, v): the deepest node that is an ancestor of both u and v
 * (a node is its own ancestor).
 *
 * EXAMPLES
 * parent = [-1, 0, 0, 1, 1, 2]        tree:      0
 *                                              /   \
 *                                             1     2
 *                                            / \     \
 *                                           3   4     5
 *   lca(3, 4) -> 1;  lca(3, 5) -> 0;  lca(1, 3) -> 1;  lca(2, 2) -> 2
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 10^5 and queries up to 10^5 -> O(n) per query is too slow; need preprocessing
 * - Tree is static (no edge changes)
 * - For a BINARY tree given as nodes, the usual recursive LCA (LeetCode 236) is O(n) per
 *   query; binary lifting is the many-queries tool
 *
 * APPROACH 1 — Brute force   O(n) per query
 * Collect the ancestors of u in a Set, then walk up from v until hitting one.
 *
 * APPROACH 2 — Optimal (Binary lifting)   O(n log n) preprocessing, O(log n) per query
 * up[k][v] = the 2^k-th ancestor of v, computed as up[k][v] = up[k-1][ up[k-1][v] ]
 * (jump 2^(k-1), then 2^(k-1) again). Also compute depth[v].
 * lca(u, v):
 *   1. make u the deeper node; lift it by depth[u] - depth[v] using the binary digits of
 *      that difference (one jump per set bit)
 *   2. if u === v, done
 *   3. for k from high to low: if up[k][u] !== up[k][v], jump both (they are still below
 *      the LCA, so jumping is safe); after the loop both sit just under the LCA
 *   4. return up[0][u]
 *
 * Dry run on the example, lca(3, 5):
 *   depth: [0,1,1,2,2,2]; up[0] = parent (root maps to itself): [0,0,0,1,1,2]; up[1] = [0,0,0,0,0,0]
 *   same depth; u=3, v=5 differ
 *   k=1: up[1][3]=0 === up[1][5]=0 -> no jump
 *   k=0: up[0][3]=1 !== up[0][5]=2 -> jump: u=1, v=2
 *   return up[0][1] = 0
 *
 * EDGE CASES
 * - u === v
 * - one node is an ancestor of the other
 * - the root in a query
 * - a path-shaped tree (depth n) and a star-shaped tree (depth 1)
 */

function buildChildren(parent) {
  const n = parent.length;
  const children = Array.from({ length: n }, () => []);
  let root = 0;
  for (let v = 0; v < n; v++) {
    if (parent[v] === -1) root = v;
    else children[parent[v]].push(v);
  }
  return { children, root };
}

function bruteForce(parent, queries) {
  return queries.map(([u, v]) => {
    const ancestors = new Set();
    for (let x = u; x !== -1; x = parent[x]) ancestors.add(x);
    let y = v;
    while (!ancestors.has(y)) y = parent[y];
    return y;
  });
}

function optimal(parent, queries) {
  const n = parent.length;
  const { children, root } = buildChildren(parent);
  const LOG = Math.max(1, Math.ceil(Math.log2(n + 1)));

  // depths via iterative DFS
  const depth = new Array(n).fill(0);
  const stack = [root];
  while (stack.length) {
    const v = stack.pop();
    for (const c of children[v]) {
      depth[c] = depth[v] + 1;
      stack.push(c);
    }
  }

  // up[k][v]
  const up = Array.from({ length: LOG }, () => new Array(n));
  for (let v = 0; v < n; v++) up[0][v] = parent[v] === -1 ? v : parent[v];
  for (let k = 1; k < LOG; k++) {
    for (let v = 0; v < n; v++) up[k][v] = up[k - 1][up[k - 1][v]];
  }

  function lift(v, steps) {
    for (let k = 0; steps > 0; k++, steps >>= 1) if (steps & 1) v = up[k][v];
    return v;
  }

  function lca(u, v) {
    if (depth[u] < depth[v]) [u, v] = [v, u];
    u = lift(u, depth[u] - depth[v]);
    if (u === v) return u;
    for (let k = LOG - 1; k >= 0; k--) {
      if (up[k][u] !== up[k][v]) {
        u = up[k][u];
        v = up[k][v];
      }
    }
    return up[0][u];
  }

  return queries.map(([u, v]) => lca(u, v));
}

// ---------- tests ----------
const assert = require('assert');
const example = [-1, 0, 0, 1, 1, 2];
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(example, [[3, 4], [3, 5], [1, 3], [2, 2], [0, 5], [4, 5]]), [1, 0, 1, 2, 0, 0]);
  assert.deepStrictEqual(solve([-1], [[0, 0]]), [0]);
  assert.deepStrictEqual(solve([-1, 0, 1, 2, 3], [[4, 1], [4, 4], [0, 4]]), [1, 4, 0]);        // path
  assert.deepStrictEqual(solve([-1, 0, 0, 0, 0], [[1, 2], [3, 4], [1, 1]]), [0, 0, 1]);          // star
}
for (let trial = 0; trial < 100; trial++) {
  const n = 1 + Math.floor(Math.random() * 40);
  const parent = [-1];
  for (let v = 1; v < n; v++) parent.push(Math.floor(Math.random() * v));
  const queries = Array.from({ length: 30 }, () => [Math.floor(Math.random() * n), Math.floor(Math.random() * n)]);
  assert.deepStrictEqual(optimal(parent, queries), bruteForce(parent, queries));
}
console.log('✓ 07-lowest-common-ancestor-binary-lifting passed');

module.exports = { optimal, bruteForce };

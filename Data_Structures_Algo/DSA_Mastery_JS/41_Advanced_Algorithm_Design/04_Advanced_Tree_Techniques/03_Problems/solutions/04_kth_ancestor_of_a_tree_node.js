/**
 * 04. Kth Ancestor of a Tree Node   (LeetCode 1483 — Hard)
 *
 * This is a brief RE-SOLVE. The full teaching version lives in
 * ../../../01_Classic_Techniques/03_Problems/solutions/08_kth_ancestor_of_a_tree_node.js
 * Here we reuse binaryLiftingLCA from 01_Classic_Techniques instead of copying it.
 *
 * PROBLEM
 * A tree has n nodes 0..n-1, root 0, given as parent[] (parent[0] = -1). Build a class
 * with getKthAncestor(node, k): the k-th ancestor of node, or -1 if it does not exist.
 *
 * EXAMPLES
 * parent = [-1,0,0,1,1,2,2]
 * getKthAncestor(3,1) -> 1,  getKthAncestor(5,2) -> 0,  getKthAncestor(6,3) -> -1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n, number of queries up to 5 * 10^4; k up to n.
 * - Is parent[i] < i guaranteed? (on LeetCode yes; do not rely on it)
 *
 * APPROACH 1 — Brute force   O(k) per query, O(n) space
 * Walk parent pointers k times.
 *
 * APPROACH 2 — Optimal (binary lifting)   O(n log n) build, O(log k) per query
 * up[j][v] = 2^j-th ancestor. Write k in binary and jump once per set bit.
 *
 * Dry run getKthAncestor(5, 2) with parent = [-1,0,0,1,1,2,2]:
 *   depth[5] = 2, k = 2 = 0b10 -> bit 1 set -> v = up[1][5] = up[0][up[0][5]] = up[0][2] = 0
 *
 * EDGE CASES
 * - k = 0 -> the node itself
 * - k > depth -> -1
 * - k exactly = depth -> root
 */

const { binaryLiftingLCA } = require('../../../01_Classic_Techniques/02_Implementations/classic_techniques');

class BruteForceTreeAncestor {
  constructor(n, parent) { this.parent = parent; }
  getKthAncestor(node, k) {
    while (k-- > 0 && node !== -1) node = this.parent[node];
    return node;
  }
}

class TreeAncestor {
  constructor(n, parent) {
    this.lift = binaryLiftingLCA(n, parent, 0); // returns { kthAncestor, lca, depth, up }
  }
  getKthAncestor(node, k) { return this.lift.kthAncestor(node, k); } // -1 when k > depth
}

const bruteForce = (n, parent, queries) => { const t = new BruteForceTreeAncestor(n, parent); return queries.map(([v, k]) => t.getKthAncestor(v, k)); };
const optimal = (n, parent, queries) => { const t = new TreeAncestor(n, parent); return queries.map(([v, k]) => t.getKthAncestor(v, k)); };

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  const P = [-1, 0, 0, 1, 1, 2, 2];
  assert.deepStrictEqual(solve(7, P, [[3, 1], [5, 2], [6, 3]]), [1, 0, -1]);
  assert.deepStrictEqual(solve(7, P, [[4, 0], [0, 1], [6, 2]]), [4, -1, 0]);
  assert.deepStrictEqual(solve(1, [-1], [[0, 0], [0, 5]]), [0, -1]);
  assert.deepStrictEqual(solve(5, [-1, 0, 1, 2, 3], [[4, 4], [4, 3], [4, 5]]), [0, 1, -1]);
  assert.deepStrictEqual(solve(4, [-1, 3, 0, 2], [[1, 2], [1, 3]]), [2, 0]); // parent[i] > i is allowed
}
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(1483);
for (let t = 0; t < 200; t++) {
  const n = 1 + Math.floor(rand() * 20);
  const parent = [-1];
  for (let i = 1; i < n; i++) parent.push(Math.floor(rand() * i));
  const queries = Array.from({ length: 20 }, () => [Math.floor(rand() * n), Math.floor(rand() * (n + 2))]);
  assert.deepStrictEqual(optimal(n, parent, queries), bruteForce(n, parent, queries));
}
console.log('✓ 04_kth_ancestor_of_a_tree_node passed');

module.exports = { optimal, bruteForce, TreeAncestor };

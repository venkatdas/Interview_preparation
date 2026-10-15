/**
 * 08. Kth Ancestor of a Tree Node   (LeetCode 1483 — Hard)
 *
 * PROBLEM
 * A tree with n nodes 0..n-1, rooted at 0, is given as parent[] (parent[0] = -1).
 * Implement TreeAncestor(n, parent) with getKthAncestor(node, k): the k-th ancestor of
 * node (1st = parent), or -1 if it does not exist.
 *
 * EXAMPLES
 * TreeAncestor(7, [-1,0,0,1,1,2,2])
 *   getKthAncestor(3, 1) -> 1;  getKthAncestor(5, 2) -> 0;  getKthAncestor(6, 3) -> -1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 5 * 10^4, k up to n, up to 5 * 10^4 queries -> O(k) per query is too slow in total
 * - Tree is static (so we can preprocess)
 *
 * APPROACH 1 — Brute force   O(k) per query, O(n) space
 * Walk up k parent links; return -1 if you reach the root early.
 *
 * APPROACH 2 — Optimal (Binary lifting)   O(n log n) preprocessing, O(log n) per query
 * up[j][v] = 2^j-th ancestor of v (-1 if none). up[0] = parent;
 * up[j][v] = up[j-1][ up[j-1][v] ] (if that intermediate is -1, stay -1).
 * getKthAncestor(v, k): for each set bit j of k, v = up[j][v]; stop at -1.
 * Why it works: any k is a sum of distinct powers of two, so k jumps of lengths 2^j land
 * exactly k levels up, in at most log k steps.
 *
 * Dry run on the example, getKthAncestor(5, 2): k = 2 = 10b
 *   bit 0 not set; bit 1 set -> v = up[1][5] = up[0][up[0][5]] = up[0][2] = 0 -> 0
 * getKthAncestor(6, 3): k = 11b: bit 0 -> up[0][6] = 2; bit 1 -> up[1][2] = up[0][0] = -1 -> -1
 *
 * EDGE CASES
 * - k = 0 -> the node itself (not asked by LeetCode, but define it)
 * - k larger than the depth -> -1
 * - the root with any k >= 1 -> -1
 */

class TreeAncestorBrute {
  constructor(n, parent) {
    this.parent = parent;
  }
  getKthAncestor(node, k) {
    while (k > 0 && node !== -1) {
      node = this.parent[node];
      k--;
    }
    return node;
  }
}

class TreeAncestor {
  constructor(n, parent) {
    this.LOG = Math.max(1, Math.ceil(Math.log2(n + 1)));
    this.up = [parent.slice()];
    for (let j = 1; j < this.LOG; j++) {
      const prev = this.up[j - 1];
      const row = new Array(n);
      for (let v = 0; v < n; v++) row[v] = prev[v] === -1 ? -1 : prev[prev[v]];
      this.up.push(row);
    }
  }
  getKthAncestor(node, k) {
    for (let j = 0; k > 0 && node !== -1; j++, k >>= 1) {
      if (j >= this.LOG) return -1;        // k has a bit beyond the table: too far up
      if (k & 1) node = this.up[j][node];
    }
    return node;
  }
}

// ---------- tests ----------
const assert = require('assert');
for (const Cls of [TreeAncestorBrute, TreeAncestor]) {
  const t = new Cls(7, [-1, 0, 0, 1, 1, 2, 2]);
  assert.strictEqual(t.getKthAncestor(3, 1), 1);
  assert.strictEqual(t.getKthAncestor(5, 2), 0);
  assert.strictEqual(t.getKthAncestor(6, 3), -1);
  assert.strictEqual(t.getKthAncestor(6, 0), 6);
  assert.strictEqual(t.getKthAncestor(0, 1), -1);
  assert.strictEqual(t.getKthAncestor(4, 100), -1);
  const single = new Cls(1, [-1]);
  assert.strictEqual(single.getKthAncestor(0, 1), -1);
}
for (let trial = 0; trial < 100; trial++) {
  const n = 1 + Math.floor(Math.random() * 40);
  const parent = [-1];
  for (let v = 1; v < n; v++) parent.push(Math.floor(Math.random() * v));
  const a = new TreeAncestorBrute(n, parent);
  const b = new TreeAncestor(n, parent);
  for (let q = 0; q < 30; q++) {
    const node = Math.floor(Math.random() * n);
    const k = Math.floor(Math.random() * (n + 3));
    assert.strictEqual(b.getKthAncestor(node, k), a.getKthAncestor(node, k));
  }
}
console.log('✓ 08-kth-ancestor-of-a-tree-node passed');

module.exports = { TreeAncestor, TreeAncestorBrute, optimal: TreeAncestor, bruteForce: TreeAncestorBrute };

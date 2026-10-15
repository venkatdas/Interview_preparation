/**
 * 11. Unique Binary Search Trees II   (LeetCode 95 — Medium)
 *
 * PROBLEM
 * Given n, build every structurally unique BST that stores exactly the values 1..n.
 * Return the list of roots (any order).
 *
 * EXAMPLES
 * n = 1 -> [[1]]
 * n = 3 -> 5 trees:
 *   1        1          2         3      3
 *    \        \        / \       /      /
 *     3        2      1   3     2      1
 *    /          \              /        \
 *   2            3            1          2
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= n <= 8 (output size is Catalan(n): 1430 for n = 8)
 * - May trees share subtrees? (on LeetCode yes; ask - if no, clone them)
 *
 * APPROACH 1 — Brute force (insert every permutation, dedupe)   O(n! * n) time
 * Every BST of 1..n is produced by inserting SOME permutation. Insert all n!
 * permutations, serialize each tree, keep the distinct ones. Huge redundancy.
 *
 * APPROACH 2 — Optimal (generate on a value range)   O(Catalan(n) * n) time
 * PROMISE: build(lo, hi) returns every BST containing exactly the values lo..hi.
 *   base: lo > hi -> [null] (one way to build an empty tree - NOT an empty list,
 *         or the loops below would produce nothing)
 *   step: for each root value r in lo..hi:
 *           for L of build(lo, r-1), for R of build(r+1, hi): new TreeNode(r, L, R)
 * Memoizing build by (lo, hi) shares identical subtrees between results.
 *
 * Dry run build(1,3), root 1: left build(1,0)=[null], right build(2,3) = [2->3, 3->2]
 *   -> 2 trees; root 2: [1] x [3] -> 1 tree; root 3: build(1,2) x [null] -> 2 trees. Total 5.
 *
 * EDGE CASES
 * - n = 0 -> [] on LeetCode (special-case it; build would return [null])
 * - shared subtrees: mutating one result would change others
 */

class TreeNode {
  constructor(val = 0, left = null, right = null) { this.val = val; this.left = left; this.right = right; }
}
function serialize(root) {
  return root === null ? '#' : `(${serialize(root.left)} ${root.val} ${serialize(root.right)})`;
}

function bruteForce(n) {
  const seen = new Map();
  const insert = (root, v) => {
    if (!root) return new TreeNode(v);
    if (v < root.val) root.left = insert(root.left, v); else root.right = insert(root.right, v);
    return root;
  };
  const used = new Array(n + 1).fill(false), perm = [];
  (function permute() {
    if (perm.length === n) {
      let root = null;
      for (const v of perm) root = insert(root, v);
      const key = serialize(root);
      if (!seen.has(key)) seen.set(key, root);
      return;
    }
    for (let v = 1; v <= n; v++) {
      if (used[v]) continue;
      used[v] = true; perm.push(v);
      permute();
      used[v] = false; perm.pop();
    }
  })();
  return n === 0 ? [] : [...seen.values()];
}

function optimal(n) {
  if (n === 0) return [];
  const memo = new Map();
  function build(lo, hi) {
    if (lo > hi) return [null];
    const key = lo * 100 + hi;
    if (memo.has(key)) return memo.get(key);
    const out = [];
    for (let r = lo; r <= hi; r++) {
      const lefts = build(lo, r - 1), rights = build(r + 1, hi);
      for (const L of lefts) for (const R of rights) out.push(new TreeNode(r, L, R));
    }
    memo.set(key, out);
    return out;
  }
  return build(1, n);
}

// ---------- tests ----------
const assert = require('assert');
const keys = (trees) => trees.map(serialize).sort();
assert.deepStrictEqual(optimal(0), []);
assert.deepStrictEqual(keys(optimal(1)), ['(# 1 #)']);
assert.strictEqual(optimal(3).length, 5);
assert.strictEqual(optimal(8).length, 1430);
assert.strictEqual(new Set(keys(optimal(5))).size, 42);  // all distinct
// every result is a valid BST over 1..n (inorder = 1..n)
const inorder = (t, out = []) => (t ? (inorder(t.left, out), out.push(t.val), inorder(t.right, out), out) : out);
for (const t of optimal(4)) assert.deepStrictEqual(inorder(t), [1, 2, 3, 4]);
for (let n = 0; n <= 6; n++) assert.deepStrictEqual(keys(optimal(n)), keys(bruteForce(n)));
console.log('✓ 11_unique_binary_search_trees_ii passed');

module.exports = { optimal, bruteForce, TreeNode, serialize };

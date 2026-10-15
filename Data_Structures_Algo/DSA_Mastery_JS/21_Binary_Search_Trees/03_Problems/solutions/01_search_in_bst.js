/**
 * 01. Search in a Binary Search Tree   (LeetCode 700 — Easy)
 *
 * PROBLEM
 * Given the root of a BST and a value, return the node whose value equals val
 * (the subtree rooted at that node). Return null if it does not exist.
 *
 * EXAMPLES
 * Input: root=[4,2,7,1,3], val=2   Output: [2,1,3]
 * Input: root=[4,2,7,1,3], val=5   Output: []
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Values unique? (yes)
 * - Return the node or just true/false? (the node)
 *
 * APPROACH 1 — Brute force (search like a plain binary tree)   O(n) time, O(h) space
 * Ignore the BST property and look at every node. Works but throws away the only
 * reason the tree is sorted.
 *
 * APPROACH 2 — Optimal (use the BST property)   O(h) time, O(1) space iterative
 * At each node: equal -> found; val smaller -> go left; bigger -> go right.
 * Exactly binary search, but on a tree. O(log n) balanced, O(n) skewed.
 *
 * Dry run on [4,2,7,1,3], val=3:
 *   at 4: 3 < 4 -> left
 *   at 2: 3 > 2 -> right
 *   at 3: found -> return node 3
 *
 * EDGE CASES
 * - empty tree -> null
 * - val at root
 * - val smaller than everything -> walk the left spine to null
 */

const { buildTree, toLevelOrderArray } = require('../../../20_Trees/02_Implementations/tree_node');

function bruteForce(root, val) {
  if (!root) return null;
  if (root.val === val) return root;
  return bruteForce(root.left, val) || bruteForce(root.right, val);
}

function optimal(root, val) {
  let current = root;
  while (current && current.val !== val) {
    current = val < current.val ? current.left : current.right;
  }
  return current;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(toLevelOrderArray(solve(buildTree([4, 2, 7, 1, 3]), 2)), [2, 1, 3]);
  assert.deepStrictEqual(toLevelOrderArray(solve(buildTree([4, 2, 7, 1, 3]), 5)), []);
  assert.deepStrictEqual(toLevelOrderArray(solve(buildTree([4, 2, 7, 1, 3]), 4)), [4, 2, 7, 1, 3]);
  assert.strictEqual(solve(buildTree([]), 1), null);
  assert.strictEqual(solve(buildTree([4, 2, 7, 1, 3]), 0), null);
  assert.strictEqual(solve(buildTree([4, 2, 7, 1, 3]), 7).val, 7);
}
console.log('✓ 01-search-in-bst passed');

module.exports = { optimal, bruteForce };

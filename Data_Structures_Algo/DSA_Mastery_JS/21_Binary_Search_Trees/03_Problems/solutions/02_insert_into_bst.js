/**
 * 02. Insert into a Binary Search Tree   (LeetCode 701 — Medium)
 *
 * PROBLEM
 * Insert val into the BST and return the root. The value does not exist yet.
 * Any valid result is accepted; we always insert as a NEW LEAF (no restructuring).
 *
 * EXAMPLES
 * Input: root=[4,2,7,1,3], val=5   Output: [4,2,7,1,3,5]
 * Input: root=[], val=5            Output: [5]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is val guaranteed not to be in the tree? (yes)
 * - Should the tree stay balanced? (no, not required)
 *
 * APPROACH 1 — Brute force (recursive)   O(h) time, O(h) space
 * insert(node, val): if node is null, return a new node; otherwise recurse into the
 * correct side and reattach: node.left = insert(node.left, val). Clean and short;
 * the "cost" is only the recursion stack.
 *
 * APPROACH 2 — Optimal (iterative, O(1) space)   O(h) time, O(1) space
 * Walk down with a pointer. When the side we want to go to is null, attach the new
 * node there and stop.
 *
 * Dry run on [4,2,7,1,3], val=5:
 *   at 4: 5 > 4, right exists -> go to 7
 *   at 7: 5 < 7, left is null -> 7.left = 5. done
 *
 * EDGE CASES
 * - empty tree -> the new node is the root
 * - val bigger than everything -> becomes the rightmost leaf
 */

const { TreeNode, buildTree, toLevelOrderArray } = require('../../../20_Trees/02_Implementations/tree_node');

function bruteForce(root, val) {
  if (!root) return new TreeNode(val);
  if (val < root.val) root.left = bruteForce(root.left, val);
  else root.right = bruteForce(root.right, val);
  return root;
}

function optimal(root, val) {
  const node = new TreeNode(val);
  if (!root) return node;
  let current = root;
  while (true) {
    if (val < current.val) {
      if (!current.left) { current.left = node; break; }
      current = current.left;
    } else {
      if (!current.right) { current.right = node; break; }
      current = current.right;
    }
  }
  return root;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(toLevelOrderArray(solve(buildTree([4, 2, 7, 1, 3]), 5)), [4, 2, 7, 1, 3, 5]);
  assert.deepStrictEqual(toLevelOrderArray(solve(buildTree([]), 5)), [5]);
  assert.deepStrictEqual(toLevelOrderArray(solve(buildTree([4, 2, 7, 1, 3]), 8)), [4, 2, 7, 1, 3, null, 8]);
  assert.deepStrictEqual(toLevelOrderArray(solve(buildTree([4, 2, 7, 1, 3]), 0)), [4, 2, 7, 1, 3, null, null, 0]);
  assert.deepStrictEqual(toLevelOrderArray(solve(buildTree([1]), 2)), [1, null, 2]);
  assert.deepStrictEqual(toLevelOrderArray(solve(buildTree([1]), -2)), [1, -2]);
}
console.log('✓ 02-insert-into-bst passed');

module.exports = { optimal, bruteForce };

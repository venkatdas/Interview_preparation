/**
 * 10. Trim a Binary Search Tree   (LeetCode 669 — Medium)
 *
 * PROBLEM
 * Given a BST and bounds [low, high], remove every node whose value is outside the
 * range, keeping the relative structure of the remaining nodes. Return the new root.
 *
 * EXAMPLES
 * Input: root=[1,0,2], low=1, high=2              Output: [1,null,2]
 * Input: root=[3,0,4,null,2,null,null,1], low=1, high=3   Output: [3,2,null,1]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Inclusive bounds? (yes)   - Values unique? (yes)
 * - Can the whole tree be removed? (yes -> return null)
 *
 * APPROACH 1 — Brute force (collect in-range values in order, rebuild a BST)   O(n) time, O(n) space
 * Inorder traversal, keep the values in range, then rebuild a BST from the sorted list
 * (middle element as root). Correct values, but the shape changes, which the problem
 * forbids ("keep the relative structure"). Shown to contrast with the real solution.
 *
 * APPROACH 2 — Optimal (recursive trim using the BST property)   O(n) time, O(h) space
 * trim(node):
 *   - null -> null
 *   - node.val < low  -> node AND its whole left subtree are too small; the answer is trim(node.right)
 *   - node.val > high -> node and its right subtree are too big; the answer is trim(node.left)
 *   - in range -> keep node; node.left = trim(node.left); node.right = trim(node.right)
 *
 * Dry run on [3,0,4,null,2,null,null,1], low=1, high=3:
 *   trim(3): in range. left = trim(0): 0 < 1 -> trim(0.right = 2): in range
 *              2.left = trim(1): in range, leaf -> 1 ; 2.right = null  -> returns 2
 *            right = trim(4): 4 > 3 -> trim(4.left = null) -> null
 *   result: 3 with left 2 (with left 1) -> [3,2,null,1]
 *
 * EDGE CASES
 * - everything outside the range -> null
 * - range contains everything -> unchanged
 * - root outside the range -> the root changes
 */

const { TreeNode, buildTree, toLevelOrderArray } = require('../../../20_Trees/02_Implementations/tree_node');

function bruteForce(root, low, high) {
  const values = [];
  (function inorder(node) {
    if (!node) return;
    inorder(node.left);
    if (node.val >= low && node.val <= high) values.push(node.val);
    inorder(node.right);
  })(root);
  function build(l, r) {
    if (l > r) return null;
    const mid = Math.floor((l + r) / 2);
    const node = new TreeNode(values[mid]);
    node.left = build(l, mid - 1);
    node.right = build(mid + 1, r);
    return node;
  }
  return build(0, values.length - 1);
}

function optimal(root, low, high) {
  if (!root) return null;
  if (root.val < low) return optimal(root.right, low, high);   // drop node + left subtree
  if (root.val > high) return optimal(root.left, low, high);   // drop node + right subtree
  root.left = optimal(root.left, low, high);
  root.right = optimal(root.right, low, high);
  return root;
}

// ---------- tests ----------
const assert = require('assert');
function inorder(node, out = []) {
  if (!node) return out;
  inorder(node.left, out); out.push(node.val); inorder(node.right, out);
  return out;
}
// the brute force keeps the right VALUES but not the shape; compare values for both
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(inorder(solve(buildTree([1, 0, 2]), 1, 2)), [1, 2]);
  assert.deepStrictEqual(inorder(solve(buildTree([3, 0, 4, null, 2, null, null, 1]), 1, 3)), [1, 2, 3]);
  assert.strictEqual(solve(buildTree([1]), 2, 3), null);
  assert.strictEqual(solve(buildTree([]), 0, 1), null);
  assert.deepStrictEqual(inorder(solve(buildTree([3, 1, 4, null, 2]), 0, 10)), [1, 2, 3, 4]);
}
// the optimal also keeps the shape
assert.deepStrictEqual(toLevelOrderArray(optimal(buildTree([1, 0, 2]), 1, 2)), [1, null, 2]);
assert.deepStrictEqual(toLevelOrderArray(optimal(buildTree([3, 0, 4, null, 2, null, null, 1]), 1, 3)), [3, 2, null, 1]);
assert.deepStrictEqual(toLevelOrderArray(optimal(buildTree([3, 1, 4, null, 2]), 3, 4)), [3, null, 4]);
console.log('✓ 10-trim-a-bst passed');

module.exports = { optimal, bruteForce };

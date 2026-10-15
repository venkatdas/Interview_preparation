/**
 * 05. Symmetric Tree   (LeetCode 101 — Easy)
 *
 * PROBLEM
 * Return true if the tree is a mirror of itself around its center
 * (the left subtree is the mirror image of the right subtree).
 *
 * EXAMPLES
 * Input: [1,2,2,3,4,4,3]          Output: true
 * Input: [1,2,2,null,3,null,3]    Output: false   Explanation: both 3s are right children
 * Input: [1]                      Output: true
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Empty tree symmetric? (yes)
 * - Do values matter or only shape? (both)
 *
 * APPROACH 1 — Brute force (invert a copy, compare with original)   O(n) time, O(n) space
 * Build a mirrored COPY of the tree, then check isSame(original, mirrorCopy).
 * Correct but allocates a whole second tree. (Reuses problems 03 and 04.)
 *
 * APPROACH 2 — Optimal (recursion on two nodes at once)   O(n) time, O(h) space
 * isMirror(a, b) is true when:
 *   - both null, or
 *   - both non-null, a.val === b.val,
 *     and a.left mirrors b.right, and a.right mirrors b.left   <- the crossed comparison
 * Start with isMirror(root.left, root.right).
 *
 * Dry run on [1,2,2,3,4,4,3]:
 *   isMirror(2, 2): equal -> isMirror(3, 3) and isMirror(4, 4)
 *     isMirror(3, 3): equal, children all null -> true
 *     isMirror(4, 4): true
 *   -> true
 *
 * EDGE CASES
 * - [] -> true, [1] -> true
 * - [1,2,2,null,3,null,3] -> false (same values, shape not mirrored)
 * - [1,2,3] -> false (values differ)
 */

const { TreeNode, buildTree } = require('../../../02_Implementations/tree_node');

function bruteForce(root) {
  function mirrorCopy(node) {
    if (!node) return null;
    return new TreeNode(node.val, mirrorCopy(node.right), mirrorCopy(node.left));
  }
  function isSame(a, b) {
    if (!a && !b) return true;
    if (!a || !b) return false;
    return a.val === b.val && isSame(a.left, b.left) && isSame(a.right, b.right);
  }
  return isSame(root, mirrorCopy(root));
}

function optimal(root) {
  function isMirror(a, b) {
    if (!a && !b) return true;
    if (!a || !b) return false;
    return a.val === b.val && isMirror(a.left, b.right) && isMirror(a.right, b.left);
  }
  if (!root) return true;
  return isMirror(root.left, root.right);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(buildTree([1, 2, 2, 3, 4, 4, 3])), true);
  assert.strictEqual(solve(buildTree([1, 2, 2, null, 3, null, 3])), false);
  assert.strictEqual(solve(buildTree([1])), true);
  assert.strictEqual(solve(buildTree([])), true);
  assert.strictEqual(solve(buildTree([1, 2, 3])), false);
  assert.strictEqual(solve(buildTree([1, 2, 2, 2, null, null, 2])), true);
}
console.log('✓ 05-symmetric-tree passed');

module.exports = { optimal, bruteForce };

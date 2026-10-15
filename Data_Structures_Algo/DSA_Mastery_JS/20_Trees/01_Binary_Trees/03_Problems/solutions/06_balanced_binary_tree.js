/**
 * 06. Balanced Binary Tree   (LeetCode 110 — Easy)
 *
 * PROBLEM
 * A tree is height-balanced if, for EVERY node, the heights of its left and right
 * subtrees differ by at most 1. Return true if the tree is balanced.
 *
 * EXAMPLES
 * Input: [3,9,20,null,null,15,7]        Output: true
 * Input: [1,2,2,3,3,null,null,4,4]      Output: false   Explanation: at node 2 (left), heights 2 vs 0
 * Input: []                             Output: true
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Only the root, or every node? (every node)
 * - Empty tree balanced? (yes)
 *
 * APPROACH 1 — Brute force (top-down)   O(n log n) best, O(n^2) worst; O(h) space
 * For each node, compute height(left) and height(right) from scratch, compare, then
 * recurse into both children. height() is O(subtree size), and it is recomputed for
 * every ancestor, so nodes near the bottom are counted many times.
 *
 * APPROACH 2 — Optimal (bottom-up, height with a failure signal)   O(n) time, O(h) space
 * One pass that returns the height of each subtree, but returns -1 (a sentinel) the
 * moment any subtree is unbalanced. A parent that sees -1 from a child passes -1 up
 * immediately. Each node is visited exactly once.
 *
 * Dry run on [1,2,2,3,3,null,null,4,4]:
 *   check(4) -> 1, check(4) -> 1, check(3 left) -> 2, check(3 right) -> 1
 *   check(2 left): |2 - 1| = 1 ok -> 3
 *   check(2 right): leaf -> 1
 *   check(1): |3 - 1| = 2 > 1 -> -1  => false
 *
 * EDGE CASES
 * - [] -> true, [1] -> true
 * - unbalanced deep inside but root looks fine -> must check every node
 */

const { buildTree } = require('../../../02_Implementations/tree_node');

function bruteForce(root) {
  function height(node) {
    if (!node) return 0;
    return 1 + Math.max(height(node.left), height(node.right));
  }
  if (!root) return true;
  if (Math.abs(height(root.left) - height(root.right)) > 1) return false;
  return bruteForce(root.left) && bruteForce(root.right);
}

function optimal(root) {
  // returns height, or -1 if the subtree is unbalanced
  function check(node) {
    if (!node) return 0;
    const leftHeight = check(node.left);
    if (leftHeight === -1) return -1;              // short-circuit
    const rightHeight = check(node.right);
    if (rightHeight === -1) return -1;
    if (Math.abs(leftHeight - rightHeight) > 1) return -1;
    return 1 + Math.max(leftHeight, rightHeight);
  }
  return check(root) !== -1;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(buildTree([3, 9, 20, null, null, 15, 7])), true);
  assert.strictEqual(solve(buildTree([1, 2, 2, 3, 3, null, null, 4, 4])), false);
  assert.strictEqual(solve(buildTree([])), true);
  assert.strictEqual(solve(buildTree([1])), true);
  assert.strictEqual(solve(buildTree([1, 2, null, 3])), false);           // left-skewed
  assert.strictEqual(solve(buildTree([1, 2, 3, 4, null, null, null])), true);
  assert.strictEqual(solve(buildTree([1, 2, 2, 3, null, null, 3, 4, null, null, 4])), false);
}
console.log('✓ 06-balanced-binary-tree passed');

module.exports = { optimal, bruteForce };

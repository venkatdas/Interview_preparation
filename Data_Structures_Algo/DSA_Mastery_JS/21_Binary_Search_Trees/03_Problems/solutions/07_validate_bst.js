/**
 * 07. Validate Binary Search Tree   (LeetCode 98 — Medium)
 *
 * PROBLEM
 * Return true if the tree is a valid BST: for EVERY node, all values in its left
 * subtree are strictly smaller and all values in its right subtree are strictly larger.
 *
 * EXAMPLES
 * Input: [2,1,3]             Output: true
 * Input: [5,1,4,null,null,3,6]   Output: false   Explanation: 3 is in the right subtree of 5 but 3 < 5
 * Input: [5,4,6,null,null,3,7]   Output: false   Explanation: 3 < 6 (ok for parent) but 3 < 5 (not ok for grandparent)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Are duplicates allowed? (no: strictly less / strictly greater)
 * - Value range? (can include the min/max int, so use -Infinity/Infinity or null bounds)
 *
 * THE CLASSIC BUG: checking only node.left.val < node.val < node.right.val (compare with
 * the parent only). The third example passes that check at every node but is NOT a BST,
 * because 3 violates the GRANDPARENT 5. Every node must respect ALL its ancestors.
 *
 * APPROACH 1 — Brute force (inorder must be strictly increasing)   O(n) time, O(n) space
 * Inorder traversal of a BST yields sorted ascending values. Collect the inorder into an
 * array and check that each value is strictly greater than the previous. Simple and
 * correct; costs an O(n) array (can be reduced to one "previous" variable).
 *
 * APPROACH 2 — Optimal (pass down a (low, high) range)   O(n) time, O(h) space
 * Each node must satisfy low < node.val < high. Going left tightens the HIGH bound to
 * node.val; going right tightens the LOW bound to node.val. The range carries the
 * constraints from ALL ancestors, which is exactly what the parent-only check misses.
 *
 * Dry run on [5,4,6,null,null,3,7]:
 *   valid(5, -inf, inf) ok
 *     valid(4, -inf, 5) ok; children null
 *     valid(6, 5, inf) ok
 *       valid(3, 5, 6): 3 < 5 -> FALSE   <- caught by the inherited low bound
 *
 * EDGE CASES
 * - empty tree -> true, single node -> true
 * - duplicates: [2,2] -> false
 * - values equal to the bounds: [1, 1] false, use strict comparisons
 */

const { buildTree } = require('../../../20_Trees/02_Implementations/tree_node');

function bruteForce(root) {
  const values = [];
  (function inorder(node) {
    if (!node) return;
    inorder(node.left); values.push(node.val); inorder(node.right);
  })(root);
  for (let i = 1; i < values.length; i++) {
    if (values[i] <= values[i - 1]) return false;
  }
  return true;
}

function optimal(root) {
  function valid(node, low, high) {
    if (!node) return true;
    if (node.val <= low || node.val >= high) return false;   // violates an ancestor
    return valid(node.left, low, node.val) && valid(node.right, node.val, high);
  }
  return valid(root, -Infinity, Infinity);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(buildTree([2, 1, 3])), true);
  assert.strictEqual(solve(buildTree([5, 1, 4, null, null, 3, 6])), false);
  assert.strictEqual(solve(buildTree([5, 4, 6, null, null, 3, 7])), false); // grandparent violation
  assert.strictEqual(solve(buildTree([])), true);
  assert.strictEqual(solve(buildTree([1])), true);
  assert.strictEqual(solve(buildTree([2, 2])), false);                      // duplicates
  assert.strictEqual(solve(buildTree([10, 5, 15, null, null, 6, 20])), false);
  assert.strictEqual(solve(buildTree([10, 5, 15, 2, 7, 12, 20])), true);
}
console.log('✓ 07-validate-bst passed');

module.exports = { optimal, bruteForce };

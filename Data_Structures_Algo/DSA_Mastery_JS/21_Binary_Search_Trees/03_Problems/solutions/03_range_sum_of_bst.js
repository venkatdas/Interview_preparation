/**
 * 03. Range Sum of BST   (LeetCode 938 — Easy)
 *
 * PROBLEM
 * Return the sum of all node values v with low <= v <= high.
 *
 * EXAMPLES
 * Input: root=[10,5,15,3,7,null,18], low=7, high=15   Output: 32   (7 + 10 + 15)
 * Input: root=[10,5,15,3,7,13,18,1,null,6], low=6, high=10   Output: 23   (6 + 7 + 10)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Inclusive bounds? (yes)
 * - Values unique? (yes)
 *
 * APPROACH 1 — Brute force (visit every node)   O(n) time, O(h) space
 * Traverse the whole tree, add values inside the range.
 *
 * APPROACH 2 — Optimal (prune with the BST property)   O(h + k) time, O(h) space
 * If node.val < low, nothing in its LEFT subtree can be in range -> skip left.
 * If node.val > high, skip the right subtree. Only the branches that could contain
 * in-range values are explored. k = number of nodes in range.
 *
 * Dry run on [10,5,15,3,7,null,18], low=7, high=15:
 *   10 in range (+10); explore both
 *     5 < 7: skip left (3), go right -> 7 in range (+7)
 *     15 in range (+15); 15 is not > high so we also look right -> 18 > 15, skip its right, left null
 *   = 32
 *
 * EDGE CASES
 * - empty tree -> 0
 * - range outside all values -> 0
 * - low == high -> single value or 0
 */

const { buildTree } = require('../../../20_Trees/02_Implementations/tree_node');

function bruteForce(root, low, high) {
  if (!root) return 0;
  const self = root.val >= low && root.val <= high ? root.val : 0;
  return self + bruteForce(root.left, low, high) + bruteForce(root.right, low, high);
}

function optimal(root, low, high) {
  if (!root) return 0;
  if (root.val < low) return optimal(root.right, low, high);    // everything left is even smaller
  if (root.val > high) return optimal(root.left, low, high);    // everything right is even bigger
  return root.val + optimal(root.left, low, high) + optimal(root.right, low, high);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(buildTree([10, 5, 15, 3, 7, null, 18]), 7, 15), 32);
  assert.strictEqual(solve(buildTree([10, 5, 15, 3, 7, 13, 18, 1, null, 6]), 6, 10), 23);
  assert.strictEqual(solve(buildTree([]), 1, 10), 0);
  assert.strictEqual(solve(buildTree([10, 5, 15]), 20, 30), 0);
  assert.strictEqual(solve(buildTree([10, 5, 15]), 10, 10), 10);
  assert.strictEqual(solve(buildTree([10, 5, 15, 3, 7, null, 18]), 0, 100), 58);
}
console.log('✓ 03-range-sum-of-bst passed');

module.exports = { optimal, bruteForce };

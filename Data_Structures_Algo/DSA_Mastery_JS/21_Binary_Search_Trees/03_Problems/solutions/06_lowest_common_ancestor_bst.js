/**
 * 06. Lowest Common Ancestor of a Binary Search Tree   (LeetCode 235 — Medium)
 *
 * PROBLEM
 * Given a BST and two nodes p and q in it, return their lowest common ancestor.
 *
 * EXAMPLES
 * Input: root=[6,2,8,0,4,7,9,null,null,3,5], p=2, q=8   Output: 6
 * Input: same, p=2, q=4                                  Output: 2   (a node is its own ancestor)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Both nodes exist? (yes)  - Values unique? (yes)
 * - Do we know it is a BST? (yes, that is the whole shortcut vs. problem 17 in 01-basics)
 *
 * APPROACH 1 — Brute force (generic binary tree LCA)   O(n) time, O(h) space
 * The "return what you found" recursion from the plain binary tree version. Correct,
 * but it may visit the whole tree.
 *
 * APPROACH 2 — Optimal (use ordering to pick a side)   O(h) time, O(1) space
 * Start at the root. If both p and q are smaller than the node, the LCA is in the left
 * subtree; if both are bigger, it is in the right subtree. Otherwise they are on
 * different sides (or one equals the node), so THIS node is the LCA.
 *
 * Dry run on root 6, p=2, q=4:
 *   at 6: both < 6 -> go left
 *   at 2: not both smaller, not both bigger (2 == p) -> answer 2
 *
 * EDGE CASES
 * - p is an ancestor of q
 * - p and q on opposite sides of the root -> root
 * - skewed tree -> O(n) walk but still O(1) space
 */

const { buildTree } = require('../../../20_Trees/02_Implementations/tree_node');

function bruteForce(root, p, q) {
  if (!root || root === p || root === q) return root;
  const left = bruteForce(root.left, p, q);
  const right = bruteForce(root.right, p, q);
  return left && right ? root : (left || right);
}

function optimal(root, p, q) {
  let current = root;
  while (current) {
    if (p.val < current.val && q.val < current.val) current = current.left;
    else if (p.val > current.val && q.val > current.val) current = current.right;
    else return current; // split point (or one of them is current)
  }
  return null;
}

// ---------- tests ----------
const assert = require('assert');
function find(root, val) {
  while (root && root.val !== val) root = val < root.val ? root.left : root.right;
  return root;
}
for (const solve of [bruteForce, optimal]) {
  const tree = buildTree([6, 2, 8, 0, 4, 7, 9, null, null, 3, 5]);
  assert.strictEqual(solve(tree, find(tree, 2), find(tree, 8)).val, 6);
  assert.strictEqual(solve(tree, find(tree, 2), find(tree, 4)).val, 2);
  assert.strictEqual(solve(tree, find(tree, 3), find(tree, 5)).val, 4);
  assert.strictEqual(solve(tree, find(tree, 0), find(tree, 5)).val, 2);
  assert.strictEqual(solve(tree, find(tree, 7), find(tree, 9)).val, 8);
  const two = buildTree([2, 1]);
  assert.strictEqual(solve(two, find(two, 2), find(two, 1)).val, 2);
}
console.log('✓ 06-lowest-common-ancestor-bst passed');

module.exports = { optimal, bruteForce };

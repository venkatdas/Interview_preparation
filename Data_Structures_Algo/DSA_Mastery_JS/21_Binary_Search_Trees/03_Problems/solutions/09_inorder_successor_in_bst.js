/**
 * 09. Inorder Successor in BST   (LeetCode 285 — Medium)
 *
 * PROBLEM
 * Given a BST and a node p in it, return the node with the smallest value GREATER than
 * p.val (the next node in inorder). Return null if p is the largest.
 *
 * EXAMPLES
 * Input: root=[2,1,3], p=1               Output: 2
 * Input: root=[5,3,6,2,4,null,null,1], p=6   Output: null
 * Input: root=[5,3,6,2,4,null,null,1], p=4   Output: 5   Explanation: 4 has no right subtree, so go UP
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Values unique? (yes)   - Do nodes have parent pointers? (no, in this version)
 * - Is p guaranteed to be in the tree? (yes)
 *
 * APPROACH 1 — Brute force (full inorder, find p, take the next)   O(n) time, O(n) space
 * Collect the inorder list of NODES, locate p, return the element after it.
 *
 * APPROACH 2 — Optimal (walk down from the root, remember the last left turn)   O(h) time, O(1) space
 * Search for p.val from the root. Every time we go LEFT (current.val > p.val), current is
 * a candidate successor: it is bigger than p, and we keep looking for a smaller one on
 * the left. Every time we go right, current is <= p so it cannot be the answer.
 * The last candidate when we fall off the tree is the successor.
 * (If p has a right subtree, the answer is the min of that subtree; the walk-from-root
 * version finds it too, with no special case.)
 *
 * Dry run on [5,3,6,2,4,null,null,1], p=4:
 *   at 5: 4 < 5 -> candidate 5, go left
 *   at 3: 4 > 3 -> go right
 *   at 4: 4 == 4 -> not bigger, go right -> null. Answer: 5
 *
 * EDGE CASES
 * - p is the max -> null
 * - p has a right subtree -> leftmost of it
 * - p is the root
 */

const { buildTree } = require('../../../20_Trees/02_Implementations/tree_node');

function bruteForce(root, p) {
  const nodes = [];
  (function inorder(node) {
    if (!node) return;
    inorder(node.left); nodes.push(node); inorder(node.right);
  })(root);
  const i = nodes.indexOf(p);
  return i + 1 < nodes.length ? nodes[i + 1] : null;
}

function optimal(root, p) {
  let successor = null;
  let current = root;
  while (current) {
    if (p.val < current.val) {
      successor = current;        // bigger than p: remember, then try to get closer
      current = current.left;
    } else {
      current = current.right;    // current <= p: the answer is on the right
    }
  }
  return successor;
}

// ---------- tests ----------
const assert = require('assert');
function find(root, val) {
  while (root && root.val !== val) root = val < root.val ? root.left : root.right;
  return root;
}
for (const solve of [bruteForce, optimal]) {
  const small = buildTree([2, 1, 3]);
  assert.strictEqual(solve(small, find(small, 1)).val, 2);
  const tree = buildTree([5, 3, 6, 2, 4, null, null, 1]);
  assert.strictEqual(solve(tree, find(tree, 6)), null);
  assert.strictEqual(solve(tree, find(tree, 4)).val, 5);
  assert.strictEqual(solve(tree, find(tree, 3)).val, 4);     // right subtree exists
  assert.strictEqual(solve(tree, find(tree, 1)).val, 2);
  assert.strictEqual(solve(tree, find(tree, 5)).val, 6);     // root
  const single = buildTree([1]);
  assert.strictEqual(solve(single, single), null);
}
console.log('✓ 09-inorder-successor-in-bst passed');

module.exports = { optimal, bruteForce };

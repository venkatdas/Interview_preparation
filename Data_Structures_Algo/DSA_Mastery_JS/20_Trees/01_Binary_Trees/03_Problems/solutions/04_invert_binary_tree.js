/**
 * 04. Invert Binary Tree   (LeetCode 226 — Easy)
 *
 * PROBLEM
 * Mirror the tree: swap the left and right child of EVERY node. Return the root.
 *
 * EXAMPLES
 * Input: [4,2,7,1,3,6,9]   Output: [4,7,2,9,6,3,1]
 * Input: [2,1,3]           Output: [2,3,1]
 * Input: []                Output: []
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - In place or return a new tree? (in place is fine, return the same root)
 * - Empty tree? (return null)
 *
 * APPROACH 1 — Brute force (BFS with a queue, swap as you go)   O(n) time, O(w) space
 * Visit every node with a queue; at each node swap its two children, then enqueue them.
 * Same big-O as the recursion; it is the iterative alternative and avoids deep recursion.
 *
 * APPROACH 2 — Optimal (recursion)   O(n) time, O(h) space
 * invert(node): invert the left subtree, invert the right subtree, then swap them.
 * (Order does not matter: swap first then recurse also works.)
 *
 * Dry run on [2,1,3]:
 *   invert(2): invert(1) -> leaf, returns 1; invert(3) -> leaf, returns 3
 *              swap -> 2.left = 3, 2.right = 1  => [2,3,1]
 *
 * EDGE CASES
 * - empty -> null
 * - single node -> unchanged
 * - node with only one child: the child moves to the other side
 */

const { buildTree, toLevelOrderArray } = require('../../../02_Implementations/tree_node');

function bruteForce(root) {
  if (!root) return null;
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    [node.left, node.right] = [node.right, node.left]; // swap children
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return root;
}

function optimal(root) {
  if (root === null) return null;
  const invertedLeft = optimal(root.left);
  const invertedRight = optimal(root.right);
  root.left = invertedRight;
  root.right = invertedLeft;
  return root;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(toLevelOrderArray(solve(buildTree([4, 2, 7, 1, 3, 6, 9]))), [4, 7, 2, 9, 6, 3, 1]);
  assert.deepStrictEqual(toLevelOrderArray(solve(buildTree([2, 1, 3]))), [2, 3, 1]);
  assert.deepStrictEqual(toLevelOrderArray(solve(buildTree([]))), []);
  assert.deepStrictEqual(toLevelOrderArray(solve(buildTree([1]))), [1]);
  assert.deepStrictEqual(toLevelOrderArray(solve(buildTree([1, 2]))), [1, null, 2]);
  // inverting twice gives the original back
  assert.deepStrictEqual(toLevelOrderArray(solve(solve(buildTree([1, 2, 3, null, 4])))), [1, 2, 3, null, 4]);
}
console.log('✓ 04-invert-binary-tree passed');

module.exports = { optimal, bruteForce };

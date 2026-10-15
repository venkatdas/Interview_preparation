/**
 * 15. Flatten Binary Tree to Linked List   (LeetCode 114 — Medium)
 *
 * PROBLEM
 * Flatten the tree IN PLACE into a "linked list" that uses the right pointers only
 * (every left is null), in PREORDER order.
 *
 * EXAMPLES
 * Input: [1,2,5,3,4,null,6]   Output: [1,null,2,null,3,null,4,null,5,null,6]
 * Input: []                   Output: []
 * Input: [0]                  Output: [0]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - In place, O(1) extra space required? (the follow-up asks for it)
 * - Preorder order? (yes)
 *
 * APPROACH 1 — Brute force (collect preorder, then rewire)   O(n) time, O(n) space
 * Do a preorder traversal into an array of nodes, then for i = 0..n-2 set
 * nodes[i].left = null, nodes[i].right = nodes[i+1]. Easy and correct, but uses O(n).
 *
 * APPROACH 2 — Optimal (Morris-style, O(1) extra space)   O(n) time, O(1) space
 * Walk down with `current`. If current has a left subtree:
 *   1. find the RIGHTMOST node of the left subtree (the last node of its preorder),
 *   2. attach current.right under that rightmost node's right,
 *   3. move the left subtree to the right, set left = null.
 * Then move current = current.right. Every node's left subtree gets spliced in
 * exactly once, so total work is O(n) even though step 1 walks down.
 *
 * Dry run on [1,2,5,3,4,null,6]:
 *   current=1: left=2, rightmost of {2,3,4} is 4; 4.right = 5; 1.right = 2; 1.left = null
 *              tree: 1 -> 2 (3, 4 -> (null, 5 -> (null, 6)))
 *   current=2: left=3, rightmost of {3} is 3; 3.right = 4; 2.right = 3; 2.left = null
 *   current=3: no left. current=4: no left. current=5: no left. current=6: done.
 *   1 -> 2 -> 3 -> 4 -> 5 -> 6
 *
 * EDGE CASES
 * - empty tree, single node
 * - already a right-only chain -> unchanged
 * - left-only chain -> becomes right-only chain
 */

const { buildTree, toLevelOrderArray } = require('../../../02_Implementations/tree_node');

function bruteForce(root) {
  const nodes = [];
  (function preorder(node) {
    if (!node) return;
    nodes.push(node);
    preorder(node.left);
    preorder(node.right);
  })(root);
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].left = null;
    nodes[i].right = i + 1 < nodes.length ? nodes[i + 1] : null;
  }
  return root;
}

function optimal(root) {
  let current = root;
  while (current) {
    if (current.left) {
      let rightmost = current.left;
      while (rightmost.right) rightmost = rightmost.right; // last node of left subtree's preorder
      rightmost.right = current.right;                     // hang the right subtree after it
      current.right = current.left;                        // left subtree comes next
      current.left = null;
    }
    current = current.right;
  }
  return root;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(toLevelOrderArray(solve(buildTree([1, 2, 5, 3, 4, null, 6]))),
    [1, null, 2, null, 3, null, 4, null, 5, null, 6]);
  assert.deepStrictEqual(toLevelOrderArray(solve(buildTree([]))), []);
  assert.deepStrictEqual(toLevelOrderArray(solve(buildTree([0]))), [0]);
  assert.deepStrictEqual(toLevelOrderArray(solve(buildTree([1, null, 2, null, 3]))), [1, null, 2, null, 3]);
  assert.deepStrictEqual(toLevelOrderArray(solve(buildTree([1, 2, null, 3]))), [1, null, 2, null, 3]);
  assert.deepStrictEqual(toLevelOrderArray(solve(buildTree([1, 2, 3]))), [1, null, 2, null, 3]);
}
console.log('✓ 15-flatten-binary-tree passed');

module.exports = { optimal, bruteForce };

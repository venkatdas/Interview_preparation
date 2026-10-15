/**
 * 08. Kth Smallest Element in a BST   (LeetCode 230 — Medium)
 *
 * PROBLEM
 * Return the kth smallest value (1-indexed) in a BST.
 *
 * EXAMPLES
 * Input: root=[3,1,4,null,2], k=1          Output: 1
 * Input: root=[5,3,6,2,4,null,null,1], k=3   Output: 3
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= k <= n guaranteed? (yes)
 * - Follow-up: what if the tree changes often and we query kth a lot?
 *   (store subtree sizes in each node -> O(h) per query)
 *
 * APPROACH 1 — Brute force (full inorder into an array)   O(n) time, O(n) space
 * Inorder gives sorted values; return values[k - 1]. Always visits all n nodes.
 *
 * APPROACH 2 — Optimal (iterative inorder, stop at the kth node)   O(h + k) time, O(h) space
 * Use the explicit-stack inorder traversal and count nodes as they are popped. Stop
 * as soon as the counter reaches k. No array, and we do not touch the rest of the tree.
 *
 * Dry run on [5,3,6,2,4,null,null,1], k=3:
 *   push 5, 3, 2, 1   (left spine)
 *   pop 1 -> count 1; pop 2 -> count 2; pop 3 -> count 3 == k -> return 3
 *
 * EDGE CASES
 * - k = 1 -> leftmost node; k = n -> rightmost node
 * - single node, k = 1
 * - skewed tree
 */

const { buildTree } = require('../../../20_Trees/02_Implementations/tree_node');

function bruteForce(root, k) {
  const values = [];
  (function inorder(node) {
    if (!node) return;
    inorder(node.left); values.push(node.val); inorder(node.right);
  })(root);
  return values[k - 1];
}

function optimal(root, k) {
  const stack = [];
  let current = root;
  let count = 0;
  while (current || stack.length) {
    while (current) {             // go as far left as possible
      stack.push(current);
      current = current.left;
    }
    current = stack.pop();        // next value in sorted order
    count++;
    if (count === k) return current.val;
    current = current.right;
  }
  return -1; // k out of range (not expected)
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(buildTree([3, 1, 4, null, 2]), 1), 1);
  assert.strictEqual(solve(buildTree([5, 3, 6, 2, 4, null, null, 1]), 3), 3);
  assert.strictEqual(solve(buildTree([5, 3, 6, 2, 4, null, null, 1]), 6), 6);
  assert.strictEqual(solve(buildTree([1]), 1), 1);
  assert.strictEqual(solve(buildTree([1, null, 2, null, 3]), 2), 2);   // right-skewed
  assert.strictEqual(solve(buildTree([3, 2, null, 1]), 3), 3);         // left-skewed
}
console.log('✓ 08-kth-smallest-in-bst passed');

module.exports = { optimal, bruteForce };

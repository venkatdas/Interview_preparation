/**
 * 12. Recover Binary Search Tree   (LeetCode 99 — Medium/Hard)
 *
 * PROBLEM
 * Exactly two nodes of a BST had their VALUES swapped by mistake. Fix the tree in place
 * without changing its structure.
 *
 * EXAMPLES
 * Input: [1,3,null,null,2]   Output: [3,1,null,null,2]   Explanation: 1 and 3 were swapped
 * Input: [3,1,4,null,null,2]   Output: [2,1,4,null,null,3]   Explanation: 2 and 3 were swapped
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Exactly two nodes swapped? (yes)
 * - Follow-up: O(1) space? (Morris traversal; the recursion stack version is O(h))
 *
 * Key insight: inorder of a correct BST is sorted. With two values swapped, the inorder
 * sequence has one or two "dips" (a place where prev > current):
 *   sorted:   1 2 3 4 5     swap 2 and 4:  1 4 3 2 5  -> dips at (4,3) and (3,2)
 *                            swap 2 and 3:  1 3 2 4 5  -> ONE dip at (3,2)
 * The first wrong node is the `prev` of the FIRST dip; the second wrong node is the
 * `current` of the LAST dip (which is the same dip when the swapped nodes are adjacent).
 *
 * APPROACH 1 — Brute force (inorder to array, sort, write back)   O(n log n) time, O(n) space
 * Collect inorder nodes, collect their values, sort the values, write them back in
 * inorder. Fixes ANY number of mistakes, but uses O(n) memory and sorting.
 *
 * APPROACH 2 — Optimal (one inorder pass tracking prev, first, second)   O(n) time, O(h) space
 * Inorder traversal keeping `prev`. Whenever prev.val > node.val:
 *   if first is not set -> first = prev     (left side of the first dip)
 *   second = node                           (right side of the latest dip)
 * At the end swap first.val and second.val.
 *
 * Dry run on [3,1,4,null,null,2]  (inorder: 1 3 2 4):
 *   prev=1, node=3: ok
 *   prev=3, node=2: dip -> first = 3, second = 2
 *   prev=2, node=4: ok
 *   swap 3 and 2 -> inorder 1 2 3 4
 *
 * EDGE CASES
 * - the swapped nodes are adjacent in inorder (only one dip)
 * - the root is one of the swapped nodes
 * - two-node tree
 */

const { buildTree, toLevelOrderArray } = require('../../../20_Trees/02_Implementations/tree_node');

function bruteForce(root) {
  const nodes = [];
  (function inorder(node) {
    if (!node) return;
    inorder(node.left); nodes.push(node); inorder(node.right);
  })(root);
  const sortedValues = nodes.map((n) => n.val).sort((a, b) => a - b);
  nodes.forEach((node, i) => { node.val = sortedValues[i]; });
  return root;
}

function optimal(root) {
  let prev = null;
  let first = null;
  let second = null;

  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    if (prev && prev.val > node.val) {    // a dip in the sorted order
      if (!first) first = prev;           // first dip: the bigger one on the left
      second = node;                      // latest dip: the smaller one on the right
    }
    prev = node;
    inorder(node.right);
  }

  inorder(root);
  [first.val, second.val] = [second.val, first.val];
  return root;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(toLevelOrderArray(solve(buildTree([1, 3, null, null, 2]))), [3, 1, null, null, 2]);
  assert.deepStrictEqual(toLevelOrderArray(solve(buildTree([3, 1, 4, null, null, 2]))), [2, 1, 4, null, null, 3]);
  assert.deepStrictEqual(toLevelOrderArray(solve(buildTree([1, 2]))), [2, 1]);                 // two-node tree
  // non-adjacent swap: correct tree [5,3,8,2,4,6,9], values 2 and 8 swapped -> two dips
  assert.deepStrictEqual(toLevelOrderArray(solve(buildTree([5, 3, 2, 8, 4, 6, 9]))), [5, 3, 8, 2, 4, 6, 9]);
  // root swapped with a leaf: correct [4,2,6,1,3,5,7], values 4 and 1 swapped
  assert.deepStrictEqual(toLevelOrderArray(solve(buildTree([1, 2, 6, 4, 3, 5, 7]))), [4, 2, 6, 1, 3, 5, 7]);
  // adjacent in inorder (one dip): correct [2,1,3], values 2 and 3 swapped
  assert.deepStrictEqual(toLevelOrderArray(solve(buildTree([3, 1, 2]))), [2, 1, 3]);
}
console.log('✓ 12-recover-bst passed');

module.exports = { optimal, bruteForce };

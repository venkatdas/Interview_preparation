/**
 * 18. Construct Binary Tree from Preorder and Inorder Traversal   (LeetCode 105 — Medium)
 *
 * PROBLEM
 * Given the preorder and inorder traversals of a tree with UNIQUE values, rebuild the tree.
 *
 * EXAMPLES
 * Input: preorder=[3,9,20,15,7], inorder=[9,3,15,20,7]   Output: [3,9,20,null,null,15,7]
 * Input: preorder=[-1], inorder=[-1]                     Output: [-1]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Values unique? (yes; otherwise the tree is not uniquely determined)
 * - Both arrays same length and valid? (yes)
 *
 * Key insight:
 *   preorder[0] is the ROOT. Find it in inorder: everything to its LEFT is the left
 *   subtree, everything to its RIGHT is the right subtree. The left subtree has k nodes,
 *   so preorder[1..k] is the left subtree's preorder and preorder[k+1..] is the right's.
 *   Recurse.
 *
 * APPROACH 1 — Brute force (slice arrays, indexOf)   O(n^2) time, O(n^2) space
 * Literally implement the insight with indexOf and slice at every level. indexOf is O(n)
 * and the slices copy arrays, so a skewed tree costs O(n^2).
 *
 * APPROACH 2 — Optimal (index map + pointers into the arrays)   O(n) time, O(n) space
 * 1. Build a Map value -> index in inorder (O(1) lookup instead of indexOf).
 * 2. Recurse on index ranges [inLeft, inRight] of inorder instead of copying arrays.
 * 3. Consume preorder from left to right with a single moving pointer `preIndex`:
 *    the order we create nodes (root, then whole left subtree, then right) IS preorder.
 *
 * Dry run on preorder=[3,9,20,15,7], inorder=[9,3,15,20,7]:
 *   build(0,4): root = pre[0]=3, at inorder index 1
 *     left = build(0,0): root = pre[1]=9, index 0; left build(0,-1) null; right build(1,0) null
 *     right = build(2,4): root = pre[2]=20, index 3
 *       left = build(2,2): 15.  right = build(4,4): 7.
 *
 * EDGE CASES
 * - empty arrays -> null
 * - single node
 * - fully left-skewed: preorder [1,2,3], inorder [3,2,1]
 * - fully right-skewed: preorder [1,2,3], inorder [1,2,3]
 */

const { TreeNode, toLevelOrderArray } = require('../../../02_Implementations/tree_node');

function bruteForce(preorder, inorder) {
  if (preorder.length === 0) return null;
  const rootVal = preorder[0];
  const root = new TreeNode(rootVal);
  const mid = inorder.indexOf(rootVal);         // size of the left subtree
  root.left = bruteForce(preorder.slice(1, mid + 1), inorder.slice(0, mid));
  root.right = bruteForce(preorder.slice(mid + 1), inorder.slice(mid + 1));
  return root;
}

function optimal(preorder, inorder) {
  const indexInInorder = new Map();
  inorder.forEach((val, i) => indexInInorder.set(val, i));
  let preIndex = 0;

  function build(inLeft, inRight) {
    if (inLeft > inRight) return null;          // empty range
    const rootVal = preorder[preIndex++];       // next unused preorder value is the root
    const root = new TreeNode(rootVal);
    const mid = indexInInorder.get(rootVal);
    root.left = build(inLeft, mid - 1);         // must build left first: preorder order
    root.right = build(mid + 1, inRight);
    return root;
  }
  return build(0, inorder.length - 1);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(toLevelOrderArray(solve([3, 9, 20, 15, 7], [9, 3, 15, 20, 7])), [3, 9, 20, null, null, 15, 7]);
  assert.deepStrictEqual(toLevelOrderArray(solve([-1], [-1])), [-1]);
  assert.deepStrictEqual(toLevelOrderArray(solve([], [])), []);
  assert.deepStrictEqual(toLevelOrderArray(solve([1, 2, 3], [3, 2, 1])), [1, 2, null, 3]);
  assert.deepStrictEqual(toLevelOrderArray(solve([1, 2, 3], [1, 2, 3])), [1, null, 2, null, 3]);
  assert.deepStrictEqual(toLevelOrderArray(solve([1, 2, 4, 5, 3, 6, 7], [4, 2, 5, 1, 6, 3, 7])), [1, 2, 3, 4, 5, 6, 7]);
}
console.log('✓ 18-construct-from-preorder-inorder passed');

module.exports = { optimal, bruteForce };

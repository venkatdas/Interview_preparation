/**
 * 04. Convert Sorted Array to Binary Search Tree   (LeetCode 108 — Easy)
 *
 * PROBLEM
 * Given an ascending sorted array, build a HEIGHT-BALANCED BST (depths of the two
 * subtrees of every node differ by at most 1).
 *
 * EXAMPLES
 * Input: [-10,-3,0,5,9]   Output: [0,-3,9,-10,null,5]   (other balanced answers accepted)
 * Input: [1,3]            Output: [3,1] or [1,null,3]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Strictly increasing, unique values? (yes)
 * - Any balanced answer OK? (yes; tests check inorder + balance, not exact shape)
 *
 * APPROACH 1 — Brute force (insert one by one into a BST)   O(n^2) time, O(n) space
 * Insert values in sorted order with a normal BST insert: each insert walks the whole
 * right spine, and the result is a LINKED LIST, not balanced. You would then need to
 * rebalance it. This shows why "just insert" is wrong here.
 *
 * APPROACH 2 — Optimal (pick the middle as root, recurse on halves)   O(n) time, O(log n) space
 * The middle element becomes the root, so both halves have (almost) the same size, which
 * is exactly what balanced means. Recurse on [left, mid-1] and [mid+1, right] using
 * indices (no slicing). Every element is visited once.
 *
 * Dry run on [-10,-3,0,5,9]:
 *   build(0,4): mid 2 -> root 0
 *     build(0,1): mid 0 -> -10; build(0,-1) null; build(1,1) -> -3 as right child
 *     build(3,4): mid 3 -> 5; right build(4,4) -> 9
 *   Result: [0,-10,5,null,-3,null,9]  (balanced; LeetCode's sample picks the other middle)
 *
 * EDGE CASES
 * - empty array -> null
 * - one element
 * - two elements (either one can be the root)
 */

const { TreeNode } = require('../../../20_Trees/02_Implementations/tree_node');

function bruteForce(nums) {
  // naive BST insert in sorted order (produces a right-skewed chain), then rebuild
  // balanced from its inorder. Shows the problem with plain inserts.
  let root = null;
  for (const val of nums) {
    const node = new TreeNode(val);
    if (!root) { root = node; continue; }
    let current = root;
    while (true) {
      if (val < current.val) {
        if (!current.left) { current.left = node; break; }
        current = current.left;
      } else {
        if (!current.right) { current.right = node; break; }
        current = current.right;
      }
    }
  }
  // now fix it: read inorder (already sorted) and rebuild balanced
  const sorted = [];
  (function walk(node) { if (!node) return; walk(node.left); sorted.push(node.val); walk(node.right); })(root);
  return optimal(sorted);
}

function optimal(nums) {
  function build(left, right) {
    if (left > right) return null;
    const mid = Math.floor((left + right) / 2);   // middle value = root of this range
    const node = new TreeNode(nums[mid]);
    node.left = build(left, mid - 1);
    node.right = build(mid + 1, right);
    return node;
  }
  return build(0, nums.length - 1);
}

// ---------- tests ----------
const assert = require('assert');
function inorder(node, out = []) {
  if (!node) return out;
  inorder(node.left, out); out.push(node.val); inorder(node.right, out);
  return out;
}
function balancedHeight(node) {             // height, or -1 if not balanced
  if (!node) return 0;
  const l = balancedHeight(node.left), r = balancedHeight(node.right);
  if (l === -1 || r === -1 || Math.abs(l - r) > 1) return -1;
  return 1 + Math.max(l, r);
}
for (const solve of [bruteForce, optimal]) {
  for (const nums of [[-10, -3, 0, 5, 9], [1, 3], [], [7], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]]) {
    const root = solve(nums);
    assert.deepStrictEqual(inorder(root), nums);          // it is a BST with the same values
    assert.notStrictEqual(balancedHeight(root), -1);      // and it is balanced
  }
  assert.strictEqual(solve([]), null);
  assert.strictEqual(balancedHeight(solve(Array.from({ length: 1023 }, (_, i) => i))), 10);
}
console.log('✓ 04-sorted-array-to-bst passed');

module.exports = { optimal, bruteForce };

/**
 * 11. Delete Node in a BST   (LeetCode 450 — Medium)
 *
 * PROBLEM
 * Delete the node with value key from the BST (if present) and return the root.
 * The result must still be a BST.
 *
 * EXAMPLES
 * Input: root=[5,3,6,2,4,null,7], key=3   Output: [5,4,6,2,null,null,7]  (or [5,2,6,null,4,null,7])
 * Input: root=[5,3,6,2,4,null,7], key=0   Output: unchanged
 * Input: root=[], key=0                   Output: []
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Values unique? (yes)   - Key may be absent? (yes -> return the tree unchanged)
 * - Either of the two valid answers accepted for the 2-children case? (yes)
 *
 * The three cases when we find the node:
 *   1. leaf              -> return null (parent's pointer becomes null)
 *   2. one child         -> return that child (it takes the node's place)
 *   3. two children      -> replace the node's value with its inorder SUCCESSOR (min of
 *                           the right subtree), then delete the successor from the right
 *                           subtree (the successor has no left child, so that is case 1 or 2)
 *
 * APPROACH 1 — Brute force (collect values, drop key, rebuild a balanced BST)   O(n) time, O(n) space
 * Inorder -> sorted values -> remove key -> build from the middle. Values are right but the
 * shape is thrown away and it costs O(n) for a single delete. Shows WHY we want the local fix.
 *
 * APPROACH 2 — Optimal (recursive delete with the three cases)   O(h) time, O(h) space
 * Recurse down to the node (like search), re-attach the returned subtree on the way up.
 *
 * Dry run on [5,3,6,2,4,null,7], key=3:
 *   delete(5): 3 < 5 -> 5.left = delete(3)
 *     delete(3): found, two children. successor = min(right subtree {4}) = 4
 *                3.val = 4; 3.right = delete(right, 4) -> 4 is a leaf -> null
 *                returns node (now 4, with left child 2)
 *   result [5,4,6,2,null,null,7]
 *
 * EDGE CASES
 * - deleting the root (all three cases possible at the root)
 * - key not in the tree
 * - deleting the last node -> null
 */

const { TreeNode, buildTree, toLevelOrderArray } = require('../../../20_Trees/02_Implementations/tree_node');

function bruteForce(root, key) {
  const values = [];
  (function inorder(node) {
    if (!node) return;
    inorder(node.left);
    if (node.val !== key) values.push(node.val);
    inorder(node.right);
  })(root);
  function build(l, r) {
    if (l > r) return null;
    const mid = Math.floor((l + r) / 2);
    const node = new TreeNode(values[mid]);
    node.left = build(l, mid - 1);
    node.right = build(mid + 1, r);
    return node;
  }
  return build(0, values.length - 1);
}

function optimal(root, key) {
  if (!root) return null;
  if (key < root.val) { root.left = optimal(root.left, key); return root; }
  if (key > root.val) { root.right = optimal(root.right, key); return root; }

  // found it
  if (!root.left) return root.right;           // case 1 (leaf) and case 2 (right child only)
  if (!root.right) return root.left;           // case 2 (left child only)

  // case 3: two children -> inorder successor
  let successor = root.right;
  while (successor.left) successor = successor.left;
  root.val = successor.val;                    // copy value, order stays valid
  root.right = optimal(root.right, successor.val); // remove the duplicate successor
  return root;
}

// ---------- tests ----------
const assert = require('assert');
function inorder(node, out = []) {
  if (!node) return out;
  inorder(node.left, out); out.push(node.val); inorder(node.right, out);
  return out;
}
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(inorder(solve(buildTree([5, 3, 6, 2, 4, null, 7]), 3)), [2, 4, 5, 6, 7]);
  assert.deepStrictEqual(inorder(solve(buildTree([5, 3, 6, 2, 4, null, 7]), 0)), [2, 3, 4, 5, 6, 7]);
  assert.strictEqual(solve(buildTree([]), 0), null);
  assert.strictEqual(solve(buildTree([1]), 1), null);
  assert.deepStrictEqual(inorder(solve(buildTree([5, 3, 6, 2, 4, null, 7]), 5)), [2, 3, 4, 6, 7]); // root, two children
  assert.deepStrictEqual(inorder(solve(buildTree([5, 3, 6, 2, 4, null, 7]), 6)), [2, 3, 4, 5, 7]); // one child
  assert.deepStrictEqual(inorder(solve(buildTree([5, 3, 6, 2, 4, null, 7]), 2)), [3, 4, 5, 6, 7]); // leaf
}
// the optimal keeps the shape of the untouched parts
assert.deepStrictEqual(toLevelOrderArray(optimal(buildTree([5, 3, 6, 2, 4, null, 7]), 3)), [5, 4, 6, 2, null, null, 7]);
assert.deepStrictEqual(toLevelOrderArray(optimal(buildTree([5, 3, 6, 2, 4, null, 7]), 5)), [6, 3, 7, 2, 4]);
console.log('✓ 11-delete-node-in-bst passed');

module.exports = { optimal, bruteForce };

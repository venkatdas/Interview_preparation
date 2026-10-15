/**
 * 17. Lowest Common Ancestor of a Binary Tree   (LeetCode 236 — Medium)
 *
 * PROBLEM
 * Given a binary tree and two nodes p and q that are both in the tree, return the
 * deepest node that has BOTH p and q in its subtree (a node counts as its own ancestor).
 *
 * EXAMPLES
 * Input: [3,5,1,6,2,0,8,null,null,7,4], p=5, q=1   Output: 3
 * Input: same tree, p=5, q=4                        Output: 5   Explanation: 5 is an ancestor of 4
 * Input: [1,2], p=1, q=2                            Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Are p and q guaranteed to exist in the tree? (yes; if not, you need an extra check)
 * - Are values unique? (yes, so we can compare by value or by reference)
 * - Is it a BST? (no; the BST version is simpler, see 21_Binary_Search_Trees)
 *
 * APPROACH 1 — Brute force (find both root-to-node paths, compare)   O(n) time, O(n) space
 * DFS to find the path from the root to p, and the path from the root to q (arrays of
 * nodes). Walk both paths together while they agree; the last common node is the LCA.
 * Two traversals plus two path arrays.
 *
 * APPROACH 2 — Optimal (one bottom-up recursion)   O(n) time, O(h) space
 * lca(node): returns p or q if node IS p or q (we stop looking below it), null if the
 * subtree contains neither, otherwise the LCA.
 *   left  = lca(node.left), right = lca(node.right)
 *   - both non-null -> p and q are on different sides -> node is the LCA
 *   - only one non-null -> pass it up (it is either the LCA already, or p/q alone)
 * Why stopping at p works: if q is below p, the other side returns null and p bubbles up.
 *
 * Dry run on [3,5,1,6,2,0,8,null,null,7,4], p=5, q=4:
 *   lca(3): lca(5) -> node is p, return 5 immediately
 *           lca(1) -> subtree {1,0,8} has neither -> null
 *           one side non-null -> return 5
 *
 * EDGE CASES
 * - p is an ancestor of q (answer is p)
 * - p and q are root and a leaf
 * - both are leaves far apart (answer is high up)
 */

const { buildTree } = require('../../../02_Implementations/tree_node');

function bruteForce(root, p, q) {
  function pathTo(node, target, path) {
    if (!node) return false;
    path.push(node);
    if (node === target) return true;
    if (pathTo(node.left, target, path) || pathTo(node.right, target, path)) return true;
    path.pop();
    return false;
  }
  const pathP = [];
  const pathQ = [];
  pathTo(root, p, pathP);
  pathTo(root, q, pathQ);
  let lca = null;
  for (let i = 0; i < pathP.length && i < pathQ.length && pathP[i] === pathQ[i]; i++) {
    lca = pathP[i];
  }
  return lca;
}

function optimal(root, p, q) {
  if (root === null || root === p || root === q) return root;
  const left = optimal(root.left, p, q);
  const right = optimal(root.right, p, q);
  if (left && right) return root;   // p and q found on different sides -> split point
  return left || right;             // whichever side found something (or null)
}

// ---------- tests ----------
const assert = require('assert');
function find(root, val) {
  if (!root) return null;
  if (root.val === val) return root;
  return find(root.left, val) || find(root.right, val);
}
for (const solve of [bruteForce, optimal]) {
  const tree = buildTree([3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]);
  assert.strictEqual(solve(tree, find(tree, 5), find(tree, 1)).val, 3);
  assert.strictEqual(solve(tree, find(tree, 5), find(tree, 4)).val, 5);
  assert.strictEqual(solve(tree, find(tree, 7), find(tree, 4)).val, 2);
  assert.strictEqual(solve(tree, find(tree, 6), find(tree, 8)).val, 3);
  assert.strictEqual(solve(tree, find(tree, 3), find(tree, 8)).val, 3);
  const small = buildTree([1, 2]);
  assert.strictEqual(solve(small, find(small, 1), find(small, 2)).val, 1);
  const single = buildTree([1]);
  assert.strictEqual(solve(single, single, single).val, 1);
}
console.log('✓ 17-lowest-common-ancestor passed');

module.exports = { optimal, bruteForce };

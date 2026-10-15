/**
 * 07. Diameter of Binary Tree   (LeetCode 543 — Easy)
 *
 * PROBLEM
 * The diameter is the number of EDGES on the longest path between any two nodes.
 * The path may or may not pass through the root.
 *
 * EXAMPLES
 * Input: [1,2,3,4,5]   Output: 3   Explanation: 4 -> 2 -> 1 -> 3 (or 5 -> 2 -> 1 -> 3)
 * Input: [1,2]         Output: 1
 * Input: [1]           Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Edges or nodes? (edges here; nodes = edges + 1)
 * - Must the path go through the root? (no, this is the whole point)
 *
 * APPROACH 1 — Brute force (height at every node)   O(n^2) worst, O(h) space
 * The longest path that "bends" at node X has length height(X.left) + height(X.right)
 * (heights in nodes). Compute that for every node, take the max. height() is recomputed
 * for every node, so this is O(n * h) = O(n^2) on a skewed tree.
 *
 * APPROACH 2 — Optimal (bottom-up, return height, record diameter)   O(n) time, O(h) space
 * One recursion that RETURNS the height of the subtree (in nodes), and as a side
 * effect UPDATES an outer variable `best` with leftHeight + rightHeight at each node.
 * This "return one thing, record another" trick is used again in Max Path Sum.
 *
 * Dry run on [1,2,3,4,5]:
 *   height(4) = 1, best = max(0, 0+0) = 0
 *   height(5) = 1
 *   height(2): left 1, right 1 -> best = 2, returns 2
 *   height(3) = 1
 *   height(1): left 2, right 1 -> best = 3, returns 3
 *   answer 3
 *
 * EDGE CASES
 * - [] -> 0, [1] -> 0
 * - longest path not through the root: [1,2,null,3,4,null,null,5,null,6] -> 4 (6-5-3-2-4), entirely in the left subtree
 */

const { buildTree } = require('../../../02_Implementations/tree_node');

function bruteForce(root) {
  function height(node) {
    if (!node) return 0;
    return 1 + Math.max(height(node.left), height(node.right));
  }
  if (!root) return 0;
  const throughRoot = height(root.left) + height(root.right);
  return Math.max(throughRoot, bruteForce(root.left), bruteForce(root.right));
}

function optimal(root) {
  let best = 0;
  function height(node) {
    if (!node) return 0;
    const leftHeight = height(node.left);
    const rightHeight = height(node.right);
    best = Math.max(best, leftHeight + rightHeight); // path bending at this node
    return 1 + Math.max(leftHeight, rightHeight);    // what the parent needs
  }
  height(root);
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(buildTree([1, 2, 3, 4, 5])), 3);
  assert.strictEqual(solve(buildTree([1, 2])), 1);
  assert.strictEqual(solve(buildTree([1])), 0);
  assert.strictEqual(solve(buildTree([])), 0);
  assert.strictEqual(solve(buildTree([1, 2, null, 3, 4, null, null, 5, null, 6])), 4); // 6-5-3-2-4
  assert.strictEqual(solve(buildTree([1, 2, 3, 4, 5, 6, 7])), 4);
}
console.log('✓ 07-diameter-of-binary-tree passed');

module.exports = { optimal, bruteForce };

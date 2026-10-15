/**
 * 13. Count Good Nodes in Binary Tree   (LeetCode 1448 — Medium)
 *
 * PROBLEM
 * A node X is "good" if on the path from the root to X there is no node with a value
 * GREATER than X.val (the root is always good). Count the good nodes.
 *
 * EXAMPLES
 * Input: [3,1,4,3,null,1,5]   Output: 4   Explanation: 3 (root), 4, 5, and the left 3 are good
 * Input: [3,3,null,4,2]       Output: 3   Explanation: 2 is not good because 3 > 2 above it
 * Input: [1]                  Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - "No node greater" means equal values are still good? (yes, >= counts as good)
 * - Negative values? (yes, so start the running max at -Infinity)
 *
 * APPROACH 1 — Brute force (for each node, walk its ancestors)   O(n * h) time, O(h) space
 * DFS while keeping the explicit list of ancestors on the path. At each node, scan the
 * whole path and check that none is greater. Scanning costs O(h) per node.
 *
 * APPROACH 2 — Optimal (top-down, pass the max so far)   O(n) time, O(h) space
 * The only thing a node needs to know about its ancestors is the biggest value among
 * them. Pass that single number down. If node.val >= maxSoFar, count it and the new
 * max becomes node.val.
 *
 * Dry run on [3,1,4,3,null,1,5]:
 *   dfs(3, max=-inf): 3 >= -inf good (1), max 3
 *     dfs(1, 3): 1 < 3 not good
 *       dfs(3, 3): 3 >= 3 good (2)
 *     dfs(4, 3): 4 >= 3 good (3), max 4
 *       dfs(1, 4): not good
 *       dfs(5, 4): good (4)
 *   -> 4
 *
 * EDGE CASES
 * - single node -> 1
 * - all equal values -> every node is good
 * - strictly decreasing path -> only the root is good
 */

const { buildTree } = require('../../../02_Implementations/tree_node');

function bruteForce(root) {
  let count = 0;
  const path = [];
  function dfs(node) {
    if (!node) return;
    if (path.every((ancestor) => ancestor <= node.val)) count++;
    path.push(node.val);
    dfs(node.left);
    dfs(node.right);
    path.pop(); // backtrack
  }
  dfs(root);
  return count;
}

function optimal(root) {
  function dfs(node, maxSoFar) {
    if (!node) return 0;
    const isGood = node.val >= maxSoFar ? 1 : 0;
    const newMax = Math.max(maxSoFar, node.val);
    return isGood + dfs(node.left, newMax) + dfs(node.right, newMax);
  }
  return dfs(root, -Infinity);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(buildTree([3, 1, 4, 3, null, 1, 5])), 4);
  assert.strictEqual(solve(buildTree([3, 3, null, 4, 2])), 3);
  assert.strictEqual(solve(buildTree([1])), 1);
  assert.strictEqual(solve(buildTree([])), 0);
  assert.strictEqual(solve(buildTree([5, 4, 3, 2, 1])), 1);         // decreasing
  assert.strictEqual(solve(buildTree([2, 2, 2, 2])), 4);            // all equal
  assert.strictEqual(solve(buildTree([-1, -5, -2, -10, 0])), 2);    // negatives: -1 and 0 (-2 < -1)
}
console.log('✓ 13-count-good-nodes passed');

module.exports = { optimal, bruteForce };

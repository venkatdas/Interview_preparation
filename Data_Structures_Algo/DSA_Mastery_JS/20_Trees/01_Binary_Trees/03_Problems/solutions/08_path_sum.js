/**
 * 08. Path Sum   (LeetCode 112 — Easy)
 *
 * PROBLEM
 * Given a tree and a targetSum, return true if there is a root-to-LEAF path whose
 * node values add up to targetSum.
 *
 * EXAMPLES
 * Input: [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum=22   Output: true   (5+4+11+2)
 * Input: [1,2,3], targetSum=5                                       Output: false
 * Input: [], targetSum=0                                            Output: false  (no path at all)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Must the path end at a leaf? (yes; [1,2], target 1 -> false because 1 is not a leaf)
 * - Negative values? (yes, so you cannot prune when the running sum exceeds the target)
 * - Empty tree -> false
 *
 * APPROACH 1 — Brute force (collect all root-to-leaf sums, then check)   O(n) time, O(n) space
 * DFS to every leaf, push the sum of the path into a list, then see if target is in it.
 * Same time complexity but stores every path sum and never stops early.
 *
 * APPROACH 2 — Optimal (top-down recursion with remaining target)   O(n) time, O(h) space
 * Pass "how much is still needed" down the tree. At a leaf, check if its value equals
 * the remaining amount. Return as soon as one side says true.
 *
 * Dry run on [5,4,8,11,null,13,4,7,2,null,null,null,1], target 22:
 *   hasPath(5, 22) -> hasPath(4, 17) -> hasPath(11, 13) -> hasPath(7, 2) leaf 7 != 2 false
 *                                                        -> hasPath(2, 2)  leaf 2 == 2 true
 *
 * EDGE CASES
 * - empty tree -> false even when target is 0
 * - node with one child is not a leaf ([1,2], target 1 -> false)
 * - negative numbers: [-2,null,-3], target -5 -> true
 */

const { buildTree } = require('../../../02_Implementations/tree_node');

function bruteForce(root, targetSum) {
  const leafSums = [];
  function collect(node, sumSoFar) {
    if (!node) return;
    sumSoFar += node.val;
    if (!node.left && !node.right) leafSums.push(sumSoFar);
    collect(node.left, sumSoFar);
    collect(node.right, sumSoFar);
  }
  collect(root, 0);
  return leafSums.includes(targetSum);
}

function optimal(root, targetSum) {
  if (root === null) return false;
  const remaining = targetSum - root.val;
  if (!root.left && !root.right) return remaining === 0; // leaf: did we land exactly?
  return optimal(root.left, remaining) || optimal(root.right, remaining);
}

// ---------- tests ----------
const assert = require('assert');
const big = [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1];
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(buildTree(big), 22), true);
  assert.strictEqual(solve(buildTree(big), 26), true);   // 5+8+13
  assert.strictEqual(solve(buildTree(big), 18), true);   // 5+8+4+1
  assert.strictEqual(solve(buildTree(big), 9), false);   // 5+4 = 9 but 4 is not a leaf
  assert.strictEqual(solve(buildTree([1, 2, 3]), 5), false);
  assert.strictEqual(solve(buildTree([]), 0), false);
  assert.strictEqual(solve(buildTree([1, 2]), 1), false);
  assert.strictEqual(solve(buildTree([-2, null, -3]), -5), true);
}
console.log('✓ 08-path-sum passed');

module.exports = { optimal, bruteForce };

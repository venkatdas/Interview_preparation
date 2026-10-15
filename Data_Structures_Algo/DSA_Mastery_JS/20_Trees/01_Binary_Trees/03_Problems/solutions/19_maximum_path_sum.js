/**
 * 19. Binary Tree Maximum Path Sum   (LeetCode 124 — Hard)
 *
 * PROBLEM
 * A path is any sequence of nodes where each pair of adjacent nodes is connected by an
 * edge, and a node appears at most once. It does NOT need to pass through the root or
 * end at a leaf. Return the maximum sum of node values over all paths (at least one node).
 *
 * EXAMPLES
 * Input: [1,2,3]                        Output: 6    Explanation: 2 -> 1 -> 3
 * Input: [-10,9,20,null,null,15,7]      Output: 42   Explanation: 15 -> 20 -> 7
 * Input: [-3]                           Output: -3   Explanation: must pick at least one node
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Negative values? (yes, that is what makes it hard: sometimes you should NOT extend a path)
 * - Can the path be a single node? (yes)
 *
 * APPROACH 1 — Brute force (for every node as the "top", compute best downward arms)   O(n^2), O(h)
 * For each node X, the best path with X as its highest point is
 *   X.val + bestDown(X.left) + bestDown(X.right), where bestDown(n) = max(0, n.val + max(bestDown children))
 * bestDown is recomputed from scratch for every node -> O(n^2) on skewed trees.
 *
 * APPROACH 2 — Optimal (one bottom-up pass, same shape as Diameter)   O(n) time, O(h) space
 * gain(node) RETURNS the best sum of a path that starts at node and goes DOWN one side
 * (what a parent could extend). A negative arm is worth less than nothing, so clamp
 * arms to >= 0 with Math.max(0, ...).
 * As a side effect, UPDATE best with node.val + leftGain + rightGain, the best path that
 * BENDS at this node (uses both arms; the parent can never use that, so it is not returned).
 *
 * Dry run on [-10,9,20,null,null,15,7]:
 *   gain(9)  = 9,  best = 9
 *   gain(15) = 15, best = 15
 *   gain(7)  = 7
 *   gain(20): arms 15, 7 -> best = 20+15+7 = 42; returns 20 + max(15,7) = 35
 *   gain(-10): arms 9, 35 -> best = max(42, -10+9+35=34) = 42; returns -10+35 = 25
 *   answer 42
 *
 * EDGE CASES
 * - single negative node -> that value (initialize best to -Infinity, not 0)
 * - all negative -> the largest single value
 * - best path entirely inside a subtree, not through the root
 */

const { buildTree } = require('../../../02_Implementations/tree_node');

function bruteForce(root) {
  function bestDown(node) {
    if (!node) return 0;
    return Math.max(0, node.val + Math.max(bestDown(node.left), bestDown(node.right)));
  }
  let best = -Infinity;
  (function visit(node) {
    if (!node) return;
    best = Math.max(best, node.val + bestDown(node.left) + bestDown(node.right));
    visit(node.left);
    visit(node.right);
  })(root);
  return best;
}

function optimal(root) {
  let best = -Infinity;
  function gain(node) {
    if (!node) return 0;
    const leftGain = Math.max(0, gain(node.left));   // ignore an arm if it would hurt
    const rightGain = Math.max(0, gain(node.right));
    best = Math.max(best, node.val + leftGain + rightGain); // path bending here
    return node.val + Math.max(leftGain, rightGain);        // one arm only for the parent
  }
  gain(root);
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(buildTree([1, 2, 3])), 6);
  assert.strictEqual(solve(buildTree([-10, 9, 20, null, null, 15, 7])), 42);
  assert.strictEqual(solve(buildTree([-3])), -3);
  assert.strictEqual(solve(buildTree([-2, -1, -3])), -1);          // all negative
  assert.strictEqual(solve(buildTree([2, -1])), 2);                 // skip the negative arm
  assert.strictEqual(solve(buildTree([1, -2, -3, 1, 3, -2, null, -1])), 3);
  assert.strictEqual(solve(buildTree([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1])), 48); // 7-11-4-5-8-13
}
console.log('✓ 19-maximum-path-sum passed');

module.exports = { optimal, bruteForce };

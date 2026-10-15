/**
 * 05. House Robber III   (LeetCode 337 — Medium)
 *
 * PROBLEM
 * Houses form a binary tree. A thief cannot rob two directly-connected houses
 * (parent and child) on the same night. Return the maximum money he can rob.
 *
 * EXAMPLES
 * Input: [3,2,3,null,3,null,1]   Output: 7   Explanation: 3 + 3 + 1 (root + two grandchildren)
 *        3
 *       / \
 *      2   3
 *       \   \
 *        3   1
 * Input: [3,4,5,1,3,null,1]      Output: 9   Explanation: 4 + 5
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Up to 10^4 nodes, values >= 0.
 * - Is an empty tree possible? (yes -> 0)
 *
 * APPROACH 1 — Brute force (plain recursion)   O(2^n) worst, O(h) space
 * rob(node) = max( node.val + rob(grandchildren...), rob(left) + rob(right) ).
 * Grandchildren are visited by both branches -> overlapping subproblems -> exponential.
 *
 * APPROACH 2 — Memo on the node object   O(n) time, O(n) space
 * Same recursion, but cache rob(node) in a Map keyed by the node object itself
 * (objects are valid Map keys, no string building needed).
 *
 * APPROACH 3 — Tree DP with a 2-value tuple (post-order)   O(n) time, O(h) space
 * STATE      for each node return [skip, take]:
 *              take = money if we ROB this node
 *              skip = money if we do NOT rob this node (children free to do anything)
 * RECURRENCE take = node.val + left.skip + right.skip
 *            skip = max(left.skip, left.take) + max(right.skip, right.take)
 * BASE CASES null node -> [0, 0]
 * ANSWER     max(root.skip, root.take)
 * Every node is visited once and does O(1) work. The `tabulation` version below does the
 * same post-order with an explicit stack (bottom-up order), no recursion.
 *
 * Dry run on the first example (post-order, leaves first):
 *   node 3 (left leaf, under 2) : [0, 3]
 *   node 2                     : take = 2 + 0 + 0 = 2, skip = max(0,3) + 0 = 3 -> [3, 2]
 *   node 1 (right leaf)        : [0, 1]
 *   node 3 (right child)       : take = 3 + 0 + 0 = 3, skip = 0 + max(0,1) = 1 -> [1, 3]
 *   root 3                     : take = 3 + 3 + 1 = 7, skip = max(3,2)+max(1,3) = 6 -> [6, 7]
 *   answer max(6, 7) = 7
 *
 * EDGE CASES
 * - empty tree -> 0
 * - single node -> its value
 * - straight line (linked-list tree) -> alternate levels
 */

// Build a binary tree from the LeetCode level-order array (null = missing).
function buildTree(values) {
  if (!values.length || values[0] === null) return null;
  const root = { val: values[0], left: null, right: null };
  const queue = [root];
  let i = 1;
  while (queue.length && i < values.length) {
    const node = queue.shift();
    if (i < values.length && values[i] !== null) {
      node.left = { val: values[i], left: null, right: null };
      queue.push(node.left);
    }
    i++;
    if (i < values.length && values[i] !== null) {
      node.right = { val: values[i], left: null, right: null };
      queue.push(node.right);
    }
    i++;
  }
  return root;
}

function bruteForce(root) {
  function rob(node) {
    if (!node) return 0;
    let withNode = node.val;
    if (node.left) withNode += rob(node.left.left) + rob(node.left.right);
    if (node.right) withNode += rob(node.right.left) + rob(node.right.right);
    const withoutNode = rob(node.left) + rob(node.right);
    return Math.max(withNode, withoutNode);
  }
  return rob(root);
}

function memo(root) {
  const cache = new Map(); // node object -> best from this subtree
  function rob(node) {
    if (!node) return 0;
    if (cache.has(node)) return cache.get(node);
    let withNode = node.val;
    if (node.left) withNode += rob(node.left.left) + rob(node.left.right);
    if (node.right) withNode += rob(node.right.left) + rob(node.right.right);
    const withoutNode = rob(node.left) + rob(node.right);
    const best = Math.max(withNode, withoutNode);
    cache.set(node, best);
    return best;
  }
  return rob(root);
}

function tabulation(root) {
  // Iterative post-order: collect nodes so that children come before parents, then
  // fill a Map node -> [skip, take] bottom-up. This IS the tree DP, just without recursion.
  if (!root) return 0;
  const order = [];
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    order.push(node);
    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }
  const best = new Map(); // node -> [skip, take]
  const get = (node) => (node ? best.get(node) : [0, 0]);
  for (let i = order.length - 1; i >= 0; i--) {       // reverse pre-order = children first
    const node = order[i];
    const [leftSkip, leftTake] = get(node.left);
    const [rightSkip, rightTake] = get(node.right);
    const take = node.val + leftSkip + rightSkip;
    const skip = Math.max(leftSkip, leftTake) + Math.max(rightSkip, rightTake);
    best.set(node, [skip, take]);
  }
  return Math.max(...best.get(root));
}

function optimized(root) {
  // Recursive post-order returning the tuple; O(h) space, the version to write in interviews.
  function dfs(node) {
    if (!node) return [0, 0];
    const [leftSkip, leftTake] = dfs(node.left);
    const [rightSkip, rightTake] = dfs(node.right);
    const take = node.val + leftSkip + rightSkip;
    const skip = Math.max(leftSkip, leftTake) + Math.max(rightSkip, rightTake);
    return [skip, take];
  }
  return Math.max(...dfs(root));
}

// ---------- tests ----------
const assert = require('assert');
const cases = [
  [[3, 2, 3, null, 3, null, 1], 7],
  [[3, 4, 5, 1, 3, null, 1], 9],
  [[], 0],
  [[5], 5],
  [[2, 1, 3, null, 4], 7],
  [[4, 1, null, 2, null, 3], 7],  // straight line 4-1-2-3 -> 4 + 3
];
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  for (const [values, expected] of cases) {
    assert.strictEqual(solve(buildTree(values)), expected);
  }
}
console.log('✓ 05-house-robber-iii passed');

module.exports = { bruteForce, memo, tabulation, optimized, buildTree };

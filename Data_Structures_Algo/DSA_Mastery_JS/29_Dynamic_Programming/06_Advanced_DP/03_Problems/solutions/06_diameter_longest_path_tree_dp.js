/**
 * 06. Diameter of Binary Tree / Longest Path (tree DP)   (LeetCode 543 — Easy, 1522 for N-ary)
 *
 * PROBLEM
 * The diameter of a tree is the number of edges on the longest path between any two
 * nodes. The path may or may not pass through the root. Return the diameter.
 *
 * EXAMPLES
 * Input: [1,2,3,4,5]   Output: 3   Explanation: path 4 -> 2 -> 1 -> 3 (or 5 -> 2 -> 1 -> 3)
 *        1
 *       / \
 *      2   3
 *     / \
 *    4   5
 * Input: [1,2]         Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Up to 10^4 nodes. Diameter counted in edges, not nodes (ask!).
 * - Empty tree -> 0.
 *
 * APPROACH 1 — Brute force (plain recursion)   O(n^2) time, O(h) space
 * diameter(node) = max( height(left) + height(right), diameter(left), diameter(right) )
 * where height is recomputed from scratch each time -> every node computes heights of
 * its whole subtree again -> O(n^2) on a skewed tree.
 *
 * APPROACH 2 — Memoise height   O(n) time, O(n) space
 * Same recursion but cache height(node) in a Map keyed by node. Now each height is
 * computed once.
 *
 * APPROACH 3 — Tree DP, one post-order pass   O(n) time, O(h) space
 * This is the general "longest path in a tree" trick: every node reports upward ONE
 * number (the longest downward path from it), and while doing so it updates a global
 * answer with the best path that BENDS at it.
 * STATE      down(node) = number of edges on the longest path going DOWN from node.
 * RECURRENCE down(node) = 1 + max(down(left), down(right))
 *            candidate answer at node = down(left) + down(right)
 *            (counts edges: left branch edges + right branch edges, each including the
 *            edge from node to the child because down(child) + 1 ... see code)
 * BASE CASES down(null) = -1 so that a leaf has down = 0 (no edges below it) and a
 *            null child contributes -1 + 1 = 0 edges.
 * ANSWER     max over all nodes of  leftEdges + rightEdges.
 *
 * Dry run on [1,2,3,4,5] (post-order):
 *   node 4 : leftEdges = 0, rightEdges = 0 -> through = 0, down = 0
 *   node 5 : same -> down = 0
 *   node 2 : leftEdges = down(4)+1 = 1, rightEdges = 1 -> through = 2, down = 1
 *   node 3 : through 0, down 0
 *   node 1 : leftEdges = down(2)+1 = 2, rightEdges = down(3)+1 = 1 -> through = 3, down = 2
 *   best seen = 3
 *
 * The `tabulation` version does the same post-order with an explicit stack.
 *
 * EDGE CASES
 * - empty tree -> 0, single node -> 0
 * - skewed tree (linked list) -> n - 1
 */

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
  function height(node) { // edges on the longest path down; null = -1 so a leaf is 0
    if (!node) return -1;
    return 1 + Math.max(height(node.left), height(node.right));
  }
  function diameter(node) {
    if (!node) return 0;
    const throughHere = height(node.left) + height(node.right) + 2;
    return Math.max(throughHere, diameter(node.left), diameter(node.right));
  }
  return diameter(root);
}

function memo(root) {
  const heightCache = new Map();
  function height(node) {
    if (!node) return -1;
    if (heightCache.has(node)) return heightCache.get(node);
    const h = 1 + Math.max(height(node.left), height(node.right));
    heightCache.set(node, h);
    return h;
  }
  function diameter(node) {
    if (!node) return 0;
    const throughHere = height(node.left) + height(node.right) + 2;
    return Math.max(throughHere, diameter(node.left), diameter(node.right));
  }
  return diameter(root);
}

function tabulation(root) {
  if (!root) return 0;
  // reverse pre-order gives children before parents
  const order = [];
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    order.push(node);
    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }
  const down = new Map(); // node -> longest downward path (edges)
  const edgesTo = (child) => (child ? down.get(child) + 1 : 0);
  let best = 0;
  for (let i = order.length - 1; i >= 0; i--) {
    const node = order[i];
    const leftEdges = edgesTo(node.left);
    const rightEdges = edgesTo(node.right);
    best = Math.max(best, leftEdges + rightEdges);
    down.set(node, Math.max(leftEdges, rightEdges));
  }
  return best;
}

function optimized(root) {
  // The interview version: one recursive post-order, global best, O(h) space.
  let best = 0;
  function down(node) {
    if (!node) return -1;
    const leftEdges = down(node.left) + 1;
    const rightEdges = down(node.right) + 1;
    best = Math.max(best, leftEdges + rightEdges); // path that bends at this node
    return Math.max(leftEdges, rightEdges);        // only one branch continues upward
  }
  down(root);
  return best;
}

// ---------- tests ----------
const assert = require('assert');
const cases = [
  [[1, 2, 3, 4, 5], 3],
  [[1, 2], 1],
  [[], 0],
  [[1], 0],
  [[1, 2, null, 3, null, 4], 3],               // skewed: 4 nodes -> 3 edges
  [[1, 2, 3, 4, 5, null, null, 6, null, null, 7], 4], // 6-4-2-5-7, does not pass the root
];
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  for (const [values, expected] of cases) {
    assert.strictEqual(solve(buildTree(values)), expected, `${solve.name} on ${values}`);
  }
}
console.log('✓ 06-diameter-longest-path-tree-dp passed');

module.exports = { bruteForce, memo, tabulation, optimized, buildTree };

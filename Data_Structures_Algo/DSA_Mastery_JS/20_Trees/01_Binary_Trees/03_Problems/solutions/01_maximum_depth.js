/**
 * 01. Maximum Depth of Binary Tree   (LeetCode 104 — Easy)
 *
 * PROBLEM
 * Return the number of nodes on the longest path from the root down to the farthest leaf.
 * (Depth counted in NODES here: a single node has depth 1, an empty tree has depth 0.)
 *
 * EXAMPLES
 * Input: [3,9,20,null,null,15,7]   Output: 3   Explanation: 3 -> 20 -> 15 (or 7)
 * Input: [1,null,2]                Output: 2
 * Input: []                        Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Depth in nodes or in edges? (nodes here; edges = nodes - 1)
 * - Can the tree be empty? (yes -> 0)
 * - How deep can it get? (if ~10^5 and skewed, recursion may overflow -> offer BFS)
 *
 * APPROACH 1 — Brute force (BFS, count levels)   O(n) time, O(w) space
 * Walk the tree level by level with a queue; each full level we finish adds 1.
 * Not slower in big-O, but more code than the recursion. It is the version to use
 * when recursion depth is a concern.
 *
 * APPROACH 2 — Optimal (bottom-up recursion)   O(n) time, O(h) space
 * Leap of faith: assume maxDepth(left) and maxDepth(right) are correct.
 * Then my depth = 1 + the bigger of the two. Base case: null -> 0.
 *
 * Dry run on [3,9,20,null,null,15,7]:
 *   depth(3) = 1 + max(depth(9), depth(20))
 *     depth(9)  = 1 + max(0, 0) = 1
 *     depth(20) = 1 + max(depth(15), depth(7)) = 1 + max(1, 1) = 2
 *   = 1 + max(1, 2) = 3
 *
 * EDGE CASES
 * - empty tree -> 0
 * - single node -> 1
 * - skewed tree (linked list shape) -> n
 */

const { buildTree } = require('../../../02_Implementations/tree_node');

function bruteForce(root) {
  if (!root) return 0;
  let depth = 0;
  const queue = [root];
  while (queue.length) {
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    depth++; // one whole level done
  }
  return depth;
}

function optimal(root) {
  if (root === null) return 0;
  return 1 + Math.max(optimal(root.left), optimal(root.right));
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(buildTree([3, 9, 20, null, null, 15, 7])), 3);
  assert.strictEqual(solve(buildTree([1, null, 2])), 2);
  assert.strictEqual(solve(buildTree([])), 0);
  assert.strictEqual(solve(buildTree([1])), 1);
  assert.strictEqual(solve(buildTree([1, 2, null, 3, null, 4])), 4); // left-skewed
  assert.strictEqual(solve(buildTree([1, 2, 3, 4, 5, 6, 7])), 3);    // perfect
}
console.log('✓ 01-maximum-depth passed');

module.exports = { optimal, bruteForce };

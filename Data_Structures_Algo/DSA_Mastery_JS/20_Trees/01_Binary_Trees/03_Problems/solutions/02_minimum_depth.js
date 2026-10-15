/**
 * 02. Minimum Depth of Binary Tree   (LeetCode 111 — Easy)
 *
 * PROBLEM
 * Return the number of nodes on the shortest path from the root down to the nearest LEAF.
 * A leaf is a node with no children.
 *
 * EXAMPLES
 * Input: [3,9,20,null,null,15,7]   Output: 2   Explanation: 3 -> 9 (9 is a leaf)
 * Input: [2,null,3,null,4]         Output: 3   Explanation: the only leaf is 4; 2 is NOT a leaf
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Does a node with ONE child count as a leaf? (no, this is the trap of the problem)
 * - Empty tree? (0)
 *
 * APPROACH 1 — Brute force (DFS recursion)   O(n) time, O(h) space
 * Like max depth, but take the MIN of the children... with a catch: if one child is
 * missing, we must NOT use its depth 0 (that would treat a non-leaf as a leaf).
 * So: if only one child exists, recurse only into it. Visits every node even if the
 * nearest leaf is at level 2.
 *
 * APPROACH 2 — Optimal (BFS, stop at first leaf)   O(n) worst, often much less; O(w) space
 * BFS visits nodes in order of depth, so the FIRST leaf we meet is at the minimum depth.
 * We can return immediately without looking at the rest of the tree.
 *
 * Dry run on [3,9,20,null,null,15,7]:
 *   level 1: [3]      not a leaf
 *   level 2: [9, 20]  9 has no children -> return 2
 *
 * EDGE CASES
 * - [] -> 0
 * - [1] -> 1
 * - node with one child: must skip the missing side ([2,null,3,null,4] -> 3, not 1)
 */

const { buildTree } = require('../../../02_Implementations/tree_node');

function bruteForce(root) {
  if (!root) return 0;
  if (!root.left) return 1 + bruteForce(root.right);   // only right exists
  if (!root.right) return 1 + bruteForce(root.left);   // only left exists
  return 1 + Math.min(bruteForce(root.left), bruteForce(root.right));
}

function optimal(root) {
  if (!root) return 0;
  const queue = [root];
  let depth = 1;
  while (queue.length) {
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      if (!node.left && !node.right) return depth; // first leaf found: shallowest possible
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    depth++;
  }
  return depth; // unreachable, every tree has a leaf
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(buildTree([3, 9, 20, null, null, 15, 7])), 2);
  assert.strictEqual(solve(buildTree([2, null, 3, null, 4])), 3);
  assert.strictEqual(solve(buildTree([])), 0);
  assert.strictEqual(solve(buildTree([1])), 1);
  assert.strictEqual(solve(buildTree([1, 2])), 2);
  assert.strictEqual(solve(buildTree([1, 2, 3, 4, null, null, null, 5])), 2); // leaf 3 at level 2
}
console.log('✓ 02-minimum-depth passed');

module.exports = { optimal, bruteForce };

/**
 * 10. Binary Tree Level Order Traversal   (LeetCode 102 — Medium)
 *
 * PROBLEM
 * Return the node values level by level, left to right, as an array of arrays.
 *
 * EXAMPLES
 * Input: [3,9,20,null,null,15,7]   Output: [[3],[9,20],[15,7]]
 * Input: [1]                       Output: [[1]]
 * Input: []                        Output: []
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Output shape: flat array or array of levels? (array of levels)
 * - Empty tree -> []
 *
 * APPROACH 1 — Brute force (DFS carrying the depth)   O(n) time, O(h) space
 * Recurse with (node, depth). When we reach a node at depth d, push its value into
 * result[d]. Because we always go left before right, each level fills left-to-right.
 * Same complexity; it is the "DFS can do BFS's job" trick, nice to know.
 *
 * APPROACH 2 — Optimal (BFS with a queue, level by level)   O(n) time, O(w) space
 * Push the root. While the queue is not empty: remember levelSize = queue.length,
 * pop exactly that many nodes (they are one level), collect their values, push their
 * children. The children form the next level. This is THE template for all BFS tree
 * problems (zigzag, right side view, min depth, averages...).
 *
 * Dry run on [3,9,20,null,null,15,7]:
 *   queue [3]        size 1 -> level [3],     push 9, 20
 *   queue [9,20]     size 2 -> level [9,20],  push 15, 7
 *   queue [15,7]     size 2 -> level [15,7]
 *   queue []         done
 *
 * EDGE CASES
 * - [] -> []
 * - skewed tree -> every level has one node
 * - queue.shift() is O(n) in JS; fine for interviews, or use a head index
 */

const { buildTree } = require('../../../02_Implementations/tree_node');

function bruteForce(root) {
  const levels = [];
  function dfs(node, depth) {
    if (!node) return;
    if (levels.length === depth) levels.push([]); // first time we reach this depth
    levels[depth].push(node.val);
    dfs(node.left, depth + 1);
    dfs(node.right, depth + 1);
  }
  dfs(root, 0);
  return levels;
}

function optimal(root) {
  const levels = [];
  if (!root) return levels;
  const queue = [root];
  while (queue.length) {
    const levelSize = queue.length; // snapshot: only these nodes belong to this level
    const level = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    levels.push(level);
  }
  return levels;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(buildTree([3, 9, 20, null, null, 15, 7])), [[3], [9, 20], [15, 7]]);
  assert.deepStrictEqual(solve(buildTree([1])), [[1]]);
  assert.deepStrictEqual(solve(buildTree([])), []);
  assert.deepStrictEqual(solve(buildTree([1, null, 2, null, 3])), [[1], [2], [3]]);
  assert.deepStrictEqual(solve(buildTree([1, 2, 3, 4, 5, 6, 7])), [[1], [2, 3], [4, 5, 6, 7]]);
  assert.deepStrictEqual(solve(buildTree([1, 2, 3, null, 4, 5])), [[1], [2, 3], [4, 5]]);
}
console.log('✓ 10-level-order-traversal passed');

module.exports = { optimal, bruteForce };

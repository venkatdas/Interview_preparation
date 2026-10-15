/**
 * 11. Binary Tree Zigzag Level Order Traversal   (LeetCode 103 — Medium)
 *
 * PROBLEM
 * Level order traversal, but alternate direction: level 0 left-to-right, level 1
 * right-to-left, level 2 left-to-right, and so on.
 *
 * EXAMPLES
 * Input: [3,9,20,null,null,15,7]   Output: [[3],[20,9],[15,7]]
 * Input: [1]                       Output: [[1]]
 * Input: []                        Output: []
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Does the first level go left-to-right? (yes)
 * - Empty tree -> []
 *
 * APPROACH 1 — Brute force (normal level order, then reverse odd levels)   O(n) time, O(w) space
 * Run the standard BFS, then call reverse() on every level with an odd index.
 * The reverse costs an extra pass over half the nodes. Honestly fine, and the
 * easiest to get right under pressure.
 *
 * APPROACH 2 — Optimal (BFS, fill the level array from the correct end)   O(n) time, O(w) space
 * Same BFS, but pre-size the level array and write each value at index i (left-to-right
 * levels) or levelSize - 1 - i (right-to-left levels). No reverse needed.
 * A deque with alternating push/unshift is the other common way.
 *
 * Dry run on [3,9,20,null,null,15,7]:
 *   level 0 (L->R): [3]
 *   level 1 (R->L): size 2; 9 goes to index 1, 20 goes to index 0 -> [20, 9]
 *   level 2 (L->R): [15, 7]
 *
 * EDGE CASES
 * - [] -> []
 * - single node
 * - levels with 1 node are unaffected by direction
 */

const { buildTree } = require('../../../02_Implementations/tree_node');

function bruteForce(root) {
  const levels = [];
  if (!root) return levels;
  const queue = [root];
  while (queue.length) {
    const levelSize = queue.length;
    const level = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    if (levels.length % 2 === 1) level.reverse(); // odd level index -> right-to-left
    levels.push(level);
  }
  return levels;
}

function optimal(root) {
  const levels = [];
  if (!root) return levels;
  const queue = [root];
  let leftToRight = true;
  while (queue.length) {
    const levelSize = queue.length;
    const level = new Array(levelSize);
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      const position = leftToRight ? i : levelSize - 1 - i; // write from the right end
      level[position] = node.val;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    levels.push(level);
    leftToRight = !leftToRight;
  }
  return levels;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(buildTree([3, 9, 20, null, null, 15, 7])), [[3], [20, 9], [15, 7]]);
  assert.deepStrictEqual(solve(buildTree([1])), [[1]]);
  assert.deepStrictEqual(solve(buildTree([])), []);
  assert.deepStrictEqual(solve(buildTree([1, 2, 3, 4, 5, 6, 7])), [[1], [3, 2], [4, 5, 6, 7]]);
  assert.deepStrictEqual(solve(buildTree([1, 2, 3, 4, null, null, 5])), [[1], [3, 2], [4, 5]]);
  assert.deepStrictEqual(solve(buildTree([1, 2, null, 3, null, 4])), [[1], [2], [3], [4]]);
}
console.log('✓ 11-zigzag-level-order passed');

module.exports = { optimal, bruteForce };

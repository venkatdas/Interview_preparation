/**
 * 12. Binary Tree Right Side View   (LeetCode 199 — Medium)
 *
 * PROBLEM
 * Standing on the right side of the tree, return the values you can see from top to
 * bottom: the LAST node of every level.
 *
 * EXAMPLES
 * Input: [1,2,3,null,5,null,4]   Output: [1,3,4]
 * Input: [1,2,3,4]               Output: [1,3,4]   Explanation: 4 is under 2 but it is the only node on level 2
 * Input: []                      Output: []
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is it "rightmost node per level", not "only right children"? (yes, see example 2)
 * - Empty tree -> []
 *
 * APPROACH 1 — Brute force (full level order, take the last of each level)   O(n) time, O(n) space
 * Build all the levels (problem 10), then map each level to its last element.
 * Stores every level when we only need one value per level.
 *
 * APPROACH 2 — Optimal (DFS right-first, record first node seen at each depth)   O(n) time, O(h) space
 * Visit node, then RIGHT child, then left child, carrying the depth. The first time
 * we arrive at a new depth, that node is the rightmost one (because we always went
 * right first), so push it. Later nodes at that depth are ignored.
 * (BFS keeping only the last node of each level is an equally good answer.)
 *
 * Dry run on [1,2,3,null,5,null,4]:
 *   dfs(1, d0): result.length 0 == 0 -> push 1
 *     dfs(3, d1): 1 == 1 -> push 3
 *       dfs(4, d2): 2 == 2 -> push 4
 *     dfs(2, d1): 2 != 1 -> skip
 *       dfs(5, d2): 3 != 2 -> skip
 *   -> [1, 3, 4]
 *
 * EDGE CASES
 * - [] -> []
 * - left-skewed tree: every node is visible
 * - a left node deeper than any right node must appear
 */

const { buildTree } = require('../../../02_Implementations/tree_node');

function bruteForce(root) {
  const levels = [];
  if (!root) return [];
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
    levels.push(level);
  }
  return levels.map((level) => level[level.length - 1]);
}

function optimal(root) {
  const result = [];
  function dfs(node, depth) {
    if (!node) return;
    if (result.length === depth) result.push(node.val); // first node reached at this depth
    dfs(node.right, depth + 1);                          // right FIRST
    dfs(node.left, depth + 1);
  }
  dfs(root, 0);
  return result;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(buildTree([1, 2, 3, null, 5, null, 4])), [1, 3, 4]);
  assert.deepStrictEqual(solve(buildTree([1, 2, 3, 4])), [1, 3, 4]);
  assert.deepStrictEqual(solve(buildTree([])), []);
  assert.deepStrictEqual(solve(buildTree([1])), [1]);
  assert.deepStrictEqual(solve(buildTree([1, 2, null, 3])), [1, 2, 3]);
  assert.deepStrictEqual(solve(buildTree([1, 2, 3, 4, null, null, null, 5])), [1, 3, 4, 5]);
}
console.log('✓ 12-right-side-view passed');

module.exports = { optimal, bruteForce };

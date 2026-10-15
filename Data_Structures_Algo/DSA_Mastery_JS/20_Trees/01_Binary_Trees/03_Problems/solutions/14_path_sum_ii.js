/**
 * 14. Path Sum II   (LeetCode 113 — Medium)
 *
 * PROBLEM
 * Return ALL root-to-leaf paths whose values sum to targetSum. Each path is an array
 * of node values from the root to the leaf.
 *
 * EXAMPLES
 * Input: [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum=22
 * Output: [[5,4,11,2],[5,8,4,5]]
 * Input: [1,2,3], targetSum=5   Output: []
 * Input: [1,2], targetSum=0     Output: []
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Order of the paths in the output? (any; tests sort)
 * - Negative values? (yes -> no pruning on "sum too big")
 * - Path must end at a leaf? (yes)
 *
 * APPROACH 1 — Brute force (copy the path at every step)   O(n * h) time, O(n * h) space
 * Recurse with a NEW array [...path, node.val] at each node. Simple, but copying the
 * path costs O(h) at every node.
 *
 * APPROACH 2 — Optimal (backtracking with one shared path)   O(n * h) worst output, O(h) extra
 * Keep one `path` array. Push node.val on the way down, recurse, pop on the way up.
 * When we hit a leaf with the right sum, push a COPY of path into the result
 * (the shared array will be mutated afterwards). The number of valid paths can be
 * large, so output size dominates; the extra work is O(h).
 *
 * Dry run on [1,2,3], target 3:
 *   path [1] -> left: path [1,2], leaf, 3 == 3 -> record [1,2]; pop -> [1]
 *            -> right: path [1,3], leaf, 4 != 3; pop -> [1]
 *   pop -> []   result [[1,2]]
 *
 * EDGE CASES
 * - empty tree -> []
 * - root alone equals target -> [[root]]
 * - node with one child is not a leaf
 */

const { buildTree } = require('../../../02_Implementations/tree_node');

function bruteForce(root, targetSum) {
  const result = [];
  function dfs(node, path, remaining) {
    if (!node) return;
    const newPath = [...path, node.val]; // fresh copy each time
    remaining -= node.val;
    if (!node.left && !node.right) {
      if (remaining === 0) result.push(newPath);
      return;
    }
    dfs(node.left, newPath, remaining);
    dfs(node.right, newPath, remaining);
  }
  dfs(root, [], targetSum);
  return result;
}

function optimal(root, targetSum) {
  const result = [];
  const path = [];
  function dfs(node, remaining) {
    if (!node) return;
    path.push(node.val);
    remaining -= node.val;
    if (!node.left && !node.right && remaining === 0) {
      result.push([...path]); // copy: path keeps changing after this
    }
    dfs(node.left, remaining);
    dfs(node.right, remaining);
    path.pop(); // backtrack: undo this node before returning to the parent
  }
  dfs(root, targetSum);
  return result;
}

// ---------- tests ----------
const assert = require('assert');
const sortPaths = (paths) => paths.map((p) => p.join(',')).sort();
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(
    sortPaths(solve(buildTree([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1]), 22)),
    sortPaths([[5, 4, 11, 2], [5, 8, 4, 5]])
  );
  assert.deepStrictEqual(solve(buildTree([1, 2, 3]), 5), []);
  assert.deepStrictEqual(solve(buildTree([1, 2]), 0), []);
  assert.deepStrictEqual(solve(buildTree([]), 0), []);
  assert.deepStrictEqual(solve(buildTree([1]), 1), [[1]]);
  assert.deepStrictEqual(solve(buildTree([1, 2]), 1), []);              // 1 is not a leaf
  assert.deepStrictEqual(solve(buildTree([1, -2, 3]), -1), [[1, -2]]);  // negative values
}
console.log('✓ 14-path-sum-ii passed');

module.exports = { optimal, bruteForce };

/**
 * 03. N-ary Tree Level Order Traversal   (LeetCode 429 — Medium)
 *
 * PROBLEM
 * Return the values level by level (array of arrays) of an N-ary tree.
 *
 * EXAMPLES
 * Input: [1,null,3,2,4,null,5,6]   Output: [[1],[3,2,4],[5,6]]
 * Input: []                        Output: []
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Order inside a level: left to right? (yes)
 *
 * APPROACH 1 — Brute force (DFS with depth)   O(n) time, O(h) space
 * Recurse with the depth; push node.val into levels[depth]. Preorder visits children
 * left to right, so each level fills in the right order.
 *
 * APPROACH 2 — Optimal (BFS, one level per loop)   O(n) time, O(w) space
 * Same template as the binary tree version, with `queue.push(...node.children)`.
 * Here the "current level" array is swapped for a "next level" array instead of using
 * queue.shift(), which avoids the O(n) shift cost in JS.
 *
 * Dry run on [1,null,3,2,4,null,5,6]:
 *   level [1]      -> next [3,2,4]
 *   level [3,2,4]  -> next [5,6]
 *   level [5,6]    -> next []  done
 *
 * EDGE CASES
 * - empty -> []
 * - single node -> [[1]]
 * - wide tree: one big second level
 */

const { buildNaryTree } = require('../../02_Implementations/n_ary_tree');

function bruteForce(root) {
  const levels = [];
  (function dfs(node, depth) {
    if (!node) return;
    if (levels.length === depth) levels.push([]);
    levels[depth].push(node.val);
    for (const child of node.children) dfs(child, depth + 1);
  })(root, 0);
  return levels;
}

function optimal(root) {
  const levels = [];
  if (!root) return levels;
  let current = [root];
  while (current.length) {
    levels.push(current.map((node) => node.val));
    const next = [];
    for (const node of current) next.push(...node.children);
    current = next;                  // the children ARE the next level
  }
  return levels;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(buildNaryTree([1, null, 3, 2, 4, null, 5, 6])), [[1], [3, 2, 4], [5, 6]]);
  assert.deepStrictEqual(solve(buildNaryTree([])), []);
  assert.deepStrictEqual(solve(buildNaryTree([1])), [[1]]);
  assert.deepStrictEqual(solve(buildNaryTree([1, null, 2, 3, 4, 5])), [[1], [2, 3, 4, 5]]);
  assert.deepStrictEqual(solve(buildNaryTree([1, null, 2, null, 3, null, 4])), [[1], [2], [3], [4]]);
  assert.deepStrictEqual(solve(buildNaryTree([1, null, 2, 3, null, 4, null, 5])), [[1], [2, 3], [4, 5]]);
}
console.log('✓ 03-n-ary-level-order passed');

module.exports = { optimal, bruteForce };

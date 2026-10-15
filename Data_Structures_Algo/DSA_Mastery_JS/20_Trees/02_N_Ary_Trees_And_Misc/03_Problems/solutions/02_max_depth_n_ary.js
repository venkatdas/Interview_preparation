/**
 * 02. Maximum Depth of N-ary Tree   (LeetCode 559 — Easy)
 *
 * PROBLEM
 * Return the number of nodes on the longest root-to-leaf path of an N-ary tree.
 *
 * EXAMPLES
 * Input: [1,null,3,2,4,null,5,6]   Output: 3
 * Input: [1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null,12,null,13,null,null,14]   Output: 5
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Depth in nodes? (yes)   - Empty tree -> 0
 *
 * APPROACH 1 — Brute force (BFS counting levels)   O(n) time, O(w) space
 * Level order; count how many levels you finish.
 *
 * APPROACH 2 — Optimal (recursion)   O(n) time, O(h) space
 * depth(node) = 1 + max over children of depth(child); a leaf (no children) is 1.
 * Same big-O as BFS, far less code. Note Math.max() of an empty list is -Infinity,
 * so handle the leaf case explicitly or start the max at 0.
 *
 * Dry run on [1,null,3,2,4,null,5,6]:
 *   depth(1) = 1 + max(depth(3), depth(2), depth(4)) = 1 + max(2, 1, 1) = 3
 *     depth(3) = 1 + max(depth(5)=1, depth(6)=1) = 2
 *
 * EDGE CASES
 * - [] -> 0, [1] -> 1
 * - a long chain -> n
 * - Math.max(...[]) === -Infinity trap
 */

const { buildNaryTree } = require('../../02_Implementations/n_ary_tree');

function bruteForce(root) {
  if (!root) return 0;
  let depth = 0;
  let queue = [root];
  while (queue.length) {
    const next = [];
    for (const node of queue) next.push(...node.children);
    queue = next;
    depth++;
  }
  return depth;
}

function optimal(root) {
  if (!root) return 0;
  let deepest = 0;                                   // not Math.max(...children) : empty -> -Infinity
  for (const child of root.children) deepest = Math.max(deepest, optimal(child));
  return 1 + deepest;
}

// ---------- tests ----------
const assert = require('assert');
const big = [1, null, 2, 3, 4, 5, null, null, 6, 7, null, 8, null, 9, 10, null, null, 11, null, 12, null, 13, null, null, 14];
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(buildNaryTree([1, null, 3, 2, 4, null, 5, 6])), 3);
  assert.strictEqual(solve(buildNaryTree(big)), 5);
  assert.strictEqual(solve(buildNaryTree([])), 0);
  assert.strictEqual(solve(buildNaryTree([1])), 1);
  assert.strictEqual(solve(buildNaryTree([1, null, 2, null, 3, null, 4])), 4);
  assert.strictEqual(solve(buildNaryTree([1, null, 2, 3, 4, 5])), 2);
}
console.log('✓ 02-max-depth-n-ary passed');

module.exports = { optimal, bruteForce };

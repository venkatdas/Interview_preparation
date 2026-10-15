/**
 * 01. N-ary Tree Preorder Traversal   (LeetCode 589 — Easy)
 *
 * PROBLEM
 * Return the preorder traversal (node, then each child left to right) of an N-ary tree.
 *
 * EXAMPLES
 * Input: [1,null,3,2,4,null,5,6]   Output: [1,3,5,6,2,4]
 * Input: []                        Output: []
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Children order matters? (yes, left to right as stored)
 * - Follow-up: iterative? (yes, see optimal)
 *
 * APPROACH 1 — Brute force (recursive)   O(n) time, O(h) space
 * visit node, then recurse into every child. Three lines. The "brute" label only
 * means it relies on the call stack; on very deep trees that can overflow.
 *
 * APPROACH 2 — Optimal (iterative with an explicit stack)   O(n) time, O(n) space
 * Push the root. Pop, visit, push children in REVERSE order so the first child is on
 * top of the stack and gets popped next.
 *
 * Dry run on [1,null,3,2,4,null,5,6]:
 *   stack [1]        pop 1 -> out [1],         push 4,2,3 -> stack [4,2,3]
 *   pop 3 -> [1,3]   push 6,5 -> [4,2,6,5]
 *   pop 5 -> [1,3,5]; pop 6 -> [1,3,5,6]; pop 2 -> [...,2]; pop 4 -> [1,3,5,6,2,4]
 *
 * EDGE CASES
 * - empty tree -> []
 * - single node
 * - node with many children / long chain
 */

const { buildNaryTree } = require('../../02_Implementations/n_ary_tree');

function bruteForce(root) {
  const out = [];
  (function dfs(node) {
    if (!node) return;
    out.push(node.val);
    for (const child of node.children) dfs(child);
  })(root);
  return out;
}

function optimal(root) {
  const out = [];
  if (!root) return out;
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    out.push(node.val);
    for (let i = node.children.length - 1; i >= 0; i--) stack.push(node.children[i]); // reverse
  }
  return out;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(buildNaryTree([1, null, 3, 2, 4, null, 5, 6])), [1, 3, 5, 6, 2, 4]);
  assert.deepStrictEqual(solve(buildNaryTree([])), []);
  assert.deepStrictEqual(solve(buildNaryTree([1])), [1]);
  assert.deepStrictEqual(solve(buildNaryTree([1, null, 2, null, 3, null, 4])), [1, 2, 3, 4]);   // chain
  assert.deepStrictEqual(solve(buildNaryTree([1, null, 2, 3, 4, 5])), [1, 2, 3, 4, 5]);        // wide
  assert.deepStrictEqual(solve(buildNaryTree([1, null, 2, 3, null, 4, null, 5])), [1, 2, 4, 3, 5]);
}
console.log('✓ 01-n-ary-preorder passed');

module.exports = { optimal, bruteForce };

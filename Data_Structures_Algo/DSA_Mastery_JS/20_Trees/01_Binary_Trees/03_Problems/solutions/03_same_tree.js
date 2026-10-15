/**
 * 03. Same Tree   (LeetCode 100 — Easy)
 *
 * PROBLEM
 * Given two binary trees, return true if they are structurally identical and every
 * matching node has the same value.
 *
 * EXAMPLES
 * Input: p=[1,2,3], q=[1,2,3]         Output: true
 * Input: p=[1,2],   q=[1,null,2]      Output: false   Explanation: same values, different shape
 * Input: p=[1,2,1], q=[1,1,2]         Output: false
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can both be empty? (yes -> true)
 * - Values can be duplicates / negative? (yes, we compare node by node anyway)
 *
 * APPROACH 1 — Brute force (serialize both, compare strings)   O(n + m) time, O(n + m) space
 * Turn each tree into a preorder string with '#' for null children, then compare.
 * The '#' markers make shape part of the string, so [1,2] and [1,null,2] differ.
 * Works, but builds two strings when we could stop at the first difference.
 *
 * APPROACH 2 — Optimal (parallel recursion)   O(min(n, m)) time, O(h) space
 * Walk both trees together:
 *   - both null -> true (two empty subtrees match)
 *   - one null  -> false (shape differs)
 *   - values differ -> false
 *   - else same(left, left) AND same(right, right)
 * Stops at the first mismatch.
 *
 * Dry run on p=[1,2], q=[1,null,2]:
 *   same(1, 1): values equal -> same(2, null) -> one is null -> false
 *
 * EDGE CASES
 * - both empty -> true
 * - one empty -> false
 * - same multiset of values but different structure -> false
 */

const { buildTree } = require('../../../02_Implementations/tree_node');

function bruteForce(p, q) {
  function serialize(node) {
    if (!node) return '#';
    return node.val + ',' + serialize(node.left) + ',' + serialize(node.right);
  }
  return serialize(p) === serialize(q);
}

function optimal(p, q) {
  if (p === null && q === null) return true;
  if (p === null || q === null) return false;
  if (p.val !== q.val) return false;
  return optimal(p.left, q.left) && optimal(p.right, q.right);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(buildTree([1, 2, 3]), buildTree([1, 2, 3])), true);
  assert.strictEqual(solve(buildTree([1, 2]), buildTree([1, null, 2])), false);
  assert.strictEqual(solve(buildTree([1, 2, 1]), buildTree([1, 1, 2])), false);
  assert.strictEqual(solve(buildTree([]), buildTree([])), true);
  assert.strictEqual(solve(buildTree([1]), buildTree([])), false);
  assert.strictEqual(solve(buildTree([-1, 0]), buildTree([-1, 0])), true);
  assert.strictEqual(solve(buildTree([1, 2, 3, 4]), buildTree([1, 2, 3, null, 4])), false);
}
console.log('✓ 03-same-tree passed');

module.exports = { optimal, bruteForce };

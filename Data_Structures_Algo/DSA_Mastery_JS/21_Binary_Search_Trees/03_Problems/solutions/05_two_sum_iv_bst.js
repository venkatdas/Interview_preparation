/**
 * 05. Two Sum IV - Input is a BST   (LeetCode 653 — Easy)
 *
 * PROBLEM
 * Given a BST and an integer k, return true if there are two DIFFERENT nodes whose
 * values add up to k.
 *
 * EXAMPLES
 * Input: root=[5,3,6,2,4,null,7], k=9    Output: true   (2 + 7, or 3 + 6)
 * Input: root=[5,3,6,2,4,null,7], k=28   Output: false
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can the same node be used twice? (no)
 * - Values unique? (yes)
 * - Negative values / k? (possible, the approaches do not care)
 *
 * APPROACH 1 — Brute force (hash set, any tree works)   O(n) time, O(n) space
 * Traverse; for each value v check if k - v is in the set, then add v. This is the
 * classic Two Sum and it ignores the BST property. Perfectly fine answer.
 *
 * APPROACH 2 — Optimal (inorder -> sorted array -> two pointers)   O(n) time, O(n) space
 * Inorder of a BST is sorted. On a sorted array, two pointers from both ends find a
 * pair in O(n). Same complexity as the set, but uses the structure, and the follow-up
 * (O(h) space) is done by replacing the array with two iterators: one inorder
 * (ascending) stack and one REVERSE inorder (descending) stack.
 *
 * Dry run on [5,3,6,2,4,null,7], k=9:
 *   sorted = [2,3,4,5,6,7]; left=0 (2), right=5 (7): 2+7 = 9 -> true
 *
 * EDGE CASES
 * - single node -> false (needs two different nodes)
 * - empty -> false
 * - k is double a value: [1,2,3], k=4 -> 1+3 true; [2], k=4 -> false
 */

const { buildTree } = require('../../../20_Trees/02_Implementations/tree_node');

function bruteForce(root, k) {
  const seen = new Set();
  function dfs(node) {
    if (!node) return false;
    if (seen.has(k - node.val)) return true;
    seen.add(node.val);
    return dfs(node.left) || dfs(node.right);
  }
  return dfs(root);
}

function optimal(root, k) {
  const sorted = [];
  (function inorder(node) {
    if (!node) return;
    inorder(node.left); sorted.push(node.val); inorder(node.right);
  })(root);

  let left = 0;
  let right = sorted.length - 1;
  while (left < right) {
    const sum = sorted[left] + sorted[right];
    if (sum === k) return true;
    if (sum < k) left++;        // need a bigger sum
    else right--;               // need a smaller sum
  }
  return false;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(buildTree([5, 3, 6, 2, 4, null, 7]), 9), true);
  assert.strictEqual(solve(buildTree([5, 3, 6, 2, 4, null, 7]), 28), false);
  assert.strictEqual(solve(buildTree([2]), 4), false);
  assert.strictEqual(solve(buildTree([]), 0), false);
  assert.strictEqual(solve(buildTree([2, 1, 3]), 4), true);
  assert.strictEqual(solve(buildTree([2, 1, 3]), 1), false);
  assert.strictEqual(solve(buildTree([0, -3, 4]), 1), true);
}
console.log('✓ 05-two-sum-iv-bst passed');

module.exports = { optimal, bruteForce };

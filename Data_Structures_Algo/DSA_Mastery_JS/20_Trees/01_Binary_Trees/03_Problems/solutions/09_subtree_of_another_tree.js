/**
 * 09. Subtree of Another Tree   (LeetCode 572 — Easy)
 *
 * PROBLEM
 * Given trees root and subRoot, return true if some node of root has a subtree that is
 * IDENTICAL (same structure, same values) to subRoot.
 *
 * EXAMPLES
 * Input: root=[3,4,5,1,2], subRoot=[4,1,2]                   Output: true
 * Input: root=[3,4,5,1,2,null,null,null,null,0], subRoot=[4,1,2]   Output: false
 *        Explanation: the node 4 now has an extra grandchild 0, so the subtrees differ
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is an empty subRoot a subtree of anything? (LeetCode says subRoot has >= 1 node)
 * - Does "subtree" mean the WHOLE subtree hanging from a node? (yes, not a partial match)
 *
 * APPROACH 1 — Brute force (try isSame at every node)   O(n * m) time, O(h) space
 * For every node of root, run isSame(node, subRoot). isSame costs up to O(m).
 * Perfectly acceptable in interviews; mention the string approach as the upgrade.
 *
 * APPROACH 2 — Optimal (serialize both, substring search)   O(n + m) time, O(n + m) space
 * Serialize each tree in preorder with '#' for null and a separator before each value.
 * Then subRoot is a subtree of root exactly when its string is a substring of root's.
 * Markers are essential: without '#', [12] vs [1,2] would be confused; without the
 * separator, value "12" would match inside "123". With a KMP search this is truly
 * linear; String.includes is good enough to say in an interview.
 *
 * Dry run on root=[3,4,5,1,2], subRoot=[4,1,2]:
 *   root    -> ",3,4,1,#,#,2,#,#,5,#,#"
 *   subRoot -> ",4,1,#,#,2,#,#"           found inside -> true
 * With the extra 0 under 2: root contains ",2,0,#,#,#" so ",2,#,#" is not found -> false
 *
 * EDGE CASES
 * - subRoot identical to root -> true
 * - subRoot larger than root -> false
 * - values with several digits / negatives: separators protect us
 */

const { buildTree } = require('../../../02_Implementations/tree_node');

function isSame(a, b) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return a.val === b.val && isSame(a.left, b.left) && isSame(a.right, b.right);
}

function bruteForce(root, subRoot) {
  if (!root) return subRoot === null;
  if (isSame(root, subRoot)) return true;
  return bruteForce(root.left, subRoot) || bruteForce(root.right, subRoot);
}

function optimal(root, subRoot) {
  function serialize(node) {
    if (!node) return ',#';
    return ',' + node.val + serialize(node.left) + serialize(node.right);
  }
  return serialize(root).includes(serialize(subRoot));
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(buildTree([3, 4, 5, 1, 2]), buildTree([4, 1, 2])), true);
  assert.strictEqual(solve(buildTree([3, 4, 5, 1, 2, null, null, null, null, 0]), buildTree([4, 1, 2])), false);
  assert.strictEqual(solve(buildTree([1]), buildTree([1])), true);
  assert.strictEqual(solve(buildTree([1]), buildTree([1, 2])), false);
  assert.strictEqual(solve(buildTree([12]), buildTree([2])), false);   // "12" must not match "2"
  assert.strictEqual(solve(buildTree([1, 2]), buildTree([12])), false);
  assert.strictEqual(solve(buildTree([3, 4, 5, 1, 2]), buildTree([3, 4, 5, 1, 2])), true);
}
console.log('✓ 09-subtree-of-another-tree passed');

module.exports = { optimal, bruteForce };

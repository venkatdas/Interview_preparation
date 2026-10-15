/**
 * 05. Find Duplicate Subtrees   (LeetCode 652 — Medium)
 *
 * PROBLEM
 * Given a binary tree, return the roots of all duplicate subtrees. Two subtrees are
 * duplicates if they have the same structure and the same values. Return one root per
 * distinct duplicate shape.
 *
 * EXAMPLES
 * Input: [1,2,3,4,null,2,4,null,null,4]   Output: roots of [2,4] and [4]
 * Input: [2,1,1]                          Output: root of [1]
 * Input: [2,2,2,3,null,3,null]            Output: roots of [2,3] and [3]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Return each duplicate shape only once? (yes)
 * - Order of the output? (any; tests compare serialized sets)
 * - Values can repeat and leaves of equal value count as duplicates? (yes)
 *
 * APPROACH 1 — Brute force (compare every pair of subtrees)   O(n^2) time, O(h) space
 * Collect all nodes; for each pair (i, j) run isSame. Keep one representative per shape.
 * n up to 5000 makes n^2 isSame calls too slow in practice.
 *
 * APPROACH 2 — Optimal (serialize every subtree, count with a map)   O(n^2) worst / O(n) typical
 * Postorder: build the string "val,leftString,rightString" (with '#' for null) for
 * each subtree and count it in a Map. The second time a string appears, record the
 * node. Each node's string is built from its children's strings, so the whole tree is
 * serialized once (strings can be long on skewed trees, hence O(n^2) worst case on
 * string length; assigning each distinct string an integer id makes it a true O(n)).
 *
 * Dry run on [2,1,1]:
 *   left 1  -> "1,#,#" count 1
 *   right 1 -> "1,#,#" count 2 -> record this node
 *   root    -> "2,1,#,#,1,#,#" count 1
 *   result: [node 1]
 *
 * EDGE CASES
 * - no duplicates -> []
 * - all leaves equal -> that leaf shape once
 * - duplicate shape appearing 3+ times -> still reported once (count === 2 check)
 */

const { buildTree } = require('../../../02_Implementations/tree_node');

function bruteForce(root) {
  const nodes = [];
  (function collect(node) { if (!node) return; nodes.push(node); collect(node.left); collect(node.right); })(root);
  function isSame(a, b) {
    if (!a && !b) return true;
    if (!a || !b) return false;
    return a.val === b.val && isSame(a.left, b.left) && isSame(a.right, b.right);
  }
  const result = [];
  const alreadyReported = new Set();
  for (let i = 0; i < nodes.length; i++) {
    if (alreadyReported.has(nodes[i])) continue;
    for (let j = i + 1; j < nodes.length; j++) {
      if (isSame(nodes[i], nodes[j])) {
        if (!result.includes(nodes[i])) result.push(nodes[i]);
        alreadyReported.add(nodes[j]);   // j is the same shape, do not report it again
      }
    }
  }
  return result;
}

function optimal(root) {
  const count = new Map();
  const result = [];
  function serialize(node) {
    if (!node) return '#';
    const key = node.val + ',' + serialize(node.left) + ',' + serialize(node.right);
    const seen = (count.get(key) || 0) + 1;
    count.set(key, seen);
    if (seen === 2) result.push(node);   // exactly on the second occurrence -> once per shape
    return key;
  }
  serialize(root);
  return result;
}

// ---------- tests ----------
const assert = require('assert');
function shapes(nodes) {
  // serialize each returned root so we can compare as a sorted list of strings
  function ser(n) { return n ? n.val + '(' + ser(n.left) + ',' + ser(n.right) + ')' : '#'; }
  return nodes.map(ser).sort();
}
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(shapes(solve(buildTree([1, 2, 3, 4, null, 2, 4, null, null, 4]))), ['2(4(#,#),#)', '4(#,#)']);
  assert.deepStrictEqual(shapes(solve(buildTree([2, 1, 1]))), ['1(#,#)']);
  assert.deepStrictEqual(shapes(solve(buildTree([2, 2, 2, 3, null, 3, null]))), ['2(3(#,#),#)', '3(#,#)']);
  assert.deepStrictEqual(solve(buildTree([1, 2, 3])), []);
  assert.deepStrictEqual(solve(buildTree([])), []);
  assert.deepStrictEqual(solve(buildTree([1])), []);
  assert.deepStrictEqual(shapes(solve(buildTree([0, 0, 0, 0, null, 0, null]))), ['0(#,#)', '0(0(#,#),#)']); // all zeros
}
console.log('✓ 05-find-duplicate-subtrees passed');

module.exports = { optimal, bruteForce };

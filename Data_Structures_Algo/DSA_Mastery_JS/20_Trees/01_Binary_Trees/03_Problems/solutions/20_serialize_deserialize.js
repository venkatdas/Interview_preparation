/**
 * 20. Serialize and Deserialize Binary Tree   (LeetCode 297 — Hard)
 *
 * PROBLEM
 * Design serialize(root) -> string and deserialize(string) -> root such that
 * deserialize(serialize(tree)) rebuilds the exact same tree. Any format is allowed.
 *
 * EXAMPLES
 * Input: [1,2,3,null,null,4,5]   serialize -> "1,2,#,#,3,4,#,#,5,#,#"  -> deserialize -> same tree
 * Input: []                      serialize -> "#"
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Values: integers only? negative? (yes, so use a separator, not fixed width)
 * - Any format OK, or must match LeetCode's level-order format? (any)
 *
 * APPROACH 1 — Brute force (level order with nulls, like LeetCode's own format)   O(n), O(n)
 * BFS, write "#" for every missing child; rebuild with a queue (exactly `buildTree` in
 * tree-node.js). Works, but the string contains a '#' for every missing child of every
 * node, and the rebuild logic with the queue is fiddlier to write from memory.
 *
 * APPROACH 2 — Optimal (preorder with '#' sentinels)   O(n) time, O(n) space
 * Serialize: preorder; write the value, recurse left, recurse right; write '#' for null.
 * Deserialize: read tokens left to right with one moving index. Each call consumes
 * exactly the tokens of one subtree: value, then its whole left subtree, then right.
 * The '#' markers tell the recursion when a subtree ends, which is why preorder alone
 * (without inorder) is enough here but NOT in problem 18.
 *
 * Dry run on "1,2,#,#,3,4,#,#,5,#,#":
 *   build: '1' -> node 1; left = build: '2' -> node 2; left '#' null; right '#' null
 *                         right = build: '3'; left build: '4', '#', '#'; right build: '5', '#', '#'
 *
 * EDGE CASES
 * - empty tree -> "#"
 * - negative and multi-digit values (separator handles them)
 * - deep skewed tree: recursion depth n
 */

const { TreeNode, buildTree, toLevelOrderArray } = require('../../../02_Implementations/tree_node');

// ---- Approach 1: level order ----
const bruteForce = {
  serialize(root) {
    if (!root) return '#';
    const out = [];
    const queue = [root];
    while (queue.length) {
      const node = queue.shift();
      if (!node) { out.push('#'); continue; }
      out.push(String(node.val));
      queue.push(node.left, node.right);
    }
    return out.join(',');
  },
  deserialize(data) {
    const tokens = data.split(',');
    if (tokens[0] === '#') return null;
    const root = new TreeNode(Number(tokens[0]));
    const queue = [root];
    let i = 1;
    while (queue.length && i < tokens.length) {
      const parent = queue.shift();
      if (tokens[i] !== '#') { parent.left = new TreeNode(Number(tokens[i])); queue.push(parent.left); }
      i++;
      if (tokens[i] !== '#') { parent.right = new TreeNode(Number(tokens[i])); queue.push(parent.right); }
      i++;
    }
    return root;
  },
};

// ---- Approach 2: preorder with sentinels ----
const optimal = {
  serialize(root) {
    const tokens = [];
    (function walk(node) {
      if (!node) { tokens.push('#'); return; }
      tokens.push(String(node.val));
      walk(node.left);
      walk(node.right);
    })(root);
    return tokens.join(',');
  },
  deserialize(data) {
    const tokens = data.split(',');
    let index = 0;
    function build() {
      const token = tokens[index++];          // consume one token
      if (token === '#') return null;
      const node = new TreeNode(Number(token));
      node.left = build();                    // left subtree's tokens come next
      node.right = build();
      return node;
    }
    return build();
  },
};

// ---------- tests ----------
const assert = require('assert');
const cases = [
  [1, 2, 3, null, null, 4, 5],
  [],
  [1],
  [-1, -20, 300],
  [1, 2, null, 3, null, 4],
  [1, null, 2, null, 3],
  [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1],
];
for (const codec of [bruteForce, optimal]) {
  for (const values of cases) {
    const text = codec.serialize(buildTree(values));
    assert.strictEqual(typeof text, 'string');
    assert.deepStrictEqual(toLevelOrderArray(codec.deserialize(text)), values);
  }
}
assert.strictEqual(optimal.serialize(buildTree([1, 2, 3, null, null, 4, 5])), '1,2,#,#,3,4,#,#,5,#,#');
assert.strictEqual(optimal.serialize(null), '#');
console.log('✓ 20-serialize-deserialize passed');

module.exports = { optimal, bruteForce };

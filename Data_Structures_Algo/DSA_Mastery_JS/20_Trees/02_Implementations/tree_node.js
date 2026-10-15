/**
 * Shared helpers for every problem in 20_Trees.
 *
 *   TreeNode                      - the node class LeetCode uses
 *   buildTree(levelOrderArray)    - [1, 2, 3, null, 4]  ->  tree   (LeetCode input format)
 *   toLevelOrderArray(root)       - tree  ->  [1, 2, 3, null, 4]   (for easy asserts)
 *
 * The array format is "level order with nulls":
 *   index 0 is the root, then each node's left and right children are listed in order,
 *   null means "no child here". Trailing nulls are trimmed.
 *
 *        1
 *       / \        ->  [1, 2, 3, null, 4]
 *      2   3
 *       \
 *        4
 *
 * Problems import it with:  const { TreeNode, buildTree, toLevelOrderArray } = require('../../tree-node');
 */

class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/**
 * Build a tree from a level-order array with nulls (LeetCode style).
 * A queue hands out the "next parent that still needs children" in order.
 */
function buildTree(values) {
  if (!values || values.length === 0 || values[0] === null) return null;

  const root = new TreeNode(values[0]);
  const queue = [root]; // parents waiting for children
  let index = 1;

  while (index < values.length) {
    const parent = queue.shift();

    // the next two values belong to this parent (left first, then right)
    if (index < values.length && values[index] !== null) {
      parent.left = new TreeNode(values[index]);
      queue.push(parent.left);
    }
    index++;

    if (index < values.length && values[index] !== null) {
      parent.right = new TreeNode(values[index]);
      queue.push(parent.right);
    }
    index++;
  }
  return root;
}

/**
 * Reverse of buildTree: BFS, writing null for missing children, then trim trailing nulls.
 */
function toLevelOrderArray(root) {
  if (!root) return [];

  const result = [];
  const queue = [root];

  while (queue.length) {
    const node = queue.shift();
    if (node === null) {
      result.push(null);
      continue;
    }
    result.push(node.val);
    queue.push(node.left);  // may be null, we still push so positions line up
    queue.push(node.right);
  }

  // trim trailing nulls
  while (result.length && result[result.length - 1] === null) result.pop();
  return result;
}

// ---------- self-test ----------
// Guarded so that problems which require() this file do not re-run the test.
if (require.main === module) {
const assert = require('assert');

assert.strictEqual(buildTree([]), null);
assert.strictEqual(buildTree([null]), null);

const single = buildTree([7]);
assert.strictEqual(single.val, 7);
assert.strictEqual(single.left, null);
assert.deepStrictEqual(toLevelOrderArray(single), [7]);

const tree = buildTree([1, 2, 3, null, 4]);
assert.strictEqual(tree.val, 1);
assert.strictEqual(tree.left.val, 2);
assert.strictEqual(tree.right.val, 3);
assert.strictEqual(tree.left.left, null);
assert.strictEqual(tree.left.right.val, 4);
assert.deepStrictEqual(toLevelOrderArray(tree), [1, 2, 3, null, 4]);

// round trip on a bigger, ragged tree
const input = [3, 9, 20, null, null, 15, 7, 1, null, null, 2];
assert.deepStrictEqual(toLevelOrderArray(buildTree(input)), input);

console.log('✓ tree-node.js self-test passed');
}

module.exports = { TreeNode, buildTree, toLevelOrderArray };

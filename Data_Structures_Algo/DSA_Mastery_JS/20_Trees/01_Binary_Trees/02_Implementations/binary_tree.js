/**
 * Binary tree toolbox in JavaScript.
 *
 * Traversals
 *   preorder / inorder / postorder   - recursive AND iterative (explicit stack)
 *   levelOrder                       - BFS with a queue, returns array of levels
 *   morrisInorder                    - O(1) extra space inorder (threaded tree trick)
 * Measurements
 *   height (edges), size (nodes), countLeaves
 * Transformations / checks
 *   mirror (invert in place), isSame, serialize / deserialize (preorder with '#')
 *
 * All functions are O(n) time. Recursive ones use O(h) stack space (h = height).
 * BFS uses O(w) queue space (w = widest level).
 */

const { TreeNode, buildTree, toLevelOrderArray } = require('../../02_Implementations/tree_node');

// ---------- 1. Depth-first traversals, recursive ----------
// The three orders differ ONLY in where "visit node" sits relative to the two recursive calls.

function preorder(root, out = []) {        // node, left, right
  if (!root) return out;
  out.push(root.val);
  preorder(root.left, out);
  preorder(root.right, out);
  return out;
}

function inorder(root, out = []) {         // left, node, right  (sorted order for a BST)
  if (!root) return out;
  inorder(root.left, out);
  out.push(root.val);
  inorder(root.right, out);
  return out;
}

function postorder(root, out = []) {       // left, right, node  (children before parent)
  if (!root) return out;
  postorder(root.left, out);
  postorder(root.right, out);
  out.push(root.val);
  return out;
}

// ---------- 2. Depth-first traversals, iterative (explicit stack) ----------

// Preorder: pop, visit, push RIGHT then LEFT (so left is popped first).
function preorderIterative(root) {
  const out = [];
  if (!root) return out;
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    out.push(node.val);
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
  return out;
}

// Inorder: slide down the left spine pushing nodes, pop, visit, then go right.
function inorderIterative(root) {
  const out = [];
  const stack = [];
  let current = root;
  while (current || stack.length) {
    while (current) {                   // go as far left as possible
      stack.push(current);
      current = current.left;
    }
    current = stack.pop();              // leftmost unvisited node
    out.push(current.val);
    current = current.right;            // now its right subtree
  }
  return out;
}

// Postorder: do "node, right, left" with a stack (a mirrored preorder), then reverse.
function postorderIterative(root) {
  const out = [];
  if (!root) return out;
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    out.push(node.val);
    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }
  return out.reverse();
}

// ---------- 3. Breadth-first (level order) ----------
// Snapshot queue.length at the start of each level so we know where the level ends.
function levelOrder(root) {
  const levels = [];
  if (!root) return levels;
  const queue = [root];
  while (queue.length) {
    const levelSize = queue.length;
    const level = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    levels.push(level);
  }
  return levels;
}

// ---------- 4. Morris inorder: O(1) extra space ----------
// Temporarily link the rightmost node of the left subtree ("predecessor") back to the
// current node, so we can return to it without a stack. Remove the link when done.
function morrisInorder(root) {
  const out = [];
  let current = root;
  while (current) {
    if (!current.left) {
      out.push(current.val);
      current = current.right;
    } else {
      // find inorder predecessor: rightmost node in left subtree
      let predecessor = current.left;
      while (predecessor.right && predecessor.right !== current) {
        predecessor = predecessor.right;
      }
      if (!predecessor.right) {
        predecessor.right = current;      // create thread, go left
        current = current.left;
      } else {
        predecessor.right = null;         // thread exists: left side done, remove it
        out.push(current.val);
        current = current.right;
      }
    }
  }
  return out;
}

// ---------- 5. Measurements ----------

// height in EDGES: empty tree = -1, single node = 0
function height(root) {
  if (!root) return -1;
  return 1 + Math.max(height(root.left), height(root.right));
}

function size(root) {
  if (!root) return 0;
  return 1 + size(root.left) + size(root.right);
}

function countLeaves(root) {
  if (!root) return 0;
  if (!root.left && !root.right) return 1;
  return countLeaves(root.left) + countLeaves(root.right);
}

// ---------- 6. Transformations / checks ----------

// Swap left and right at every node (in place). Returns root for convenience.
function mirror(root) {
  if (!root) return null;
  [root.left, root.right] = [mirror(root.right), mirror(root.left)];
  return root;
}

function isSame(a, b) {
  if (!a && !b) return true;            // both empty
  if (!a || !b) return false;           // one empty
  return a.val === b.val && isSame(a.left, b.left) && isSame(a.right, b.right);
}

// Preorder with '#' for null. Preorder is chosen because the root comes first,
// which makes deserialization a simple "consume next token" recursion.
function serialize(root) {
  const tokens = [];
  (function walk(node) {
    if (!node) { tokens.push('#'); return; }
    tokens.push(String(node.val));
    walk(node.left);
    walk(node.right);
  })(root);
  return tokens.join(',');
}

function deserialize(data) {
  const tokens = data.split(',');
  let index = 0;
  function build() {
    const token = tokens[index++];
    if (token === '#') return null;
    const node = new TreeNode(Number(token));
    node.left = build();                // tokens for the left subtree come next
    node.right = build();               // then the right subtree
    return node;
  }
  return build();
}

// ---------- self-test ----------
const assert = require('assert');

//        1
//       / \
//      2   3
//     / \   \
//    4   5   6
const root = buildTree([1, 2, 3, 4, 5, null, 6]);

assert.deepStrictEqual(preorder(root), [1, 2, 4, 5, 3, 6]);
assert.deepStrictEqual(inorder(root), [4, 2, 5, 1, 3, 6]);
assert.deepStrictEqual(postorder(root), [4, 5, 2, 6, 3, 1]);
assert.deepStrictEqual(preorderIterative(root), preorder(root));
assert.deepStrictEqual(inorderIterative(root), inorder(root));
assert.deepStrictEqual(postorderIterative(root), postorder(root));
assert.deepStrictEqual(morrisInorder(root), inorder(root));
assert.deepStrictEqual(inorder(root), [4, 2, 5, 1, 3, 6], 'morris must restore the tree');
assert.deepStrictEqual(levelOrder(root), [[1], [2, 3], [4, 5, 6]]);

assert.strictEqual(height(root), 2);
assert.strictEqual(height(null), -1);
assert.strictEqual(height(new TreeNode(1)), 0);
assert.strictEqual(size(root), 6);
assert.strictEqual(countLeaves(root), 3);

// empty tree
assert.deepStrictEqual(preorder(null), []);
assert.deepStrictEqual(inorderIterative(null), []);
assert.deepStrictEqual(levelOrder(null), []);

// serialize round trip
const text = serialize(root);
assert.strictEqual(text, '1,2,4,#,#,5,#,#,3,#,6,#,#');
assert.strictEqual(isSame(deserialize(text), root), true);
assert.strictEqual(serialize(null), '#');
assert.strictEqual(deserialize('#'), null);

// isSame / mirror
assert.strictEqual(isSame(buildTree([1, 2]), buildTree([1, null, 2])), false);
mirror(root);
assert.deepStrictEqual(toLevelOrderArray(root), [1, 3, 2, 6, null, 5, 4]);

console.log('✓ binary-tree.js self-test passed');

module.exports = {
  preorder, inorder, postorder,
  preorderIterative, inorderIterative, postorderIterative,
  levelOrder, morrisInorder,
  height, size, countLeaves,
  mirror, isSame, serialize, deserialize,
};

/**
 * Binary Search Tree (BST) in JavaScript.
 *
 * BST property: for EVERY node, all values in its left subtree are smaller and all
 * values in its right subtree are larger. (Duplicates: we ignore them on insert.)
 *
 * Operations: insert, search, delete, min, max, inorder (sorted), successor, height.
 * All are O(h): O(log n) when balanced, O(n) when the tree degenerates into a list.
 * See avl-tree.js for a self-balancing version.
 */

const { TreeNode } = require('../../20_Trees/02_Implementations/tree_node');

class BST {
  constructor() {
    this.root = null;
  }

  // ---- insert: walk down like a search, attach where you fall off the tree ----
  insert(val) {
    const node = new TreeNode(val);
    if (!this.root) { this.root = node; return this; }
    let current = this.root;
    while (true) {
      if (val === current.val) return this;           // ignore duplicates
      if (val < current.val) {
        if (!current.left) { current.left = node; return this; }
        current = current.left;
      } else {
        if (!current.right) { current.right = node; return this; }
        current = current.right;
      }
    }
  }

  // ---- search: go left if smaller, right if bigger, like binary search ----
  search(val) {
    let current = this.root;
    while (current && current.val !== val) {
      current = val < current.val ? current.left : current.right;
    }
    return current; // node or null
  }

  contains(val) {
    return this.search(val) !== null;
  }

  // ---- min / max: leftmost / rightmost node ----
  min(node = this.root) {
    if (!node) return null;
    while (node.left) node = node.left;
    return node;
  }

  max(node = this.root) {
    if (!node) return null;
    while (node.right) node = node.right;
    return node;
  }

  // ---- delete: three cases ----
  //   1. leaf                -> just remove it
  //   2. one child           -> replace the node by its child
  //   3. two children        -> copy the inorder successor's value (min of right subtree)
  //                             into this node, then delete the successor from the right subtree
  delete(val) {
    this.root = BST.#deleteFrom(this.root, val);
    return this;
  }

  static #deleteFrom(node, val) {
    if (!node) return null;                          // not found: nothing to do
    if (val < node.val) {
      node.left = BST.#deleteFrom(node.left, val);
      return node;
    }
    if (val > node.val) {
      node.right = BST.#deleteFrom(node.right, val);
      return node;
    }
    // found the node to delete
    if (!node.left) return node.right;               // cases 1 and 2 (no left child)
    if (!node.right) return node.left;               // case 2 (no right child)
    // case 3: two children
    let successor = node.right;
    while (successor.left) successor = successor.left; // smallest value bigger than node.val
    node.val = successor.val;                        // overwrite, the order is preserved
    node.right = BST.#deleteFrom(node.right, successor.val); // successor has <= 1 child, so this is case 1/2
    return node;
  }

  // ---- inorder = ascending sorted order ----
  inorder() {
    const out = [];
    (function walk(node) {
      if (!node) return;
      walk(node.left);
      out.push(node.val);
      walk(node.right);
    })(this.root);
    return out;
  }

  // ---- successor: the smallest value greater than val (next in sorted order) ----
  // Walk from the root; every time we go LEFT, the node we leave is a candidate.
  successor(val) {
    let candidate = null;
    let current = this.root;
    while (current) {
      if (val < current.val) {
        candidate = current;      // current is bigger: remember it, try to find a smaller one
        current = current.left;
      } else {
        current = current.right;  // current <= val: answer must be on the right
      }
    }
    return candidate;
  }

  // ---- height in edges (empty = -1) ----
  height(node = this.root) {
    if (!node) return -1;
    return 1 + Math.max(this.height(node.left), this.height(node.right));
  }

  size() {
    return this.inorder().length;
  }
}

// ---------- self-test ----------
const assert = require('assert');
if (require.main === module) {
  const bst = new BST();
  //         50
  //       /    \
  //     30      70
  //    /  \    /  \
  //  20   40  60   80
  [50, 30, 70, 20, 40, 60, 80].forEach((v) => bst.insert(v));
  bst.insert(40); // duplicate ignored

  assert.deepStrictEqual(bst.inorder(), [20, 30, 40, 50, 60, 70, 80]);
  assert.strictEqual(bst.size(), 7);
  assert.strictEqual(bst.height(), 2);
  assert.strictEqual(bst.contains(60), true);
  assert.strictEqual(bst.contains(65), false);
  assert.strictEqual(bst.min().val, 20);
  assert.strictEqual(bst.max().val, 80);
  assert.strictEqual(bst.successor(40).val, 50);
  assert.strictEqual(bst.successor(50).val, 60);
  assert.strictEqual(bst.successor(20).val, 30);
  assert.strictEqual(bst.successor(80), null);

  // delete case 1: leaf
  bst.delete(20);
  assert.deepStrictEqual(bst.inorder(), [30, 40, 50, 60, 70, 80]);
  // delete case 2: one child (30 now has only right child 40)
  bst.delete(30);
  assert.deepStrictEqual(bst.inorder(), [40, 50, 60, 70, 80]);
  assert.strictEqual(bst.root.left.val, 40);
  // delete case 3: two children (root 50 -> successor 60)
  bst.delete(50);
  assert.deepStrictEqual(bst.inorder(), [40, 60, 70, 80]);
  assert.strictEqual(bst.root.val, 60);
  // delete something that is not there
  bst.delete(999);
  assert.deepStrictEqual(bst.inorder(), [40, 60, 70, 80]);
  // delete everything
  [40, 60, 70, 80].forEach((v) => bst.delete(v));
  assert.strictEqual(bst.root, null);
  assert.strictEqual(bst.min(), null);

  // sorted insert -> degenerate tree, height n-1
  const skewed = new BST();
  [1, 2, 3, 4, 5].forEach((v) => skewed.insert(v));
  assert.strictEqual(skewed.height(), 4);

  // random round trip vs sort
  const values = Array.from({ length: 200 }, () => Math.floor(Math.random() * 1000));
  const random = new BST();
  values.forEach((v) => random.insert(v));
  assert.deepStrictEqual(random.inorder(), [...new Set(values)].sort((a, b) => a - b));

  console.log('✓ bst.js self-test passed');
}

module.exports = { BST };

/**
 * AVL tree: a self-balancing BST.
 *
 * Invariant: for every node, |height(left) - height(right)| <= 1.
 * After every insert/delete we walk back up the recursion, update heights, and if a node
 * became unbalanced we fix it with one or two ROTATIONS. This keeps height = O(log n),
 * so search/insert/delete are O(log n) guaranteed (a plain BST can degrade to O(n)).
 *
 * The four cases (balance = height(left) - height(right)):
 *
 *   Left-Left  (balance > 1, new key in left.left)     -> rotateRight(node)
 *   Right-Right(balance < -1, new key in right.right)  -> rotateLeft(node)
 *   Left-Right (balance > 1, new key in left.right)    -> rotateLeft(node.left),  then rotateRight(node)
 *   Right-Left (balance < -1, new key in right.left)   -> rotateRight(node.right), then rotateLeft(node)
 *
 * rotateRight(y):            y                x
 *                           / \              / \
 *                          x   C    ==>     A   y
 *                         / \                  / \
 *                        A   B                B   C
 * (B moves from x.right to y.left; inorder order A x B y C is unchanged.)
 *
 * Interviews rarely ask you to CODE an AVL tree, but they do ask you to explain why
 * balancing matters and what a rotation is. Red-black trees are the other famous
 * self-balancing BST (used by Java TreeMap, C++ std::map); they allow slightly less
 * strict balance in exchange for fewer rotations.
 */

class AVLNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
    this.height = 1; // height in NODES here, so a leaf is 1 and null is 0
  }
}

class AVLTree {
  constructor() {
    this.root = null;
  }

  static #height(node) {
    return node ? node.height : 0;
  }

  static #balance(node) {
    return node ? AVLTree.#height(node.left) - AVLTree.#height(node.right) : 0;
  }

  static #update(node) {
    node.height = 1 + Math.max(AVLTree.#height(node.left), AVLTree.#height(node.right));
  }

  static #rotateRight(y) {
    const x = y.left;
    const B = x.right;
    x.right = y;          // y becomes x's right child
    y.left = B;           // B (between x and y in order) moves under y
    AVLTree.#update(y);   // y is now lower, update it first
    AVLTree.#update(x);
    return x;             // x is the new root of this subtree
  }

  static #rotateLeft(x) {
    const y = x.right;
    const B = y.left;
    y.left = x;
    x.right = B;
    AVLTree.#update(x);
    AVLTree.#update(y);
    return y;
  }

  // Fix the balance at `node` (after its children are already balanced).
  static #rebalance(node) {
    AVLTree.#update(node);
    const balance = AVLTree.#balance(node);

    if (balance > 1) {                                  // left-heavy
      if (AVLTree.#balance(node.left) < 0) {            // Left-Right: straighten first
        node.left = AVLTree.#rotateLeft(node.left);
      }
      return AVLTree.#rotateRight(node);                // Left-Left
    }
    if (balance < -1) {                                 // right-heavy
      if (AVLTree.#balance(node.right) > 0) {           // Right-Left
        node.right = AVLTree.#rotateRight(node.right);
      }
      return AVLTree.#rotateLeft(node);                 // Right-Right
    }
    return node;                                        // already balanced
  }

  insert(val) {
    this.root = AVLTree.#insertInto(this.root, val);
    return this;
  }

  static #insertInto(node, val) {
    if (!node) return new AVLNode(val);
    if (val < node.val) node.left = AVLTree.#insertInto(node.left, val);
    else if (val > node.val) node.right = AVLTree.#insertInto(node.right, val);
    else return node;                                   // duplicate: ignore
    return AVLTree.#rebalance(node);                    // on the way back up
  }

  delete(val) {
    this.root = AVLTree.#deleteFrom(this.root, val);
    return this;
  }

  static #deleteFrom(node, val) {
    if (!node) return null;
    if (val < node.val) node.left = AVLTree.#deleteFrom(node.left, val);
    else if (val > node.val) node.right = AVLTree.#deleteFrom(node.right, val);
    else {
      if (!node.left) return node.right;                // 0 or 1 child
      if (!node.right) return node.left;
      let successor = node.right;                       // 2 children: inorder successor
      while (successor.left) successor = successor.left;
      node.val = successor.val;
      node.right = AVLTree.#deleteFrom(node.right, successor.val);
    }
    return AVLTree.#rebalance(node);
  }

  contains(val) {
    let current = this.root;
    while (current && current.val !== val) current = val < current.val ? current.left : current.right;
    return current !== null;
  }

  inorder() {
    const out = [];
    (function walk(node) {
      if (!node) return;
      walk(node.left); out.push(node.val); walk(node.right);
    })(this.root);
    return out;
  }

  height() {
    return AVLTree.#height(this.root);
  }

  // Verifies the AVL invariant and BST order at EVERY node. Used by the self-test.
  isBalanced() {
    function check(node, low, high) {               // returns height or -1 if broken
      if (!node) return 0;
      if (node.val <= low || node.val >= high) return -1;   // BST order broken
      const left = check(node.left, low, node.val);
      const right = check(node.right, node.val, high);
      if (left === -1 || right === -1 || Math.abs(left - right) > 1) return -1;
      if (node.height !== 1 + Math.max(left, right)) return -1; // stored height stale
      return 1 + Math.max(left, right);
    }
    return check(this.root, -Infinity, Infinity) !== -1;
  }
}

// ---------- self-test ----------
const assert = require('assert');
if (require.main === module) {
  // Sorted insert would give a plain BST height 7; AVL keeps it at 3.
  const avl = new AVLTree();
  for (let v = 1; v <= 7; v++) {
    avl.insert(v);
    assert.strictEqual(avl.isBalanced(), true, `unbalanced after inserting ${v}`);
  }
  assert.deepStrictEqual(avl.inorder(), [1, 2, 3, 4, 5, 6, 7]);
  assert.strictEqual(avl.height(), 3);
  assert.strictEqual(avl.root.val, 4); // perfectly balanced: root is the middle value

  // Each rotation case at least once
  const ll = new AVLTree(); [30, 20, 10].forEach((v) => ll.insert(v));   // Left-Left
  assert.strictEqual(ll.root.val, 20);
  const rr = new AVLTree(); [10, 20, 30].forEach((v) => rr.insert(v));   // Right-Right
  assert.strictEqual(rr.root.val, 20);
  const lr = new AVLTree(); [30, 10, 20].forEach((v) => lr.insert(v));   // Left-Right
  assert.strictEqual(lr.root.val, 20);
  const rl = new AVLTree(); [10, 30, 20].forEach((v) => rl.insert(v));   // Right-Left
  assert.strictEqual(rl.root.val, 20);

  // Random inserts and deletes keep the tree balanced and ordered
  const big = new AVLTree();
  const present = new Set();
  for (let i = 0; i < 2000; i++) {
    const v = Math.floor(Math.random() * 500);
    if (Math.random() < 0.6) { big.insert(v); present.add(v); }
    else { big.delete(v); present.delete(v); }
    if (i % 100 === 0) assert.strictEqual(big.isBalanced(), true);
  }
  assert.strictEqual(big.isBalanced(), true);
  assert.deepStrictEqual(big.inorder(), [...present].sort((a, b) => a - b));
  // height must be O(log n): AVL height <= 1.44 * log2(n + 2)
  const n = present.size;
  assert.ok(n === 0 || big.height() <= 1.44 * Math.log2(n + 2));
  for (const v of present) assert.strictEqual(big.contains(v), true);
  assert.strictEqual(big.contains(10000), false);

  // delete from empty / missing is a no-op
  const empty = new AVLTree();
  empty.delete(5);
  assert.strictEqual(empty.root, null);

  console.log('✓ avl-tree.js self-test passed');
}

module.exports = { AVLTree, AVLNode };

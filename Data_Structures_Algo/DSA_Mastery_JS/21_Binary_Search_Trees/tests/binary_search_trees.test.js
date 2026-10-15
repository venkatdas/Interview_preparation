// node --test 21_Binary_Search_Trees/tests/binary_search_trees.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { BST } = require('../02_Implementations/bst');
const { AVLTree } = require('../02_Implementations/avl_tree');
const { TreeNode } = require('../../20_Trees/02_Implementations/tree_node');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const sortedUnique = (set) => [...set].sort((a, b) => a - b);
// Checks the BST ordering rule at every node with (low, high) bounds.
function isValidBST(node, low = -Infinity, high = Infinity) {
  if (!node) return true;
  if (node.val <= low || node.val >= high) return false;
  return isValidBST(node.left, low, node.val) && isValidBST(node.right, node.val, high);
}

describe('BST', () => {
  it('empty tree: search, min, max, successor return null; height -1; size 0', () => {
    const t = new BST();
    assert.equal(t.search(1), null);
    assert.equal(t.contains(1), false);
    assert.equal(t.min(), null);
    assert.equal(t.max(), null);
    assert.equal(t.successor(5), null);
    assert.equal(t.height(), -1);
    assert.equal(t.size(), 0);
    assert.deepEqual(t.delete(3).inorder(), []); // deleting from empty is a no-op
  });
  it('ignores duplicates, handles negatives', () => {
    const t = new BST();
    [5, -3, 5, 8, -3, 0].forEach((v) => t.insert(v));
    assert.deepEqual(t.inorder(), [-3, 0, 5, 8]);
    assert.equal(t.min().val, -3);
    assert.equal(t.max().val, 8);
  });
  it('sorted insertion degenerates into a chain (height n - 1)', () => {
    const asc = new BST(), desc = new BST();
    for (let i = 0; i < 50; i++) { asc.insert(i); desc.insert(50 - i); }
    assert.equal(asc.height(), 49);
    assert.equal(desc.height(), 49);
  });
  it('delete: leaf, one child, two children, root, missing value', () => {
    const t = new BST();
    [50, 30, 70, 20, 40, 60, 80, 65].forEach((v) => t.insert(v));
    t.delete(20);                        // leaf
    t.delete(60);                        // one child (65)
    t.delete(30);                        // one child left (40), since 20 is gone
    t.delete(50);                        // root with two children
    t.delete(999);                       // missing
    assert.deepEqual(t.inorder(), [40, 65, 70, 80]);
    assert.ok(isValidBST(t.root));
  });
  it('successor returns the next larger value (or null)', () => {
    const t = new BST();
    [20, 10, 30, 25, 35].forEach((v) => t.insert(v));
    assert.equal(t.successor(20).val, 25);
    assert.equal(t.successor(22).val, 25); // value not in tree
    assert.equal(t.successor(35), null);
    assert.equal(t.successor(-100).val, 10);
  });
  it('random inserts/deletes: inorder equals sorted Set, order rule always holds', () => {
    const rnd = mulberry32(21);
    for (let round = 0; round < 30; round++) {
      const t = new BST(), model = new Set();
      for (let i = 0; i < 300; i++) {
        const v = Math.floor(rnd() * 61) - 30;
        if (rnd() < 0.6) { t.insert(v); model.add(v); } else { t.delete(v); model.delete(v); }
        assert.equal(t.contains(v), model.has(v));
      }
      assert.deepEqual(t.inorder(), sortedUnique(model));
      assert.equal(t.size(), model.size);
      assert.ok(isValidBST(t.root));
      const probe = Math.floor(rnd() * 61) - 30;
      const expected = sortedUnique(model).find((x) => x > probe);
      assert.equal(t.successor(probe)?.val, expected);
    }
  });
});

describe('AVLTree', () => {
  it('sorted inserts stay balanced (height 3 for 7 nodes, counted in nodes)', () => {
    const t = new AVLTree();
    for (let v = 1; v <= 7; v++) t.insert(v);
    assert.equal(t.height(), 3);
    assert.equal(t.root.val, 4);
    assert.ok(t.isBalanced());
  });
  it('empty tree and duplicates', () => {
    const t = new AVLTree();
    assert.equal(t.height(), 0);
    assert.equal(t.contains(1), false);
    assert.deepEqual(t.inorder(), []);
    t.insert(2); t.insert(2);
    assert.deepEqual(t.inorder(), [2]);
    t.delete(2);
    assert.deepEqual(t.inorder(), []);
    assert.ok(t.isBalanced());
  });
  it('reverse-sorted and zig-zag insert orders trigger all rotations and stay valid', () => {
    for (const order of [[7, 6, 5, 4, 3, 2, 1], [3, 1, 2], [1, 3, 2], [10, 5, 15, 3, 7, 6]]) {
      const t = new AVLTree();
      order.forEach((v) => t.insert(v));
      assert.ok(t.isBalanced(), String(order));
      assert.deepEqual(t.inorder(), [...order].sort((a, b) => a - b));
    }
  });
  it('random inserts/deletes: matches sorted Set and the AVL height bound', () => {
    const rnd = mulberry32(1962);
    for (let round = 0; round < 20; round++) {
      const t = new AVLTree(), model = new Set();
      for (let i = 0; i < 500; i++) {
        const v = Math.floor(rnd() * 401) - 200;
        if (rnd() < 0.65) { t.insert(v); model.add(v); } else { t.delete(v); model.delete(v); }
      }
      assert.deepEqual(t.inorder(), sortedUnique(model));
      assert.ok(t.isBalanced());
      const n = model.size;
      assert.ok(t.height() <= 1.45 * Math.log2(n + 2), `height ${t.height()} too big for n=${n}`);
      for (let probe = -200; probe <= 200; probe += 7) assert.equal(t.contains(probe), model.has(probe));
    }
  });
});

describe('selected solutions on extra edge cases', () => {
  const toBST = require('../03_Problems/solutions/04_sorted_array_to_bst');
  const valid = require('../03_Problems/solutions/07_validate_bst');
  const kth = require('../03_Problems/solutions/08_kth_smallest_in_bst');
  const del = require('../03_Problems/solutions/11_delete_node_in_bst');
  const rec = require('../03_Problems/solutions/12_recover_bst');
  const inorder = (n, out = []) => { if (n) { inorder(n.left, out); out.push(n.val); inorder(n.right, out); } return out; };
  const height = (n) => (n ? 1 + Math.max(height(n.left), height(n.right)) : 0);
  const bstFrom = (vals) => { const t = new BST(); vals.forEach((v) => t.insert(v)); return t.root; };
  const rnd = mulberry32(108);
  it('sorted array to BST: empty, single, and minimal height on random sizes', () => {
    assert.equal(toBST.optimal([]), null);
    for (let n = 1; n <= 64; n++) {
      const arr = Array.from({ length: n }, (_, i) => i * 2 - n);
      const root = toBST.optimal(arr);
      assert.deepEqual(inorder(root), arr);
      assert.equal(height(root), Math.ceil(Math.log2(n + 1)));
    }
  });
  it('validate BST: equal values are invalid; deep violation is caught; extreme values', () => {
    assert.equal(valid.optimal(null), true);
    const dup = new TreeNode(2, new TreeNode(2));
    assert.equal(valid.optimal(dup), false);
    const deep = new TreeNode(5, new TreeNode(1), new TreeNode(6, new TreeNode(3), new TreeNode(7)));
    assert.equal(valid.optimal(deep), false);
    assert.equal(valid.optimal(new TreeNode(-(2 ** 31), null, new TreeNode(2 ** 31 - 1))), true);
  });
  it('kth smallest matches the sorted array on random BSTs', () => {
    for (let t = 0; t < 100; t++) {
      const vals = [...new Set(Array.from({ length: 1 + Math.floor(rnd() * 30) }, () => Math.floor(rnd() * 100)))];
      const root = bstFrom(vals), sorted = [...vals].sort((a, b) => a - b);
      const k = 1 + Math.floor(rnd() * sorted.length);
      assert.equal(kth.optimal(root, k), sorted[k - 1]);
    }
  });
  it('delete node: root, missing key, random vs sorted-array reference', () => {
    assert.equal(del.optimal(null, 1), null);
    assert.equal(del.optimal(new TreeNode(1), 1), null);
    for (let t = 0; t < 100; t++) {
      const vals = [...new Set(Array.from({ length: 1 + Math.floor(rnd() * 25) }, () => Math.floor(rnd() * 50)))];
      const key = Math.floor(rnd() * 50);
      const root = del.optimal(bstFrom(vals), key);
      assert.deepEqual(inorder(root), vals.filter((v) => v !== key).sort((a, b) => a - b));
      assert.ok(isValidBST(root));
    }
  });
  it('recover BST: swapped adjacent and distant nodes are fixed', () => {
    for (let t = 0; t < 100; t++) {
      const vals = [...new Set(Array.from({ length: 2 + Math.floor(rnd() * 25) }, () => Math.floor(rnd() * 100)))];
      if (vals.length < 2) continue;
      const root = bstFrom(vals);
      const nodes = [];
      (function walk(n) { if (n) { walk(n.left); nodes.push(n); walk(n.right); } })(root);
      const i = Math.floor(rnd() * nodes.length);
      let j = Math.floor(rnd() * nodes.length);
      if (i === j) j = (j + 1) % nodes.length;
      [nodes[i].val, nodes[j].val] = [nodes[j].val, nodes[i].val];
      rec.optimal(root);
      assert.ok(isValidBST(root));
    }
  });
});

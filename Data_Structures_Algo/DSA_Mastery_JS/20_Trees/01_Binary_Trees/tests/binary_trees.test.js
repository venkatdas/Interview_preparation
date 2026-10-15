// node --test 20_Trees/01_Binary_Trees/tests/binary_trees.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const BT = require('../02_Implementations/binary_tree');
const { TreeNode, buildTree, toLevelOrderArray } = require('../../02_Implementations/tree_node');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// Random tree with n nodes: each new node hangs off a random free child slot.
function randomTree(rnd, n) {
  if (n === 0) return null;
  const nodes = [new TreeNode(Math.floor(rnd() * 21) - 10)];
  while (nodes.length < n) {
    const parent = nodes[Math.floor(rnd() * nodes.length)];
    const side = rnd() < 0.5 ? 'left' : 'right';
    if (parent[side]) continue;
    parent[side] = new TreeNode(Math.floor(rnd() * 21) - 10);
    nodes.push(parent[side]);
  }
  return nodes[0];
}
// Skewed trees: a chain to one side.
function chain(n, side) {
  let root = null;
  for (let i = n; i >= 1; i--) { const node = new TreeNode(i); node[side] = root; root = node; }
  return root;
}

describe('tree_node helpers', () => {
  it('buildTree / toLevelOrderArray round-trip with nulls', () => {
    for (const arr of [[], [1], [1, 2, 3], [1, null, 2, null, 3], [5, 4, 8, 11, null, 13, 4]]) {
      assert.deepEqual(toLevelOrderArray(buildTree(arr)), arr);
    }
    assert.equal(buildTree([null]), null);
  });
});

describe('traversals', () => {
  const t = buildTree([1, 2, 3, 4, 5, null, 6]);
  it('known orders on a small tree', () => {
    assert.deepEqual(BT.preorder(t), [1, 2, 4, 5, 3, 6]);
    assert.deepEqual(BT.inorder(t), [4, 2, 5, 1, 3, 6]);
    assert.deepEqual(BT.postorder(t), [4, 5, 2, 6, 3, 1]);
    assert.deepEqual(BT.levelOrder(t), [[1], [2, 3], [4, 5, 6]]);
  });
  it('empty tree gives empty results everywhere', () => {
    for (const f of ['preorder', 'inorder', 'postorder', 'preorderIterative', 'inorderIterative', 'postorderIterative', 'levelOrder', 'morrisInorder']) {
      assert.deepEqual(BT[f](null), [], f);
    }
  });
  it('skewed trees (left and right chains)', () => {
    assert.deepEqual(BT.inorder(chain(4, 'left')), [4, 3, 2, 1]);
    assert.deepEqual(BT.inorder(chain(4, 'right')), [1, 2, 3, 4]);
    assert.equal(BT.levelOrder(chain(5, 'left')).length, 5);
  });
  it('iterative and Morris versions match recursive ones on random trees (duplicates, negatives)', () => {
    const rnd = mulberry32(20);
    for (let t2 = 0; t2 < 300; t2++) {
      const root = randomTree(rnd, Math.floor(rnd() * 40));
      assert.deepEqual(BT.preorderIterative(root), BT.preorder(root));
      assert.deepEqual(BT.inorderIterative(root), BT.inorder(root));
      assert.deepEqual(BT.postorderIterative(root), BT.postorder(root));
      const before = BT.serialize(root);
      assert.deepEqual(BT.morrisInorder(root), BT.inorder(root));
      assert.equal(BT.serialize(root), before, 'Morris must restore the tree');
      assert.deepEqual(BT.levelOrder(root).flat().length, BT.size(root));
    }
  });
});

describe('measurements and transformations', () => {
  it('height is in edges: empty -1, single 0, chain n-1', () => {
    assert.equal(BT.height(null), -1);
    assert.equal(BT.height(new TreeNode(1)), 0);
    assert.equal(BT.height(chain(6, 'right')), 5);
  });
  it('size, countLeaves and height agree with level order on random trees', () => {
    const rnd = mulberry32(5);
    for (let t = 0; t < 200; t++) {
      const root = randomTree(rnd, Math.floor(rnd() * 30));
      const levels = BT.levelOrder(root);
      assert.equal(BT.height(root), levels.length - 1);
      assert.equal(BT.size(root), levels.flat().length);
      let leaves = 0;
      (function walk(n) { if (!n) return; if (!n.left && !n.right) leaves++; walk(n.left); walk(n.right); })(root);
      assert.equal(BT.countLeaves(root), leaves);
    }
  });
  it('mirror reverses inorder and is its own inverse', () => {
    const rnd = mulberry32(9);
    for (let t = 0; t < 100; t++) {
      const root = randomTree(rnd, Math.floor(rnd() * 25));
      const copy = BT.deserialize(BT.serialize(root));
      const inorder = BT.inorder(root);
      BT.mirror(root);
      assert.deepEqual(BT.inorder(root), [...inorder].reverse());
      BT.mirror(root);
      assert.ok(BT.isSame(root, copy));
    }
    assert.equal(BT.mirror(null), null);
  });
  it('isSame distinguishes structure, not just values', () => {
    assert.equal(BT.isSame(null, null), true);
    assert.equal(BT.isSame(buildTree([1, 2]), buildTree([1, null, 2])), false);
    assert.equal(BT.isSame(buildTree([1, 1]), buildTree([1, 1])), true);
  });
  it('serialize / deserialize round-trip on random trees and the empty tree', () => {
    assert.equal(BT.serialize(null), '#');
    assert.equal(BT.deserialize('#'), null);
    const rnd = mulberry32(297);
    for (let t = 0; t < 200; t++) {
      const root = randomTree(rnd, Math.floor(rnd() * 30));
      assert.ok(BT.isSame(BT.deserialize(BT.serialize(root)), root));
    }
  });
});

describe('selected solutions on extra edge cases', () => {
  const dia = require('../03_Problems/solutions/07_diameter_of_binary_tree');
  const bal = require('../03_Problems/solutions/06_balanced_binary_tree');
  const lca = require('../03_Problems/solutions/17_lowest_common_ancestor');
  const build = require('../03_Problems/solutions/18_construct_from_preorder_inorder');
  const mps = require('../03_Problems/solutions/19_maximum_path_sum');
  const rnd = mulberry32(42);
  it('diameter and balanced: optimal matches brute force on random and skewed trees', () => {
    assert.equal(dia.optimal(null), 0);
    assert.equal(dia.optimal(chain(5, 'left')), 4);
    assert.equal(bal.optimal(chain(3, 'right')), false);
    assert.equal(bal.optimal(null), true);
    for (let t = 0; t < 200; t++) {
      const root = randomTree(rnd, Math.floor(rnd() * 30));
      assert.equal(dia.optimal(root), dia.bruteForce(root));
      assert.equal(bal.optimal(root), bal.bruteForce(root));
    }
  });
  it('LCA: a node is its own ancestor; optimal matches brute force', () => {
    const t = buildTree([3, 5, 1, 6, 2, 0, 8]);
    assert.equal(lca.optimal(t, t.left, t.left.right), t.left);
    for (let k = 0; k < 100; k++) {
      const root = randomTree(rnd, 1 + Math.floor(rnd() * 25));
      const nodes = [];
      (function walk(n) { if (n) { nodes.push(n); walk(n.left); walk(n.right); } })(root);
      const p = nodes[Math.floor(rnd() * nodes.length)], q = nodes[Math.floor(rnd() * nodes.length)];
      assert.equal(lca.optimal(root, p, q), lca.bruteForce(root, p, q));
    }
  });
  it('construct from preorder + inorder rebuilds random trees with distinct values', () => {
    assert.equal(build.optimal([], []), null);
    for (let t = 0; t < 100; t++) {
      const root = randomTree(rnd, Math.floor(rnd() * 25));
      let id = 0;
      (function relabel(n) { if (n) { n.val = id++; relabel(n.left); relabel(n.right); } })(root);
      const rebuilt = build.optimal(BT.preorder(root), BT.inorder(root));
      assert.ok(BT.isSame(rebuilt, root));
    }
  });
  it('maximum path sum: all negative values, single node, random vs brute', () => {
    assert.equal(mps.optimal(buildTree([-3])), -3);
    assert.equal(mps.optimal(buildTree([-2, -1, -3])), -1);
    for (let t = 0; t < 200; t++) {
      const root = randomTree(rnd, 1 + Math.floor(rnd() * 25));
      assert.equal(mps.optimal(root), mps.bruteForce(root));
    }
  });
});

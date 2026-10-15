// node --test 20_Trees/02_N_Ary_Trees_And_Misc/tests/n_ary_trees.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const NT = require('../02_Implementations/n_ary_tree');
const { NaryNode } = NT;
const { TreeNode } = require('../../02_Implementations/tree_node');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// Random N-ary tree: node i (i >= 1) gets a random earlier parent, so the shape is arbitrary.
function randomNary(rnd, n) {
  if (n === 0) return { root: null, parent: [] };
  const nodes = [new NaryNode(0)], parent = [-1];
  for (let i = 1; i < n; i++) {
    const p = Math.floor(rnd() * i);
    const child = new NaryNode(i);
    nodes[p].children.push(child);
    nodes.push(child);
    parent.push(p);
  }
  return { root: nodes[0], parent };
}
// Reference DFS that does not share code with the implementation.
function refPreorder(root) {
  const out = [], stack = root ? [root] : [];
  while (stack.length) { const n = stack.pop(); out.push(n.val); for (let i = n.children.length - 1; i >= 0; i--) stack.push(n.children[i]); }
  return out;
}

describe('n_ary_tree', () => {
  const sample = [1, null, 3, 2, 4, null, 5, 6];
  it('build / serialize round-trip on the LeetCode example and the empty tree', () => {
    assert.deepEqual(NT.toNaryArray(NT.buildNaryTree(sample)), sample);
    assert.equal(NT.buildNaryTree([]), null);
    assert.deepEqual(NT.toNaryArray(null), []);
    assert.deepEqual(NT.toNaryArray(NT.buildNaryTree([7])), [7]);
  });
  it('traversals on the example', () => {
    const root = NT.buildNaryTree(sample);
    assert.deepEqual(NT.preorder(root), [1, 3, 5, 6, 2, 4]);
    assert.deepEqual(NT.postorder(root), [5, 6, 3, 2, 4, 1]);
    assert.deepEqual(NT.levelOrder(root), [[1], [3, 2, 4], [5, 6]]);
    assert.equal(NT.maxDepth(root), 3);
    assert.equal(NT.size(root), 6);
  });
  it('empty and single-node trees', () => {
    assert.deepEqual(NT.preorder(null), []);
    assert.deepEqual(NT.postorder(null), []);
    assert.deepEqual(NT.levelOrder(null), []);
    assert.equal(NT.maxDepth(null), 0);
    assert.equal(NT.size(null), 0);
    const one = new NaryNode(1);
    assert.equal(NT.maxDepth(one), 1);
    assert.deepEqual(NT.levelOrder(one), [[1]]);
  });
  it('wide star and deep chain shapes', () => {
    const star = new NaryNode(0, Array.from({ length: 50 }, (_, i) => new NaryNode(i + 1)));
    assert.equal(NT.maxDepth(star), 2);
    assert.equal(NT.levelOrder(star)[1].length, 50);
    let chain = new NaryNode(30);
    for (let v = 29; v >= 1; v--) chain = new NaryNode(v, [chain]);
    assert.equal(NT.maxDepth(chain), 30);
    assert.deepEqual(NT.postorder(chain), Array.from({ length: 30 }, (_, i) => 30 - i));
  });
  it('random trees: traversals agree with references; serialization round-trips', () => {
    const rnd = mulberry32(2002);
    for (let t = 0; t < 200; t++) {
      const { root } = randomNary(rnd, Math.floor(rnd() * 40));
      const pre = NT.preorder(root);
      assert.deepEqual(pre, refPreorder(root));
      assert.equal(NT.size(root), pre.length);
      assert.equal(NT.levelOrder(root).length, NT.maxDepth(root));
      assert.deepEqual(NT.postorder(root).sort((a, b) => a - b), [...pre].sort((a, b) => a - b));
      assert.deepEqual(NT.preorder(NT.buildNaryTree(NT.toNaryArray(root))), pre);
    }
  });
  it('parent array <-> children lists round-trip on random trees', () => {
    const rnd = mulberry32(7);
    for (let t = 0; t < 200; t++) {
      const { parent } = randomNary(rnd, 1 + Math.floor(rnd() * 30));
      const { root, children } = NT.parentArrayToChildren(parent);
      assert.equal(root, 0);
      assert.equal(children.flat().length, parent.length - 1);
      assert.deepEqual(NT.childrenToParentArray(children, root), parent);
    }
  });
});

describe('selected solutions on extra edge cases', () => {
  const pre = require('../03_Problems/solutions/01_n_ary_preorder');
  const depth = require('../03_Problems/solutions/02_max_depth_n_ary');
  const lvl = require('../03_Problems/solutions/03_n_ary_level_order');
  const clone = require('../03_Problems/solutions/04_clone_n_ary_tree');
  const distK = require('../03_Problems/solutions/06_all_nodes_distance_k');
  const vert = require('../03_Problems/solutions/07_vertical_order_traversal');
  const rnd = mulberry32(99);
  it('preorder / depth / level order: optimal matches brute on random trees and null', () => {
    assert.deepEqual(pre.optimal(null), []);
    assert.equal(depth.optimal(null), 0);
    assert.deepEqual(lvl.optimal(null), []);
    for (let t = 0; t < 100; t++) {
      const { root } = randomNary(rnd, Math.floor(rnd() * 30));
      assert.deepEqual(pre.optimal(root), pre.bruteForce(root));
      assert.equal(depth.optimal(root), depth.bruteForce(root));
      assert.deepEqual(lvl.optimal(root), lvl.bruteForce(root));
    }
  });
  it('clone produces equal values but brand-new nodes', () => {
    assert.equal(clone.optimal(null), null);
    const { root } = randomNary(rnd, 20);
    const copy = clone.optimal(root);
    assert.notEqual(copy, root);
    assert.deepEqual(NT.toNaryArray(copy), NT.toNaryArray(root));
    assert.notEqual(copy.children[0], root.children[0]);
  });
  // Random binary tree with distinct values for the binary-tree problems in this folder.
  function randomBinary(n) {
    const nodes = [new TreeNode(0)];
    while (nodes.length < n) {
      const p = nodes[Math.floor(rnd() * nodes.length)], side = rnd() < 0.5 ? 'left' : 'right';
      if (!p[side]) { p[side] = new TreeNode(nodes.length); nodes.push(p[side]); }
    }
    return nodes;
  }
  it('all nodes distance K: k = 0, k larger than the tree, random vs brute', () => {
    const nodes = randomBinary(10);
    assert.deepEqual(distK.optimal(nodes[0], nodes[3], 0), [3]);
    assert.deepEqual(distK.optimal(nodes[0], nodes[3], 50), []);
    for (let t = 0; t < 100; t++) {
      const ns = randomBinary(1 + Math.floor(rnd() * 20));
      const target = ns[Math.floor(rnd() * ns.length)], k = Math.floor(rnd() * 5);
      const sort = (a) => [...a].sort((x, y) => x - y);
      assert.deepEqual(sort(distK.optimal(ns[0], target, k)), sort(distK.bruteForce(ns[0], target, k)));
    }
  });
  it('vertical order traversal: single node and random vs brute', () => {
    assert.deepEqual(vert.optimal(new TreeNode(5)), [[5]]);
    for (let t = 0; t < 100; t++) {
      const ns = randomBinary(1 + Math.floor(rnd() * 20));
      assert.deepEqual(vert.optimal(ns[0]), vert.bruteForce(ns[0]));
    }
  });
});

/**
 * N-ary tree toolbox in JavaScript.
 *
 * An N-ary tree node has ANY number of children, stored in an array:
 *   { val, children: [] }
 *
 * LeetCode's array format for N-ary trees is level order with `null` separating the
 * children groups:   [1, null, 3, 2, 4, null, 5, 6]
 *
 *          1
 *       /  |  \
 *      3   2   4            children of 1: [3, 2, 4]
 *     / \                   children of 3: [5, 6]
 *    5   6                  children of 2: []   children of 4: []
 *
 * Helpers here:
 *   NaryNode, buildNaryTree(array), toNaryArray(root)
 *   preorder, postorder, levelOrder, maxDepth, size
 *   parentArrayToChildren(parent[]) / childrenToParentArray(children[][], n)
 *     (two common ways a tree is given to you WITHOUT node objects)
 */

class NaryNode {
  constructor(val, children = []) {
    this.val = val;
    this.children = children;
  }
}

// ---- LeetCode array <-> tree ----
function buildNaryTree(values) {
  if (!values || values.length === 0) return null;
  const root = new NaryNode(values[0]);
  const queue = [root];           // parents waiting for their children group
  let index = 2;                  // values[1] is the null right after the root
  while (index < values.length && queue.length) {
    const parent = queue.shift();
    while (index < values.length && values[index] !== null) {
      const child = new NaryNode(values[index]);
      parent.children.push(child);
      queue.push(child);
      index++;
    }
    index++;                      // skip the null that ends this group
  }
  return root;
}

function toNaryArray(root) {
  if (!root) return [];
  const result = [root.val, null];
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    for (const child of node.children) {
      result.push(child.val);
      queue.push(child);
    }
    result.push(null);
  }
  while (result.length && result[result.length - 1] === null) result.pop();
  return result;
}

// ---- traversals: the only change from binary trees is "for (const child of children)" ----
function preorder(root, out = []) {
  if (!root) return out;
  out.push(root.val);
  for (const child of root.children) preorder(child, out);
  return out;
}

function postorder(root, out = []) {
  if (!root) return out;
  for (const child of root.children) postorder(child, out);
  out.push(root.val);
  return out;
}

// (there is no "inorder" for N-ary trees: where would the node go among 5 children?)

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
      queue.push(...node.children);
    }
    levels.push(level);
  }
  return levels;
}

function maxDepth(root) {                // depth in nodes
  if (!root) return 0;
  let deepestChild = 0;
  for (const child of root.children) deepestChild = Math.max(deepestChild, maxDepth(child));
  return 1 + deepestChild;
}

function size(root) {
  if (!root) return 0;
  return 1 + root.children.reduce((sum, child) => sum + size(child), 0);
}

// ---- representation conversions ----
// parent array: parent[i] is the parent of node i, root has parent -1
//   parent = [-1, 0, 0, 1, 1, 2]   means  0 -> {1, 2},  1 -> {3, 4},  2 -> {5}
function parentArrayToChildren(parent) {
  const children = Array.from({ length: parent.length }, () => []);
  let root = -1;
  for (let node = 0; node < parent.length; node++) {
    if (parent[node] === -1) root = node;
    else children[parent[node]].push(node);
  }
  return { root, children };
}

function childrenToParentArray(children, root) {
  const parent = new Array(children.length).fill(-1);
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    for (const child of children[node]) {
      parent[child] = node;
      stack.push(child);
    }
  }
  return parent;
}

// ---------- self-test ----------
const assert = require('assert');
if (require.main === module) {
  const values = [1, null, 3, 2, 4, null, 5, 6];
  const root = buildNaryTree(values);
  assert.strictEqual(root.val, 1);
  assert.deepStrictEqual(root.children.map((c) => c.val), [3, 2, 4]);
  assert.deepStrictEqual(root.children[0].children.map((c) => c.val), [5, 6]);
  assert.deepStrictEqual(toNaryArray(root), values);

  assert.deepStrictEqual(preorder(root), [1, 3, 5, 6, 2, 4]);
  assert.deepStrictEqual(postorder(root), [5, 6, 3, 2, 4, 1]);
  assert.deepStrictEqual(levelOrder(root), [[1], [3, 2, 4], [5, 6]]);
  assert.strictEqual(maxDepth(root), 3);
  assert.strictEqual(size(root), 6);

  assert.strictEqual(buildNaryTree([]), null);
  assert.deepStrictEqual(toNaryArray(buildNaryTree([1])), [1]);
  assert.deepStrictEqual(preorder(null), []);
  assert.strictEqual(maxDepth(null), 0);

  const bigger = [1, null, 2, 3, 4, 5, null, null, 6, 7, null, 8, null, 9, 10, null, null, 11, null, 12, null, 13, null, null, 14];
  assert.deepStrictEqual(toNaryArray(buildNaryTree(bigger)), bigger);
  assert.strictEqual(maxDepth(buildNaryTree(bigger)), 5);

  const { root: r, children } = parentArrayToChildren([-1, 0, 0, 1, 1, 2]);
  assert.strictEqual(r, 0);
  assert.deepStrictEqual(children, [[1, 2], [3, 4], [5], [], [], []]);
  assert.deepStrictEqual(childrenToParentArray(children, r), [-1, 0, 0, 1, 1, 2]);

  console.log('✓ n-ary-tree.js self-test passed');
}

module.exports = {
  NaryNode, buildNaryTree, toNaryArray,
  preorder, postorder, levelOrder, maxDepth, size,
  parentArrayToChildren, childrenToParentArray,
};

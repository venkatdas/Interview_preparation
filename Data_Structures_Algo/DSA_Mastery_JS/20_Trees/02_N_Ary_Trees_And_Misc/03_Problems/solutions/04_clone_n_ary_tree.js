/**
 * 04. Clone N-ary Tree   (LeetCode 1490 — Medium)
 *
 * PROBLEM
 * Return a DEEP copy of an N-ary tree: new node objects with the same values and the
 * same structure. Changing the copy must not change the original.
 *
 * EXAMPLES
 * Input: [1,null,3,2,4,null,5,6]   Output: [1,null,3,2,4,null,5,6]  (different objects)
 * Input: []                        Output: []
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Deep copy (new nodes), not a shallow copy of the root? (deep)
 * - Follow-up: what if the tree becomes a graph with random pointers? (use a Map old->new,
 *   see Clone Graph in 23_Graphs; the optimal below already uses that idea)
 *
 * APPROACH 1 — Brute force (serialize to array, rebuild)   O(n) time, O(n) space
 * toNaryArray(root) then buildNaryTree(array). Two passes and an intermediate array.
 * Correct, but it only works because values can be rebuilt; it would not work if nodes
 * carried extra pointers.
 *
 * APPROACH 2 — Optimal (recursive copy with a Map old -> new)   O(n) time, O(n) space
 * clone(node): create a new node with node.val, then clone each child and push it into
 * the new node's children. The Map remembers which copy belongs to which original, so
 * the same code handles shared/random pointers (and makes the tests easy).
 *
 * Dry run on [1,null,3,2,4,null,5,6]:
 *   clone(1) -> new 1'; children: clone(3) -> new 3' with children [5', 6']; clone(2) -> 2'; clone(4) -> 4'
 *
 * EDGE CASES
 * - empty -> null
 * - mutate the copy afterwards: the original must be unchanged (tested)
 */

const { NaryNode, buildNaryTree, toNaryArray } = require('../../02_Implementations/n_ary_tree');

function bruteForce(root) {
  return buildNaryTree(toNaryArray(root));
}

function optimal(root) {
  const copies = new Map();        // original node -> its copy
  function clone(node) {
    if (!node) return null;
    if (copies.has(node)) return copies.get(node);
    const copy = new NaryNode(node.val);
    copies.set(node, copy);        // set BEFORE recursing (safe even with cycles)
    for (const child of node.children) copy.children.push(clone(child));
    return copy;
  }
  return clone(root);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  const values = [1, null, 3, 2, 4, null, 5, 6];
  const original = buildNaryTree(values);
  const copy = solve(original);
  assert.deepStrictEqual(toNaryArray(copy), values);
  assert.notStrictEqual(copy, original);                               // different root object
  assert.notStrictEqual(copy.children[0], original.children[0]);       // and different children
  copy.children[0].val = 99;
  copy.children.push(new NaryNode(100));
  assert.deepStrictEqual(toNaryArray(original), values);               // original untouched
  assert.strictEqual(solve(null), null);
  assert.deepStrictEqual(toNaryArray(solve(buildNaryTree([7]))), [7]);
}
console.log('✓ 04-clone-n-ary-tree passed');

module.exports = { optimal, bruteForce };

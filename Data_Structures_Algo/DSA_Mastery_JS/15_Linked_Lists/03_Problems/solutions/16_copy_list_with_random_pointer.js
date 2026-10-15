/**
 * 16. Copy List with Random Pointer   (LeetCode 138 — Medium)
 *
 * PROBLEM
 * Each node has a `next` pointer and a `random` pointer that may point to ANY
 * node in the list (or null). Make a deep copy: brand-new nodes, where every
 * copied node's next/random point to the corresponding COPIED nodes.
 *
 * EXAMPLES
 * Input:  [[7,null],[13,0],[11,4],[10,2],[1,0]]   (value, index that random points to)
 * Output: a new list with the same shape
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can random point to the node itself? (yes)
 * - Must the original list stay untouched after the call? (yes - restore it)
 * - O(1) extra space follow-up? (yes, see approach 2)
 *
 * APPROACH 1 — Brute force / standard (Map old node -> new node)   O(n) time, O(n) space
 * Pass 1: create a copy of every node and store old -> copy in a Map.
 * Pass 2: for every old node, copy.next = map.get(old.next), copy.random = map.get(old.random).
 * This is the solution most people give and it is perfectly fine.
 *
 * APPROACH 2 — Optimal (interleave copies, O(1) extra space)   O(n) time, O(1) space
 * Trick: put each copy right AFTER its original, so the "map" is just .next.
 *   1. Interleave:   A -> A' -> B -> B' -> C -> C'
 *   2. Set randoms:  A'.random = A.random.next   (the copy of A.random sits right after it)
 *   3. Unweave:      separate the two lists and restore the original's next pointers.
 *
 * Dry run on A -> B, A.random = B, B.random = A:
 *   1. A -> A' -> B -> B'
 *   2. A'.random = A.random.next = B.next = B'    B'.random = B.random.next = A.next = A'
 *   3. A -> B ; A' -> B'
 *
 * EDGE CASES
 * - empty list
 * - random points to self
 * - random is null for some nodes
 * - copied list must not share any node with the original
 */

class RandomNode {
  constructor(val, next = null, random = null) {
    this.val = val;
    this.next = next;
    this.random = random;
  }
}

function bruteForce(head) {
  if (!head) return null;
  const oldToNew = new Map();

  for (let node = head; node; node = node.next) {
    oldToNew.set(node, new RandomNode(node.val));
  }
  for (let node = head; node; node = node.next) {
    const copy = oldToNew.get(node);
    copy.next = node.next ? oldToNew.get(node.next) : null;
    copy.random = node.random ? oldToNew.get(node.random) : null;
  }
  return oldToNew.get(head);
}

function optimal(head) {
  if (!head) return null;

  // 1. interleave: A -> A' -> B -> B' ...
  for (let node = head; node; node = node.next.next) {
    node.next = new RandomNode(node.val, node.next);
  }

  // 2. randoms: the copy of X is always X.next
  for (let node = head; node; node = node.next.next) {
    node.next.random = node.random ? node.random.next : null;
  }

  // 3. unweave
  const copyHead = head.next;
  for (let node = head; node; node = node.next) {
    const copy = node.next;
    node.next = copy.next;                       // restore original
    copy.next = copy.next ? copy.next.next : null; // link copy to next copy
  }
  return copyHead;
}

// ---------- tests ----------
const assert = require('assert');

// Build from [[val, randomIndex|null], ...]
function build(spec) {
  const nodes = spec.map(([val]) => new RandomNode(val));
  spec.forEach(([, randomIndex], i) => {
    nodes[i].next = nodes[i + 1] || null;
    nodes[i].random = randomIndex === null ? null : nodes[randomIndex];
  });
  return nodes[0] || null;
}
// Serialize back to [[val, randomIndex|null], ...]
function serialize(head) {
  const nodes = [];
  for (let node = head; node; node = node.next) nodes.push(node);
  return nodes.map((node) => [node.val, node.random ? nodes.indexOf(node.random) : null]);
}

const cases = [
  [[7, null], [13, 0], [11, 4], [10, 2], [1, 0]],
  [[1, 1], [2, 1]],
  [[3, null], [3, 0], [3, null]],
  [[1, 0]],       // self-loop random
  [],
];

for (const solve of [bruteForce, optimal]) {
  for (const spec of cases) {
    const original = build(spec);
    const copy = solve(original);
    assert.deepStrictEqual(serialize(copy), spec);      // same shape
    assert.deepStrictEqual(serialize(original), spec);  // original untouched
    // no shared nodes
    const originalNodes = new Set();
    for (let node = original; node; node = node.next) originalNodes.add(node);
    for (let node = copy; node; node = node.next) {
      assert.strictEqual(originalNodes.has(node), false);
      if (node.random) assert.strictEqual(originalNodes.has(node.random), false);
    }
  }
}
console.log('✓ 16-copy-list-with-random-pointer passed');

module.exports = { optimal, bruteForce, RandomNode };

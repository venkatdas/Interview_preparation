/**
 * 16. Populating Next Right Pointers in Each Node   (LeetCode 116 — Medium)
 *
 * PROBLEM
 * You are given a PERFECT binary tree whose nodes have an extra `next` pointer
 * (initially null). Set every node's `next` to the node immediately to its right on
 * the same level. The last node of each level keeps next = null.
 *
 * EXAMPLES
 * Input: [1,2,3,4,5,6,7]
 * Output (levels, read via next): [1,#], [2,3,#], [4,5,6,7,#]
 * Input: []   Output: []
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Perfect tree guaranteed? (yes for 116; 117 is the general case, see note below)
 * - O(1) extra space required? (the follow-up; recursion stack does not count)
 *
 * APPROACH 1 — Brute force (BFS level by level)   O(n) time, O(w) space
 * Standard level order. Inside a level, link queue[i].next = queue[i+1].
 * Works for ANY tree (also solves LeetCode 117), but uses a queue.
 *
 * APPROACH 2 — Optimal (use the next pointers you already built)   O(n) time, O(1) space
 * Once level k is linked, we can walk level k with `next` pointers like a linked list,
 * and link level k+1 as we go:
 *   node.left.next  = node.right                      (siblings)
 *   node.right.next = node.next ? node.next.left : null   (cousins, via parent's next)
 * Start from the root; after finishing a level, drop to its leftmost child.
 *
 * Dry run on [1,2,3,4,5,6,7]:
 *   level [1]:   2.next = 3; 1.next is null so 3.next = null
 *   level [2,3]: node 2: 4.next = 5, 5.next = 3.left = 6
 *                node 3: 6.next = 7, 7.next = null
 *   level [4..7]: leaves, nothing to link. done.
 *
 * EDGE CASES
 * - empty tree
 * - single node (next stays null)
 * - For a non-perfect tree (117) the O(1) version needs a "dummy head" per level; the
 *   BFS version works unchanged.
 */

// This problem uses its own node class because of the extra `next` field.
class Node {
  constructor(val, left = null, right = null, next = null) {
    this.val = val; this.left = left; this.right = right; this.next = next;
  }
}

function buildPerfect(values) {
  // level order, perfect tree, no nulls
  if (!values.length) return null;
  const nodes = values.map((v) => new Node(v));
  for (let i = 0; i < nodes.length; i++) {
    if (2 * i + 1 < nodes.length) nodes[i].left = nodes[2 * i + 1];
    if (2 * i + 2 < nodes.length) nodes[i].right = nodes[2 * i + 2];
  }
  return nodes[0];
}

// Read the levels using next pointers only (so the tests verify `next`, not the tree)
function readLevels(root) {
  const result = [];
  let levelStart = root;
  while (levelStart) {
    const level = [];
    for (let node = levelStart; node; node = node.next) level.push(node.val);
    level.push('#');
    result.push(level);
    levelStart = levelStart.left;
  }
  return result;
}

function bruteForce(root) {
  if (!root) return null;
  const queue = [root];
  while (queue.length) {
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      node.next = i < levelSize - 1 ? queue[0] : null; // the next one in the queue is my right neighbour
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  return root;
}

function optimal(root) {
  let levelStart = root;
  while (levelStart && levelStart.left) {      // while there is a level below
    for (let node = levelStart; node; node = node.next) {
      node.left.next = node.right;             // sibling link
      node.right.next = node.next ? node.next.left : null; // cousin link
    }
    levelStart = levelStart.left;              // go down one level
  }
  return root;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(readLevels(solve(buildPerfect([1, 2, 3, 4, 5, 6, 7]))),
    [[1, '#'], [2, 3, '#'], [4, 5, 6, 7, '#']]);
  assert.strictEqual(solve(null), null);
  assert.deepStrictEqual(readLevels(solve(buildPerfect([1]))), [[1, '#']]);
  assert.deepStrictEqual(readLevels(solve(buildPerfect([1, 2, 3]))), [[1, '#'], [2, 3, '#']]);
  assert.deepStrictEqual(
    readLevels(solve(buildPerfect([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])))[3],
    [8, 9, 10, 11, 12, 13, 14, 15, '#']
  );
}
console.log('✓ 16-populating-next-right-pointers passed');

module.exports = { optimal, bruteForce, Node };

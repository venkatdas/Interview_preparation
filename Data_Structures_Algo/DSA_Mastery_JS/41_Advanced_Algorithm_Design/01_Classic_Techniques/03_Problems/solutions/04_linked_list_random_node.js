/**
 * 04. Linked List Random Node   (LeetCode 382 — Medium)
 *
 * PROBLEM
 * Given a singly linked list, implement getRandom() that returns a node's value with every
 * node equally likely. Follow-up: the list is huge and its length is unknown, and you
 * cannot use extra space proportional to the length.
 *
 * EXAMPLES
 * list 1 -> 2 -> 3; getRandom() -> 1, 3, 2, 2, ... each with probability 1/3
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can we store the values in an array? (that is the easy version; the follow-up says no)
 * - Is the list static between calls? (yes)
 *
 * APPROACH 1 — Brute force   O(n) space, O(1) per getRandom
 * Copy all values into an array once; return a random index. Simple and fine unless the
 * follow-up forbids O(n) memory.
 *
 * APPROACH 2 — Optimal (Reservoir sampling, k = 1)   O(n) time per call, O(1) space
 * Walk the list. For the i-th node (1-indexed) replace the current pick with probability
 * 1 / i. Proof: node i is picked at step i with prob 1/i, and survives every later step j
 * with prob (1 - 1/j) = (j-1)/j. Product: 1/i * i/(i+1) * ... * (n-1)/n = 1/n.
 *
 * Dry run on 1 -> 2 -> 3:
 *   i=1: pick 1 (prob 1)
 *   i=2: replace with 2 with prob 1/2
 *   i=3: replace with 3 with prob 1/3
 *   P(3) = 1/3; P(2) = 1/2 * 2/3 = 1/3; P(1) = 1 * 1/2 * 2/3 = 1/3
 *
 * EDGE CASES
 * - single node -> always that value
 * - duplicate values are fine (nodes, not values, are uniform)
 */

function fromArray(values) {
  let head = null;
  for (let i = values.length - 1; i >= 0; i--) head = { val: values[i], next: head };
  return head;
}

class SolutionBrute {
  constructor(head) {
    this.values = [];
    for (let node = head; node; node = node.next) this.values.push(node.val);
  }
  getRandom() {
    return this.values[Math.floor(Math.random() * this.values.length)];
  }
}

class Solution {
  constructor(head) {
    this.head = head;
  }
  getRandom() {
    let pick = null;
    let seen = 0;
    for (let node = this.head; node; node = node.next) {
      seen++;
      if (Math.floor(Math.random() * seen) === 0) pick = node.val;   // probability 1 / seen
    }
    return pick;
  }
}

// ---------- tests ----------
const assert = require('assert');
for (const Cls of [SolutionBrute, Solution]) {
  assert.strictEqual(new Cls(fromArray([42])).getRandom(), 42);
  const s = new Cls(fromArray([1, 2, 3, 4]));
  const trials = 8000;
  const hits = new Map();
  for (let t = 0; t < trials; t++) {
    const v = s.getRandom();
    hits.set(v, (hits.get(v) || 0) + 1);
  }
  assert.strictEqual(hits.size, 4);
  for (const count of hits.values()) assert.ok(count > trials * 0.17 && count < trials * 0.33, `biased: ${[...hits]}`);
}
console.log('✓ 04-linked-list-random-node passed');

module.exports = { Solution, SolutionBrute, optimal: Solution, bruteForce: SolutionBrute, fromArray };

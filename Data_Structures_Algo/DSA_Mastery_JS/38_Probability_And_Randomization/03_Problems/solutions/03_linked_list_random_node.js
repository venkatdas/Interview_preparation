/**
 * 03. Linked List Random Node   (LeetCode 382 — Medium)
 *
 * PROBLEM
 * Given the head of a singly linked list, implement getRandom(): return the
 * value of a node chosen uniformly at random (each node with probability 1/n).
 * Follow-up: what if the list is huge and its length is unknown, and you
 * cannot use extra space?
 *
 * EXAMPLES
 * list 1 -> 2 -> 3
 * getRandom() -> 1, 2 or 3, each with probability 1/3
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is the list fixed after construction? (yes for the array approach to be valid)
 * - Is the length known? (follow-up: no -> reservoir sampling)
 * - Can the list be empty? (LeetCode: at least one node; we return undefined for null)
 *
 * APPROACH 1 — Brute force (copy to array)   O(n) build, O(1) per call, O(n) space
 * Walk the list once, push values into an array, then pick a random index.
 *
 * APPROACH 2 — Optimal for memory (reservoir sampling)   O(n) per call, O(1) space
 * Walk the list; at the i-th node (1-based) replace the answer with probability 1/i.
 * Node i is kept with probability 1/i * i/(i+1) * ... * (n-1)/n = 1/n.
 *
 * Dry run on 1 -> 2 -> 3 (rolls in brackets):
 *   node 1: i=1, keep with prob 1   -> ans = 1
 *   node 2: i=2, roll 0.9 < 1/2? no  -> ans = 1
 *   node 3: i=3, roll 0.2 < 1/3? yes -> ans = 3
 *
 * EDGE CASES
 * - single node -> always its value
 * - duplicate values -> each NODE is equally likely (values may repeat)
 * - empty list -> undefined
 */
const { mulberry32, looksUniform } = require('../../02_Implementations/randomization');

class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function fromArray(values) {
  let head = null;
  for (let i = values.length - 1; i >= 0; i--) head = new ListNode(values[i], head);
  return head;
}

class NaiveSolution {
  constructor(head, rng = Math.random) {
    this.rng = rng;
    this.values = [];
    for (let node = head; node; node = node.next) this.values.push(node.val);
  }
  getRandom() {
    if (this.values.length === 0) return undefined;
    return this.values[Math.floor(this.rng() * this.values.length)];
  }
}

class Solution {
  constructor(head, rng = Math.random) {
    this.head = head;
    this.rng = rng;
  }
  getRandom() {
    let answer;
    let i = 0;
    for (let node = this.head; node; node = node.next) {
      i++;
      if (Math.floor(this.rng() * i) === 0) answer = node.val; // prob 1/i
    }
    return answer;
  }
}

const bruteForce = (values, rng) => new NaiveSolution(fromArray(values), rng).getRandom();
const optimal = (values, rng) => new Solution(fromArray(values), rng).getRandom();

// ---------- tests ----------
const assert = require('assert');
const rng = mulberry32(382);
for (const Cls of [NaiveSolution, Solution]) {
  assert.strictEqual(new Cls(fromArray([42]), rng).getRandom(), 42);
  assert.strictEqual(new Cls(null, rng).getRandom(), undefined);
  const s = new Cls(fromArray([10, 20, 30, 40]), rng);
  const counts = new Map();
  for (let t = 0; t < 40000; t++) {
    const v = s.getRandom();
    counts.set(v, (counts.get(v) || 0) + 1);
  }
  assert.deepStrictEqual([...counts.keys()].sort((a, b) => a - b), [10, 20, 30, 40]);
  assert.ok(looksUniform([...counts.values()]), `${Cls.name} not uniform`);

  // duplicates: value 5 is on 2 of 3 nodes -> probability 2/3
  const d = new Cls(fromArray([5, 5, 9]), rng);
  const dc = [0, 0];
  for (let t = 0; t < 30000; t++) dc[d.getRandom() === 5 ? 0 : 1]++;
  assert.ok(looksUniform(dc, [2 / 3, 1 / 3]));
}
console.log('✓ 03_linked_list_random_node passed');

module.exports = { Solution, NaiveSolution, ListNode, fromArray, optimal, bruteForce };

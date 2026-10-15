/**
 * 04. Merge Two Sorted Lists (recursive)   (LeetCode 21 — Easy)
 *
 * PROBLEM
 * Given the heads of two sorted linked lists, splice them together into one sorted
 * list (reuse the nodes) and return its head.
 *
 * EXAMPLES
 * 1->2->4  and  1->3->4   =>   1->1->2->3->4->4
 * (empty)  and  (empty)   =>   (empty)
 * (empty)  and  0         =>   0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Lengths up to 50 each on LeetCode; values may repeat and be negative
 * - Stable for ties? (take from list1 first on ties)
 *
 * APPROACH 1 — Brute force (collect + sort + rebuild)   O((m+n) log(m+n)) time, O(m+n) space
 * Dump both lists into an array, sort, build a new list. Ignores that inputs are sorted.
 *
 * APPROACH 2 — Optimal (recursion)   O(m+n) time, O(m+n) stack space
 * PROMISE: merge(a, b) returns the head of the merged sorted list of a and b.
 *   base: if a is empty the answer is b (and vice versa)
 *   step: the smaller head must come first. Say a.val <= b.val:
 *         a.next = merge(a.next, b); return a.
 * Each call places exactly one node, so there are m + n calls.
 *
 * Dry run a = 1->4, b = 2->3:
 *   merge(1.., 2..): 1 <= 2 -> 1.next = merge(4, 2->3)
 *     merge(4, 2..): 2 < 4  -> 2.next = merge(4, 3)
 *       merge(4, 3): 3 < 4  -> 3.next = merge(4, null) = 4
 *   result 1->2->3->4
 *
 * EDGE CASES
 * - one or both lists empty
 * - all of one list smaller than the other (one long chain of the same branch)
 * - equal values: use <= to keep the merge stable
 */

class ListNode {
  constructor(val = 0, next = null) { this.val = val; this.next = next; }
}
const fromArray = (a) => a.reduceRight((next, v) => new ListNode(v, next), null);
const toArray = (h) => { const out = []; for (; h; h = h.next) out.push(h.val); return out; };

function bruteForce(a, b) {
  return fromArray([...toArray(a), ...toArray(b)].sort((x, y) => x - y));
}

function optimal(a, b) {
  if (a === null) return b;
  if (b === null) return a;
  if (a.val <= b.val) {           // a's head is smallest: it goes first
    a.next = optimal(a.next, b);
    return a;
  }
  b.next = optimal(a, b.next);
  return b;
}

// ---------- tests ----------
const assert = require('assert');
assert.deepStrictEqual(toArray(optimal(fromArray([1, 2, 4]), fromArray([1, 3, 4]))), [1, 1, 2, 3, 4, 4]);
assert.strictEqual(optimal(null, null), null);
assert.deepStrictEqual(toArray(optimal(null, fromArray([0]))), [0]);
assert.deepStrictEqual(toArray(optimal(fromArray([5, 6]), fromArray([1, 2, 3]))), [1, 2, 3, 5, 6]);
assert.deepStrictEqual(toArray(optimal(fromArray([-3, 0]), fromArray([-3, -1]))), [-3, -3, -1, 0]);
let seed = 21;
const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
const sortedRandom = () => Array.from({ length: Math.floor(rnd() * 15) }, () => Math.floor(rnd() * 40) - 20).sort((x, y) => x - y);
for (let t = 0; t < 200; t++) {
  const x = sortedRandom(), y = sortedRandom();
  assert.deepStrictEqual(toArray(optimal(fromArray(x), fromArray(y))), toArray(bruteForce(fromArray(x), fromArray(y))));
}
console.log('✓ 04_merge_two_sorted_lists passed');

module.exports = { optimal, bruteForce, ListNode, fromArray, toArray };

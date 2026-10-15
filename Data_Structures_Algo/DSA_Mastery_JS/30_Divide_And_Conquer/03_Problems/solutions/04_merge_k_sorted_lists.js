/**
 * 04. Merge k Sorted Lists   (LeetCode 23 — Hard)
 *
 * PROBLEM
 * You are given k linked lists, each sorted ascending. Merge them into one sorted list.
 *
 * EXAMPLES
 * Input: [[1,4,5],[1,3,4],[2,6]]   Output: [1,1,2,3,4,4,5,6]
 * Input: []                        Output: []
 * Input: [[]]                      Output: []
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - k up to 10^4, total nodes N up to 10^4 * 500
 * - Lists may be empty
 * - Can we reuse the nodes? (yes, relink them; no new nodes needed)
 *
 * APPROACH 1 — Brute force   O(N log N) time, O(N) space
 * Collect every value into an array, sort, rebuild a list. Simple and often accepted, but
 * it ignores that the inputs are already sorted.
 * (Another naive option: merge list 1 with list 2, then with list 3, ... = O(N * k).)
 *
 * APPROACH 2 — Optimal (Divide & conquer pairwise merge)   O(N log k) time, O(log k) stack
 * Merge lists [0..k/2) and [k/2..k) recursively, then merge the two results with the
 * standard two-list merge. Each recursion level merges every node once -> O(N) per level,
 * and there are log k levels.
 * (Equivalent alternative: a min-heap of k heads, also O(N log k), see ../../../19_Heaps_And_Priority_Queues/.)
 *
 * Dry run on [[1,4,5],[1,3,4],[2,6]]:
 *   split -> [[1,4,5]] and [[1,3,4],[2,6]]
 *   right splits -> [1,3,4] and [2,6] -> merge -> [1,2,3,4,6]
 *   top merge [1,4,5] with [1,2,3,4,6] -> [1,1,2,3,4,4,5,6]
 *
 * EDGE CASES
 * - k = 0 -> null
 * - all lists empty -> null
 * - one list -> itself
 * - duplicates across lists
 */

// Minimal linked-list helpers (plain objects: { val, next })
function fromArray(values) {
  let head = null;
  for (let i = values.length - 1; i >= 0; i--) head = { val: values[i], next: head };
  return head;
}
function toArray(head) {
  const out = [];
  for (let node = head; node; node = node.next) out.push(node.val);
  return out;
}

function bruteForce(lists) {
  const values = [];
  for (const head of lists) for (let node = head; node; node = node.next) values.push(node.val);
  values.sort((a, b) => a - b);
  return fromArray(values);
}

function mergeTwo(a, b) {
  const dummy = { val: 0, next: null };
  let tail = dummy;
  while (a && b) {
    if (a.val <= b.val) {
      tail.next = a;
      a = a.next;
    } else {
      tail.next = b;
      b = b.next;
    }
    tail = tail.next;
  }
  tail.next = a || b;                      // attach whatever is left
  return dummy.next;
}

function optimal(lists) {
  if (lists.length === 0) return null;
  function mergeRange(lo, hi) {            // merges lists[lo..hi] inclusive
    if (lo === hi) return lists[lo];
    const mid = (lo + hi) >> 1;
    return mergeTwo(mergeRange(lo, mid), mergeRange(mid + 1, hi));
  }
  return mergeRange(0, lists.length - 1);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(toArray(solve([fromArray([1, 4, 5]), fromArray([1, 3, 4]), fromArray([2, 6])])), [1, 1, 2, 3, 4, 4, 5, 6]);
  assert.deepStrictEqual(toArray(solve([])), []);
  assert.deepStrictEqual(toArray(solve([null])), []);
  assert.deepStrictEqual(toArray(solve([null, fromArray([1])])), [1]);
  assert.deepStrictEqual(toArray(solve([fromArray([-5, 0])])), [-5, 0]);
  assert.deepStrictEqual(toArray(solve([fromArray([2, 2]), fromArray([2])])), [2, 2, 2]);
}
for (let trial = 0; trial < 200; trial++) {
  const k = Math.floor(Math.random() * 6);
  const arrays = Array.from({ length: k }, () =>
    Array.from({ length: Math.floor(Math.random() * 6) }, () => Math.floor(Math.random() * 20) - 10).sort((a, b) => a - b));
  const expected = arrays.flat().sort((a, b) => a - b);
  assert.deepStrictEqual(toArray(optimal(arrays.map(fromArray))), expected);
  assert.deepStrictEqual(toArray(bruteForce(arrays.map(fromArray))), expected);
}
console.log('✓ 04-merge-k-sorted-lists passed');

module.exports = { optimal, bruteForce, fromArray, toArray };

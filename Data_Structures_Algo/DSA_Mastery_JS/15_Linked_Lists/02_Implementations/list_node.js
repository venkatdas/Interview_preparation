/**
 * Minimal ListNode + helpers shared by every problem in problems/.
 *
 *   const { ListNode, toList, toArray } = require('../list-node');
 *
 * ListNode(val, next)  - the exact shape LeetCode uses
 * toList([1,2,3])      - builds 1 -> 2 -> 3 -> null and returns the head
 * toArray(head)        - walks the list and returns [1,2,3] (stops after 10_000
 *                        nodes so a cycle can't hang your test)
 * toCyclicList(arr, pos) - builds a list whose tail points back to index pos
 *                          (pos = -1 means no cycle). Used by cycle problems.
 */

class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

function toList(values) {
  // Build from the back so each new node already knows its "next".
  let head = null;
  for (let i = values.length - 1; i >= 0; i--) {
    head = new ListNode(values[i], head);
  }
  return head;
}

function toArray(head, limit = 10000) {
  const out = [];
  let current = head;
  while (current && out.length < limit) {
    out.push(current.val);
    current = current.next;
  }
  return out;
}

function toCyclicList(values, pos) {
  const head = toList(values);
  if (pos < 0 || !head) return head;
  let tail = head;
  let cycleStart = null;
  let index = 0;
  while (tail.next) {
    if (index === pos) cycleStart = tail;
    tail = tail.next;
    index++;
  }
  if (index === pos) cycleStart = tail; // pos points at the last node itself
  tail.next = cycleStart;
  return head;
}

// ---------- self-test ----------
// Runs only when you execute `node list-node.js` directly, not when a problem
// file requires this module.
if (require.main === module) {
const assert = require('assert');

assert.strictEqual(toList([]), null);
assert.deepStrictEqual(toArray(toList([1, 2, 3])), [1, 2, 3]);
assert.deepStrictEqual(toArray(null), []);

const single = toList([7]);
assert.strictEqual(single.val, 7);
assert.strictEqual(single.next, null);

const cyclic = toCyclicList([1, 2, 3], 1);
assert.strictEqual(cyclic.next.next.next, cyclic.next); // 3 -> 2
assert.strictEqual(toArray(cyclic, 7).length, 7);       // limit stops the walk

const noCycle = toCyclicList([1, 2], -1);
assert.strictEqual(noCycle.next.next, null);

console.log('✓ list-node.js self-test passed');
}

module.exports = { ListNode, toList, toArray, toCyclicList };

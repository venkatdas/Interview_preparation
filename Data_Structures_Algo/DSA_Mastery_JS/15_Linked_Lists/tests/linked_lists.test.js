// node --test 15_Linked_Lists/tests/linked_lists.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { ListNode, toList, toArray, toCyclicList } = require('../02_Implementations/list_node');
const { SinglyLinkedList } = require('../02_Implementations/singly_linked_list');
const { DoublyLinkedList } = require('../02_Implementations/doubly_linked_list');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('list_node helpers', () => {
  it('toList / toArray round-trip, including empty', () => {
    assert.equal(toList([]), null);
    assert.deepEqual(toArray(null), []);
    assert.deepEqual(toArray(toList([3, -1, 3])), [3, -1, 3]);
    assert.ok(toList([1]) instanceof ListNode);
  });
  it('toCyclicList links the tail to position pos; pos -1 means no cycle', () => {
    const h = toCyclicList([1, 2, 3, 4], 1);
    let tail = h; for (let i = 0; i < 3; i++) tail = tail.next;
    assert.equal(tail.next, h.next);
    assert.deepEqual(toArray(toCyclicList([1, 2], -1)), [1, 2]);
    const self = toCyclicList([9], 0);
    assert.equal(self.next, self);
    assert.equal(toArray(self, 5).length, 5); // limit guards against infinite loops
  });
});

// Runs the same random operations on a list class and a plain array model.
function fuzz(ListClass, seed) {
  const rnd = mulberry32(seed);
  const list = new ListClass();
  const model = [];
  for (let step = 0; step < 2000; step++) {
    const op = Math.floor(rnd() * 8);
    const v = Math.floor(rnd() * 21) - 10; // negatives and duplicates
    const i = Math.floor(rnd() * (model.length + 2)) - 1; // includes out-of-range -1 and length
    if (op === 0) { list.push(v); model.push(v); }
    else if (op === 1) { list.unshift(v); model.unshift(v); }
    else if (op === 2) assert.equal(list.pop(), model.pop());
    else if (op === 3) assert.equal(list.shift(), model.shift());
    else if (op === 4) {
      const ok = list.insert(i, v);
      if (i >= 0 && i <= model.length) { assert.equal(ok, true); model.splice(i, 0, v); } else assert.equal(ok, false);
    } else if (op === 5) {
      const got = list.remove(i);
      if (i >= 0 && i < model.length) assert.equal(got, model.splice(i, 1)[0]); else assert.equal(got, undefined);
    } else if (op === 6) {
      const node = list.get(i);
      if (i >= 0 && i < model.length) assert.equal(node.value, model[i]); else assert.equal(node, null);
    } else { list.reverse(); model.reverse(); }
    assert.equal(list.length, model.length);
    assert.deepEqual(list.toArray(), model);
    assert.equal(list.isEmpty(), model.length === 0);
    if (model.length === 0) { assert.equal(list.head, null); assert.equal(list.tail, null); }
    else { assert.equal(list.head.value, model[0]); assert.equal(list.tail.value, model[model.length - 1]); }
  }
  return list;
}

describe('SinglyLinkedList', () => {
  it('empty list operations return sentinel values', () => {
    const l = new SinglyLinkedList();
    assert.equal(l.pop(), undefined);
    assert.equal(l.shift(), undefined);
    assert.equal(l.get(0), null);
    assert.equal(l.set(0, 1), false);
    assert.equal(l.indexOf(1), -1);
    assert.deepEqual(l.reverse().toArray(), []);
    assert.equal(l.toString(), ' -> null');
  });
  it('fromArray, indexOf with duplicates returns first index, set updates', () => {
    const l = SinglyLinkedList.fromArray([5, 7, 5]);
    assert.equal(l.indexOf(5), 0);
    assert.equal(l.set(2, 9), true);
    assert.deepEqual(l.toArray(), [5, 7, 9]);
    assert.equal(l.toString(), '5 -> 7 -> 9 -> null');
  });
  it('single element: pop clears head and tail', () => {
    const l = SinglyLinkedList.fromArray([1]);
    assert.equal(l.pop(), 1);
    assert.equal(l.head, null);
    assert.equal(l.tail, null);
  });
  it('matches an array model on random operations', () => { fuzz(SinglyLinkedList, 15); fuzz(SinglyLinkedList, 99); });
});

describe('DoublyLinkedList', () => {
  it('prev pointers are consistent with next pointers', () => {
    const l = fuzz(DoublyLinkedList, 7);
    assert.deepEqual(l.toArrayReversed(), [...l.toArray()].reverse());
    let n = l.head, prev = null;
    while (n) { assert.equal(n.prev, prev); prev = n; n = n.next; }
  });
  it('removeNode works on head, middle and tail references in O(1)', () => {
    const l = DoublyLinkedList.fromArray([1, 2, 3, 4]);
    assert.equal(l.removeNode(l.get(1)), 2);
    assert.equal(l.removeNode(l.head), 1);
    assert.equal(l.removeNode(l.tail), 4);
    assert.deepEqual(l.toArray(), [3]);
    assert.deepEqual(l.toArrayReversed(), [3]);
  });
  it('matches an array model on random operations', () => { fuzz(DoublyLinkedList, 1); fuzz(DoublyLinkedList, 2024); });
});

describe('selected solutions on extra edge cases', () => {
  const rev = require('../03_Problems/solutions/01_reverse_linked_list');
  const cyc2 = require('../03_Problems/solutions/04_linked_list_cycle_ii');
  const nth = require('../03_Problems/solutions/06_remove_nth_from_end');
  const kg = require('../03_Problems/solutions/17_reverse_nodes_in_k_group');
  const sort = require('../03_Problems/solutions/19_sort_list');
  const { LRUCache, LRUCacheBrute } = require('../03_Problems/solutions/20_lru_cache');
  it('reverse: empty, single, iterative and recursive agree', () => {
    assert.equal(rev.optimal(null), null);
    assert.deepEqual(toArray(rev.optimal(toList([1]))), [1]);
    assert.deepEqual(toArray(rev.recursive(toList([1, 2, 2, -3]))), [-3, 2, 2, 1]);
  });
  it('cycle II: cycle at head, self loop, no cycle', () => {
    const a = toCyclicList([1, 2, 3], 0); assert.equal(cyc2.optimal(a), a);
    const s = toCyclicList([7], 0); assert.equal(cyc2.optimal(s), s);
    assert.equal(cyc2.optimal(toList([1, 2, 3])), null);
    assert.equal(cyc2.optimal(null), null);
  });
  it('remove nth from end: remove the head, remove the only node', () => {
    assert.deepEqual(toArray(nth.optimal(toList([1, 2, 3]), 3)), [2, 3]);
    assert.deepEqual(toArray(nth.optimal(toList([1]), 1)), []);
    assert.deepEqual(toArray(nth.optimal(toList([1, 2]), 1)), [1]);
  });
  it('reverse k-group: k = 1, k = length, leftover tail stays', () => {
    assert.deepEqual(toArray(kg.optimal(toList([1, 2, 3]), 1)), [1, 2, 3]);
    assert.deepEqual(toArray(kg.optimal(toList([1, 2, 3]), 3)), [3, 2, 1]);
    assert.deepEqual(toArray(kg.optimal(toList([1, 2, 3, 4, 5]), 2)), [2, 1, 4, 3, 5]);
  });
  it('sort list matches Array sort on random input (negatives, duplicates, sorted, reversed)', () => {
    const rnd = mulberry32(19);
    assert.equal(sort.optimal(null), null);
    for (let t = 0; t < 200; t++) {
      const n = Math.floor(rnd() * 30);
      let arr = Array.from({ length: n }, () => Math.floor(rnd() * 21) - 10);
      if (t % 3 === 1) arr.sort((a, b) => a - b);
      if (t % 3 === 2) arr.sort((a, b) => b - a);
      assert.deepEqual(toArray(sort.optimal(toList(arr))), [...arr].sort((a, b) => a - b));
    }
  });
  it('LRU cache matches the brute-force cache on random operations', () => {
    const rnd = mulberry32(146);
    for (let t = 0; t < 30; t++) {
      const cap = 1 + Math.floor(rnd() * 4);
      const a = new LRUCache(cap), b = new LRUCacheBrute(cap);
      for (let s = 0; s < 200; s++) {
        const k = Math.floor(rnd() * 6);
        if (rnd() < 0.5) assert.equal(a.get(k), b.get(k));
        else { const v = Math.floor(rnd() * 100); a.put(k, v); b.put(k, v); }
      }
    }
  });
});

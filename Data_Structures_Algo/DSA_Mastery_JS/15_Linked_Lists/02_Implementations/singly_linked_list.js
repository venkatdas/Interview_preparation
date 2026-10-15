/**
 * Singly linked list in JavaScript.
 *
 * Each node knows its value and the NEXT node only. The list object keeps a
 * pointer to the head (first node), the tail (last node) and a length counter,
 * so push and unshift are O(1) and we never have to walk to count.
 *
 *   head                                  tail
 *    |                                      |
 *   [1] -> [2] -> [3] -> [4] -> null
 *
 * Operations:
 *   push(value)       add at the end            O(1)
 *   unshift(value)    add at the front          O(1)
 *   pop()             remove from the end       O(n)  (must find the new tail)
 *   shift()           remove from the front     O(1)
 *   get(index)        node at index             O(n)
 *   set(index, value) overwrite value at index  O(n)
 *   insert(index, v)  insert before index       O(n)
 *   remove(index)     remove node at index      O(n)
 *   reverse()         reverse in place          O(n)
 *   toArray()         [values...]               O(n)
 *   SinglyLinkedList.fromArray([...])           O(n)
 *   for (const v of list) ...                   iterator
 */

class Node {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

class SinglyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  static fromArray(values) {
    const list = new SinglyLinkedList();
    for (const value of values) list.push(value);
    return list;
  }

  // ---- add ----

  push(value) {
    const node = new Node(value);
    if (!this.head) {
      // empty list: the new node is both the first and the last node
      this.head = node;
      this.tail = node;
    } else {
      this.tail.next = node; // old tail now points to the new node
      this.tail = node;      // and the new node becomes the tail
    }
    this.length++;
    return this;
  }

  unshift(value) {
    // the new node points to the old head, then becomes the head
    const node = new Node(value, this.head);
    this.head = node;
    if (!this.tail) this.tail = node; // list was empty
    this.length++;
    return this;
  }

  insert(index, value) {
    if (index < 0 || index > this.length) return false;
    if (index === 0) return !!this.unshift(value);
    if (index === this.length) return !!this.push(value);

    const before = this.get(index - 1);            // node currently at index-1
    before.next = new Node(value, before.next);    // splice between before and before.next
    this.length++;
    return true;
  }

  // ---- remove ----

  shift() {
    if (!this.head) return undefined;
    const removed = this.head;
    this.head = removed.next;
    this.length--;
    if (this.length === 0) this.tail = null; // we removed the only node
    removed.next = null;                     // detach so the node can't leak the list
    return removed.value;
  }

  pop() {
    if (!this.head) return undefined;
    if (this.length === 1) return this.shift();

    // A singly list cannot walk backwards, so we must find the node BEFORE the tail.
    let beforeTail = this.head;
    while (beforeTail.next !== this.tail) beforeTail = beforeTail.next;

    const removed = this.tail;
    beforeTail.next = null;
    this.tail = beforeTail;
    this.length--;
    return removed.value;
  }

  remove(index) {
    if (index < 0 || index >= this.length) return undefined;
    if (index === 0) return this.shift();
    if (index === this.length - 1) return this.pop();

    const before = this.get(index - 1);
    const removed = before.next;
    before.next = removed.next; // skip over the removed node
    removed.next = null;
    this.length--;
    return removed.value;
  }

  // ---- read / write ----

  get(index) {
    if (index < 0 || index >= this.length) return null;
    let current = this.head;
    for (let i = 0; i < index; i++) current = current.next;
    return current;
  }

  set(index, value) {
    const node = this.get(index);
    if (!node) return false;
    node.value = value;
    return true;
  }

  indexOf(value) {
    let index = 0;
    for (const item of this) {
      if (item === value) return index;
      index++;
    }
    return -1;
  }

  // ---- whole-list operations ----

  reverse() {
    // Classic 3-pointer reversal: prev, current, next.
    // At each step flip ONE arrow (current.next = prev) and move everything right.
    let prev = null;
    let current = this.head;
    this.tail = this.head; // old head becomes the new tail
    while (current) {
      const next = current.next; // save before we overwrite the arrow
      current.next = prev;       // flip the arrow
      prev = current;            // advance prev
      current = next;            // advance current
    }
    this.head = prev; // prev ends on the old tail = new head
    return this;
  }

  toArray() {
    return [...this];
  }

  *[Symbol.iterator]() {
    let current = this.head;
    while (current) {
      yield current.value;
      current = current.next;
    }
  }

  isEmpty() {
    return this.length === 0;
  }

  toString() {
    return this.toArray().join(' -> ') + ' -> null';
  }
}

// ---------- self-test ----------
const assert = require('assert');

const list = new SinglyLinkedList();
assert.strictEqual(list.isEmpty(), true);
assert.strictEqual(list.pop(), undefined);
assert.strictEqual(list.shift(), undefined);

list.push(2).push(3);
list.unshift(1);
assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
assert.strictEqual(list.length, 3);
assert.strictEqual(list.head.value, 1);
assert.strictEqual(list.tail.value, 3);

assert.strictEqual(list.get(1).value, 2);
assert.strictEqual(list.get(5), null);
assert.strictEqual(list.set(1, 20), true);
assert.strictEqual(list.set(9, 0), false);
assert.deepStrictEqual(list.toArray(), [1, 20, 3]);

assert.strictEqual(list.insert(1, 10), true);        // middle
assert.strictEqual(list.insert(0, 0), true);         // front
assert.strictEqual(list.insert(list.length, 4), true); // end
assert.strictEqual(list.insert(99, 4), false);
assert.deepStrictEqual(list.toArray(), [0, 1, 10, 20, 3, 4]);
assert.strictEqual(list.tail.value, 4);

assert.strictEqual(list.remove(2), 10);
assert.strictEqual(list.remove(0), 0);
assert.strictEqual(list.remove(list.length - 1), 4);
assert.strictEqual(list.remove(42), undefined);
assert.deepStrictEqual(list.toArray(), [1, 20, 3]);
assert.strictEqual(list.tail.value, 3);

list.reverse();
assert.deepStrictEqual(list.toArray(), [3, 20, 1]);
assert.strictEqual(list.head.value, 3);
assert.strictEqual(list.tail.value, 1);
assert.strictEqual(list.tail.next, null);

assert.strictEqual(list.pop(), 1);
assert.strictEqual(list.shift(), 3);
assert.strictEqual(list.pop(), 20);
assert.strictEqual(list.length, 0);
assert.strictEqual(list.head, null);
assert.strictEqual(list.tail, null);

const fromArr = SinglyLinkedList.fromArray([5, 6, 7]);
assert.strictEqual(fromArr.indexOf(6), 1);
assert.strictEqual(fromArr.indexOf(99), -1);
assert.strictEqual(fromArr.toString(), '5 -> 6 -> 7 -> null');
assert.deepStrictEqual([...fromArr], [5, 6, 7]);

const one = SinglyLinkedList.fromArray([1]).reverse();
assert.deepStrictEqual(one.toArray(), [1]);
assert.deepStrictEqual(new SinglyLinkedList().reverse().toArray(), []);

console.log('✓ singly-linked-list.js self-test passed');

module.exports = { SinglyLinkedList, Node };

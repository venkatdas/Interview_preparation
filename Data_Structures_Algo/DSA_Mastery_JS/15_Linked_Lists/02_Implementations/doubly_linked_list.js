/**
 * Doubly linked list in JavaScript.
 *
 * Every node has TWO pointers: next and prev. That costs one extra pointer per
 * node but buys us:
 *   - O(1) pop()  (we can step back from the tail, no walking)
 *   - O(1) removal of ANY node we already hold a reference to
 *   - walking backwards
 *
 *   null <- [1] <-> [2] <-> [3] -> null
 *           head              tail
 *
 * get(index) walks from whichever end is closer, so it does at most n/2 steps.
 *
 * This is the structure behind LRU Cache (03_Problems/solutions/20_lru_cache.js) and
 * the Deque in 17_Queues_And_Deques/queue.js.
 */

class DoublyNode {
  constructor(value, prev = null, next = null) {
    this.value = value;
    this.prev = prev;
    this.next = next;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  static fromArray(values) {
    const list = new DoublyLinkedList();
    for (const value of values) list.push(value);
    return list;
  }

  // ---- add ----

  push(value) {
    const node = new DoublyNode(value, this.tail, null);
    if (!this.head) {
      this.head = node;
    } else {
      this.tail.next = node; // link old tail forward to the new node
    }
    this.tail = node;
    this.length++;
    return this;
  }

  unshift(value) {
    const node = new DoublyNode(value, null, this.head);
    if (!this.tail) {
      this.tail = node;
    } else {
      this.head.prev = node; // link old head backward to the new node
    }
    this.head = node;
    this.length++;
    return this;
  }

  insert(index, value) {
    if (index < 0 || index > this.length) return false;
    if (index === 0) return !!this.unshift(value);
    if (index === this.length) return !!this.push(value);

    const after = this.get(index);  // node currently sitting at index
    const before = after.prev;
    const node = new DoublyNode(value, before, after);
    before.next = node; // 4 pointer updates: before->node, node->after, node<-after, before<-node
    after.prev = node;
    this.length++;
    return true;
  }

  // ---- remove ----

  shift() {
    if (!this.head) return undefined;
    return this.removeNode(this.head);
  }

  pop() {
    if (!this.tail) return undefined;
    return this.removeNode(this.tail); // O(1): tail.prev is known
  }

  remove(index) {
    const node = this.get(index);
    if (!node) return undefined;
    return this.removeNode(node);
  }

  // Unlink a node we already hold. This O(1) operation is the whole reason
  // doubly linked lists exist (LRU cache uses it on every access).
  removeNode(node) {
    const { prev, next } = node;
    if (prev) prev.next = next; else this.head = next; // node was the head
    if (next) next.prev = prev; else this.tail = prev; // node was the tail
    node.prev = null;
    node.next = null;
    this.length--;
    return node.value;
  }

  // ---- read / write ----

  get(index) {
    if (index < 0 || index >= this.length) return null;
    let current;
    if (index < this.length / 2) {
      // closer to the front: walk forward
      current = this.head;
      for (let i = 0; i < index; i++) current = current.next;
    } else {
      // closer to the back: walk backward
      current = this.tail;
      for (let i = this.length - 1; i > index; i--) current = current.prev;
    }
    return current;
  }

  set(index, value) {
    const node = this.get(index);
    if (!node) return false;
    node.value = value;
    return true;
  }

  // ---- whole-list operations ----

  reverse() {
    // For each node swap prev and next, then swap head and tail.
    let current = this.head;
    while (current) {
      [current.prev, current.next] = [current.next, current.prev];
      current = current.prev; // prev is now the OLD next, so this moves forward
    }
    [this.head, this.tail] = [this.tail, this.head];
    return this;
  }

  toArray() {
    return [...this];
  }

  toArrayReversed() {
    const out = [];
    for (let current = this.tail; current; current = current.prev) out.push(current.value);
    return out;
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
    return 'null <- ' + this.toArray().join(' <-> ') + ' -> null';
  }
}

// ---------- self-test ----------
const assert = require('assert');

const list = new DoublyLinkedList();
assert.strictEqual(list.pop(), undefined);
assert.strictEqual(list.shift(), undefined);

list.push(2).push(3).unshift(1);
assert.deepStrictEqual(list.toArray(), [1, 2, 3]);
assert.deepStrictEqual(list.toArrayReversed(), [3, 2, 1]);
assert.strictEqual(list.head.prev, null);
assert.strictEqual(list.tail.next, null);
assert.strictEqual(list.tail.prev.value, 2);

assert.strictEqual(list.get(0).value, 1);
assert.strictEqual(list.get(2).value, 3); // walks from tail
assert.strictEqual(list.get(3), null);
assert.strictEqual(list.set(2, 30), true);

assert.strictEqual(list.insert(1, 15), true);
assert.strictEqual(list.insert(0, 0), true);
assert.strictEqual(list.insert(list.length, 40), true);
assert.strictEqual(list.insert(-1, 0), false);
assert.deepStrictEqual(list.toArray(), [0, 1, 15, 2, 30, 40]);
assert.deepStrictEqual(list.toArrayReversed(), [40, 30, 2, 15, 1, 0]);

assert.strictEqual(list.remove(2), 15);
assert.strictEqual(list.shift(), 0);
assert.strictEqual(list.pop(), 40);
assert.deepStrictEqual(list.toArray(), [1, 2, 30]);
assert.strictEqual(list.length, 3);

// removeNode on a held reference
const middle = list.get(1);
assert.strictEqual(list.removeNode(middle), 2);
assert.deepStrictEqual(list.toArray(), [1, 30]);
assert.strictEqual(list.head.next, list.tail);
assert.strictEqual(list.tail.prev, list.head);

list.reverse();
assert.deepStrictEqual(list.toArray(), [30, 1]);
assert.strictEqual(list.head.prev, null);
assert.strictEqual(list.tail.next, null);

assert.strictEqual(list.pop(), 1);
assert.strictEqual(list.pop(), 30);
assert.strictEqual(list.head, null);
assert.strictEqual(list.tail, null);
assert.strictEqual(list.isEmpty(), true);

const built = DoublyLinkedList.fromArray([1, 2, 3, 4]);
assert.strictEqual(built.toString(), 'null <- 1 <-> 2 <-> 3 <-> 4 -> null');
assert.deepStrictEqual(DoublyLinkedList.fromArray([]).reverse().toArray(), []);
assert.deepStrictEqual(DoublyLinkedList.fromArray([9]).reverse().toArray(), [9]);

console.log('✓ doubly-linked-list.js self-test passed');

module.exports = { DoublyLinkedList, DoublyNode };

/**
 * Stack implementations in JavaScript.
 *
 * 1. Stack          - array based (what you use 99% of the time)
 * 2. LinkedStack    - linked-list based (shows the idea without dynamic arrays)
 * 3. MinStack       - supports getMin() in O(1) using a second stack
 *
 * All operations are O(1).
 */

// ---------- 1. Array-based stack ----------
class Stack {
  #items = [];

  push(value) {
    this.#items.push(value);
    return this; // allow chaining: stack.push(1).push(2)
  }

  pop() {
    if (this.isEmpty()) throw new Error('pop from empty stack');
    return this.#items.pop();
  }

  peek() {
    if (this.isEmpty()) return undefined;
    return this.#items[this.#items.length - 1];
  }

  isEmpty() {
    return this.#items.length === 0;
  }

  size() {
    return this.#items.length;
  }

  clear() {
    this.#items = [];
  }

  toArray() {
    return [...this.#items]; // bottom -> top
  }
}

// ---------- 2. Linked-list based stack ----------
// The "top" is the HEAD of the list, so push/pop never walk the list.
class LinkedStack {
  #head = null;
  #size = 0;

  push(value) {
    // new node points to the old head, then becomes the head
    this.#head = { value, next: this.#head };
    this.#size++;
    return this;
  }

  pop() {
    if (!this.#head) throw new Error('pop from empty stack');
    const { value } = this.#head;
    this.#head = this.#head.next;
    this.#size--;
    return value;
  }

  peek() {
    return this.#head ? this.#head.value : undefined;
  }

  isEmpty() {
    return this.#size === 0;
  }

  size() {
    return this.#size;
  }
}

// ---------- 3. MinStack ----------
// Keep a parallel stack whose top is always the minimum of everything below.
// Push onto minStack only when the new value is <= current min (so duplicates work).
class MinStack {
  #stack = [];
  #mins = [];

  push(value) {
    this.#stack.push(value);
    if (this.#mins.length === 0 || value <= this.getMin()) {
      this.#mins.push(value);
    }
  }

  pop() {
    const value = this.#stack.pop();
    if (value === this.getMin()) this.#mins.pop();
    return value;
  }

  top() {
    return this.#stack[this.#stack.length - 1];
  }

  getMin() {
    return this.#mins[this.#mins.length - 1];
  }
}

// ---------- self-test ----------
const assert = require('assert');

const s = new Stack();
assert.strictEqual(s.isEmpty(), true);
s.push(1).push(2).push(3);
assert.strictEqual(s.size(), 3);
assert.strictEqual(s.peek(), 3);
assert.strictEqual(s.pop(), 3);
assert.strictEqual(s.pop(), 2);
assert.deepStrictEqual(s.toArray(), [1]);
assert.throws(() => new Stack().pop());

const ls = new LinkedStack();
ls.push('a').push('b');
assert.strictEqual(ls.peek(), 'b');
assert.strictEqual(ls.pop(), 'b');
assert.strictEqual(ls.pop(), 'a');
assert.strictEqual(ls.isEmpty(), true);

const ms = new MinStack();
ms.push(5); ms.push(3); ms.push(3); ms.push(7);
assert.strictEqual(ms.getMin(), 3);
ms.pop();            // removes 7
assert.strictEqual(ms.getMin(), 3);
ms.pop();            // removes one 3, the other 3 is still min
assert.strictEqual(ms.getMin(), 3);
ms.pop();            // removes last 3
assert.strictEqual(ms.getMin(), 5);

console.log('✓ stack.js self-test passed');

module.exports = { Stack, LinkedStack, MinStack };

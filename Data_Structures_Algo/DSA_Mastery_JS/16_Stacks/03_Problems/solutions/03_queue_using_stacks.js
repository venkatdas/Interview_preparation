/**
 * 03. Implement Queue using Stacks   (LeetCode 232 — Easy)
 *
 * PROBLEM
 * Implement a FIFO queue (push, pop, peek, empty) using only stack operations
 * (push to top, pop from top, peek top, size, isEmpty).
 *
 * EXAMPLES
 * push(1) push(2)  peek() -> 1  pop() -> 1  empty() -> false
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Are pop/peek called only on a non-empty queue? (yes)
 * - Is amortized O(1) acceptable, or must every call be O(1)? (amortized is the follow-up goal)
 *
 * NAIVE APPROACH   O(n) push, O(1) pop
 * Keep the stack in "queue order" at all times: on every push, move everything
 * to a helper stack, push the new value, move everything back. The new element
 * ends up at the BOTTOM, so pop from the top gives the oldest element.
 * Works, but every push costs O(n).
 *
 * APPROACH — Optimal (two stacks: inbox and outbox, amortized O(1))
 *   push(x):  inbox.push(x)
 *   pop/peek: if outbox is empty, pour ALL of inbox into outbox (this reverses
 *             the order, so the oldest element is now on top of outbox).
 *             Then pop/peek from outbox.
 * Each element is moved from inbox to outbox at most ONCE in its lifetime, so
 * over n operations the total work is O(n) -> amortized O(1) per operation.
 *
 * Dry run: push(1) push(2) push(3) pop() push(4) pop() pop() pop()
 *   push 1,2,3      inbox [1,2,3]   outbox []
 *   pop: pour ->    inbox []        outbox [3,2,1]  pop -> 1
 *   push 4          inbox [4]       outbox [3,2]
 *   pop -> 2 (outbox not empty, no pouring)
 *   pop -> 3
 *   pop: outbox empty, pour -> outbox [4]  pop -> 4
 *
 * EDGE CASES
 * - interleaved pushes and pops (never pour while outbox still has items,
 *   or the order breaks)
 * - empty() must consider both stacks
 */

class MyQueueNaive {
  #stack = [];
  push(value) {
    const helper = [];
    while (this.#stack.length) helper.push(this.#stack.pop());
    this.#stack.push(value);
    while (helper.length) this.#stack.push(helper.pop());
  }
  pop() { return this.#stack.pop(); }
  peek() { return this.#stack[this.#stack.length - 1]; }
  empty() { return this.#stack.length === 0; }
}

class MyQueue {
  #inbox = [];
  #outbox = [];

  push(value) {
    this.#inbox.push(value);
  }

  // Move everything from inbox to outbox, but ONLY when outbox is empty.
  #shiftIfNeeded() {
    if (this.#outbox.length === 0) {
      while (this.#inbox.length) this.#outbox.push(this.#inbox.pop());
    }
  }

  pop() {
    this.#shiftIfNeeded();
    return this.#outbox.pop();
  }

  peek() {
    this.#shiftIfNeeded();
    return this.#outbox[this.#outbox.length - 1];
  }

  empty() {
    return this.#inbox.length === 0 && this.#outbox.length === 0;
  }
}

// ---------- tests ----------
const assert = require('assert');
for (const Impl of [MyQueueNaive, MyQueue]) {
  const q = new Impl();
  assert.strictEqual(q.empty(), true);
  q.push(1); q.push(2);
  assert.strictEqual(q.peek(), 1);
  assert.strictEqual(q.pop(), 1);
  assert.strictEqual(q.empty(), false);

  q.push(3);
  assert.strictEqual(q.pop(), 2);
  assert.strictEqual(q.pop(), 3);
  assert.strictEqual(q.empty(), true);

  // interleaving
  q.push(1); q.push(2); q.push(3);
  assert.strictEqual(q.pop(), 1);
  q.push(4);
  assert.strictEqual(q.pop(), 2);
  assert.strictEqual(q.pop(), 3);
  assert.strictEqual(q.pop(), 4);
  assert.strictEqual(q.empty(), true);

  q.push(-5);
  assert.strictEqual(q.peek(), -5);
}
console.log('✓ 03-queue-using-stacks passed');

module.exports = { MyQueue, MyQueueNaive };

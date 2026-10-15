/**
 * 02. Implement Queue using Stacks   (LeetCode 232 — Easy)
 *
 * PROBLEM
 * Implement a FIFO queue (push, pop, peek, empty) using only stacks
 * (push to top, pop from top, peek top, size, isEmpty).
 * (Also in 16_Stacks/problems/03 - it belongs to both topics. Here the focus
 * is the amortized analysis, which queue questions love to ask about.)
 *
 * EXAMPLES
 * push(1) push(2)  peek() -> 1  pop() -> 1  empty() -> false
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - pop/peek only on a non-empty queue? (yes)
 * - "Amortized O(1)" acceptable? (yes - and be ready to explain what it means)
 *
 * NAIVE APPROACH   O(n) push, O(1) pop
 * Keep a single stack in queue order: on push, pour everything into a helper,
 * push the new value, pour everything back. The newest value is at the bottom,
 * so pop from the top returns the oldest. Every push costs O(n).
 *
 * APPROACH — Optimal (inbox + outbox, amortized O(1))
 *   push:      inbox.push(x)
 *   pop/peek:  if outbox is empty, pour ALL of inbox into outbox (reverses order).
 *              Then use outbox's top.
 *
 * Amortized argument: each element is pushed onto inbox once, popped from inbox
 * once, pushed onto outbox once, popped from outbox once - 4 operations in its
 * whole life. n elements -> at most 4n operations -> O(1) per operation on average,
 * even though one particular pop can cost O(n).
 *
 * Dry run: push(1) push(2) pop() push(3) pop() pop()
 *   push 1,2    inbox [1,2]  outbox []
 *   pop: pour   inbox []     outbox [2,1]  -> 1
 *   push 3      inbox [3]    outbox [2]
 *   pop -> 2    (outbox not empty, don't pour!)
 *   pop: outbox empty, pour -> outbox [3] -> 3
 *
 * EDGE CASES
 * - never pour while outbox still has elements (breaks FIFO)
 * - empty() checks both stacks
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

  #pourIfNeeded() {
    if (this.#outbox.length === 0) {
      while (this.#inbox.length) this.#outbox.push(this.#inbox.pop());
    }
  }

  pop() {
    this.#pourIfNeeded();
    return this.#outbox.pop();
  }

  peek() {
    this.#pourIfNeeded();
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

  // heavy interleaving keeps FIFO order
  const expected = [];
  for (let i = 0; i < 20; i++) {
    q.push(i);
    expected.push(i);
    if (i % 3 === 0) assert.strictEqual(q.pop(), expected.shift());
  }
  while (expected.length) assert.strictEqual(q.pop(), expected.shift());
  assert.strictEqual(q.empty(), true);
}
console.log('✓ 02-queue-using-stacks passed');

module.exports = { MyQueue, MyQueueNaive };

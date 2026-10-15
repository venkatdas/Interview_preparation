/**
 * 01. Implement Stack using Queues   (LeetCode 225 — Easy)
 *
 * PROBLEM
 * Implement a LIFO stack (push, pop, top, empty) using only queue operations
 * (enqueue at back, dequeue from front, peek front, size, isEmpty).
 *
 * EXAMPLES
 * push(1) push(2)  top() -> 2  pop() -> 2  empty() -> false
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - pop/top only called on a non-empty stack? (yes)
 * - One queue or two? (follow-up: do it with ONE queue)
 *
 * NAIVE APPROACH (two queues)   O(1) push, O(n) pop
 * push: enqueue into q1. pop: move all but the last element from q1 to q2,
 * dequeue the last one (that's the top), then swap q1 and q2.
 *
 * APPROACH — Optimal (one queue, rotate on push)   O(n) push, O(1) pop/top
 * After enqueueing the new element, rotate the queue n-1 times (dequeue front,
 * enqueue it at the back). The newest element ends up at the FRONT, so the
 * queue's front is always the stack's top. pop and top become plain dequeue/peek.
 *
 * Dry run: push(1) push(2) push(3) pop()
 *   push 1   [1]                  (rotate 0 times)
 *   push 2   [1,2] -> rotate 1 -> [2,1]
 *   push 3   [2,1,3] -> rotate 2 -> [1,3,2] -> [3,2,1]
 *   pop  -> dequeue front = 3 ; queue [2,1]
 *   top  -> 2
 *
 * Both versions are O(n) somewhere - that is unavoidable with FIFO primitives.
 * Pick the one that makes the MORE FREQUENT operation cheap.
 *
 * EDGE CASES
 * - push after popping to empty
 * - single element
 */

const { Queue } = require('../../02_Implementations/queue');

class MyStackTwoQueues {
  #main = new Queue();
  #helper = new Queue();

  push(value) {
    this.#main.enqueue(value);
  }

  pop() {
    // move everything except the last element to helper
    while (this.#main.size() > 1) this.#helper.enqueue(this.#main.dequeue());
    const top = this.#main.dequeue();
    [this.#main, this.#helper] = [this.#helper, this.#main]; // swap roles
    return top;
  }

  top() {
    const value = this.pop();
    this.push(value); // put it back; it goes to the back, which is correct since it was the top
    return value;
  }

  empty() {
    return this.#main.isEmpty();
  }
}

class MyStack {
  #queue = new Queue();

  push(value) {
    this.#queue.enqueue(value);
    // rotate so the new element moves to the front
    for (let i = 0; i < this.#queue.size() - 1; i++) {
      this.#queue.enqueue(this.#queue.dequeue());
    }
  }

  pop() {
    return this.#queue.dequeue();
  }

  top() {
    return this.#queue.peek();
  }

  empty() {
    return this.#queue.isEmpty();
  }
}

// ---------- tests ----------
const assert = require('assert');
for (const Impl of [MyStackTwoQueues, MyStack]) {
  const s = new Impl();
  assert.strictEqual(s.empty(), true);
  s.push(1); s.push(2);
  assert.strictEqual(s.top(), 2);
  assert.strictEqual(s.pop(), 2);
  assert.strictEqual(s.empty(), false);
  assert.strictEqual(s.pop(), 1);
  assert.strictEqual(s.empty(), true);

  s.push(1); s.push(2); s.push(3);
  assert.strictEqual(s.pop(), 3);
  s.push(4);
  assert.strictEqual(s.top(), 4);
  assert.strictEqual(s.pop(), 4);
  assert.strictEqual(s.pop(), 2);
  assert.strictEqual(s.pop(), 1);
  assert.strictEqual(s.empty(), true);

  s.push(-7);
  assert.strictEqual(s.top(), -7);
}
console.log('✓ 01-stack-using-queues passed');

module.exports = { MyStack, MyStackTwoQueues };

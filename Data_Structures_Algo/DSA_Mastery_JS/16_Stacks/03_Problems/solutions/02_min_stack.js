/**
 * 02. Min Stack   (LeetCode 155 — Medium)
 *
 * PROBLEM
 * Design a stack that supports push, pop, top and getMin, ALL in O(1) time.
 * getMin returns the smallest value currently in the stack.
 *
 * EXAMPLES
 * push(-2) push(0) push(-3)  getMin() -> -3
 * pop()                      top() -> 0   getMin() -> -2
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Are pop/top/getMin always called on a non-empty stack? (LeetCode: yes)
 * - Can values repeat? (yes -> be careful when popping a value equal to the min)
 * - Is O(n) extra space acceptable? (yes)
 *
 * NAIVE APPROACH   O(1) push/pop, O(n) getMin
 * A normal array stack where getMin scans the whole array with Math.min(...).
 * Correct, but getMin is O(n) and the question demands O(1).
 *
 * APPROACH — Optimal (second stack of running minimums)   O(1) all ops, O(n) space
 * Keep a parallel stack `mins`. Its top is ALWAYS the minimum of everything
 * currently in the main stack.
 *   push(x): push x on main; if mins is empty or x <= mins.top, also push x on mins.
 *   pop():   pop from main; if the popped value === mins.top, pop mins too.
 * The `<=` (not `<`) matters: with duplicates like push(3), push(3), pop(), the
 * min must still be 3, so both 3s must be recorded.
 *
 * Dry run: push(-2) push(0) push(-3) getMin pop getMin
 *   push(-2)  main [-2]        mins [-2]
 *   push(0)   main [-2,0]      mins [-2]        (0 > -2, don't record)
 *   push(-3)  main [-2,0,-3]   mins [-2,-3]
 *   getMin -> -3
 *   pop()     main [-2,0]      mins [-2]        (-3 was the min, pop it too)
 *   getMin -> -2
 *
 * Variation (saves space): push a pair [value, currentMin] on a single stack.
 *
 * EDGE CASES
 * - duplicates of the minimum
 * - popping down to empty and pushing again
 * - negative numbers
 */

class MinStack {
  #stack = [];
  #mins = [];

  push(value) {
    this.#stack.push(value);
    if (this.#mins.length === 0 || value <= this.getMin()) {
      this.#mins.push(value); // new running minimum (or a duplicate of it)
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

  isEmpty() {
    return this.#stack.length === 0;
  }
}

// Variation: one stack of [value, minSoFar] pairs.
class MinStackPairs {
  #stack = [];
  push(value) {
    const minSoFar = this.#stack.length ? Math.min(value, this.getMin()) : value;
    this.#stack.push([value, minSoFar]);
  }
  pop() { return this.#stack.pop()[0]; }
  top() { return this.#stack[this.#stack.length - 1][0]; }
  getMin() { return this.#stack[this.#stack.length - 1][1]; }
  isEmpty() { return this.#stack.length === 0; }
}

// ---------- tests ----------
const assert = require('assert');
for (const Impl of [MinStack, MinStackPairs]) {
  const s = new Impl();
  s.push(-2); s.push(0); s.push(-3);
  assert.strictEqual(s.getMin(), -3);
  assert.strictEqual(s.pop(), -3);
  assert.strictEqual(s.top(), 0);
  assert.strictEqual(s.getMin(), -2);

  // duplicates of the min
  const d = new Impl();
  d.push(3); d.push(3); d.push(5);
  assert.strictEqual(d.getMin(), 3);
  d.pop(); d.pop();
  assert.strictEqual(d.getMin(), 3);
  d.pop();
  assert.strictEqual(d.isEmpty(), true);

  // refill after emptying
  d.push(10); d.push(1);
  assert.strictEqual(d.getMin(), 1);
  d.pop();
  assert.strictEqual(d.getMin(), 10);
}
console.log('✓ 02-min-stack passed');

module.exports = { MinStack, MinStackPairs };

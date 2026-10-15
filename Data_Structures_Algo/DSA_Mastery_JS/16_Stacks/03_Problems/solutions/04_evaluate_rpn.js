/**
 * 04. Evaluate Reverse Polish Notation   (LeetCode 150 — Medium)
 *
 * PROBLEM
 * You are given an array of tokens representing an arithmetic expression in
 * Reverse Polish Notation (postfix): the operator comes AFTER its two operands.
 * Evaluate it. Operators are + - * /. Division truncates toward zero.
 *
 * EXAMPLES
 * Input: ["2","1","+","3","*"]           Output: 9    Explanation: (2 + 1) * 3
 * Input: ["4","13","5","/","+"]          Output: 6    Explanation: 4 + (13 / 5) = 4 + 2
 * Input: ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]   Output: 22
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is the expression always valid? (yes)
 * - Division: truncate toward zero or floor? (toward zero: -7/2 = -3, not -4)
 * - Can numbers be negative, like "-11"? (yes - don't confuse with the minus operator)
 *
 * APPROACH 1 — Brute force (repeated rewrite)   O(n^2) time, O(n) space
 * Scan for the first operator, compute it with the two tokens before it,
 * splice the three tokens out and put the result in. Repeat until one token
 * remains. Each pass is O(n) and there are O(n) passes.
 *
 * APPROACH 2 — Optimal (stack)   O(n) time, O(n) space
 * Read tokens left to right:
 *   number   -> push
 *   operator -> pop b (right operand), pop a (left operand), push a op b
 * The order of pops matters for - and /: the SECOND pop is the left operand.
 *
 * Dry run on ["2","1","+","3","*"]:
 *   2    push      [2]
 *   1    push      [2,1]
 *   +    pop 1,2 -> 3   [3]
 *   3    push      [3,3]
 *   *    pop 3,3 -> 9   [9]
 *   answer 9
 *
 * EDGE CASES
 * - single number token
 * - negative numbers as tokens
 * - division of negatives truncating toward zero (Math.trunc, not Math.floor)
 */

const OPERATIONS = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '*': (a, b) => a * b,
  '/': (a, b) => Math.trunc(a / b),
};

function bruteForce(tokens) {
  const list = [...tokens];
  while (list.length > 1) {
    const index = list.findIndex((token) => token in OPERATIONS);
    const a = Number(list[index - 2]);
    const b = Number(list[index - 1]);
    list.splice(index - 2, 3, String(OPERATIONS[list[index]](a, b)));
  }
  return Number(list[0]);
}

function optimal(tokens) {
  const stack = [];
  for (const token of tokens) {
    if (token in OPERATIONS) {
      const right = stack.pop(); // pushed last = right operand
      const left = stack.pop();
      stack.push(OPERATIONS[token](left, right));
    } else {
      stack.push(Number(token));
    }
  }
  return stack[0];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(['2', '1', '+', '3', '*']), 9);
  assert.strictEqual(solve(['4', '13', '5', '/', '+']), 6);
  assert.strictEqual(solve(['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+']), 22);
  assert.strictEqual(solve(['42']), 42);
  assert.strictEqual(solve(['-7', '2', '/']), -3); // truncates toward zero
  assert.strictEqual(solve(['3', '4', '-']), -1);  // order of operands matters
  assert.strictEqual(solve(['0', '5', '*']), 0);
}
console.log('✓ 04-evaluate-rpn passed');

module.exports = { optimal, bruteForce };

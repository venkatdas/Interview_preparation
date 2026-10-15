/**
 * 01. Valid Parentheses   (LeetCode 20 — Easy)
 *
 * PROBLEM
 * Given a string containing only the characters '(', ')', '{', '}', '[', ']',
 * return true if every opening bracket is closed by the same type of bracket,
 * in the correct order.
 *
 * EXAMPLES
 * Input: "()[]{}"   Output: true
 * Input: "([)]"     Output: false   Explanation: ']' closes '[' but '(' is still open inside
 * Input: "{[]}"     Output: true
 * Input: "("        Output: false   Explanation: never closed
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can the string be empty? (yes -> return true)
 * - Only bracket characters, or other characters too? (assume only brackets)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(n) space
 * Repeatedly delete any adjacent pair "()", "[]", "{}" from the string until nothing
 * changes. If the string becomes empty it was valid. Each pass is O(n) and there can
 * be up to n/2 passes.
 *
 * APPROACH 2 — Optimal (Stack)   O(n) time, O(n) space
 * Walk the string once:
 *   - opening bracket  -> push it (we'll need to match it later)
 *   - closing bracket  -> the MOST RECENT unmatched opener must match it, and the most
 *                         recent thing is exactly the top of a stack. Pop and compare.
 * At the end the stack must be empty (no openers left unmatched).
 *
 * Dry run on "{[]}":
 *   '{' push          stack = ['{']
 *   '[' push          stack = ['{', '[']
 *   ']' pop '[' ok    stack = ['{']
 *   '}' pop '{' ok    stack = []
 *   end, empty -> true
 *
 * Dry run on "([)]":
 *   '(' push          stack = ['(']
 *   '[' push          stack = ['(', '[']
 *   ')' pop '[' != '(' -> false
 *
 * EDGE CASES
 * - ""            -> true
 * - ")"           -> false (pop from empty stack -> undefined !== '(')
 * - odd length    -> always false (quick early exit)
 */

function bruteForce(s) {
  let prev = null;
  while (prev !== s) {
    prev = s;
    s = s.replace('()', '').replace('[]', '').replace('{}', '');
  }
  return s.length === 0;
}

function optimal(s) {
  if (s.length % 2 !== 0) return false; // odd length can never be balanced

  const closeToOpen = { ')': '(', ']': '[', '}': '{' };
  const stack = [];

  for (const ch of s) {
    if (ch in closeToOpen) {
      // closing bracket: top of stack must be its opener
      if (stack.pop() !== closeToOpen[ch]) return false;
    } else {
      stack.push(ch);
    }
  }
  return stack.length === 0;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('()[]{}'), true);
  assert.strictEqual(solve('{[]}'), true);
  assert.strictEqual(solve('([)]'), false);
  assert.strictEqual(solve('('), false);
  assert.strictEqual(solve(')'), false);
  assert.strictEqual(solve(''), true);
  assert.strictEqual(solve('((()))'), true);
  assert.strictEqual(solve('(()'), false);
}
console.log('✓ 01-valid-parentheses passed');

module.exports = { optimal, bruteForce };

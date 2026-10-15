/**
 * 09. Generate Parentheses   (LeetCode 22 — Medium)
 *
 * PROBLEM
 * Given n pairs of parentheses, generate all strings of well-formed parentheses.
 *
 * EXAMPLES
 * Input: n = 3   Output: ["((()))","(()())","(())()","()(())","()()()"]
 * Input: n = 1   Output: ["()"]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= n <= 8. The count is the Catalan number C(n): 1, 2, 5, 14, 42, 132, 429, 1430
 * - Only one bracket type
 *
 * APPROACH 1 — Brute force   O(2^(2n) * n) time
 * Generate every string of length 2n made of '(' and ')' (2^(2n) of them), keep the
 * valid ones (check with a counter). For n=3 that is 64 candidates for 5 answers;
 * for n=8, 65,536 candidates for 1,430 answers.
 *
 * APPROACH 2 — Optimal (Backtracking with pruning rules)   O(C(n) * n) time, O(n) stack
 * Build the string left to right, tracking how many '(' and ')' are used:
 *   - may add '(' if open < n           (still have openers left)
 *   - may add ')' if close < open       (never close more than we opened)
 * These two rules mean we NEVER generate an invalid prefix, so every leaf is an answer.
 *
 * Dry run n=2:
 *   ""  open=0 close=0
 *   "(" open=1 close=0
 *     "((" open=2 close=0 -> only ')' allowed -> "(()" -> "(())" record
 *     "()" open=1 close=1 -> "()(" -> "()()" record
 *
 * EDGE CASES
 * - n = 0 -> [""]
 * - n = 1 -> ["()"]
 */

function bruteForce(n) {
  const results = [];
  const total = 2 * n;
  function isValid(s) {
    let balance = 0;
    for (const ch of s) {
      balance += ch === '(' ? 1 : -1;
      if (balance < 0) return false;
    }
    return balance === 0;
  }
  function build(current) {
    if (current.length === total) {
      if (isValid(current)) results.push(current);
      return;
    }
    build(current + '(');
    build(current + ')');
  }
  build('');
  return results;
}

function optimal(n) {
  const results = [];

  function go(current, open, close) {
    if (current.length === 2 * n) { results.push(current); return; }
    if (open < n)     go(current + '(', open + 1, close);  // still have '(' to place
    if (close < open) go(current + ')', open, close + 1);  // a ')' must match an earlier '('
  }

  go('', 0, 0);
  return results;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(3), ['((()))', '(()())', '(())()', '()(())', '()()()']);
  assert.deepStrictEqual(solve(1), ['()']);
  assert.deepStrictEqual(solve(0), ['']);
  assert.deepStrictEqual(solve(2), ['(())', '()()']);
  assert.strictEqual(solve(4).length, 14);
  assert.strictEqual(solve(5).length, 42);
}
assert.strictEqual(optimal(8).length, 1430);
assert.deepStrictEqual(optimal(6), bruteForce(6));
console.log('✓ 09-generate-parentheses passed');

module.exports = { optimal, bruteForce };

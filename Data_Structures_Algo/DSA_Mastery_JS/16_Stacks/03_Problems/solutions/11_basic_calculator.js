/**
 * 11. Basic Calculator II   (LeetCode 227 — Medium)
 *
 * PROBLEM
 * Evaluate a string expression containing non-negative integers, the operators
 * + - * /, and spaces. No parentheses. Integer division truncates toward zero.
 * Standard precedence: * and / before + and -.
 *
 * EXAMPLES
 * Input: "3+2*2"      Output: 7
 * Input: " 3/2 "      Output: 1
 * Input: " 3+5 / 2 "  Output: 5
 * Input: "14-3/2"     Output: 13   Explanation: 3/2 = 1, 14 - 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Parentheses? (no for 227; the stack-of-frames version handles LeetCode 224 - see bonus)
 * - Negative numbers in the input? (no, but intermediate results can be negative)
 * - Division truncates toward zero? (yes -> Math.trunc)
 *
 * APPROACH 1 — Brute force (two passes over a token list)   O(n) time, O(n) space
 * Tokenize into numbers and operators. Pass 1: collapse every * and / into
 * their neighbours. Pass 2: sum up the + and - terms. Works, but needs splice
 * which is O(n) per operation, so really O(n^2) worst case.
 *
 * APPROACH 2 — Optimal (stack of signed terms)   O(n) time, O(n) space
 * The trick: treat the expression as a SUM of terms. "3+2*2" = (+3) + (+2*2).
 * Keep the last operator seen. When a number is complete (next char is an
 * operator or the end):
 *   '+' -> push  number
 *   '-' -> push -number
 *   '*' -> push  stack.pop() * number     (multiply into the previous term)
 *   '/' -> push  trunc(stack.pop() / number)
 * At the end, sum the stack.
 *
 * Dry run on "3+5/2":
 *   '3' number=3 ; '+' -> push 3 (op was '+')   stack [3]  op='+'
 *   '5' number=5 ; '/' -> push 5                stack [3,5]  op='/'
 *   '2' number=2 ; end -> op '/' : pop 5, push trunc(5/2)=2   stack [3,2]
 *   sum = 5
 *
 * EDGE CASES
 * - spaces anywhere
 * - multi-digit numbers
 * - single number
 * - "0-3*2" -> negative result
 */

function bruteForce(s) {
  const tokens = s.match(/\d+|[+\-*/]/g) || [];
  // pass 1: resolve * and /
  const terms = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === '*' || token === '/') {
      const left = terms.pop();
      const right = Number(tokens[++i]);
      terms.push(token === '*' ? left * right : Math.trunc(left / right));
    } else {
      terms.push(/\d/.test(token) ? Number(token) : token);
    }
  }
  // pass 2: + and -
  let result = terms[0];
  for (let i = 1; i < terms.length; i += 2) {
    result = terms[i] === '+' ? result + terms[i + 1] : result - terms[i + 1];
  }
  return result;
}

function optimal(s) {
  const stack = [];
  let number = 0;
  let operator = '+'; // the operator BEFORE the current number

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch >= '0' && ch <= '9') number = number * 10 + Number(ch);

    const isOperator = '+-*/'.includes(ch);
    const isLast = i === s.length - 1;
    if (isOperator || isLast) {
      if (operator === '+') stack.push(number);
      else if (operator === '-') stack.push(-number);
      else if (operator === '*') stack.push(stack.pop() * number);
      else if (operator === '/') stack.push(Math.trunc(stack.pop() / number));
      operator = ch;
      number = 0;
    }
  }
  return stack.reduce((sum, term) => sum + term, 0);
}

// Bonus: Basic Calculator I (LeetCode 224) - only + - and parentheses.
// Push [resultSoFar, sign] when '(' opens, restore and combine when ')' closes.
function calculatorWithParens(s) {
  const stack = [];
  let result = 0;
  let sign = 1;
  let number = 0;
  for (const ch of s) {
    if (ch >= '0' && ch <= '9') {
      number = number * 10 + Number(ch);
    } else if (ch === '+' || ch === '-') {
      result += sign * number;
      number = 0;
      sign = ch === '+' ? 1 : -1;
    } else if (ch === '(') {
      stack.push(result, sign); // save the outer context
      result = 0;
      sign = 1;
    } else if (ch === ')') {
      result += sign * number;
      number = 0;
      const outerSign = stack.pop();
      const outerResult = stack.pop();
      result = outerResult + outerSign * result;
    }
  }
  return result + sign * number;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('3+2*2'), 7);
  assert.strictEqual(solve(' 3/2 '), 1);
  assert.strictEqual(solve(' 3+5 / 2 '), 5);
  assert.strictEqual(solve('14-3/2'), 13);
  assert.strictEqual(solve('42'), 42);
  assert.strictEqual(solve('0-3*2'), -6);
  assert.strictEqual(solve('100*2/3-7'), 59);
  assert.strictEqual(solve('1-1+1'), 1);
}
assert.strictEqual(calculatorWithParens('1 + 1'), 2);
assert.strictEqual(calculatorWithParens(' 2-1 + 2 '), 3);
assert.strictEqual(calculatorWithParens('(1+(4+5+2)-3)+(6+8)'), 23);
assert.strictEqual(calculatorWithParens('-(2+3)'), -5);
console.log('✓ 11-basic-calculator passed');

module.exports = { optimal, bruteForce, calculatorWithParens };

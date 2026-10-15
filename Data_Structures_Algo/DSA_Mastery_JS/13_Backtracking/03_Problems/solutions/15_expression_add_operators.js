/**
 * 15. Expression Add Operators   (LeetCode 282 — Hard)
 *
 * PROBLEM
 * Given a string of digits and a target, insert the binary operators '+', '-', '*'
 * between the digits (or none, to form multi-digit numbers) so that the expression
 * evaluates to target. Return all such expressions. Numbers must not have leading zeros.
 *
 * EXAMPLES
 * Input: num = "123", target = 6     Output: ["1*2*3","1+2+3"]
 * Input: num = "232", target = 8     Output: ["2*3+2","2+3*2"]
 * Input: num = "105", target = 5     Output: ["1*0+5","10-5"]
 * Input: num = "00",  target = 0     Output: ["0*0","0+0","0-0"]   ("00" is a leading zero)
 * Input: num = "3456237490", target = 9191   Output: []
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Length <= 10, so 4^9 ~ 262k operator placements at most
 * - Operator precedence: '*' binds tighter than '+'/'-' (normal math)
 * - No unary minus, no parentheses, no division
 *
 * APPROACH 1 — Brute force   O(4^n * n)
 * Generate every expression string (at each gap: nothing, +, -, *), then evaluate
 * each one with a small parser (handle * first, then + and -). Simple to reason
 * about, but evaluates each expression from scratch.
 *
 * APPROACH 2 — Optimal (Backtracking carrying `value` and `lastOperand`)   O(4^n * n), O(n) stack
 * Build the expression left to right and keep two numbers:
 *   value        = result of the expression so far
 *   lastOperand  = the last term that was ADDED (with sign), so that a '*' can undo it
 * For the next number `cur`:
 *   '+'  -> value + cur,                       lastOperand = cur
 *   '-'  -> value - cur,                       lastOperand = -cur
 *   '*'  -> value - lastOperand + lastOperand * cur,   lastOperand = lastOperand * cur
 * The '*' trick: "2+3*2": after "2+3" value=5, last=3. Now '*2': remove the 3 (5-3=2),
 * add 3*2=6 -> 8. That is how precedence is respected without a parser.
 * The first number has no operator in front, so it is handled separately.
 * Skip numbers with leading zero: if num[start] === '0', only the 1-digit piece "0" is allowed.
 *
 * Dry run "232", target 8:
 *   first "2": value=2,last=2
 *     "+3": value=5,last=3 -> "*2": value=5-3+6=8 -> end, 8===8 record "2+3*2"
 *     "*3": value=2-2+6=6,last=6 -> "+2": 8 record "2*3+2"
 *   first "23": "+2"=25, "-2"=21, "*2"=46 -> none
 *   first "232": value 232 -> no operators left, != 8
 *
 * EDGE CASES
 * - Leading zeros: "105" cannot use "05"
 * - Numbers can overflow 32-bit in other languages; JS doubles are safe up to 2^53
 * - Single digit input: just compare the number to target
 */

function bruteForce(num, target) {
  const results = [];
  function evaluate(expr) {
    // split on + and - keeping signs, multiply within each term
    const terms = expr.match(/[+-]?[^+-]+/g);
    let total = 0;
    for (const term of terms) {
      const factors = term.split('*').map(Number);
      total += factors.reduce((a, b) => a * b, 1);
    }
    return total;
  }
  function go(index, expr) {
    if (index === num.length) {
      if (evaluate(expr) === target) results.push(expr);
      return;
    }
    for (let end = index; end < num.length; end++) {
      if (end > index && num[index] === '0') break;        // leading zero
      const piece = num.slice(index, end + 1);
      if (index === 0) go(end + 1, piece);
      else for (const op of ['+', '-', '*']) go(end + 1, expr + op + piece);
    }
  }
  go(0, '');
  return results;
}

function optimal(num, target) {
  const results = [];

  function go(index, expr, value, lastOperand) {
    if (index === num.length) {
      if (value === target) results.push(expr);
      return;
    }
    for (let end = index; end < num.length; end++) {
      if (end > index && num[index] === '0') break;        // "0" is ok, "05" is not
      const piece = num.slice(index, end + 1);
      const cur = Number(piece);
      if (index === 0) {
        go(end + 1, piece, cur, cur);                      // first number: no operator
      } else {
        go(end + 1, expr + '+' + piece, value + cur, cur);
        go(end + 1, expr + '-' + piece, value - cur, -cur);
        // undo the last addition, add (last * cur) instead -> respects precedence
        go(end + 1, expr + '*' + piece, value - lastOperand + lastOperand * cur, lastOperand * cur);
      }
    }
  }

  go(0, '', 0, 0);
  return results;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve('123', 6).sort(), ['1*2*3', '1+2+3']);
  assert.deepStrictEqual(solve('232', 8).sort(), ['2*3+2', '2+3*2']);
  assert.deepStrictEqual(solve('105', 5).sort(), ['1*0+5', '10-5']);
  assert.deepStrictEqual(solve('00', 0).sort(), ['0*0', '0+0', '0-0']);
  assert.deepStrictEqual(solve('3456237490', 9191), []);
  assert.deepStrictEqual(solve('5', 5), ['5']);
  assert.deepStrictEqual(solve('5', 6), []);
  assert.deepStrictEqual(solve('123', 123), ['123']);
}
assert.deepStrictEqual(optimal('1234567', 100).sort(), bruteForce('1234567', 100).sort());
console.log('✓ 15-expression-add-operators passed');

module.exports = { optimal, bruteForce };

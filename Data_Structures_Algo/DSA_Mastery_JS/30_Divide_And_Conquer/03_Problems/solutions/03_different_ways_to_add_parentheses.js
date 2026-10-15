/**
 * 03. Different Ways to Add Parentheses   (LeetCode 241 — Medium)
 *
 * PROBLEM
 * Given a string of numbers and the operators + - *, return all results from every
 * possible way of grouping the expression with parentheses (duplicates allowed, any order).
 *
 * EXAMPLES
 * Input: "2-1-1"      Output: [0, 2]        ((2-1)-1) = 0, (2-(1-1)) = 2
 * Input: "2*3-4*5"    Output: [-34,-14,-10,-10,10]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Length up to 20, numbers up to 99 -> output size is a Catalan number, small
 * - Only + - *, no division, no unary minus
 *
 * APPROACH 1 — Brute force (enumerate parenthesisations explicitly)
 * Generating every bracket placement and then evaluating is messy and does the same work as
 * the D&C below without the structure. We keep an honest "brute force" here: recursion
 * WITHOUT memoization (recomputes the same substrings many times).
 *
 * APPROACH 2 — Optimal (Divide at every operator + memoize)   O(Catalan(n)) results
 * Pick any operator as the LAST one applied: everything left of it is one sub-expression,
 * everything right is another. Results(expr) = for each operator at i:
 *   for a in Results(left) for b in Results(right): a op b
 * Base case: no operator -> [number]. Memoize by substring (the same substring appears
 * in many splits).
 *
 * Dry run "2-1-1":
 *   split at first '-': left "2" -> [2], right "1-1" -> [0]  -> 2-0 = 2
 *   split at second '-': left "2-1" -> [1], right "1" -> [1] -> 1-1 = 0
 *   -> [2, 0]
 *
 * EDGE CASES
 * - a single number -> [that number]
 * - two numbers -> one result
 * - repeated results are kept (e.g. -10 twice in the example)
 */

function evaluate(a, op, b) {
  if (op === '+') return a + b;
  if (op === '-') return a - b;
  return a * b;
}

function bruteForce(expression) {
  function ways(expr) {
    const results = [];
    for (let i = 0; i < expr.length; i++) {
      const ch = expr[i];
      if (ch === '+' || ch === '-' || ch === '*') {
        for (const a of ways(expr.slice(0, i))) {
          for (const b of ways(expr.slice(i + 1))) results.push(evaluate(a, ch, b));
        }
      }
    }
    return results.length ? results : [Number(expr)];
  }
  return ways(expression);
}

function optimal(expression) {
  const memo = new Map();
  function ways(expr) {
    if (memo.has(expr)) return memo.get(expr);
    const results = [];
    for (let i = 0; i < expr.length; i++) {
      const ch = expr[i];
      if (ch === '+' || ch === '-' || ch === '*') {
        const leftResults = ways(expr.slice(0, i));
        const rightResults = ways(expr.slice(i + 1));
        for (const a of leftResults) for (const b of rightResults) results.push(evaluate(a, ch, b));
      }
    }
    const out = results.length ? results : [Number(expr)];
    memo.set(expr, out);
    return out;
  }
  return ways(expression);
}

// ---------- tests ----------
const assert = require('assert');
const sorted = (arr) => arr.slice().sort((a, b) => a - b);
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(sorted(solve('2-1-1')), [0, 2]);
  assert.deepStrictEqual(sorted(solve('2*3-4*5')), [-34, -14, -10, -10, 10]);
  assert.deepStrictEqual(solve('7'), [7]);
  assert.deepStrictEqual(solve('3+5'), [8]);
  assert.deepStrictEqual(sorted(solve('1+1+1')), [3, 3]);
  assert.deepStrictEqual(sorted(solve('10*2-3')), [-10, 17]);
}
for (let trial = 0; trial < 100; trial++) {
  const terms = 1 + Math.floor(Math.random() * 5);
  let expr = String(Math.floor(Math.random() * 10));
  for (let i = 1; i < terms; i++) expr += '+-*'[Math.floor(Math.random() * 3)] + Math.floor(Math.random() * 10);
  assert.deepStrictEqual(sorted(optimal(expr)), sorted(bruteForce(expr)));
}
console.log('✓ 03-different-ways-to-add-parentheses passed');

module.exports = { optimal, bruteForce };

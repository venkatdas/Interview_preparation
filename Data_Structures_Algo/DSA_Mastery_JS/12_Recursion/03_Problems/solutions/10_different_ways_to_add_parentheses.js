/**
 * 10. Different Ways to Add Parentheses   (LeetCode 241 — Medium)
 *
 * PROBLEM
 * Given an expression of non-negative integers and the operators + - *, return the
 * results of ALL possible ways to fully parenthesize it (any order, duplicates kept).
 *
 * EXAMPLES
 * "2-1-1"     -> [0, 2]                 ((2-1)-1) = 0, (2-(1-1)) = 2
 * "2*3-4*5"   -> [-34, -14, -10, -10, 10]
 * "11"        -> [11]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Length <= 20, numbers 0..99, operators only + - *
 * - Order of the output? (any) Keep duplicates? (yes, one per parenthesization)
 *
 * APPROACH 1 — Brute force (plain divide and conquer)   O(Catalan(ops) * ops) time
 * PROMISE: ways(expr) returns every value expr can take.
 *   base: expr is a plain number -> [number]
 *   step: for every operator at position i, split into left and right, recurse on both,
 *         combine every pair with that operator. The operator we split on is the LAST one
 *         evaluated, so each split is a different parenthesization.
 * Substrings like "3-4" get solved again and again.
 *
 * APPROACH 2 — Optimal (same recursion + memo on the substring)   output-bound
 * Cache ways(expr) by its string. Each distinct substring is expanded once; the total
 * time is dominated by the size of the output (Catalan growth is unavoidable because we
 * must LIST every result).
 *
 * Dry run "2-1-1":
 *   split at first '-':  left "2" -> [2],  right "1-1" -> [0]          -> 2-0 = 2
 *   split at second '-': left "2-1" -> [1], right "1" -> [1]           -> 1-1 = 0
 *   result [2, 0]
 *
 * EDGE CASES
 * - single number (possibly multi-digit) -> [that number]
 * - only one operator -> exactly one result
 */

const apply = (a, op, b) => (op === '+' ? a + b : op === '-' ? a - b : a * b);

function bruteForce(expr) {
  const out = [];
  for (let i = 0; i < expr.length; i++) {
    const op = expr[i];
    if (op !== '+' && op !== '-' && op !== '*') continue;
    for (const a of bruteForce(expr.slice(0, i))) {
      for (const b of bruteForce(expr.slice(i + 1))) out.push(apply(a, op, b));
    }
  }
  return out.length ? out : [Number(expr)];      // no operator -> plain number
}

function optimal(expr, memo = new Map()) {
  if (memo.has(expr)) return memo.get(expr);
  const out = [];
  for (let i = 0; i < expr.length; i++) {
    const op = expr[i];
    if (op !== '+' && op !== '-' && op !== '*') continue;
    const left = optimal(expr.slice(0, i), memo);
    const right = optimal(expr.slice(i + 1), memo);
    for (const a of left) for (const b of right) out.push(apply(a, op, b));
  }
  if (!out.length) out.push(Number(expr));
  memo.set(expr, out);
  return out;
}

// ---------- tests ----------
const assert = require('assert');
const sorted = (a) => [...a].sort((x, y) => x - y);
assert.deepStrictEqual(sorted(optimal('2-1-1')), [0, 2]);
assert.deepStrictEqual(sorted(optimal('2*3-4*5')), [-34, -14, -10, -10, 10]);
assert.deepStrictEqual(optimal('11'), [11]);
assert.deepStrictEqual(optimal('3+4'), [7]);
assert.strictEqual(optimal('1+1+1+1+1+1+1').length, 132);   // Catalan(6)
let seed = 9;
const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
for (let t = 0; t < 200; t++) {
  let e = String(Math.floor(rnd() * 20));
  const ops = Math.floor(rnd() * 6);
  for (let k = 0; k < ops; k++) e += '+-*'[Math.floor(rnd() * 3)] + Math.floor(rnd() * 20);
  assert.deepStrictEqual(sorted(optimal(e)), sorted(bruteForce(e)), e);
}
console.log('✓ 10_different_ways_to_add_parentheses passed');

module.exports = { optimal, bruteForce };

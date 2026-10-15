/**
 * 01. Fibonacci Number with Memoization   (LeetCode 509 — Easy)
 *
 * PROBLEM
 * F(0) = 0, F(1) = 1, and F(n) = F(n-1) + F(n-2) for n > 1. Given n, return F(n).
 * Use it to see why plain multiple recursion explodes and how a cache fixes it.
 *
 * EXAMPLES
 * n = 2  -> 1      (1 + 0)
 * n = 4  -> 3      (0 1 1 2 3)
 * n = 10 -> 55
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Range of n? (LeetCode: 0..30; we also support up to ~1000 with Number precision loss
 *   after n = 78, so ask if BigInt is needed for big n)
 * - Negative n? (assume no)
 *
 * APPROACH 1 — Brute force (plain multiple recursion)   O(2^n) time, O(n) space
 * fib(n) = fib(n-1) + fib(n-2). Every call spawns two more, so the call tree has
 * about 1.6^n nodes. fib(3) is recomputed again and again inside fib(5), fib(6) ...
 *
 * APPROACH 2 — Optimal (top-down memoization)   O(n) time, O(n) space
 * Same recursion, but store each answer in a Map the first time we compute it.
 * Each distinct n is solved once; every later request is an O(1) lookup.
 * This is exactly "top-down DP". (Bottom-up with two variables gets O(1) space.)
 *
 * Dry run fib(5) with memo:
 *   fib(5) -> fib(4) -> fib(3) -> fib(2) -> fib(1)=1, fib(0)=0 -> memo[2]=1
 *                              fib(3) = memo[2] + fib(1) = 2  -> memo[3]=2
 *                    fib(4) = memo[3] + memo[2] = 3          -> memo[4]=3
 *   fib(5) = memo[4] + memo[3] = 5
 *   Only 9 calls instead of 15.
 *
 * EDGE CASES
 * - n = 0 -> 0, n = 1 -> 1 (the two base cases)
 * - share the memo across calls via a default parameter carefully: a NEW Map per
 *   top-level call is safest (default params are re-evaluated per call in JS).
 */

function bruteForce(n) {
  if (n <= 1) return n;
  return bruteForce(n - 1) + bruteForce(n - 2);
}

function optimal(n, memo = new Map()) {
  if (n <= 1) return n;                      // base cases F(0)=0, F(1)=1
  if (memo.has(n)) return memo.get(n);       // solved before -> reuse
  const value = optimal(n - 1, memo) + optimal(n - 2, memo);
  memo.set(n, value);
  return value;
}

// bonus: bottom-up, O(1) space — what top-down turns into once you see the order
function bottomUp(n) {
  let prev = 0, cur = 1;
  if (n === 0) return 0;
  for (let i = 2; i <= n; i++) [prev, cur] = [cur, prev + cur];
  return cur;
}

// ---------- tests ----------
const assert = require('assert');
assert.strictEqual(optimal(0), 0);
assert.strictEqual(optimal(1), 1);
assert.strictEqual(optimal(2), 1);
assert.strictEqual(optimal(4), 3);
assert.strictEqual(optimal(10), 55);
assert.strictEqual(optimal(30), 832040);
assert.strictEqual(optimal(50), 12586269025);
for (let n = 0; n <= 25; n++) {
  assert.strictEqual(optimal(n), bruteForce(n));
  assert.strictEqual(bottomUp(n), bruteForce(n));
}
console.log('✓ 01_fibonacci_memo passed');

module.exports = { optimal, bruteForce, bottomUp };

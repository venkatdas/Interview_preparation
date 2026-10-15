/**
 * 16. Integer Break   (LeetCode 343 — Medium)
 *
 * PROBLEM
 * Break a positive integer n into the sum of at least TWO positive integers
 * so that the product of those integers is maximised. Return the product.
 *
 * EXAMPLES
 * Input: n = 2    Output: 1    Explanation: 1 + 1
 * Input: n = 10   Output: 36   Explanation: 3 + 3 + 4 -> 3 * 3 * 4
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 2 <= n <= 58
 * - At least two parts, so n itself is not allowed as the "break" of n.
 *
 * DP DEFINITION
 * STATE:       dp[i] = max product from breaking i into ONE OR MORE parts
 *              (allowing "no break" makes the recurrence clean; we only forbid it at the top)
 * RECURRENCE:  dp[i] = max over first part j in [1, i-1] of  j * max(i - j, dp[i - j])
 *              (the remainder is either kept whole or broken further)
 * BASE CASES:  dp[1] = 1
 * ANSWER:      dp[n] computed WITHOUT the "keep whole" option at the top level
 *
 * APPROACH 1 — Brute force   exponential time
 * Try every first part, recurse on the rest.
 *
 * APPROACH 2 — Memoization   O(n^2) time, O(n) space
 * APPROACH 3 — Tabulation   O(n^2) time, O(n) space
 * Dry run:
 *   i   : 1  2  3  4  5  6  7   8   9   10
 *   dp  : 1  1  2  4  6  9  12  18  27  36
 *   dp[4] = max(1*max(3,2), 2*max(2,1), 3*max(1,1)) = max(3, 4, 3) = 4
 *   dp[10]= max over j; j=3 -> 3*max(7, dp[7]=12) = 36
 *
 * APPROACH 4 — Math   O(n) time, O(1) space
 * Use as many 3s as possible (3 is the best factor), fix up with a 2 or a 4.
 *
 * EDGE CASES
 * - n = 2 -> 1, n = 3 -> 2 (forced to break even though it lowers the product)
 */

function bruteForce(n) {
  function bestProduct(value) {
    // max product when `value` may be kept whole OR broken
    if (value === 1) return 1;
    let best = value; // keep whole
    for (let firstPart = 1; firstPart < value; firstPart++) {
      best = Math.max(best, firstPart * bestProduct(value - firstPart));
    }
    return best;
  }
  let best = 0;
  for (let firstPart = 1; firstPart < n; firstPart++) {
    best = Math.max(best, firstPart * bestProduct(n - firstPart)); // top level must break
  }
  return best;
}

function memo(n) {
  const cache = new Map();
  function bestProduct(value) {
    if (value === 1) return 1;
    if (cache.has(value)) return cache.get(value);
    let best = value;
    for (let firstPart = 1; firstPart < value; firstPart++) {
      best = Math.max(best, firstPart * bestProduct(value - firstPart));
    }
    cache.set(value, best);
    return best;
  }
  let best = 0;
  for (let firstPart = 1; firstPart < n; firstPart++) {
    best = Math.max(best, firstPart * bestProduct(n - firstPart));
  }
  return best;
}

function tabulation(n) {
  const dp = new Array(n + 1).fill(0);
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    for (let firstPart = 1; firstPart < i; firstPart++) {
      const rest = i - firstPart;
      dp[i] = Math.max(dp[i], firstPart * Math.max(rest, dp[rest]));
    }
  }
  return dp[n];
}

function optimized(n) {
  if (n === 2) return 1;
  if (n === 3) return 2;
  let product = 1;
  while (n > 4) {
    product *= 3; // 3s give the biggest product per unit
    n -= 3;
  }
  return product * n; // leftover is 2, 3 or 4
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve(2), 1);
  assert.strictEqual(solve(3), 2);
  assert.strictEqual(solve(4), 4);
  assert.strictEqual(solve(5), 6);
  assert.strictEqual(solve(10), 36);
  assert.strictEqual(solve(14), 162);
}
assert.strictEqual(tabulation(58), optimized(58));
console.log('✓ 16-integer-break passed');

module.exports = { bruteForce, memo, tabulation, optimized };

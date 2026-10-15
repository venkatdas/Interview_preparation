/**
 * 14. Perfect Squares   (LeetCode 279 — Medium)
 *
 * PROBLEM
 * Return the least number of perfect square numbers (1, 4, 9, 16, ...) that
 * sum to n.
 *
 * EXAMPLES
 * Input: n = 12   Output: 3   Explanation: 4 + 4 + 4
 * Input: n = 13   Output: 2   Explanation: 4 + 9
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= n <= 10^4
 * - Is an answer always possible? (yes, 1 is a perfect square)
 *
 * DP DEFINITION
 * STATE:       dp[i] = min number of squares that sum to i
 * RECURRENCE:  dp[i] = 1 + min over every square s <= i of dp[i - s]
 * BASE CASES:  dp[0] = 0
 * ANSWER:      dp[n]
 *
 * This is "Coin Change" where the coins are the perfect squares.
 *
 * APPROACH 1 — Brute force   exponential time
 * Subtract every square and recurse, keep the minimum.
 *
 * APPROACH 2 — Memoization   O(n * sqrt(n)) time, O(n) space
 * APPROACH 3 — Tabulation   O(n * sqrt(n)) time, O(n) space
 * Dry run, n = 12 (squares 1, 4, 9):
 *   i   : 0  1  2  3  4  5  6  7  8  9  10 11 12
 *   dp  : 0  1  2  3  1  2  3  4  2  1  2  3  3
 *   dp[12] = 1 + min(dp[11], dp[8], dp[3]) = 1 + min(3, 2, 3) = 3
 *
 * APPROACH 4 — Not needed
 * The table already is 1D and every cell may look far back, so no rolling trick.
 * (A math fact, Lagrange's four-square theorem, gives an O(sqrt n) solution,
 * but interviewers want the DP.)
 *
 * EDGE CASES
 * - n = 1 -> 1
 * - n is itself a perfect square -> 1
 */

function bruteForce(n) {
  function minSquares(remaining) {
    if (remaining === 0) return 0;
    let best = Infinity;
    for (let root = 1; root * root <= remaining; root++) {
      best = Math.min(best, 1 + minSquares(remaining - root * root));
    }
    return best;
  }
  return minSquares(n);
}

function memo(n) {
  const cache = new Map();
  function minSquares(remaining) {
    if (remaining === 0) return 0;
    if (cache.has(remaining)) return cache.get(remaining);
    let best = Infinity;
    for (let root = 1; root * root <= remaining; root++) {
      best = Math.min(best, 1 + minSquares(remaining - root * root));
    }
    cache.set(remaining, best);
    return best;
  }
  return minSquares(n);
}

function tabulation(n) {
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= n; i++) {
    for (let root = 1; root * root <= i; root++) {
      dp[i] = Math.min(dp[i], 1 + dp[i - root * root]);
    }
  }
  return dp[n];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation]) {
  assert.strictEqual(solve(1), 1);
  assert.strictEqual(solve(4), 1);
  assert.strictEqual(solve(12), 3);
  assert.strictEqual(solve(13), 2);
  assert.strictEqual(solve(7), 4);
  assert.strictEqual(solve(18), 2);
}
assert.strictEqual(tabulation(10000), 1);
assert.strictEqual(tabulation(9999), 4);
console.log('✓ 14-perfect-squares passed');

module.exports = { bruteForce, memo, tabulation };

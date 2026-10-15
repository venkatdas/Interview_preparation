/**
 * 10. Rod Cutting   (classic CLRS — Medium)
 *
 * PROBLEM
 * A rod of length n can be cut into pieces of integer length. prices[i] is the
 * price of a piece of length i + 1. Return the maximum money you can get by
 * cutting the rod (cutting is free, you may also sell it whole).
 *
 * EXAMPLES
 * Input: prices=[1,5,8,9,10,17,17,20], n=8   Output: 22   Explanation: 2 + 6 -> 5 + 17
 * Input: prices=[3,5,8,9,10,17,17,20], n=8   Output: 24   Explanation: eight pieces of 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can we use the same piece length many times? (yes -> UNBOUNDED knapsack)
 * - Is there a price for every length 1..n? (assume yes; missing lengths could be 0)
 * - Must the whole rod be used? (yes, but with positive prices that is automatic)
 *
 * APPROACH 1 — Brute force   O(2^n) time, O(n) space
 * For a rod of length L choose the first cut i (1..L), earn prices[i-1], recurse
 * on L - i. Every length is recomputed over and over.
 *
 * APPROACH 2 — DP (unbounded knapsack: weight = length, value = price, capacity = n)
 *   O(n^2) time, O(n) space
 * STATE      dp[len] = best revenue for a rod of length len
 * RECURRENCE dp[len] = max over cut 1..len of ( prices[cut-1] + dp[len - cut] )
 * BASE CASES dp[0] = 0
 * ANSWER     dp[n]
 *
 * Dry run: prices=[1,5,8,9], n=4
 *   len:  0  1  2  3   4
 *   dp:   0  1  5  8  10     dp[4] = max(1+dp[3]=9, 5+dp[2]=10, 8+dp[1]=9, 9+dp[0]=9) = 10
 *
 * EDGE CASES
 * - n = 0 -> 0
 * - a single price (only length-1 pieces) -> n * prices[0]
 * - whole rod worth more than any cut -> prices[n-1]
 */

function bruteForce(prices, n) {
  function best(length) {
    if (length === 0) return 0;
    let result = 0;
    for (let cut = 1; cut <= Math.min(length, prices.length); cut++) {
      result = Math.max(result, prices[cut - 1] + best(length - cut));
    }
    return result;
  }
  return best(n);
}

function memo(prices, n) {
  const cache = new Array(n + 1).fill(-1);
  function best(length) {
    if (length === 0) return 0;
    if (cache[length] !== -1) return cache[length];
    let result = 0;
    for (let cut = 1; cut <= Math.min(length, prices.length); cut++) {
      result = Math.max(result, prices[cut - 1] + best(length - cut));
    }
    cache[length] = result;
    return result;
  }
  return best(n);
}

function tabulation(prices, n) {
  const dp = new Array(n + 1).fill(0);
  for (let length = 1; length <= n; length++) {
    for (let cut = 1; cut <= Math.min(length, prices.length); cut++) {
      dp[length] = Math.max(dp[length], prices[cut - 1] + dp[length - cut]);
    }
  }
  return dp[n];
}

// Same thing written as a textbook unbounded knapsack: pieces outer, length inner, forward.
function optimized(prices, n) {
  const dp = new Array(n + 1).fill(0);
  for (let piece = 1; piece <= prices.length; piece++) {
    for (let length = piece; length <= n; length++) {
      dp[length] = Math.max(dp[length], prices[piece - 1] + dp[length - piece]);
    }
  }
  return dp[n];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve([1, 5, 8, 9, 10, 17, 17, 20], 8), 22);
  assert.strictEqual(solve([3, 5, 8, 9, 10, 17, 17, 20], 8), 24);
  assert.strictEqual(solve([1, 5, 8, 9], 4), 10);
  assert.strictEqual(solve([2], 5), 10);
  assert.strictEqual(solve([1, 5, 8, 9], 0), 0);
  assert.strictEqual(solve([1, 2, 100], 3), 100);
}
console.log('✓ 10-rod-cutting passed');

module.exports = { bruteForce, memo, tabulation, optimized };

/**
 * 09. Counting Bits   (LeetCode 338 — Easy)
 *
 * PROBLEM
 * Given n, return an array ans of length n+1 where ans[i] is the number of
 * 1 bits in the binary representation of i.
 *
 * EXAMPLES
 * Input: n = 2   Output: [0,1,1]
 * Input: n = 5   Output: [0,1,1,2,1,2]   Explanation: 0=0b0, 1=0b1, 2=0b10, 3=0b11, 4=0b100, 5=0b101
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 0 <= n <= 10^5
 * - Follow-up: can you do it in O(n) without using a built-in popcount? (that's the DP)
 *
 * DP DEFINITION
 * STATE:       dp[i] = number of 1 bits in i
 * RECURRENCE:  dp[i] = dp[i >> 1] + (i & 1)
 *              (drop the last bit: i >> 1 is a smaller number we already solved;
 *               add 1 if the dropped bit was a 1)
 * BASE CASES:  dp[0] = 0
 * ANSWER:      the whole dp array
 *
 * APPROACH 1 — Brute force   O(n log n) time, O(1) extra space
 * For each i, count bits by repeatedly checking i & 1 and shifting.
 *
 * APPROACH 2 — Memoization   O(n) time, O(n) space
 * bits(i) = bits(i >> 1) + (i & 1), cached.
 *
 * APPROACH 3 — Tabulation   O(n) time, O(n) space
 * Dry run, n = 7:
 *   i      : 0  1  2  3  4  5  6  7
 *   i >> 1 : -  0  1  1  2  2  3  3
 *   i & 1  : -  1  0  1  0  1  0  1
 *   dp     : 0  1  1  2  1  2  2  3
 *
 * APPROACH 4 — Alternative recurrence   O(n) time, O(n) space
 * dp[i] = dp[i & (i-1)] + 1  (i & (i-1) removes the lowest set bit).
 * Same complexity, different "previous state". Both are valid DP on bits.
 *
 * EDGE CASES
 * - n = 0 -> [0]
 */

function bruteForce(n) {
  const result = [];
  for (let i = 0; i <= n; i++) {
    let count = 0;
    let value = i;
    while (value > 0) {
      count += value & 1;
      value >>= 1;
    }
    result.push(count);
  }
  return result;
}

function memo(n) {
  const cache = new Map([[0, 0]]);
  function bits(value) {
    if (cache.has(value)) return cache.get(value);
    const result = bits(value >> 1) + (value & 1);
    cache.set(value, result);
    return result;
  }
  const result = [];
  for (let i = 0; i <= n; i++) result.push(bits(i));
  return result;
}

function tabulation(n) {
  const dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    dp[i] = dp[i >> 1] + (i & 1); // i >> 1 < i, so it is already computed
  }
  return dp;
}

function optimized(n) {
  // same table, different recurrence: remove lowest set bit
  const dp = new Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    dp[i] = dp[i & (i - 1)] + 1;
  }
  return dp;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.deepStrictEqual(solve(0), [0]);
  assert.deepStrictEqual(solve(2), [0, 1, 1]);
  assert.deepStrictEqual(solve(5), [0, 1, 1, 2, 1, 2]);
  assert.deepStrictEqual(solve(7), [0, 1, 1, 2, 1, 2, 2, 3]);
  assert.deepStrictEqual(solve(16).slice(-2), [4, 1]); // 15 = 1111, 16 = 10000
}
console.log('✓ 09-counting-bits passed');

module.exports = { bruteForce, memo, tabulation, optimized };

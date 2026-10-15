/**
 * 11. Ones and Zeroes   (LeetCode 474 — Medium)
 *
 * PROBLEM
 * Given binary strings strs and two budgets m (zeros) and n (ones), return the
 * size of the largest subset of strs that uses at most m zeros and n ones in total.
 *
 * EXAMPLES
 * Input: strs=["10","0001","111001","1","0"], m=5, n=3   Output: 4
 *   Explanation: {"10","0001","1","0"} uses 5 zeros and 3 ones
 * Input: strs=["10","0","1"], m=1, n=1                   Output: 2   ("0","1")
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Each string used at most once? (yes -> 0/1 knapsack)
 * - Two budgets at once? (yes -> the "capacity" is 2-dimensional)
 * - Empty strings? (not on LeetCode)
 *
 * APPROACH 1 — Brute force   O(2^len) time, O(len) space
 * Take or skip each string, tracking zeros and ones left. Count the taken strings.
 *
 * APPROACH 2 — DP (0/1 knapsack with TWO capacities, value = 1 per item)
 *   O(len * m * n) time, O(m * n) space
 * STATE      dp[z][o] = max number of strings using at most z zeros and o ones
 * RECURRENCE dp[z][o] = max( dp[z][o],  1 + dp[z - zeros(str)][o - ones(str)] )
 * BASE CASES dp[*][*] = 0 (no strings taken yet)
 * ANSWER     dp[m][n]
 * Both capacity loops run DOWNWARD so that each string is used once - the same
 * reversed-loop trick as 1D 0/1 knapsack, just in two dimensions.
 *
 * Dry run: strs=["10","0","1"], m=1, n=1
 *   start            dp = [[0,0],[0,0]]      (rows z=0..1, cols o=0..1)
 *   "10" (1z,1o)     dp[1][1] = 1 + dp[0][0] = 1
 *   "0"  (1z,0o)     dp[1][1] = max(1, 1 + dp[0][1]=0) = 1 ; dp[1][0] = 1
 *   "1"  (0z,1o)     dp[1][1] = max(1, 1 + dp[1][0]=1) = 2 ; dp[0][1] = 1
 *   answer dp[1][1] = 2
 *
 * EDGE CASES
 * - m = n = 0 -> 0 (no non-empty string fits)
 * - a string with more zeros than m is simply never taken
 * - empty strs -> 0
 */

function countZerosOnes(str) {
  let zeros = 0;
  for (const ch of str) if (ch === '0') zeros++;
  return [zeros, str.length - zeros];
}

function bruteForce(strs, m, n) {
  const counts = strs.map(countZerosOnes);
  function best(index, zerosLeft, onesLeft) {
    if (index === strs.length) return 0;
    const skip = best(index + 1, zerosLeft, onesLeft);
    const [zeros, ones] = counts[index];
    if (zeros > zerosLeft || ones > onesLeft) return skip;
    return Math.max(skip, 1 + best(index + 1, zerosLeft - zeros, onesLeft - ones));
  }
  return best(0, m, n);
}

function memo(strs, m, n) {
  const counts = strs.map(countZerosOnes);
  const cache = new Map();
  function best(index, zerosLeft, onesLeft) {
    if (index === strs.length) return 0;
    const key = index + ',' + zerosLeft + ',' + onesLeft;
    if (cache.has(key)) return cache.get(key);
    let result = best(index + 1, zerosLeft, onesLeft);
    const [zeros, ones] = counts[index];
    if (zeros <= zerosLeft && ones <= onesLeft) {
      result = Math.max(result, 1 + best(index + 1, zerosLeft - zeros, onesLeft - ones));
    }
    cache.set(key, result);
    return result;
  }
  return best(0, m, n);
}

// 3D table: dp[i][z][o] = best using the first i strings. Shows the full shape.
function tabulation(strs, m, n) {
  const len = strs.length;
  const dp = Array.from({ length: len + 1 }, () =>
    Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  );
  for (let i = 1; i <= len; i++) {
    const [zeros, ones] = countZerosOnes(strs[i - 1]);
    for (let z = 0; z <= m; z++) {
      for (let o = 0; o <= n; o++) {
        dp[i][z][o] = dp[i - 1][z][o];
        if (z >= zeros && o >= ones) {
          dp[i][z][o] = Math.max(dp[i][z][o], 1 + dp[i - 1][z - zeros][o - ones]);
        }
      }
    }
  }
  return dp[len][m][n];
}

// 2D rolling table with both capacity loops reversed.
function optimized(strs, m, n) {
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (const str of strs) {
    const [zeros, ones] = countZerosOnes(str);
    for (let z = m; z >= zeros; z--) {
      for (let o = n; o >= ones; o--) {
        dp[z][o] = Math.max(dp[z][o], 1 + dp[z - zeros][o - ones]);
      }
    }
  }
  return dp[m][n];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve(['10', '0001', '111001', '1', '0'], 5, 3), 4);
  assert.strictEqual(solve(['10', '0', '1'], 1, 1), 2);
  assert.strictEqual(solve(['10', '0', '1'], 0, 0), 0);
  assert.strictEqual(solve([], 3, 3), 0);
  assert.strictEqual(solve(['0', '0', '0'], 2, 0), 2);
  assert.strictEqual(solve(['111', '1', '11'], 0, 3), 2);
}
console.log('✓ 11-ones-and-zeroes passed');

module.exports = { bruteForce, memo, tabulation, optimized };

/**
 * 02. Matrix Chain Multiplication   (Classic CLRS problem — Medium; GFG "Matrix Chain Multiplication")
 *
 * PROBLEM
 * You are given an array dims of length n + 1. Matrix i (0-indexed, i from 0 to n-1)
 * has size dims[i] x dims[i+1]. Multiplying a (p x q) matrix by a (q x r) matrix costs
 * p * q * r scalar multiplications. Matrix multiplication is associative, so you may
 * put parentheses anywhere. Return the minimum total number of scalar multiplications
 * needed to multiply the whole chain.
 *
 * EXAMPLES
 * Input: dims = [2, 3, 4, 5]     Output: 64
 *   Explanation: (A*B)*C = 2*3*4 + 2*4*5 = 24 + 40 = 64;  A*(B*C) = 60 + 30 = 90
 * Input: dims = [10, 20, 30]     Output: 6000   (only two matrices, one way)
 * Input: dims = [40, 20, 30, 10, 30]   Output: 26000
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - At least 2 matrices? If dims.length == 2 there is one matrix -> cost 0.
 * - Values fit in a normal number? (yes for n <= ~100 with dims <= 500)
 *
 * APPROACH 1 — Brute force (plain recursion)   O(2^n) time (Catalan-ish), O(n) space
 * For the chain of matrices l..r try every split k: multiply (l..k) and (k+1..r) first,
 * then multiply the two results. Each split recurses on both sides.
 *
 * APPROACH 2 — Memo / Tabulation (Interval DP, split point)   O(n^3) time, O(n^2) space
 *   STATE      dp[l][r] = min cost to multiply matrices l..r (inclusive)
 *   RECURRENCE dp[l][r] = min over k in [l, r-1] of
 *                         dp[l][k] + dp[k+1][r] + dims[l] * dims[k+1] * dims[r+1]
 *              (left block is dims[l] x dims[k+1], right block is dims[k+1] x dims[r+1])
 *   BASE CASES dp[i][i] = 0   (a single matrix needs no multiplication)
 *   ANSWER     dp[0][n-1]
 *
 * Dry run on dims = [2, 3, 4, 5]  (A=2x3, B=3x4, C=4x5):
 *   len 1: dp[0][0] = dp[1][1] = dp[2][2] = 0
 *   len 2: dp[0][1] = 0+0+2*3*4 = 24     dp[1][2] = 0+0+3*4*5 = 60
 *   len 3: dp[0][2] = min( k=0: dp[0][0]+dp[1][2]+2*3*5 = 90,
 *                          k=1: dp[0][1]+dp[2][2]+2*4*5 = 64 ) = 64
 *
 *        r=0  r=1  r=2
 *   l=0 [ 0 ][ 24 ][ 64 ]
 *   l=1 [ - ][  0 ][ 60 ]
 *   l=2 [ - ][  - ][  0 ]
 *
 * EDGE CASES
 * - One matrix (dims.length == 2) -> 0
 * - Two matrices -> dims[0]*dims[1]*dims[2]
 * - Big values: the sum can be large, but still well within 2^53
 */

function bruteForce(dims) {
  const n = dims.length - 1; // number of matrices

  function cost(left, right) {
    if (left === right) return 0;
    let best = Infinity;
    for (let split = left; split < right; split++) {
      const combine = dims[left] * dims[split + 1] * dims[right + 1];
      best = Math.min(best, cost(left, split) + cost(split + 1, right) + combine);
    }
    return best;
  }
  return n <= 0 ? 0 : cost(0, n - 1);
}

function memo(dims) {
  const n = dims.length - 1;
  if (n <= 0) return 0;
  const cache = Array.from({ length: n }, () => new Array(n).fill(-1));

  function cost(left, right) {
    if (left === right) return 0;
    if (cache[left][right] !== -1) return cache[left][right];
    let best = Infinity;
    for (let split = left; split < right; split++) {
      const combine = dims[left] * dims[split + 1] * dims[right + 1];
      best = Math.min(best, cost(left, split) + cost(split + 1, right) + combine);
    }
    cache[left][right] = best;
    return best;
  }
  return cost(0, n - 1);
}

function tabulation(dims) {
  const n = dims.length - 1;
  if (n <= 0) return 0;
  const dp = Array.from({ length: n }, () => new Array(n).fill(0)); // dp[i][i] = 0 already

  for (let len = 2; len <= n; len++) {            // shorter chains first
    for (let left = 0; left + len - 1 < n; left++) {
      const right = left + len - 1;
      dp[left][right] = Infinity;                   // we take a min, so start high
      for (let split = left; split < right; split++) {
        const combine = dims[left] * dims[split + 1] * dims[right + 1];
        dp[left][right] = Math.min(dp[left][right], dp[left][split] + dp[split + 1][right] + combine);
      }
    }
  }
  return dp[0][n - 1];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation]) {
  assert.strictEqual(solve([2, 3, 4, 5]), 64);
  assert.strictEqual(solve([10, 20, 30]), 6000);           // two matrices
  assert.strictEqual(solve([40, 20, 30, 10, 30]), 26000);
  assert.strictEqual(solve([1, 2, 3, 4, 3]), 30);
  assert.strictEqual(solve([5, 10]), 0);                   // single matrix
  assert.strictEqual(solve([10, 30, 5, 60]), 4500);
  assert.strictEqual(solve([1, 1, 1, 1, 1, 1]), 4);
}
console.log('✓ 02-matrix-chain-multiplication passed');

module.exports = { bruteForce, memo, tabulation };

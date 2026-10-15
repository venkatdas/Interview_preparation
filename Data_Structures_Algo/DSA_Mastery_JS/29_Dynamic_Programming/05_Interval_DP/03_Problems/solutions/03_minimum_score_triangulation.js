/**
 * 03. Minimum Score Triangulation of Polygon   (LeetCode 1039 — Medium)
 *
 * PROBLEM
 * You have a convex polygon with n vertices. values[i] is the number written on
 * vertex i (in clockwise order). Triangulate the polygon into n - 2 triangles.
 * The score of a triangle is the product of its three vertex values; the score of a
 * triangulation is the sum of its triangle scores. Return the minimum possible score.
 *
 * EXAMPLES
 * Input: [1, 2, 3]        Output: 6     Explanation: one triangle, 1*2*3
 * Input: [3, 7, 4, 5]     Output: 144   Explanation: 3*7*5 + 4*5*7 = 105+140 = 245
 *                                       or 3*4*5 + 3*4*7 = 60 + 84 = 144 (better)
 * Input: [1, 3, 1, 4, 1, 5] Output: 13
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 3 <= n <= 50, 1 <= values[i] <= 100
 * - Is the polygon always convex? (yes, so any diagonal is valid)
 *
 * APPROACH 1 — Brute force (plain recursion)   O(Catalan(n)) ~ O(4^n) time, O(n) space
 * The edge (l, r) must belong to exactly one triangle. Try every third vertex k strictly
 * between l and r; that triangle splits the polygon into two smaller polygons
 * l..k and k..r. Recurse on both.
 *
 * APPROACH 2 — Memo / Tabulation (Interval DP, boundary style)   O(n^3) time, O(n^2) space
 *   STATE      dp[l][r] = min score to triangulate the polygon formed by vertices l..r
 *                         (the edge l-r is one of its sides)
 *   RECURRENCE dp[l][r] = min over k in (l, r) of
 *                         dp[l][k] + dp[k][r] + values[l] * values[k] * values[r]
 *              Note the sub-ranges SHARE vertex k (boundary style, not [k+1, r]).
 *   BASE CASES dp[l][r] = 0 when r - l < 2   (fewer than 3 vertices: no triangle)
 *   ANSWER     dp[0][n-1]
 *
 * Dry run on [3, 7, 4, 5]:
 *   len 3: dp[0][2] = 3*7*4 = 84    dp[1][3] = 7*4*5 = 140
 *   len 4: dp[0][3] = min( k=1: dp[0][1] + dp[1][3] + 3*7*5 = 0+140+105 = 245,
 *                          k=2: dp[0][2] + dp[2][3] + 3*4*5 = 84+0+60   = 144 ) = 144
 *
 *        r=0  r=1  r=2   r=3
 *   l=0 [ 0 ][ 0 ][ 84 ][ 144 ]
 *   l=1 [ - ][ 0 ][  0 ][ 140 ]
 *   l=2 [ - ][ - ][  0 ][   0 ]
 *   l=3 [ - ][ - ][  - ][   0 ]
 *
 * EDGE CASES
 * - n == 3 -> single triangle
 * - all values 1 -> answer is n - 2 (number of triangles)
 */

function bruteForce(values) {
  function score(left, right) {
    if (right - left < 2) return 0; // an edge or a point, no triangle possible
    let best = Infinity;
    for (let k = left + 1; k < right; k++) {
      best = Math.min(best, score(left, k) + score(k, right) + values[left] * values[k] * values[right]);
    }
    return best;
  }
  return score(0, values.length - 1);
}

function memo(values) {
  const n = values.length;
  const cache = Array.from({ length: n }, () => new Array(n).fill(-1));

  function score(left, right) {
    if (right - left < 2) return 0;
    if (cache[left][right] !== -1) return cache[left][right];
    let best = Infinity;
    for (let k = left + 1; k < right; k++) {
      best = Math.min(best, score(left, k) + score(k, right) + values[left] * values[k] * values[right]);
    }
    cache[left][right] = best;
    return best;
  }
  return score(0, n - 1);
}

function tabulation(values) {
  const n = values.length;
  const dp = Array.from({ length: n }, () => new Array(n).fill(0)); // len 1 and 2 = 0

  for (let len = 3; len <= n; len++) {
    for (let left = 0; left + len - 1 < n; left++) {
      const right = left + len - 1;
      dp[left][right] = Infinity;
      for (let k = left + 1; k < right; k++) {
        const triangle = values[left] * values[k] * values[right];
        dp[left][right] = Math.min(dp[left][right], dp[left][k] + dp[k][right] + triangle);
      }
    }
  }
  return dp[0][n - 1];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation]) {
  assert.strictEqual(solve([1, 2, 3]), 6);                 // single triangle
  assert.strictEqual(solve([3, 7, 4, 5]), 144);
  assert.strictEqual(solve([1, 3, 1, 4, 1, 5]), 13);
  assert.strictEqual(solve([1, 1, 1, 1, 1]), 3);            // n - 2 triangles
  assert.strictEqual(solve([2, 2, 2, 2]), 16);
  assert.strictEqual(solve([5, 1, 5, 1, 5]), 35);           // fan from a value-1 vertex: 5+5+25
}
console.log('✓ 03-minimum-score-triangulation passed');

module.exports = { bruteForce, memo, tabulation };

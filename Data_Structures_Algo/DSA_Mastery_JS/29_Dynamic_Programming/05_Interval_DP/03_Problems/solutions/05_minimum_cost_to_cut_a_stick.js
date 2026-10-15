/**
 * 05. Minimum Cost to Cut a Stick   (LeetCode 1547 — Hard)
 *
 * PROBLEM
 * A wooden stick of length n is labelled from 0 to n. You are given an array cuts of
 * positions where you must cut. The cost of one cut equals the CURRENT length of the
 * stick piece being cut. You may perform the cuts in any order. Return the minimum
 * total cost.
 *
 * EXAMPLES
 * Input: n = 7, cuts = [1, 3, 4, 5]   Output: 16
 *   Explanation: order [3, 5, 1, 4] costs 7 + 4 + 3 + 2 = 16. Order [1,3,4,5] costs 7+6+4+3 = 20.
 * Input: n = 9, cuts = [5, 6, 1, 4, 2]   Output: 22
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 2 <= n <= 10^6, 1 <= cuts.length <= 100 (so DP is on the CUTS, not on n)
 * - Cuts are distinct and strictly inside (0, n).
 * - Is cuts sorted? (not necessarily; we sort it ourselves)
 *
 * APPROACH 1 — Brute force (plain recursion)   O(m! ) time worst, O(m) space
 * For the piece between positions a and b, try every cut inside it as the FIRST cut:
 * pay (b - a), then recurse on both halves. Each level tries all remaining cuts.
 *
 * APPROACH 2 — Memo / Tabulation (Interval DP with sentinels)   O(m^3) time, O(m^2) space
 * Sort the cuts and add sentinels 0 and n at both ends:
 *   points = [0, ...sorted cuts, n]
 * Now every stick piece is described by two indices (l, r) into `points`, and the
 * piece has length points[r] - points[l]. All cuts strictly between them are
 * points[l+1..r-1].
 *
 *   STATE      dp[l][r] = min cost to perform all cuts strictly between points[l] and points[r]
 *   RECURRENCE dp[l][r] = min over k in (l, r) of
 *                         dp[l][k] + dp[k][r] + (points[r] - points[l])
 *              "k is the first cut made in this piece; it costs the full piece length,
 *               then the two halves are independent sticks"
 *              (Here 'first' works because the cost of cut k is the piece length, which is
 *               fixed once the piece [l, r] exists -- the order inside halves doesn't change it.)
 *   BASE CASES dp[l][r] = 0 when r - l <= 1   (no cut between neighbours)
 *   ANSWER     dp[0][m+1]
 *
 * Dry run on n = 7, cuts = [1, 3, 4, 5]:  points = [0, 1, 3, 4, 5, 7]
 *   len 2 (adjacent): all 0
 *   len 3: dp[0][2] = 3 (piece 0..3, one cut)   dp[1][3] = 3   dp[2][4] = 2   dp[3][5] = 3
 *   len 4: dp[0][3] = min(k=1: 0+3+4, k=2: 3+0+4) = 7
 *          dp[1][4] = min(k=2: 0+2+4, k=3: 3+0+4) = 6
 *          dp[2][5] = min(k=3: 0+3+4, k=4: 2+0+4) = 6
 *   len 5: dp[0][4] = min(k=1: 0+6+5, k=2: 3+2+5, k=3: 7+0+5) = 10
 *          dp[1][5] = min(k=2: 0+6+6, k=3: 3+3+6, k=4: 6+0+6) = 12
 *   len 6: dp[0][5] = min(k=1: 0+12+7, k=2: 3+6+7, k=3: 7+3+7, k=4: 10+0+7) = 16
 *
 * EDGE CASES
 * - One cut -> cost n
 * - Two cuts -> n + (the longer of the two sides) ... whichever order is cheaper
 * - Unsorted cuts input
 */

function buildPoints(n, cuts) {
  return [0, ...[...cuts].sort((a, b) => a - b), n];
}

function bruteForce(n, cuts) {
  const points = buildPoints(n, cuts);

  function cost(left, right) {
    if (right - left <= 1) return 0; // no cut lies strictly inside
    let best = Infinity;
    for (let k = left + 1; k < right; k++) {
      best = Math.min(best, cost(left, k) + cost(k, right) + (points[right] - points[left]));
    }
    return best;
  }
  return cost(0, points.length - 1);
}

function memo(n, cuts) {
  const points = buildPoints(n, cuts);
  const m = points.length;
  const cache = Array.from({ length: m }, () => new Array(m).fill(-1));

  function cost(left, right) {
    if (right - left <= 1) return 0;
    if (cache[left][right] !== -1) return cache[left][right];
    let best = Infinity;
    for (let k = left + 1; k < right; k++) {
      best = Math.min(best, cost(left, k) + cost(k, right) + (points[right] - points[left]));
    }
    cache[left][right] = best;
    return best;
  }
  return cost(0, m - 1);
}

function tabulation(n, cuts) {
  const points = buildPoints(n, cuts);
  const m = points.length;
  const dp = Array.from({ length: m }, () => new Array(m).fill(0)); // len <= 2 stays 0

  for (let len = 3; len <= m; len++) {           // need at least one cut inside
    for (let left = 0; left + len - 1 < m; left++) {
      const right = left + len - 1;
      dp[left][right] = Infinity;
      const pieceLength = points[right] - points[left];
      for (let k = left + 1; k < right; k++) {
        dp[left][right] = Math.min(dp[left][right], dp[left][k] + dp[k][right] + pieceLength);
      }
    }
  }
  return dp[0][m - 1];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation]) {
  assert.strictEqual(solve(7, [1, 3, 4, 5]), 16);
  assert.strictEqual(solve(9, [5, 6, 1, 4, 2]), 22);     // unsorted input
  assert.strictEqual(solve(10, [5]), 10);                 // one cut
  assert.strictEqual(solve(10, [2, 8]), 18);              // two cuts: 10 + 8
  assert.strictEqual(solve(4, [1, 2, 3]), 8);             // 4 + 2 + 2
  assert.strictEqual(solve(20, [10, 5, 15]), 40);
}
console.log('✓ 05-minimum-cost-to-cut-a-stick passed');

module.exports = { bruteForce, memo, tabulation };

/**
 * 08. Last Stone Weight II   (LeetCode 1049 — Medium)
 *
 * PROBLEM
 * You have stones with positive weights. Repeatedly pick ANY two stones x <= y
 * and smash them: if x == y both vanish, otherwise a stone of weight y - x
 * remains. Return the SMALLEST possible weight of the last stone (0 if none).
 *
 * EXAMPLES
 * Input: [2,7,4,1,8,1]   Output: 1
 *   Explanation: 2,4->2 | 7,8->1 | 2,1->1 | 1,1->0 | 1 left
 * Input: [31,26,33,21,40]   Output: 5
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Do we choose which stones to smash? (yes - that is the difference from
 *   "Last Stone Weight I", which forces the two heaviest and is a heap problem)
 * - Weights are positive ints, small total (<= 3000 on LeetCode)?
 *
 * APPROACH 1 — Brute force   O(2^n) time, O(n) space
 * Key insight: any sequence of smashes assigns a + or - sign to every stone,
 * and the result is |sum(plus) - sum(minus)|. So try every sign assignment and
 * take the smallest non-negative result.
 *
 * APPROACH 2 — DP (subset sum closest to total/2)   O(n * total) time, O(total) space
 * Split stones into two piles S1 and S2, answer = S1 - S2 with S1 >= S2.
 * To minimise S1 - S2 = total - 2*S2 we want S2 as large as possible but
 * at most total/2. So: find the largest reachable subset sum <= total/2.
 *
 * STATE      dp[s] = can some subset of the stones seen so far weigh exactly s
 * RECURRENCE dp[s] = dp[s] || dp[s - stone]   (s downward, each stone once)
 * BASE CASES dp[0] = true
 * ANSWER     total - 2 * (largest s <= total/2 with dp[s] true)
 *
 * Dry run: [2,7,4,1,8,1], total 23, half 11
 *   reachable sums <= 11 after all stones include 11 (2+8+1 or 7+4)
 *   best S2 = 11 -> answer 23 - 22 = 1
 *
 * EDGE CASES
 * - single stone -> its weight
 * - all stones equal and an even count -> 0
 * - empty -> 0
 */

function bruteForce(stones) {
  function smallest(index, signedSum) {
    if (index === stones.length) return Math.abs(signedSum);
    return Math.min(
      smallest(index + 1, signedSum + stones[index]),
      smallest(index + 1, signedSum - stones[index])
    );
  }
  return smallest(0, 0);
}

function memo(stones) {
  const cache = new Map();
  function smallest(index, signedSum) {
    if (index === stones.length) return Math.abs(signedSum);
    const key = index + ',' + signedSum;
    if (cache.has(key)) return cache.get(key);
    const result = Math.min(
      smallest(index + 1, signedSum + stones[index]),
      smallest(index + 1, signedSum - stones[index])
    );
    cache.set(key, result);
    return result;
  }
  return smallest(0, 0);
}

function tabulation(stones) {
  const total = stones.reduce((a, b) => a + b, 0);
  const half = Math.floor(total / 2);
  const n = stones.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(half + 1).fill(false));
  for (let i = 0; i <= n; i++) dp[i][0] = true;
  for (let i = 1; i <= n; i++) {
    const stone = stones[i - 1];
    for (let s = 1; s <= half; s++) {
      dp[i][s] = dp[i - 1][s] || (s >= stone && dp[i - 1][s - stone]);
    }
  }
  for (let s = half; s >= 0; s--) {
    if (dp[n][s]) return total - 2 * s;
  }
  return total;
}

function optimized(stones) {
  const total = stones.reduce((a, b) => a + b, 0);
  const half = Math.floor(total / 2);
  const dp = new Array(half + 1).fill(false);
  dp[0] = true;
  for (const stone of stones) {
    for (let s = half; s >= stone; s--) {
      if (dp[s - stone]) dp[s] = true;
    }
  }
  for (let s = half; s >= 0; s--) {
    if (dp[s]) return total - 2 * s; // the first reachable sum from the top is the best S2
  }
  return total;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve([2, 7, 4, 1, 8, 1]), 1);
  assert.strictEqual(solve([31, 26, 33, 21, 40]), 5);
  assert.strictEqual(solve([1, 2]), 1);
  assert.strictEqual(solve([5]), 5);
  assert.strictEqual(solve([3, 3, 3, 3]), 0);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([1, 1, 4, 2, 2]), 0);
}
console.log('✓ 08-last-stone-weight-ii passed');

module.exports = { bruteForce, memo, tabulation, optimized };

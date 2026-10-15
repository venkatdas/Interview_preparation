/**
 * 03. Number of Ways to Stay in the Same Place After Some Steps   (LeetCode 1269 — Hard)
 *
 * PROBLEM
 * You stand at index 0 of an array of length arrLen. In one step you can move left,
 * move right, or stay (never leaving the array). Count the ways to be back at index 0
 * after exactly `steps` steps, modulo 1e9 + 7.
 *
 * EXAMPLES
 * Input: steps = 3, arrLen = 2   Output: 4
 *   Explanation: RLS, RSL, SRL, SSS   (R = right, L = left, S = stay)
 * Input: steps = 2, arrLen = 4   Output: 2   Explanation: RL, SS
 * Input: steps = 4, arrLen = 2   Output: 8
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= steps <= 500, 1 <= arrLen <= 10^6
 * - Key observation: in `steps` moves you can never get farther than steps/2 from 0
 *   and still come back, so only min(arrLen, steps/2 + 1) positions matter.
 *
 * APPROACH 1 — Brute force (plain recursion)   O(3^steps) time, O(steps) space
 * ways(stepsLeft, position): try stay / left / right and recurse.
 *
 * APPROACH 2 — 2D DP (steps x positions)   O(steps * min(arrLen, steps)) time, same space
 * STATE      dp[s][p] = number of ways to be at position p after s steps.
 * RECURRENCE dp[s][p] = dp[s-1][p] (stayed) + dp[s-1][p-1] (came from left)
 *                     + dp[s-1][p+1] (came from right), skipping out-of-range neighbours.
 * BASE CASES dp[0][0] = 1 (at start, before moving), dp[0][p>0] = 0.
 * ANSWER     dp[steps][0].
 * The position limit is maxPos = min(arrLen - 1, steps / 2) because going further
 * means you cannot return in time.
 *
 * Dry run steps = 3, arrLen = 2 (positions 0 and 1):
 *   s=0 : [1, 0]
 *   s=1 : [1+0, 1+0]        = [1, 1]
 *   s=2 : [1+1, 1+1]        = [2, 2]
 *   s=3 : [2+2, 2+2]        = [4, 4]   -> dp[3][0] = 4
 *
 * APPROACH 3 — Rolling array   O(1) extra rows: only the previous row is needed.
 *
 * EDGE CASES
 * - arrLen = 1 -> only "stay" is possible -> answer 1
 * - steps = 1 -> 1 (must stay)
 */

const MOD = 1_000_000_007;

function bruteForce(steps, arrLen) {
  function ways(stepsLeft, position) {
    if (position < 0 || position >= arrLen) return 0;
    if (stepsLeft === 0) return position === 0 ? 1 : 0;
    return (
      (ways(stepsLeft - 1, position) +
        ways(stepsLeft - 1, position - 1) +
        ways(stepsLeft - 1, position + 1)) % MOD
    );
  }
  return ways(steps, 0);
}

function memo(steps, arrLen) {
  const maxPos = Math.min(arrLen - 1, steps); // beyond this you can't return anyway
  // key encoded as a number: stepsLeft * (maxPos + 1) + position (faster than strings)
  const cache = new Map();
  function ways(stepsLeft, position) {
    if (position < 0 || position > maxPos) return 0;
    if (stepsLeft === 0) return position === 0 ? 1 : 0;
    if (position > stepsLeft) return 0; // pruning: too far to come back
    const key = stepsLeft * (maxPos + 1) + position;
    if (cache.has(key)) return cache.get(key);
    const result =
      (ways(stepsLeft - 1, position) +
        ways(stepsLeft - 1, position - 1) +
        ways(stepsLeft - 1, position + 1)) % MOD;
    cache.set(key, result);
    return result;
  }
  return ways(steps, 0);
}

function tabulation(steps, arrLen) {
  const maxPos = Math.min(arrLen - 1, Math.floor(steps / 2));
  const dp = Array.from({ length: steps + 1 }, () => new Array(maxPos + 1).fill(0));
  dp[0][0] = 1;
  for (let s = 1; s <= steps; s++) {
    for (let p = 0; p <= maxPos; p++) {
      let total = dp[s - 1][p];                        // stayed
      if (p > 0) total += dp[s - 1][p - 1];            // came from the left
      if (p < maxPos) total += dp[s - 1][p + 1];       // came from the right
      dp[s][p] = total % MOD;
    }
  }
  return dp[steps][0];
}

function optimized(steps, arrLen) {
  const maxPos = Math.min(arrLen - 1, Math.floor(steps / 2));
  let prev = new Array(maxPos + 1).fill(0);
  prev[0] = 1;
  for (let s = 1; s <= steps; s++) {
    const current = new Array(maxPos + 1).fill(0);
    for (let p = 0; p <= maxPos; p++) {
      let total = prev[p];
      if (p > 0) total += prev[p - 1];
      if (p < maxPos) total += prev[p + 1];
      current[p] = total % MOD;
    }
    prev = current;
  }
  return prev[0];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve(3, 2), 4);
  assert.strictEqual(solve(2, 4), 2);
  assert.strictEqual(solve(4, 2), 8);
  assert.strictEqual(solve(1, 1), 1);   // only stay
  assert.strictEqual(solve(5, 1), 1);   // arrLen 1 -> always stay
  assert.strictEqual(solve(10, 3), 1682);
}
for (const solve of [memo, tabulation, optimized]) {
  assert.strictEqual(solve(27, 7), 127784505);
}
console.log('✓ 03-number-of-ways-to-stay-in-same-place passed');

module.exports = { bruteForce, memo, tabulation, optimized };

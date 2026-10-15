/**
 * 01. Count Numbers with Unique Digits   (LeetCode 357 — Medium)
 *
 * PROBLEM
 * Given n, count all numbers x with 0 <= x < 10^n whose digits are all different.
 * (So for n = 2 we look at 0..99 and throw away 11, 22, 33, ... 99.)
 *
 * EXAMPLES
 * Input: n = 0   Output: 1     Explanation: only the number 0
 * Input: n = 1   Output: 10    Explanation: 0..9
 * Input: n = 2   Output: 91    Explanation: 100 numbers minus the 9 repeats 11,22,...,99
 * Input: n = 3   Output: 739
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 0 <= n <= 8 (after 10 digits there is nothing new: you cannot have 11 distinct digits)
 * - Is 0 counted? (yes)
 *
 * APPROACH 1 — Brute force (plain recursion over digits)   O(10^n * n) time, O(n) space
 * Build every number digit by digit, keep a "used digits" set, count the ones that are
 * valid. This is the "digit DP lite" idea without memo: at each position choose a digit
 * not used yet. We only run it for tiny n in tests.
 *
 * APPROACH 2 — DP by length (digit DP lite)   O(n) time, O(n) space
 * STATE      dp[k] = how many numbers with EXACTLY k digits (no leading zero) have all
 *            digits unique.
 * RECURRENCE dp[k] = 9 * 9 * 8 * 7 * ... (k terms): first digit 1..9 (9 choices), second
 *            digit any of the remaining 9 (0 is now allowed), third 8 choices, and so on.
 *            dp[k] = dp[k - 1] * (10 - (k - 1))  for k >= 2.
 * BASE CASES dp[0] = 1 (just the number 0), dp[1] = 9 (1..9).
 * ANSWER     sum of dp[0..n]  (numbers with 0, 1, 2 ... n digits).
 *
 * Dry run n = 3:
 *   k | dp[k]           | running sum
 *   0 | 1               | 1
 *   1 | 9               | 10
 *   2 | 9 * 9 = 81      | 91
 *   3 | 81 * 8 = 648    | 739   <- answer
 *
 * Why is this "digit DP"? The real digit DP pattern counts numbers <= some limit by
 * walking the digits with a "tight" flag. Here the limit is 10^n - 1 = 999...9, so the
 * bound is never tight and the state collapses to just "how many digits are left".
 *
 * EDGE CASES
 * - n = 0 -> 1
 * - n >= 10 -> same answer as n = 10 (no more unique-digit numbers exist)
 */

function bruteForce(n) {
  // Count every number in [0, 10^n) by generating digit strings with a used-set.
  const limit = Math.pow(10, n);
  let count = 0;
  for (let x = 0; x < limit; x++) {
    const seen = new Set(String(x));
    if (seen.size === String(x).length) count++;
  }
  return count;
}

function memo(n) {
  const cache = new Map();
  // exactlyK(k) = count of k-digit numbers with unique digits (no leading zero)
  function exactlyK(k) {
    if (k === 0) return 1;
    if (k === 1) return 9;
    if (k > 10) return 0; // cannot pick 11 distinct digits
    if (cache.has(k)) return cache.get(k);
    const result = exactlyK(k - 1) * (10 - (k - 1)); // one fewer digit is free
    cache.set(k, result);
    return result;
  }
  let total = 0;
  for (let k = 0; k <= n; k++) total += exactlyK(k);
  return total;
}

function tabulation(n) {
  n = Math.min(n, 10);
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  if (n >= 1) dp[1] = 9;
  for (let k = 2; k <= n; k++) {
    dp[k] = dp[k - 1] * (10 - (k - 1));
  }
  return dp.reduce((sum, value) => sum + value, 0);
}

function optimized(n) {
  // Only the previous dp value is needed -> O(1) space.
  n = Math.min(n, 10);
  if (n === 0) return 1;
  let total = 10;        // dp[0] + dp[1]
  let current = 9;       // dp[1]
  let available = 9;     // choices for the next digit
  for (let k = 2; k <= n; k++) {
    current *= available;
    available--;
    total += current;
  }
  return total;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve(0), 1);
  assert.strictEqual(solve(1), 10);
  assert.strictEqual(solve(2), 91);
  assert.strictEqual(solve(3), 739);
  assert.strictEqual(solve(4), 5275);
}
for (const solve of [memo, tabulation, optimized]) {
  assert.strictEqual(solve(8), 2345851);
  assert.strictEqual(solve(11), solve(10)); // nothing new after 10 digits
}
console.log('✓ 01-count-numbers-with-unique-digits passed');

module.exports = { bruteForce, memo, tabulation, optimized };

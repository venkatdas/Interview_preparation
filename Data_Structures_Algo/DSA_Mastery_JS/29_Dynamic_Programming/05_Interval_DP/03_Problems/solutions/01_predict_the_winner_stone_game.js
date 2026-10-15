/**
 * 01. Predict the Winner / Stone Game   (LeetCode 486 — Medium, LeetCode 877 — Medium)
 *
 * PROBLEM
 * Two players take turns picking a number from EITHER END of an array. Each number
 * picked is added to that player's score. Both play optimally. Return true if
 * player 1 can win (ties count as a win for player 1).
 * Stone Game (877) is the same problem with the extra promise that the array has
 * even length and an odd total (so there is always a winner); the same DP solves it.
 *
 * EXAMPLES
 * Input: [1, 5, 2]       Output: false
 *   Explanation: player 1 takes 1 or 2; player 2 then takes 5 and wins.
 * Input: [1, 5, 233, 7]  Output: true
 *   Explanation: player 1 takes 1, player 2 takes 5 or 7, player 1 takes 233.
 * Input: [5, 3, 4, 5]    Output: true   (Stone Game example)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is a tie a win for player 1? (LeetCode 486: yes)
 * - 1 <= n <= 20 and values are non-negative. (DP works for any n up to ~1000.)
 *
 * APPROACH 1 — Brute force (plain recursion)   O(2^n) time, O(n) space
 * At each turn the current player has 2 choices (left or right). Try both and take
 * the one that maximizes (my score - opponent score). Branching factor 2, depth n.
 *
 * APPROACH 2 — Memo / Tabulation (Interval DP, score difference)   O(n^2) time, O(n^2) space
 * Instead of tracking two scores, track ONE number per range.
 *
 *   STATE      dp[l][r] = best (current player's score - other player's score)
 *                         the player to move can achieve on the sub-array nums[l..r]
 *   RECURRENCE dp[l][r] = max( nums[l] - dp[l+1][r],   // take left; opponent moves next
 *                              nums[r] - dp[l][r-1] )  // take right
 *              (subtract because the opponent's best difference is against us)
 *   BASE CASES dp[i][i] = nums[i]     (only one number left, take it)
 *   ANSWER     dp[0][n-1] >= 0
 *
 * Why does this work? The "difference" view folds both players into one number, and
 * the sub-game after my move is exactly the same game on a smaller range for the
 * other player.
 *
 * Dry run on [1, 5, 2]:
 *   len 1: dp[0][0]=1  dp[1][1]=5  dp[2][2]=2
 *   len 2: dp[0][1] = max(1-5, 5-1) = 4
 *          dp[1][2] = max(5-2, 2-5) = 3
 *   len 3: dp[0][2] = max(1 - dp[1][2], 2 - dp[0][1]) = max(1-3, 2-4) = -2
 *   -2 < 0 -> false
 *
 *        r=0  r=1  r=2
 *   l=0 [ 1 ][ 4 ][ -2 ]
 *   l=1 [ - ][ 5 ][  3 ]
 *   l=2 [ - ][ - ][  2 ]
 *
 * APPROACH 3 — Optimized (1D rolling array)   O(n^2) time, O(n) space
 * dp[l][r] only needs dp[l+1][r] (row below) and dp[l][r-1] (same row, left).
 * Iterating l from n-1 down to 0 and r from l+1 up, a single array indexed by r
 * holds "row l+1" before we overwrite it with "row l".
 *
 * EDGE CASES
 * - Single element -> player 1 takes it -> true
 * - Two elements   -> player 1 takes the bigger -> true
 * - All equal      -> tie -> true
 */

function bruteForce(nums) {
  function diff(left, right) {
    if (left === right) return nums[left];
    const takeLeft = nums[left] - diff(left + 1, right);
    const takeRight = nums[right] - diff(left, right - 1);
    return Math.max(takeLeft, takeRight);
  }
  return diff(0, nums.length - 1) >= 0;
}

function memo(nums) {
  const n = nums.length;
  const cache = Array.from({ length: n }, () => new Array(n).fill(null));

  function diff(left, right) {
    if (left === right) return nums[left];
    if (cache[left][right] !== null) return cache[left][right];
    const takeLeft = nums[left] - diff(left + 1, right);
    const takeRight = nums[right] - diff(left, right - 1);
    cache[left][right] = Math.max(takeLeft, takeRight);
    return cache[left][right];
  }
  return diff(0, n - 1) >= 0;
}

function tabulation(nums) {
  const n = nums.length;
  const dp = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) dp[i][i] = nums[i]; // base: one number left

  for (let len = 2; len <= n; len++) {
    for (let left = 0; left + len - 1 < n; left++) {
      const right = left + len - 1;
      dp[left][right] = Math.max(
        nums[left] - dp[left + 1][right],
        nums[right] - dp[left][right - 1]
      );
    }
  }
  return dp[0][n - 1] >= 0;
}

function optimized(nums) {
  const n = nums.length;
  // row[r] represents dp[left][r] for the current `left` being processed
  const row = new Array(n).fill(0);
  for (let left = n - 1; left >= 0; left--) {
    row[left] = nums[left]; // dp[left][left]
    for (let right = left + 1; right < n; right++) {
      // before overwrite, row[right] still holds dp[left+1][right];
      // row[right-1] already holds dp[left][right-1]
      row[right] = Math.max(nums[left] - row[right], nums[right] - row[right - 1]);
    }
  }
  return row[n - 1] >= 0;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve([1, 5, 2]), false);
  assert.strictEqual(solve([1, 5, 233, 7]), true);
  assert.strictEqual(solve([5, 3, 4, 5]), true);
  assert.strictEqual(solve([7]), true);           // single element
  assert.strictEqual(solve([2, 9]), true);        // two elements
  assert.strictEqual(solve([3, 3, 3]), true);     // tie counts as win
  assert.strictEqual(solve([1, 567, 1, 1]), true);
  assert.strictEqual(solve([3, 7, 2, 3]), true);
}
console.log('✓ 01-predict-the-winner-stone-game passed');

module.exports = { bruteForce, memo, tabulation, optimized };

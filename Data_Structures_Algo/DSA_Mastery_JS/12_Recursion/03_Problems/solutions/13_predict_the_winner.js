/**
 * 13. Predict the Winner (minimax recursion)   (LeetCode 486 — Medium)
 *
 * PROBLEM
 * Two players take turns removing a number from EITHER end of an array and adding it to
 * their score. Player 1 moves first. Both play optimally. Return true if player 1 ends
 * with a score >= player 2's score.
 *
 * EXAMPLES
 * [1, 5, 2]       -> false   (whatever P1 takes, P2 grabs the 5)
 * [1, 5, 233, 7]  -> true    (P1 takes 1; whatever P2 takes, P1 can take 233)
 * [7]             -> true
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= n <= 20, 0 <= nums[i] <= 10^7
 * - A tie counts as a win for player 1 (yes)
 *
 * APPROACH 1 — Brute force (minimax on score difference)   O(2^n) time, O(n) stack
 * PROMISE: diff(i, j) = best (my score - opponent score) the player TO MOVE can force
 * on nums[i..j].
 *   base: i === j -> nums[i]
 *   step: take left  -> nums[i] - diff(i+1, j)   (the opponent then plays optimally,
 *         take right -> nums[j] - diff(i, j-1)    and their advantage counts against me)
 *         return the max of the two.
 * Answer: diff(0, n-1) >= 0. Using the DIFFERENCE removes the need to track two scores
 * and whose turn it is: the sign flip IS the turn change.
 *
 * APPROACH 2 — Optimal (same recursion + memo on (i, j))   O(n^2) time, O(n^2) space
 * Only n^2 distinct (i, j) intervals exist, so cache them. This is interval DP top-down.
 *
 * Dry run [1, 5, 2]:
 *   diff(1,2) = max(5 - 2, 2 - 5) = 3      diff(0,1) = max(1 - 5, 5 - 1) = 4
 *   diff(0,2) = max(1 - diff(1,2), 2 - diff(0,1)) = max(-2, -2) = -2 -> false
 *
 * EDGE CASES
 * - n = 1 -> true;  n = 2 -> true (take the larger)
 * - even n: player 1 can always win (take all even or all odd indices), a nice check
 */

function bruteForce(nums) {
  const diff = (i, j) => (i === j ? nums[i] : Math.max(nums[i] - diff(i + 1, j), nums[j] - diff(i, j - 1)));
  return diff(0, nums.length - 1) >= 0;
}

function optimal(nums) {
  const n = nums.length;
  const memo = Array.from({ length: n }, () => new Array(n).fill(null));
  function diff(i, j) {
    if (i === j) return nums[i];
    if (memo[i][j] !== null) return memo[i][j];
    const best = Math.max(nums[i] - diff(i + 1, j), nums[j] - diff(i, j - 1));
    memo[i][j] = best;
    return best;
  }
  return diff(0, n - 1) >= 0;
}

// ---------- tests ----------
const assert = require('assert');
assert.strictEqual(optimal([1, 5, 2]), false);
assert.strictEqual(optimal([1, 5, 233, 7]), true);
assert.strictEqual(optimal([7]), true);
assert.strictEqual(optimal([0, 0]), true);
assert.strictEqual(optimal([2, 4, 55, 6, 8]), false);
let seed = 33;
const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
for (let t = 0; t < 200; t++) {
  const n = 1 + Math.floor(rnd() * 14);
  const nums = Array.from({ length: n }, () => Math.floor(rnd() * 50));
  assert.strictEqual(optimal(nums), bruteForce(nums), JSON.stringify(nums));
  if (n % 2 === 0) assert.strictEqual(optimal(nums), true);
}
console.log('✓ 13_predict_the_winner passed');

module.exports = { optimal, bruteForce };

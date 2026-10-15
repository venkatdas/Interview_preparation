/**
 * 12. Jump Game II   (LeetCode 45 — Medium)
 *
 * PROBLEM
 * Same jumping rules as Jump Game, but now it is guaranteed you CAN reach the
 * last index. Return the MINIMUM number of jumps needed.
 *
 * EXAMPLES
 * Input: [2,3,1,1,4]   Output: 2   Explanation: 0 -> 1 (jump 1), 1 -> 4 (jump 3)
 * Input: [2,3,0,1,4]   Output: 2
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= nums.length <= 10^4
 * - Single element -> 0 jumps
 *
 * DP DEFINITION
 * STATE:       dp[i] = min jumps to reach the last index starting from i
 * RECURRENCE:  dp[i] = 1 + min over j in [i+1, i+nums[i]] of dp[j]
 * BASE CASES:  dp[n-1] = 0
 * ANSWER:      dp[0]
 *
 * APPROACH 1 — Brute force   O(2^n) time, O(n) space
 * Try every jump from every index, return the smallest count.
 *
 * APPROACH 2 — Memoization   O(n * maxJump) time, O(n) space
 * APPROACH 3 — Tabulation   O(n * maxJump) time, O(n) space
 * Fill right to left. Dry run, nums = [2, 3, 1, 1, 4]:
 *   i    : 0  1  2  3  4
 *   dp   : 2  1  2  1  0
 *   dp[3] = 1 + dp[4] = 1
 *   dp[2] = 1 + dp[3] = 2
 *   dp[1] = 1 + min(dp[2], dp[3], dp[4]) = 1
 *   dp[0] = 1 + min(dp[1], dp[2]) = 2
 *
 * APPROACH 4 — Greedy BFS "levels"   O(n) time, O(1) space
 * Treat each jump as one BFS level. currentEnd = the farthest index reachable
 * with `jumps` jumps; farthest = the farthest reachable with jumps+1. When i
 * hits currentEnd we must jump again. This is a true greedy because taking the
 * jump that maximises the next frontier is never worse.
 *
 * EDGE CASES
 * - [0] -> 0
 * - [1, 2] -> 1
 */

function bruteForce(nums) {
  const last = nums.length - 1;
  function minJumpsFrom(index) {
    if (index >= last) return 0;
    let best = Infinity;
    for (let jump = 1; jump <= nums[index]; jump++) {
      best = Math.min(best, 1 + minJumpsFrom(index + jump));
    }
    return best;
  }
  return minJumpsFrom(0);
}

function memo(nums) {
  const last = nums.length - 1;
  const cache = new Map();
  function minJumpsFrom(index) {
    if (index >= last) return 0;
    if (cache.has(index)) return cache.get(index);
    let best = Infinity;
    for (let jump = 1; jump <= nums[index]; jump++) {
      best = Math.min(best, 1 + minJumpsFrom(index + jump));
    }
    cache.set(index, best);
    return best;
  }
  return minJumpsFrom(0);
}

function tabulation(nums) {
  const n = nums.length;
  const dp = new Array(n).fill(Infinity);
  dp[n - 1] = 0;
  for (let i = n - 2; i >= 0; i--) {
    const farthest = Math.min(n - 1, i + nums[i]);
    for (let j = i + 1; j <= farthest; j++) {
      dp[i] = Math.min(dp[i], 1 + dp[j]);
    }
  }
  return dp[0];
}

function optimized(nums) {
  let jumps = 0;
  let currentEnd = 0; // end of the range reachable with `jumps` jumps
  let farthest = 0; // farthest index reachable with one more jump
  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);
    if (i === currentEnd) {
      // we've explored this whole level; must jump to go further
      jumps++;
      currentEnd = farthest;
    }
  }
  return jumps;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve([2, 3, 1, 1, 4]), 2);
  assert.strictEqual(solve([2, 3, 0, 1, 4]), 2);
  assert.strictEqual(solve([0]), 0);
  assert.strictEqual(solve([1, 2]), 1);
  assert.strictEqual(solve([1, 1, 1, 1]), 3);
  assert.strictEqual(solve([5, 1, 1, 1, 1, 1]), 1);
  assert.strictEqual(solve([1, 2, 1, 1, 1]), 3);
}
console.log('✓ 12-jump-game-ii passed');

module.exports = { bruteForce, memo, tabulation, optimized };

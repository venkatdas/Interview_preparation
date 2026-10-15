/**
 * 11. Jump Game   (LeetCode 55 — Medium)
 *
 * PROBLEM
 * nums[i] is the MAXIMUM jump length from index i. Starting at index 0,
 * can you reach the last index?
 *
 * EXAMPLES
 * Input: [2,3,1,1,4]   Output: true    Explanation: 0 -> 1 -> 4
 * Input: [3,2,1,0,4]   Output: false   Explanation: you always land on index 3 (a 0) and get stuck
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= nums.length <= 10^4, 0 <= nums[i] <= 10^5
 * - Single element: already at the last index -> true
 *
 * DP DEFINITION
 * STATE:       dp[i] = can we reach the last index starting from i?
 * RECURRENCE:  dp[i] = OR over j in [i+1, i+nums[i]] of dp[j]
 * BASE CASES:  dp[n-1] = true
 * ANSWER:      dp[0]
 *
 * APPROACH 1 — Brute force   O(2^n) time, O(n) space
 * From i, try every jump length 1..nums[i] recursively.
 *
 * APPROACH 2 — Memoization   O(n * maxJump) time, O(n) space
 * APPROACH 3 — Tabulation   O(n * maxJump) time, O(n) space
 * Fill right to left. Dry run, nums = [2, 3, 1, 1, 4]:
 *   i    : 0  1  2  3  4
 *   dp   : T  T  T  T  T     dp[3]: j=4 -> T ; dp[2]: j=3 -> T ; dp[1]: j=2 -> T ; dp[0]: j=1 -> T
 * nums = [3, 2, 1, 0, 4]:
 *   dp   : F  F  F  F  T     dp[3]: nums[3]=0, no jumps -> F ; dp[2]: j=3 -> F ; ...
 *
 * APPROACH 4 — Greedy   O(n) time, O(1) space   (the real interview answer)
 * Track `farthest` = the furthest index reachable so far. Scan left to right;
 * if i > farthest we're stuck. Otherwise farthest = max(farthest, i + nums[i]).
 * This works because reachability is "monotone": if you can reach index k you
 * can reach every index before k. So we only need the max frontier, not the
 * whole table. That observation is what lets greedy beat DP here.
 *
 * EDGE CASES
 * - [0] -> true (already at the end)
 * - [0, 1] -> false
 */

function bruteForce(nums) {
  const last = nums.length - 1;
  function canReachFrom(index) {
    if (index >= last) return true;
    for (let jump = 1; jump <= nums[index]; jump++) {
      if (canReachFrom(index + jump)) return true;
    }
    return false;
  }
  return canReachFrom(0);
}

function memo(nums) {
  const last = nums.length - 1;
  const cache = new Map();
  function canReachFrom(index) {
    if (index >= last) return true;
    if (cache.has(index)) return cache.get(index);
    let reachable = false;
    for (let jump = 1; jump <= nums[index] && !reachable; jump++) {
      reachable = canReachFrom(index + jump);
    }
    cache.set(index, reachable);
    return reachable;
  }
  return canReachFrom(0);
}

function tabulation(nums) {
  const n = nums.length;
  const dp = new Array(n).fill(false);
  dp[n - 1] = true;
  for (let i = n - 2; i >= 0; i--) {
    const farthest = Math.min(n - 1, i + nums[i]);
    for (let j = i + 1; j <= farthest; j++) {
      if (dp[j]) {
        dp[i] = true;
        break;
      }
    }
  }
  return dp[0];
}

function greedy(nums) {
  let farthest = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > farthest) return false; // this index is unreachable, so everything after it is too
    farthest = Math.max(farthest, i + nums[i]);
    if (farthest >= nums.length - 1) return true;
  }
  return true;
}

// `optimized` is the greedy scan: O(1) space, no table at all
const optimized = greedy;

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, greedy, optimized]) {
  assert.strictEqual(solve([2, 3, 1, 1, 4]), true);
  assert.strictEqual(solve([3, 2, 1, 0, 4]), false);
  assert.strictEqual(solve([0]), true);
  assert.strictEqual(solve([0, 1]), false);
  assert.strictEqual(solve([1, 1, 1, 1]), true);
  assert.strictEqual(solve([2, 0, 0]), true);
  assert.strictEqual(solve([1, 0, 1, 0]), false);
}
console.log('✓ 11-jump-game passed');

module.exports = { bruteForce, memo, tabulation, greedy, optimized };

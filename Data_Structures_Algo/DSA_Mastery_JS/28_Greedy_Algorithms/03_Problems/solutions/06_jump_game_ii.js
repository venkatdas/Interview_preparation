/**
 * 06. Jump Game II   (LeetCode 45 — Medium)
 *
 * PROBLEM
 * Same setup as Jump Game, but the last index is guaranteed reachable.
 * Return the MINIMUM number of jumps to reach the last index.
 *
 * EXAMPLES
 * Input: [2,3,1,1,4]   Output: 2   Explanation: 0 -> 1 -> 4
 * Input: [2,3,0,1,4]   Output: 2
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is the end always reachable? (yes, per problem)
 * - Single element -> 0 jumps
 *
 * APPROACH 1 — Brute force / DP   O(n^2) time, O(n) space
 * dp[i] = min jumps to reach i. For every i and every j < i that can jump to i,
 * dp[i] = min(dp[j] + 1). Simple and correct, just slow for 10^5.
 *
 * APPROACH 2 — Optimal (farthest reach, "BFS by levels")   O(n) time, O(1) space
 * Think of all indices reachable with k jumps as one "level" [levelStart..levelEnd].
 * While scanning the current level, compute the farthest index any of them can reach.
 * When i hits levelEnd, we must jump: jumps++, and the next level ends at `farthest`.
 *
 * WHY GREEDY WORKS ("greedy stays ahead")
 * After k jumps, greedy's level covers EVERY index reachable with k jumps (it took the max of
 * all options, and reachability is monotone - see Jump Game). Any other strategy is at some
 * index inside that level or before it. So greedy is never behind, and it reaches the end
 * with no more jumps than any other strategy.
 *
 * Dry run on [2,3,1,1,4]:
 *   i=0: farthest=2.  i == levelEnd(0) -> jump 1, levelEnd=2
 *   i=1: farthest=max(2,1+3)=4
 *   i=2: farthest=max(4,2+1)=4. i == levelEnd(2) -> jump 2, levelEnd=4 (covers last index)
 *   stop before the last index -> 2
 *
 * EDGE CASES
 * - [0] or single element -> 0
 * - two elements -> 1
 * - never jump from the last index (loop runs to length - 2)
 */

function bruteForce(nums) {
  const n = nums.length;
  const dp = new Array(n).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (j + nums[j] >= i) dp[i] = Math.min(dp[i], dp[j] + 1);
    }
  }
  return dp[n - 1];
}

function optimal(nums) {
  let jumps = 0;
  let levelEnd = 0;   // last index reachable with `jumps` jumps
  let farthest = 0;   // farthest index reachable with `jumps + 1` jumps

  // we never need to jump FROM the last index, so stop at length - 2
  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);
    if (i === levelEnd) {       // finished scanning this level -> must jump
      jumps++;
      levelEnd = farthest;
    }
  }
  return jumps;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([2, 3, 1, 1, 4]), 2);
  assert.strictEqual(solve([2, 3, 0, 1, 4]), 2);
  assert.strictEqual(solve([0]), 0);
  assert.strictEqual(solve([1, 2]), 1);
  assert.strictEqual(solve([1, 1, 1, 1]), 3);
  assert.strictEqual(solve([5, 1, 1, 1, 1, 1]), 1);
  assert.strictEqual(solve([1, 2, 1, 1, 1]), 3);
}
console.log('✓ 06-jump-game-ii passed');

module.exports = { optimal, bruteForce };

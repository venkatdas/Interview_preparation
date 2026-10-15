/**
 * 05. Jump Game   (LeetCode 55 — Medium)
 *
 * PROBLEM
 * nums[i] is the maximum jump length from index i. You start at index 0.
 * Return true if you can reach the last index.
 *
 * EXAMPLES
 * Input: [2,3,1,1,4]   Output: true    Explanation: 0 -> 1 -> 4
 * Input: [3,2,1,0,4]   Output: false   Explanation: you always land on index 3 (value 0)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Are values non-negative? (yes)
 * - Single element array? (already at the last index -> true)
 *
 * APPROACH 1 — Brute force   O(2^n) time, O(n) space (recursion)
 * From index i try every jump 1..nums[i] and recurse. (Memoising it gives the O(n^2) DP.)
 *
 * APPROACH 2 — Optimal (farthest reach)   O(n) time, O(1) space
 * Keep `farthest` = the farthest index reachable so far. Walk i from 0. If i > farthest,
 * index i is unreachable, so the end is unreachable too. Otherwise extend farthest with
 * i + nums[i]. If farthest ever covers the last index, return true.
 *
 * WHY GREEDY WORKS
 * Reachability is "monotone": if you can reach index j you can reach every index before j
 * (just jump shorter). So the only thing that matters is the single number `farthest`.
 * Tracking the maximum reach is exactly keeping the best option alive - nothing is lost by
 * not remembering which path produced it.
 *
 * Dry run on [3,2,1,0,4]:
 *   i=0 farthest=max(0,0+3)=3
 *   i=1 farthest=max(3,1+2)=3
 *   i=2 farthest=max(3,2+1)=3
 *   i=3 farthest=max(3,3+0)=3
 *   i=4 > farthest(3) -> false
 *
 * EDGE CASES
 * - [0]        -> true (already there)
 * - [0, 1]     -> false
 * - large first jump covering everything -> true early exit
 */

function bruteForce(nums) {
  function canReach(index) {
    if (index >= nums.length - 1) return true;
    for (let step = 1; step <= nums[index]; step++) {
      if (canReach(index + step)) return true;
    }
    return false;
  }
  return canReach(0);
}

function optimal(nums) {
  let farthest = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > farthest) return false;                  // cannot even stand on index i
    farthest = Math.max(farthest, i + nums[i]);
    if (farthest >= nums.length - 1) return true;    // last index is within reach
  }
  return true; // only happens for empty input
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([2, 3, 1, 1, 4]), true);
  assert.strictEqual(solve([3, 2, 1, 0, 4]), false);
  assert.strictEqual(solve([0]), true);
  assert.strictEqual(solve([0, 1]), false);
  assert.strictEqual(solve([5, 0, 0, 0]), true);
  assert.strictEqual(solve([1, 0, 1, 0]), false);
  assert.strictEqual(solve([2, 0, 0]), true);
}
console.log('✓ 05-jump-game passed');

module.exports = { optimal, bruteForce };

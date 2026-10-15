/**
 * 07. Contiguous Array   (LeetCode 525 — Medium)
 *
 * PROBLEM
 * Given a binary array nums, return the length of the longest contiguous subarray with
 * an equal number of 0s and 1s.
 *
 * EXAMPLES
 * Input: [0, 1]            Output: 2
 * Input: [0, 1, 0]         Output: 2   Explanation: [0, 1] or [1, 0]
 * Input: [0, 0, 1, 0, 0, 0, 1, 1]   Output: 6   Explanation: indices 2..7 -> [1, 0, 0, 0, 1, 1] has three 0s and three 1s
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Only 0s and 1s? (yes)
 * - Longest, not count? (longest)
 * - No valid subarray -> 0
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * For each start, extend right tracking zeros and ones; record when equal.
 *
 * APPROACH 2 — Optimal (balance transform + prefix + first-index map)   O(n) time, O(n) space
 * Treat 0 as -1 and 1 as +1. "Equal zeros and ones" becomes "sum equals 0".
 * Running balance: if the balance at index i equals the balance at an earlier index j,
 * then the subarray (j, i] has balance 0 -> equal counts. Store the FIRST index of each
 * balance value (longest answer), seeded with {0: -1}.
 * This is problem 06 with k = 0 after the transform.
 *
 * Dry run on [0, 1, 0]:
 *   map {0:-1}
 *   i=0 (0 -> -1) balance -1, new -> map {0:-1, -1:0}
 *   i=1 (1 -> +1) balance 0, seen at -1 -> length 1 - (-1) = 2, best 2
 *   i=2 (0 -> -1) balance -1, seen at 0 -> length 2 - 0 = 2
 *   2
 *
 * EDGE CASES
 * - All zeros or all ones -> 0
 * - Whole array balanced -> n
 * - Empty -> 0
 * - Single element -> 0
 */

function bruteForce(nums) {
  let best = 0;
  for (let start = 0; start < nums.length; start++) {
    let zeros = 0;
    let ones = 0;
    for (let end = start; end < nums.length; end++) {
      if (nums[end] === 0) zeros++;
      else ones++;
      if (zeros === ones) best = Math.max(best, end - start + 1);
    }
  }
  return best;
}

function optimal(nums) {
  const firstIndexOfBalance = new Map([[0, -1]]);
  let balance = 0;
  let best = 0;

  for (let i = 0; i < nums.length; i++) {
    balance += nums[i] === 1 ? 1 : -1; // 1 pushes up, 0 pushes down

    if (firstIndexOfBalance.has(balance)) {
      // same balance as before -> everything in between cancelled out
      best = Math.max(best, i - firstIndexOfBalance.get(balance));
    } else {
      firstIndexOfBalance.set(balance, i);
    }
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([0, 1]), 2);
  assert.strictEqual(solve([0, 1, 0]), 2);
  assert.strictEqual(solve([0, 0, 1, 0, 0, 0, 1, 1]), 6);
  assert.strictEqual(solve([0, 0, 0]), 0);
  assert.strictEqual(solve([1, 1, 0, 0]), 4);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([1]), 0);
  assert.strictEqual(solve([0, 1, 1, 0, 1, 1, 1, 0]), 4);
}
console.log('✓ 07-contiguous-array passed');

module.exports = { optimal, bruteForce };

/**
 * 10. Minimum Value to Get Positive Step by Step Sum   (LeetCode 1413 — Easy)
 *
 * PROBLEM
 * Given an integer array nums, you start with a value startValue and add the elements
 * one by one left to right. Return the minimum positive startValue such that the running
 * sum is always >= 1.
 *
 * EXAMPLES
 * Input: [-3, 2, -3, 4, 2]   Output: 5
 *   Explanation: with 5: 5, 2, 4, 1, 5, 7 (all >= 1). With 4 the sum would hit 0.
 * Input: [1, 2]              Output: 1
 * Input: [1, -2, -3]         Output: 5
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Must startValue itself be >= 1? (yes, "minimum positive")
 * - "Always >= 1" at every step including after the last? (yes)
 *
 * APPROACH 1 — Brute force   O(n * answer) time
 * Try startValue = 1, 2, 3, ... and simulate each until one works.
 *
 * APPROACH 2 — Optimal (prefix minimum)   O(n) time, O(1) space
 * The running sum with startValue s is s + prefix[i]. It must stay >= 1 at every i, so
 * s >= 1 - prefix[i] for all i, i.e. s = 1 - min(prefix). If the minimum prefix is already
 * >= 0, then s = 1 (it must be positive).
 * We only need the running minimum of the prefix sums, not the array.
 *
 * Dry run on [-3, 2, -3, 4, 2]:
 *   running: -3, -1, -4, 0, 2   minimum -4
 *   answer = max(1, 1 - (-4)) = 5
 *
 * EDGE CASES
 * - All positive -> 1
 * - Starts with a big negative
 * - Prefix dips below zero then recovers (the dip still decides the answer)
 */

function bruteForce(nums) {
  for (let start = 1; ; start++) {
    let running = start;
    let ok = true;
    for (const num of nums) {
      running += num;
      if (running < 1) { ok = false; break; }
    }
    if (ok) return start;
  }
}

function optimal(nums) {
  let running = 0;
  let minPrefix = 0; // include the empty prefix so all-positive arrays give 1
  for (const num of nums) {
    running += num;
    minPrefix = Math.min(minPrefix, running);
  }
  return 1 - minPrefix; // lift the lowest point up to exactly 1
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([-3, 2, -3, 4, 2]), 5);
  assert.strictEqual(solve([1, 2]), 1);
  assert.strictEqual(solve([1, -2, -3]), 5);
  assert.strictEqual(solve([-10]), 11);
  assert.strictEqual(solve([0, 0]), 1);
  assert.strictEqual(solve([]), 1);
  assert.strictEqual(solve([2, -5, 10, -3]), 4);
}
console.log('✓ 10-minimum-value-positive-step-sum passed');

module.exports = { optimal, bruteForce };

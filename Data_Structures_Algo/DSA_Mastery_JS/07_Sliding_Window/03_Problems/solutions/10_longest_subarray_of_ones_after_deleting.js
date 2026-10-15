/**
 * 10. Longest Subarray of 1's After Deleting One Element   (LeetCode 1493 — Medium)
 *
 * PROBLEM
 * Given a binary array, you MUST delete exactly one element. Return the length of the
 * longest subarray of 1s in the resulting array. (Return 0 if no such subarray exists.)
 *
 * EXAMPLES
 * Input: [1, 1, 0, 1]            Output: 3   Explanation: delete the 0 -> [1, 1, 1]
 * Input: [0, 1, 1, 1, 0, 1, 1, 0, 1]   Output: 5   Explanation: delete nums[4] -> 1,1,1,1,1
 * Input: [1, 1, 1]               Output: 2   Explanation: must delete one 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Must delete exactly one, even if all are 1s? (yes -> answer is n - 1 for all ones)
 * - Only 0/1? (yes)
 * - All zeros? (0)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * Try deleting each index, then scan for the longest run of 1s.
 *
 * APPROACH 2 — Optimal (window with at most ONE zero, answer = window length - 1)   O(n) time, O(1) space
 * This is Max Consecutive Ones III with k = 1, except the deleted element is always
 * removed from the count: a window [left, right] with at most one zero gives a run of
 * (right - left + 1) - 1 ones after deleting that zero (or any 1 if there is no zero).
 *   expand: if 0, zeros++
 *   while zeros > 1: shrink
 *   best = max(best, right - left)        (window length minus one)
 *
 * Dry run on [1, 1, 0, 1]:
 *   r=0 len 1 -> best 0 | r=1 len 2 -> best 1 | r=2 zero(1) len 3 -> best 2 | r=3 len 4 -> best 3
 *   3
 *
 * EDGE CASES
 * - All ones -> n - 1
 * - All zeros -> 0
 * - Single element -> 0
 * - Two zeros adjacent: [1, 0, 0, 1] -> 1
 */

function bruteForce(nums) {
  let best = 0;
  for (let skip = 0; skip < nums.length; skip++) {
    let run = 0;
    for (let i = 0; i < nums.length; i++) {
      if (i === skip) continue;
      run = nums[i] === 1 ? run + 1 : 0;
      best = Math.max(best, run);
    }
  }
  return best;
}

function optimal(nums) {
  let left = 0;
  let zerosInWindow = 0;
  let best = 0;

  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === 0) zerosInWindow++;

    while (zerosInWindow > 1) {
      if (nums[left] === 0) zerosInWindow--;
      left++;
    }
    // window holds at most one zero; deleting one element leaves (length - 1) ones
    best = Math.max(best, right - left);
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 1, 0, 1]), 3);
  assert.strictEqual(solve([0, 1, 1, 1, 0, 1, 1, 0, 1]), 5);
  assert.strictEqual(solve([1, 1, 1]), 2);
  assert.strictEqual(solve([0, 0, 0]), 0);
  assert.strictEqual(solve([1]), 0);
  assert.strictEqual(solve([0]), 0);
  assert.strictEqual(solve([1, 0, 0, 1]), 1);
  assert.strictEqual(solve([1, 1, 0, 0, 1, 1, 1, 0, 1]), 4);
}
console.log('✓ 10-longest-subarray-of-ones-after-deleting passed');

module.exports = { optimal, bruteForce };

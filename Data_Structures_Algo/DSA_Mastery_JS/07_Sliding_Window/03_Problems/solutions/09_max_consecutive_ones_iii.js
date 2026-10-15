/**
 * 09. Max Consecutive Ones III   (LeetCode 1004 — Medium)
 *
 * PROBLEM
 * Given a binary array nums and an integer k, you may flip at most k zeros to ones.
 * Return the length of the longest contiguous run of 1s you can get.
 *
 * EXAMPLES
 * Input: nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2   Output: 6   Explanation: flip the two 0s before the 1111
 * Input: nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k = 3   Output: 10
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Only 0s and 1s? (yes)
 * - k = 0 allowed? (yes -> longest existing run of 1s)
 * - k >= number of zeros? (whole array)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * For each start, extend right counting zeros; stop when zeros > k.
 *
 * APPROACH 2 — Optimal (variable window with a zero budget)   O(n) time, O(1) space
 * Reframe: longest window containing AT MOST k zeros.
 *   expand: if nums[right] === 0, zeros++
 *   while zeros > k: if nums[left] === 0, zeros--; left++
 *   record right - left + 1
 * Monotonic: adding elements can only add zeros; removing can only remove them.
 *
 * Dry run on [1,1,1,0,0,0,1,1,1,1,0], k = 2:
 *   r=0..2 ones, len 3 | r=3 zero(1) len 4 | r=4 zero(2) len 5
 *   r=5 zero(3) > 2 -> shrink: drop 1,1,1 (left=3), drop 0 (zeros 2, left=4) len 2
 *   r=6..9 ones, len grows to 6 (window [4..9] = 0,0,1,1,1,1)
 *   r=10 zero(3) -> drop nums[4]=0 (zeros 2, left=5) len 6
 *   best 6
 *
 * EDGE CASES
 * - All ones -> n
 * - All zeros with k < n -> k
 * - k = 0 -> longest natural run
 * - Empty -> 0
 */

function bruteForce(nums, k) {
  let best = 0;
  for (let start = 0; start < nums.length; start++) {
    let zeros = 0;
    for (let end = start; end < nums.length; end++) {
      if (nums[end] === 0) zeros++;
      if (zeros > k) break;
      best = Math.max(best, end - start + 1);
    }
  }
  return best;
}

function optimal(nums, k) {
  let left = 0;
  let zerosInWindow = 0;
  let best = 0;

  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === 0) zerosInWindow++;

    // over budget: move left until we drop a zero
    while (zerosInWindow > k) {
      if (nums[left] === 0) zerosInWindow--;
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2), 6);
  assert.strictEqual(solve([0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1], 3), 10);
  assert.strictEqual(solve([1, 1, 1], 0), 3);
  assert.strictEqual(solve([0, 0, 0], 1), 1);
  assert.strictEqual(solve([1, 0, 1, 1, 0, 1], 0), 2);
  assert.strictEqual(solve([], 2), 0);
  assert.strictEqual(solve([0, 0, 1], 5), 3);
}
console.log('✓ 09-max-consecutive-ones-iii passed');

module.exports = { optimal, bruteForce };

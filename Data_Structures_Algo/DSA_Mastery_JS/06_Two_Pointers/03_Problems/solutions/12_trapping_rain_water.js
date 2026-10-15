/**
 * 12. Trapping Rain Water   (LeetCode 42 — Hard)
 *
 * PROBLEM
 * Given an elevation map (array of non-negative bar heights, each of width 1), compute
 * how much water it can trap after raining.
 *
 * EXAMPLES
 * Input: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]   Output: 6
 * Input: [4, 2, 0, 3, 2, 5]                     Output: 9
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Non-negative integers? (yes)
 * - Fewer than 3 bars? (can't trap anything -> 0)
 * - O(1) space required? (follow-up; the two-pointer version delivers it)
 *
 * The key formula: water above bar i = min(maxLeftOf(i), maxRightOf(i)) - height[i]
 * (clamped at 0). Water is held by the tallest wall on each side; the lower of the two
 * sets the level.
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * For each i, scan left for the max and scan right for the max, apply the formula.
 * (Precomputing leftMax[] and rightMax[] arrays gives O(n) time with O(n) space; that is
 * the "prefix max" idea from 08_Prefix_Sums_And_Difference_Arrays. We go one step further below.)
 *
 * APPROACH 2 — Optimal (two pointers with running maxes)   O(n) time, O(1) space
 * Keep leftMax (tallest seen from the left) and rightMax (tallest seen from the right).
 * If height[left] < height[right], then rightMax >= height[right] > height[left], so for
 * position `left` the RIGHT side is guaranteed to have a wall at least as tall as
 * leftMax... more precisely: the water level at `left` is min(leftMax, trueRightMax), and
 * trueRightMax >= height[right] >= height[left]. Whatever the true right max is, if
 * leftMax <= height[right] the level is leftMax. So we can settle `left` using leftMax
 * alone: water += leftMax - height[left]. Then left++. Symmetric for the right side.
 * Each step settles one bar permanently -> O(n).
 *
 * Dry run on [4, 2, 0, 3, 2, 5]:
 *   L=0 R=5 leftMax=4 rightMax=5: h[L]=4 < h[R]=5 -> settle L: 4-4=0, L=1
 *   L=1 h=2 < 5 -> leftMax=4, water += 4-2=2, L=2
 *   L=2 h=0 < 5 -> water += 4-0=4 (total 6), L=3
 *   L=3 h=3 < 5 -> water += 4-3=1 (total 7), L=4
 *   L=4 h=2 < 5 -> water += 4-2=2 (total 9), L=5
 *   L=5 == R -> stop. 9
 *
 * EDGE CASES
 * - Fewer than 3 bars -> 0
 * - Monotonic (always rising or falling) -> 0
 * - All equal -> 0
 * - Deep single pit: [5, 0, 5] -> 5
 */

function bruteForce(height) {
  let water = 0;
  for (let i = 0; i < height.length; i++) {
    let leftMax = 0;
    for (let k = 0; k <= i; k++) leftMax = Math.max(leftMax, height[k]);
    let rightMax = 0;
    for (let k = i; k < height.length; k++) rightMax = Math.max(rightMax, height[k]);
    water += Math.min(leftMax, rightMax) - height[i];
  }
  return water;
}

function optimal(height) {
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let water = 0;

  while (left < right) {
    if (height[left] < height[right]) {
      // right side has a wall >= height[left]; the level at `left` is set by leftMax
      leftMax = Math.max(leftMax, height[left]);
      water += leftMax - height[left];
      left++;
    } else {
      rightMax = Math.max(rightMax, height[right]);
      water += rightMax - height[right];
      right--;
    }
  }
  return water;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]), 6);
  assert.strictEqual(solve([4, 2, 0, 3, 2, 5]), 9);
  assert.strictEqual(solve([5, 0, 5]), 5);
  assert.strictEqual(solve([1, 2, 3, 4]), 0);
  assert.strictEqual(solve([3, 3, 3]), 0);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([2]), 0);
  assert.strictEqual(solve([2, 0, 2, 0, 2]), 4);
}
console.log('✓ 12-trapping-rain-water passed');

module.exports = { optimal, bruteForce };

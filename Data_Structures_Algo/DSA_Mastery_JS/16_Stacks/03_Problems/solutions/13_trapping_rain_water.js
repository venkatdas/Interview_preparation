/**
 * 13. Trapping Rain Water (stack version)   (LeetCode 42 — Hard)
 *
 * PROBLEM
 * Given an elevation map (bar heights, width 1 each), compute how much water
 * is trapped after it rains.
 *
 * EXAMPLES
 * Input: [0,1,0,2,1,0,1,3,2,1,2,1]   Output: 6
 * Input: [4,2,0,3,2,5]               Output: 9
 * Input: [3,0,2]                     Output: 2
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Heights are non-negative integers? (yes)
 * - Water above a bar is bounded by the tallest bar on its left AND right? (yes:
 *   water at i = min(maxLeft, maxRight) - height[i], if positive)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * For each bar, scan left for the max and scan right for the max, then add
 * min(maxLeft, maxRight) - height[i]. Correct, slow.
 *
 * APPROACH 2 — Optimal (monotonic decreasing stack, fill "valleys" horizontally)   O(n) time, O(n) space
 * Think of water in horizontal LAYERS instead of vertical columns.
 * Keep a stack of indices with DECREASING heights (the left walls of possible
 * valleys). When the current bar is taller than the top:
 *   bottom = pop          (the floor of the valley)
 *   if the stack is now empty there is no left wall -> stop
 *   leftWall = new top
 *   width  = i - leftWall - 1
 *   height = min(heights[leftWall], heights[i]) - heights[bottom]
 *   water += width * height
 * Keep popping while the current bar is taller (it may close several layers).
 *
 * Dry run on [3,0,2,0,4]:
 *   i=0 h=3 push               [0]
 *   i=1 h=0 push               [0,1]
 *   i=2 h=2  2>0: pop 1 (bottom h=0). left=0. width=2-0-1=1, height=min(3,2)-0=2 -> +2
 *            2<3 stop. push    [0,2]
 *   i=3 h=0 push               [0,2,3]
 *   i=4 h=4  4>0: pop 3 (h=0). left=2. width=1, height=min(2,4)-0=2 -> +2  (total 4)
 *            4>2: pop 2 (h=2). left=0. width=4-0-1=3, height=min(3,4)-2=1 -> +3  (total 7)
 *            4>3: pop 0. stack empty -> stop. push [4]
 *   answer 7
 *
 * (The two-pointer O(1) space solution lives in 06_Two_Pointers. Both are worth knowing.)
 *
 * EDGE CASES
 * - fewer than 3 bars -> 0
 * - monotonic (always rising or falling) -> 0
 * - flat ground -> 0
 */

function bruteForce(heights) {
  let water = 0;
  for (let i = 0; i < heights.length; i++) {
    let maxLeft = 0;
    let maxRight = 0;
    for (let j = 0; j <= i; j++) maxLeft = Math.max(maxLeft, heights[j]);
    for (let j = i; j < heights.length; j++) maxRight = Math.max(maxRight, heights[j]);
    water += Math.min(maxLeft, maxRight) - heights[i];
  }
  return water;
}

function optimal(heights) {
  const stack = []; // indices, heights decreasing from bottom to top
  let water = 0;

  for (let i = 0; i < heights.length; i++) {
    while (stack.length && heights[i] > heights[stack[stack.length - 1]]) {
      const bottom = stack.pop();
      if (stack.length === 0) break; // no left wall: water would spill out

      const leftWall = stack[stack.length - 1];
      const width = i - leftWall - 1;
      const boundedHeight = Math.min(heights[leftWall], heights[i]) - heights[bottom];
      water += width * boundedHeight;
    }
    stack.push(i);
  }
  return water;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]), 6);
  assert.strictEqual(solve([4, 2, 0, 3, 2, 5]), 9);
  assert.strictEqual(solve([3, 0, 2]), 2);
  assert.strictEqual(solve([3, 0, 2, 0, 4]), 7);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([5]), 0);
  assert.strictEqual(solve([1, 2, 3, 4]), 0);
  assert.strictEqual(solve([2, 2, 2]), 0);
  assert.strictEqual(solve([5, 0, 0, 0, 5]), 15);
}
console.log('✓ 13-trapping-rain-water passed');

module.exports = { optimal, bruteForce };

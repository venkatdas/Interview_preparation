/**
 * 11. Container With Most Water   (LeetCode 11 — Medium)
 *
 * PROBLEM
 * Given an array height where height[i] is the height of a vertical line at x = i,
 * pick two lines that together with the x-axis form a container holding the most water.
 * Return that maximum area. Area = (distance between lines) * min(height of the two lines).
 *
 * EXAMPLES
 * Input: [1, 8, 6, 2, 5, 4, 8, 3, 7]   Output: 49   Explanation: lines at 1 and 8: (8-1) * min(8,7) = 49
 * Input: [1, 1]                        Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - At least two lines? (yes)
 * - Heights non-negative? (yes)
 * - Can the container be slanted? (no; width * shorter height)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * Try every pair (i, j), compute (j - i) * min(height[i], height[j]), keep the max.
 *
 * APPROACH 2 — Optimal (opposite ends, always move the SHORTER line)   O(n) time, O(1) space
 * Start with the widest container (left = 0, right = n - 1). The area is limited by the
 * shorter line. Moving the taller line inward can never help: width shrinks and the
 * height stays capped by the same shorter line. Moving the SHORTER line inward might
 * find a taller line, which could beat the lost width. So each step we move the shorter
 * one. We only ever discard a line that cannot be part of a better answer -> no answer skipped.
 *
 * Dry run on [1, 8, 6, 2, 5, 4, 8, 3, 7]:
 *   L=0(1)  R=8(7): area 8*1=8,  best 8,  1 shorter -> L=1
 *   L=1(8)  R=8(7): area 7*7=49, best 49, 7 shorter -> R=7
 *   L=1(8)  R=7(3): area 6*3=18,           3 shorter -> R=6
 *   L=1(8)  R=6(8): area 5*8=40,           tie -> move either, R=5
 *   L=1(8)  R=5(4): 4*4=16 -> R=4;  L=1 R=4(5): 3*5=15 -> R=3
 *   L=1 R=3(2): 2*2=4 -> R=2;      L=1 R=2(6): 1*6=6 -> R=1 stop
 *   best 49
 *
 * EDGE CASES
 * - Exactly two lines
 * - All equal heights -> widest pair wins
 * - Tallest lines adjacent to each other
 * - Zero heights
 */

function bruteForce(height) {
  let best = 0;
  for (let i = 0; i < height.length; i++) {
    for (let j = i + 1; j < height.length; j++) {
      best = Math.max(best, (j - i) * Math.min(height[i], height[j]));
    }
  }
  return best;
}

function optimal(height) {
  let left = 0;
  let right = height.length - 1;
  let best = 0;

  while (left < right) {
    const width = right - left;
    const shorter = Math.min(height[left], height[right]);
    best = Math.max(best, width * shorter);

    // the shorter wall is the bottleneck: moving it is the only way to possibly improve
    if (height[left] < height[right]) left++;
    else right--;
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 8, 6, 2, 5, 4, 8, 3, 7]), 49);
  assert.strictEqual(solve([1, 1]), 1);
  assert.strictEqual(solve([4, 3, 2, 1, 4]), 16);
  assert.strictEqual(solve([1, 2, 1]), 2);
  assert.strictEqual(solve([5, 5, 5, 5]), 15);
  assert.strictEqual(solve([0, 0]), 0);
  assert.strictEqual(solve([2, 3, 4, 5, 18, 17, 6]), 17);
}
console.log('✓ 11-container-with-most-water passed');

module.exports = { optimal, bruteForce };

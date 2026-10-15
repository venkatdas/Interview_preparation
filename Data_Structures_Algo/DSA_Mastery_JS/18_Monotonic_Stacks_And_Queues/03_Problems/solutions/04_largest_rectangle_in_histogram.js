/**
 * 04. Largest Rectangle in Histogram   (LeetCode 84 — Hard)
 *
 * PROBLEM
 * heights[i] is the height of bar i (width 1). Return the area of the largest rectangle
 * that fits inside the histogram.
 *
 * EXAMPLES
 * Input: [2,1,5,6,2,3]   Output: 10   Explanation: bars 5 and 6, height 5, width 2
 * Input: [2,4]           Output: 4
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Heights >= 0; n up to 10^5 -> O(n^2) too slow
 * - Width of each bar is 1
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * For every pair (i, j) track the minimum height and compute minHeight * (j - i + 1).
 *
 * APPROACH 2 — Optimal (previous/next smaller arrays, or one-pass monotonic stack)   O(n)
 * The best rectangle uses some bar i at FULL height: it extends left until a strictly
 * lower bar and right until a strictly lower bar. So
 *   area(i) = heights[i] * (nextSmaller[i] - prevSmaller[i] - 1)
 * Two helper arrays from a monotonic stack give both boundaries in O(n).
 * One-pass variant: keep an increasing stack of indices; when heights[i] is lower than the
 * top, pop the top and resolve it right there (its right boundary is i, left boundary is
 * the new top). A sentinel height 0 at the end flushes everything.
 *
 * Dry run (one-pass) on [2,1,5,6,2,3] + sentinel 0:
 *   i=0 (2): push                       stack [0]
 *   i=1 (1): pop 0: h=2, left=-1, w=1-(-1)-1=1, area 2; push    stack [1]
 *   i=2 (5): push                       stack [1,2]
 *   i=3 (6): push                       stack [1,2,3]
 *   i=4 (2): pop 3: h=6, left=2, w=4-2-1=1, area 6
 *            pop 2: h=5, left=1, w=4-1-1=2, area 10  <- best
 *            push                       stack [1,4]
 *   i=5 (3): push                       stack [1,4,5]
 *   i=6 (0): pop 5: h=3, w=6-4-1=1 -> 3; pop 4: h=2, left=1, w=6-1-1=4 -> 8;
 *            pop 1: h=1, left=-1, w=6 -> 6
 *   answer 10
 *
 * EDGE CASES
 * - empty -> 0
 * - single bar -> its height
 * - all equal heights -> h * n
 * - zeros in the middle split the histogram
 */

function bruteForce(heights) {
  let best = 0;
  for (let i = 0; i < heights.length; i++) {
    let minH = Infinity;
    for (let j = i; j < heights.length; j++) {
      minH = Math.min(minH, heights[j]);
      best = Math.max(best, minH * (j - i + 1));
    }
  }
  return best;
}

// Variant A: explicit previous-smaller / next-smaller arrays
function withBoundaryArrays(heights) {
  const n = heights.length;
  const prevSmaller = new Array(n).fill(-1);
  const nextSmaller = new Array(n).fill(n);
  const stack = [];
  for (let i = 0; i < n; i++) {
    while (stack.length && heights[stack[stack.length - 1]] >= heights[i]) {
      nextSmaller[stack.pop()] = i;         // non-strict here is fine: equal bars share the span
    }
    prevSmaller[i] = stack.length ? stack[stack.length - 1] : -1;
    stack.push(i);
  }
  let best = 0;
  for (let i = 0; i < n; i++) {
    best = Math.max(best, heights[i] * (nextSmaller[i] - prevSmaller[i] - 1));
  }
  return best;
}

// Variant B: one pass with a sentinel
function optimal(heights) {
  const stack = []; // indices, heights increasing bottom -> top
  let best = 0;
  for (let i = 0; i <= heights.length; i++) {
    const current = i === heights.length ? 0 : heights[i];
    while (stack.length && heights[stack[stack.length - 1]] >= current) {
      const height = heights[stack.pop()];
      const left = stack.length ? stack[stack.length - 1] : -1;
      best = Math.max(best, height * (i - left - 1));
    }
    stack.push(i);
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, withBoundaryArrays, optimal]) {
  assert.strictEqual(solve([2, 1, 5, 6, 2, 3]), 10);
  assert.strictEqual(solve([2, 4]), 4);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([7]), 7);
  assert.strictEqual(solve([3, 3, 3]), 9);
  assert.strictEqual(solve([2, 0, 2]), 2);
  assert.strictEqual(solve([1, 2, 3, 4, 5]), 9);
}
for (let trial = 0; trial < 200; trial++) {
  const n = Math.floor(Math.random() * 15);
  const heights = Array.from({ length: n }, () => Math.floor(Math.random() * 7));
  assert.strictEqual(optimal(heights), bruteForce(heights));
  assert.strictEqual(withBoundaryArrays(heights), bruteForce(heights));
}
console.log('✓ 04-largest-rectangle-in-histogram passed');

module.exports = { optimal, bruteForce, withBoundaryArrays };

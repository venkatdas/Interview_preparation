/**
 * 12. Largest Rectangle in Histogram   (LeetCode 84 — Hard)
 *
 * PROBLEM
 * Given bar heights (each bar has width 1), return the area of the largest
 * rectangle that fits entirely inside the histogram.
 *
 * EXAMPLES
 * Input: [2,1,5,6,2,3]   Output: 10   Explanation: bars 5 and 6 -> height 5, width 2
 * Input: [2,4]           Output: 4
 * Input: [1,1,1,1]       Output: 4    Explanation: height 1, width 4
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can heights be 0? (yes - a 0 bar splits the histogram)
 * - Empty array -> 0?
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * For every bar i, extend left and right while the neighbours are >= heights[i].
 * The rectangle with bar i as its SHORTEST bar has area heights[i] * width.
 * Take the max over all i.
 *
 * APPROACH 2 — Optimal (monotonic increasing stack)   O(n) time, O(n) space
 * Same idea as the brute force - every rectangle is "some bar as the shortest
 * bar, extended as far as it can go" - but compute the extents in one pass.
 * Keep a stack of indices with INCREASING heights. When the current bar is
 * SHORTER than the top, the top bar can't extend further right, so its
 * rectangle is finished:
 *   height = heights[popped]
 *   right boundary = i (exclusive)
 *   left boundary  = new stack top (exclusive), or -1 if the stack is empty
 *   width = i - leftBoundary - 1
 * Append a sentinel height 0 at the end to flush the whole stack.
 *
 * Dry run on [2,1,5,6,2,3] + sentinel 0:
 *   i=0 h=2  push              [0]
 *   i=1 h=1  1<2: pop 0, width = 1-(-1)-1 = 1, area 2 ; push   [1]
 *   i=2 h=5  push              [1,2]
 *   i=3 h=6  push              [1,2,3]
 *   i=4 h=2  2<6: pop 3, width = 4-2-1 = 1, area 6
 *            2<5: pop 2, width = 4-1-1 = 2, area 10  <- best
 *            push              [1,4]
 *   i=5 h=3  push              [1,4,5]
 *   i=6 h=0  pop 5 (w=1,a=3), pop 4 (w=6-1-1=4,a=8), pop 1 (w=6-(-1)-1=6,a=6)
 *   answer 10
 *
 * EDGE CASES
 * - all equal heights -> height * n
 * - strictly increasing / decreasing
 * - zeros inside
 * - single bar
 */

function bruteForce(heights) {
  let best = 0;
  for (let i = 0; i < heights.length; i++) {
    let left = i;
    let right = i;
    while (left > 0 && heights[left - 1] >= heights[i]) left--;
    while (right < heights.length - 1 && heights[right + 1] >= heights[i]) right++;
    best = Math.max(best, heights[i] * (right - left + 1));
  }
  return best;
}

function optimal(heights) {
  const stack = []; // indices with increasing heights
  let best = 0;

  // i === heights.length acts as a sentinel bar of height 0
  for (let i = 0; i <= heights.length; i++) {
    const currentHeight = i === heights.length ? 0 : heights[i];

    while (stack.length && heights[stack[stack.length - 1]] > currentHeight) {
      const height = heights[stack.pop()];
      const leftBoundary = stack.length ? stack[stack.length - 1] : -1;
      const width = i - leftBoundary - 1;
      best = Math.max(best, height * width);
    }
    stack.push(i);
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([2, 1, 5, 6, 2, 3]), 10);
  assert.strictEqual(solve([2, 4]), 4);
  assert.strictEqual(solve([1, 1, 1, 1]), 4);
  assert.strictEqual(solve([5]), 5);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([1, 2, 3, 4, 5]), 9);
  assert.strictEqual(solve([5, 4, 3, 2, 1]), 9);
  assert.strictEqual(solve([2, 0, 2]), 2);
  assert.strictEqual(solve([0, 0]), 0);
}
console.log('✓ 12-largest-rectangle-histogram passed');

module.exports = { optimal, bruteForce };

/**
 * 07. Minimum Number of Arrows to Burst Balloons   (LeetCode 452 — Medium)
 *
 * PROBLEM
 * Each balloon covers [xStart, xEnd] on the x-axis. An arrow shot at x bursts every balloon
 * with xStart <= x <= xEnd. Return the minimum arrows to burst all balloons.
 *
 * EXAMPLES
 * Input: [[10,16],[2,8],[1,6],[7,12]]   Output: 2
 * Input: [[1,2],[3,4],[5,6],[7,8]]      Output: 4
 * Input: [[1,2],[2,3],[3,4],[4,5]]      Output: 2   Explanation: touching balloons share an arrow
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Inclusive ends (touching shares an arrow)? (yes)
 * - Huge coordinates (+-2^31)? (yes - use a - b comparator, fine in JS)
 *
 * APPROACH 1 — Brute force   O(2^n * n) time
 * Arrow positions can be limited to balloon ends. Try every subset of those positions and
 * keep the smallest one that bursts everything.
 *
 * APPROACH 2 — Optimal (sort by end, shoot at the earliest end)   O(n log n) time, O(1) extra
 * Sort by xEnd. Shoot the first arrow at the first balloon's end. Skip every balloon whose
 * start <= that arrow (already burst). The first balloon that starts after the arrow needs a
 * new arrow at ITS end. This is "maximum number of non-overlapping groups", the same
 * interval-scheduling greedy as Non-overlapping Intervals, but with inclusive ends.
 *
 * Dry run on [[10,16],[2,8],[1,6],[7,12]]:
 *   sorted by end: [1,6],[2,8],[7,12],[10,16]
 *   arrow@6: [2,8] 2<=6 burst; [7,12] 7>6 -> arrow@12; [10,16] 10<=12 burst -> 2
 *
 * EDGE CASES
 * - none -> 0
 * - all overlap at one point -> 1
 * - touching chain [1,2],[2,3],[3,4] -> 2
 */

function bruteForce(points) {
  if (points.length === 0) return 0;
  const candidates = [...new Set(points.map(([, end]) => end))];
  let best = Infinity;
  for (let mask = 1; mask < (1 << candidates.length); mask++) {
    const arrows = candidates.filter((_, i) => mask & (1 << i));
    if (arrows.length >= best) continue;
    if (points.every(([s, e]) => arrows.some((x) => s <= x && x <= e))) best = arrows.length;
  }
  return best;
}

function optimal(points) {
  if (points.length === 0) return 0;
  const sorted = [...points].sort((a, b) => a[1] - b[1]);
  let arrows = 1;
  let arrowX = sorted[0][1];
  for (const [start, end] of sorted) {
    if (start > arrowX) {   // this balloon is not hit -> new arrow at its end
      arrows++;
      arrowX = end;
    }
  }
  return arrows;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([[10, 16], [2, 8], [1, 6], [7, 12]]), 2);
  assert.strictEqual(solve([[1, 2], [3, 4], [5, 6], [7, 8]]), 4);
  assert.strictEqual(solve([[1, 2], [2, 3], [3, 4], [4, 5]]), 2);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([[1, 10], [2, 9], [3, 8]]), 1);
  assert.strictEqual(solve([[5, 5]]), 1);
  assert.strictEqual(solve([[-2147483648, 2147483647], [0, 0]]), 1);
}
console.log('✓ 07-minimum-number-of-arrows passed');

module.exports = { optimal, bruteForce };

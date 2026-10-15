/**
 * 11. Minimum Number of Arrows to Burst Balloons   (LeetCode 452 — Medium)
 *
 * PROBLEM
 * Each balloon spans [xStart, xEnd] on a line. An arrow shot straight up at x bursts every
 * balloon with xStart <= x <= xEnd. Return the minimum number of arrows to burst all balloons.
 *
 * EXAMPLES
 * Input: [[10,16],[2,8],[1,6],[7,12]]   Output: 2   Explanation: x=6 bursts [2,8],[1,6]; x=11 bursts [10,16],[7,12]
 * Input: [[1,2],[3,4],[5,6],[7,8]]      Output: 4
 * Input: [[1,2],[2,3],[3,4],[4,5]]      Output: 2   Explanation: touching counts as overlap here
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is an arrow at exactly xEnd enough? (yes, inclusive -> touching balloons share an arrow)
 * - Coordinates can be large/negative? (yes; use a - b comparator, not subtraction overflow tricks)
 *
 * APPROACH 1 — Brute force   O(2^n * n) time
 * Candidate arrow positions are the balloon ends. Try every subset of candidate positions and
 * check whether it covers all balloons; take the smallest.
 *
 * APPROACH 2 — Optimal (sort by END, shoot at the end)   O(n log n) time, O(1) extra
 * Sort by xEnd. Shoot the first arrow at the end of the first balloon. Every following balloon
 * that starts at or before that arrow is already burst. The first one that starts after it
 * needs a new arrow, shot at ITS end. Count arrows.
 *
 * WHY GREEDY WORKS
 * The earliest-ending balloon must be hit by some arrow at x <= its end. Moving that arrow
 * right to exactly its end never un-bursts anything (every other balloon ends later) and can
 * only burst more balloons. So "shoot at the earliest end" is always a safe first move,
 * and the remaining balloons form the same problem.
 *
 * Dry run on [[10,16],[2,8],[1,6],[7,12]]:
 *   sorted by end: [1,6],[2,8],[7,12],[10,16]
 *   arrow at 6 (count 1); [2,8] starts 2 <= 6 burst; [7,12] starts 7 > 6 -> arrow at 12 (count 2)
 *   [10,16] starts 10 <= 12 burst -> 2
 *
 * EDGE CASES
 * - no balloons -> 0
 * - one balloon -> 1
 * - all balloons share a point -> 1
 */

function bruteForce(points) {
  if (points.length === 0) return 0;
  const candidates = [...new Set(points.map(([, end]) => end))];
  const m = candidates.length;
  let best = Infinity;
  for (let mask = 1; mask < (1 << m); mask++) {
    const arrows = [];
    for (let i = 0; i < m; i++) if (mask & (1 << i)) arrows.push(candidates[i]);
    if (arrows.length >= best) continue;
    const allBurst = points.every(([start, end]) => arrows.some((x) => start <= x && x <= end));
    if (allBurst) best = arrows.length;
  }
  return best;
}

function optimal(points) {
  if (points.length === 0) return 0;
  const sorted = [...points].sort((a, b) => a[1] - b[1]);
  let arrows = 1;
  let arrowX = sorted[0][1];                // shoot at the earliest end
  for (let i = 1; i < sorted.length; i++) {
    const [start, end] = sorted[i];
    if (start > arrowX) {                   // not burst by the current arrow
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
  assert.strictEqual(solve([[1, 2]]), 1);
  assert.strictEqual(solve([[1, 10], [2, 9], [3, 8]]), 1);
  assert.strictEqual(solve([[-5, -1], [-2, 2], [3, 4]]), 2);
}
console.log('✓ 11-minimum-arrows-burst-balloons passed');

module.exports = { optimal, bruteForce };

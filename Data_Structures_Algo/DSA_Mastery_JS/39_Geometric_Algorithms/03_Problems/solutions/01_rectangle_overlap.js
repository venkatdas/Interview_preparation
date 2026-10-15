/**
 * 01. Rectangle Overlap   (LeetCode 836 — Easy)
 *
 * PROBLEM
 * Axis-aligned rectangles are given as [x1, y1, x2, y2] (bottom-left, top-right).
 * Return true if the two rectangles overlap with POSITIVE area (touching edges or corners
 * does not count).
 *
 * EXAMPLES
 * Input: rec1 = [0,0,2,2], rec2 = [1,1,3,3]   Output: true
 * Input: rec1 = [0,0,1,1], rec2 = [1,0,2,1]   Output: false   (share an edge only)
 * Input: rec1 = [0,0,1,1], rec2 = [2,2,3,3]   Output: false
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can a rectangle be degenerate (zero width/height)? (LeetCode: yes -> never overlaps)
 * - Coordinates up to +-10^9 -> no float math, no area computation needed
 *
 * APPROACH 1 — Brute force   O(area) time
 * Sample every unit cell of rec1 and check whether its centre lies strictly inside rec2.
 * Only works for small integer coordinates; shown as a sanity reference.
 *
 * APPROACH 2 — Optimal (Interval overlap on each axis)   O(1)
 * The intersection of two axis-aligned rectangles is the rectangle
 *   [max(x1s), max(y1s)] .. [min(x2s), min(y2s)]
 * and it has positive area iff  max(x1s) < min(x2s)  AND  max(y1s) < min(y2s).
 * (The popular form "a1 < b2 && b1 < a2" is the same thing for proper rectangles, but it
 * wrongly says "overlap" for a degenerate zero-width rectangle; the max/min form does not.)
 *
 * Dry run on [0,0,2,2] vs [1,1,3,3]:
 *   x: max(0,1)=1 < min(2,3)=2 -> overlap;  y: max(0,1)=1 < min(2,3)=2 -> overlap -> true
 * [0,0,1,1] vs [1,0,2,1]: x: max(0,1)=1 < min(1,2)=1 is false -> no overlap -> false
 * [2,2,2,5] vs [0,0,4,4]: x: max(2,0)=2 < min(2,4)=2 is false -> false (degenerate)
 *
 * EDGE CASES
 * - identical rectangles -> true
 * - touching at a corner -> false
 * - degenerate (x1 === x2) -> false
 * - one inside the other -> true
 */

function bruteForce(rec1, rec2) {
  for (let x = rec1[0]; x < rec1[2]; x++) {
    for (let y = rec1[1]; y < rec1[3]; y++) {
      // cell [x, x+1] x [y, y+1]; its centre is strictly inside rec2?
      const cx = x + 0.5;
      const cy = y + 0.5;
      if (rec2[0] < cx && cx < rec2[2] && rec2[1] < cy && cy < rec2[3]) return true;
    }
  }
  return false;
}

function optimal(rec1, rec2) {
  const xOverlap = Math.max(rec1[0], rec2[0]) < Math.min(rec1[2], rec2[2]);
  const yOverlap = Math.max(rec1[1], rec2[1]) < Math.min(rec1[3], rec2[3]);
  return xOverlap && yOverlap;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([0, 0, 2, 2], [1, 1, 3, 3]), true);
  assert.strictEqual(solve([0, 0, 1, 1], [1, 0, 2, 1]), false);
  assert.strictEqual(solve([0, 0, 1, 1], [2, 2, 3, 3]), false);
  assert.strictEqual(solve([0, 0, 3, 3], [0, 0, 3, 3]), true);
  assert.strictEqual(solve([0, 0, 1, 1], [1, 1, 2, 2]), false);     // corner touch
  assert.strictEqual(solve([0, 0, 4, 4], [1, 1, 2, 2]), true);      // nested
  assert.strictEqual(solve([2, 2, 2, 5], [0, 0, 4, 4]), false);     // degenerate
}
for (let trial = 0; trial < 300; trial++) {
  const make = () => {
    const x1 = Math.floor(Math.random() * 8), y1 = Math.floor(Math.random() * 8);
    return [x1, y1, x1 + Math.floor(Math.random() * 5), y1 + Math.floor(Math.random() * 5)];
  };
  const a = make();
  const b = make();
  assert.strictEqual(optimal(a, b), bruteForce(a, b));
}
console.log('✓ 01-rectangle-overlap passed');

module.exports = { optimal, bruteForce };

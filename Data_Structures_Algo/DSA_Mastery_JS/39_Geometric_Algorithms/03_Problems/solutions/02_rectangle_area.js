/**
 * 02. Rectangle Area   (LeetCode 223 — Medium)
 *
 * PROBLEM
 * Two axis-aligned rectangles are given by their bottom-left and top-right corners
 * (ax1, ay1, ax2, ay2) and (bx1, by1, bx2, by2). Return the total area covered by the two
 * rectangles (the union; overlapping area counted once).
 *
 * EXAMPLES
 * Input: A = (-3,0,3,4), B = (0,-1,9,2)   Output: 45   (24 + 27 - 6 overlap)
 * Input: A = (-2,-2,2,2), B = (-2,-2,2,2)  Output: 16
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Coordinates up to +-10^4 -> areas up to ~4 * 10^8, fine as JS numbers
 * - Rectangles may not overlap at all
 *
 * APPROACH 1 — Brute force   O(area) time
 * Count unit cells covered by A or B with a Set of cell keys. Only for small coordinates.
 *
 * APPROACH 2 — Optimal (Inclusion-exclusion)   O(1)
 * union = area(A) + area(B) - area(A intersect B)
 * The intersection of axis-aligned rectangles is itself an axis-aligned rectangle:
 *   width  = min(ax2, bx2) - max(ax1, bx1)
 *   height = min(ay2, by2) - max(ay1, by1)
 * and it is empty (area 0) when either is <= 0.
 *
 * Dry run on the example:
 *   area A = 6 * 4 = 24; area B = 9 * 3 = 27
 *   width = min(3, 9) - max(-3, 0) = 3; height = min(4, 2) - max(0, -1) = 2 -> overlap 6
 *   union = 24 + 27 - 6 = 45
 *
 * EDGE CASES
 * - no overlap (negative width or height -> clamp to 0)
 * - identical rectangles -> area once
 * - one inside the other -> the bigger area
 * - touching edge -> overlap 0
 */

function bruteForce(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2) {
  const cells = new Set();
  for (let x = ax1; x < ax2; x++) for (let y = ay1; y < ay2; y++) cells.add(x + ',' + y);
  for (let x = bx1; x < bx2; x++) for (let y = by1; y < by2; y++) cells.add(x + ',' + y);
  return cells.size;
}

function optimal(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2) {
  const areaA = (ax2 - ax1) * (ay2 - ay1);
  const areaB = (bx2 - bx1) * (by2 - by1);
  const width = Math.max(0, Math.min(ax2, bx2) - Math.max(ax1, bx1));
  const height = Math.max(0, Math.min(ay2, by2) - Math.max(ay1, by1));
  return areaA + areaB - width * height;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(-3, 0, 3, 4, 0, -1, 9, 2), 45);
  assert.strictEqual(solve(-2, -2, 2, 2, -2, -2, 2, 2), 16);
  assert.strictEqual(solve(0, 0, 1, 1, 5, 5, 6, 6), 2);
  assert.strictEqual(solve(0, 0, 4, 4, 1, 1, 2, 2), 16);
  assert.strictEqual(solve(0, 0, 1, 1, 1, 0, 2, 1), 2);
}
for (let trial = 0; trial < 300; trial++) {
  const make = () => {
    const x1 = Math.floor(Math.random() * 10) - 5, y1 = Math.floor(Math.random() * 10) - 5;
    return [x1, y1, x1 + 1 + Math.floor(Math.random() * 6), y1 + 1 + Math.floor(Math.random() * 6)];
  };
  const a = make();
  const b = make();
  assert.strictEqual(optimal(...a, ...b), bruteForce(...a, ...b));
}
console.log('✓ 02-rectangle-area passed');

module.exports = { optimal, bruteForce };

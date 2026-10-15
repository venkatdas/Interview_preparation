/**
 * 05. Minimum Area Rectangle   (LeetCode 939 — Medium)
 *
 * PROBLEM
 * Given distinct points with integer coordinates, return the minimum area of an
 * AXIS-ALIGNED rectangle whose four corners are all among the points. Return 0 if none exists.
 *
 * EXAMPLES
 * Input: [[1,1],[1,3],[3,1],[3,3],[2,2]]          Output: 4
 * Input: [[1,1],[1,3],[3,1],[3,3],[4,1],[4,3]]    Output: 2
 * Input: [[0,0],[1,1]]                            Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Axis-aligned only (sides parallel to the axes); the rotated version is LeetCode 963
 * - Up to 500 points -> O(n^2) is fine, O(n^4) is not
 * - All points distinct
 *
 * APPROACH 1 — Brute force   O(n^4)
 * Try every 4-subset and test whether it forms an axis-aligned rectangle.
 *
 * APPROACH 2 — Optimal (Diagonal pairs + point set)   O(n^2) time, O(n) space
 * Put every point in a Set of "x,y" keys. For every pair of points (x1, y1), (x2, y2) with
 * x1 != x2 and y1 != y2, treat them as OPPOSITE corners (a diagonal). The other two corners
 * are (x1, y2) and (x2, y1); if both exist, the rectangle is valid with area
 * |x1 - x2| * |y1 - y2|. Track the minimum. Each rectangle is found by both of its diagonals,
 * which is harmless.
 *
 * Dry run on [[1,1],[1,3],[3,1],[3,3],[2,2]]:
 *   pair (1,1)-(3,3): need (1,3) and (3,1) -> both present -> area 4
 *   pair (1,1)-(2,2): need (1,2), (2,1) -> missing
 *   ... no smaller rectangle -> 4
 *
 * EDGE CASES
 * - fewer than 4 points -> 0
 * - all points on one line -> 0
 * - several rectangles -> the smallest one
 */

function isAxisRectangle(a, b, c, d) {
  const xs = new Set([a[0], b[0], c[0], d[0]]);
  const ys = new Set([a[1], b[1], c[1], d[1]]);
  if (xs.size !== 2 || ys.size !== 2) return false;
  // every combination of the two xs and two ys must be present
  const keys = new Set([a, b, c, d].map((p) => p[0] + ',' + p[1]));
  for (const x of xs) for (const y of ys) if (!keys.has(x + ',' + y)) return false;
  return true;
}

function bruteForce(points) {
  const n = points.length;
  let best = Infinity;
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (let k = j + 1; k < n; k++) for (let l = k + 1; l < n; l++) {
    if (isAxisRectangle(points[i], points[j], points[k], points[l])) {
      const xs = [points[i][0], points[j][0], points[k][0], points[l][0]];
      const ys = [points[i][1], points[j][1], points[k][1], points[l][1]];
      best = Math.min(best, (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys)));
    }
  }
  return best === Infinity ? 0 : best;
}

function optimal(points) {
  const seen = new Set(points.map((p) => p[0] + ',' + p[1]));
  let best = Infinity;
  for (let i = 0; i < points.length; i++) {
    const [x1, y1] = points[i];
    for (let j = i + 1; j < points.length; j++) {
      const [x2, y2] = points[j];
      if (x1 === x2 || y1 === y2) continue;                 // not a diagonal
      if (seen.has(x1 + ',' + y2) && seen.has(x2 + ',' + y1)) {
        best = Math.min(best, Math.abs(x1 - x2) * Math.abs(y1 - y2));
      }
    }
  }
  return best === Infinity ? 0 : best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([[1, 1], [1, 3], [3, 1], [3, 3], [2, 2]]), 4);
  assert.strictEqual(solve([[1, 1], [1, 3], [3, 1], [3, 3], [4, 1], [4, 3]]), 2);
  assert.strictEqual(solve([[0, 0], [1, 1]]), 0);
  assert.strictEqual(solve([[0, 0], [1, 0], [2, 0], [3, 0]]), 0);
  assert.strictEqual(solve([[0, 0], [0, 1], [1, 0], [1, 1]]), 1);
  assert.strictEqual(solve([]), 0);
}
for (let trial = 0; trial < 200; trial++) {
  const set = new Set();
  const n = Math.floor(Math.random() * 10);
  while (set.size < n) set.add(Math.floor(Math.random() * 4) + ',' + Math.floor(Math.random() * 4));
  const points = [...set].map((s) => s.split(',').map(Number));
  assert.strictEqual(optimal(points), bruteForce(points));
}
console.log('✓ 05-minimum-area-rectangle passed');

module.exports = { optimal, bruteForce };

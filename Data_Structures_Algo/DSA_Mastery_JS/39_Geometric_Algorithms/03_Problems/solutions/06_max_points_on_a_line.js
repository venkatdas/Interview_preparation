/**
 * 06. Max Points on a Line   (LeetCode 149 — Hard)
 *
 * PROBLEM
 * Given distinct points with integer coordinates, return the maximum number of points that
 * lie on the same straight line.
 *
 * EXAMPLES
 * Input: [[1,1],[2,2],[3,3]]                        Output: 3
 * Input: [[1,1],[3,2],[5,3],[4,1],[2,3],[1,4]]      Output: 4
 * Input: [[0,0]]                                    Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Up to 300 points -> O(n^2) fine, O(n^3) borderline but okay for a brute force
 * - Points are distinct (no duplicates to count twice)
 * - Vertical lines exist -> never compute slope as dy/dx with division
 *
 * APPROACH 1 — Brute force   O(n^3) time
 * For every pair (i, j), count the points k collinear with them using the cross product
 * (x_j - x_i)(y_k - y_i) - (y_j - y_i)(x_k - x_i) === 0. No division, no floats.
 *
 * APPROACH 2 — Optimal (Anchor + normalised slope counting)   O(n^2) time, O(n) space
 * For each anchor point i, every other point j defines a direction (dx, dy). Two points
 * are on the same line through i iff their directions are parallel. Normalise:
 *   g = gcd(|dx|, |dy|); dx /= g; dy /= g;  then fix the sign so (dx, dy) and (-dx, -dy)
 *   are the same key (e.g. make dx > 0, or dx === 0 and dy > 0).
 * Count directions in a Map; the best line through i has (max count + 1) points.
 * Vertical lines become (0, 1); horizontal (1, 0). Integer keys, exact.
 *
 * Dry run on [[1,1],[2,2],[3,3]], anchor (1,1):
 *   (2,2): d = (1,1) -> gcd 1 -> "1,1"
 *   (3,3): d = (2,2) -> gcd 2 -> "1,1"
 *   map { "1,1": 2 } -> 2 + 1 = 3
 *
 * EDGE CASES
 * - n = 1 -> 1; n = 2 -> 2
 * - all points on a vertical line
 * - negative coordinates (sign normalisation matters)
 */

function bruteForce(points) {
  const n = points.length;
  if (n <= 2) return n;
  let best = 2;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      let count = 2;
      for (let k = j + 1; k < n; k++) {
        const cross = (points[j][0] - points[i][0]) * (points[k][1] - points[i][1]) -
                      (points[j][1] - points[i][1]) * (points[k][0] - points[i][0]);
        if (cross === 0) count++;
      }
      best = Math.max(best, count);
    }
  }
  return best;
}

function gcd(a, b) {
  while (b) [a, b] = [b, a % b];
  return a;
}

function optimal(points) {
  const n = points.length;
  if (n <= 2) return n;
  let best = 2;
  for (let i = 0; i < n; i++) {
    const directions = new Map();
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      let dx = points[j][0] - points[i][0];
      let dy = points[j][1] - points[i][1];
      const g = gcd(Math.abs(dx), Math.abs(dy));
      dx /= g;
      dy /= g;
      if (dx < 0 || (dx === 0 && dy < 0)) {      // canonical sign: (dx, dy) ~ (-dx, -dy)
        dx = -dx;
        dy = -dy;
      }
      const key = dx + ',' + dy;
      directions.set(key, (directions.get(key) || 0) + 1);
    }
    for (const count of directions.values()) best = Math.max(best, count + 1);
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([[1, 1], [2, 2], [3, 3]]), 3);
  assert.strictEqual(solve([[1, 1], [3, 2], [5, 3], [4, 1], [2, 3], [1, 4]]), 4);
  assert.strictEqual(solve([[0, 0]]), 1);
  assert.strictEqual(solve([[0, 0], [1, 1]]), 2);
  assert.strictEqual(solve([[2, 0], [2, 1], [2, 5], [3, 3]]), 3);        // vertical
  assert.strictEqual(solve([[-1, -1], [1, 1], [0, 0], [2, -2]]), 3);     // negatives
  assert.strictEqual(solve([[0, 0], [1, 0], [2, 0], [0, 1], [0, 2]]), 3);
}
for (let trial = 0; trial < 200; trial++) {
  const set = new Set();
  const n = 1 + Math.floor(Math.random() * 10);
  while (set.size < n) set.add((Math.floor(Math.random() * 7) - 3) + ',' + (Math.floor(Math.random() * 7) - 3));
  const points = [...set].map((s) => s.split(',').map(Number));
  assert.strictEqual(optimal(points), bruteForce(points));
}
console.log('✓ 06-max-points-on-a-line passed');

module.exports = { optimal, bruteForce };

/**
 * 04. K Closest Points to Origin   (LeetCode 973 — Medium)
 *
 * PROBLEM
 * Given points [x, y] and an integer k, return the k points closest to the origin (0, 0)
 * by Euclidean distance. The answer may be in any order.
 *
 * EXAMPLES
 * Input: points = [[1,3],[-2,2]], k = 1   Output: [[-2,2]]
 * Input: points = [[3,3],[5,-1],[-2,4]], k = 2   Output: [[3,3],[-2,4]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Ties: any valid set is accepted (LeetCode guarantees a unique answer)
 * - n up to 10^4; k <= n
 * - Compare SQUARED distances: no sqrt, no floating point
 *
 * APPROACH 1 — Brute force   O(n log n) time
 * Sort all points by squared distance and take the first k.
 * (A max-heap of size k gives O(n log k): see ../../../19_Heaps_And_Priority_Queues/.)
 *
 * APPROACH 2 — Optimal (Quickselect on squared distance)   expected O(n) time, O(1) extra
 * Partition the points around a random pivot distance so that the k smallest end up in the
 * first k slots (their internal order does not matter). Recurse only into the side that
 * contains the k-th boundary. Expected O(n) total.
 *
 * Dry run on [[3,3],[5,-1],[-2,4]], k = 2: distances 18, 26, 20
 *   pivot (say) 20: partition -> [18, 20 | 26]; boundary at index 2 = k -> done
 *   first two points: [3,3], [-2,4]
 *
 * EDGE CASES
 * - k = n -> all points
 * - k = 1
 * - points with equal distances
 * - the origin itself among the points
 */

function distSq(p) {
  return p[0] * p[0] + p[1] * p[1];
}

function bruteForce(points, k) {
  return points.slice().sort((a, b) => distSq(a) - distSq(b)).slice(0, k);
}

function optimal(points, k) {
  const pts = points.slice();
  let lo = 0;
  let hi = pts.length - 1;
  while (lo < hi) {
    const pivot = distSq(pts[lo + Math.floor(Math.random() * (hi - lo + 1))]);
    let lt = lo;
    let i = lo;
    let gt = hi;
    while (i <= gt) {                                   // 3-way partition by distance
      const d = distSq(pts[i]);
      if (d < pivot) [pts[lt++], pts[i++]] = [pts[i], pts[lt]];
      else if (d > pivot) [pts[gt--], pts[i]] = [pts[i], pts[gt]];
      else i++;
    }
    // [lo, lt) < pivot, [lt, gt] == pivot, (gt, hi] > pivot
    if (k <= lt) hi = lt - 1;                           // the k-th boundary is inside the "<" part
    else if (k > gt + 1) lo = gt + 1;                   // inside the ">" part
    else break;                                         // boundary falls inside the "==" block
  }
  return pts.slice(0, k);
}

// ---------- tests ----------
const assert = require('assert');
const byDist = (a, b) => distSq(a) - distSq(b) || a[0] - b[0] || a[1] - b[1];
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([[1, 3], [-2, 2]], 1), [[-2, 2]]);
  assert.deepStrictEqual(solve([[3, 3], [5, -1], [-2, 4]], 2).sort(byDist), [[3, 3], [-2, 4]]);
  assert.deepStrictEqual(solve([[0, 0]], 1), [[0, 0]]);
  assert.deepStrictEqual(solve([[1, 1], [2, 2], [3, 3]], 3).sort(byDist), [[1, 1], [2, 2], [3, 3]]);
}
for (let trial = 0; trial < 300; trial++) {
  const n = 1 + Math.floor(Math.random() * 15);
  const points = Array.from({ length: n }, () => [Math.floor(Math.random() * 11) - 5, Math.floor(Math.random() * 11) - 5]);
  const k = 1 + Math.floor(Math.random() * n);
  // compare the multiset of distances (ties may be broken differently)
  const got = optimal(points, k).map(distSq).sort((a, b) => a - b);
  const expected = bruteForce(points, k).map(distSq).sort((a, b) => a - b);
  assert.deepStrictEqual(got, expected);
}
console.log('✓ 04-k-closest-points-to-origin passed');

module.exports = { optimal, bruteForce };

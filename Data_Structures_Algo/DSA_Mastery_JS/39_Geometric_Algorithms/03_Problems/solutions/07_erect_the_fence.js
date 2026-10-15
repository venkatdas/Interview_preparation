/**
 * 07. Erect the Fence   (LeetCode 587 — Hard)
 *
 * PROBLEM
 * Trees stand at integer coordinates. Fence them all with the shortest possible rope.
 * Return the trees that lie ON the fence (the convex hull), INCLUDING trees that sit on a
 * straight edge of the fence. Any order is accepted.
 *
 * EXAMPLES
 * Input: [[1,1],[2,2],[2,0],[2,4],[3,3],[4,2]]   Output: [[1,1],[2,0],[3,3],[2,4],[4,2]]
 *   (2,2) is strictly inside and is left out
 * Input: [[1,2],[2,2],[4,2]]   Output: [[1,2],[2,2],[4,2]]   (all collinear -> all on the fence)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Up to 3000 points -> O(n^3) brute force is too slow; O(n log n) expected
 * - Points are distinct
 * - Collinear boundary points must be INCLUDED (this is what makes the problem "hard")
 *
 * APPROACH 1 — Brute force   O(n^3) time
 * A point p is on the hull iff there is another point q such that every other point lies
 * on one side of (or on) the line pq. Test every pair with cross products.
 *
 * APPROACH 2 — Optimal (Andrew's monotone chain, keeping collinear points)   O(n log n)
 * Sort points by x then y. Build the LOWER hull left to right: push each point, and while
 * the last two points plus the new one make a CLOCKWISE turn (cross < 0) pop the middle
 * one. Build the UPPER hull right to left the same way. Using "cross < 0" instead of
 * "cross <= 0" keeps collinear points. Concatenate the chains and remove duplicates
 * (the two endpoints appear in both chains; a fully collinear set appears twice).
 *
 * Dry run on [[1,2],[2,2],[4,2]] (all collinear):
 *   lower: push (1,2), push (2,2), (4,2): cross((1,2),(2,2),(4,2)) = 0, not < 0 -> keep -> [(1,2),(2,2),(4,2)]
 *   upper (right to left): [(4,2),(2,2),(1,2)]
 *   union, deduped -> all three
 *
 * EDGE CASES
 * - fewer than 3 points -> all of them
 * - all collinear -> all of them
 * - a point strictly inside -> excluded
 * - duplicate points in the input (dedupe first to be safe)
 */

function cross(o, a, b) {
  return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
}

function key(p) {
  return p[0] + ',' + p[1];
}

function bruteForce(trees) {
  const pts = [...new Map(trees.map((p) => [key(p), p])).values()];
  if (pts.length <= 2) return pts;
  const onHull = [];
  for (let i = 0; i < pts.length; i++) {
    let isOnHull = false;
    for (let j = 0; j < pts.length && !isOnHull; j++) {
      if (i === j) continue;
      let left = 0;
      let right = 0;
      for (let k = 0; k < pts.length; k++) {
        if (k === i || k === j) continue;
        const c = cross(pts[i], pts[j], pts[k]);
        if (c > 0) left++;
        else if (c < 0) right++;
      }
      if (left === 0 || right === 0) isOnHull = true;    // all others on one side (or on the line)
    }
    if (isOnHull) onHull.push(pts[i]);
  }
  return onHull;
}

function optimal(trees) {
  const pts = [...new Map(trees.map((p) => [key(p), p])).values()]
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (pts.length <= 2) return pts;

  const lower = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) < 0) lower.pop();
    lower.push(p);
  }
  const upper = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) < 0) upper.pop();
    upper.push(p);
  }

  const seen = new Set();
  const hull = [];
  for (const p of lower.concat(upper)) {
    if (!seen.has(key(p))) {
      seen.add(key(p));
      hull.push(p);
    }
  }
  return hull;
}

// ---------- tests ----------
const assert = require('assert');
const sortPts = (arr) => arr.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(sortPts(solve([[1, 1], [2, 2], [2, 0], [2, 4], [3, 3], [4, 2]])), [[1, 1], [2, 0], [2, 4], [3, 3], [4, 2]]);
  assert.deepStrictEqual(sortPts(solve([[1, 2], [2, 2], [4, 2]])), [[1, 2], [2, 2], [4, 2]]);
  assert.deepStrictEqual(sortPts(solve([[0, 0]])), [[0, 0]]);
  assert.deepStrictEqual(sortPts(solve([[0, 0], [1, 1]])), [[0, 0], [1, 1]]);
  assert.deepStrictEqual(sortPts(solve([[0, 0], [2, 0], [2, 2], [0, 2], [1, 1], [1, 0]])), [[0, 0], [0, 2], [1, 0], [2, 0], [2, 2]]);
  assert.deepStrictEqual(sortPts(solve([[3, 7], [6, 8], [7, 8], [11, 10], [4, 3], [8, 5], [7, 13], [4, 13]])), [[3, 7], [4, 3], [4, 13], [7, 13], [8, 5], [11, 10]]);
}
for (let trial = 0; trial < 200; trial++) {
  const set = new Set();
  const n = 1 + Math.floor(Math.random() * 12);
  while (set.size < n) set.add(Math.floor(Math.random() * 6) + ',' + Math.floor(Math.random() * 6));
  const points = [...set].map((s) => s.split(',').map(Number));
  assert.deepStrictEqual(sortPts(optimal(points)), sortPts(bruteForce(points)));
}
console.log('✓ 07-erect-the-fence passed');

module.exports = { optimal, bruteForce };

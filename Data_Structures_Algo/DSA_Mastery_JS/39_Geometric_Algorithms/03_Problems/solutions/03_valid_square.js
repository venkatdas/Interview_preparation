/**
 * 03. Valid Square   (LeetCode 593 — Medium)
 *
 * PROBLEM
 * Given four points in the plane (any order), return true if they form a square with
 * positive area. The square may be rotated.
 *
 * EXAMPLES
 * Input: [0,0],[1,1],[1,0],[0,1]   Output: true
 * Input: [0,0],[1,1],[1,0],[0,12]  Output: false
 * Input: [1,0],[-1,0],[0,1],[0,-1] Output: true   (rotated 45 degrees)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Integer coordinates (so squared distances are exact integers; no sqrt needed)
 * - Points may coincide -> not a square (zero area)
 *
 * APPROACH 1 — Brute force   O(4!) = 24 orderings
 * Try every ordering as a polygon p0 p1 p2 p3 and check: four equal non-zero sides,
 * both diagonals equal, and diagonal^2 = 2 * side^2 (that forces right angles).
 *
 * APPROACH 2 — Optimal (Six pairwise squared distances)   O(1)
 * A square has exactly 4 equal sides and 2 equal diagonals among its 6 point pairs, and
 * diagonal^2 = 2 * side^2. So: compute the 6 squared distances, sort, and require
 *   d[0] === d[1] === d[2] === d[3] > 0   (sides)
 *   d[4] === d[5]                           (diagonals)
 *   d[4] === 2 * d[0]                       (right angles)
 * Why sufficient: 4 equal sides -> rhombus; equal diagonals -> rectangle; both -> square.
 *
 * Dry run on [0,0],[1,1],[1,0],[0,1]:
 *   distances: (0,0)-(1,1)=2, (0,0)-(1,0)=1, (0,0)-(0,1)=1, (1,1)-(1,0)=1, (1,1)-(0,1)=1, (1,0)-(0,1)=2
 *   sorted [1,1,1,1,2,2]: sides 1 > 0, diagonals 2 === 2, 2 === 2*1 -> true
 *
 * EDGE CASES
 * - all four points identical -> false (d[0] === 0)
 * - a rhombus that is not a square (diagonals differ) -> false
 * - a rectangle that is not a square (sides differ) -> false
 * - rotated squares
 */

function distSq(a, b) {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2;
}

function bruteForce(p1, p2, p3, p4) {
  const pts = [p1, p2, p3, p4];
  function permutations(arr) {
    if (arr.length <= 1) return [arr];
    const out = [];
    arr.forEach((x, i) => {
      for (const rest of permutations(arr.filter((_, j) => j !== i))) out.push([x, ...rest]);
    });
    return out;
  }
  for (const [a, b, c, d] of permutations(pts)) {
    const side = distSq(a, b);
    if (side === 0) continue;
    if (distSq(b, c) !== side || distSq(c, d) !== side || distSq(d, a) !== side) continue;
    const diag = distSq(a, c);
    if (diag !== distSq(b, d) || diag !== 2 * side) continue;
    return true;
  }
  return false;
}

function optimal(p1, p2, p3, p4) {
  const pts = [p1, p2, p3, p4];
  const d = [];
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) d.push(distSq(pts[i], pts[j]));
  d.sort((a, b) => a - b);
  return d[0] > 0 && d[0] === d[1] && d[1] === d[2] && d[2] === d[3] && d[4] === d[5] && d[4] === 2 * d[0];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([0, 0], [1, 1], [1, 0], [0, 1]), true);
  assert.strictEqual(solve([0, 0], [1, 1], [1, 0], [0, 12]), false);
  assert.strictEqual(solve([1, 0], [-1, 0], [0, 1], [0, -1]), true);
  assert.strictEqual(solve([0, 0], [0, 0], [0, 0], [0, 0]), false);
  assert.strictEqual(solve([0, 0], [2, 1], [4, 0], [2, -1]), false);     // rhombus, not square
  assert.strictEqual(solve([0, 0], [3, 0], [3, 1], [0, 1]), false);      // rectangle, not square
  assert.strictEqual(solve([0, 0], [1, 2], [-1, 3], [-2, 1]), true);     // rotated, non-axis
}
for (let trial = 0; trial < 300; trial++) {
  const pts = Array.from({ length: 4 }, () => [Math.floor(Math.random() * 5), Math.floor(Math.random() * 5)]);
  assert.strictEqual(optimal(...pts), bruteForce(...pts));
}
console.log('✓ 03-valid-square passed');

module.exports = { optimal, bruteForce };

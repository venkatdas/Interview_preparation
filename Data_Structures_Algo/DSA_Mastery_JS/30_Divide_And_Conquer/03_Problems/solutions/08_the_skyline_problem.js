/**
 * 08. The Skyline Problem   (LeetCode 218 — Hard)
 *
 * PROBLEM
 * buildings[i] = [left, right, height]. Return the skyline as a list of key points
 * [x, y]: every x where the outline height changes, with the new height y. The last point
 * always has y = 0. No two consecutive points may share the same y.
 *
 * EXAMPLES
 * Input: [[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]
 * Output: [[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]
 * Input: [[0,2,3],[2,5,3]]   Output: [[0,3],[5,0]]   (merged, no [2,3] duplicate height)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Up to 10^4 buildings, coordinates up to 2^31 -> cannot scan the x axis
 * - Buildings are sorted by left (given), heights >= 1
 *
 * APPROACH 1 — Brute force (sweep with a scan of active buildings)   O(n^2) time
 * Collect every left and right edge, sort the x's. At each x, the height is the max height
 * of all buildings with left <= x < right (scan all n). Emit a point when the height changes.
 *
 * APPROACH 2 — Optimal (Divide & conquer: merge two skylines)   O(n log n) time
 * One building's skyline is [[left, h], [right, 0]]. Split the buildings in half, compute
 * each half's skyline recursively, then MERGE the two skylines like merge sort: walk both
 * point lists by x, keep the current height of each side (hLeft, hRight), and the merged
 * height at any x is max(hLeft, hRight). Emit a point only when that max changes.
 * Merge is O(a + b) -> T(n) = 2T(n/2) + O(n) = O(n log n).
 * (The common alternative: sweep line with a max-heap of active heights + lazy deletion.)
 *
 * Dry run on [[0,2,3],[2,5,3]]:
 *   left skyline  [[0,3],[2,0]], right skyline [[2,3],[5,0]]
 *   merge: x=0: hL=3, max 3 -> emit [0,3]
 *          x=2 (both): hL=0, hR=3 -> max 3 (unchanged) -> no emit
 *          x=5: hR=0 -> max 0 -> emit [5,0]
 *   -> [[0,3],[5,0]]
 *
 * EDGE CASES
 * - single building
 * - buildings sharing an edge with equal height (must merge)
 * - one building entirely inside a taller one (no points from the inner one)
 * - buildings with the same left edge
 */

function bruteForce(buildings) {
  const xs = [...new Set(buildings.flatMap(([l, r]) => [l, r]))].sort((a, b) => a - b);
  const result = [];
  let prevHeight = 0;
  for (const x of xs) {
    let height = 0;
    for (const [l, r, h] of buildings) if (l <= x && x < r) height = Math.max(height, h);
    if (height !== prevHeight) {
      result.push([x, height]);
      prevHeight = height;
    }
  }
  return result;
}

function mergeSkylines(left, right) {
  const merged = [];
  let i = 0;
  let j = 0;
  let hLeft = 0;
  let hRight = 0;
  let prevHeight = 0;
  while (i < left.length || j < right.length) {
    let x;
    if (j >= right.length || (i < left.length && left[i][0] < right[j][0])) {
      x = left[i][0];
      hLeft = left[i][1];
      i++;
    } else if (i >= left.length || right[j][0] < left[i][0]) {
      x = right[j][0];
      hRight = right[j][1];
      j++;
    } else {                               // same x on both sides: consume both
      x = left[i][0];
      hLeft = left[i][1];
      hRight = right[j][1];
      i++;
      j++;
    }
    const height = Math.max(hLeft, hRight);
    if (height !== prevHeight) {           // only emit when the outline actually changes
      merged.push([x, height]);
      prevHeight = height;
    }
  }
  return merged;
}

function optimal(buildings) {
  if (buildings.length === 0) return [];
  if (buildings.length === 1) {
    const [l, r, h] = buildings[0];
    return [[l, h], [r, 0]];
  }
  const mid = buildings.length >> 1;
  return mergeSkylines(optimal(buildings.slice(0, mid)), optimal(buildings.slice(mid)));
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(
    solve([[2, 9, 10], [3, 7, 15], [5, 12, 12], [15, 20, 10], [19, 24, 8]]),
    [[2, 10], [3, 15], [7, 12], [12, 0], [15, 10], [20, 8], [24, 0]]
  );
  assert.deepStrictEqual(solve([[0, 2, 3], [2, 5, 3]]), [[0, 3], [5, 0]]);
  assert.deepStrictEqual(solve([[1, 5, 4]]), [[1, 4], [5, 0]]);
  assert.deepStrictEqual(solve([[1, 10, 5], [3, 4, 2]]), [[1, 5], [10, 0]]);     // inner building hidden
  assert.deepStrictEqual(solve([[1, 3, 2], [1, 3, 5]]), [[1, 5], [3, 0]]);       // same left edge
  assert.deepStrictEqual(solve([]), []);
}
for (let trial = 0; trial < 300; trial++) {
  const n = 1 + Math.floor(Math.random() * 7);
  const buildings = Array.from({ length: n }, () => {
    const l = Math.floor(Math.random() * 12);
    return [l, l + 1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 5)];
  }).sort((a, b) => a[0] - b[0]);
  assert.deepStrictEqual(optimal(buildings), bruteForce(buildings));
}
console.log('✓ 08-the-skyline-problem passed');

module.exports = { optimal, bruteForce };

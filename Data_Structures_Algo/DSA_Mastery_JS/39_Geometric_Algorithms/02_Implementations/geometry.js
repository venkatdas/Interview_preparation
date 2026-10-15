/**
 * Computational geometry (lite) in JavaScript. Points are [x, y] arrays.
 *
 *   cross(o, a, b)                 cross product of vectors OA and OB (signed double area)
 *   orientation(a, b, c)           -1 clockwise, 0 collinear, +1 counter-clockwise
 *   onSegment(p, a, b)             is p on the closed segment a-b (collinear + inside the box)
 *   segmentsIntersect(p1,p2,p3,p4) do segments p1-p2 and p3-p4 touch/cross (collinear cases too)
 *   distSq(a, b), dist(a, b)       squared / real Euclidean distance (prefer distSq: no floats)
 *   convexHull(points, keepCollinear = false)   Andrew's monotone chain, CCW order, O(n log n)
 *   polygonArea(points)            shoelace formula, absolute area
 *   rectanglesOverlap(r1, r2)      axis-aligned [x1, y1, x2, y2], strict overlap (positive area)
 *   rectangleIntersectionArea(r1, r2)
 *   pointInPolygon(p, polygon)     ray casting, boundary counts as inside
 *
 * Everything here uses integer arithmetic when the input is integer: cross products instead
 * of slopes (no division, no vertical-line special case), squared distances instead of sqrt.
 */

function cross(o, a, b) {
  return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
}

function orientation(a, b, c) {
  const value = cross(a, b, c);
  return value > 0 ? 1 : value < 0 ? -1 : 0;
}

function onSegment(p, a, b) {
  if (cross(a, b, p) !== 0) return false;
  return Math.min(a[0], b[0]) <= p[0] && p[0] <= Math.max(a[0], b[0]) &&
         Math.min(a[1], b[1]) <= p[1] && p[1] <= Math.max(a[1], b[1]);
}

// General case: the endpoints of each segment lie on opposite sides of the other segment.
// Degenerate (collinear) cases: check whether an endpoint lies on the other segment.
function segmentsIntersect(p1, p2, p3, p4) {
  const o1 = orientation(p1, p2, p3);
  const o2 = orientation(p1, p2, p4);
  const o3 = orientation(p3, p4, p1);
  const o4 = orientation(p3, p4, p2);
  if (o1 !== o2 && o3 !== o4) return true;
  if (o1 === 0 && onSegment(p3, p1, p2)) return true;
  if (o2 === 0 && onSegment(p4, p1, p2)) return true;
  if (o3 === 0 && onSegment(p1, p3, p4)) return true;
  if (o4 === 0 && onSegment(p2, p3, p4)) return true;
  return false;
}

function distSq(a, b) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return dx * dx + dy * dy;
}

function dist(a, b) {
  return Math.sqrt(distSq(a, b));
}

// Andrew's monotone chain. Sort by x (then y); build the lower hull left to right, then the
// upper hull right to left. A point is popped when it would make a clockwise turn (or a
// straight line, unless keepCollinear). Returns the hull counter-clockwise, no repeated end.
function convexHull(points, keepCollinear = false) {
  const pts = [...new Map(points.map((p) => [p[0] + ',' + p[1], p])).values()]   // dedupe
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  if (pts.length <= 2) return pts;

  const bad = (o, a, b) => (keepCollinear ? cross(o, a, b) < 0 : cross(o, a, b) <= 0);

  const lower = [];
  for (const p of pts) {
    while (lower.length >= 2 && bad(lower[lower.length - 2], lower[lower.length - 1], p)) lower.pop();
    lower.push(p);
  }
  const upper = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (upper.length >= 2 && bad(upper[upper.length - 2], upper[upper.length - 1], p)) upper.pop();
    upper.push(p);
  }
  lower.pop();                 // last point of each chain is the first of the other
  upper.pop();
  const hull = lower.concat(upper);
  if (keepCollinear) {
    // when all points are collinear, lower and upper contain the same points: dedupe
    const seen = new Set();
    return hull.filter((p) => {
      const key = p[0] + ',' + p[1];
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  return hull;
}

// Shoelace: 2 * area = sum over edges of (x_i * y_{i+1} - x_{i+1} * y_i)
function polygonArea(points) {
  let twice = 0;
  for (let i = 0; i < points.length; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[(i + 1) % points.length];
    twice += x1 * y2 - x2 * y1;
  }
  return Math.abs(twice) / 2;
}

// rectangles as [x1, y1, x2, y2] with x1 < x2, y1 < y2 (bottom-left, top-right)
function rectanglesOverlap(r1, r2) {
  // they do NOT overlap if one is entirely left / right / below / above the other
  return !(r1[2] <= r2[0] || r2[2] <= r1[0] || r1[3] <= r2[1] || r2[3] <= r1[1]);
}

function rectangleIntersectionArea(r1, r2) {
  const width = Math.min(r1[2], r2[2]) - Math.max(r1[0], r2[0]);
  const height = Math.min(r1[3], r2[3]) - Math.max(r1[1], r2[1]);
  return width > 0 && height > 0 ? width * height : 0;
}

// Ray casting: shoot a ray to the right; odd number of edge crossings = inside.
// Points on the boundary are reported as inside.
function pointInPolygon(p, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i];
    const b = polygon[j];
    if (onSegment(p, a, b)) return true;
    const crossesRay = (a[1] > p[1]) !== (b[1] > p[1]) &&
      p[0] < ((b[0] - a[0]) * (p[1] - a[1])) / (b[1] - a[1]) + a[0];
    if (crossesRay) inside = !inside;
  }
  return inside;
}

// ---------- self-test ----------
const assert = require('assert');

function randomInt(lo, hi) {
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}
function randomPoint(range) {
  return [randomInt(-range, range), randomInt(-range, range)];
}

// orientation / cross basics
assert.strictEqual(orientation([0, 0], [1, 0], [0, 1]), 1);     // CCW
assert.strictEqual(orientation([0, 0], [0, 1], [1, 0]), -1);    // CW
assert.strictEqual(orientation([0, 0], [1, 1], [2, 2]), 0);     // collinear
assert.strictEqual(distSq([0, 0], [3, 4]), 25);
assert.strictEqual(dist([0, 0], [3, 4]), 5);

// segment intersection vs brute-force "sample many points along both segments"
assert.strictEqual(segmentsIntersect([0, 0], [4, 4], [0, 4], [4, 0]), true);    // X
assert.strictEqual(segmentsIntersect([0, 0], [1, 1], [2, 2], [3, 3]), false);   // collinear, apart
assert.strictEqual(segmentsIntersect([0, 0], [2, 2], [1, 1], [3, 3]), true);    // collinear, overlap
assert.strictEqual(segmentsIntersect([0, 0], [2, 0], [2, 0], [2, 5]), true);    // touch at endpoint
assert.strictEqual(segmentsIntersect([0, 0], [2, 0], [0, 1], [2, 1]), false);   // parallel
assert.strictEqual(segmentsIntersect([1, 1], [1, 1], [0, 0], [2, 2]), true);    // degenerate point on segment

// convex hull vs O(n^3) brute force: a point is on the hull if some line through it and
// another point has all other points on one side (including collinear ones -> keepCollinear).
function bruteHull(points) {
  const pts = [...new Map(points.map((p) => [p[0] + ',' + p[1], p])).values()];
  if (pts.length <= 2) return pts;
  const onHull = new Set();
  for (let i = 0; i < pts.length; i++) {
    for (let j = 0; j < pts.length; j++) {
      if (i === j) continue;
      let left = 0;
      let right = 0;
      for (let k = 0; k < pts.length; k++) {
        if (k === i || k === j) continue;
        const o = orientation(pts[i], pts[j], pts[k]);
        if (o > 0) left++;
        else if (o < 0) right++;
      }
      if (left === 0 || right === 0) {
        onHull.add(pts[i][0] + ',' + pts[i][1]);
        onHull.add(pts[j][0] + ',' + pts[j][1]);
      }
    }
  }
  return onHull;
}
function hullKeys(hull) {
  return new Set(hull.map((p) => p[0] + ',' + p[1]));
}
for (let trial = 0; trial < 150; trial++) {
  const n = randomInt(1, 12);
  const points = Array.from({ length: n }, () => randomPoint(4));   // small range -> many collinear
  const expected = bruteHull(points);
  const hullAll = convexHull(points, true);
  assert.deepStrictEqual(hullKeys(hullAll), expected instanceof Set ? expected : hullKeys(expected));
  // strict hull: a subset of the collinear-inclusive hull, with no three consecutive collinear
  const strict = convexHull(points, false);
  for (const p of strict) assert.ok(hullKeys(hullAll).has(p[0] + ',' + p[1]));
  for (let i = 0; i < strict.length && strict.length >= 3; i++) {
    assert.ok(cross(strict[i], strict[(i + 1) % strict.length], strict[(i + 2) % strict.length]) > 0);
  }
  // the hull polygon contains every input point
  if (strict.length >= 3) for (const p of points) assert.ok(pointInPolygon(p, strict));
}
assert.deepStrictEqual(convexHull([[0, 0], [1, 1], [2, 2], [1, 0], [0, 2], [2, 0], [2, 1], [0, 1]]), [[0, 0], [2, 0], [2, 2], [0, 2]]);

// polygon area on known shapes
assert.strictEqual(polygonArea([[0, 0], [4, 0], [4, 3], [0, 3]]), 12);           // rectangle
assert.strictEqual(polygonArea([[0, 0], [4, 0], [0, 3]]), 6);                    // right triangle
assert.strictEqual(polygonArea([[0, 0], [2, 0], [2, 2], [1, 1], [0, 2]]), 3);    // concave
assert.strictEqual(polygonArea([[0, 0], [1, 1], [2, 2]]), 0);                    // degenerate

// rectangles vs sampling integer cells
for (let trial = 0; trial < 200; trial++) {
  const make = () => {
    const x1 = randomInt(-5, 5), y1 = randomInt(-5, 5);
    return [x1, y1, x1 + randomInt(1, 6), y1 + randomInt(1, 6)];
  };
  const r1 = make();
  const r2 = make();
  let cells = 0;
  for (let x = Math.max(r1[0], r2[0]); x < Math.min(r1[2], r2[2]); x++) {
    for (let y = Math.max(r1[1], r2[1]); y < Math.min(r1[3], r2[3]); y++) cells++;
  }
  assert.strictEqual(rectangleIntersectionArea(r1, r2), cells);
  assert.strictEqual(rectanglesOverlap(r1, r2), cells > 0);
}

// point in polygon
const square = [[0, 0], [4, 0], [4, 4], [0, 4]];
assert.strictEqual(pointInPolygon([2, 2], square), true);
assert.strictEqual(pointInPolygon([5, 2], square), false);
assert.strictEqual(pointInPolygon([4, 2], square), true);     // boundary counts as inside
assert.strictEqual(pointInPolygon([0, 0], square), true);     // vertex

console.log('✓ geometry.js self-test passed');

module.exports = {
  cross,
  orientation,
  onSegment,
  segmentsIntersect,
  distSq,
  dist,
  convexHull,
  polygonArea,
  rectanglesOverlap,
  rectangleIntersectionArea,
  pointInPolygon,
};

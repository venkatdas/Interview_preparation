// node --test 39_Geometric_Algorithms/tests/geometry.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const G = require('../02_Implementations/geometry');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(39);
const rint = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const rpt = (r) => [rint(-r, r), rint(-r, r)];
const key = (p) => p[0] + ',' + p[1];
const keys = (ps) => new Set(ps.map(key));

// O(n^3) reference: a point is on the (collinear-inclusive) hull iff some line through it and
// another point has every other point on one side.
function bruteHull(points) {
  const pts = [...new Map(points.map((p) => [key(p), p])).values()];
  if (pts.length <= 2) return keys(pts);
  const on = new Set();
  for (let i = 0; i < pts.length; i++) for (let j = 0; j < pts.length; j++) {
    if (i === j) continue;
    let l = 0, r = 0;
    for (let k = 0; k < pts.length; k++) {
      if (k === i || k === j) continue;
      const o = G.orientation(pts[i], pts[j], pts[k]);
      if (o > 0) l++; else if (o < 0) r++;
    }
    if (!l || !r) { on.add(key(pts[i])); on.add(key(pts[j])); }
  }
  return on;
}

// Grid-sampling reference for segment intersection on small integer coordinates:
// two segments intersect iff they share a point; we test with exact rational parametrisation.
function segIntersectBrute(a, b, c, d) {
  // solve a + t(b-a) = c + u(d-c) with fractions; handle parallel by checking overlap of points.
  const r = [b[0] - a[0], b[1] - a[1]], s = [d[0] - c[0], d[1] - c[1]];
  const den = r[0] * s[1] - r[1] * s[0];
  const qp = [c[0] - a[0], c[1] - a[1]];
  if (den !== 0) {
    const tNum = qp[0] * s[1] - qp[1] * s[0];
    const uNum = qp[0] * r[1] - qp[1] * r[0];
    const inRange = (num) => (den > 0 ? num >= 0 && num <= den : num <= 0 && num >= den);
    return inRange(tNum) && inRange(uNum);
  }
  // parallel or degenerate: intersect iff some endpoint lies on the other segment
  return G.onSegment(a, c, d) || G.onSegment(b, c, d) || G.onSegment(c, a, b) || G.onSegment(d, a, b);
}

describe('cross product / orientation', () => {
  it('left turn, right turn, collinear', () => {
    assert.equal(G.orientation([0, 0], [1, 0], [1, 1]), 1);
    assert.equal(G.orientation([0, 0], [1, 0], [1, -1]), -1);
    assert.equal(G.orientation([0, 0], [1, 1], [3, 3]), 0);
  });
  it('is antisymmetric when swapping two points', () => {
    for (let t = 0; t < 200; t++) {
      const a = rpt(10), b = rpt(10), c = rpt(10);
      assert.equal(G.cross(a, b, c) + 0, -G.cross(a, c, b) + 0); // +0 turns -0 into 0
    }
  });
});

describe('segmentsIntersect', () => {
  it('touching, parallel, collinear-overlap, degenerate point', () => {
    assert.equal(G.segmentsIntersect([0, 0], [2, 0], [2, 0], [2, 5]), true);
    assert.equal(G.segmentsIntersect([0, 0], [2, 0], [0, 1], [2, 1]), false);
    assert.equal(G.segmentsIntersect([0, 0], [4, 0], [2, 0], [6, 0]), true);
    assert.equal(G.segmentsIntersect([0, 0], [1, 0], [2, 0], [3, 0]), false);
    assert.equal(G.segmentsIntersect([1, 1], [1, 1], [0, 0], [2, 2]), true);
  });
  it('matches exact parametric brute force on random small segments', () => {
    for (let t = 0; t < 1000; t++) {
      const a = rpt(3), b = rpt(3), c = rpt(3), d = rpt(3);
      if (key(a) === key(b) && key(c) === key(d)) continue; // two points: skip trivial case
      assert.equal(G.segmentsIntersect(a, b, c, d), segIntersectBrute(a, b, c, d), JSON.stringify([a, b, c, d]));
    }
  });
});

describe('convexHull', () => {
  it('square with interior and edge points', () => {
    const pts = [[0, 0], [2, 0], [2, 2], [0, 2], [1, 1], [1, 0]];
    assert.deepEqual(keys(G.convexHull(pts)), keys([[0, 0], [2, 0], [2, 2], [0, 2]]));
    assert.deepEqual(keys(G.convexHull(pts, true)), keys([[0, 0], [1, 0], [2, 0], [2, 2], [0, 2]]));
  });
  it('handles 0, 1, 2 points, duplicates and all-collinear input', () => {
    assert.deepEqual(G.convexHull([]), []);
    assert.deepEqual(G.convexHull([[1, 1], [1, 1]]), [[1, 1]]);
    assert.equal(G.convexHull([[0, 0], [1, 1], [2, 2], [3, 3]], true).length, 4);
    assert.deepEqual(keys(G.convexHull([[0, 0], [1, 1], [2, 2], [3, 3]])), keys([[0, 0], [3, 3]]));
  });
  it('matches the O(n^3) brute force on random point sets', () => {
    for (let t = 0; t < 300; t++) {
      const pts = Array.from({ length: rint(1, 14) }, () => rpt(4));
      const all = G.convexHull(pts, true);
      assert.deepEqual(keys(all), bruteHull(pts));
      const strict = G.convexHull(pts);
      if (strict.length >= 3) {
        for (let i = 0; i < strict.length; i++) {
          assert.ok(G.cross(strict[i], strict[(i + 1) % strict.length], strict[(i + 2) % strict.length]) > 0, 'counter-clockwise, no collinear');
        }
        for (const p of pts) assert.ok(G.pointInPolygon(p, strict));
      }
    }
  });
});

describe('area, distance, rectangles, point in polygon', () => {
  it('polygonArea uses the shoelace formula (orientation independent)', () => {
    assert.equal(G.polygonArea([[0, 0], [4, 0], [4, 3]]), 6);
    assert.equal(G.polygonArea([[4, 3], [4, 0], [0, 0]]), 6);
    assert.equal(G.polygonArea([[0, 0], [2, 0], [2, 2], [0, 2]]), 4);
  });
  it('distances', () => {
    assert.equal(G.distSq([0, 0], [3, 4]), 25);
    assert.equal(G.dist([0, 0], [3, 4]), 5);
  });
  it('rectangles: overlap and area match unit-cell counting', () => {
    const cells = (r) => { const s = new Set(); for (let x = r[0]; x < r[2]; x++) for (let y = r[1]; y < r[3]; y++) s.add(x + ',' + y); return s; };
    for (let t = 0; t < 500; t++) {
      const mk = () => { const x1 = rint(-4, 3), y1 = rint(-4, 3); return [x1, y1, rint(x1 + 1, 5), rint(y1 + 1, 5)]; };
      const a = mk(), b = mk();
      const ca = cells(a); let common = 0; for (const c of cells(b)) if (ca.has(c)) common++;
      assert.equal(G.rectangleIntersectionArea(a, b), common);
      assert.equal(G.rectanglesOverlap(a, b), common > 0);
    }
  });
  it('pointInPolygon: inside, outside, boundary', () => {
    const sq = [[0, 0], [4, 0], [4, 4], [0, 4]];
    assert.equal(G.pointInPolygon([2, 2], sq), true);
    assert.equal(G.pointInPolygon([5, 2], sq), false);
    assert.equal(G.pointInPolygon([4, 2], sq), true);
    assert.equal(G.pointInPolygon([0, 0], sq), true);
  });
});

describe('solution files', () => {
  const p01 = require('../03_Problems/solutions/01_rectangle_overlap');
  const p02 = require('../03_Problems/solutions/02_rectangle_area');
  const p03 = require('../03_Problems/solutions/03_valid_square');
  const p04 = require('../03_Problems/solutions/04_k_closest_points_to_origin');
  const p06 = require('../03_Problems/solutions/06_max_points_on_a_line');
  const p07 = require('../03_Problems/solutions/07_erect_the_fence');
  it('edge cases', () => {
    assert.equal(p01.optimal([0, 0, 1, 1], [1, 0, 2, 1]), false);   // touching edge
    assert.equal(p02.optimal(-2, -2, 2, 2, -2, -2, 2, 2), 16);       // identical
    assert.equal(p03.optimal([0, 0], [0, 0], [0, 0], [0, 0]), false);
    assert.equal(p03.optimal([0, 0], [1, 1], [1, 0], [0, 1]), true);
    assert.equal(p06.optimal([[1, 1]]), 1);
    assert.equal(keys(p07.optimal([[1, 2], [2, 2], [4, 2]])).size, 3);
  });
  it('optimal agrees with bruteForce on random inputs', () => {
    for (let t = 0; t < 200; t++) {
      const mk = () => { const x1 = rint(-5, 4), y1 = rint(-5, 4); return [x1, y1, rint(x1 + 1, 6), rint(y1 + 1, 6)]; };
      const a = mk(), b = mk();
      assert.equal(p01.optimal(a, b), p01.bruteForce(a, b));
      assert.equal(p02.optimal(...a, ...b), p02.bruteForce(...a, ...b));
      const q = [rpt(2), rpt(2), rpt(2), rpt(2)];
      assert.equal(p03.optimal(...q), p03.bruteForce(...q));
      const pts = Array.from({ length: rint(1, 10) }, () => rpt(5));
      const k = rint(1, pts.length);
      const d = (p) => p[0] * p[0] + p[1] * p[1];
      assert.deepEqual(p04.optimal(pts.map((p) => [...p]), k).map(d).sort((x, y) => x - y), p04.bruteForce(pts.map((p) => [...p]), k).map(d).sort((x, y) => x - y));
      const distinct = [...new Map(pts.map((p) => [key(p), p])).values()];
      assert.equal(p06.optimal(distinct), p06.bruteForce(distinct));
      assert.deepEqual(keys(p07.optimal(distinct)), keys(p07.bruteForce(distinct)));
    }
  });
});

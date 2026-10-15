/**
 * 06. Random Point in Non-overlapping Rectangles   (LeetCode 497 — Medium)
 *
 * PROBLEM
 * You get a list of axis-aligned rectangles [a, b, x, y] where (a, b) is the
 * bottom-left and (x, y) the top-right corner. Rectangles do not overlap.
 * Implement pick(): return an INTEGER point [u, v] lying inside or on the border
 * of some rectangle, so that every integer point covered by the rectangles is
 * equally likely.
 *
 * EXAMPLES
 * rects = [[-2, -2, 1, 1], [2, 2, 4, 6]]
 * first rect covers 4 * 4 = 16 points, second 3 * 5 = 15 points
 * pick() -> e.g. [1, -2] or [3, 5] — each of the 31 points with probability 1/31
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Inclusive borders? (yes: width = x - a + 1, height = y - b + 1)
 * - Can a rectangle be a single point or a line? (yes, width or height 1)
 * - Many picks? (yes -> precompute)
 *
 * APPROACH 1 — Brute force (list every point)   O(P) build and space, O(1) per pick
 * Enumerate all integer points into one array, pick a random index.
 * P can be enormous (coordinates up to 1e9), so this only works for tiny inputs.
 *
 * APPROACH 2 — Optimal (weighted pick by point count + uniform inside)   O(n) build, O(log n) per pick
 * Common mistake: picking a rectangle uniformly, then a point — small rectangles
 * would get too many picks. Instead weight each rectangle by its POINT COUNT
 * (x-a+1)*(y-b+1) — exactly "Random Pick with Weight". Draw an integer
 * r in [0, total), binary-search the rectangle, then use the offset
 * r - prefixBefore as a cell number inside it: u = a + off % width, v = b + floor(off / width).
 *
 * Dry run on [[-2,-2,1,1],[2,2,4,6]]: counts [16, 15], prefix [16, 31]
 *   r = 20: first prefix > 20 is index 1; off = 20 - 16 = 4; width 3
 *           u = 2 + 4 % 3 = 3, v = 2 + floor(4 / 3) = 3  -> [3, 3]
 *
 * EDGE CASES
 * - area vs point count: a 0-area rectangle [1,1,1,1] still has 1 point
 * - negative coordinates (just offsets from a, b)
 * - use integer r (Math.floor) so offsets are exact
 */
const { mulberry32, looksUniform } = require('../../02_Implementations/randomization');

class NaiveSolution {
  constructor(rects, rng = Math.random) {
    this.rng = rng;
    this.points = [];
    for (const [a, b, x, y] of rects) {
      for (let u = a; u <= x; u++) for (let v = b; v <= y; v++) this.points.push([u, v]);
    }
  }
  pick() {
    return this.points[Math.floor(this.rng() * this.points.length)].slice();
  }
}

class Solution {
  constructor(rects, rng = Math.random) {
    this.rects = rects;
    this.rng = rng;
    this.prefix = [];
    let run = 0;
    for (const [a, b, x, y] of rects) {
      run += (x - a + 1) * (y - b + 1); // number of integer points, not area
      this.prefix.push(run);
    }
    this.total = run;
  }
  pick() {
    const r = Math.floor(this.rng() * this.total); // integer in [0, total)
    let lo = 0;
    let hi = this.prefix.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.prefix[mid] > r) hi = mid;
      else lo = mid + 1;
    }
    const [a, b, x] = this.rects[lo];
    const off = r - (lo > 0 ? this.prefix[lo - 1] : 0);
    const width = x - a + 1;
    return [a + (off % width), b + Math.floor(off / width)];
  }
}

const bruteForce = (rects, rng) => new NaiveSolution(rects, rng).pick();
const optimal = (rects, rng) => new Solution(rects, rng).pick();

// ---------- tests ----------
const assert = require('assert');
const rng = mulberry32(497);
const inside = (rects, [u, v]) => rects.some(([a, b, x, y]) => a <= u && u <= x && b <= v && v <= y);

// dry run replay with a fixed rng: r = 20
const rectsA = [[-2, -2, 1, 1], [2, 2, 4, 6]];
assert.deepStrictEqual(new Solution(rectsA, () => 20.5 / 31).pick(), [3, 3]);
assert.deepStrictEqual(new Solution([[1, 1, 1, 1]], rng).pick(), [1, 1]);

for (const Cls of [NaiveSolution, Solution]) {
  const s = new Cls(rectsA, rng);
  const counts = new Map();
  for (let t = 0; t < 62000; t++) {
    const p = s.pick();
    assert.ok(inside(rectsA, p));
    const key = p.join(',');
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  assert.strictEqual(counts.size, 31); // every point reachable
  assert.ok(looksUniform([...counts.values()]), `${Cls.name} not uniform over points`);
}

// randomized: optimal and naive enumerate the same multiset of points
// when we feed r = 0..total-1 in order
for (let t = 0; t < 50; t++) {
  const rects = [];
  let x0 = -10;
  for (let k = 0; k < 1 + Math.floor(rng() * 4); k++) {
    const w = Math.floor(rng() * 4);
    const h = Math.floor(rng() * 4);
    rects.push([x0, -2, x0 + w, -2 + h]);
    x0 += w + 2; // keep them disjoint
  }
  const naive = new NaiveSolution(rects, rng);
  const total = naive.points.length;
  const seen = new Set();
  for (let r = 0; r < total; r++) seen.add(new Solution(rects, () => (r + 0.5) / total).pick().join(','));
  assert.strictEqual(seen.size, total);
  for (const p of naive.points) assert.ok(seen.has(p.join(',')));
}
console.log('✓ 06_random_point_in_rectangles passed');

module.exports = { Solution, NaiveSolution, optimal, bruteForce };

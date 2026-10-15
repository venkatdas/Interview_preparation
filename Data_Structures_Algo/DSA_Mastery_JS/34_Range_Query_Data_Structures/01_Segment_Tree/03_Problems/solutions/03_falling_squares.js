/**
 * 03. Falling Squares   (LeetCode 699 — Hard)
 *
 * PROBLEM
 * Squares are dropped one by one onto the x-axis. positions[i] = [left, sideLength].
 * A square falls straight down until it lands on the ground or on top of an earlier
 * square (squares that only touch at an edge do NOT stack). After each drop return the
 * current maximum height of any stack.
 *
 * EXAMPLES
 * Input: [[1,2],[2,3],[6,1]]   Output: [2,5,5]
 *   square 1 covers x in [1,3), height 2
 *   square 2 covers [2,5): overlaps square 1 -> lands at 2, top = 5
 *   square 3 covers [6,7): nothing below -> top = 1, max stays 5
 * Input: [[100,100],[200,100]]   Output: [100,100]   (they only touch at x = 200)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - How many squares? (up to 1000 -> O(n^2) brute is fine; we still show the tree)
 * - Coordinates up to 10^8 -> cannot index the axis directly; compress coordinates.
 * - Edge touching counts as not overlapping (use half-open intervals [left, right)).
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(n) space
 * Keep a list of landed squares (left, right, top). For a new square, scan all earlier
 * ones; its base is the max top among those whose [left, right) overlaps. Store it.
 *
 * APPROACH 2 — Optimal (Coordinate compression + segment tree, range-max with range-assign)
 *   O(n log n) time, O(n) space
 * 1. Collect every left and right-1 (the last integer column each square covers), sort,
 *    dedupe -> each real coordinate maps to a small index. Now the axis has <= 2n cells.
 * 2. Segment tree over those cells storing the current height of each cell, with
 *    lazy "assign" tags (set every cell in a range to a value) and range-max query.
 * 3. For each square: base = queryMax(l, r); newTop = base + side; assign(l, r, newTop);
 *    answer = max(answer, newTop).
 *
 * Dry run on [[1,2],[2,3],[6,1]]:
 *   columns used: square1 [1,2], square2 [2,4], square3 [6,6] -> coords {1,2,4,6} -> idx 0..3
 *   square1: l=0 (x=1) r=1 (x=2); max = 0; top 2; assign idx0..1 = 2; ans 2
 *   square2: x in [2,4] -> idx1..2; max = 2 (idx1); top 5; assign idx1..2 = 5; ans 5
 *   square3: x=6 -> idx3..3; max = 0; top 1; ans stays 5
 *   -> [2,5,5]
 *
 * Why compress with right - 1 and not right? If we used right, square [1,2] (covers
 * columns 1,2) and [3,1] (column 3) would share coordinate 3 and wrongly overlap.
 *
 * EDGE CASES
 * - single square
 * - squares that touch only at an edge
 * - a square that spans several earlier squares (takes the highest)
 * - huge coordinates (compression handles them)
 */

function bruteForce(positions) {
  const landed = []; // {left, right, top}
  const result = [];
  let best = 0;
  for (const [left, side] of positions) {
    const right = left + side;
    let base = 0;
    for (const sq of landed) {
      // half-open intervals overlap when each starts before the other ends
      if (left < sq.right && sq.left < right) base = Math.max(base, sq.top);
    }
    const top = base + side;
    landed.push({ left, right, top });
    best = Math.max(best, top);
    result.push(best);
  }
  return result;
}

// Segment tree: range assign (set) + range max, with lazy tags
class AssignMaxTree {
  constructor(size) {
    this.n = size;
    this.max = new Array(4 * size).fill(0);
    this.lazy = new Array(4 * size).fill(null); // null = no pending assignment
  }

  #pushDown(node) {
    if (this.lazy[node] === null) return;
    for (const child of [2 * node + 1, 2 * node + 2]) {
      this.max[child] = this.lazy[node];
      this.lazy[child] = this.lazy[node];
    }
    this.lazy[node] = null;
  }

  assign(l, r, value, node = 0, lo = 0, hi = this.n - 1) {
    if (r < lo || hi < l) return;
    if (l <= lo && hi <= r) {
      this.max[node] = value;
      this.lazy[node] = value;
      return;
    }
    this.#pushDown(node);
    const mid = (lo + hi) >> 1;
    this.assign(l, r, value, 2 * node + 1, lo, mid);
    this.assign(l, r, value, 2 * node + 2, mid + 1, hi);
    this.max[node] = Math.max(this.max[2 * node + 1], this.max[2 * node + 2]);
  }

  queryMax(l, r, node = 0, lo = 0, hi = this.n - 1) {
    if (r < lo || hi < l) return 0;
    if (l <= lo && hi <= r) return this.max[node];
    this.#pushDown(node);
    const mid = (lo + hi) >> 1;
    return Math.max(
      this.queryMax(l, r, 2 * node + 1, lo, mid),
      this.queryMax(l, r, 2 * node + 2, mid + 1, hi)
    );
  }
}

function optimal(positions) {
  // 1. coordinate compression over the first and LAST column each square covers
  const coords = new Set();
  for (const [left, side] of positions) {
    coords.add(left);
    coords.add(left + side - 1);
  }
  const sorted = [...coords].sort((a, b) => a - b);
  const indexOf = new Map(sorted.map((x, i) => [x, i]));

  // 2. tree over compressed cells
  const tree = new AssignMaxTree(sorted.length);
  const result = [];
  let best = 0;
  for (const [left, side] of positions) {
    const l = indexOf.get(left);
    const r = indexOf.get(left + side - 1);
    const top = tree.queryMax(l, r) + side;
    tree.assign(l, r, top);
    best = Math.max(best, top);
    result.push(best);
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([[1, 2], [2, 3], [6, 1]]), [2, 5, 5]);
  assert.deepStrictEqual(solve([[100, 100], [200, 100]]), [100, 100]);
  assert.deepStrictEqual(solve([[5, 3]]), [3]);
  assert.deepStrictEqual(solve([[1, 1], [1, 1], [1, 1]]), [1, 2, 3]);
  assert.deepStrictEqual(solve([[1, 2], [3, 2], [1, 4]]), [2, 2, 6]);   // third spans both
  assert.deepStrictEqual(solve([[1000000000, 5], [1, 5]]), [5, 5]);
}
for (let trial = 0; trial < 50; trial++) {
  const n = 1 + Math.floor(Math.random() * 12);
  const positions = Array.from({ length: n }, () => [
    1 + Math.floor(Math.random() * 15),
    1 + Math.floor(Math.random() * 5),
  ]);
  assert.deepStrictEqual(optimal(positions), bruteForce(positions));
}
console.log('✓ 03-falling-squares passed');

module.exports = { optimal, bruteForce };

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const M = require('../02_Implementations/matrix_utils');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(37);
const randInt = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const randGrid = (rows, cols, lo = -9, hi = 9) => Array.from({ length: rows }, () => Array.from({ length: cols }, () => randInt(lo, hi)));

// Brute-force spiral: walk with a direction vector and a visited set.
function bruteSpiral(g) {
  if (!g.length || !g[0].length) return [];
  const rows = g.length, cols = g[0].length, seen = new Set(), out = [];
  const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  let r = 0, c = 0, d = 0;
  for (let k = 0; k < rows * cols; k++) {
    out.push(g[r][c]); seen.add(r * cols + c);
    const nr = r + dirs[d][0], nc = c + dirs[d][1];
    if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || seen.has(nr * cols + nc)) d = (d + 1) % 4;
    r += dirs[d][0]; c += dirs[d][1];
  }
  return out;
}

describe('create / clone', () => {
  it('rows are independent (no shared-row trap)', () => {
    const g = M.create(3, 2);
    g[0][0] = 5;
    assert.equal(g[1][0], 0);
    assert.deepEqual(M.create(0, 3), []);
    assert.deepEqual(M.create(2, 2, 'x'), [['x', 'x'], ['x', 'x']]);
  });
  it('clone is a deep copy of rows', () => {
    const g = [[1, 2], [3, 4]];
    const c = M.clone(g);
    c[1][1] = 0;
    assert.equal(g[1][1], 4);
    assert.deepEqual(M.clone([]), []);
  });
});

describe('transpose / rotate90 / rotate90InPlace', () => {
  it('handles empty, single cell, single row and single column', () => {
    assert.deepEqual(M.transpose([]), []);
    assert.deepEqual(M.transpose([[1]]), [[1]]);
    assert.deepEqual(M.transpose([[1, 2, 3]]), [[1], [2], [3]]);
    assert.deepEqual(M.rotate90([[1], [2]]), [[2, 1]]);
  });
  it('transpose twice is the identity on random rectangles', () => {
    for (let t = 0; t < 200; t++) {
      const g = randGrid(randInt(1, 6), randInt(1, 6));
      assert.deepEqual(M.transpose(M.transpose(g)), g);
    }
  });
  it('rotate90 matches the index formula and four rotations are the identity', () => {
    for (let t = 0; t < 200; t++) {
      const rows = randInt(1, 6), cols = randInt(1, 6);
      const g = randGrid(rows, cols);
      const r = M.rotate90(g);
      for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) assert.equal(r[j][rows - 1 - i], g[i][j]);
      assert.deepEqual(M.rotate90(M.rotate90(M.rotate90(r))), g);
    }
  });
  it('rotate90InPlace agrees with rotate90 on random squares and mutates the input', () => {
    for (let t = 0; t < 200; t++) {
      const n = randInt(1, 7);
      const g = randGrid(n, n);
      const expected = M.rotate90(M.clone(g));
      const out = M.rotate90InPlace(g);
      assert.equal(out, g);
      assert.deepEqual(g, expected);
    }
  });
});

describe('spiralOrder', () => {
  it('handles empty, single row, single column', () => {
    assert.deepEqual(M.spiralOrder([]), []);
    assert.deepEqual(M.spiralOrder([[1, 2, 3]]), [1, 2, 3]);
    assert.deepEqual(M.spiralOrder([[1], [2], [3]]), [1, 2, 3]);
  });
  it('matches a direction-walk brute force on random rectangles', () => {
    for (let t = 0; t < 300; t++) {
      const g = randGrid(randInt(1, 7), randInt(1, 7));
      assert.deepEqual(M.spiralOrder(g), bruteSpiral(g));
    }
  });
});

describe('inBounds / neighbors4 / neighbors8', () => {
  it('corners, edges and centre', () => {
    assert.equal(M.neighbors4(0, 0, 1, 1).length, 0);
    assert.equal(M.neighbors8(0, 0, 1, 1).length, 0);
    assert.equal(M.neighbors4(0, 1, 3, 3).length, 3);
    assert.equal(M.neighbors8(0, 1, 3, 3).length, 5);
    assert.equal(M.inBounds(2, 2, 3, 3), true);
    assert.equal(M.inBounds(3, 0, 3, 3), false);
  });
  it('every neighbour is in bounds and adjacent on random grids', () => {
    for (let t = 0; t < 200; t++) {
      const rows = randInt(1, 8), cols = randInt(1, 8), r = randInt(0, rows - 1), c = randInt(0, cols - 1);
      for (const [nr, nc] of M.neighbors8(r, c, rows, cols)) {
        assert.ok(M.inBounds(nr, nc, rows, cols));
        assert.ok(Math.max(Math.abs(nr - r), Math.abs(nc - c)) === 1);
      }
      const expected4 = [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].filter(([a, b]) => a >= 0 && a < rows && b >= 0 && b < cols);
      assert.deepEqual(M.neighbors4(r, c, rows, cols), expected4);
    }
  });
  it('DIRS arrays have the right sizes and printGrid formats rows', () => {
    assert.equal(M.DIRS4.length, 4);
    assert.equal(M.DIRS8.length, 8);
    assert.equal(M.printGrid([[1, -2], [3, 4]]), '1 -2\n3 4');
  });
});

describe('solution files: extra edge cases', () => {
  const rotate = require('../03_Problems/solutions/06_rotate_image');
  const zeroes = require('../03_Problems/solutions/09_set_matrix_zeroes');
  const search2 = require('../03_Problems/solutions/10_search_2d_matrix_ii');
  const islands = require('../03_Problems/solutions/14_number_of_islands');
  const kth = require('../03_Problems/solutions/16_kth_smallest_in_sorted_matrix');

  it('Rotate Image: 1x1 and random squares vs brute force', () => {
    const one = [[5]];
    rotate.optimal(one);
    assert.deepEqual(one, [[5]]);
    for (let t = 0; t < 100; t++) {
      const n = randInt(1, 6); const g = randGrid(n, n);
      const a = M.clone(g), b = M.clone(g);
      rotate.optimal(a); rotate.bruteForce(b);
      assert.deepEqual(a, b);
    }
  });
  it('Set Matrix Zeroes: zero in first row/column, random vs brute force', () => {
    for (let t = 0; t < 200; t++) {
      const g = randGrid(randInt(1, 6), randInt(1, 6), 0, 4);
      const a = M.clone(g), b = M.clone(g);
      zeroes.optimal(a); zeroes.bruteForce(b);
      assert.deepEqual(a, b);
    }
  });
  it('Search a 2D Matrix II: target at corners and missing', () => {
    const m = [[1, 4, 7], [2, 5, 8], [3, 6, 9]];
    assert.equal(search2.optimal(m, 1), true);
    assert.equal(search2.optimal(m, 9), true);
    assert.equal(search2.optimal(m, 10), false);
    assert.equal(search2.optimal(m, 0), false);
  });
  it('Number of Islands: all water, all land, random vs brute force', () => {
    assert.equal(islands.optimal([['0', '0'], ['0', '0']]), 0);
    assert.equal(islands.optimal([['1', '1'], ['1', '1']]), 1);
    for (let t = 0; t < 200; t++) {
      const g = Array.from({ length: randInt(1, 6) }, () => []);
      const cols = randInt(1, 6);
      for (const row of g) for (let c = 0; c < cols; c++) row.push(rand() < 0.45 ? '1' : '0');
      assert.equal(islands.optimal(g.map((r) => [...r])), islands.bruteForce(g.map((r) => [...r])));
    }
  });
  it('Kth Smallest in a Sorted Matrix: duplicates and negatives', () => {
    const m = [[-5, -4], [-5, -4]];
    assert.equal(kth.optimal(m, 1), -5);
    assert.equal(kth.optimal(m, 3), -4);
    for (let t = 0; t < 100; t++) {
      const n = randInt(1, 5);
      const flat = Array.from({ length: n * n }, () => randInt(-10, 10)).sort((a, b) => a - b);
      // row- and column-sorted: fill row by row from a sorted list
      const g = Array.from({ length: n }, (_, r) => flat.slice(r * n, r * n + n));
      const k = randInt(1, n * n);
      assert.equal(kth.optimal(g, k), flat[k - 1]);
    }
  });
});

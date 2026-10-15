/**
 * 11. Range Sum Query 2D - Immutable   (LeetCode 304 — Medium)
 *
 * PROBLEM
 * Given a 2D matrix, implement NumMatrix with sumRegion(row1, col1, row2, col2) returning
 * the sum of the rectangle with top-left (row1, col1) and bottom-right (row2, col2),
 * inclusive. Many queries; the matrix never changes.
 *
 * EXAMPLES
 * matrix = [[3,0,1,4,2],[5,6,3,2,1],[1,2,0,1,5],[4,1,0,1,7],[1,0,3,0,5]]
 * sumRegion(2,1,4,3) -> 8      sumRegion(1,1,2,2) -> 11      sumRegion(1,2,2,4) -> 12
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Immutable? (yes)
 * - Inclusive corners? (yes)
 * - Up to 10^4 queries -> need O(1) per query
 *
 * APPROACH 1 — Brute force   O(rows * cols) per query
 * Double loop over the rectangle.
 * (Intermediate: per-row prefix sums give O(rows) per query.)
 *
 * APPROACH 2 — Optimal (2D prefix sums, inclusion-exclusion)   O(R*C) build, O(1) query
 * sums[r][c] = sum of the rectangle from (0,0) to (r-1,c-1) (padded with a zero row/col).
 * Build:  sums[r+1][c+1] = grid[r][c] + sums[r][c+1] + sums[r+1][c] - sums[r][c]
 *         (cell + above + left - the overlap that got counted twice)
 * Query:  total(r2,c2) - strip above (r1-1, c2) - strip left (r2, c1-1) + corner (r1-1, c1-1)
 *         = sums[r2+1][c2+1] - sums[r1][c2+1] - sums[r2+1][c1] + sums[r1][c1]
 *
 * Dry run for sumRegion(1,1,2,2) on the matrix above:
 *   sums[3][3] = sum of rows 0..2, cols 0..2 = 3+0+1+5+6+3+1+2+0 = 21
 *   sums[1][3] = row 0, cols 0..2 = 4
 *   sums[3][1] = rows 0..2, col 0 = 9
 *   sums[1][1] = 3
 *   21 - 4 - 9 + 3 = 11   (6 + 3 + 2 + 0 = 11)
 *
 * EDGE CASES
 * - Single cell query
 * - Whole matrix
 * - 1xN or Nx1 matrix
 * - Queries touching row 0 / col 0 (the padding makes them uniform)
 */

class BruteForceNumMatrix {
  #matrix;
  constructor(matrix) { this.#matrix = matrix; }
  sumRegion(row1, col1, row2, col2) {
    let sum = 0;
    for (let r = row1; r <= row2; r++)
      for (let c = col1; c <= col2; c++) sum += this.#matrix[r][c];
    return sum;
  }
}

class NumMatrix {
  #sums;

  constructor(matrix) {
    const rows = matrix.length;
    const cols = rows ? matrix[0].length : 0;
    this.#sums = Array.from({ length: rows + 1 }, () => new Array(cols + 1).fill(0));

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        this.#sums[r + 1][c + 1] =
          matrix[r][c] + this.#sums[r][c + 1] + this.#sums[r + 1][c] - this.#sums[r][c];
      }
    }
  }

  sumRegion(row1, col1, row2, col2) {
    const s = this.#sums;
    return s[row2 + 1][col2 + 1] - s[row1][col2 + 1] - s[row2 + 1][col1] + s[row1][col1];
  }
}

const bruteForce = BruteForceNumMatrix;
const optimal = NumMatrix;

// ---------- tests ----------
const assert = require('assert');
const grid = [
  [3, 0, 1, 4, 2],
  [5, 6, 3, 2, 1],
  [1, 2, 0, 1, 5],
  [4, 1, 0, 1, 7],
  [1, 0, 3, 0, 5],
];
for (const Impl of [bruteForce, optimal]) {
  const m = new Impl(grid);
  assert.strictEqual(m.sumRegion(2, 1, 4, 3), 8);
  assert.strictEqual(m.sumRegion(1, 1, 2, 2), 11);
  assert.strictEqual(m.sumRegion(1, 2, 2, 4), 12);
  assert.strictEqual(m.sumRegion(0, 0, 0, 0), 3);
  assert.strictEqual(m.sumRegion(0, 0, 4, 4), 58);
  assert.strictEqual(m.sumRegion(4, 0, 4, 4), 9);

  const row = new Impl([[1, 2, 3]]);
  assert.strictEqual(row.sumRegion(0, 1, 0, 2), 5);
}
console.log('✓ 11-range-sum-query-2d passed');

module.exports = { optimal, bruteForce, NumMatrix };

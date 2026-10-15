/**
 * Matrix / grid utilities in JavaScript. A matrix is an array of equal-length row arrays.
 *
 *   create(rows, cols, fill)   - safe constructor (no shared rows!)
 *   clone(grid)                - deep copy of a 2D array
 *   transpose(grid)            - new matrix, rows become columns
 *   rotate90(grid)             - new matrix, rotated clockwise
 *   rotate90InPlace(grid)      - square matrix rotated clockwise in place
 *   spiralOrder(grid)          - cells in spiral order
 *   inBounds(r, c, rows, cols)
 *   neighbors4 / neighbors8    - in-bounds neighbour coordinates
 *   printGrid(grid)            - string for debugging
 *   DIRS4 / DIRS8              - direction vectors
 */

const DIRS4 = [[-1, 0], [1, 0], [0, -1], [0, 1]];                 // up, down, left, right
const DIRS8 = [...DIRS4, [-1, -1], [-1, 1], [1, -1], [1, 1]];      // plus diagonals

// ---------- construction ----------
// Array.from runs the callback once per row -> every row is its own array.
// (new Array(rows).fill([]) would make every row the SAME array.)
function create(rows, cols, fill = 0) {
  return Array.from({ length: rows }, () => new Array(cols).fill(fill));
}

function clone(grid) {
  return grid.map((row) => row.slice());
}

// ---------- transpose / rotate ----------
function transpose(grid) {
  const rows = grid.length;
  const cols = rows === 0 ? 0 : grid[0].length;
  const result = create(cols, rows);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) result[c][r] = grid[r][c];
  }
  return result;
}

// clockwise: transpose, then reverse every row
function rotate90(grid) {
  return transpose(grid).map((row) => row.reverse());
}

// square matrices only; O(1) extra space
function rotate90InPlace(grid) {
  const n = grid.length;
  for (let r = 0; r < n; r++) {
    for (let c = r + 1; c < n; c++) {        // c > r so each pair is swapped once
      [grid[r][c], grid[c][r]] = [grid[c][r], grid[r][c]];
    }
  }
  for (const row of grid) row.reverse();
  return grid;
}

// ---------- spiral ----------
function spiralOrder(grid) {
  const result = [];
  if (grid.length === 0) return result;
  let top = 0;
  let bottom = grid.length - 1;
  let left = 0;
  let right = grid[0].length - 1;

  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) result.push(grid[top][c]);        // top row ->
    top++;
    for (let r = top; r <= bottom; r++) result.push(grid[r][right]);      // right col v
    right--;
    if (top <= bottom) {                                                  // guard: a single remaining row
      for (let c = right; c >= left; c--) result.push(grid[bottom][c]);   // bottom row <-
      bottom--;
    }
    if (left <= right) {                                                  // guard: a single remaining column
      for (let r = bottom; r >= top; r--) result.push(grid[r][left]);     // left col ^
      left++;
    }
  }
  return result;
}

// ---------- neighbours ----------
function inBounds(r, c, rows, cols) {
  return r >= 0 && r < rows && c >= 0 && c < cols;
}

function neighbors(dirs, r, c, rows, cols) {
  const result = [];
  for (const [dr, dc] of dirs) {
    const nr = r + dr;
    const nc = c + dc;
    if (inBounds(nr, nc, rows, cols)) result.push([nr, nc]);
  }
  return result;
}

function neighbors4(r, c, rows, cols) {
  return neighbors(DIRS4, r, c, rows, cols);
}

function neighbors8(r, c, rows, cols) {
  return neighbors(DIRS8, r, c, rows, cols);
}

// ---------- printing ----------
function printGrid(grid) {
  return grid.map((row) => row.map(String).join(' ')).join('\n');
}

// ---------- self-test ----------
const assert = require('assert');

// the shared-row trap, demonstrated
const trap = new Array(2).fill([]);
trap[0].push('x');
assert.strictEqual(trap[1].length, 1);          // both rows are the same array!
const safe = create(2, 2);
safe[0][0] = 9;
assert.strictEqual(safe[1][0], 0);              // rows independent

assert.deepStrictEqual(create(2, 3, 7), [[7, 7, 7], [7, 7, 7]]);
const original = [[1, 2], [3, 4]];
const copy = clone(original);
copy[0][0] = 99;
assert.strictEqual(original[0][0], 1);

assert.deepStrictEqual(transpose([[1, 2, 3], [4, 5, 6]]), [[1, 4], [2, 5], [3, 6]]);
assert.deepStrictEqual(transpose([]), []);
assert.deepStrictEqual(rotate90([[1, 2], [3, 4]]), [[3, 1], [4, 2]]);
assert.deepStrictEqual(rotate90([[1, 2, 3]]), [[1], [2], [3]]);
assert.deepStrictEqual(rotate90InPlace([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), [[7, 4, 1], [8, 5, 2], [9, 6, 3]]);
assert.deepStrictEqual(rotate90InPlace([[1]]), [[1]]);

assert.deepStrictEqual(spiralOrder([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), [1, 2, 3, 6, 9, 8, 7, 4, 5]);
assert.deepStrictEqual(spiralOrder([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]), [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]);
assert.deepStrictEqual(spiralOrder([[1, 2, 3]]), [1, 2, 3]);
assert.deepStrictEqual(spiralOrder([[1], [2], [3]]), [1, 2, 3]);
assert.deepStrictEqual(spiralOrder([]), []);

assert.strictEqual(inBounds(0, 0, 1, 1), true);
assert.strictEqual(inBounds(-1, 0, 3, 3), false);
assert.strictEqual(inBounds(0, 3, 3, 3), false);
assert.deepStrictEqual(neighbors4(0, 0, 3, 3), [[1, 0], [0, 1]]);
assert.deepStrictEqual(neighbors4(1, 1, 3, 3), [[0, 1], [2, 1], [1, 0], [1, 2]]);
assert.strictEqual(neighbors8(1, 1, 3, 3).length, 8);
assert.strictEqual(neighbors8(0, 0, 3, 3).length, 3);

assert.strictEqual(printGrid([[1, 2], [3, 4]]), '1 2\n3 4');

console.log('✓ matrix-utils.js self-test passed');

module.exports = {
  DIRS4, DIRS8, create, clone, transpose, rotate90, rotate90InPlace,
  spiralOrder, inBounds, neighbors4, neighbors8, printGrid,
};

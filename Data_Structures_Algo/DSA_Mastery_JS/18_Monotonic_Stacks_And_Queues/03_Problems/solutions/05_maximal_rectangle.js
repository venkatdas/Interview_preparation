/**
 * 05. Maximal Rectangle   (LeetCode 85 — Hard)
 *
 * PROBLEM
 * Given a binary matrix of '0' / '1' characters, return the area of the largest rectangle
 * containing only '1's.
 *
 * EXAMPLES
 * Input: [["1","0","1","0","0"],
 *         ["1","0","1","1","1"],
 *         ["1","1","1","1","1"],
 *         ["1","0","0","1","0"]]        Output: 6   (rows 1-2, columns 2-4)
 * Input: [["0"]]   Output: 0
 * Input: [["1"]]   Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Cells are the characters '0'/'1' (not numbers)
 * - rows, cols up to 200 -> O(rows * cols) ideal; O(rows^2 * cols) also passes
 *
 * APPROACH 1 — Brute force   O(rows^2 * cols^2) time
 * For every top-left and bottom-right corner, check that the rectangle is all ones using a
 * 2D prefix sum of ones (O(1) per check). Fine for tiny inputs only.
 *
 * APPROACH 2 — Optimal (Row-by-row histogram + Largest Rectangle in Histogram)   O(rows * cols)
 * For each row build heights[c] = number of consecutive '1's ending at this row in column c
 * (reset to 0 on a '0'). Every rectangle with its bottom edge on this row is a rectangle in
 * that histogram, so run the O(cols) monotonic-stack histogram solution per row.
 *
 * Dry run on the example:
 *   row 0 heights [1,0,1,0,0] -> best 1
 *   row 1 heights [2,0,2,1,1] -> best 3 (columns 2-4, height 1)
 *   row 2 heights [3,1,3,2,2] -> best 6 (columns 2-4, height 2)
 *   row 3 heights [4,0,0,3,0] -> best 4
 *   answer 6
 *
 * EDGE CASES
 * - empty matrix -> 0
 * - all zeros -> 0
 * - all ones -> rows * cols
 * - a single column
 */

function bruteForce(matrix) {
  const rows = matrix.length;
  if (rows === 0) return 0;
  const cols = matrix[0].length;
  // 2D prefix sum of ones
  const prefix = Array.from({ length: rows + 1 }, () => new Array(cols + 1).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      prefix[r + 1][c + 1] = prefix[r][c + 1] + prefix[r + 1][c] - prefix[r][c] + (matrix[r][c] === '1' ? 1 : 0);
    }
  }
  let best = 0;
  for (let r1 = 0; r1 < rows; r1++) {
    for (let c1 = 0; c1 < cols; c1++) {
      for (let r2 = r1; r2 < rows; r2++) {
        for (let c2 = c1; c2 < cols; c2++) {
          const ones = prefix[r2 + 1][c2 + 1] - prefix[r1][c2 + 1] - prefix[r2 + 1][c1] + prefix[r1][c1];
          const area = (r2 - r1 + 1) * (c2 - c1 + 1);
          if (ones === area) best = Math.max(best, area);
        }
      }
    }
  }
  return best;
}

function largestRectangleArea(heights) {
  const stack = [];
  let best = 0;
  for (let i = 0; i <= heights.length; i++) {
    const current = i === heights.length ? 0 : heights[i];
    while (stack.length && heights[stack[stack.length - 1]] >= current) {
      const height = heights[stack.pop()];
      const left = stack.length ? stack[stack.length - 1] : -1;
      best = Math.max(best, height * (i - left - 1));
    }
    stack.push(i);
  }
  return best;
}

function optimal(matrix) {
  if (matrix.length === 0) return 0;
  const cols = matrix[0].length;
  const heights = new Array(cols).fill(0);
  let best = 0;
  for (const row of matrix) {
    for (let c = 0; c < cols; c++) heights[c] = row[c] === '1' ? heights[c] + 1 : 0;
    best = Math.max(best, largestRectangleArea(heights));
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
const example = [
  ['1', '0', '1', '0', '0'],
  ['1', '0', '1', '1', '1'],
  ['1', '1', '1', '1', '1'],
  ['1', '0', '0', '1', '0'],
];
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(example), 6);
  assert.strictEqual(solve([['0']]), 0);
  assert.strictEqual(solve([['1']]), 1);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([['1', '1'], ['1', '1']]), 4);
  assert.strictEqual(solve([['1'], ['1'], ['0'], ['1']]), 2);
  assert.strictEqual(solve([['0', '0'], ['0', '0']]), 0);
}
for (let trial = 0; trial < 100; trial++) {
  const rows = 1 + Math.floor(Math.random() * 5);
  const cols = 1 + Math.floor(Math.random() * 5);
  const matrix = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => (Math.random() < 0.65 ? '1' : '0')));
  assert.strictEqual(optimal(matrix), bruteForce(matrix));
}
console.log('✓ 05-maximal-rectangle passed');

module.exports = { optimal, bruteForce };

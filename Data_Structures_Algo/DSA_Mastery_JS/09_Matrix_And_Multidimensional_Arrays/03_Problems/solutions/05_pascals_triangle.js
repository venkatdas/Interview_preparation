/**
 * 05. Pascal's Triangle   (LeetCode 118 — Easy)
 *
 * PROBLEM
 * Return the first numRows rows of Pascal's triangle. Each row starts and ends with 1, and
 * every other entry is the sum of the two entries directly above it.
 *
 * EXAMPLES
 * Input: 5   Output: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]
 * Input: 1   Output: [[1]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - numRows >= 1? (yes; handle 0 anyway -> [])
 * - Row values can get large (binomials); fine for numRows <= 30
 *
 * APPROACH 1 — Brute force (binomial formula)   O(n^2 * n) time
 * Entry (r, c) is C(r, c) = r! / (c! (r-c)!). Compute each with a loop. Works but risks
 * floating point error for big rows and recomputes a lot.
 *
 * APPROACH 2 — Optimal (build each row from the previous one)   O(n^2) time, O(n^2) output
 * Row r has r + 1 entries. row[0] = row[r] = 1, and row[c] = prev[c-1] + prev[c].
 * This is the "jagged 2D array" shape: rows of different lengths, each built from the last.
 *
 * Dry run for numRows = 4:
 *   [1]
 *   [1,1]
 *   [1, 1+1, 1] = [1,2,1]
 *   [1, 1+2, 2+1, 1] = [1,3,3,1]
 *
 * EDGE CASES
 * - numRows = 0 -> []
 * - numRows = 1 -> [[1]]
 */

function bruteForce(numRows) {
  function choose(n, k) {
    let result = 1;
    for (let i = 1; i <= k; i++) result = (result * (n - k + i)) / i; // stays an integer at each step
    return result;
  }
  const triangle = [];
  for (let r = 0; r < numRows; r++) {
    const row = [];
    for (let c = 0; c <= r; c++) row.push(choose(r, c));
    triangle.push(row);
  }
  return triangle;
}

function optimal(numRows) {
  const triangle = [];
  for (let r = 0; r < numRows; r++) {
    const row = new Array(r + 1).fill(1);        // ends are 1
    const prev = triangle[r - 1];
    for (let c = 1; c < r; c++) row[c] = prev[c - 1] + prev[c]; // inner cells from the row above
    triangle.push(row);
  }
  return triangle;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(5), [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]);
  assert.deepStrictEqual(solve(1), [[1]]);
  assert.deepStrictEqual(solve(0), []);
  assert.deepStrictEqual(solve(2), [[1], [1, 1]]);
  assert.deepStrictEqual(solve(6)[5], [1, 5, 10, 10, 5, 1]);
}
console.log('✓ 05-pascals-triangle passed');

module.exports = { optimal, bruteForce };

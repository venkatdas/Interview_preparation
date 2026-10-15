/**
 * 01. Pascal's Triangle   (LeetCode 118 — Easy)
 *
 * PROBLEM
 * Given numRows, return the first numRows rows of Pascal's triangle. Every row starts and
 * ends with 1, and every inner value is the sum of the two values just above it.
 *
 * EXAMPLES
 * Input: numRows = 5   Output: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]
 * Input: numRows = 1   Output: [[1]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= numRows <= 30 (values stay far below 2^53, plain numbers are fine)
 * - Should numRows = 0 return []? (we return [])
 *
 * APPROACH 1 — Brute force   O(n^2 * k) time, O(n^2) space
 * Compute every cell independently as C(r, c) with the multiplicative formula.
 * Each cell costs O(c) work, so the whole triangle is about O(n^3).
 *
 * APPROACH 2 — Optimal (Pascal's rule)   O(n^2) time, O(n^2) space (the output itself)
 * C(r, c) = C(r-1, c-1) + C(r-1, c). Build row r from row r-1 in one pass.
 * Why it is true: to pick c items from r, either you pick the last item (then pick c-1 from
 * the other r-1) or you don't (pick c from the other r-1).
 *
 * Dry run, numRows = 4:
 *   r=0  [1]
 *   r=1  [1,1]
 *   r=2  [1, 1+1, 1]          = [1,2,1]
 *   r=3  [1, 1+2, 2+1, 1]     = [1,3,3,1]
 *
 * EDGE CASES
 * - numRows = 0 -> []
 * - numRows = 1 -> [[1]]
 * - row 2 is the first with an inner cell
 */

function bruteForce(numRows) {
  const nCr = (n, k) => {
    let r = 1;
    for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; // each partial is an integer
    return Math.round(r);
  };
  const out = [];
  for (let r = 0; r < numRows; r++) {
    const row = [];
    for (let c = 0; c <= r; c++) row.push(nCr(r, c));
    out.push(row);
  }
  return out;
}

function optimal(numRows) {
  const rows = [];
  for (let r = 0; r < numRows; r++) {
    const row = new Array(r + 1).fill(1); // both ends are 1
    for (let c = 1; c < r; c++) row[c] = rows[r - 1][c - 1] + rows[r - 1][c];
    rows.push(row);
  }
  return rows;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(5), [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]);
  assert.deepStrictEqual(solve(1), [[1]]);
  assert.deepStrictEqual(solve(0), []);
  assert.deepStrictEqual(solve(2), [[1], [1, 1]]);
  assert.strictEqual(solve(30)[29][14], 77558760); // C(29,14)
  // every row sums to 2^r
  solve(20).forEach((row, r) => assert.strictEqual(row.reduce((a, b) => a + b, 0), 2 ** r));
}
function mulberry32(seed) {
  return function () {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(1);
for (let t = 0; t < 50; t++) {
  const n = Math.floor(rand() * 31);
  assert.deepStrictEqual(optimal(n), bruteForce(n));
}
console.log('✓ 01_pascals_triangle passed');

module.exports = { optimal, bruteForce };

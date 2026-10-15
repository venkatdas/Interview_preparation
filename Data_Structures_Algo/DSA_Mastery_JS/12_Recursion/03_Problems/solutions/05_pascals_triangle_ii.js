/**
 * 05. Pascal's Triangle II   (LeetCode 119 — Easy)
 *
 * PROBLEM
 * Return row number rowIndex (0-indexed) of Pascal's triangle. Each number is the sum of
 * the two numbers directly above it; every row starts and ends with 1.
 *
 * EXAMPLES
 * rowIndex = 0 -> [1]
 * rowIndex = 3 -> [1, 3, 3, 1]
 * rowIndex = 4 -> [1, 4, 6, 4, 1]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 0 <= rowIndex <= 33 (values fit in a Number)
 * - Follow-up: O(rowIndex) extra space
 *
 * APPROACH 1 — Brute force (cell-by-cell recursion)   O(2^k) time, O(k) stack
 * C(r, c) = C(r-1, c-1) + C(r-1, c), with C(r, 0) = C(r, r) = 1. Compute each cell of the
 * row independently. Lots of overlapping calls -> exponential. Good to SEE why memo helps.
 *
 * APPROACH 2 — Optimal (recursion on whole rows)   O(k^2) time, O(k) extra space
 * PROMISE: getRow(k) returns row k.
 *   base: getRow(0) = [1]
 *   step: prev = getRow(k - 1); row k is [1, prev[0]+prev[1], ..., prev[k-2]+prev[k-1], 1].
 * Each level does O(k) work, k levels -> O(k^2). Only one row is alive per stack frame
 * at the end of each call (we can even update prev in place from right to left).
 *
 * Dry run getRow(3):
 *   getRow(0) = [1]
 *   getRow(1) = [1, 1]
 *   getRow(2) = [1, 1+1, 1]        = [1, 2, 1]
 *   getRow(3) = [1, 1+2, 2+1, 1]   = [1, 3, 3, 1]
 *
 * EDGE CASES
 * - rowIndex = 0 -> [1];  rowIndex = 1 -> [1, 1]
 */

function bruteForce(rowIndex) {
  const C = (r, c) => (c === 0 || c === r ? 1 : C(r - 1, c - 1) + C(r - 1, c));
  return Array.from({ length: rowIndex + 1 }, (_, c) => C(rowIndex, c));
}

function optimal(rowIndex) {
  if (rowIndex === 0) return [1];
  const row = optimal(rowIndex - 1);       // trust: previous row is correct
  // update in place from the right so we never overwrite a value we still need
  row.push(1);
  for (let c = row.length - 2; c >= 1; c--) row[c] += row[c - 1];
  return row;
}

// ---------- tests ----------
const assert = require('assert');
assert.deepStrictEqual(optimal(0), [1]);
assert.deepStrictEqual(optimal(1), [1, 1]);
assert.deepStrictEqual(optimal(3), [1, 3, 3, 1]);
assert.deepStrictEqual(optimal(4), [1, 4, 6, 4, 1]);
assert.strictEqual(optimal(33)[16], 1166803110);
for (let k = 0; k <= 16; k++) assert.deepStrictEqual(optimal(k), bruteForce(k));
console.log('✓ 05_pascals_triangle_ii passed');

module.exports = { optimal, bruteForce };

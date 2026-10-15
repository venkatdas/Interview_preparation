/**
 * 02. Matrix Diagonal Sum   (LeetCode 1572 — Easy)
 *
 * PROBLEM
 * Given a square matrix, return the sum of the primary diagonal (top-left to bottom-right)
 * plus the secondary diagonal (top-right to bottom-left), counting the centre cell only once
 * when n is odd.
 *
 * EXAMPLES
 * Input: [[1,2,3],[4,5,6],[7,8,9]]   Output: 25   Explanation: 1+5+9 + 3+7 (5 counted once)
 * Input: [[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1]]   Output: 8
 * Input: [[5]]   Output: 5
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Always square? (yes)
 * - Odd n: centre once? (yes)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * Loop over every cell; add it if r === c or r + c === n - 1.
 *
 * APPROACH 2 — Optimal (walk the diagonals directly)   O(n) time, O(1) space
 * Row r has primary cell (r, r) and secondary cell (r, n - 1 - r). Add both; when they are
 * the same cell (r === n - 1 - r, only for odd n at the middle row), add once.
 *
 * Dry run on 3x3 [[1,2,3],[4,5,6],[7,8,9]]:
 *   r=0: (0,0)=1 + (0,2)=3 -> 4
 *   r=1: (1,1)=5 (same cell as (1,1)) -> 9
 *   r=2: (2,2)=9 + (2,0)=7 -> 25
 *
 * EDGE CASES
 * - 1x1 -> the single value
 * - 2x2 -> all four cells
 */

function bruteForce(mat) {
  const n = mat.length;
  let sum = 0;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (r === c || r + c === n - 1) sum += mat[r][c];
    }
  }
  return sum;
}

function optimal(mat) {
  const n = mat.length;
  let sum = 0;
  for (let r = 0; r < n; r++) {
    sum += mat[r][r];                              // primary
    if (r !== n - 1 - r) sum += mat[r][n - 1 - r]; // secondary, unless it is the same cell
  }
  return sum;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), 25);
  assert.strictEqual(solve([[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1]]), 8);
  assert.strictEqual(solve([[5]]), 5);
  assert.strictEqual(solve([[1, 2], [3, 4]]), 10);
  assert.strictEqual(solve([[-1, 0, 2], [0, 3, 0], [4, 0, -5]]), 3);
}
console.log('✓ 02-matrix-diagonal-sum passed');

module.exports = { optimal, bruteForce };

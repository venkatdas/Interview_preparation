/**
 * 14. Pacific Atlantic Water Flow   (LeetCode 417 — Medium)
 *
 * PROBLEM
 * heights[r][c] is the height of a cell. The Pacific ocean touches the top and left
 * edges, the Atlantic touches the bottom and right edges. Water flows from a cell to a
 * 4-neighbour if the neighbour's height is <= the current height. Return all cells from
 * which water can flow to BOTH oceans.
 *
 * EXAMPLES
 * Input: [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]
 * Output: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Equal heights flow? (yes, <=)
 * - Output order? (any)
 * - 1 x 1 grid? (that cell touches both oceans -> [[0,0]])
 *
 * APPROACH 1 — Brute force (DFS downhill from every cell)   O((m*n)^2) time
 * For each cell, DFS following "neighbour <= me" and record whether we touched the top/
 * left edge (Pacific) and the bottom/right edge (Atlantic). m*n starts, each O(m*n).
 *
 * APPROACH 2 — Optimal (reverse: DFS UPHILL from each ocean)   O(m*n) time, O(m*n) space
 * Flip the direction: start at the ocean cells and climb to neighbours with height >=
 * current. Everything reached from the Pacific border can drain to the Pacific; same for
 * the Atlantic. Answer = intersection of the two reachable sets. Two flood fills total.
 *
 * Dry run on [[1,2],[4,3]]:
 *   pacific starts: row 0 (1,2) and col 0 (1,4). climb: from 2 -> (1,1)=3 >= 2 yes.
 *     pacific = all 4 cells.
 *   atlantic starts: row 1 (4,3) and col 1 (2,3). climb: from 2 -> (0,0)=1? 1 >= 2 no.
 *     from 3 -> (0,1)=2 no; from 4 -> (0,0)=1 no.  atlantic = {(0,1),(1,0),(1,1)}
 *   both = [[0,1],[1,0],[1,1]]
 *
 * EDGE CASES
 * - empty grid -> []
 * - 1 x 1 -> [[0,0]]
 * - all equal heights -> every cell
 */

const { DIRS } = require('../../../23_Graphs/02_Implementations/graph');

function bruteForce(heights) {
  const rows = heights.length;
  if (!rows) return [];
  const cols = heights[0].length;
  const result = [];

  function canReach(sr, sc) {
    const visited = Array.from({ length: rows }, () => new Array(cols).fill(false));
    let pacific = false;
    let atlantic = false;
    const stack = [[sr, sc]];
    visited[sr][sc] = true;
    while (stack.length) {
      const [row, col] = stack.pop();
      if (row === 0 || col === 0) pacific = true;
      if (row === rows - 1 || col === cols - 1) atlantic = true;
      for (const [dr, dc] of DIRS) {
        const r = row + dr;
        const c = col + dc;
        if (r < 0 || c < 0 || r >= rows || c >= cols || visited[r][c]) continue;
        if (heights[r][c] > heights[row][col]) continue;   // water only flows downhill/flat
        visited[r][c] = true;
        stack.push([r, c]);
      }
    }
    return pacific && atlantic;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (canReach(r, c)) result.push([r, c]);
    }
  }
  return result;
}

function optimal(heights) {
  const rows = heights.length;
  if (!rows) return [];
  const cols = heights[0].length;
  const pacific = Array.from({ length: rows }, () => new Array(cols).fill(false));
  const atlantic = Array.from({ length: rows }, () => new Array(cols).fill(false));

  // climb UPHILL from (row, col) marking everything that can drain to this ocean
  function climb(row, col, reachable) {
    reachable[row][col] = true;
    for (const [dr, dc] of DIRS) {
      const r = row + dr;
      const c = col + dc;
      if (r < 0 || c < 0 || r >= rows || c >= cols || reachable[r][c]) continue;
      if (heights[r][c] < heights[row][col]) continue; // reversed condition: must be >=
      climb(r, c, reachable);
    }
  }

  for (let r = 0; r < rows; r++) {
    climb(r, 0, pacific);            // left edge
    climb(r, cols - 1, atlantic);    // right edge
  }
  for (let c = 0; c < cols; c++) {
    climb(0, c, pacific);            // top edge
    climb(rows - 1, c, atlantic);    // bottom edge
  }

  const result = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (pacific[r][c] && atlantic[r][c]) result.push([r, c]);
    }
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
const sample = [[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]];
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(sample), [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]]);
  assert.deepStrictEqual(solve([[1]]), [[0, 0]]);
  assert.deepStrictEqual(solve([]), []);
  assert.deepStrictEqual(solve([[1, 2], [4, 3]]), [[0, 1], [1, 0], [1, 1]]);
  assert.deepStrictEqual(solve([[2, 2], [2, 2]]), [[0, 0], [0, 1], [1, 0], [1, 1]]);
  assert.deepStrictEqual(solve([[1, 2, 3]]), [[0, 0], [0, 1], [0, 2]]); // 1-row: all touch both
}
console.log('✓ 14-pacific-atlantic-water-flow passed');

module.exports = { optimal, bruteForce };

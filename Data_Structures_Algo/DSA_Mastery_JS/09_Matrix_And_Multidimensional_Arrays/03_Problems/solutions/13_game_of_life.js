/**
 * 13. Game of Life   (LeetCode 289 — Medium)
 *
 * PROBLEM
 * Each cell is 1 (live) or 0 (dead). Compute the next generation, where every cell updates
 * SIMULTANEOUSLY based on its 8 neighbours in the current generation:
 *   - live cell with < 2 live neighbours dies
 *   - live cell with 2 or 3 live neighbours lives
 *   - live cell with > 3 live neighbours dies
 *   - dead cell with exactly 3 live neighbours becomes live
 * Follow-up: do it in place.
 *
 * EXAMPLES
 * Input: [[0,1,0],[0,0,1],[1,1,1],[0,0,0]]   Output: [[0,0,0],[1,0,1],[0,1,1],[0,1,0]]
 * Input: [[1,1],[1,0]]                       Output: [[1,1],[1,1]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Cells outside the board are dead? (yes)
 * - In place required? (follow-up; the extra-states trick does it)
 *
 * APPROACH 1 — Brute force (copy)   O(m n) time, O(m n) space
 * Copy the board, read neighbour counts from the copy, write into the original.
 * Simple and correct; just uses an extra grid.
 *
 * APPROACH 2 — Optimal (encode old and new state in the same cell)   O(m n) time, O(1) space
 * Use the bits of each cell: bit 0 = current state, bit 1 = next state.
 *   pass 1: for each cell count live neighbours using (cell & 1) - the ORIGINAL state, even
 *           if that neighbour was already marked. If it should be alive next, set bit 1 (|= 2).
 *   pass 2: every cell >>= 1, which drops the old state and keeps the new one.
 * Because the old state is never overwritten during pass 1, simultaneity is preserved.
 *
 * Dry run on [[1,1],[1,0]]:
 *   (0,0): 2 live nbrs, alive -> lives: 1|2=3. (0,1): 2 nbrs -> 3. (1,0): 2 nbrs -> 3.
 *   (1,1): nbrs (0,0)&1=1,(0,1)&1=1,(1,0)&1=1 = 3, dead -> born: 0|2=2
 *   shift: [[1,1],[1,1]]
 *
 * EDGE CASES
 * - all dead -> all dead
 * - 1x1 -> always dies (0 neighbours)
 * - border cells (fewer neighbours)
 */

const DIRS8 = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

function countLive(board, r, c, isLive) {
  let count = 0;
  for (const [dr, dc] of DIRS8) {
    const nr = r + dr, nc = c + dc;
    if (nr >= 0 && nr < board.length && nc >= 0 && nc < board[0].length && isLive(board[nr][nc])) count++;
  }
  return count;
}

function bruteForce(board) {
  const snapshot = board.map((row) => row.slice());
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[0].length; c++) {
      const live = countLive(snapshot, r, c, (v) => v === 1);
      if (snapshot[r][c] === 1) board[r][c] = live === 2 || live === 3 ? 1 : 0;
      else board[r][c] = live === 3 ? 1 : 0;
    }
  }
  return board;
}

function optimal(board) {
  const rows = board.length, cols = board[0].length;
  // pass 1: decide next state, store it in bit 1, keep current state in bit 0
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const live = countLive(board, r, c, (v) => (v & 1) === 1); // read ORIGINAL states
      const alive = (board[r][c] & 1) === 1;
      if ((alive && (live === 2 || live === 3)) || (!alive && live === 3)) board[r][c] |= 2;
    }
  }
  // pass 2: shift the next state down into bit 0
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) board[r][c] >>= 1;
  }
  return board;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([[0, 1, 0], [0, 0, 1], [1, 1, 1], [0, 0, 0]]), [[0, 0, 0], [1, 0, 1], [0, 1, 1], [0, 1, 0]]);
  assert.deepStrictEqual(solve([[1, 1], [1, 0]]), [[1, 1], [1, 1]]);
  assert.deepStrictEqual(solve([[0, 0], [0, 0]]), [[0, 0], [0, 0]]);
  assert.deepStrictEqual(solve([[1]]), [[0]]);
  // blinker oscillates
  assert.deepStrictEqual(solve([[0, 0, 0], [1, 1, 1], [0, 0, 0]]), [[0, 1, 0], [0, 1, 0], [0, 1, 0]]);
  assert.deepStrictEqual(solve([[0, 1, 0], [0, 1, 0], [0, 1, 0]]), [[0, 0, 0], [1, 1, 1], [0, 0, 0]]);
}
console.log('✓ 13-game-of-life passed');

module.exports = { optimal, bruteForce };

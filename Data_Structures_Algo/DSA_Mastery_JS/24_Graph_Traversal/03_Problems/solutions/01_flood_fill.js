/**
 * 01. Flood Fill   (LeetCode 733 — Easy)
 *
 * PROBLEM
 * You are given an image as a grid of integers (colours), a start cell (sr, sc) and a new
 * colour. Repaint the start cell and every cell connected to it (4-directionally) that has
 * the SAME colour as the start cell. Return the repainted image. This is the paint-bucket
 * tool in an image editor.
 *
 * EXAMPLES
 * Input: image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2
 * Output: [[2,2,2],[2,2,0],[2,0,1]]
 * Explanation: all 1s reachable from the centre become 2; the bottom-right 1 is not
 * connected (diagonals do not count), so it stays.
 *
 * Input: image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0   Output: unchanged
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can I modify the input in place? (usually yes)
 * - What if the new colour equals the old colour? (return as is - and this guard also
 *   prevents an infinite loop)
 * - Diagonals connected? (no, 4 directions only)
 *
 * APPROACH 1 — Brute force   O((m*n)^2) time, O(1) extra space
 * Repeat: scan the whole grid, repaint any old-colour cell that is adjacent to an
 * already-repainted cell. Stop when a full scan changes nothing. Each scan is O(m*n) and
 * in the worst case (a long snake) we need O(m*n) scans.
 *
 * APPROACH 2 — Optimal (DFS flood fill)   O(m*n) time, O(m*n) space (recursion)
 * The start cell is a node; same-colour neighbours are its edges. Run DFS:
 *   1. If out of bounds or the cell is not the old colour, stop.
 *   2. Repaint the cell (this IS the visited mark - repainted cells no longer match).
 *   3. Recurse into the 4 neighbours.
 *
 * Dry run on [[1,1,0],[1,0,0]], start (0,0), colour 2:
 *   fill(0,0): 1 -> 2        image = [[2,1,0],[1,0,0]]
 *     fill(1,0): 1 -> 2      image = [[2,1,0],[2,0,0]]
 *       fill(2,0) out, fill(0,0) is 2 != 1 stop, fill(1,1) is 0 stop, fill(1,-1) out
 *     fill(-1,0) out
 *     fill(0,1): 1 -> 2      image = [[2,2,0],[2,0,0]]
 *       neighbours: (1,1)=0 stop, (0,2)=0 stop, (0,0)=2 stop
 *     fill(0,-1) out
 *   done.
 *
 * EDGE CASES
 * - new colour === old colour -> return immediately (otherwise infinite recursion)
 * - 1 x 1 image
 * - start cell is isolated (no same-colour neighbours) -> only it changes
 */

const { DIRS } = require('../../../23_Graphs/02_Implementations/graph');

function bruteForce(image, sr, sc, color) {
  const rows = image.length;
  const cols = image[0].length;
  const oldColor = image[sr][sc];
  if (oldColor === color) return image;
  const painted = Array.from({ length: rows }, () => new Array(cols).fill(false));
  painted[sr][sc] = true;
  image[sr][sc] = color;
  let changed = true;
  while (changed) {
    changed = false;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (image[r][c] !== oldColor) continue;
        const touchesPainted = DIRS.some(([dr, dc]) => {
          const nr = r + dr;
          const nc = c + dc;
          return nr >= 0 && nc >= 0 && nr < rows && nc < cols && painted[nr][nc];
        });
        if (touchesPainted) {
          image[r][c] = color;
          painted[r][c] = true;
          changed = true;
        }
      }
    }
  }
  return image;
}

function optimal(image, sr, sc, color) {
  const rows = image.length;
  const cols = image[0].length;
  const oldColor = image[sr][sc];
  if (oldColor === color) return image; // nothing to do, and avoids infinite loop

  function fill(row, col) {
    if (row < 0 || col < 0 || row >= rows || col >= cols) return; // off the image
    if (image[row][col] !== oldColor) return;                      // different colour or done
    image[row][col] = color;                                        // paint = mark visited
    for (const [dr, dc] of DIRS) fill(row + dr, col + dc);
  }

  fill(sr, sc);
  return image;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(
    solve([[1, 1, 1], [1, 1, 0], [1, 0, 1]], 1, 1, 2),
    [[2, 2, 2], [2, 2, 0], [2, 0, 1]],
  );
  assert.deepStrictEqual(solve([[0, 0, 0], [0, 0, 0]], 0, 0, 0), [[0, 0, 0], [0, 0, 0]]);
  assert.deepStrictEqual(solve([[5]], 0, 0, 9), [[9]]);
  assert.deepStrictEqual(solve([[1, 0, 1]], 0, 0, 3), [[3, 0, 1]]);
  assert.deepStrictEqual(solve([[1, 1], [1, 1]], 1, 1, 7), [[7, 7], [7, 7]]);
}
console.log('✓ 01-flood-fill passed');

module.exports = { optimal, bruteForce };

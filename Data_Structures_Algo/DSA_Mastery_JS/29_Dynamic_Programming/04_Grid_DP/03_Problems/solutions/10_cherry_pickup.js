/**
 * 10. Cherry Pickup   (LeetCode 741 — Hard)
 *
 * PROBLEM
 * An n x n grid has cells: 0 = empty, 1 = a cherry, -1 = a thorn (blocked). Start at
 * (0, 0), walk to (n-1, n-1) moving only right or down, then walk back to (0, 0) moving
 * only left or up. You pick up every cherry you step on (a cell gives its cherry once).
 * Return the maximum number of cherries you can collect. If there is no valid round trip,
 * return 0.
 *
 * EXAMPLES
 * Input: [[0,1,-1],[1,0,-1],[1,1,1]]   Output: 5
 *   Explanation: go down, down, right, right (4 cherries), come back via the other side (1 more).
 * Input: [[1,1,-1],[1,-1,1],[-1,1,1]]  Output: 0   Explanation: no way to reach the corner
 * Input: [[1]]                         Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= n <= 50
 * - A cherry is counted once even if both trips cross that cell? (yes)
 * - Is (0, 0) or (n-1, n-1) ever a thorn? (possible -> answer 0)
 *
 * KEY IDEA: two walkers, one clock
 * Walking there and back is the same as TWO walkers both going from (0, 0) to (n-1, n-1)
 * at the same time. After t steps every walker satisfies row + col = t, so a walker is
 * fully described by (t, row). Two walkers -> state (t, row1, row2), with
 * col1 = t - row1 and col2 = t - row2. If both stand on the same cell, count it once.
 *
 * STATE
 *   dp[t][r1][r2] = max cherries collected by two walkers who have taken t steps and are
 *                   at rows r1 and r2 (columns t - r1 and t - r2), from here to the end
 * RECURRENCE
 *   each walker moves down (row + 1) or right (row stays), so 4 combinations:
 *   dp[t][r1][r2] = cherries(t, r1, r2) + max over (dr1, dr2) in {0,1}x{0,1}
 *                   of dp[t+1][r1+dr1][r2+dr2]
 *   cherries = grid[r1][c1] + grid[r2][c2], but counted once when r1 === r2
 * BASE CASES
 *   t = 2n - 2 (both at the corner) -> grid[n-1][n-1]
 *   any walker out of bounds or on a thorn -> -Infinity (invalid)
 * ANSWER
 *   max(0, dp[0][0][0])
 *
 * APPROACH 1 — Brute force recursion   O(4^(2n)) time, O(n) space
 * Explore all 4 joint moves at each step; no caching.
 *
 * APPROACH 2 — Memoization   O(n^3) time, O(n^3) space
 * States: t in [0, 2n-2], r1 and r2 in [0, n) -> about 2n * n * n = O(n^3).
 *
 * APPROACH 3 — Tabulation   O(n^3) time, O(n^2) space
 * Fill t from 2n-2 down to 0. Each layer t only needs layer t+1, so keep two n x n grids.
 *
 * Dry run on [[0,1,-1],[1,0,-1],[1,1,1]] (n = 3, last step t = 4):
 *   t=4: both at (2,2): 1 cherry.
 *   t=3: valid positions are (2,1) and (1,2); (1,2) is a thorn, so only (2,1).
 *        dp[3][2][2] = grid[2][1] (1, counted once) + dp[4][2][2] = 2
 *   t=2: positions (2,0), (1,1), (0,2 thorn). Both walkers must be able to step to (2,1):
 *        (2,0)->(2,1) right ok, (1,1)->(2,1) down ok.
 *        dp[2][2][1] = grid[2][0] + grid[1][1] + 2 = 1 + 0 + 2 = 3
 *        dp[2][2][2] = 1 + 2 = 3,  dp[2][1][1] = 0 + 2 = 2
 *   t=1: positions (1,0) and (0,1).
 *        dp[1][1][0] = grid[1][0] + grid[0][1] + max(dp[2][2][1], dp[2][1][1], dp[2][2][2]...)
 *                    = 1 + 1 + 3 = 5
 *   t=0: dp[0][0][0] = grid[0][0] + max(...) = 0 + 5 = 5  -> answer 5
 *
 * EDGE CASES
 * - start or goal is a thorn -> 0
 * - no path at all -> 0 (never return a negative number)
 * - 1x1 grid -> grid[0][0] if it is not a thorn
 */

function bruteForce(grid) {
  const n = grid.length;
  const lastStep = 2 * n - 2;
  function walk(t, r1, r2) {
    const c1 = t - r1, c2 = t - r2;
    if (r1 >= n || r2 >= n || c1 >= n || c2 >= n || c1 < 0 || c2 < 0) return -Infinity;
    if (grid[r1][c1] === -1 || grid[r2][c2] === -1) return -Infinity;
    if (t === lastStep) return grid[n - 1][n - 1];
    const here = r1 === r2 ? grid[r1][c1] : grid[r1][c1] + grid[r2][c2];
    const next = Math.max(
      walk(t + 1, r1, r2),         // both move right
      walk(t + 1, r1 + 1, r2),     // walker 1 down, walker 2 right
      walk(t + 1, r1, r2 + 1),     // walker 1 right, walker 2 down
      walk(t + 1, r1 + 1, r2 + 1), // both move down
    );
    return here + next;
  }
  return Math.max(0, walk(0, 0, 0));
}

function memo(grid) {
  const n = grid.length;
  const lastStep = 2 * n - 2;
  const cache = new Map();
  function walk(t, r1, r2) {
    const c1 = t - r1, c2 = t - r2;
    if (r1 >= n || r2 >= n || c1 >= n || c2 >= n || c1 < 0 || c2 < 0) return -Infinity;
    if (grid[r1][c1] === -1 || grid[r2][c2] === -1) return -Infinity;
    if (t === lastStep) return grid[n - 1][n - 1];
    const key = t * n * n + r1 * n + r2; // encode 3 small ints into one number
    if (cache.has(key)) return cache.get(key);
    const here = r1 === r2 ? grid[r1][c1] : grid[r1][c1] + grid[r2][c2];
    const next = Math.max(
      walk(t + 1, r1, r2),
      walk(t + 1, r1 + 1, r2),
      walk(t + 1, r1, r2 + 1),
      walk(t + 1, r1 + 1, r2 + 1),
    );
    cache.set(key, here + next);
    return here + next;
  }
  return Math.max(0, walk(0, 0, 0));
}

function tabulation(grid) {
  const n = grid.length;
  const lastStep = 2 * n - 2;
  // next[r1][r2] = best for step t+1; curr[r1][r2] = best for step t
  let next = Array.from({ length: n }, () => new Array(n).fill(-Infinity));
  if (grid[n - 1][n - 1] !== -1) next[n - 1][n - 1] = grid[n - 1][n - 1];

  for (let t = lastStep - 1; t >= 0; t--) {
    const curr = Array.from({ length: n }, () => new Array(n).fill(-Infinity));
    // rows a walker can be on at step t: max(0, t-n+1) .. min(n-1, t)
    const rowLow = Math.max(0, t - (n - 1));
    const rowHigh = Math.min(n - 1, t);
    for (let r1 = rowLow; r1 <= rowHigh; r1++) {
      for (let r2 = rowLow; r2 <= rowHigh; r2++) {
        const c1 = t - r1, c2 = t - r2;
        if (grid[r1][c1] === -1 || grid[r2][c2] === -1) continue;
        const here = r1 === r2 ? grid[r1][c1] : grid[r1][c1] + grid[r2][c2];
        let best = -Infinity;
        for (const dr1 of [0, 1]) {
          for (const dr2 of [0, 1]) {
            const nr1 = r1 + dr1, nr2 = r2 + dr2;
            if (nr1 < n && nr2 < n) best = Math.max(best, next[nr1][nr2]);
          }
        }
        if (best !== -Infinity) curr[r1][r2] = here + best;
      }
    }
    next = curr;
  }
  return Math.max(0, next[0][0]);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation]) {
  assert.strictEqual(solve([[0, 1, -1], [1, 0, -1], [1, 1, 1]]), 5);
  assert.strictEqual(solve([[1, 1, -1], [1, -1, 1], [-1, 1, 1]]), 0);
  assert.strictEqual(solve([[1]]), 1);
  assert.strictEqual(solve([[-1]]), 0);                       // start is a thorn
  assert.strictEqual(solve([[1, 1], [1, 1]]), 4);             // every cell once
  assert.strictEqual(solve([[1, 1], [1, -1]]), 0);            // goal is a thorn
  assert.strictEqual(solve([[1, 1, 1], [1, 1, 1], [1, 1, 1]]), 8); // 9 cells, two paths share 2 corners: 5 + 3 = 8
  assert.strictEqual(solve([[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]), 0);
}
console.log('✓ 10-cherry-pickup passed');

module.exports = { bruteForce, memo, tabulation };

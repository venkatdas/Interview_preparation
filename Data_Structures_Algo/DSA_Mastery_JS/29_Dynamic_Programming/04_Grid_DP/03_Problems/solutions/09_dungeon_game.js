/**
 * 09. Dungeon Game   (LeetCode 174 — Hard)
 *
 * PROBLEM
 * A knight starts at the top-left room of a dungeon and must reach the princess in the
 * bottom-right room, moving only right or down. Each room has a number: negative = demon
 * (lose health), positive = potion (gain health). The knight's health must stay >= 1 at
 * ALL times (entering a room with health 0 or less means death). Return the minimum
 * initial health needed to rescue the princess.
 *
 * EXAMPLES
 * Input: [[-2,-3,3],[-5,-10,1],[10,30,-5]]   Output: 7
 *   Explanation: path right -> right -> down -> down with 7 health:
 *   7-2=5, 5-3=2, 2+3=5, 5+1=6, 6-5=1 (never below 1).
 * Input: [[0]]                               Output: 1
 * Input: [[100]]                             Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= m, n <= 200, values in -1000 .. 1000
 * - Does the starting room's value apply? (yes, the knight enters it)
 * - Health must be >= 1 even after the last room? (yes)
 *
 * WHY FORWARD DP FAILS
 * The "best" forward path (max health so far) may walk into a huge demon later. What you
 * need at a cell depends on the FUTURE, so we define the state "from here to the goal" and
 * fill the table backwards from the princess.
 *
 * STATE
 *   dp[i][j] = minimum health needed when ENTERING room (i, j) so that you can still
 *              reach the princess alive
 * RECURRENCE
 *   needAfter  = min(dp[i+1][j], dp[i][j+1])     (health required when leaving this room)
 *   dp[i][j]   = max(1, needAfter - dungeon[i][j])
 *   "max(1, ...)" because a big potion cannot push the requirement below 1.
 * BASE CASES
 *   dp[m-1][n-1] = max(1, 1 - dungeon[m-1][n-1])    (must leave the goal room with >= 1)
 *   out-of-grid cells = Infinity (not a valid way out)
 * ANSWER
 *   dp[0][0]
 *
 * APPROACH 1 — Brute force recursion   O(2^(m+n)) time, O(m+n) space
 * need(i, j) = max(1, min(need(i+1, j), need(i, j+1)) - dungeon[i][j]).
 *
 * APPROACH 2 — Memoization   O(m*n) time, O(m*n) space
 * APPROACH 3 — Tabulation (bottom-right to top-left)   O(m*n) time, O(m*n) space
 *
 * Dry run on [[-2,-3,3],[-5,-10,1],[10,30,-5]]:
 *   dp[2][2] = max(1, 1 - (-5)) = 6
 *   dp[2][1] = max(1, 6 - 30) = 1        dp[1][2] = max(1, 6 - 1) = 5
 *   dp[2][0] = max(1, 1 - 10) = 1        dp[1][1] = max(1, min(5,1) - (-10)) = 11
 *   dp[0][2] = max(1, 5 - 3) = 2         dp[1][0] = max(1, min(11,1) - (-5)) = 6
 *   dp[0][1] = max(1, min(2,11) - (-3)) = 5
 *   dp[0][0] = max(1, min(5,6) - (-2)) = 7   -> answer 7
 *
 *   dp table:    7  5  2
 *                6 11  5
 *                1  1  6
 *
 * APPROACH 4 — One row   O(m*n) time, O(n) space
 * Process rows bottom to top, columns right to left. row[j] holds "below", row[j+1] holds
 * "right" (already updated in this pass).
 *
 * EDGE CASES
 * - all potions -> 1
 * - 1x1 with a demon -> 1 - value
 * - the goal room is a potion -> still need at least 1
 */

function bruteForce(dungeon) {
  const rows = dungeon.length, cols = dungeon[0].length;
  function need(i, j) {
    if (i >= rows || j >= cols) return Infinity; // fell off the map
    const needAfter = (i === rows - 1 && j === cols - 1)
      ? 1
      : Math.min(need(i + 1, j), need(i, j + 1));
    return Math.max(1, needAfter - dungeon[i][j]);
  }
  return need(0, 0);
}

function memo(dungeon) {
  const rows = dungeon.length, cols = dungeon[0].length;
  const cache = Array.from({ length: rows }, () => new Array(cols).fill(null));
  function need(i, j) {
    if (i >= rows || j >= cols) return Infinity;
    if (cache[i][j] !== null) return cache[i][j];
    const needAfter = (i === rows - 1 && j === cols - 1)
      ? 1
      : Math.min(need(i + 1, j), need(i, j + 1));
    cache[i][j] = Math.max(1, needAfter - dungeon[i][j]);
    return cache[i][j];
  }
  return need(0, 0);
}

function tabulation(dungeon) {
  const rows = dungeon.length, cols = dungeon[0].length;
  // one extra row and column of Infinity acts as the "out of grid" guard
  const dp = Array.from({ length: rows + 1 }, () => new Array(cols + 1).fill(Infinity));
  dp[rows][cols - 1] = 1; // leaving the goal room you need health 1
  dp[rows - 1][cols] = 1;
  for (let i = rows - 1; i >= 0; i--) {
    for (let j = cols - 1; j >= 0; j--) {
      const needAfter = Math.min(dp[i + 1][j], dp[i][j + 1]);
      dp[i][j] = Math.max(1, needAfter - dungeon[i][j]);
    }
  }
  return dp[0][0];
}

function optimized(dungeon) {
  const rows = dungeon.length, cols = dungeon[0].length;
  const row = new Array(cols + 1).fill(Infinity); // row[j] = "below", row[j+1] = "right"
  row[cols - 1] = 1; // pretend there is a cell below the goal needing 1
  for (let i = rows - 1; i >= 0; i--) {
    for (let j = cols - 1; j >= 0; j--) {
      const needAfter = Math.min(row[j], row[j + 1]);
      row[j] = Math.max(1, needAfter - dungeon[i][j]);
    }
  }
  return row[0];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve([[-2, -3, 3], [-5, -10, 1], [10, 30, -5]]), 7);
  assert.strictEqual(solve([[0]]), 1);
  assert.strictEqual(solve([[100]]), 1);
  assert.strictEqual(solve([[-10]]), 11);
  assert.strictEqual(solve([[1, -3, 3], [0, -2, 0], [-3, -3, -3]]), 3);
  assert.strictEqual(solve([[-1, -2, -3]]), 7);          // single row: 1 + 6
  assert.strictEqual(solve([[5], [-20], [10]]), 16);     // single column: 16+5=21, 21-20=1, ok
  assert.strictEqual(solve([[2, 2], [2, 2]]), 1);        // all potions
}
console.log('✓ 09-dungeon-game passed');

module.exports = { bruteForce, memo, tabulation, optimized };

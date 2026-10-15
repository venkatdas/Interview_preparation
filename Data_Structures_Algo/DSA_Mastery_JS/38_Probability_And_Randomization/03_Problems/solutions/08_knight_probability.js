/**
 * 08. Knight Probability in Chessboard   (LeetCode 688 — Medium)
 *
 * PROBLEM
 * A knight starts at (row, column) on an n x n board and makes exactly k moves.
 * Each move picks one of the 8 knight moves uniformly at random, even if it
 * leaves the board. Once off the board the knight stays off. Return the
 * probability that the knight is still on the board after k moves.
 *
 * EXAMPLES
 * n = 3, k = 2, row = 0, column = 0  -> 0.0625
 *   From (0,0) only 2 of 8 moves stay on board; from each of those, 2 of 8 again.
 *   (2/8) * (2/8) = 1/16 = 0.0625
 * n = 1, k = 0, row = 0, column = 0  -> 1   (no moves, still on board)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 25, k up to 100 -> 8^k paths is impossible, DP over (step, cell) is 100*625*8
 * - Exact answer or approximate? (exact, up to floating point; 1e-5 tolerance)
 *
 * APPROACH 1 — Brute force (recurse over every path)   O(8^k) time, O(k) stack
 * prob(r, c, k) = average over 8 moves of prob(next, k-1); off-board -> 0; k = 0 -> 1.
 * Same (r, c, k) recomputed exponentially often.
 *
 * APPROACH 2 — Optimal (probability DP, forward)   O(k * n^2 * 8) time, O(n^2) space
 * dp[r][c] = probability the knight is at (r, c) after the current number of moves.
 * Start: dp[row][column] = 1. Each step, every cell sends dp[r][c] / 8 to each of
 * its 8 targets that are ON the board (mass sent off-board simply disappears).
 * Answer = sum of dp after k steps. Linearity of probability makes this exact.
 *
 * Dry run on n=3, k=2, start (0,0):
 *   step 0: dp[0][0] = 1
 *   step 1: on-board targets (1,2), (2,1) get 1/8 each           total 0.25
 *   step 2: (1,2) -> (0,0), (2,0) get 1/64 each;
 *           (2,1) -> (0,0), (0,2) get 1/64 each                   total 4/64 = 0.0625
 *
 * EDGE CASES
 * - k = 0 -> 1
 * - n = 1 or 2 -> every move goes off board -> 0 for k >= 1
 * - large k -> probabilities get tiny but never negative; doubles handle it
 */
const { mulberry32 } = require('../../02_Implementations/randomization');

const MOVES = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];

function bruteForce(n, k, row, column) {
  if (row < 0 || row >= n || column < 0 || column >= n) return 0;
  if (k === 0) return 1;
  let sum = 0;
  for (const [dr, dc] of MOVES) sum += bruteForce(n, k - 1, row + dr, column + dc);
  return sum / 8;
}

function optimal(n, k, row, column) {
  let dp = Array.from({ length: n }, () => new Array(n).fill(0));
  dp[row][column] = 1;
  for (let step = 0; step < k; step++) {
    const next = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (dp[r][c] === 0) continue;
        const share = dp[r][c] / 8;
        for (const [dr, dc] of MOVES) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < n && nc >= 0 && nc < n) next[nr][nc] += share;
        }
      }
    }
    dp = next;
  }
  let total = 0;
  for (const line of dp) for (const p of line) total += p;
  return total;
}

/** Monte Carlo estimate — only for comparison/teaching. */
function simulate(n, k, row, column, trials, rng = Math.random) {
  let onBoard = 0;
  for (let t = 0; t < trials; t++) {
    let r = row;
    let c = column;
    let alive = true;
    for (let s = 0; s < k && alive; s++) {
      const [dr, dc] = MOVES[Math.floor(rng() * 8)];
      r += dr;
      c += dc;
      alive = r >= 0 && r < n && c >= 0 && c < n;
    }
    if (alive) onBoard++;
  }
  return onBoard / trials;
}

// ---------- tests ----------
const assert = require('assert');
const close = (a, b, eps = 1e-9) => Math.abs(a - b) <= eps;
for (const solve of [bruteForce, optimal]) {
  assert.ok(close(solve(3, 2, 0, 0), 0.0625));
  assert.ok(close(solve(1, 0, 0, 0), 1));
  assert.ok(close(solve(2, 1, 0, 0), 0));
  assert.ok(close(solve(8, 1, 3, 3), 1)); // all 8 moves from a central square stay on
  assert.ok(close(solve(8, 1, 0, 0), 0.25));
}
const rng = mulberry32(688);
for (let t = 0; t < 100; t++) {
  const n = 1 + Math.floor(rng() * 6);
  const k = Math.floor(rng() * 5);
  const r = Math.floor(rng() * n);
  const c = Math.floor(rng() * n);
  assert.ok(close(optimal(n, k, r, c), bruteForce(n, k, r, c)));
}
// Monte Carlo agrees within a wide band (sd ~ 0.0016 at 100k trials)
const exact = optimal(8, 4, 2, 2);
assert.ok(Math.abs(simulate(8, 4, 2, 2, 100000, rng) - exact) < 0.02);
assert.ok(optimal(25, 100, 12, 12) >= 0); // big case finishes fast
console.log('✓ 08_knight_probability passed');

module.exports = { optimal, bruteForce, simulate };

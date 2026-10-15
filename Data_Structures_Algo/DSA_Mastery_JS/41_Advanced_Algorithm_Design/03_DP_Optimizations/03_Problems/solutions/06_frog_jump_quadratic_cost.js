/**
 * 06. Frog Jump with Quadratic Cost   (Original — Hard)
 *
 * PROBLEM
 * Stones stand at strictly increasing positions x[0] < x[1] < ... < x[n-1]. A frog starts
 * on stone 0 and must reach stone n-1, always jumping forward, and it may skip any number
 * of stones. A jump from stone i to stone j costs (x[j] - x[i])^2 + C, where C >= 0 is a
 * fixed "take-off" cost. Return the minimum total cost.
 * (The square punishes long jumps; C punishes many small jumps - the answer balances them.)
 *
 * EXAMPLES
 * x = [1,2,3,4,5], C = 6   -> 20   (1 -> 3 -> 5: (4+6) + (4+6))
 * x = [0,1,5,6],   C = 1   -> 21   (every stone: 2 + 17 + 2)
 * x = [0,3,4,6],   C = 3   -> 23   (0 -> 3 -> 4 -> 6: 12 + 4 + 7)
 * x = [0,10],      C = 100 -> 200
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= n <= 2e5, 0 <= x[i] <= 1e5 strictly increasing, 0 <= C <= 1e9.
 *   (dp <= (1e5)^2 + 1e9, and the hull's cross products stay below 2^53.)
 * - n = 1 -> 0 (already on the last stone).
 *
 * APPROACH 1 — Brute force DP   O(n^2) time, O(n) space
 * dp[j] = min over i < j of dp[i] + (x[j] - x[i])^2 + C.
 *
 * APPROACH 2 — Optimal (convex hull trick)   O(n) time, O(n) space
 * Expand the square:
 *   dp[i] + x[j]^2 - 2·x[i]·x[j] + x[i]^2 + C
 *   = x[j]^2 + C + ( m_i · x[j] + b_i )   with   m_i = -2·x[i],  b_i = dp[i] + x[i]^2.
 * So dp[j] = x[j]^2 + C + min over LINES (m_i, b_i) evaluated at the point x[j].
 *   - slopes -2·x[i] are strictly DECREASING as i grows (x increases)
 *   - query points x[j] are INCREASING
 * -> keep the lower envelope in a deque, pointer only moves right: amortized O(1) each.
 * Remove the middle of three lines l1, l2, l3 when l1 and l3 already cover it:
 *   (b3 - b1)(m1 - m2) <= (b2 - b1)(m1 - m3).
 * If positions were NOT sorted, a Li Chao tree would give O(n log X) instead.
 *
 * Dry run on x = [1,2,3,4,5], C = 6:
 *   j | lines in hull (m,b)          | best line value at x[j] | dp[j]
 *   0 | -                            | -                       | 0      add (-2, 1)
 *   1 | (-2,1)                       | -4+1 = -3               | 4-3+6 = 7     add (-4, 11)
 *   2 | (-2,1)(-4,11)                | min(-5, -1) = -5        | 9-5+6 = 10    add (-6, 19)
 *   3 | (-2,1)(-6,19) ((-4,11) cut)  | min(-7, -5) = -7        | 16-7+6 = 15   add (-8, 31)
 *   4 | (-2,1)(-6,19)(-8,31)         | min(-9, -11, -9) = -11  | 25-11+6 = 20
 *   answer 20
 *
 * EDGE CASES
 * - n = 1 -> 0;  n = 2 -> one forced jump
 * - C = 0 -> stepping on every stone is optimal (sum of squares is minimised by small steps)
 * - huge C -> jump directly
 */

function bruteForce(x, C) {
  const n = x.length;
  const dp = new Array(n).fill(Infinity);
  dp[0] = 0;
  for (let j = 1; j < n; j++) {
    for (let i = 0; i < j; i++) dp[j] = Math.min(dp[j], dp[i] + (x[j] - x[i]) ** 2 + C);
  }
  return dp[n - 1];
}

function optimal(x, C) {
  const n = x.length;
  const M = new Array(n); // hull slopes
  const B = new Array(n); // hull intercepts
  let head = 0;
  let tail = 0;
  const value = (idx, at) => M[idx] * at + B[idx];
  const addLine = (m, b) => {
    // slopes strictly decrease, so no parallel case here
    while (tail - head >= 2) {
      const m1 = M[tail - 2], b1 = B[tail - 2], m2 = M[tail - 1], b2 = B[tail - 1];
      if ((b - b1) * (m1 - m2) <= (b2 - b1) * (m1 - m)) tail--; else break;
    }
    M[tail] = m;
    B[tail] = b;
    tail++;
  };
  let dp = 0;
  addLine(-2 * x[0], 0 + x[0] * x[0]);
  for (let j = 1; j < n; j++) {
    // queries increase -> lines at the front that stopped being best never win again
    while (tail - head >= 2 && value(head + 1, x[j]) <= value(head, x[j])) head++;
    dp = x[j] * x[j] + C + value(head, x[j]);
    addLine(-2 * x[j], dp + x[j] * x[j]);
  }
  return dp;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 2, 3, 4, 5], 6), 20);
  assert.strictEqual(solve([0, 1, 5, 6], 1), 21);
  assert.strictEqual(solve([0, 3, 4, 6], 3), 23);
  assert.strictEqual(solve([0, 10], 100), 200);
  assert.strictEqual(solve([42], 7), 0);                    // n = 1
  assert.strictEqual(solve([0, 1, 2, 3], 0), 3);             // C = 0 -> every stone
  assert.strictEqual(solve([0, 1, 2, 3], 1000), 1009);       // huge C -> direct jump
}

function mulberry32(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(6);
for (let t = 0; t < 400; t++) {
  const n = 1 + Math.floor(rand() * 40);
  const x = [];
  let cur = Math.floor(rand() * 5);
  for (let i = 0; i < n; i++) { x.push(cur); cur += 1 + Math.floor(rand() * 10); }
  const C = Math.floor(rand() * 200);
  assert.strictEqual(optimal(x, C), bruteForce(x, C));
}
console.log('✓ 06_frog_jump_quadratic_cost passed');

module.exports = { optimal, bruteForce };

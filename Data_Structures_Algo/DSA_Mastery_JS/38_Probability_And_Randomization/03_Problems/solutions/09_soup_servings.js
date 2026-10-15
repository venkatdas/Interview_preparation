/**
 * 09. Soup Servings   (LeetCode 808 — Medium, tricky)
 *
 * PROBLEM
 * Two soups A and B each start with n ml. Each turn, one of four operations
 * happens with probability 1/4:
 *   serve (100 A, 0 B), (75 A, 25 B), (50 A, 50 B), (25 A, 75 B)
 * If a soup has less than requested, serve what is left. Stop as soon as at
 * least one soup is empty. Return
 *   P(A empties first) + 0.5 * P(A and B empty at the same time).
 * Answers within 1e-5 of the truth are accepted.
 *
 * EXAMPLES
 * n = 50  -> 0.625
 *   op1, op2, op3 empty A (op3 empties both at once), op4 empties B first:
 *   1/4 + 1/4 + 0.5 * 1/4 + 0 = 0.625
 * n = 100 -> 0.71875
 * n = 0   -> 0.5   (both already empty "at the same time")
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 1e9 -> we cannot build a DP that big. Need an insight.
 * - Tolerance 1e-5 -> an approximate shortcut is allowed.
 *
 * APPROACH 1 — Brute force (plain recursion)   O(4^(n/25)) time
 * f(a, b): if a<=0 && b<=0 -> 0.5; if a<=0 -> 1; if b<=0 -> 0;
 *          else 0.25 * (f(a-4,b) + f(a-3,b-1) + f(a-2,b-2) + f(a-1,b-3)),
 * in units of 25 ml (all servings are multiples of 25, so m = ceil(n / 25)).
 *
 * APPROACH 2 — Optimal (memoized DP + convergence cutoff)   O(min(m, C)^2) time and space
 * 1) Memoize f(a, b) on the grid of 25 ml units -> O(m^2) states.
 * 2) On average A loses 2.5 units per turn and B loses 1.5, so A is strongly
 *    favoured to empty first, and f(m, m) increases toward 1 as m grows.
 *    Once m reaches 200 (n > 4975), the answer is within 1e-5 of 1, so return 1.
 *    That is the "expectation drift" insight: compute expected change per step first.
 *
 * Dry run, n = 50 -> m = 2, f(2,2):
 *   op1 f(-2,2) = 1    op2 f(-1,1) = 1    op3 f(0,0) = 0.5    op4 f(1,-1) = 0
 *   0.25 * (1 + 1 + 0.5 + 0) = 0.625
 *
 * EDGE CASES
 * - n = 0 -> 0.5
 * - n not a multiple of 25 -> round UP (a partial serving still empties the soup)
 * - huge n -> return 1 immediately (do not allocate a giant memo)
 */
const { mulberry32 } = require('../../02_Implementations/randomization');

const OPS = [[4, 0], [3, 1], [2, 2], [1, 3]];

function bruteForce(n) {
  const m = Math.ceil(n / 25);
  const f = (a, b) => {
    if (a <= 0 && b <= 0) return 0.5;
    if (a <= 0) return 1;
    if (b <= 0) return 0;
    let s = 0;
    for (const [da, db] of OPS) s += f(a - da, b - db);
    return s / 4;
  };
  return f(m, m);
}

function optimal(n) {
  const m = Math.ceil(n / 25);
  if (m >= 200) return 1; // f(m, m) > 1 - 1e-5 from here on (verified in the tests)
  const memo = new Map();
  const f = (a, b) => {
    if (a <= 0 && b <= 0) return 0.5;
    if (a <= 0) return 1;
    if (b <= 0) return 0;
    const key = a * 1000 + b;
    if (memo.has(key)) return memo.get(key);
    let s = 0;
    for (const [da, db] of OPS) s += f(a - da, b - db);
    const res = s / 4;
    memo.set(key, res);
    return res;
  };
  return f(m, m);
}

/** Exact DP without the cutoff (used to justify the cutoff). */
function exactNoCutoff(n) {
  const m = Math.ceil(n / 25);
  const memo = new Map();
  const f = (a, b) => {
    if (a <= 0 && b <= 0) return 0.5;
    if (a <= 0) return 1;
    if (b <= 0) return 0;
    const key = a * 100000 + b;
    if (memo.has(key)) return memo.get(key);
    let s = 0;
    for (const [da, db] of OPS) s += f(a - da, b - db);
    memo.set(key, s / 4);
    return s / 4;
  };
  return f(m, m);
}

/** Monte Carlo version — fine for intuition, too noisy for 1e-5. */
function simulate(n, trials, rng = Math.random) {
  let score = 0;
  for (let t = 0; t < trials; t++) {
    let a = n;
    let b = n;
    while (a > 0 && b > 0) {
      const [da, db] = OPS[Math.floor(rng() * 4)];
      a -= da * 25;
      b -= db * 25;
    }
    if (a <= 0 && b <= 0) score += 0.5;
    else if (a <= 0) score += 1;
  }
  return score / trials;
}

// ---------- tests ----------
const assert = require('assert');
const close = (a, b, eps = 1e-9) => Math.abs(a - b) <= eps;
for (const solve of [bruteForce, optimal]) {
  assert.ok(close(solve(0), 0.5));
  assert.ok(close(solve(50), 0.625));
  assert.ok(close(solve(100), 0.71875));
  assert.ok(close(solve(1), solve(25))); // rounds up to one unit
  assert.ok(close(solve(26), solve(50)));
}
for (let n = 0; n <= 300; n += 7) assert.ok(close(optimal(n), bruteForce(n)));
// justify the cutoff: at m = 200 the exact value is already within 1e-5 of 1
assert.ok(1 - exactNoCutoff(200 * 25) < 1e-5);
assert.strictEqual(optimal(1e9), 1);
const rng = mulberry32(808);
assert.ok(Math.abs(simulate(100, 100000, rng) - 0.71875) < 0.01);
console.log('✓ 09_soup_servings passed');

module.exports = { optimal, bruteForce, simulate, exactNoCutoff };

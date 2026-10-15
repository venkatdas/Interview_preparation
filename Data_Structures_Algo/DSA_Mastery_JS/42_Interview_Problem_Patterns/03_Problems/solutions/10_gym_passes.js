/**
 * 10. Gym Passes   (Original — Hard)
 *
 * PROBLEM
 * You plan to visit a climbing gym on certain days: `days` is sorted ascending with distinct
 * positive integers. The gym sells passes: passes[k] = [duration, price]. A pass bought on day x
 * is valid on days x, x+1, ..., x+duration-1. You may buy any number of passes of any type.
 * Return the minimum total price to cover every planned day.
 *
 * EXAMPLES
 * days = [1, 2, 3, 10], passes = [[1, 4], [3, 9]]           -> 13   (3-day pass on day 1, 1-day on day 10)
 * days = [1, 5, 9], passes = [[1, 4], [7, 10]]              -> 12   (three 1-day passes)
 * days = [1, 2, 3, 4, 5, 6, 7], passes = [[1, 4], [7, 10]]  -> 10
 * days = []                                                  -> 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 0 <= days.length <= 10^5, 1 <= days[i] <= 10^9 (so no array indexed by calendar day!),
 *   1 <= passes.length <= 10, 1 <= duration <= 10^9, 1 <= price <= 10^6.
 * - Is it ever useful to start a pass on a day we do not visit? No: shifting its start to the
 *   next planned day covers at least the same planned days.
 *
 * PATTERN: dynamic programming (linear DP over the planned days) with a pointer / binary search
 * for "first day not covered". Clues: "minimum total cost", choices overlap (many ways to cover
 * the same suffix), greedy fails (cheapest-per-day pass is not always best).
 *
 * APPROACH 1 — Brute force   exponential time
 * cover(i) = cheapest way to cover days[i..]: try every pass starting on days[i], jump to the
 * first uncovered day, recurse. No memo -> the same suffix is solved again and again.
 *
 * APPROACH 2 — Optimal (DP over suffixes)   O(n * p * log n) time, O(n) space
 * dp[i] = minimum cost to cover days[i..n-1]; dp[n] = 0.
 * dp[i] = min over passes (dur, price) of price + dp[j], where j = first index with
 *         days[j] >= days[i] + dur (binary search, lowerBound).
 * Fill i from n-1 down to 0. Answer dp[0].
 *
 * Dry run on days [1,2,3,10], passes [[1,4],[3,9]]:
 *   dp[4] = 0
 *   dp[3] (day 10): 1-day -> 4 + dp[4] = 4;   3-day -> 9 + dp[4] = 9      -> 4
 *   dp[2] (day 3):  1-day -> 4 + dp[3] = 8;   3-day (covers 3..5) -> 9 + dp[3] = 13 -> 8
 *   dp[1] (day 2):  1-day -> 4 + dp[2] = 12;  3-day (2..4) -> 9 + dp[3] = 13 -> 12
 *   dp[0] (day 1):  1-day -> 4 + dp[1] = 16;  3-day (1..3) -> 9 + dp[3] = 13 -> 13
 *
 * EDGE CASES
 * - no days -> 0;  one pass type;  a long cheap pass dominates everything;  huge day numbers.
 */

function firstIndexAtLeast(days, value, from) {
  let lo = from;
  let hi = days.length;
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (days[mid] < value) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function bruteForce(days, passes) {
  function cover(i) {
    if (i >= days.length) return 0;
    let best = Infinity;
    for (const [dur, price] of passes) {
      let j = i;
      while (j < days.length && days[j] < days[i] + dur) j++;
      best = Math.min(best, price + cover(j));
    }
    return best;
  }
  return cover(0);
}

function optimal(days, passes) {
  const n = days.length;
  const dp = new Array(n + 1).fill(Infinity);
  dp[n] = 0;
  for (let i = n - 1; i >= 0; i--) {
    for (const [dur, price] of passes) {
      const j = firstIndexAtLeast(days, days[i] + dur, i + 1);
      dp[i] = Math.min(dp[i], price + dp[j]);
    }
  }
  return dp[0];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 2, 3, 10], [[1, 4], [3, 9]]), 13);
  assert.strictEqual(solve([1, 5, 9], [[1, 4], [7, 10]]), 12);
  assert.strictEqual(solve([1, 2, 3, 4, 5, 6, 7], [[1, 4], [7, 10]]), 10);
  assert.strictEqual(solve([], [[1, 4]]), 0);
  assert.strictEqual(solve([1000000000], [[1, 3], [30, 2]]), 2);
}
function mulberry32(seed) {
  return function rand() {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(10);
for (let t = 0; t < 200; t++) {
  const set = new Set(Array.from({ length: Math.floor(rand() * 10) }, () => 1 + Math.floor(rand() * 30)));
  const days = [...set].sort((a, b) => a - b);
  const passes = Array.from({ length: 1 + Math.floor(rand() * 3) }, () => [1 + Math.floor(rand() * 10), 1 + Math.floor(rand() * 20)]);
  assert.strictEqual(optimal(days, passes), bruteForce(days, passes));
}
console.log('✓ 10_gym_passes passed');

module.exports = { optimal, bruteForce };

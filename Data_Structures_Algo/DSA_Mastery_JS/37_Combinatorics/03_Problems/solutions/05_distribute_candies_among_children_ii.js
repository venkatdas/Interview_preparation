/**
 * 05. Distribute Candies Among Children II   (LeetCode 2929 — Medium)
 *
 * PROBLEM
 * You have n identical candies and 3 distinct children. Count the ways to hand out ALL the
 * candies so that no child gets more than `limit` candies.
 *
 * EXAMPLES
 * Input: n = 5, limit = 2   Output: 3    ((1,2,2), (2,1,2), (2,2,1))
 * Input: n = 3, limit = 3   Output: 10
 * Input: n = 7, limit = 2   Output: 0    (max total is 6)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= n, limit <= 10^6 (answer fits in a JS number: < C(10^6+2, 2) ~ 5e11)
 * - Children are distinct (order matters), candies are identical.
 *
 * APPROACH 1 — Brute force (fix two children)   O(min(n, limit)^2) time, O(1) space
 * Try every a and b in [0, limit]; c = n - a - b must be in [0, limit].
 * (A smarter brute: fix a, count valid b in O(1) -> O(limit).)
 *
 * APPROACH 2 — Optimal (stars and bars + inclusion–exclusion)   O(1) time, O(1) space
 * Without the limit: x1 + x2 + x3 = n, x >= 0  ->  C(n + 2, 2) ways.
 * "Bad" event A_i: child i gets >= limit+1. Give that child limit+1 first, distribute the rest:
 *   |A_i| = C(n - (limit+1) + 2, 2), |A_i ∩ A_j| = C(n - 2(limit+1) + 2, 2), triple likewise.
 * Inclusion–exclusion: good = sum over j = 0..3 of (-1)^j * C(3, j) * C(n - j(limit+1) + 2, 2),
 * where C(x, 2) = 0 when x < 2.
 *
 * Dry run, n = 5, limit = 2 (L = 3):
 *   j=0: +1 * C(7,2) = 21
 *   j=1: -3 * C(4,2) = -18
 *   j=2: +3 * C(1,2) = 0
 *   j=3: -1 * C(-2,2)= 0       -> 21 - 18 = 3
 *
 * EDGE CASES
 * - n > 3 * limit -> 0
 * - limit >= n -> no constraint bites, answer C(n+2, 2)
 * - C(x, 2) must return 0 for negative x (do not let the formula go negative)
 */

function bruteForce(n, limit) {
  let count = 0;
  for (let a = 0; a <= Math.min(n, limit); a++) {
    for (let b = 0; b <= Math.min(n - a, limit); b++) {
      const c = n - a - b;
      if (c >= 0 && c <= limit) count++;
    }
  }
  return count;
}

function optimal(n, limit) {
  const c2 = (x) => (x < 2 ? 0 : (x * (x - 1)) / 2); // C(x, 2), 0 when impossible
  const choose3 = [1, 3, 3, 1];
  let total = 0;
  for (let j = 0; j <= 3; j++) {
    const term = choose3[j] * c2(n - j * (limit + 1) + 2);
    total += j % 2 === 0 ? term : -term;
  }
  return total;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(5, 2), 3);
  assert.strictEqual(solve(3, 3), 10);
  assert.strictEqual(solve(7, 2), 0);
  assert.strictEqual(solve(6, 2), 1);
  assert.strictEqual(solve(1, 1), 3);
  assert.strictEqual(solve(4, 10), 15); // limit never binds: C(6,2)
}
assert.strictEqual(optimal(1_000_000, 1_000_000), 500001500001);
function mulberry32(seed) {
  return function () {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(5);
for (let t = 0; t < 300; t++) {
  const n = 1 + Math.floor(rand() * 60), limit = 1 + Math.floor(rand() * 30);
  assert.strictEqual(optimal(n, limit), bruteForce(n, limit));
}
console.log('✓ 05_distribute_candies_among_children_ii passed');

module.exports = { optimal, bruteForce };

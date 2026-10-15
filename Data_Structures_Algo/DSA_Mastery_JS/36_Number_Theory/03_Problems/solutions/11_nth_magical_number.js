/**
 * 11. Nth Magical Number   (LeetCode 878 — Hard)
 *
 * PROBLEM
 * A positive integer is "magical" if it is divisible by a OR by b.
 * Return the n-th magical number modulo 1e9 + 7.
 *
 * EXAMPLES
 * Input: n=1, a=2, b=3    Output: 2
 * Input: n=4, a=2, b=3    Output: 6    (2, 3, 4, 6)
 * Input: n=5, a=2, b=4    Output: 10   (2, 4, 6, 8, 10 — multiples of 4 are already multiples of 2)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= n <= 10^9, 2 <= a, b <= 4 * 10^4.
 * - Answer <= n * min(a, b) <= 4e13 < 2^53, so plain Numbers are exact; mod only at the end.
 *
 * APPROACH 1 — Brute force (merge two arithmetic sequences)   O(n) time, O(1) space
 * Two pointers over multiples of a and of b, like merging sorted lists, skipping duplicates.
 * n = 1e9 steps is too slow, but it is a perfect reference for small n.
 *
 * APPROACH 2 — Optimal (binary search on the answer + inclusion–exclusion)
 *   O(log(n * min(a,b)) + log min(a,b)) time, O(1) space
 * count(x) = how many magical numbers are <= x
 *          = floor(x/a) + floor(x/b) - floor(x/lcm(a,b))     (inclusion–exclusion:
 *            multiples of both were counted twice)
 * count is non-decreasing, so binary search the smallest x with count(x) >= n.
 * That x is itself magical (count jumps exactly at magical numbers).
 * lcm = a / gcd(a,b) * b  (divide first to stay small).
 *
 * Dry run n=4, a=2, b=3, lcm=6:  lo=1, hi=8
 *   mid=4: 2+1-0 = 3 < 4  -> lo=5
 *   mid=6: 3+2-1 = 4 >= 4 -> hi=6
 *   mid=5: 2+1-0 = 3 < 4  -> lo=6      answer 6
 *
 * Bonus (math, Advanced): the pattern repeats every L = lcm with m = L/a + L/b - 1 magical
 * numbers per block, so answer = floor((n-1)/m) * L + (the ((n-1) % m + 1)-th inside a block).
 *
 * EDGE CASES
 * - a === b; a divides b (lcm = b); n = 1.
 */

const MOD = 1_000_000_007;
function gcd(a, b) { while (b) [a, b] = [b, a % b]; return a; }

function bruteForce(n, a, b) {
  let ma = a, mb = b, cur = 0;
  for (let k = 0; k < n; k++) {
    cur = Math.min(ma, mb);
    if (ma === cur) ma += a;
    if (mb === cur) mb += b; // equal -> advance both, counted once
  }
  return cur % MOD;
}

function optimal(n, a, b) {
  const L = (a / gcd(a, b)) * b;
  const count = x => Math.floor(x / a) + Math.floor(x / b) - Math.floor(x / L);
  let lo = 1, hi = n * Math.min(a, b);
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (count(mid) >= n) hi = mid; else lo = mid + 1;
  }
  return lo % MOD;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(1, 2, 3), 2);
  assert.strictEqual(solve(4, 2, 3), 6);
  assert.strictEqual(solve(5, 2, 4), 10);
  assert.strictEqual(solve(3, 6, 4), 8);
  assert.strictEqual(solve(7, 5, 5), 35);
}
assert.strictEqual(optimal(1e9, 40000, 40000), 999720007); // 4e13 % MOD
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(878);
for (let t = 0; t < 1000; t++) {
  const n = 1 + Math.floor(rng() * 3000), a = 2 + Math.floor(rng() * 60), b = 2 + Math.floor(rng() * 60);
  assert.strictEqual(optimal(n, a, b), bruteForce(n, a, b));
}
console.log('✓ 11_nth_magical_number passed');

module.exports = { optimal, bruteForce };

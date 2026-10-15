/**
 * 06. Closest Prime Numbers in Range   (LeetCode 2523 — Medium)
 *
 * PROBLEM
 * Given left and right, find two primes p < q with left <= p < q <= right such that
 * q - p is as small as possible. Ties -> the pair with the smaller p. If fewer than two
 * primes exist in the range, return [-1, -1].
 *
 * EXAMPLES
 * Input: 10, 19   Output: [11, 13]   (primes 11 13 17 19; gaps 2 2 2 -> first)
 * Input: 4, 6     Output: [-1, -1]   (only 5)
 * Input: 1, 3     Output: [2, 3]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= left <= right <= 10^6.  What if right is 1e12 but the range is short?
 *   (then use a SEGMENTED sieve — see number_theory.js segmentedSieve)
 *
 * APPROACH 1 — Brute force   O((R - L) sqrt R) time, O(1) space
 * Trial-divide each number in the range; track the previous prime and the best gap.
 *
 * APPROACH 2 — Optimal (sieve once, scan adjacent primes)   O(R log log R) time, O(R) space
 * Only ADJACENT primes can be the closest pair (anything between would be closer).
 * Sieve up to right, walk left..right remembering the previous prime.
 * Early exit: a gap of 2 (twin primes) cannot be beaten except by (2, 3), which is the
 * very first pair anyway, so return immediately on gap <= 2.
 *
 * Dry run on [10, 19]:
 *   primes in range: 11, 13, ...
 *   prev=11; see 13 -> gap 2 -> best [11,13], gap <= 2 -> return [11, 13]
 *
 * EDGE CASES
 * - left = 1 (1 is not prime)
 * - left = right -> [-1, -1]
 */

function isPrime(x) {
  if (x < 2) return false;
  for (let d = 2; d * d <= x; d++) if (x % d === 0) return false;
  return true;
}

function bruteForce(left, right) {
  let prev = -1, best = [-1, -1], bestGap = Infinity;
  for (let x = left; x <= right; x++) {
    if (!isPrime(x)) continue;
    if (prev !== -1 && x - prev < bestGap) { bestGap = x - prev; best = [prev, x]; }
    prev = x;
  }
  return best;
}

function optimal(left, right) {
  const composite = new Uint8Array(right + 1);
  composite[0] = 1; if (right >= 1) composite[1] = 1;
  for (let i = 2; i * i <= right; i++) {
    if (!composite[i]) for (let j = i * i; j <= right; j += i) composite[j] = 1;
  }
  let prev = -1, best = [-1, -1], bestGap = Infinity;
  for (let x = left; x <= right; x++) {
    if (composite[x]) continue;
    if (prev !== -1 && x - prev < bestGap) {
      bestGap = x - prev; best = [prev, x];
      if (bestGap <= 2) return best; // twin primes: cannot do better later
    }
    prev = x;
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(10, 19), [11, 13]);
  assert.deepStrictEqual(solve(4, 6), [-1, -1]);
  assert.deepStrictEqual(solve(1, 3), [2, 3]);
  assert.deepStrictEqual(solve(1, 1), [-1, -1]);
  assert.deepStrictEqual(solve(19, 19), [-1, -1]);
  assert.deepStrictEqual(solve(24, 30), [-1, -1]); // only 29
  assert.deepStrictEqual(solve(89, 100), [89, 97]);  // gap 8 is the only pair
  assert.deepStrictEqual(solve(90, 110), [101, 103]); // gaps 4 then 2
}
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(2523);
for (let t = 0; t < 500; t++) {
  const l = 1 + Math.floor(rng() * 5000), r = l + Math.floor(rng() * 300);
  assert.deepStrictEqual(optimal(l, r), bruteForce(l, r));
}
assert.deepStrictEqual(optimal(1, 1000000), [2, 3]);
console.log('✓ 06_closest_prime_numbers_in_range passed');

module.exports = { optimal, bruteForce };

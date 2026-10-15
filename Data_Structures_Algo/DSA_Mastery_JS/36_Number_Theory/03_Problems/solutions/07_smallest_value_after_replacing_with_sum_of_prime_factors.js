/**
 * 07. Smallest Value After Replacing With Sum of Prime Factors   (LeetCode 2507 — Medium)
 *
 * PROBLEM
 * Given n, repeatedly replace n with the sum of its prime factors, counted WITH
 * multiplicity (12 = 2*2*3 -> 2+2+3 = 7). Return the smallest value n ever reaches.
 *
 * EXAMPLES
 * Input: 15   Output: 5    (15 -> 3+5 = 8 -> 2+2+2 = 6 -> 2+3 = 5 -> 5 stays)
 * Input: 3    Output: 3    (a prime maps to itself)
 * Input: 4    Output: 4    (4 -> 2+2 = 4, a fixed point that is NOT prime)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 2 <= n <= 10^5.  Does the sequence always stop? Yes: for composite n = a*b (a,b >= 2),
 *   a + b <= a*b, with equality only at 4, so the value never grows and strictly drops
 *   unless it is prime or 4.
 *
 * APPROACH 1 — Brute force (trial division each round)   O(sqrt n * rounds) time, O(1) space
 * Factorize by trial division; stop when the sum equals the current value.
 *
 * APPROACH 2 — Optimal (smallest-prime-factor sieve)   O(n) build + O(log n) per round
 * Build spf up to n once; each factorization is then repeated division by spf[x].
 * This is the right tool when you factorize MANY numbers (e.g. a batch of queries).
 *
 * Dry run on 15 (spf[15]=3, spf[5]=5, spf[8]=2, ...):
 *   x=15: 3 + 5 = 8           (8 != 15, continue)
 *   x=8 : 2 + 2 + 2 = 6       (continue)
 *   x=6 : 2 + 3 = 5           (continue)
 *   x=5 : 5                   (equal -> stop) -> 5
 *
 * EDGE CASES
 * - n prime -> n.     n = 4 -> 4 (stop on "sum === x", not on "x is prime").
 */

function sumPrimeFactorsTrial(x) {
  let sum = 0;
  for (let p = 2; p * p <= x; p++) while (x % p === 0) { sum += p; x /= p; }
  if (x > 1) sum += x;
  return sum;
}

function bruteForce(n) {
  while (true) {
    const s = sumPrimeFactorsTrial(n);
    if (s === n) return n;
    n = s;
  }
}

function buildSpf(limit) {
  const spf = new Int32Array(limit + 1);
  for (let i = 2; i <= limit; i++) {
    if (spf[i]) continue;
    for (let j = i; j <= limit; j += i) if (!spf[j]) spf[j] = i;
  }
  return spf;
}

function optimal(n, spf = buildSpf(n)) {
  while (true) {
    let x = n, s = 0;
    while (x > 1) { s += spf[x]; x /= spf[x]; }
    if (s === n) return n;
    n = s; // s <= n, so spf still covers it
  }
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(15), 5);
  assert.strictEqual(solve(3), 3);
  assert.strictEqual(solve(4), 4);
  assert.strictEqual(solve(2), 2);
  assert.strictEqual(solve(12), 7);  // 12 -> 7
  assert.strictEqual(solve(16), 5);  // 16 -> 8 -> 6 -> 5
  assert.strictEqual(solve(99991), 99991); // prime
}
const spf = buildSpf(100000);
for (let n = 2; n <= 100000; n += 7) assert.strictEqual(optimal(n, spf), bruteForce(n));
console.log('✓ 07_smallest_value_after_replacing_with_sum_of_prime_factors passed');

module.exports = { optimal, bruteForce, buildSpf };

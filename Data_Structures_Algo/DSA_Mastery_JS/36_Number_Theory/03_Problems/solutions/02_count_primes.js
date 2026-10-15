/**
 * 02. Count Primes   (LeetCode 204 — Medium)
 *
 * PROBLEM
 * Given n, return how many prime numbers are STRICTLY LESS than n.
 * (The basic sieve is in 00_Foundations/04_Mathematics_For_DSA. Here we go deeper:
 *  an odd-only sieve with a typed array that uses half the memory and half the work.)
 *
 * EXAMPLES
 * Input: 10   Output: 4   (2, 3, 5, 7)
 * Input: 0    Output: 0
 * Input: 2    Output: 0   (strictly less than 2)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 0 <= n <= 5 * 10^6.  Strictly less than n, or <= n?  (strictly less)
 *
 * APPROACH 1 — Brute force   O(n sqrt n) time, O(1) space
 * Trial-divide every number below n. Too slow for n = 5e6 (~ 1e10 operations).
 *
 * APPROACH 2 — Optimal (odd-only Sieve of Eratosthenes)   O(n log log n) time, O(n) space
 * 2 is the only even prime, so store only odd numbers: index i represents 2i + 1.
 * For each odd prime p (p*p < n) cross out p*p, p*p + 2p, p*p + 4p, ... (step 2p skips evens).
 * Start at p*p because smaller multiples k*p (k < p) were already crossed out by k's prime factor.
 *
 * Dry run on n = 20 (odd numbers 1..19 stored, index = (x-1)/2):
 *   start: candidates 3 5 7 9 11 13 15 17 19, count = 1 (for the prime 2) + 9 odd candidates
 *   p=3: cross 9, 15                       -> remaining 3 5 7 11 13 17 19
 *   p=5: 25 >= 20, stop
 *   answer = 1 + 7 = 8   (2 3 5 7 11 13 17 19)
 *
 * EDGE CASES
 * - n <= 2 -> 0      - n = 3 -> 1 (just 2)
 */

function isPrime(x) {
  if (x < 2) return false;
  for (let d = 2; d * d <= x; d++) if (x % d === 0) return false;
  return true;
}

function bruteForce(n) {
  let count = 0;
  for (let x = 2; x < n; x++) if (isPrime(x)) count++;
  return count;
}

function optimal(n) {
  if (n <= 2) return 0;
  const half = Math.floor(n / 2);          // odd numbers 1, 3, ..., < n  -> indices 0..half-1
  const composite = new Uint8Array(half);  // composite[i] -> 2i+1 is not prime
  let count = half;                        // counts 1 (index 0) instead of 2; they cancel out
  for (let p = 3; p * p < n; p += 2) {
    if (composite[(p - 1) >> 1]) continue;
    for (let m = p * p; m < n; m += 2 * p) {
      const idx = (m - 1) >> 1;
      if (!composite[idx]) { composite[idx] = 1; count--; }
    }
  }
  return count;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(10), 4);
  assert.strictEqual(solve(0), 0);
  assert.strictEqual(solve(1), 0);
  assert.strictEqual(solve(2), 0);
  assert.strictEqual(solve(3), 1);
  assert.strictEqual(solve(20), 8);
  assert.strictEqual(solve(10000), 1229);
}
assert.strictEqual(optimal(5000000), 348513);
for (let n = 0; n <= 3000; n++) assert.strictEqual(optimal(n), bruteForce(n));
console.log('✓ 02_count_primes passed');

module.exports = { optimal, bruteForce };

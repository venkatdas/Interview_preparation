/**
 * 08. Count Primes   (LeetCode 204 — Medium)
 *
 * PROBLEM
 * Given an integer n, return the number of prime numbers strictly less than n.
 *
 * EXAMPLES
 * Input: 10   Output: 4    Explanation: 2, 3, 5, 7
 * Input: 0    Output: 0
 * Input: 1    Output: 0
 * Input: 2    Output: 0    Explanation: strictly less than 2, so 2 itself is not counted
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Strictly less than n, or <= n? (strictly less)
 * - How big is n? (up to 5 * 10^6, so O(n sqrt n) trial division is too slow)
 *
 * APPROACH 1 — Brute force (trial division per number)   O(n sqrt n) time, O(1) space
 * For each number from 2 to n - 1, test primality by trying divisors up to its square root.
 *
 * APPROACH 2 — Optimal (Sieve of Eratosthenes)   O(n log log n) time, O(n) space
 * Assume every number from 2 to n - 1 is prime. For each p starting at 2, if p is still
 * marked prime, cross out all multiples of p starting at p * p (smaller multiples were
 * already crossed out by a smaller prime factor). Stop when p * p >= n. Count the survivors.
 *
 * Dry run on n = 10 (candidates 2..9):
 *   p=2: cross 4, 6, 8          remaining: 2 3 5 7 9
 *   p=3: cross 9                remaining: 2 3 5 7
 *   p=4: 16 >= 10 stop
 *   count = 4
 *
 * EDGE CASES
 * - n <= 2 -> 0
 * - n = 3  -> 1 (only 2)
 * - large n -> use a typed array (Uint8Array) for memory and speed
 */

function bruteForce(n) {
  function isPrime(value) {
    if (value < 2) return false;
    for (let divisor = 2; divisor * divisor <= value; divisor++) {
      if (value % divisor === 0) return false;
    }
    return true;
  }
  let count = 0;
  for (let value = 2; value < n; value++) if (isPrime(value)) count++;
  return count;
}

function optimal(n) {
  if (n <= 2) return 0;
  const isComposite = new Uint8Array(n); // index i: 1 means "crossed out"

  for (let p = 2; p * p < n; p++) {
    if (isComposite[p]) continue;
    for (let multiple = p * p; multiple < n; multiple += p) {
      isComposite[multiple] = 1; // every multiple of a prime is not prime
    }
  }

  let count = 0;
  for (let value = 2; value < n; value++) if (!isComposite[value]) count++;
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
  assert.strictEqual(solve(100), 25);
  assert.strictEqual(solve(1000), 168);
}
assert.strictEqual(optimal(1_000_000), 78498);
console.log('✓ 08-count-primes passed');

module.exports = { optimal, bruteForce };

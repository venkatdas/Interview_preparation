/**
 * 09. Prime Palindrome   (LeetCode 866 — Medium)
 *
 * PROBLEM
 * Given n, return the smallest number >= n that is BOTH prime and a palindrome.
 * (The answer is guaranteed to exist and be < 2 * 10^8.)
 *
 * EXAMPLES
 * Input: 6     Output: 7
 * Input: 8     Output: 11
 * Input: 13    Output: 101
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= n <= 10^8.
 *
 * APPROACH 1 — Brute force   O(gap * sqrt(answer)) time, O(1) space
 * Try x = n, n+1, ... check palindrome then primality. Correct, but for n near 1e7
 * it scans ~9e7 numbers (there is no 8-digit prime palindrome at all — see below).
 *
 * APPROACH 2 — Optimal (generate palindromes, skip even lengths)   O(sqrt(N) * sqrt(answer))
 * KEY NUMBER THEORY FACT: every even-length palindrome is divisible by 11.
 * (Divisibility by 11: alternating digit sum. In an even-length palindrome each digit
 *  appears once at an odd position and once at an even position -> alternating sum 0.)
 * So apart from 11 itself, only ODD-length palindromes can be prime.
 * Build them from a "root": root 123 -> "123" + "21" = 12321. Roots 1, 2, ... produce
 * odd-length palindromes in increasing order, so the first prime one >= n is the answer.
 * Only ~1e4 roots are needed to pass 2e8.
 *
 * Dry run n = 13:
 *   8 <= n <= 11? no.
 *   roots 1..9 -> palindromes 1..9 (all < 13)
 *   root 10 -> 101 >= 13, isPrime(101) yes -> 101
 *
 * EDGE CASES
 * - n <= 2 -> 2.   8 <= n <= 11 -> 11 (the only even-length prime palindrome).
 */

function isPrime(x) {
  if (x < 2) return false;
  if (x % 2 === 0) return x === 2;
  for (let d = 3; d * d <= x; d += 2) if (x % d === 0) return false;
  return true;
}
function isPalindrome(x) {
  const s = String(x);
  return s === [...s].reverse().join('');
}

function bruteForce(n) {
  for (let x = n; ; x++) if (isPalindrome(x) && isPrime(x)) return x;
}

function optimal(n) {
  if (n >= 8 && n <= 11) return 11;
  for (let root = 1; root < 100000; root++) {
    const s = String(root);
    const pal = Number(s + [...s.slice(0, -1)].reverse().join(''));
    if (pal >= n && isPrime(pal)) return pal;
  }
  return -1; // unreachable for valid input
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(6), 7);
  assert.strictEqual(solve(8), 11);
  assert.strictEqual(solve(13), 101);
  assert.strictEqual(solve(1), 2);
  assert.strictEqual(solve(2), 2);
  assert.strictEqual(solve(11), 11);
  assert.strictEqual(solve(12), 101);
}
assert.strictEqual(optimal(9989900), 100030001); // jumps over every 8-digit number
assert.strictEqual(optimal(100000000), 100030001);
for (let n = 1; n <= 20000; n++) assert.strictEqual(optimal(n), bruteForce(n));
console.log('✓ 09_prime_palindrome passed');

module.exports = { optimal, bruteForce };

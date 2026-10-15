/**
 * 06. Guess Number Higher or Lower   (LeetCode 374 — Easy)
 *
 * PROBLEM
 * I pick a number in 1..n. You guess; an API guess(num) returns
 *   -1 if my number is LOWER than your guess, 1 if HIGHER, 0 if correct.
 * Return my number.
 *
 * EXAMPLES
 * n = 10, pick = 6   Output: 6
 * n = 1,  pick = 1   Output: 1
 * n = 2,  pick = 1   Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 2^31 - 1 (use Math.floor for mid, not >> on the sum)
 * - The API is the only information source; minimise calls
 * - Be careful with the sign convention: -1 means "go lower"
 *
 * APPROACH 1 — Brute force   O(n) calls
 * Guess 1, 2, 3, ... until the API says 0.
 *
 * APPROACH 2 — Optimal (Template 1 with an oracle instead of an array)   O(log n) calls, O(1) space
 * Exactly binary search: the hidden number plays the role of "target", the API plays
 * the role of the comparison. guess(mid) === 0 -> found; === -1 -> hi = mid - 1;
 * === 1 -> lo = mid + 1.
 *
 * Dry run n=10, pick=6:
 *   lo=1 hi=10 mid=5 guess -> 1 (higher)  -> lo=6
 *   lo=6 hi=10 mid=8 guess -> -1 (lower)  -> hi=7
 *   lo=6 hi=7  mid=6 guess -> 0 -> 6
 *
 * EDGE CASES
 * - n = 1
 * - pick = 1 or pick = n (boundaries)
 * - huge n: at most ~31 calls
 */

function makeGuess(pick) {
  return (num) => (num > pick ? -1 : num < pick ? 1 : 0);
}

function bruteForce(n, guess) {
  for (let num = 1; num <= n; num++) if (guess(num) === 0) return num;
  return -1;
}

function optimal(n, guess) {
  let lo = 1, hi = n;
  while (lo <= hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    const verdict = guess(mid);
    if (verdict === 0) return mid;
    if (verdict === -1) hi = mid - 1;   // my number is lower than mid
    else lo = mid + 1;                  // my number is higher than mid
  }
  return -1;                            // unreachable when the pick is in range
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(10, makeGuess(6)), 6);
  assert.strictEqual(solve(1, makeGuess(1)), 1);
  assert.strictEqual(solve(2, makeGuess(1)), 1);
  assert.strictEqual(solve(2, makeGuess(2)), 2);
  assert.strictEqual(solve(100, makeGuess(100)), 100);
  assert.strictEqual(solve(100, makeGuess(1)), 1);
}
let calls = 0;
const countingGuess = (num) => { calls++; return makeGuess(1702766719)(num); };
assert.strictEqual(optimal(2147483647, countingGuess), 1702766719);
assert.ok(calls <= 32, `too many calls: ${calls}`);
console.log('✓ 06-guess-number passed');

module.exports = { optimal, bruteForce, makeGuess };

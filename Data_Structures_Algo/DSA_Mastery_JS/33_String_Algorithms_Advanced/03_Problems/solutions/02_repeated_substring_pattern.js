/**
 * 02. Repeated Substring Pattern   (LeetCode 459 — Easy)
 *
 * PROBLEM
 * Return true if s can be built by taking one of its substrings and repeating it two or
 * more times.
 *
 * EXAMPLES
 * Input: "abab"          Output: true   ("ab" x 2)
 * Input: "aba"           Output: false
 * Input: "abcabcabcabc"  Output: true   ("abc" x 4, also "abcabc" x 2)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Length >= 1; a single character cannot be repeated "two or more times" -> false
 * - Lowercase letters
 *
 * APPROACH 1 — Brute force   O(n * d(n)) ~ O(n^2) worst case
 * For each candidate length L that divides n (L < n), check that s equals s[0..L) repeated.
 *
 * APPROACH 2 — Optimal (KMP failure table)   O(n) time, O(n) space
 * Let p = lps[n-1] (longest proper prefix that is also a suffix). The SMALLEST period of
 * s is n - p. The string is a repetition iff that period is shorter than n and divides n:
 *     p > 0  and  n % (n - p) === 0
 * One-liner alternative: (s + s).slice(1, -1).includes(s) - if s appears inside s+s
 * without using the first/last char, it has a non-trivial period.
 *
 * Dry run on "abcabcabcabc" (n = 12):
 *   lps = [0,0,0,1,2,3,4,5,6,7,8,9]; p = 9; period = 12 - 9 = 3; 12 % 3 === 0 -> true
 * "aba": lps = [0,0,1]; p = 1; period 2; 3 % 2 !== 0 -> false
 *
 * EDGE CASES
 * - "a" -> false; "aa" -> true
 * - all same letters -> true (n >= 2)
 * - "abac" -> false (p = 1, period 3, 4 % 3 != 0)
 */

function bruteForce(s) {
  const n = s.length;
  for (let len = 1; len <= n / 2; len++) {
    if (n % len !== 0) continue;
    const unit = s.slice(0, len);
    if (unit.repeat(n / len) === s) return true;
  }
  return false;
}

function optimal(s) {
  const n = s.length;
  const lps = new Array(n).fill(0);
  let len = 0;
  for (let i = 1; i < n; i++) {
    while (len > 0 && s[i] !== s[len]) len = lps[len - 1];
    if (s[i] === s[len]) len++;
    lps[i] = len;
  }
  const p = lps[n - 1];
  return p > 0 && n % (n - p) === 0;
}

function doubledTrick(s) {
  return (s + s).slice(1, -1).includes(s);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal, doubledTrick]) {
  assert.strictEqual(solve('abab'), true);
  assert.strictEqual(solve('aba'), false);
  assert.strictEqual(solve('abcabcabcabc'), true);
  assert.strictEqual(solve('a'), false);
  assert.strictEqual(solve('aa'), true);
  assert.strictEqual(solve('abac'), false);
  assert.strictEqual(solve('ababab'), true);
}
function randomString(len) {
  return Array.from({ length: len }, () => 'ab'[Math.floor(Math.random() * 2)]).join('');
}
for (let trial = 0; trial < 300; trial++) {
  const s = randomString(1 + Math.floor(Math.random() * 16));
  assert.strictEqual(optimal(s), bruteForce(s));
  assert.strictEqual(doubledTrick(s), bruteForce(s));
}
console.log('✓ 02-repeated-substring-pattern passed');

module.exports = { optimal, bruteForce, doubledTrick };

/**
 * 04. Longest Happy Prefix   (LeetCode 1392 — Hard)
 *
 * PROBLEM
 * A "happy prefix" is a non-empty prefix that is also a suffix, excluding the whole string.
 * Return the longest happy prefix of s, or "" if none exists.
 *
 * EXAMPLES
 * Input: "level"         Output: "l"
 * Input: "ababab"        Output: "abab"
 * Input: "leetcodeleet"  Output: "leet"
 * Input: "a"             Output: ""
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Length up to 10^5 -> O(n^2) string comparisons are too slow
 * - Must be a PROPER prefix (shorter than s)
 *
 * APPROACH 1 — Brute force   O(n^2) time
 * For len from n-1 down to 1, compare s.slice(0, len) with s.slice(n - len).
 *
 * APPROACH 2 — Optimal (KMP failure table)   O(n) time, O(n) space
 * This is literally the definition of lps[n-1]: the length of the longest proper prefix
 * of s that is also a suffix of s. Build lps and return s.slice(0, lps[n-1]).
 *
 * Dry run on "ababab":
 *   i=1: 'b' vs s[0]='a' -> len 0
 *   i=2: 'a' vs s[0] -> len 1
 *   i=3: 'b' vs s[1]='b' -> len 2
 *   i=4: 'a' vs s[2]='a' -> len 3
 *   i=5: 'b' vs s[3]='b' -> len 4
 *   lps = [0,0,1,2,3,4] -> answer s.slice(0, 4) = "abab"
 *
 * EDGE CASES
 * - single character -> ""
 * - all same letters "aaaa" -> "aaa"
 * - no repetition at all -> ""
 */

function bruteForce(s) {
  const n = s.length;
  for (let len = n - 1; len >= 1; len--) {
    if (s.slice(0, len) === s.slice(n - len)) return s.slice(0, len);
  }
  return '';
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
  return s.slice(0, lps[n - 1]);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('level'), 'l');
  assert.strictEqual(solve('ababab'), 'abab');
  assert.strictEqual(solve('leetcodeleet'), 'leet');
  assert.strictEqual(solve('a'), '');
  assert.strictEqual(solve('aaaa'), 'aaa');
  assert.strictEqual(solve('abcd'), '');
}
function randomString(len) {
  return Array.from({ length: len }, () => 'ab'[Math.floor(Math.random() * 2)]).join('');
}
for (let trial = 0; trial < 300; trial++) {
  const s = randomString(1 + Math.floor(Math.random() * 16));
  assert.strictEqual(optimal(s), bruteForce(s));
}
console.log('✓ 04-longest-happy-prefix passed');

module.exports = { optimal, bruteForce };

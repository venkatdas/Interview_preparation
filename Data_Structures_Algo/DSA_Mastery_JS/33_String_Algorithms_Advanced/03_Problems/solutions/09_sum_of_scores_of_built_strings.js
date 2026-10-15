/**
 * 09. Sum of Scores of Built Strings   (LeetCode 2223 — Hard)
 *
 * PROBLEM
 * You build string s one character at a time by PREPENDING, so after i steps you hold the
 * suffix s[n-i..]. The score of each intermediate string is the length of its longest
 * common prefix with the final s. Return the sum of all n scores.
 *
 * EXAMPLES
 * Input: "babab"   Output: 9
 *   suffixes: "b" (lcp 1), "ab" (0), "bab" (3), "abab" (0), "babab" (5) -> 1+0+3+0+5 = 9
 * Input: "azbazbzaz"   Output: 14
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Length up to 10^5 -> O(n^2) comparisons too slow
 * - The whole string counts once (score n)
 *
 * APPROACH 1 — Brute force   O(n^2) time
 * For each suffix compare it with s character by character until a mismatch.
 *
 * APPROACH 2 — Optimal (Z-function)   O(n) time, O(n) space
 * z[i] is DEFINED as the length of the longest common prefix of s and s[i..]. That is
 * exactly the score of the suffix starting at i. Answer = n (for i = 0) + sum of z[1..n-1].
 * The Z-algorithm keeps the rightmost "Z-box" [l, r) that matches a prefix of s; for a new
 * i inside it, z[i] starts at min(r - i, z[i - l]) (copy from the mirrored position) and is
 * only extended by direct comparison beyond r. Each comparison moves r forward -> O(n).
 *
 * Dry run on "babab":
 *   z[0] = 5 (by definition)
 *   i=1: 'a' vs 'b' -> 0
 *   i=2: compare s[2..] "bab" with "bab" -> 3; box [2, 5)
 *   i=3: inside box: z[3] = min(5-3, z[1]) = 0; s[3]='a' vs s[0]='b' -> 0
 *   i=4: inside box: z[4] = min(1, z[2]=3) = 1; s[5] out of range -> 1
 *   sum = 5 + 0 + 3 + 0 + 1 = 9
 *
 * EDGE CASES
 * - single character -> 1
 * - all same letters "aaaa" -> 4+3+2+1 = 10
 * - no repeated prefix -> n
 */

function bruteForce(s) {
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    let len = 0;
    while (i + len < s.length && s[len] === s[i + len]) len++;
    total += len;
  }
  return total;
}

function zFunction(s) {
  const n = s.length;
  const z = new Array(n).fill(0);
  let l = 0;
  let r = 0;
  for (let i = 1; i < n; i++) {
    if (i < r) z[i] = Math.min(r - i, z[i - l]);
    while (i + z[i] < n && s[z[i]] === s[i + z[i]]) z[i]++;
    if (i + z[i] > r) {
      l = i;
      r = i + z[i];
    }
  }
  if (n > 0) z[0] = n;
  return z;
}

function optimal(s) {
  return zFunction(s).reduce((sum, v) => sum + v, 0);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('babab'), 9);
  assert.strictEqual(solve('azbazbzaz'), 14);
  assert.strictEqual(solve('a'), 1);
  assert.strictEqual(solve('aaaa'), 10);
  assert.strictEqual(solve('abcd'), 4);
  assert.strictEqual(solve(''), 0);
}
function randomString(len) {
  return Array.from({ length: len }, () => 'ab'[Math.floor(Math.random() * 2)]).join('');
}
for (let trial = 0; trial < 300; trial++) {
  const s = randomString(Math.floor(Math.random() * 20));
  assert.strictEqual(optimal(s), bruteForce(s));
}
console.log('✓ 09-sum-of-scores-of-built-strings passed');

module.exports = { optimal, bruteForce, zFunction };

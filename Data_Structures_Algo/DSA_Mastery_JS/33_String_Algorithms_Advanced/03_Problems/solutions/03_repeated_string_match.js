/**
 * 03. Repeated String Match   (LeetCode 686 — Medium)
 *
 * PROBLEM
 * Return the minimum number of times you must repeat string a so that b is a substring
 * of the result, or -1 if that is impossible.
 *
 * EXAMPLES
 * Input: a = "abcd", b = "cdabcdab"   Output: 3   ("abcdabcdabcd" contains b; 2 copies do not)
 * Input: a = "a", b = "aa"            Output: 2
 * Input: a = "abc", b = "wxyz"        Output: -1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Lengths up to 10^4
 * - b non-empty
 *
 * APPROACH 1 — Brute force   O((n + m) * m) worst case
 * Keep appending a until the length is >= m + n, checking includes() after each append.
 *
 * APPROACH 2 — Optimal (bound the repeat count, then KMP)   O(n + m) time
 * How many copies could ever be needed? b must fit: at least ceil(m / n) copies. One more
 * copy can be needed when b starts in the middle of a copy. If b is not in a repeated
 * ceil(m / n) + 1 times, adding more copies cannot help (the extra text is out of b's
 * reach). So test k = ceil(m / n) and k + 1 with KMP.
 *
 * Dry run: a = "abcd", b = "cdabcdab": n = 4, m = 8, k = 2
 *   "abcdabcd" contains "cdabcdab"? no (would need 'ab' after position 6)
 *   k + 1 = 3: "abcdabcdabcd" -> b found at index 2 -> 3
 *
 * EDGE CASES
 * - b shorter than a and inside a -> 1
 * - b made of characters not in a -> -1
 * - a === b -> 1
 */

function bruteForce(a, b) {
  let repeated = a;
  let count = 1;
  while (repeated.length < b.length + a.length) {
    if (repeated.includes(b)) return count;
    repeated += a;
    count++;
  }
  return repeated.includes(b) ? count : -1;
}

function kmpContains(text, pattern) {
  const lps = new Array(pattern.length).fill(0);
  for (let i = 1, len = 0; i < pattern.length; i++) {
    while (len > 0 && pattern[i] !== pattern[len]) len = lps[len - 1];
    if (pattern[i] === pattern[len]) len++;
    lps[i] = len;
  }
  for (let i = 0, j = 0; i < text.length; i++) {
    while (j > 0 && text[i] !== pattern[j]) j = lps[j - 1];
    if (text[i] === pattern[j]) j++;
    if (j === pattern.length) return true;
  }
  return false;
}

function optimal(a, b) {
  const k = Math.ceil(b.length / a.length);
  if (kmpContains(a.repeat(k), b)) return k;
  if (kmpContains(a.repeat(k + 1), b)) return k + 1;
  return -1;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('abcd', 'cdabcdab'), 3);
  assert.strictEqual(solve('a', 'aa'), 2);
  assert.strictEqual(solve('abc', 'wxyz'), -1);
  assert.strictEqual(solve('abcd', 'bc'), 1);
  assert.strictEqual(solve('abc', 'abc'), 1);
  assert.strictEqual(solve('abc', 'cabcabca'), 4);
  assert.strictEqual(solve('aaaaaaaaaaaaaaaaaaaaaab', 'ba'), 2);
}
function randomString(len) {
  return Array.from({ length: len }, () => 'ab'[Math.floor(Math.random() * 2)]).join('');
}
for (let trial = 0; trial < 300; trial++) {
  const a = randomString(1 + Math.floor(Math.random() * 4));
  const b = randomString(1 + Math.floor(Math.random() * 10));
  assert.strictEqual(optimal(a, b), bruteForce(a, b));
}
console.log('✓ 03-repeated-string-match passed');

module.exports = { optimal, bruteForce };

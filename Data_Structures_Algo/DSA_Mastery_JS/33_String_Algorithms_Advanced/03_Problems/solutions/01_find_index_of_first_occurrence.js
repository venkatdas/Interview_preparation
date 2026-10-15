/**
 * 01. Find the Index of the First Occurrence in a String (strStr)   (LeetCode 28 — Easy)
 *
 * PROBLEM
 * Return the index of the first occurrence of `needle` in `haystack`, or -1 if it is not
 * part of haystack.
 *
 * EXAMPLES
 * Input: haystack = "sadbutsad", needle = "sad"   Output: 0
 * Input: haystack = "leetcode", needle = "leeto"  Output: -1
 * Input: haystack = "mississippi", needle = "issip"  Output: 4
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Empty needle? (LeetCode says needle is non-empty; classic strStr returns 0)
 * - Lengths up to 10^4 -> naive O(n*m) passes, but the interviewer wants to hear "KMP"
 *
 * APPROACH 1 — Brute force   O(n * m) time, O(1) space
 * Try every start i in haystack and compare needle character by character.
 * Worst case: haystack "aaaa...ab", needle "aaab" -> almost m comparisons at every i.
 *
 * APPROACH 2 — Optimal (KMP)   O(n + m) time, O(m) space
 * Precompute lps (longest proper prefix that is also a suffix) for the needle. While
 * scanning haystack with a match pointer j, a mismatch does NOT restart from scratch:
 * the first j chars matched, and lps[j-1] of them are also a prefix of the needle, so
 * we continue with j = lps[j-1]. The text pointer never moves backwards.
 *
 * lps for "issip":   i s s i p
 *                    0 0 0 1 0
 * Dry run, haystack "mississippi":
 *   m: j=0 mismatch, stay            i: match j=1   s: j=2   s: j=3   i: j=4
 *   s (index 5) vs needle[4]='p': mismatch -> j = lps[3] = 1; needle[1]='s' matches -> j=2
 *   s (6): j=3     i (7): j=4     p (8): j=5 === m -> found at 8 - 5 + 1 = 4
 *
 * EDGE CASES
 * - needle longer than haystack -> -1
 * - needle === haystack -> 0
 * - repeated characters ("aaab" in "aaaaaab")
 */

function bruteForce(haystack, needle) {
  if (needle.length === 0) return 0;
  for (let i = 0; i + needle.length <= haystack.length; i++) {
    let j = 0;
    while (j < needle.length && haystack[i + j] === needle[j]) j++;
    if (j === needle.length) return i;
  }
  return -1;
}

function buildLPS(pattern) {
  const lps = new Array(pattern.length).fill(0);
  let len = 0;
  for (let i = 1; i < pattern.length; i++) {
    while (len > 0 && pattern[i] !== pattern[len]) len = lps[len - 1];
    if (pattern[i] === pattern[len]) len++;
    lps[i] = len;
  }
  return lps;
}

function optimal(haystack, needle) {
  if (needle.length === 0) return 0;
  const lps = buildLPS(needle);
  let j = 0;
  for (let i = 0; i < haystack.length; i++) {
    while (j > 0 && haystack[i] !== needle[j]) j = lps[j - 1];   // fall back, not restart
    if (haystack[i] === needle[j]) j++;
    if (j === needle.length) return i - j + 1;
  }
  return -1;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('sadbutsad', 'sad'), 0);
  assert.strictEqual(solve('leetcode', 'leeto'), -1);
  assert.strictEqual(solve('mississippi', 'issip'), 4);
  assert.strictEqual(solve('a', 'a'), 0);
  assert.strictEqual(solve('abc', 'abcd'), -1);
  assert.strictEqual(solve('aaaaaab', 'aaab'), 3);
  assert.strictEqual(solve('hello', ''), 0);
}
function randomString(len) {
  return Array.from({ length: len }, () => 'ab'[Math.floor(Math.random() * 2)]).join('');
}
for (let trial = 0; trial < 300; trial++) {
  const haystack = randomString(Math.floor(Math.random() * 20));
  const needle = randomString(1 + Math.floor(Math.random() * 4));
  assert.strictEqual(optimal(haystack, needle), bruteForce(haystack, needle));
}
console.log('✓ 01-find-index-of-first-occurrence passed');

module.exports = { optimal, bruteForce, buildLPS };

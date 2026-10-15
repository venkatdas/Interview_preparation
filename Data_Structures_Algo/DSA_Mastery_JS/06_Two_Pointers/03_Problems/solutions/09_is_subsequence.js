/**
 * 09. Is Subsequence   (LeetCode 392 — Easy)
 *
 * PROBLEM
 * Given strings s and t, return true if s is a subsequence of t: s can be formed from t
 * by deleting some (possibly zero) characters without changing the order of the rest.
 *
 * EXAMPLES
 * Input: s = "abc", t = "ahbgdc"   Output: true    Explanation: a..b..c appear in order
 * Input: s = "axc", t = "ahbgdc"   Output: false   Explanation: no 'x' after 'a'
 * Input: s = "", t = "anything"    Output: true
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Subsequence, not substring? (yes: gaps allowed, order matters)
 * - Empty s? (true) Empty t with non-empty s? (false)
 * - Follow-up: many s queries against one huge t? (preprocess t: char -> sorted index list,
 *   then binary search; see 10_Searching)
 *
 * APPROACH 1 — Brute force (recursion over t)   exponential-ish, O(|t|) stack
 * For each character of t decide: use it to match s[i] or skip it. This explores many
 * paths; good only to show the definition. We give a simple recursive version.
 *
 * APPROACH 2 — Optimal (two pointers, one per string)   O(|t|) time, O(1) space
 * i walks s, j walks t. Whenever t[j] === s[i], we "consume" that character: i++.
 * Always j++. If i reaches s.length, every character of s was found in order.
 * Greedy is safe: matching s[i] to the EARLIEST possible t[j] leaves the most of t
 * available for the remaining characters of s.
 *
 * Dry run on s = "abc", t = "ahbgdc":
 *   j=0 'a' == s[0] -> i=1
 *   j=1 'h' no
 *   j=2 'b' == s[1] -> i=2
 *   j=3 'g' no
 *   j=4 'd' no
 *   j=5 'c' == s[2] -> i=3 == s.length -> true
 *
 * EDGE CASES
 * - s longer than t -> false immediately
 * - s === t -> true
 * - repeated characters: s = "aaa", t = "aa" -> false
 */

function bruteForce(s, t) {
  function helper(i, j) {
    if (i === s.length) return true;   // all of s matched
    if (j === t.length) return false;  // t exhausted
    // option 1: match if equal; option 2: skip t[j]
    return (s[i] === t[j] && helper(i + 1, j + 1)) || helper(i, j + 1);
  }
  return helper(0, 0);
}

function optimal(s, t) {
  if (s.length > t.length) return false;
  let i = 0; // position in s
  for (let j = 0; j < t.length && i < s.length; j++) {
    if (s[i] === t[j]) i++; // consume the earliest match
  }
  return i === s.length;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('abc', 'ahbgdc'), true);
  assert.strictEqual(solve('axc', 'ahbgdc'), false);
  assert.strictEqual(solve('', 'anything'), true);
  assert.strictEqual(solve('a', ''), false);
  assert.strictEqual(solve('abc', 'abc'), true);
  assert.strictEqual(solve('aaa', 'aa'), false);
  assert.strictEqual(solve('acb', 'abc'), false);
  assert.strictEqual(solve('', ''), true);
}
console.log('✓ 09-is-subsequence passed');

module.exports = { optimal, bruteForce };

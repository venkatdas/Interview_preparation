/**
 * 03. Valid Anagram   (LeetCode 242 — Easy)
 *
 * PROBLEM
 * Given two strings s and t, return true if t is an anagram of s: the same letters with
 * the same counts, in any order.
 *
 * EXAMPLES
 * Input: s = "anagram", t = "nagaram"   Output: true
 * Input: s = "rat", t = "car"           Output: false   Explanation: 'r','a' match but 't' vs 'c'
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Only lowercase English letters? (yes on LeetCode -> 26-slot array works)
 * - Follow-up: what if inputs contain Unicode? (switch the array to a Map)
 * - Different lengths? (can never be anagrams -> early return)
 *
 * APPROACH 1 — Brute force   O(n log n) time, O(n) space
 * Sort both strings and compare. Anagrams sort to the identical string.
 * s.split('').sort().join('') === t.split('').sort().join('')
 *
 * APPROACH 2 — Optimal (frequency table)   O(n) time, O(1) space
 * One array of 26 counters. For each index i: add 1 for s[i], subtract 1 for t[i].
 * If every counter is 0 at the end, every letter appeared equally often in both.
 * Space is O(1) because 26 does not grow with n.
 *
 * Dry run on s="rat", t="car":
 *   i=0: counts[r]++ counts[c]--   -> r:1 c:-1
 *   i=1: counts[a]++ counts[a]--   -> a:0
 *   i=2: counts[t]++ counts[r]--   -> t:1 r:0
 *   c:-1 and t:1 are non-zero -> false
 *
 * EDGE CASES
 * - "" and ""            -> true
 * - "a" and "ab"         -> false (length check)
 * - "aa" and "a" style duplicates: counts handle it, sets would not
 */

function bruteForce(s, t) {
  if (s.length !== t.length) return false;
  return s.split('').sort().join('') === t.split('').sort().join('');
}

function optimal(s, t) {
  if (s.length !== t.length) return false;

  const counts = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    counts[s.charCodeAt(i) - 97]++; // letter seen in s
    counts[t.charCodeAt(i) - 97]--; // letter seen in t cancels it out
  }
  // any leftover means some letter appeared more in one string than the other
  return counts.every((count) => count === 0);
}

// Follow-up version for arbitrary characters (Unicode): same idea with a Map.
function optimalUnicode(s, t) {
  if (s.length !== t.length) return false;
  const counts = new Map();
  for (const ch of s) counts.set(ch, (counts.get(ch) || 0) + 1);
  for (const ch of t) {
    if (!counts.get(ch)) return false; // missing or already used up
    counts.set(ch, counts.get(ch) - 1);
  }
  return true;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal, optimalUnicode]) {
  assert.strictEqual(solve('anagram', 'nagaram'), true);
  assert.strictEqual(solve('rat', 'car'), false);
  assert.strictEqual(solve('', ''), true);
  assert.strictEqual(solve('a', 'ab'), false);
  assert.strictEqual(solve('aa', 'bb'), false);
  assert.strictEqual(solve('listen', 'silent'), true);
  assert.strictEqual(solve('aab', 'abb'), false);
}
assert.strictEqual(optimalUnicode('héllo', 'olléh'), true);
console.log('✓ 03-valid-anagram passed');

module.exports = { optimal, bruteForce, optimalUnicode };

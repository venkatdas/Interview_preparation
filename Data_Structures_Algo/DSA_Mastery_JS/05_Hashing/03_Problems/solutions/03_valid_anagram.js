/**
 * 03. Valid Anagram   (LeetCode 242 — Easy)
 *
 * PROBLEM
 * Given two strings s and t, return true if t is an anagram of s: the same letters
 * with the same counts, in any order.
 *
 * EXAMPLES
 * Input: s = "anagram", t = "nagaram"   Output: true
 * Input: s = "rat", t = "car"           Output: false   Explanation: 'r','a' match but 't' vs 'c'
 * Input: s = "a", t = "ab"              Output: false   Explanation: different lengths
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Only lowercase English letters? (if yes, a 26-slot array works; a Map handles Unicode)
 * - Is case significant? Are spaces counted? (assume yes, exact characters)
 * - Empty strings? ("" and "" -> true)
 *
 * APPROACH 1 — Brute force (sort)   O(n log n) time, O(n) space
 * Sort both strings and compare. Simple, but sorting is slower than counting.
 *
 * APPROACH 2 — Optimal (frequency count with one Map)   O(n) time, O(k) space
 * (k = number of distinct characters, at most 26 for lowercase letters)
 *   1. Different lengths -> false immediately.
 *   2. Walk s and increment counts; walk t and decrement counts.
 *   3. If any count ever goes below zero, t has a letter s doesn't -> false.
 *   Lengths are equal, so if nothing went negative, nothing is positive either.
 *
 * Dry run on s = "rat", t = "car":
 *   count s: {r:1, a:1, t:1}
 *   t: 'c' -> count becomes -1 -> false
 *
 * Dry run on s = "ab", t = "ba":
 *   count s: {a:1, b:1}
 *   t: 'b' -> {a:1, b:0}; 'a' -> {a:0, b:0}; never negative -> true
 *
 * EDGE CASES
 * - Different lengths -> false (fast exit, avoids a full count)
 * - Same letters different counts: "aab" vs "abb" -> false
 * - Empty strings -> true
 */

function bruteForce(s, t) {
  if (s.length !== t.length) return false;
  return [...s].sort().join('') === [...t].sort().join('');
}

function optimal(s, t) {
  if (s.length !== t.length) return false;

  const count = new Map();
  for (const ch of s) count.set(ch, (count.get(ch) ?? 0) + 1);

  for (const ch of t) {
    const remaining = (count.get(ch) ?? 0) - 1;
    if (remaining < 0) return false; // t uses a letter more times than s has it
    count.set(ch, remaining);
  }
  return true;
}

// Variation for lowercase-only input: fixed 26-slot array, no hashing at all.
function optimalArray26(s, t) {
  if (s.length !== t.length) return false;
  const counts = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    counts[s.charCodeAt(i) - 97]++;
    counts[t.charCodeAt(i) - 97]--;
  }
  return counts.every((c) => c === 0);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal, optimalArray26]) {
  assert.strictEqual(solve('anagram', 'nagaram'), true);
  assert.strictEqual(solve('rat', 'car'), false);
  assert.strictEqual(solve('a', 'ab'), false);
  assert.strictEqual(solve('aab', 'abb'), false);
  assert.strictEqual(solve('', ''), true);
  assert.strictEqual(solve('ab', 'ba'), true);
}
assert.strictEqual(optimal('héllo', 'olléh'), true); // Map handles any character
console.log('✓ 03-valid-anagram passed');

module.exports = { optimal, bruteForce, optimalArray26 };

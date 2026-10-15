/**
 * 07. Find All Anagrams in a String   (LeetCode 438 — Medium)
 *
 * PROBLEM
 * Given strings s and p, return all start indices of substrings of s that are anagrams of p.
 *
 * EXAMPLES
 * Input: s = "cbaebabacd", p = "abc"   Output: [0, 6]
 * Input: s = "abab", p = "ab"          Output: [0, 1, 2]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Lowercase only? (yes)
 * - p longer than s? ([])
 * - Overlapping matches count? (yes)
 *
 * APPROACH 1 — Brute force   O(|s| * 26) with per-window recount
 * For every window of length |p|, count letters and compare the two 26-arrays.
 *
 * APPROACH 2 — Optimal (fixed window, counts, compare via a diff counter)   O(|s|) time, O(26) space
 * Sliding-window view (contrast with 05_Hashing which tracks "matched distinct letters"):
 * keep ONE array `diff` = windowCount - pCount for each letter, plus `mismatched` = how
 * many letters have diff !== 0. The window is an anagram when mismatched === 0.
 *   slide in ch:  diff[ch]++  -> if diff became 0 mismatched--, if it became 1 mismatched++
 *   slide out ch: diff[ch]--  -> if diff became 0 mismatched--, if it became -1 mismatched++
 * Every step is O(1).
 *
 * Dry run on s = "abab", p = "ab": diff starts {a:-1, b:-1}, mismatched 2
 *   r=0 in 'a': diff a=0 -> mismatched 1
 *   r=1 in 'b': diff b=0 -> mismatched 0; window [0,1] full -> record 0
 *   r=2 in 'a': diff a=1 -> mismatched 1; out s[0]='a': diff a=0 -> 0 -> record 1
 *   r=3 in 'b': b=1 -> 1; out s[1]='b': b=0 -> 0 -> record 2
 *   [0, 1, 2]
 *
 * EDGE CASES
 * - p longer than s -> []
 * - s === p -> [0]
 * - p with repeated letters
 * - no matches -> []
 */

function bruteForce(s, p) {
  const result = [];
  if (p.length > s.length) return result;
  const countOf = (str) => {
    const counts = new Array(26).fill(0);
    for (const ch of str) counts[ch.charCodeAt(0) - 97]++;
    return counts;
  };
  const target = countOf(p);
  for (let start = 0; start + p.length <= s.length; start++) {
    const windowCounts = countOf(s.slice(start, start + p.length));
    if (windowCounts.every((c, i) => c === target[i])) result.push(start);
  }
  return result;
}

function optimal(s, p) {
  const result = [];
  if (p.length > s.length) return result;

  const diff = new Array(26).fill(0); // windowCount - pCount per letter
  let mismatched = 0;                  // letters whose diff is not 0

  const adjust = (letterCode, delta) => {
    const before = diff[letterCode];
    diff[letterCode] += delta;
    const after = diff[letterCode];
    if (before === 0 && after !== 0) mismatched++;
    else if (before !== 0 && after === 0) mismatched--;
  };

  for (const ch of p) adjust(ch.charCodeAt(0) - 97, -1);

  for (let right = 0; right < s.length; right++) {
    adjust(s.charCodeAt(right) - 97, +1);               // letter enters
    if (right >= p.length) adjust(s.charCodeAt(right - p.length) - 97, -1); // letter leaves
    if (right >= p.length - 1 && mismatched === 0) result.push(right - p.length + 1);
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve('cbaebabacd', 'abc'), [0, 6]);
  assert.deepStrictEqual(solve('abab', 'ab'), [0, 1, 2]);
  assert.deepStrictEqual(solve('a', 'ab'), []);
  assert.deepStrictEqual(solve('abc', 'abc'), [0]);
  assert.deepStrictEqual(solve('aabaa', 'aab'), [0, 1, 2]);
  assert.deepStrictEqual(solve('xyz', 'abc'), []);
  assert.deepStrictEqual(solve('baa', 'aa'), [1]);
}
console.log('✓ 07-find-all-anagrams passed');

module.exports = { optimal, bruteForce };

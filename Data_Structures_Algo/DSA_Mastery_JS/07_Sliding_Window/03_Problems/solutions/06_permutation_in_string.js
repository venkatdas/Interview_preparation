/**
 * 06. Permutation in String   (LeetCode 567 — Medium)
 *
 * PROBLEM
 * Given strings s1 and s2, return true if s2 contains a permutation of s1 as a substring.
 * In other words: does some window of s2 with length |s1| have exactly s1's letter counts?
 *
 * EXAMPLES
 * Input: s1 = "ab", s2 = "eidbaooo"   Output: true    Explanation: "ba" is a permutation of "ab"
 * Input: s1 = "ab", s2 = "eidboaoo"   Output: false
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Lowercase letters only? (yes -> two 26-slot arrays)
 * - |s1| > |s2|? (false)
 * - Empty s1? (clarify; LeetCode says length >= 1)
 *
 * APPROACH 1 — Brute force   O(|s2| * |s1| log |s1|) time
 * For each window of length |s1| in s2, sort it and compare to sorted s1.
 *
 * APPROACH 2 — Optimal (fixed window + counts + "matches" counter)   O(|s2|) time, O(26) space
 *   1. need[26] = counts of s1. window[26] = counts of the first |s1| letters of s2.
 *   2. matches = how many of the 26 letters have need[i] === window[i]. If 26 -> true.
 *   3. Slide: for the incoming letter, window[in]++, then
 *        if window[in] === need[in]  -> matches++
 *        else if window[in] === need[in] + 1 -> matches--   (we just broke a match)
 *      for the outgoing letter, window[out]--, then
 *        if window[out] === need[out] -> matches++
 *        else if window[out] === need[out] - 1 -> matches--
 *   4. After each slide, if matches === 26 -> true.
 * Keeping `matches` makes each step O(1) instead of comparing 26 slots.
 *
 * Dry run on s1 = "ab", s2 = "eidbaooo":
 *   need {a:1, b:1}. first window "ei": matches = 24 (all letters except a, b match at 0)
 *   slide in 'd', out 'e': no change to a/b, matches 24
 *   slide in 'b', out 'i': window b=1 === need -> 25
 *   slide in 'a', out 'd': window a=1 === need -> 26 -> true
 *
 * EDGE CASES
 * - s1 longer than s2 -> false
 * - s1 === s2 -> true
 * - s1 has repeated letters: "aab" in "baa" -> true
 * - Match at the very end of s2
 */

function bruteForce(s1, s2) {
  const sortedS1 = [...s1].sort().join('');
  for (let start = 0; start + s1.length <= s2.length; start++) {
    if ([...s2.slice(start, start + s1.length)].sort().join('') === sortedS1) return true;
  }
  return false;
}

function optimal(s1, s2) {
  if (s1.length > s2.length) return false;

  const need = new Array(26).fill(0);
  const window = new Array(26).fill(0);
  const code = (str, i) => str.charCodeAt(i) - 97;

  for (let i = 0; i < s1.length; i++) {
    need[code(s1, i)]++;
    window[code(s2, i)]++;
  }

  let matches = 0;
  for (let i = 0; i < 26; i++) if (need[i] === window[i]) matches++;

  for (let right = s1.length; right < s2.length; right++) {
    if (matches === 26) return true;

    const incoming = code(s2, right);
    window[incoming]++;
    if (window[incoming] === need[incoming]) matches++;
    else if (window[incoming] === need[incoming] + 1) matches--;

    const outgoing = code(s2, right - s1.length);
    window[outgoing]--;
    if (window[outgoing] === need[outgoing]) matches++;
    else if (window[outgoing] === need[outgoing] - 1) matches--;
  }
  return matches === 26; // check the final window too
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('ab', 'eidbaooo'), true);
  assert.strictEqual(solve('ab', 'eidboaoo'), false);
  assert.strictEqual(solve('abc', 'ab'), false);
  assert.strictEqual(solve('abc', 'abc'), true);
  assert.strictEqual(solve('aab', 'xbaa'), true);
  assert.strictEqual(solve('a', 'a'), true);
  assert.strictEqual(solve('hello', 'ooolleoooleh'), false);
  assert.strictEqual(solve('adc', 'dcda'), true);
}
console.log('✓ 06-permutation-in-string passed');

module.exports = { optimal, bruteForce };

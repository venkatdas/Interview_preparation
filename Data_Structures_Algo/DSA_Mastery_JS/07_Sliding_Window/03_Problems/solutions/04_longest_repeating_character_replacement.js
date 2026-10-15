/**
 * 04. Longest Repeating Character Replacement   (LeetCode 424 — Medium)
 *
 * PROBLEM
 * Given a string s of uppercase letters and an integer k, you may replace at most k
 * characters with any other uppercase letter. Return the length of the longest substring
 * containing the same letter after the replacements.
 *
 * EXAMPLES
 * Input: s = "ABAB", k = 2      Output: 4   Explanation: replace both A's -> "BBBB"
 * Input: s = "AABABBA", k = 1   Output: 4   Explanation: "AABA" -> "AAAA" (or "ABBB" -> "BBBB")
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Uppercase only? (yes -> 26-slot count array)
 * - k can be 0? (yes -> longest run of a single letter)
 * - k >= length? (whole string)
 *
 * APPROACH 1 — Brute force   O(n^2 * 26) time
 * For each start/end pair count the letters; the window works if
 * (length - most frequent count) <= k.
 *
 * APPROACH 2 — Optimal (variable window, counts + maxFreq)   O(n) time, O(26) space
 * A window is VALID if (windowLength - maxFreqInWindow) <= k: the non-majority letters
 * are the ones we'd replace, and there must be at most k of them.
 *   expand: counts[s[right]]++, maxFreq = max(maxFreq, counts[s[right]])
 *   while window invalid: counts[s[left]]--, left++
 *   record window length
 * Subtle point: maxFreq is never decreased when the window shrinks. That's safe because
 * the answer only improves when maxFreq grows; a stale (too high) maxFreq can only let
 * the window be as large as a previous valid window, never larger than a true answer.
 *
 * Dry run on "AABABBA", k = 1:
 *   right=0 A counts{A:1} maxFreq 1 len 1 - 1 = 0 <= 1 ok   best 1
 *   right=1 A {A:2} mf 2 len 2 ok best 2
 *   right=2 B {A:2,B:1} mf 2 len 3, 3-2=1 ok best 3
 *   right=3 A {A:3,B:1} mf 3 len 4, 4-3=1 ok best 4
 *   right=4 B {A:3,B:2} mf 3 len 5, 5-3=2 > 1 -> shrink: drop A -> {A:2,B:2} left=1 len 4, 4-3=1 ok
 *   right=5 B {A:2,B:3} mf 3 len 5, 2 > 1 -> drop A (left=2) {A:1,B:3} len 4 ok
 *   right=6 A {A:2,B:3} mf 3 len 5 -> drop B (left=3) {A:2,B:2} len 4 ok
 *   best 4
 *
 * EDGE CASES
 * - k = 0 -> longest run of one letter
 * - k >= n -> n
 * - Single letter string
 * - Empty -> 0
 */

function bruteForce(s, k) {
  let best = 0;
  for (let start = 0; start < s.length; start++) {
    const counts = new Array(26).fill(0);
    let maxFreq = 0;
    for (let end = start; end < s.length; end++) {
      const code = s.charCodeAt(end) - 65;
      counts[code]++;
      maxFreq = Math.max(maxFreq, counts[code]);
      if (end - start + 1 - maxFreq <= k) best = Math.max(best, end - start + 1);
      else break; // longer windows from this start only get worse
    }
  }
  return best;
}

function optimal(s, k) {
  const counts = new Array(26).fill(0);
  let left = 0;
  let maxFreq = 0; // highest count of any single letter seen in a window so far
  let best = 0;

  for (let right = 0; right < s.length; right++) {
    const incoming = s.charCodeAt(right) - 65;
    counts[incoming]++;
    maxFreq = Math.max(maxFreq, counts[incoming]);

    // letters to replace = window length - majority count; must be <= k
    while (right - left + 1 - maxFreq > k) {
      counts[s.charCodeAt(left) - 65]--;
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('ABAB', 2), 4);
  assert.strictEqual(solve('AABABBA', 1), 4);
  assert.strictEqual(solve('AAAA', 0), 4);
  assert.strictEqual(solve('ABCDE', 0), 1);
  assert.strictEqual(solve('ABCDE', 10), 5);
  assert.strictEqual(solve('', 2), 0);
  assert.strictEqual(solve('A', 0), 1);
  assert.strictEqual(solve('ABBB', 2), 4);
}
console.log('✓ 04-longest-repeating-character-replacement passed');

module.exports = { optimal, bruteForce };

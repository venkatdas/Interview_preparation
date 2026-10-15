/**
 * 05. Longest Palindromic Substring   (LeetCode 5 — Medium)
 *
 * PROBLEM
 * Return the longest substring of s that reads the same forwards and backwards.
 * If there are several of the same length, any one is accepted.
 *
 * EXAMPLES
 * Input: "babad"   Output: "bab" (or "aba")
 * Input: "cbbd"    Output: "bb"
 * Input: "a"       Output: "a"
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Length up to 1000 -> O(n^2) expand-around-center is the expected interview answer;
 *   Manacher's O(n) is the bonus that distinguishes you
 * - Case sensitive, every character counts
 *
 * APPROACH 1 — Brute force / expand around center   O(n^2) time, O(1) space
 * Every palindrome has a center: a character (odd length) or a gap between two characters
 * (even length). For each of the 2n - 1 centers expand outwards while the ends match.
 * (The true brute force checks all O(n^2) substrings in O(n) each = O(n^3).)
 *
 * APPROACH 2 — Optimal (Manacher's algorithm)   O(n) time, O(n) space
 * 1. Transform: "abba" -> "^#a#b#b#a#$". Now every palindrome has odd length and the
 *    sentinels ^ and $ stop the expansion without bounds checks.
 * 2. radius[i] = how far the palindrome centred at i reaches. Keep the palindrome with the
 *    rightmost edge: (center, right).
 * 3. For a new i inside that palindrome, its mirror j = 2*center - i already has a known
 *    radius, and the palindrome around j is reflected around center, so
 *    radius[i] >= min(radius[j], right - i). Start from there and only expand further.
 * 4. Each expansion step pushes `right` further, and right only moves n times -> O(n).
 *
 * Dry run on "cbbd" -> t = "^#c#b#b#d#$" (indices 0..10)
 *   i=1 '#': 0      i=2 'c': 0      i=3 '#': 0
 *   i=4 'b': t[5]='#' === t[3]='#' -> 1; t[6]='b' vs t[2]='c' stop.   radius[4] = 1
 *   i=5 '#': t[6]='b' === t[4]='b' -> 1; t[7]='#' === t[3]='#' -> 2; t[8]='d' vs t[2]='c' stop.
 *            radius[5] = 2, center 5, right 7
 *   i=6 'b': inside (6 < 7); mirror 4 has radius 1, right - i = 1 -> start 1;
 *            t[8]='d' vs t[4]='b' stop.                                 radius[6] = 1
 *   best radius 2 at center 5 -> start (5 - 2 - 1) / 2 = 1, length 2 -> "bb"
 *
 * EDGE CASES
 * - empty string -> ""
 * - all same characters -> whole string
 * - no repeated characters -> any single character
 */

function bruteForce(s) {
  let best = '';
  for (let center = 0; center < s.length; center++) {
    for (const [l0, r0] of [[center, center], [center, center + 1]]) {
      let l = l0;
      let r = r0;
      while (l >= 0 && r < s.length && s[l] === s[r]) {
        l--;
        r++;
      }
      if (r - l - 1 > best.length) best = s.slice(l + 1, r);
    }
  }
  return best;
}

function optimal(s) {
  if (s.length === 0) return '';
  const t = '^#' + s.split('').join('#') + '#$';
  const n = t.length;
  const radius = new Array(n).fill(0);
  let center = 0;
  let right = 0;
  for (let i = 1; i < n - 1; i++) {
    const mirror = 2 * center - i;
    if (i < right) radius[i] = Math.min(right - i, radius[mirror]);
    while (t[i + radius[i] + 1] === t[i - radius[i] - 1]) radius[i]++;
    if (i + radius[i] > right) {
      center = i;
      right = i + radius[i];
    }
  }
  let bestLen = 0;
  let bestCenter = 0;
  for (let i = 1; i < n - 1; i++) {
    if (radius[i] > bestLen) {
      bestLen = radius[i];
      bestCenter = i;
    }
  }
  const start = (bestCenter - bestLen - 1) / 2;
  return s.slice(start, start + bestLen);
}

// ---------- tests ----------
const assert = require('assert');
function isPalindrome(str) {
  return str === str.split('').reverse().join('');
}
for (const solve of [bruteForce, optimal]) {
  assert.ok(['bab', 'aba'].includes(solve('babad')));
  assert.strictEqual(solve('cbbd'), 'bb');
  assert.strictEqual(solve('a'), 'a');
  assert.strictEqual(solve(''), '');
  assert.strictEqual(solve('aaaa'), 'aaaa');
  assert.strictEqual(solve('abc').length, 1);
  assert.strictEqual(solve('forgeeksskeegfor'), 'geeksskeeg');
}
function randomString(len) {
  return Array.from({ length: len }, () => 'abc'[Math.floor(Math.random() * 3)]).join('');
}
for (let trial = 0; trial < 300; trial++) {
  const s = randomString(Math.floor(Math.random() * 20));
  const got = optimal(s);
  assert.strictEqual(got.length, bruteForce(s).length);
  assert.ok(isPalindrome(got) && (s.length === 0 || s.includes(got)));
}
console.log('✓ 05-longest-palindromic-substring passed');

module.exports = { optimal, bruteForce };

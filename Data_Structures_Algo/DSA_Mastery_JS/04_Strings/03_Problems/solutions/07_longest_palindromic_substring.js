/**
 * 07. Longest Palindromic Substring   (LeetCode 5 — Medium)
 *
 * PROBLEM
 * Given a string s, return the longest substring of s that is a palindrome.
 * (A substring is contiguous. If there are several of the same length, any one is accepted.)
 *
 * EXAMPLES
 * Input: "babad"   Output: "bab"   Explanation: "aba" is also valid
 * Input: "cbbd"    Output: "bb"
 * Input: "a"       Output: "a"
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Return the substring or just its length? (substring)
 * - Any answer when there are ties? (yes)
 * - Empty string? (return "")
 * - Case-sensitive? (yes)
 *
 * APPROACH 1 — Brute force   O(n^3) time, O(1) space
 * Try every pair (start, end), check whether that substring is a palindrome with two
 * pointers (O(n)), keep the longest. n^2 substrings * O(n) check.
 *
 * APPROACH 2 — Optimal (expand around center)   O(n^2) time, O(1) space
 * Every palindrome is symmetric around a center. A center is either one character
 * (odd length, like "aba") or the gap between two characters (even length, like "abba").
 * That gives 2n - 1 centers. From each center, expand outward while the two ends match.
 * Track the best (start, length). Each expansion is O(n), so O(n^2) total, no extra memory.
 * (Manacher's algorithm does it in O(n) but is almost never required.)
 *
 * Dry run on "cbbd":
 *   center i=0 odd:  "c" len 1; even (0,1): c!=b -> len 0
 *   center i=1 odd:  "b" len 1; even (1,2): b==b expand -> c!=d stop, len 2 "bb"  best=2
 *   center i=2 odd:  "b" len 1; even (2,3): b!=d
 *   center i=3 odd:  "d" len 1
 *   answer "bb"
 *
 * EDGE CASES
 * - ""              -> ""
 * - "a"             -> "a"
 * - all same "aaaa" -> "aaaa" (even and odd centers both expand fully)
 * - no repeats "abc"-> any single char
 */

function isPalindromeRange(s, left, right) {
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}

function bruteForce(s) {
  let best = '';
  for (let start = 0; start < s.length; start++) {
    for (let end = start; end < s.length; end++) {
      if (end - start + 1 > best.length && isPalindromeRange(s, start, end)) {
        best = s.slice(start, end + 1);
      }
    }
  }
  return best;
}

function optimal(s) {
  if (s.length < 2) return s;

  let bestStart = 0;
  let bestLength = 1;

  // returns the length of the longest palindrome centered at (left, right)
  function expand(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }
    // loop overshot by one on each side, so the palindrome is (left+1 .. right-1)
    return right - left - 1;
  }

  for (let center = 0; center < s.length; center++) {
    const oddLength = expand(center, center);         // "aba" style
    const evenLength = expand(center, center + 1);    // "abba" style
    const length = Math.max(oddLength, evenLength);
    if (length > bestLength) {
      bestLength = length;
      // for a palindrome of this length centered here, the start is center - (length-1)/2
      bestStart = center - Math.floor((length - 1) / 2);
    }
  }
  return s.slice(bestStart, bestStart + bestLength);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.ok(['bab', 'aba'].includes(solve('babad')));
  assert.strictEqual(solve('cbbd'), 'bb');
  assert.strictEqual(solve('a'), 'a');
  assert.strictEqual(solve(''), '');
  assert.strictEqual(solve('aaaa'), 'aaaa');
  assert.strictEqual(solve('abc').length, 1);
  assert.strictEqual(solve('forgeeksskeegfor'), 'geeksskeeg');
  assert.strictEqual(solve('abacdfgdcaba'), 'aba');
}
console.log('✓ 07-longest-palindromic-substring passed');

module.exports = { optimal, bruteForce };

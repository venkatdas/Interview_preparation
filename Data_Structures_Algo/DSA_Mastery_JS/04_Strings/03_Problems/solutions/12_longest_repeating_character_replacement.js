/**
 * 12. Longest Repeating Character Replacement   (LeetCode 424 — Medium)
 *
 * TEASER: this is really a sliding-window problem. It is here because it is the classic
 * "string + frequency table" question; the full window technique (and its siblings like
 * Minimum Window Substring) lives in 07_Sliding_Window.
 *
 * PROBLEM
 * Given a string of uppercase letters and an integer k, you may change at most k
 * characters to any other uppercase letter. Return the length of the longest substring
 * that can be made of a single repeated letter after those changes.
 *
 * EXAMPLES
 * Input: s = "ABAB", k = 2     Output: 4   Explanation: change both A's (or both B's)
 * Input: s = "AABABBA", k = 1  Output: 4   Explanation: "AABA" -> "AAAA" by changing one B
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Only uppercase A-Z? (yes -> 26-slot count array)
 * - k can be 0? (yes -> longest run of equal letters)
 * - k >= n? (then the whole string, n)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * For every start, extend end one char at a time while maintaining counts for the
 * window. The window is fixable if (windowLength - mostFrequentCount) <= k.
 * Checking the max of 26 counts is O(1).
 *
 * APPROACH 2 — Optimal (sliding window with max frequency)   O(n) time, O(1) space
 * Keep a window [left, right]. A window is valid when the characters that are NOT the
 * most frequent one can all be replaced: windowLength - maxCount <= k.
 * Grow right every step. If the window becomes invalid, slide left by ONE.
 * Trick: maxCount never needs to decrease. A smaller maxCount could never give a longer
 * answer than one we already saw, so the window only ever grows or slides - O(n).
 *
 * Dry run on "AABABBA", k=1:
 *   right=0 'A' count A:1 max=1 len=1 ok  best=1
 *   right=1 'A' A:2 max=2 len=2 ok        best=2
 *   right=2 'B' B:1 max=2 len=3 3-2=1 ok  best=3
 *   right=3 'A' A:3 max=3 len=4 4-3=1 ok  best=4
 *   right=4 'B' B:2 max=3 len=5 5-3=2 >1 -> slide left: remove 'A' (A:2), left=1, len=4
 *   right=5 'B' B:3 max=3 len=5 5-3=2 >1 -> remove 'A' (A:1), left=2, len=4
 *   right=6 'A' A:2 max=3 len=5 >1 -> remove 'B' (B:2), left=3, len=4
 *   answer 4
 *
 * EDGE CASES
 * - ""            -> 0
 * - k = 0         -> longest run of one letter
 * - k >= n        -> n
 * - all same      -> n regardless of k
 */

function bruteForce(s, k) {
  let best = 0;
  for (let start = 0; start < s.length; start++) {
    const counts = new Array(26).fill(0);
    let maxCount = 0;
    for (let end = start; end < s.length; end++) {
      const index = s.charCodeAt(end) - 65; // 'A' is 65
      counts[index]++;
      maxCount = Math.max(maxCount, counts[index]);
      const windowLength = end - start + 1;
      if (windowLength - maxCount <= k) {
        best = Math.max(best, windowLength);
      } else {
        break; // longer windows from this start only get worse
      }
    }
  }
  return best;
}

function optimal(s, k) {
  const counts = new Array(26).fill(0);
  let left = 0;
  let maxCount = 0; // highest count of any single letter seen in the current window
  let best = 0;

  for (let right = 0; right < s.length; right++) {
    const index = s.charCodeAt(right) - 65;
    counts[index]++;
    maxCount = Math.max(maxCount, counts[index]);

    // too many characters would need replacing -> shrink from the left by one
    if (right - left + 1 - maxCount > k) {
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
  assert.strictEqual(solve('', 1), 0);
  assert.strictEqual(solve('AAAA', 0), 4);
  assert.strictEqual(solve('ABCDE', 0), 1);
  assert.strictEqual(solve('ABCDE', 10), 5);
  assert.strictEqual(solve('ABBB', 2), 4);
  assert.strictEqual(solve('AABBBCC', 1), 4);
}
console.log('✓ 12-longest-repeating-character-replacement passed');

module.exports = { optimal, bruteForce };

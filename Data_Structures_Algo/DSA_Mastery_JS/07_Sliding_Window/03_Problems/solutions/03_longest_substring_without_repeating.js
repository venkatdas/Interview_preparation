/**
 * 03. Longest Substring Without Repeating Characters   (LeetCode 3 — Medium)
 *
 * PROBLEM
 * Given a string s, return the length of the longest substring that has no repeated characters.
 *
 * EXAMPLES
 * Input: "abcabcbb"   Output: 3   Explanation: "abc"
 * Input: "bbbbb"      Output: 1
 * Input: "pwwkew"     Output: 3   Explanation: "wke"
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Substring (contiguous), not subsequence? (substring)
 * - Any characters (spaces, symbols, unicode)? (yes -> use a Set/Map, not a 26-array)
 * - Return length, not the substring? (length)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(k) space
 * For every start, extend until a repeat appears (use a Set per start).
 *
 * APPROACH 2 — Optimal (variable window with a Set, "longest valid")   O(n) time, O(k) space
 * The sliding-window view: the window [left, right] is VALID when it has no repeats.
 * Keep a Set of characters inside the window.
 *   expand: look at s[right]
 *   while s[right] is already in the Set: remove s[left] from the Set, left++   (shrink until valid)
 *   add s[right]; record right - left + 1
 * Monotonic condition: adding characters can only ADD repeats, removing can only remove
 * them, so left never needs to go backward.
 *
 * Dry run on "pwwkew":
 *   right=0 'p' set{p}        len 1
 *   right=1 'w' set{p,w}      len 2
 *   right=2 'w' in set -> remove p (left=1), remove w (left=2), set{} -> add w, set{w} len 1
 *   right=3 'k' set{w,k}      len 2
 *   right=4 'e' set{w,k,e}    len 3
 *   right=5 'w' in set -> remove w (left=3), set{k,e} -> add w, set{k,e,w} len 3
 *   best 3
 *
 * (05_Hashing has the "jump left using last index" version. Same O(n), fewer steps.)
 *
 * EDGE CASES
 * - Empty -> 0
 * - All same -> 1
 * - All unique -> n
 * - Repeat at the very end
 */

function bruteForce(s) {
  let best = 0;
  for (let start = 0; start < s.length; start++) {
    const seen = new Set();
    for (let end = start; end < s.length; end++) {
      if (seen.has(s[end])) break;
      seen.add(s[end]);
      best = Math.max(best, end - start + 1);
    }
  }
  return best;
}

function optimal(s) {
  const inWindow = new Set();
  let left = 0;
  let best = 0;

  for (let right = 0; right < s.length; right++) {
    // shrink from the left until the incoming character is no longer a duplicate
    while (inWindow.has(s[right])) {
      inWindow.delete(s[left]);
      left++;
    }
    inWindow.add(s[right]);
    best = Math.max(best, right - left + 1);
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('abcabcbb'), 3);
  assert.strictEqual(solve('bbbbb'), 1);
  assert.strictEqual(solve('pwwkew'), 3);
  assert.strictEqual(solve(''), 0);
  assert.strictEqual(solve('abcdef'), 6);
  assert.strictEqual(solve('abba'), 2);
  assert.strictEqual(solve('a b!b a'), 4);
  assert.strictEqual(solve('tmmzuxt'), 5);
}
console.log('✓ 03-longest-substring-without-repeating passed');

module.exports = { optimal, bruteForce };

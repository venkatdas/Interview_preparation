/**
 * 12. Longest Substring Without Repeating Characters   (LeetCode 3 — Medium)
 *
 * PROBLEM
 * Given a string s, return the length of the longest substring with no repeated characters.
 *
 * EXAMPLES
 * Input: "abcabcbb"   Output: 3   Explanation: "abc"
 * Input: "bbbbb"      Output: 1   Explanation: "b"
 * Input: "pwwkew"     Output: 3   Explanation: "wke" ("pwke" is not a substring)
 * Input: ""           Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Substring (contiguous) or subsequence? (substring)
 * - Character set? (any; spaces and symbols count as characters)
 * - Return the length or the substring itself? (length)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(k) space
 * For every start index, extend to the right adding characters to a Set until a repeat
 * appears. Track the longest.
 *
 * APPROACH 2 — Optimal (index map + jumping window)   O(n) time, O(k) space
 * This folder's view: hashing gives us "where did I LAST see this character?" in O(1).
 * Keep a window [left, right] with no repeats. When s[right] was seen at index p and
 * p >= left, the window must start AFTER p: left = p + 1. We jump directly instead of
 * shrinking one by one. Store/overwrite lastIndex[s[right]] = right every step.
 *
 * (The shrink-one-at-a-time version with a Set is in 07_Sliding_Window; same O(n).)
 *
 * Dry run on "abcabcbb":
 *   r=0 'a' not seen        left=0  len=1  map{a:0}
 *   r=1 'b' not seen        left=0  len=2  map{a:0,b:1}
 *   r=2 'c' not seen        left=0  len=3  map{a:0,b:1,c:2}
 *   r=3 'a' seen at 0 >= 0  left=1  len=3  map{a:3,...}
 *   r=4 'b' seen at 1 >= 1  left=2  len=3  map{b:4,...}
 *   r=5 'c' seen at 2 >= 2  left=3  len=3
 *   r=6 'b' seen at 4 >= 3  left=5  len=2
 *   r=7 'b' seen at 6 >= 5  left=7  len=1
 *   best = 3
 *
 * The `p >= left` check matters: in "abba", at the final 'a' the map says a was at 0,
 * but left is already 2, so we must NOT move left backwards.
 *
 * EDGE CASES
 * - Empty -> 0
 * - All same chars -> 1
 * - All unique -> n
 * - "abba": stale index must not move left backwards
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
  const lastIndex = new Map(); // char -> most recent index
  let left = 0;
  let best = 0;

  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    // Only jump if the previous sighting is INSIDE the current window.
    if (lastIndex.has(ch) && lastIndex.get(ch) >= left) {
      left = lastIndex.get(ch) + 1;
    }
    lastIndex.set(ch, right);
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
  assert.strictEqual(solve('abba'), 2);
  assert.strictEqual(solve('abcdef'), 6);
  assert.strictEqual(solve(' '), 1);
  assert.strictEqual(solve('dvdf'), 3);
}
console.log('✓ 12-longest-substring-without-repeating passed');

module.exports = { optimal, bruteForce };

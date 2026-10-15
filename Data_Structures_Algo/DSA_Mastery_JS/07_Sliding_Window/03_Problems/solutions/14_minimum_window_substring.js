/**
 * 14. Minimum Window Substring   (LeetCode 76 — Hard)
 *
 * PROBLEM
 * Given strings s and t, return the smallest substring of s that contains every
 * character of t (including duplicates). Return "" if none exists.
 *
 * EXAMPLES
 * Input: s = "ADOBECODEBANC", t = "ABC"   Output: "BANC"
 * Input: s = "a", t = "a"                 Output: "a"
 * Input: s = "a", t = "aa"                Output: ""   Explanation: need two a's
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Duplicates in t must all be present? (yes: "aa" needs two a's)
 * - Case sensitive? (yes)
 * - Unique answer guaranteed? (yes on LeetCode)
 * - Any characters? (yes -> Map, not 26-array)
 *
 * APPROACH 1 — Brute force   O(n^2 * m) time
 * For every (start, end) pair check whether the substring covers t by counting.
 * Even the O(n^2) "count as you extend" version is too slow for 10^5.
 *
 * APPROACH 2 — Optimal (variable window, shortest valid, with a `formed` counter)   O(|s| + |t|) time, O(k) space
 *   need = counts of t. required = need.size (distinct chars).
 *   window = counts inside [left, right]. formed = number of distinct chars whose
 *   window count >= need count.
 *   expand: window[ch]++; if window[ch] === need[ch] -> formed++
 *   while formed === required:                       (window is valid)
 *     record if smaller than best
 *     remove s[left]: window[ch]--; if window[ch] < need[ch] -> formed--
 *     left++
 * `formed` lets us test validity in O(1) instead of comparing maps.
 *
 * Dry run on s = "ADOBECODEBANC", t = "ABC": need {A:1,B:1,C:1}, required 3
 *   r=0..5 "ADOBEC": A -> formed 1, B -> formed 2, C -> formed 3. Valid, len 6, best "ADOBEC".
 *     shrink: drop A (A count 0 < 1) -> formed 2, left=1. Invalid, stop shrinking.
 *   r=6..10 "DOBECODEBA": at r=10 the 'A' arrives -> formed 3. Window [1..10] len 10, not better.
 *     shrink: drop D, O (not needed), drop B (B count 1 -> 0) -> formed 2, left=4.
 *   r=11 'N': nothing.
 *   r=12 'C': window [4..12] "ECODEBANC" has A, B, C -> formed 3. len 9, not better.
 *     shrink: drop E, drop C (C count 2 -> 1, still enough), O, D, E -> window [9..12] "BANC" len 4, best.
 *     drop B -> formed 2, left=10. Invalid.
 *   end. "BANC"
 *
 * EDGE CASES
 * - t longer than s -> ""
 * - s === t -> s
 * - t has repeated chars
 * - No valid window -> ""
 */

function bruteForce(s, t) {
  const covers = (sub) => {
    const counts = new Map();
    for (const ch of sub) counts.set(ch, (counts.get(ch) ?? 0) + 1);
    for (const ch of t) {
      if (!counts.get(ch)) return false;
      counts.set(ch, counts.get(ch) - 1);
    }
    return true;
  };
  let best = '';
  for (let start = 0; start < s.length; start++) {
    for (let end = start + t.length; end <= s.length; end++) {
      if (best && end - start >= best.length) break;
      const sub = s.slice(start, end);
      if (covers(sub)) { best = sub; break; }
    }
  }
  return best;
}

function optimal(s, t) {
  if (t.length === 0 || t.length > s.length) return '';

  const need = new Map();
  for (const ch of t) need.set(ch, (need.get(ch) ?? 0) + 1);
  const required = need.size;

  const window = new Map();
  let formed = 0;        // distinct chars whose window count has reached the needed count
  let left = 0;
  let bestStart = 0;
  let bestLength = Infinity;

  for (let right = 0; right < s.length; right++) {
    const incoming = s[right];
    if (need.has(incoming)) {
      window.set(incoming, (window.get(incoming) ?? 0) + 1);
      if (window.get(incoming) === need.get(incoming)) formed++;
    }

    // window is valid: record, then shrink from the left while it stays valid
    while (formed === required) {
      if (right - left + 1 < bestLength) {
        bestLength = right - left + 1;
        bestStart = left;
      }
      const outgoing = s[left];
      if (need.has(outgoing)) {
        window.set(outgoing, window.get(outgoing) - 1);
        if (window.get(outgoing) < need.get(outgoing)) formed--;
      }
      left++;
    }
  }
  return bestLength === Infinity ? '' : s.slice(bestStart, bestStart + bestLength);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('ADOBECODEBANC', 'ABC'), 'BANC');
  assert.strictEqual(solve('a', 'a'), 'a');
  assert.strictEqual(solve('a', 'aa'), '');
  assert.strictEqual(solve('ab', 'b'), 'b');
  assert.strictEqual(solve('abc', 'xyz'), '');
  assert.strictEqual(solve('aaab', 'aab'), 'aab');
  assert.strictEqual(solve('bba', 'ab'), 'ba');
  assert.strictEqual(solve('xyzabcxyz', 'cba'), 'abc');
}
console.log('✓ 14-minimum-window-substring passed');

module.exports = { optimal, bruteForce };

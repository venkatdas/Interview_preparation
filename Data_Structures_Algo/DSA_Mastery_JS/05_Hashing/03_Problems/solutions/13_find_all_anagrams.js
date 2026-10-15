/**
 * 13. Find All Anagrams in a String   (LeetCode 438 — Medium)
 *
 * PROBLEM
 * Given strings s and p, return all start indices of p's anagrams in s.
 *
 * EXAMPLES
 * Input: s = "cbaebabacd", p = "abc"   Output: [0, 6]   Explanation: "cba" at 0, "bac" at 6
 * Input: s = "abab", p = "ab"          Output: [0, 1, 2]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Lowercase letters only? (yes -> 26-slot arrays work; we use Map to show hashing)
 * - p longer than s? (then no answers, return [])
 * - Overlapping matches allowed? (yes)
 *
 * APPROACH 1 — Brute force   O(n * m) time, O(m) space
 * For every window of length m in s, count its letters and compare with p's counts.
 * Each comparison costs O(m).
 *
 * APPROACH 2 — Optimal (frequency map + fixed window, track "matched" count)   O(n) time, O(k) space
 * Hashing view: we never rebuild counts. Keep a Map `need` = counts of p. Keep a counter
 * `matched` = how many distinct letters currently have exactly the right count.
 * Slide a window of size m over s:
 *   - add s[right]: decrement need[ch]. If it becomes 0 -> matched++. If it goes from 0 to -1 -> matched--.
 *   - remove s[left] when window is too big: increment need[ch]. If it becomes 0 -> matched++;
 *     if it went from 0 to 1 -> matched--.
 *   - window is an anagram when matched === number of distinct letters in p.
 * Each character enters and leaves once -> O(n). Comparing maps every time would be O(26n).
 *
 * Dry run on s = "abab", p = "ab": need {a:1, b:1}, distinct = 2
 *   r=0 'a': need a:0 -> matched 1
 *   r=1 'b': need b:0 -> matched 2, window [0,1] size 2 == m -> record 0
 *   r=2 'a': need a:-1 -> matched 1; window too big, remove s[0]='a': need a:0 -> matched 2 -> record 1
 *   r=3 'b': need b:-1 -> matched 1; remove s[1]='b': need b:0 -> matched 2 -> record 2
 *   result [0, 1, 2]
 *
 * EDGE CASES
 * - p longer than s -> []
 * - s === p -> [0]
 * - p with repeated letters ("aab")
 * - No match at all -> []
 */

function bruteForce(s, p) {
  const result = [];
  const sortedP = [...p].sort().join('');
  for (let start = 0; start + p.length <= s.length; start++) {
    const window = [...s.slice(start, start + p.length)].sort().join('');
    if (window === sortedP) result.push(start);
  }
  return result;
}

function optimal(s, p) {
  const result = [];
  if (p.length > s.length) return result;

  const need = new Map(); // letter -> how many more we still need inside the window
  for (const ch of p) need.set(ch, (need.get(ch) ?? 0) + 1);
  const distinct = need.size;
  let matched = 0; // letters whose need is exactly 0

  let left = 0;
  for (let right = 0; right < s.length; right++) {
    const incoming = s[right];
    if (need.has(incoming)) {
      need.set(incoming, need.get(incoming) - 1);
      if (need.get(incoming) === 0) matched++;
      else if (need.get(incoming) === -1) matched--; // we now have one too many
    }

    if (right - left + 1 > p.length) {
      const outgoing = s[left];
      if (need.has(outgoing)) {
        need.set(outgoing, need.get(outgoing) + 1);
        if (need.get(outgoing) === 0) matched++;
        else if (need.get(outgoing) === 1) matched--; // we now have one too few
      }
      left++;
    }

    if (matched === distinct) result.push(left);
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
console.log('✓ 13-find-all-anagrams passed');

module.exports = { optimal, bruteForce };

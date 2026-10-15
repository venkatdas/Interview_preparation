/**
 * 10. Palindrome Partitioning   (LeetCode 131 — Medium)
 *
 * PROBLEM
 * Given a string s, split it into pieces so that every piece is a palindrome.
 * Return all such partitions.
 *
 * EXAMPLES
 * Input: "aab"   Output: [["a","a","b"],["aa","b"]]
 * Input: "a"     Output: [["a"]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= s.length <= 16 (so 2^15 ways to cut at most)
 * - Lowercase letters only
 * - Is a single character a palindrome? (yes, so a solution always exists)
 *
 * APPROACH 1 — Brute force   O(2^n * n) time
 * There are n-1 gaps between characters; each gap is either a cut or not -> 2^(n-1)
 * partitions. Generate them all with a bit mask, then check every piece.
 *
 * APPROACH 2 — Optimal (Backtracking over cut positions)   O(n * 2^n) worst, O(n) stack
 * go(start, parts): if start === s.length we used up the string -> record.
 * Otherwise try every end >= start; if s[start..end] is a palindrome, take it as the
 * next piece and recurse from end + 1. Pruning happens naturally: a non-palindrome
 * piece is never taken, so whole subtrees are skipped.
 * Optional speed-up: precompute isPal[i][j] with DP so each check is O(1).
 *
 * Dry run "aab":
 *   go(0,[])
 *     end=0 "a" pal -> go(1,["a"])
 *       end=1 "a" pal -> go(2,["a","a"])
 *         end=2 "b" pal -> go(3,["a","a","b"]) record
 *       end=2 "ab" not pal -> skip
 *     end=1 "aa" pal -> go(2,["aa"])
 *       end=2 "b" pal -> go(3,["aa","b"]) record
 *     end=2 "aab" not pal
 *
 * EDGE CASES
 * - all same letters "aaa" -> 4 partitions (2^(n-1))
 * - no palindromes longer than 1 ("abc") -> only [["a","b","c"]]
 */

function isPalindrome(s, left, right) {
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++; right--;
  }
  return true;
}

function bruteForce(s) {
  const n = s.length;
  const results = [];
  if (n === 0) return [[]];
  for (let mask = 0; mask < (1 << (n - 1)); mask++) {
    const parts = [];
    let start = 0;
    let ok = true;
    for (let i = 0; i < n; i++) {
      // cut after position i if bit i is set, or at the very end
      if (i === n - 1 || (mask & (1 << i))) {
        if (!isPalindrome(s, start, i)) { ok = false; break; }
        parts.push(s.slice(start, i + 1));
        start = i + 1;
      }
    }
    if (ok) results.push(parts);
  }
  return results;
}

function optimal(s) {
  const results = [];

  function go(start, parts) {
    if (start === s.length) { results.push([...parts]); return; }
    for (let end = start; end < s.length; end++) {
      if (!isPalindrome(s, start, end)) continue;  // prune: not a valid piece
      parts.push(s.slice(start, end + 1));         // choose
      go(end + 1, parts);                          // explore the rest of the string
      parts.pop();                                 // un-choose
    }
  }

  go(0, []);
  return results;
}

// ---------- tests ----------
const assert = require('assert');
const normalize = (list) => [...list].sort((a, b) => a.join('|').localeCompare(b.join('|')));

for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(normalize(solve('aab')), normalize([['a', 'a', 'b'], ['aa', 'b']]));
  assert.deepStrictEqual(solve('a'), [['a']]);
  assert.deepStrictEqual(normalize(solve('aaa')),
    normalize([['a', 'a', 'a'], ['a', 'aa'], ['aa', 'a'], ['aaa']]));
  assert.deepStrictEqual(solve('abc'), [['a', 'b', 'c']]);
  assert.deepStrictEqual(normalize(solve('abba')),
    normalize([['a', 'b', 'b', 'a'], ['a', 'bb', 'a'], ['abba']]));
}
assert.deepStrictEqual(normalize(optimal('abacaba')), normalize(bruteForce('abacaba')));
console.log('✓ 10-palindrome-partitioning passed');

module.exports = { optimal, bruteForce };

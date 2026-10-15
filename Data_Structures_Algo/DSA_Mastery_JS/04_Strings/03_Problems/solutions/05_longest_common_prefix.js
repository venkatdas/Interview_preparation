/**
 * 05. Longest Common Prefix   (LeetCode 14 — Easy)
 *
 * PROBLEM
 * Given an array of strings, return the longest prefix shared by ALL of them.
 * If there is none, return "".
 *
 * EXAMPLES
 * Input: ["flower","flow","flight"]   Output: "fl"
 * Input: ["dog","racecar","car"]      Output: ""   Explanation: first letters already differ
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can the array be empty? (return "")
 * - Can a string be empty? (then the answer is "")
 * - Case-sensitive? (yes, "A" and "a" differ)
 *
 * APPROACH 1 — Brute force   O(S) time, O(1) space   (S = total characters)
 * Take the first string as the candidate prefix. For every other string, shrink the
 * candidate from the right until that string starts with it. Shrinking uses slice,
 * which copies, so it is a bit wasteful but still bounded by S.
 *
 * APPROACH 2 — Optimal (vertical scan)   O(S) time, O(1) space
 * Compare column by column: look at character 0 of every word, then character 1, ...
 * Stop at the first column where some word is too short or has a different character.
 * Worst case is still O(S) (all strings equal), but we stop as early as possible.
 *
 * Dry run on ["flower","flow","flight"]:
 *   col 0: f f f  ok
 *   col 1: l l l  ok
 *   col 2: o o i  mismatch -> answer = first.slice(0, 2) = "fl"
 *
 * EDGE CASES
 * - []                     -> ""
 * - ["a"]                  -> "a"  (one word is its own prefix)
 * - ["", "abc"]            -> ""
 * - ["abc", "abc"]         -> "abc" (do not run past the end of the shortest word)
 */

function bruteForce(strs) {
  if (strs.length === 0) return '';
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (!strs[i].startsWith(prefix)) {
      prefix = prefix.slice(0, -1); // drop last char and retry
      if (prefix === '') return '';
    }
  }
  return prefix;
}

function optimal(strs) {
  if (strs.length === 0) return '';
  const first = strs[0];

  for (let col = 0; col < first.length; col++) {
    const ch = first[col];
    for (let row = 1; row < strs.length; row++) {
      // either this word ended, or its char in this column differs
      if (col >= strs[row].length || strs[row][col] !== ch) {
        return first.slice(0, col);
      }
    }
  }
  return first; // every column of the first word matched everywhere
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(['flower', 'flow', 'flight']), 'fl');
  assert.strictEqual(solve(['dog', 'racecar', 'car']), '');
  assert.strictEqual(solve([]), '');
  assert.strictEqual(solve(['a']), 'a');
  assert.strictEqual(solve(['', 'abc']), '');
  assert.strictEqual(solve(['abc', 'abc']), 'abc');
  assert.strictEqual(solve(['abcd', 'ab']), 'ab');
}
console.log('✓ 05-longest-common-prefix passed');

module.exports = { optimal, bruteForce };

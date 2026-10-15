/**
 * 04. Ransom Note   (LeetCode 383 — Easy)
 *
 * PROBLEM
 * Given two strings ransomNote and magazine, return true if ransomNote can be built
 * using letters from magazine. Each letter in magazine can be used only once.
 *
 * EXAMPLES
 * Input: ransomNote = "a", magazine = "b"     Output: false
 * Input: ransomNote = "aa", magazine = "ab"   Output: false   Explanation: only one 'a' available
 * Input: ransomNote = "aa", magazine = "aab"  Output: true
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Only lowercase letters? (assume yes; a Map works for anything)
 * - Can ransomNote be empty? (yes -> true, nothing to build)
 * - Is magazine allowed to have leftover letters? (yes)
 *
 * APPROACH 1 — Brute force   O(n * m) time, O(m) space
 * For every letter in the note, search the magazine for it and remove the first match.
 * Each search+remove is O(m).
 *
 * APPROACH 2 — Optimal (frequency count)   O(n + m) time, O(k) space
 * Count every letter in magazine once. Then walk the note and "spend" letters:
 * if the count for a letter is already 0 (or missing), we can't build it -> false.
 * Quick exit: if the note is longer than the magazine it's impossible.
 *
 * Dry run on note = "aa", magazine = "aab":
 *   counts = {a:2, b:1}
 *   'a' -> a:1   'a' -> a:0   done -> true
 * Dry run on note = "aa", magazine = "ab":
 *   counts = {a:1, b:1}
 *   'a' -> a:0   'a' -> count is 0 -> false
 *
 * EDGE CASES
 * - note longer than magazine -> false without counting
 * - empty note -> true
 * - note has a letter magazine lacks entirely -> false
 */

function bruteForce(ransomNote, magazine) {
  let pool = magazine;
  for (const ch of ransomNote) {
    const position = pool.indexOf(ch);
    if (position === -1) return false;
    pool = pool.slice(0, position) + pool.slice(position + 1); // consume it
  }
  return true;
}

function optimal(ransomNote, magazine) {
  if (ransomNote.length > magazine.length) return false;

  const available = new Map();
  for (const ch of magazine) available.set(ch, (available.get(ch) ?? 0) + 1);

  for (const ch of ransomNote) {
    const left = available.get(ch) ?? 0;
    if (left === 0) return false; // ran out of this letter
    available.set(ch, left - 1);
  }
  return true;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('a', 'b'), false);
  assert.strictEqual(solve('aa', 'ab'), false);
  assert.strictEqual(solve('aa', 'aab'), true);
  assert.strictEqual(solve('', 'anything'), true);
  assert.strictEqual(solve('abc', 'cba'), true);
  assert.strictEqual(solve('abcd', 'abc'), false);
  assert.strictEqual(solve('zz', 'zzz'), true);
}
console.log('✓ 04-ransom-note passed');

module.exports = { optimal, bruteForce };

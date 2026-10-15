/**
 * 04. First Unique Character in a String   (LeetCode 387 — Easy)
 *
 * PROBLEM
 * Given a string s, return the index of the first character that appears exactly once.
 * If there is no such character, return -1.
 *
 * EXAMPLES
 * Input: "leetcode"       Output: 0   Explanation: 'l' appears once
 * Input: "loveleetcode"   Output: 2   Explanation: 'l' and 'o' repeat, 'v' is the first unique
 * Input: "aabb"           Output: -1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Only lowercase letters? (yes -> 26-slot array)
 * - Return the index or the character? (index)
 * - Empty string? (return -1)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * For each index i, scan the whole string to see if s[i] appears anywhere else.
 * The first i with no other occurrence is the answer.
 *
 * APPROACH 2 — Optimal (frequency table, two passes)   O(n) time, O(1) space
 * Pass 1: count every character. Pass 2: walk left to right and return the first index
 * whose character has count 1. The second pass guarantees "first" in string order.
 *
 * Dry run on "loveleetcode":
 *   counts: l:2 o:2 v:1 e:4 t:1 c:1 d:1
 *   pass 2: i=0 'l' count 2, i=1 'o' count 2, i=2 'v' count 1 -> return 2
 *
 * EDGE CASES
 * - ""        -> -1
 * - "z"       -> 0
 * - all same  -> -1
 * - unique char is the last one -> still found by pass 2
 */

function bruteForce(s) {
  for (let i = 0; i < s.length; i++) {
    let seenElsewhere = false;
    for (let j = 0; j < s.length; j++) {
      if (i !== j && s[i] === s[j]) { seenElsewhere = true; break; }
    }
    if (!seenElsewhere) return i;
  }
  return -1;
}

function optimal(s) {
  const counts = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    counts[s.charCodeAt(i) - 97]++;
  }
  // second pass in string order so the FIRST unique wins
  for (let i = 0; i < s.length; i++) {
    if (counts[s.charCodeAt(i) - 97] === 1) return i;
  }
  return -1;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('leetcode'), 0);
  assert.strictEqual(solve('loveleetcode'), 2);
  assert.strictEqual(solve('aabb'), -1);
  assert.strictEqual(solve(''), -1);
  assert.strictEqual(solve('z'), 0);
  assert.strictEqual(solve('aabbc'), 4);
  assert.strictEqual(solve('dddd'), -1);
}
console.log('✓ 04-first-unique-character passed');

module.exports = { optimal, bruteForce };

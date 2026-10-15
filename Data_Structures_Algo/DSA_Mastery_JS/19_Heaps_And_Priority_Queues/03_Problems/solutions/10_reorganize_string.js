/**
 * 10. Reorganize String   (LeetCode 767 — Medium)
 *
 * PROBLEM
 * Rearrange the characters of s so that no two adjacent characters are the
 * same. Return any valid arrangement, or "" if impossible.
 *
 * EXAMPLES
 * Input: "aab"    Output: "aba"
 * Input: "aaab"   Output: ""      Explanation: three a's need at least two separators
 * Input: "vvvlo"  Output: "vlvov" (any valid answer accepted)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Lowercase only? (yes) Length? (<= 500)
 * - Any valid answer accepted? (yes -> we only test validity)
 * - When is it impossible? maxCount > ceil(n / 2)
 *
 * APPROACH 1 — Brute force (sort by count, fill even then odd slots)   O(n log n) time, O(n) space
 * Count letters, sort letters by count descending, then write them into
 * positions 0,2,4,... then 1,3,5,... The most frequent letter spreads out
 * first. Works, but the "why" is less obvious than the greedy below.
 *
 * APPROACH 2 — Optimal (greedy with max-heap)   O(n log 26) time, O(26) space
 * Always place the letter with the MOST remaining count, except we cannot
 * reuse the letter we just placed. So:
 *   pop the most frequent letter -> append it
 *   keep the PREVIOUS letter out of the heap for one step, then push it back
 *   (if its count is still > 0)
 * If the heap is empty while a letter is still waiting with count > 0, we are
 * stuck -> return "".
 *
 * Dry run on "aab":
 *   counts a:2 b:1   heap = {a2, b1}, prev = none
 *   pop a2 -> "a", a->1; push prev(none); prev = a1
 *   pop b1 -> "ab", b->0; push prev a1; prev = b0
 *   pop a1 -> "aba", a->0; prev b0 has 0 so not pushed; prev = a0
 *   heap empty, prev count 0 -> done: "aba"
 * Dry run on "aaab":
 *   pop a3 -> "a", prev=a2; pop b1 -> "ab", push a2, prev=b0;
 *   pop a2 -> "aba", prev=a1; heap empty but prev a1 > 0 -> ""
 *
 * EDGE CASES
 * - single character -> itself
 * - two same characters "aa" -> ""
 * - all distinct -> any permutation
 */

const { MinHeap } = require('../../02_Implementations/min_heap');

function countChars(s) {
  const counts = new Map();
  for (const ch of s) counts.set(ch, (counts.get(ch) || 0) + 1);
  return counts;
}

function bruteForce(s) {
  const counts = countChars(s);
  const letters = [...counts.keys()].sort((a, b) => counts.get(b) - counts.get(a));
  if (counts.get(letters[0]) > Math.ceil(s.length / 2)) return '';

  const result = new Array(s.length);
  let position = 0; // fill even indices first, then odd
  for (const letter of letters) {
    for (let i = 0; i < counts.get(letter); i++) {
      if (position >= s.length) position = 1;
      result[position] = letter;
      position += 2;
    }
  }
  return result.join('');
}

function optimal(s) {
  const counts = countChars(s);
  const maxHeap = MinHeap.from([...counts.entries()], (a, b) => b[1] - a[1]); // [char, count]

  let result = '';
  let previous = null; // the entry we just used, held out for one turn
  while (!maxHeap.isEmpty()) {
    const current = maxHeap.pop();
    result += current[0];
    current[1]--;
    if (previous && previous[1] > 0) maxHeap.push(previous); // it is allowed again
    previous = current;
  }
  // if the last-used letter still has copies, there was nothing to separate them
  return previous && previous[1] > 0 ? '' : result;
}

// ---------- tests ----------
const assert = require('assert');
function isValid(original, answer) {
  if (answer.length !== original.length) return false;
  if ([...answer].sort().join('') !== [...original].sort().join('')) return false;
  for (let i = 1; i < answer.length; i++) if (answer[i] === answer[i - 1]) return false;
  return true;
}
for (const solve of [bruteForce, optimal]) {
  assert.ok(isValid('aab', solve('aab')));
  assert.strictEqual(solve('aaab'), '');
  assert.ok(isValid('vvvlo', solve('vvvlo')));
  assert.strictEqual(solve('a'), 'a');
  assert.strictEqual(solve('aa'), '');
  assert.ok(isValid('abc', solve('abc')));
  assert.ok(isValid('aabbcc', solve('aabbcc')));
  assert.ok(isValid('aaabbc', solve('aaabbc')));
}
console.log('✓ 10-reorganize-string passed');

module.exports = { optimal, bruteForce };

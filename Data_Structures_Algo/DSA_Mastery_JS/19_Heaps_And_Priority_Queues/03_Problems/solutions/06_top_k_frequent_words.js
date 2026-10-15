/**
 * 06. Top K Frequent Words   (LeetCode 692 — Medium)
 *
 * PROBLEM
 * Given an array of words and an integer k, return the k most frequent words,
 * sorted by frequency from highest to lowest. Words with the same frequency
 * are sorted alphabetically.
 *
 * EXAMPLES
 * Input: words = ["i","love","leetcode","i","love","coding"], k = 2
 * Output: ["i","love"]   Explanation: both appear twice; "i" < "love" alphabetically
 * Input: words = ["the","day","is","sunny","the","the","the","sunny","is","is"], k = 4
 * Output: ["the","is","sunny","day"]   Explanation: counts 4, 3, 2, 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Lowercase only? (yes) k <= number of unique words? (yes)
 * - Output order matters here (unlike problem 05): freq desc, then alphabetical.
 *
 * APPROACH 1 — Brute force (count + full sort)   O(n log n) time, O(n) space
 * Count, then sort all unique words with a two-key comparator, take k.
 *
 * APPROACH 2 — Optimal (count + min-heap of size k)   O(n log k) time, O(n) space
 * The twist: the heap's "worst" element must be the one we want to EVICT:
 *   - lower count is worse
 *   - on a tie, the alphabetically LATER word is worse (we keep the earlier one)
 * So the min-heap comparator is: count ascending, then word DESCENDING.
 * After the loop, pop everything (worst first) and reverse to get best first.
 *
 * Dry run on ["i","love","leetcode","i","love","coding"], k = 2:
 *   counts: i:2, love:2, leetcode:1, coding:1
 *   push i(2)                     heap top = i
 *   push love(2)                  tie on count; "love" > "i" so love is "worse" -> top = love
 *   push leetcode(1) -> size 3 -> pop leetcode  (lowest count)
 *   push coding(1)   -> size 3 -> pop coding
 *   drain: pop love, pop i -> [love, i] -> reverse -> ["i","love"]
 *
 * EDGE CASES
 * - all words equal frequency -> purely alphabetical
 * - k = 1
 * - single word
 */

const { MinHeap } = require('../../02_Implementations/min_heap');

function countWords(words) {
  const counts = new Map();
  for (const word of words) counts.set(word, (counts.get(word) || 0) + 1);
  return counts;
}

function bruteForce(words, k) {
  const counts = countWords(words);
  return [...counts.keys()]
    .sort((a, b) => counts.get(b) - counts.get(a) || a.localeCompare(b))
    .slice(0, k);
}

function optimal(words, k) {
  const counts = countWords(words);
  // "worst" candidate on top: smaller count first, then alphabetically later word first
  const heap = new MinHeap((a, b) => counts.get(a) - counts.get(b) || b.localeCompare(a));
  for (const word of counts.keys()) {
    heap.push(word);
    if (heap.size() > k) heap.pop();
  }
  const result = [];
  while (!heap.isEmpty()) result.push(heap.pop()); // worst -> best
  return result.reverse();
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(['i', 'love', 'leetcode', 'i', 'love', 'coding'], 2), ['i', 'love']);
  assert.deepStrictEqual(
    solve(['the', 'day', 'is', 'sunny', 'the', 'the', 'the', 'sunny', 'is', 'is'], 4),
    ['the', 'is', 'sunny', 'day']
  );
  assert.deepStrictEqual(solve(['b', 'a', 'c'], 2), ['a', 'b']);
  assert.deepStrictEqual(solve(['x'], 1), ['x']);
  assert.deepStrictEqual(solve(['a', 'aa', 'aaa', 'aa', 'aaa', 'aaa'], 3), ['aaa', 'aa', 'a']);
}
console.log('✓ 06-top-k-frequent-words passed');

module.exports = { optimal, bruteForce };

/**
 * 18. Partition Labels   (LeetCode 763 — Medium)
 *
 * PROBLEM
 * Given a string s, split it into as many parts as possible so that each letter appears
 * in at most one part. Return the sizes of the parts, in order.
 *
 * EXAMPLES
 * Input: "ababcbacadefegdehijhklij"   Output: [9, 7, 8]
 *   Explanation: "ababcbaca" | "defegde" | "hijhklij"
 * Input: "eccbbbbdec"                 Output: [10]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Lowercase letters only? (yes -> array of 26 last indices)
 * - Maximise the NUMBER of parts? (yes: cut as early as legally possible)
 * - Parts must be contiguous and cover the whole string? (yes)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * Start a part at index `start`. Extend `end` while any letter in s[start..end] still
 * occurs after `end` (check with lastIndexOf each time). Each check can scan the string.
 *
 * APPROACH 2 — Optimal (last-index map + expanding end pointer)   O(n) time, O(1) space (26 slots)
 *   1. Precompute lastIndex[ch] = last position of each letter.
 *   2. Walk with i. Keep `partEnd` = the farthest last-index of any letter seen in the
 *      current part. Every letter in the part forces the part to extend to at least its
 *      last occurrence, so partEnd = max(partEnd, lastIndex[s[i]]).
 *   3. When i === partEnd, nothing in the part appears later -> cut here, record the size.
 * Two pointers: `partStart` (fixed until a cut) and `i` (scanning), with `partEnd` as a
 * moving boundary. Same spirit as merging intervals.
 *
 * Dry run on "ababcbacadefegdehijhklij":
 *   lastIndex: a->8, b->5, c->7, d->14, e->15, f->11, g->13, h->19, i->22, j->23, k->20, l->21
 *   i=0 'a' partEnd=8 ... i=4 'c' partEnd=max(8,7)=8 ... i=8 == partEnd -> part [0,8] size 9
 *   i=9 'd' partEnd=14, 'e' 15, 'f' 15, 'e', 'g' 15, 'd', 'e' i=15 == partEnd -> size 7
 *   i=16 'h' 19, 'i' 22, 'j' 23, ..., i=23 -> size 8
 *   [9, 7, 8]
 *
 * EDGE CASES
 * - Single character -> [1]
 * - All unique letters -> each its own part: "abc" -> [1, 1, 1]
 * - Same letter at both ends -> one part
 * - Empty -> []
 */

function bruteForce(s) {
  const sizes = [];
  let start = 0;
  while (start < s.length) {
    let end = start;
    for (let i = start; i <= end; i++) {
      end = Math.max(end, s.lastIndexOf(s[i])); // O(n) each
    }
    sizes.push(end - start + 1);
    start = end + 1;
  }
  return sizes;
}

function optimal(s) {
  const lastIndex = new Array(26).fill(-1);
  for (let i = 0; i < s.length; i++) lastIndex[s.charCodeAt(i) - 97] = i;

  const sizes = [];
  let partStart = 0;
  let partEnd = 0;

  for (let i = 0; i < s.length; i++) {
    partEnd = Math.max(partEnd, lastIndex[s.charCodeAt(i) - 97]);
    if (i === partEnd) {
      // every letter seen since partStart has its last occurrence <= i: safe to cut
      sizes.push(partEnd - partStart + 1);
      partStart = i + 1;
    }
  }
  return sizes;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve('ababcbacadefegdehijhklij'), [9, 7, 8]);
  assert.deepStrictEqual(solve('eccbbbbdec'), [10]);
  assert.deepStrictEqual(solve('a'), [1]);
  assert.deepStrictEqual(solve('abc'), [1, 1, 1]);
  assert.deepStrictEqual(solve('abca'), [4]);
  assert.deepStrictEqual(solve(''), []);
  assert.deepStrictEqual(solve('caedbdedda'), [1, 9]);
}
console.log('✓ 18-partition-labels passed');

module.exports = { optimal, bruteForce };

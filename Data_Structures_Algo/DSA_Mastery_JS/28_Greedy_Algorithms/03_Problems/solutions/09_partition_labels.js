/**
 * 09. Partition Labels   (LeetCode 763 — Medium)
 *
 * PROBLEM
 * Split string s into as many parts as possible so that each letter appears in at most one
 * part. Return the sizes of the parts, in order.
 *
 * EXAMPLES
 * Input: "ababcbacadefegdehijhklij"   Output: [9,7,8]
 *   Explanation: "ababcbaca" | "defegde" | "hijhklij"
 * Input: "eccbbbbdec"                 Output: [10]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Only lowercase letters? (yes)
 * - Must the parts, concatenated, give back s? (yes, contiguous parts)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(26) space
 * For each possible cut position, check that no letter on the left also appears on the
 * right (two sets). Cut whenever the check passes. Each check is O(n) -> O(n^2).
 *
 * APPROACH 2 — Optimal (farthest last occurrence)   O(n) time, O(26) space
 * 1. Record the last index of every letter.
 * 2. Scan with `partEnd` = the farthest last-index seen in the current part. A part must
 *    extend at least to partEnd. When i === partEnd, the part can close here, so cut.
 *
 * WHY GREEDY WORKS
 * Cutting at the FIRST position where it is legal can never hurt: every later legal cut
 * is still legal after we cut here (the right part only shrinks), and cutting earlier
 * gives more parts. This is the "farthest reach" idea from Jump Game applied to letters.
 *
 * Dry run on "ababcbacadefegdehijhklij" (first part):
 *   last = { a:8, b:5, c:7, d:14, e:15, f:11, g:13, h:19, i:22, j:23, k:20, l:21 }
 *   i=0 'a' partEnd=8 ... i=4 'c' partEnd=max(8,7)=8 ... i=8 == partEnd -> cut, size 9
 *
 * EDGE CASES
 * - single character -> [1]
 * - all same letter -> [n]
 * - all distinct letters -> [1,1,1,...]
 */

function bruteForce(s) {
  const sizes = [];
  let partStart = 0;
  for (let cut = 0; cut < s.length; cut++) {
    const left = new Set(s.slice(partStart, cut + 1));
    const right = s.slice(cut + 1);
    let legal = true;
    for (const ch of right) if (left.has(ch)) { legal = false; break; }
    if (legal) {
      sizes.push(cut + 1 - partStart);
      partStart = cut + 1;
    }
  }
  return sizes;
}

function optimal(s) {
  const lastIndex = {};
  for (let i = 0; i < s.length; i++) lastIndex[s[i]] = i;

  const sizes = [];
  let partStart = 0;
  let partEnd = 0;
  for (let i = 0; i < s.length; i++) {
    partEnd = Math.max(partEnd, lastIndex[s[i]]); // part must reach the last copy of s[i]
    if (i === partEnd) {                           // every letter seen so far is finished
      sizes.push(i - partStart + 1);
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
  assert.deepStrictEqual(solve('aaaa'), [4]);
  assert.deepStrictEqual(solve('abc'), [1, 1, 1]);
  assert.deepStrictEqual(solve('abac'), [3, 1]);
  assert.deepStrictEqual(solve(''), []);
}
console.log('✓ 09-partition-labels passed');

module.exports = { optimal, bruteForce };

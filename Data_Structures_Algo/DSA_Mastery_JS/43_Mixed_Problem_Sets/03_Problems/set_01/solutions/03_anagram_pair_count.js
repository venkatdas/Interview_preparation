/**
 * 03. Anagram Pair Count   (Original — Easy)
 *
 * PROBLEM
 * A word game shows a list of words. Two positions i < j form a "twin pair" if
 * words[i] and words[j] are anagrams of each other (same letters, same counts; equal
 * words also count). Return the number of twin pairs.
 *
 * EXAMPLES
 * Input: ["listen", "silent", "enlist", "google"]   Output: 3   Explanation: 3 words in one group -> 3 pairs
 * Input: ["ab", "ba", "ab"]                          Output: 3
 * Input: ["a", "b"]                                  Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Lowercase English letters only? (yes) Can words be empty? (yes; two empty words are twins)
 * - Up to 10^5 words, each up to 100 letters, so comparing all pairs is too slow.
 *
 * APPROACH 1 — Brute force   O(n^2 * k log k) time, O(k) space
 * For every pair (i, j) sort both words and compare.
 *
 * APPROACH 2 — Optimal (canonical key + hash map + counting pairs)   O(n * k) time, O(n * k) space
 * Turn each word into a canonical key: a 26-slot letter count joined with '#'.
 * Group sizes come from a Map key -> count. While scanning, a word with key K pairs
 * with every earlier word that has key K, so add map.get(K) before incrementing.
 * (Equivalent: sum c*(c-1)/2 over all groups.)
 *
 * Dry run on ["ab", "ba", "ab"]:
 *   "ab" key=1#1#0...  seen 0 -> +0  map{K:1}  total=0
 *   "ba" key=1#1#0...  seen 1 -> +1  map{K:2}  total=1
 *   "ab" key=1#1#0...  seen 2 -> +2  map{K:3}  total=3
 *   answer 3
 *
 * EDGE CASES
 * - empty list or one word  -> 0
 * - duplicate identical words count as anagrams
 * - empty strings: all have the same key
 *
 * COMMON MISTAKES
 * - Joining counts without a separator: [1,11] and [11,1] both become "111".
 * - Counting groups instead of pairs (a group of 3 gives 3 pairs, not 1 or 2).
 */

function bruteForce(words) {
  const sorted = words.map((w) => w.split('').sort().join(''));
  let total = 0;
  for (let i = 0; i < words.length; i++)
    for (let j = i + 1; j < words.length; j++)
      if (sorted[i] === sorted[j]) total++;
  return total;
}

function keyOf(word) {
  const counts = new Array(26).fill(0);
  for (let i = 0; i < word.length; i++) counts[word.charCodeAt(i) - 97]++;
  return counts.join('#');
}

function optimal(words) {
  const seen = new Map();
  let total = 0;
  for (const w of words) {
    const key = keyOf(w);
    const c = seen.get(key) || 0;
    total += c; // pairs with every earlier twin
    seen.set(key, c + 1);
  }
  return total;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(['listen', 'silent', 'enlist', 'google']), 3);
  assert.strictEqual(solve(['ab', 'ba', 'ab']), 3);
  assert.strictEqual(solve(['a', 'b']), 0);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve(['', '']), 1);
  assert.strictEqual(solve(['abc']), 0);
  assert.strictEqual(solve(['aab', 'abb']), 0); // same letters, different counts
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(103);
for (let t = 0; t < 300; t++) {
  const n = Math.floor(rand() * 10);
  const words = Array.from({ length: n }, () => {
    const len = Math.floor(rand() * 4);
    let w = '';
    for (let i = 0; i < len; i++) w += 'abc'[Math.floor(rand() * 3)];
    return w;
  });
  assert.strictEqual(optimal(words), bruteForce(words));
}
console.log('✓ set_01/03_anagram_pair_count passed');
module.exports = { optimal, bruteForce };

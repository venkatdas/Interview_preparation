/**
 * 08. Group Anagrams   (LeetCode 49 — Medium)
 *
 * PROBLEM
 * Given an array of strings, group the anagrams together. Return the groups in any order;
 * each group's words can be in any order.
 *
 * EXAMPLES
 * Input: ["eat","tea","tan","ate","nat","bat"]
 * Output: [["bat"],["nat","tan"],["ate","eat","tea"]]
 * Input: [""]     Output: [[""]]
 * Input: ["a"]    Output: [["a"]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Only lowercase letters? (yes -> can use a 26-count key)
 * - Does the order of groups / words matter? (no)
 * - How long are the words? (short -> sorting them is cheap; the count key is still better)
 *
 * APPROACH 1 — Brute force   O(n^2 * k) time, O(n) space   (n words, k = max word length)
 * For each word not yet grouped, compare it with every later word using an isAnagram check
 * (O(k) with a frequency table), collecting matches into a group.
 *
 * APPROACH 2 — Optimal (canonical key + hash map)   O(n * k) time, O(n * k) space
 * Two words are anagrams exactly when they have the same letter counts. So build a KEY
 * from the counts: an array of 26 counts joined with a separator, e.g. "1,0,0,...,1,...".
 * All anagrams produce the same key -> they land in the same Map bucket.
 * (Alternative key: the sorted word, O(n * k log k). Fine too, slightly slower.)
 *
 * Dry run on ["eat","tea","tan"]:
 *   "eat" -> counts a:1 e:1 t:1 -> key K1 -> Map{K1:["eat"]}
 *   "tea" -> same counts -> key K1 -> Map{K1:["eat","tea"]}
 *   "tan" -> a:1 n:1 t:1 -> key K2 -> Map{K1:[...], K2:["tan"]}
 *   return [["eat","tea"],["tan"]]
 *
 * EDGE CASES
 * - [""]         -> [[""]]   (empty word has a key too: all zeros)
 * - ["a"]        -> [["a"]]
 * - duplicates ["ab","ab"] -> both in the same group
 * - why join with ',' and not ''? "1,11" vs "11,1" would collide as "111" without a separator
 */

function isAnagram(a, b) {
  if (a.length !== b.length) return false;
  const counts = new Array(26).fill(0);
  for (let i = 0; i < a.length; i++) {
    counts[a.charCodeAt(i) - 97]++;
    counts[b.charCodeAt(i) - 97]--;
  }
  return counts.every((count) => count === 0);
}

function bruteForce(strs) {
  const grouped = new Array(strs.length).fill(false);
  const result = [];
  for (let i = 0; i < strs.length; i++) {
    if (grouped[i]) continue;
    const group = [strs[i]];
    grouped[i] = true;
    for (let j = i + 1; j < strs.length; j++) {
      if (!grouped[j] && isAnagram(strs[i], strs[j])) {
        group.push(strs[j]);
        grouped[j] = true;
      }
    }
    result.push(group);
  }
  return result;
}

function optimal(strs) {
  const groups = new Map();
  for (const word of strs) {
    const counts = new Array(26).fill(0);
    for (let i = 0; i < word.length; i++) {
      counts[word.charCodeAt(i) - 97]++;
    }
    const key = counts.join(','); // separator avoids "1,11" / "11,1" collisions
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(word);
  }
  return [...groups.values()];
}

// ---------- tests ----------
const assert = require('assert');

// order does not matter, so normalize: sort inside each group, then sort the groups
function normalize(groups) {
  return groups.map((group) => [...group].sort()).sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
}

for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(
    normalize(solve(['eat', 'tea', 'tan', 'ate', 'nat', 'bat'])),
    normalize([['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']])
  );
  assert.deepStrictEqual(normalize(solve([''])), [['']]);
  assert.deepStrictEqual(normalize(solve(['a'])), [['a']]);
  assert.deepStrictEqual(normalize(solve([])), []);
  assert.deepStrictEqual(normalize(solve(['ab', 'ab', 'ba'])), [['ab', 'ab', 'ba']]);
  assert.deepStrictEqual(normalize(solve(['abc', 'def'])), [['abc'], ['def']]);
}
console.log('✓ 08-group-anagrams passed');

module.exports = { optimal, bruteForce };

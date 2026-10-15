/**
 * 08. Group Anagrams   (LeetCode 49 — Medium)
 *
 * PROBLEM
 * Given an array of strings, group the anagrams together. Return the groups in any order.
 *
 * EXAMPLES
 * Input: ["eat","tea","tan","ate","nat","bat"]
 * Output: [["eat","tea","ate"], ["tan","nat"], ["bat"]]
 * Input: [""]     Output: [[""]]
 * Input: ["a"]    Output: [["a"]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Lowercase letters only? (yes -> enables the 26-count key)
 * - Does group order or order inside a group matter? (no)
 * - Max word length? (short words -> sorting is fine; long words -> counting key is better)
 *
 * APPROACH 1 — Brute force   O(n^2 * L) time, O(n) space
 * For each word, compare it against the representative of every existing group using
 * an "is anagram" check (count letters). n groups in the worst case -> O(n^2 * L).
 *
 * APPROACH 2 — Optimal (group by canonical key)   O(n * L log L) time, O(n * L) space
 * Anagrams become IDENTICAL once you sort their letters: "eat","tea","ate" -> "aet".
 * That sorted string is the canonical key. Map key -> list of words.
 *
 * Even better key, O(n * L): count the 26 letters and join the counts with a separator:
 * "eat" -> "1#0#0#0#1#...#1#..." (a 26-slot fingerprint). No sorting needed.
 *
 * Dry run on ["eat","tea","tan","ate","nat","bat"] with sorted keys:
 *   eat -> aet : {aet:[eat]}
 *   tea -> aet : {aet:[eat,tea]}
 *   tan -> ant : {aet:[eat,tea], ant:[tan]}
 *   ate -> aet : {aet:[eat,tea,ate], ant:[tan]}
 *   nat -> ant : {aet:[...], ant:[tan,nat]}
 *   bat -> abt : {aet:[...], ant:[...], abt:[bat]}
 *   return the map's values
 *
 * EDGE CASES
 * - Empty string is a valid word: [""] -> [[""]]
 * - All words identical -> one group
 * - No anagrams at all -> every word its own group
 */

function isAnagram(a, b) {
  if (a.length !== b.length) return false;
  const counts = new Array(26).fill(0);
  for (let i = 0; i < a.length; i++) {
    counts[a.charCodeAt(i) - 97]++;
    counts[b.charCodeAt(i) - 97]--;
  }
  return counts.every((c) => c === 0);
}

function bruteForce(strs) {
  const groups = [];
  for (const word of strs) {
    const group = groups.find((g) => isAnagram(g[0], word));
    if (group) group.push(word);
    else groups.push([word]);
  }
  return groups;
}

function optimal(strs) {
  const groups = new Map(); // canonical key -> words

  for (const word of strs) {
    const key = [...word].sort().join('');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(word);
  }
  return [...groups.values()];
}

// O(n * L) version: 26-count fingerprint as the key (no sorting).
function optimalCountKey(strs) {
  const groups = new Map();
  for (const word of strs) {
    const counts = new Array(26).fill(0);
    for (const ch of word) counts[ch.charCodeAt(0) - 97]++;
    const key = counts.join('#'); // separator so [1,11] != [11,1]
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(word);
  }
  return [...groups.values()];
}

// ---------- tests ----------
const assert = require('assert');
// normalise: sort words inside each group, then sort groups, so order doesn't matter
const normalise = (groups) => groups.map((g) => [...g].sort()).sort((a, b) => a[0].localeCompare(b[0]) || a.length - b.length);

for (const solve of [bruteForce, optimal, optimalCountKey]) {
  assert.deepStrictEqual(
    normalise(solve(['eat', 'tea', 'tan', 'ate', 'nat', 'bat'])),
    normalise([['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']])
  );
  assert.deepStrictEqual(solve(['']), [['']]);
  assert.deepStrictEqual(solve(['a']), [['a']]);
  assert.deepStrictEqual(solve([]), []);
  assert.deepStrictEqual(normalise(solve(['abc', 'abc'])), [['abc', 'abc']]);
  assert.deepStrictEqual(normalise(solve(['ab', 'cd'])), [['ab'], ['cd']]);
}
console.log('✓ 08-group-anagrams passed');

module.exports = { optimal, bruteForce, optimalCountKey };

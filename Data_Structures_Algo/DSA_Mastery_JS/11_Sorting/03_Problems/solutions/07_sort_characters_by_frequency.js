/**
 * 07. Sort Characters By Frequency   (LeetCode 451 — Medium)
 *
 * PROBLEM
 * Given a string, sort its characters by decreasing frequency. Characters with the
 * same frequency may appear in any order, but all copies of a character stay together.
 *
 * EXAMPLES
 * Input: "tree"     Output: "eert"  ("eetr" also valid)
 * Input: "cccaaa"   Output: "aaaccc" or "cccaaa"
 * Input: "Aabb"     Output: "bbAa"  ('A' and 'a' are different characters)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Case sensitive? (yes)
 * - Ties: any order ok? (yes, but a deterministic tie-break is nicer; we use char order)
 * - n <= 5 * 10^5
 *
 * APPROACH 1 — Brute force (count + comparator sort)   O(n log n) time, O(n) space
 * Count with a Map, sort the distinct characters by count desc, build the string.
 * Really O(k log k) for k distinct chars plus O(n) to count and build - already fast.
 *
 * APPROACH 2 — Optimal (bucket sort by frequency)   O(n) time, O(n) space
 * The frequency of any character is between 1 and n, so create n + 1 buckets:
 * bucket[f] = list of characters that appear exactly f times. Walk buckets from n
 * down to 1 and append each character repeated f times. No comparison sort at all.
 *
 * Dry run "tree":
 *   counts: t:1, r:1, e:2
 *   buckets: [1] -> [t, r]   [2] -> [e]
 *   walk from high to low: "ee" + "t" + "r" = "eetr"
 *
 * EDGE CASES
 * - "" -> ""
 * - single character "a" -> "a"
 * - all same "aaaa" -> "aaaa"
 * - all distinct -> any order
 */

function bruteForce(s) {
  const counts = new Map();
  for (const ch of s) counts.set(ch, (counts.get(ch) || 0) + 1);
  const chars = [...counts.keys()];
  chars.sort((a, b) => counts.get(b) - counts.get(a) || (a < b ? -1 : a > b ? 1 : 0)); // freq desc, then char code
  return chars.map((ch) => ch.repeat(counts.get(ch))).join('');
}

function optimal(s) {
  const counts = new Map();
  for (const ch of s) counts.set(ch, (counts.get(ch) || 0) + 1);

  const buckets = Array.from({ length: s.length + 1 }, () => []);  // index = frequency
  for (const [ch, freq] of counts) buckets[freq].push(ch);

  let result = '';
  for (let freq = s.length; freq >= 1; freq--) {
    for (const ch of buckets[freq].sort()) result += ch.repeat(freq); // .sort() only for determinism
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
function frequencySignature(str) {           // verify the output is a valid answer
  const counts = new Map();
  for (const ch of str) counts.set(ch, (counts.get(ch) || 0) + 1);
  return counts;
}
function isValid(input, output) {
  if (input.length !== output.length) return false;
  const inCounts = frequencySignature(input), outCounts = frequencySignature(output);
  if (inCounts.size !== outCounts.size) return false;
  for (const [ch, c] of inCounts) if (outCounts.get(ch) !== c) return false;
  // frequencies must be non-increasing along the output and each char contiguous
  let i = 0;
  let lastFreq = Infinity;
  const seen = new Set();
  while (i < output.length) {
    const ch = output[i];
    if (seen.has(ch)) return false;
    seen.add(ch);
    let j = i;
    while (j < output.length && output[j] === ch) j++;
    const freq = j - i;
    if (freq > lastFreq) return false;
    lastFreq = freq;
    i = j;
  }
  return true;
}

for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('tree'), 'eert');
  assert.strictEqual(solve('cccaaa'), 'aaaccc');
  assert.strictEqual(solve('Aabb'), 'bbAa');
  assert.strictEqual(solve(''), '');
  assert.strictEqual(solve('a'), 'a');
  assert.strictEqual(solve('aaaa'), 'aaaa');
  for (const input of ['tree', 'cccaaa', 'Aabb', 'loveleetcode', 'mississippi', 'abc']) {
    assert.ok(isValid(input, solve(input)), `invalid output for ${input}`);
  }
}
console.log('✓ 07-sort-characters-by-frequency passed');

module.exports = { optimal, bruteForce };

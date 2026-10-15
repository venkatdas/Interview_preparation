/**
 * 17. Minimum Deletions to Make Character Frequencies Unique   (LeetCode 1647 — Medium)
 *
 * PROBLEM
 * A string is "good" if no two different characters have the same frequency.
 * Return the minimum number of characters to delete to make s good.
 *
 * EXAMPLES
 * Input: "aab"        Output: 0   Explanation: a:2, b:1 already unique
 * Input: "aaabbbcc"   Output: 2   Explanation: delete two b's -> a:3, b:1, c:2
 * Input: "ceabaacb"   Output: 2   Explanation: a:3, b:2, c:2, e:1 -> delete one c and the e (c:1 clashes with e:1, so delete e too)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Lowercase only? (yes, so at most 26 distinct frequencies)
 * - Can a frequency drop to 0 (character removed entirely)? (yes, 0 is allowed to repeat)
 *
 * APPROACH 1 — Brute force   O(26 * maxFreq^26) in theory
 * For each character try every target frequency 0..count; pick the combination with unique
 * non-zero frequencies and the fewest deletions. Only tiny inputs; done here with recursion.
 *
 * APPROACH 2 — Optimal (sort frequencies descending, lower each clash)   O(n + 26 log 26) time, O(26) space
 * Sort counts from largest to smallest. Keep a set of used frequencies. For each count, while
 * it is > 0 and already used, decrement it (one deletion each). Then mark it used.
 *
 * WHY GREEDY WORKS
 * We can only DECREASE frequencies. Processing from the largest, each character takes the
 * highest free frequency at or below its count. Taking a lower one than necessary would only
 * waste deletions and push later (smaller) characters even lower. Exchange argument: swap any
 * optimal assignment to use the highest free slot for the current character - deletions never
 * increase.
 *
 * Dry run on "aaabbbcc": counts [3,3,2] sorted desc
 *   3 -> free, used {3}
 *   3 -> taken, lower to 2 (1 deletion). 2 is free -> used {3,2}, deletions 1
 *   2 -> taken, lower to 1 (1 deletion). 1 is free -> used {3,2,1}, deletions 2 -> answer 2
 *
 * EDGE CASES
 * - all distinct characters (every freq 1) -> deletions until all but one are 0
 * - single character type -> 0
 * - frequencies collide down to 0 -> stop at 0, which is allowed to repeat
 */

function bruteForce(s) {
  const counts = Object.values([...s].reduce((acc, ch) => ((acc[ch] = (acc[ch] || 0) + 1), acc), {}));
  let best = Infinity;
  function go(index, usedFreqs, deletions) {
    if (deletions >= best) return;
    if (index === counts.length) { best = deletions; return; }
    for (let target = counts[index]; target >= 0; target--) {
      if (target !== 0 && usedFreqs.has(target)) continue;
      usedFreqs.add(target);
      go(index + 1, usedFreqs, deletions + counts[index] - target);
      usedFreqs.delete(target);
    }
  }
  go(0, new Set(), 0);
  return best;
}

function optimal(s) {
  const counts = new Array(26).fill(0);
  for (const ch of s) counts[ch.charCodeAt(0) - 97]++;

  const frequencies = counts.filter((c) => c > 0).sort((a, b) => b - a);
  const used = new Set();
  let deletions = 0;
  for (let freq of frequencies) {
    while (freq > 0 && used.has(freq)) {   // lower until we find a free frequency (or 0)
      freq--;
      deletions++;
    }
    used.add(freq);                        // 0 may be added many times, that is fine
  }
  return deletions;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('aab'), 0);
  assert.strictEqual(solve('aaabbbcc'), 2);
  assert.strictEqual(solve('ceabaacb'), 2);
  assert.strictEqual(solve('abc'), 2);
  assert.strictEqual(solve('aaaa'), 0);
  assert.strictEqual(solve(''), 0);
  assert.strictEqual(solve('aabbcc'), 3);
}
console.log('✓ 17-min-deletions-unique-frequencies passed');

module.exports = { optimal, bruteForce };

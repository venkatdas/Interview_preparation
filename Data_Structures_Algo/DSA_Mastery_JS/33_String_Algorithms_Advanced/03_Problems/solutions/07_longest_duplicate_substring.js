/**
 * 07. Longest Duplicate Substring   (LeetCode 1044 — Hard)
 *
 * PROBLEM
 * Return the longest substring that occurs at least twice in s (occurrences may overlap).
 * Return "" if every substring is unique.
 *
 * EXAMPLES
 * Input: "banana"   Output: "ana"
 * Input: "abcd"     Output: ""
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Length up to 3 * 10^4 -> O(n^2) substring comparisons are too slow
 * - Lowercase letters
 * - Any longest answer is accepted if several exist
 *
 * APPROACH 1 — Brute force   O(n^3) time
 * For each length from n-1 down, put every substring of that length in a Set; the first
 * duplicate found is the answer. Building substrings costs O(n) each.
 *
 * APPROACH 2 — Optimal (Binary search on length + rolling hash)   O(n log n) expected
 * Key observation: if a duplicate of length L exists, duplicates of every shorter length
 * exist too (take a prefix). So "does a duplicate of length L exist?" is monotonic in L
 * -> binary search on L.
 * The check for a given L: slide a window of length L, compute its polynomial hash in O(1)
 * from the previous window (rolling), and look the hash up in a Set. O(n) per check.
 * Collisions: we use a large modulus and verify candidates by comparing the actual
 * substrings (store hash -> list of start indices). With two independent hashes
 * (double hashing) verification is almost never needed; one hash + verification is simpler.
 *
 * Dry run on "banana": lo = 1, hi = 5
 *   L = 3: windows ban, ana, nan, ana -> "ana" repeats -> record "ana", lo = 4
 *   L = 4: bana, anan, nana -> no repeat -> hi = 3
 *   lo > hi -> answer "ana"
 *
 * EDGE CASES
 * - no duplicates -> ""
 * - all same letters "aaaa" -> "aaa" (overlapping)
 * - length 1 -> ""
 */

function bruteForce(s) {
  for (let len = s.length - 1; len >= 1; len--) {
    const seen = new Set();
    for (let i = 0; i + len <= s.length; i++) {
      const sub = s.slice(i, i + len);
      if (seen.has(sub)) return sub;
      seen.add(sub);
    }
  }
  return '';
}

const BASE = 131;
const MOD = 1_000_000_007;

// returns the start index of a duplicated substring of length len, or -1
function findDuplicateOfLength(s, len) {
  if (len === 0) return 0;
  let hash = 0;
  let highest = 1;                                   // BASE^(len-1)
  for (let i = 0; i < len; i++) {
    hash = (hash * BASE + s.charCodeAt(i)) % MOD;
    if (i < len - 1) highest = (highest * BASE) % MOD;
  }
  const seen = new Map();                            // hash -> [start indices]
  seen.set(hash, [0]);
  for (let i = 1; i + len <= s.length; i++) {
    hash = (hash - s.charCodeAt(i - 1) * highest) % MOD;
    if (hash < 0) hash += MOD;
    hash = (hash * BASE + s.charCodeAt(i + len - 1)) % MOD;
    const starts = seen.get(hash);
    if (starts) {
      for (const start of starts) {                  // verify to rule out collisions
        if (s.startsWith(s.slice(i, i + len), start)) return i;
      }
      starts.push(i);
    } else {
      seen.set(hash, [i]);
    }
  }
  return -1;
}

function optimal(s) {
  let lo = 1;
  let hi = s.length - 1;
  let bestStart = -1;
  let bestLen = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const start = findDuplicateOfLength(s, mid);
    if (start !== -1) {
      bestStart = start;
      bestLen = mid;
      lo = mid + 1;                                  // try longer
    } else {
      hi = mid - 1;                                  // too long
    }
  }
  return bestLen === 0 ? '' : s.slice(bestStart, bestStart + bestLen);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('banana'), 'ana');
  assert.strictEqual(solve('abcd'), '');
  assert.strictEqual(solve('aaaa'), 'aaa');
  assert.strictEqual(solve('a'), '');
  assert.strictEqual(solve('abcabc').length, 3);
  assert.strictEqual(solve('nnpdfpvmbm'), 'n');
  assert.strictEqual(solve('abcdefg'), '');
}
function randomString(len) {
  return Array.from({ length: len }, () => 'ab'[Math.floor(Math.random() * 2)]).join('');
}
for (let trial = 0; trial < 300; trial++) {
  const s = randomString(1 + Math.floor(Math.random() * 18));
  const got = optimal(s);
  assert.strictEqual(got.length, bruteForce(s).length);
  if (got.length) assert.notStrictEqual(s.indexOf(got), s.lastIndexOf(got));  // really occurs twice
}
console.log('✓ 07-longest-duplicate-substring passed');

module.exports = { optimal, bruteForce };

/**
 * 03. Segmentation Ways   (Original — Hard)
 *
 * PROBLEM
 * A message `s` lost its spaces. Given a dictionary `words` (distinct, non-empty,
 * lowercase), count how many different ways s can be split into a sequence of dictionary
 * words (each word may be used any number of times). Return the count modulo 1_000_000_007.
 *
 * EXAMPLES
 * Input: s = "catsand", words = ["cat", "cats", "and", "sand"]   Output: 2   Explanation: cat|sand, cats|and
 * Input: s = "aaa", words = ["a", "aa"]                            Output: 3   Explanation: a|a|a, a|aa, aa|a
 * Input: s = "", words = ["a"]                                     Output: 1   Explanation: the empty split
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - |s| up to 10^4, dictionary up to 10^4 words, word length up to 100.
 * - The count can be astronomically large, which is why it is returned modulo 10^9 + 7.
 *
 * APPROACH 1 — Brute force   exponential time, O(n) recursion depth
 * Recursively try every dictionary word as a prefix of the remaining string, no memo.
 *
 * APPROACH 2 — Optimal (DP over positions + trie walk for the next word)   O(n * L) time, O(total dictionary size + n) space
 * ways[i] = number of ways to split s[i..]. ways[n] = 1. For i from n-1 down to 0, walk
 * the trie from s[i] forward; every time the walk reaches a word end at position j,
 * add ways[j + 1]. The trie stops the walk as soon as no word continues, so each
 * position costs at most L (longest word) steps instead of trying every word.
 *
 * Dry run on "aaa", words ["a", "aa"]:
 *   ways[3] = 1
 *   i=2: "a" ends -> +ways[3]=1                      ways[2] = 1
 *   i=1: "a" -> +ways[2]=1, "aa" -> +ways[3]=1      ways[1] = 2
 *   i=0: "a" -> +ways[1]=2, "aa" -> +ways[2]=1      ways[0] = 3
 *
 * EDGE CASES
 * - s = "" -> 1
 * - no split possible -> 0
 * - huge counts -> apply % MOD at each addition
 *
 * COMMON MISTAKES
 * - Returning a boolean (that is the "can it be split" problem).
 * - Using s.slice in the inner loop (O(L) per slice -> O(n * L^2)).
 */

const MOD = 1000000007;

function bruteForce(s, words) {
  function go(i) {
    if (i === s.length) return 1;
    let total = 0;
    for (const w of words) if (s.startsWith(w, i)) total = (total + go(i + w.length)) % MOD;
    return total;
  }
  return go(0);
}

function optimal(s, words) {
  const root = { kids: {}, end: false };
  for (const w of words) {
    let node = root;
    for (const ch of w) node = node.kids[ch] || (node.kids[ch] = { kids: {}, end: false });
    node.end = true;
  }
  const n = s.length;
  const ways = new Array(n + 1).fill(0);
  ways[n] = 1;
  for (let i = n - 1; i >= 0; i--) {
    let node = root;
    for (let j = i; j < n; j++) {
      node = node.kids[s[j]];
      if (!node) break; // no dictionary word continues this way
      if (node.end) ways[i] = (ways[i] + ways[j + 1]) % MOD;
    }
  }
  return ways[0];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve('catsand', ['cat', 'cats', 'and', 'sand']), 2);
  assert.strictEqual(solve('aaa', ['a', 'aa']), 3);
  assert.strictEqual(solve('', ['a']), 1);
  assert.strictEqual(solve('abc', ['ab']), 0);
  assert.strictEqual(solve('abab', ['ab', 'a', 'b', 'aba']), 5);
}
// big case only for the optimal: Fibonacci-like growth needs the modulo
assert.strictEqual(optimal('a'.repeat(5000), ['a', 'aa']) < MOD, true);
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(603);
for (let t = 0; t < 300; t++) {
  const rw = (max) => { let w = ''; const n = Math.floor(rand() * max); for (let i = 0; i < n; i++) w += 'ab'[Math.floor(rand() * 2)]; return w; };
  const words = [...new Set(Array.from({ length: 1 + Math.floor(rand() * 5) }, () => rw(3) || 'a'))];
  const s = rw(10);
  assert.strictEqual(optimal(s, words), bruteForce(s, words));
}
console.log('✓ set_06/03_segmentation_ways passed');
module.exports = { optimal, bruteForce };

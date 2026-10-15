/**
 * 02. Count Vowels Permutation   (LeetCode 1220 — Hard)
 *
 * PROBLEM
 * Count strings of length n made of the vowels a, e, i, o, u that obey these rules:
 *   a -> only e may follow
 *   e -> a or i
 *   i -> a, e, o, u (anything but i)
 *   o -> i or u
 *   u -> a
 * Return the count modulo 1e9 + 7.
 *
 * EXAMPLES
 * Input: n = 1   Output: 5     Explanation: "a","e","i","o","u"
 * Input: n = 2   Output: 10    Explanation: ae, ea, ei, ia, ie, io, iu, oi, ou, ua
 * Input: n = 5   Output: 68
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= n <= 2 * 10^4, so O(n) is fine, O(n^2) is not.
 * - Answer must be taken modulo 1e9 + 7 (the real counts explode fast).
 *
 * APPROACH 1 — Brute force (plain recursion)   O(5 * 2^n) time, O(n) space
 * count(position, lastVowel): try every vowel allowed after lastVowel and recurse.
 * Branching factor is up to 4, so it is exponential. Fine for n <= 10 in tests.
 *
 * APPROACH 2 — State machine DP   O(5 * n) = O(n) time, O(n) or O(1) space
 * This is a "state machine" DP: the state is "which vowel did I end with".
 * STATE      dp[len][v] = number of valid strings of length len that END with vowel v.
 * RECURRENCE dp[len][v] = sum of dp[len - 1][p] for every vowel p that may be followed by v.
 *            It is easier to flip the rules into "who can come BEFORE me":
 *              a <- e, i, u
 *              e <- a, i
 *              i <- e, o
 *              o <- i
 *              u <- i, o
 * BASE CASES dp[1][v] = 1 for every vowel.
 * ANSWER     sum of dp[n][v] over all v.
 *
 * Dry run (columns a e i o u):
 *   len 1 : 1 1 1 1 1            sum 5
 *   len 2 : a=e+i+u=3, e=a+i=2, i=e+o=2, o=i=1, u=i+o=2   -> 3 2 2 1 2   sum 10
 *   len 3 : a=2+2+2=6, e=3+2=5, i=2+1=3, o=2, u=2+1=3     -> 6 5 3 2 3   sum 19
 *
 * EDGE CASES
 * - n = 1 -> 5
 * - large n -> take modulo at every addition
 */

const MOD = 1_000_000_007;
const VOWELS = ['a', 'e', 'i', 'o', 'u'];
// nextAllowed[v] = vowels allowed AFTER v
const nextAllowed = {
  a: ['e'],
  e: ['a', 'i'],
  i: ['a', 'e', 'o', 'u'],
  o: ['i', 'u'],
  u: ['a'],
};
// prevAllowed[v] = vowels allowed BEFORE v (the rules flipped)
const prevAllowed = { a: ['e', 'i', 'u'], e: ['a', 'i'], i: ['e', 'o'], o: ['i'], u: ['i', 'o'] };

function bruteForce(n) {
  function count(position, last) {
    if (position === n) return 1;
    let total = 0;
    const choices = last === null ? VOWELS : nextAllowed[last];
    for (const vowel of choices) total += count(position + 1, vowel);
    return total % MOD;
  }
  return count(0, null);
}

function memo(n) {
  // cache key: `${position},${last}` -> count of ways to finish from here
  const cache = new Map();
  function count(position, last) {
    if (position === n) return 1;
    const key = `${position},${last}`;
    if (cache.has(key)) return cache.get(key);
    let total = 0;
    const choices = last === null ? VOWELS : nextAllowed[last];
    for (const vowel of choices) total = (total + count(position + 1, vowel)) % MOD;
    cache.set(key, total);
    return total;
  }
  return count(0, null);
}

function tabulation(n) {
  // dp[len][v] = strings of length len ending with v
  const dp = Array.from({ length: n + 1 }, () => ({ a: 0, e: 0, i: 0, o: 0, u: 0 }));
  for (const vowel of VOWELS) dp[1][vowel] = 1;
  for (let len = 2; len <= n; len++) {
    for (const vowel of VOWELS) {
      let total = 0;
      for (const prev of prevAllowed[vowel]) total = (total + dp[len - 1][prev]) % MOD;
      dp[len][vowel] = total;
    }
  }
  return VOWELS.reduce((sum, vowel) => (sum + dp[n][vowel]) % MOD, 0);
}

function optimized(n) {
  // Only the previous row is needed -> five variables.
  let a = 1, e = 1, i = 1, o = 1, u = 1;
  for (let len = 2; len <= n; len++) {
    const nextA = (e + i + u) % MOD;
    const nextE = (a + i) % MOD;
    const nextI = (e + o) % MOD;
    const nextO = i;
    const nextU = (i + o) % MOD;
    a = nextA; e = nextE; i = nextI; o = nextO; u = nextU;
  }
  return (a + e + i + o + u) % MOD;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation, optimized]) {
  assert.strictEqual(solve(1), 5);
  assert.strictEqual(solve(2), 10);
  assert.strictEqual(solve(3), 19);
  assert.strictEqual(solve(5), 68);
  assert.strictEqual(solve(10), 1739);
}
for (const solve of [memo, tabulation, optimized]) {
  assert.strictEqual(solve(144), 18208803);
}
console.log('✓ 02-count-vowels-permutation passed');

module.exports = { bruteForce, memo, tabulation, optimized };

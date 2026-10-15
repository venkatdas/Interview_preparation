/**
 * 08. Count Anagrams   (LeetCode 2514 — Hard)
 *
 * PROBLEM
 * s is a sentence of lowercase words separated by single spaces. Another sentence t is an
 * anagram of s if its i-th word is a rearrangement of the i-th word of s (word order stays,
 * letters move only inside their word). Count the distinct anagrams of s, modulo 1e9+7.
 *
 * EXAMPLES
 * Input: "too hot"   Output: 18   ("too" has 3!/2! = 3 arrangements, "hot" has 3! = 6)
 * Input: "aa"        Output: 1
 * Input: "abc"       Output: 6
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= s.length <= 10^5, lowercase letters and single spaces, no leading/trailing spaces
 * - Duplicate letters produce identical strings -> count DISTINCT strings
 *
 * APPROACH 1 — Brute force   O(product of word-length factorials) time
 * For each word, generate the set of its distinct permutations; multiply the set sizes.
 * Only works for very short words.
 *
 * APPROACH 2 — Optimal (multinomial mod p with factorials + inverse factorials)   O(L + 26 * words) time, O(L) space
 * Distinct arrangements of a word of length m with letter counts c1..c26 = m! / (c1! ... c26!)
 * (the multinomial coefficient). Words are independent -> multiply the per-word answers.
 * Division mod p = multiplication by the modular inverse. Precompute fact[0..L] and
 * invFact[0..L] (invFact[L] by Fermat, then walk down), so each word costs O(m + 26).
 * THE 2^53 TRAP: fact[i-1] * i and fact * invFact are products of residues ~1e9 * 1e9 -> use
 * an exact mulMod (16-bit split) or BigInt.
 *
 * Dry run, "too hot":
 *   "too": 3! * inv(1!) * inv(2!) = 6 / 2 = 3
 *   "hot": 3! / (1!1!1!)          = 6
 *   answer = 3 * 6 = 18
 *
 * EDGE CASES
 * - single word, all letters equal -> 1
 * - very long words -> answer only makes sense mod p
 */

const MOD = 1_000_000_007;

/** (a * b) mod m, exact: split b into 16-bit halves so no partial product passes 2^53. */
function mulMod(a, b, m = MOD) {
  const bHi = Math.floor(b / 65536), bLo = b % 65536;
  return (((a * bHi) % m) * 65536 + a * bLo) % m;
}

function powMod(b, e, m = MOD) {
  let r = 1;
  b %= m;
  while (e > 0) {
    if (e & 1) r = mulMod(r, b, m);
    b = mulMod(b, b, m);
    e = Math.floor(e / 2);
  }
  return r;
}

function bruteForce(s) {
  const perms = (w) => {
    const out = new Set();
    (function rec(prefix, rest) {
      if (!rest.length) { out.add(prefix); return; }
      for (let i = 0; i < rest.length; i++) rec(prefix + rest[i], rest.slice(0, i) + rest.slice(i + 1));
    })('', w);
    return out.size;
  };
  let ans = 1n;
  for (const w of s.split(' ')) ans *= BigInt(perms(w));
  return Number(ans % BigInt(MOD));
}

/** Exact BigInt multinomial reference (works for long words too). */
function exactBig(s) {
  let ans = 1n;
  for (const w of s.split(' ')) {
    const counts = {};
    let total = 0, ways = 1n;
    for (const ch of w) {
      counts[ch] = (counts[ch] || 0) + 1;
      total++;
      ways = (ways * BigInt(total)) / BigInt(counts[ch]); // multinomial grows one letter at a time
    }
    ans *= ways;
  }
  return Number(ans % BigInt(MOD));
}

function optimal(s) {
  const L = s.length;
  const fact = new Array(L + 1), invFact = new Array(L + 1);
  fact[0] = 1;
  for (let i = 1; i <= L; i++) fact[i] = mulMod(fact[i - 1], i);
  invFact[L] = powMod(fact[L], MOD - 2); // Fermat: a^(p-2) is a^-1 mod prime p
  for (let i = L; i >= 1; i--) invFact[i - 1] = mulMod(invFact[i], i);

  let ans = 1;
  for (const word of s.split(' ')) {
    const cnt = new Array(26).fill(0);
    for (let i = 0; i < word.length; i++) cnt[word.charCodeAt(i) - 97]++;
    let ways = fact[word.length];
    for (const c of cnt) if (c > 1) ways = mulMod(ways, invFact[c]);
    ans = mulMod(ans, ways);
  }
  return ans;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal, exactBig]) {
  assert.strictEqual(solve('too hot'), 18);
  assert.strictEqual(solve('aa'), 1);
  assert.strictEqual(solve('abc'), 6);
  assert.strictEqual(solve('a b c'), 1);
  assert.strictEqual(solve('aab bba'), 9);
}
const longWord = 'abcdefghijklmnopqrstuvwxyz'.repeat(200);
assert.strictEqual(optimal(longWord + ' ' + longWord), exactBig(longWord + ' ' + longWord));
function mulberry32(seed) {
  return function () {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(8);
for (let t = 0; t < 150; t++) {
  const words = [];
  const wc = 1 + Math.floor(rand() * 3);
  for (let w = 0; w < wc; w++) {
    let word = '';
    const len = 1 + Math.floor(rand() * 6);
    for (let i = 0; i < len; i++) word += 'abc'[Math.floor(rand() * 3)];
    words.push(word);
  }
  const s = words.join(' ');
  assert.strictEqual(optimal(s), bruteForce(s));
}
for (let t = 0; t < 50; t++) {
  let s = '';
  const len = 50 + Math.floor(rand() * 300);
  for (let i = 0; i < len; i++) s += rand() < 0.1 && i > 0 && s[s.length - 1] !== ' ' && i < len - 1 ? ' ' : 'abcdefg'[Math.floor(rand() * 7)];
  assert.strictEqual(optimal(s), exactBig(s));
}
console.log('✓ 08_count_anagrams passed');

module.exports = { optimal, bruteForce, exactBig };

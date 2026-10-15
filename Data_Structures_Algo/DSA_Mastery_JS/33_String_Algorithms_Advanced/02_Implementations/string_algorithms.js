/**
 * String algorithms in JavaScript.
 *
 *   naiveSearch(text, pattern)  -> all start indices, O(n * m)
 *   buildLPS(pattern)           -> KMP failure table, O(m)
 *   kmpSearch(text, pattern)    -> all start indices, O(n + m)
 *   rabinKarp(text, pattern)    -> all start indices, O(n + m) expected (rolling hash)
 *   zFunction(s)                -> z[i] = length of the longest prefix of s starting at i, O(n)
 *   manacher(s)                 -> { start, length } of the longest palindromic substring, O(n)
 *   suffixArray(s)              -> sorted suffix start indices, O(n log^2 n)
 *   lcpArray(s, sa)             -> lcp[i] = LCP of suffixes sa[i-1] and sa[i] (Kasai), O(n)
 *   PolynomialHash              -> prefix hashes so any substring hash is O(1)
 *
 * All indices are 0-based. Every function is checked against a brute-force reference in the
 * self-test at the bottom.
 */

// ---------- naive ----------
function naiveSearch(text, pattern) {
  const matches = [];
  if (pattern.length === 0) return matches;
  for (let i = 0; i + pattern.length <= text.length; i++) {
    let j = 0;
    while (j < pattern.length && text[i + j] === pattern[j]) j++;
    if (j === pattern.length) matches.push(i);
  }
  return matches;
}

// ---------- KMP ----------
// lps[i] = length of the longest proper prefix of pattern[0..i] that is also a suffix of it.
// "proper" = not the whole string. This tells us how far to fall back after a mismatch.
function buildLPS(pattern) {
  const lps = new Array(pattern.length).fill(0);
  let len = 0;                       // length of the current matched prefix
  for (let i = 1; i < pattern.length; i++) {
    while (len > 0 && pattern[i] !== pattern[len]) len = lps[len - 1];   // fall back
    if (pattern[i] === pattern[len]) len++;
    lps[i] = len;
  }
  return lps;
}

function kmpSearch(text, pattern) {
  const matches = [];
  if (pattern.length === 0) return matches;
  const lps = buildLPS(pattern);
  let j = 0;                         // how many pattern chars are matched so far
  for (let i = 0; i < text.length; i++) {
    while (j > 0 && text[i] !== pattern[j]) j = lps[j - 1];   // same fall-back as in buildLPS
    if (text[i] === pattern[j]) j++;
    if (j === pattern.length) {
      matches.push(i - j + 1);
      j = lps[j - 1];                // keep going for overlapping matches
    }
  }
  return matches;
}

// ---------- Rabin-Karp ----------
// hash(s) = s[0]*B^(m-1) + s[1]*B^(m-2) + ... + s[m-1]   (mod M)
// Rolling: remove the leading char, shift, add the new char. All in O(1).
// B * M must stay below 2^53 so intermediate products are exact doubles: 131 * 1e9+7 ~ 1.3e11.
const HASH_BASE = 131;
const HASH_MOD = 1_000_000_007;

function rabinKarp(text, pattern) {
  const matches = [];
  const n = text.length;
  const m = pattern.length;
  if (m === 0 || m > n) return matches;

  let highestPower = 1;                                     // B^(m-1) mod M
  for (let i = 0; i < m - 1; i++) highestPower = (highestPower * HASH_BASE) % HASH_MOD;

  let patternHash = 0;
  let windowHash = 0;
  for (let i = 0; i < m; i++) {
    patternHash = (patternHash * HASH_BASE + pattern.charCodeAt(i)) % HASH_MOD;
    windowHash = (windowHash * HASH_BASE + text.charCodeAt(i)) % HASH_MOD;
  }

  for (let i = 0; ; i++) {
    // verify on hash match: hashes can collide, characters cannot lie
    if (windowHash === patternHash && text.startsWith(pattern, i)) matches.push(i);
    if (i + m >= n) break;
    // roll: drop text[i], add text[i + m]
    windowHash = (windowHash - text.charCodeAt(i) * highestPower) % HASH_MOD;
    if (windowHash < 0) windowHash += HASH_MOD;              // JS % can be negative
    windowHash = (windowHash * HASH_BASE + text.charCodeAt(i + m)) % HASH_MOD;
  }
  return matches;
}

// ---------- Z-function ----------
// z[i] = length of the longest common prefix of s and s[i..]. z[0] is defined as n here.
// Maintain the rightmost "Z-box" [l, r] (a segment that matches a prefix); inside the box
// we can copy z from the mirrored position i - l instead of comparing from scratch.
function zFunction(s) {
  const n = s.length;
  const z = new Array(n).fill(0);
  if (n === 0) return z;
  z[0] = n;
  let l = 0;
  let r = 0;                          // [l, r) is the current Z-box
  for (let i = 1; i < n; i++) {
    if (i < r) z[i] = Math.min(r - i, z[i - l]);     // reuse known information
    while (i + z[i] < n && s[z[i]] === s[i + z[i]]) z[i]++;   // extend by direct comparison
    if (i + z[i] > r) {                                // new, further-right box
      l = i;
      r = i + z[i];
    }
  }
  return z;
}

// ---------- Manacher ----------
// Transform "abba" -> "^#a#b#b#a#$" so every palindrome has odd length. radius[i] = how far
// the palindrome centred at i extends. Mirror trick: inside the current rightmost palindrome
// [center - R, center + R], position i mirrors to 2*center - i, so radius[i] starts at
// min(radius[mirror], R - i) instead of 0.
function manacher(s) {
  if (s.length === 0) return { start: 0, length: 0 };
  const t = '^#' + s.split('').join('#') + '#$';
  const n = t.length;
  const radius = new Array(n).fill(0);
  let center = 0;
  let right = 0;                      // right edge of the palindrome centred at `center`
  for (let i = 1; i < n - 1; i++) {
    const mirror = 2 * center - i;
    if (i < right) radius[i] = Math.min(right - i, radius[mirror]);
    while (t[i + radius[i] + 1] === t[i - radius[i] - 1]) radius[i]++;   // sentinels stop this
    if (i + radius[i] > right) {
      center = i;
      right = i + radius[i];
    }
  }
  let bestLen = 0;
  let bestCenter = 0;
  for (let i = 1; i < n - 1; i++) {
    if (radius[i] > bestLen) {
      bestLen = radius[i];
      bestCenter = i;
    }
  }
  // map back: in t, the palindrome spans [bestCenter - bestLen, bestCenter + bestLen];
  // its start in s is (bestCenter - bestLen - 1) / 2 (minus the '^#' prefix)
  return { start: (bestCenter - bestLen - 1) / 2, length: bestLen };
}

// ---------- Suffix array (prefix doubling) ----------
// Round k sorts suffixes by their first 2k characters using the pair (rank[i], rank[i + k])
// from the previous round. log n rounds, each an O(n log n) sort -> O(n log^2 n).
function suffixArray(s) {
  const n = s.length;
  const sa = Array.from({ length: n }, (_, i) => i);
  if (n === 0) return sa;
  let rank = Array.from(s, (ch) => ch.charCodeAt(0));
  for (let k = 1; ; k *= 2) {
    const second = (i) => (i + k < n ? rank[i + k] : -1);
    sa.sort((a, b) => (rank[a] !== rank[b] ? rank[a] - rank[b] : second(a) - second(b)));
    const next = new Array(n);
    next[sa[0]] = 0;
    for (let i = 1; i < n; i++) {
      const a = sa[i - 1];
      const b = sa[i];
      const same = rank[a] === rank[b] && second(a) === second(b);
      next[b] = next[a] + (same ? 0 : 1);
    }
    rank = next;
    if (rank[sa[n - 1]] === n - 1) break;          // all ranks distinct: fully sorted
  }
  return sa;
}

// Kasai's algorithm. lcp[i] = common prefix length of suffixes sa[i-1] and sa[i] (lcp[0] = 0).
// Key fact: if suffix i has LCP h with its sorted predecessor, suffix i+1 has LCP >= h-1
// with ITS predecessor, so the total work is O(n).
function lcpArray(s, sa) {
  const n = s.length;
  const rank = new Array(n);
  for (let i = 0; i < n; i++) rank[sa[i]] = i;
  const lcp = new Array(n).fill(0);
  let h = 0;
  for (let i = 0; i < n; i++) {
    if (rank[i] === 0) {
      h = 0;
      continue;
    }
    const j = sa[rank[i] - 1];
    while (i + h < n && j + h < n && s[i + h] === s[j + h]) h++;
    lcp[rank[i]] = h;
    if (h > 0) h--;
  }
  return lcp;
}

// ---------- Polynomial string hashing ----------
// prefix[i] = hash of s[0..i-1]. hash(l, r) for s[l..r-1] = prefix[r] - prefix[l] * B^(r-l).
// Lets you compare any two substrings in O(1) (with a tiny collision probability).
//
// Overflow trap: prefix[l] * power[k] can reach 1e18, far past 2^53, so a plain `*` silently
// rounds and two equal substrings may get different hashes. mulMod keeps every intermediate
// product below 2^47 by splitting one factor into 16-bit halves.
function mulMod(a, b, mod) {
  const high = Math.floor(b / 65536);                // b = high * 2^16 + low
  const low = b % 65536;
  return ((a * high) % mod * 65536 + a * low) % mod;
}

class PolynomialHash {
  constructor(s, base = HASH_BASE, mod = HASH_MOD) {
    this.base = base;
    this.mod = mod;
    const n = s.length;
    this.prefix = new Array(n + 1).fill(0);
    this.power = new Array(n + 1).fill(1);
    for (let i = 0; i < n; i++) {
      this.prefix[i + 1] = (this.prefix[i] * base + s.charCodeAt(i)) % mod;
      this.power[i + 1] = (this.power[i] * base) % mod;
    }
  }

  // hash of s[l..r) (half-open)
  getHash(l, r) {
    const value = (this.prefix[r] - mulMod(this.prefix[l], this.power[r - l], this.mod)) % this.mod;
    return value < 0 ? value + this.mod : value;
  }
}

// ---------- self-test ----------
const assert = require('assert');

function randomString(len, alphabet = 'ab') {
  let s = '';
  for (let i = 0; i < len; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return s;
}
function randomInt(lo, hi) {
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}

// searching: KMP and Rabin-Karp vs naive on a 2-letter alphabet (lots of near-matches)
for (let trial = 0; trial < 200; trial++) {
  const text = randomString(randomInt(0, 30));
  const pattern = randomString(randomInt(1, 4));
  const expected = naiveSearch(text, pattern);
  assert.deepStrictEqual(kmpSearch(text, pattern), expected);
  assert.deepStrictEqual(rabinKarp(text, pattern), expected);
  // Z-based search: z of pattern + '\u0001' + text, matches where z >= m
  const z = zFunction(pattern + '\u0001' + text);
  const zMatches = [];
  for (let i = pattern.length + 1; i < z.length; i++) if (z[i] >= pattern.length) zMatches.push(i - pattern.length - 1);
  assert.deepStrictEqual(zMatches, expected);
}
assert.deepStrictEqual(kmpSearch('aaaa', 'aa'), [0, 1, 2]);     // overlapping matches
assert.deepStrictEqual(buildLPS('aabaaab'), [0, 1, 0, 1, 2, 2, 3]);
assert.deepStrictEqual(buildLPS('abcabcd'), [0, 0, 0, 1, 2, 3, 0]);

// z-function vs brute force
for (let trial = 0; trial < 200; trial++) {
  const s = randomString(randomInt(0, 25));
  const expected = s.split('').map((_, i) => {
    let len = 0;
    while (i + len < s.length && s[len] === s[i + len]) len++;
    return len;
  });
  assert.deepStrictEqual(zFunction(s), expected);
}

// manacher vs O(n^3) brute force (compare lengths; also check the returned substring is a palindrome)
function isPalindrome(str) {
  return str === str.split('').reverse().join('');
}
for (let trial = 0; trial < 200; trial++) {
  const s = randomString(randomInt(0, 20), 'abc');
  let bestLen = 0;
  for (let i = 0; i < s.length; i++) {
    for (let j = i; j < s.length; j++) {
      if (j - i + 1 > bestLen && isPalindrome(s.slice(i, j + 1))) bestLen = j - i + 1;
    }
  }
  const { start, length } = manacher(s);
  assert.strictEqual(length, bestLen);
  assert.ok(isPalindrome(s.slice(start, start + length)));
}
assert.deepStrictEqual(manacher('babad').length, 3);
assert.deepStrictEqual(manacher('cbbd'), { start: 1, length: 2 });

// suffix array + lcp vs sorting suffixes directly
for (let trial = 0; trial < 200; trial++) {
  const s = randomString(randomInt(0, 20), 'abc');
  const expectedSA = Array.from({ length: s.length }, (_, i) => i)
    .sort((a, b) => (s.slice(a) < s.slice(b) ? -1 : 1));
  const sa = suffixArray(s);
  assert.deepStrictEqual(sa, expectedSA);
  const lcp = lcpArray(s, sa);
  for (let i = 1; i < s.length; i++) {
    const a = s.slice(sa[i - 1]);
    const b = s.slice(sa[i]);
    let len = 0;
    while (len < a.length && len < b.length && a[len] === b[len]) len++;
    assert.strictEqual(lcp[i], len);
  }
}
assert.deepStrictEqual(suffixArray('banana'), [5, 3, 1, 0, 4, 2]);
assert.deepStrictEqual(lcpArray('banana', [5, 3, 1, 0, 4, 2]), [0, 1, 3, 0, 0, 2]);

// polynomial hash: equal substrings have equal hashes; random unequal ones (almost surely) differ
for (let trial = 0; trial < 200; trial++) {
  const s = randomString(randomInt(1, 30), 'abc');
  const h = new PolynomialHash(s);
  const len = randomInt(1, s.length);
  const i = randomInt(0, s.length - len);
  const j = randomInt(0, s.length - len);
  const same = s.slice(i, i + len) === s.slice(j, j + len);
  assert.strictEqual(h.getHash(i, i + len) === h.getHash(j, j + len), same);
}

console.log('✓ string-algorithms.js self-test passed');

module.exports = {
  naiveSearch,
  buildLPS,
  kmpSearch,
  rabinKarp,
  zFunction,
  manacher,
  suffixArray,
  lcpArray,
  PolynomialHash,
  mulMod,
};

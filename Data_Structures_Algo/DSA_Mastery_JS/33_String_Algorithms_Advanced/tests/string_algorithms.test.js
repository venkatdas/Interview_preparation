// node --test 33_String_Algorithms_Advanced/tests/string_algorithms.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const S = require('../02_Implementations/string_algorithms');

// Seeded PRNG so a failing random case can be reproduced exactly.
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(33);
const rint = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const rstr = (len, alpha = 'ab') => Array.from({ length: len }, () => alpha[rint(0, alpha.length - 1)]).join('');

// Brute-force references
function allIndexOf(text, pat) {
  const out = [];
  if (pat.length === 0) return out;
  for (let i = text.indexOf(pat); i !== -1; i = text.indexOf(pat, i + 1)) out.push(i);
  return out;
}
function lpsBrute(p) {
  return Array.from(p, (_, i) => {
    const s = p.slice(0, i + 1);
    for (let k = i; k > 0; k--) if (s.slice(0, k) === s.slice(s.length - k)) return k;
    return 0;
  });
}
function zBrute(s) {
  return Array.from(s, (_, i) => { let k = 0; while (i + k < s.length && s[k] === s[i + k]) k++; return k; });
}
const isPal = (s) => s === [...s].reverse().join('');
function longestPalLen(s) {
  let best = 0;
  for (let i = 0; i < s.length; i++) for (let j = i; j < s.length; j++) if (j - i + 1 > best && isPal(s.slice(i, j + 1))) best = j - i + 1;
  return best;
}

describe('pattern search (naive, KMP, Rabin-Karp, Z)', () => {
  it('finds overlapping matches', () => {
    assert.deepEqual(S.kmpSearch('aaaa', 'aa'), [0, 1, 2]);
    assert.deepEqual(S.rabinKarp('aaaa', 'aa'), [0, 1, 2]);
    assert.deepEqual(S.naiveSearch('abababa', 'aba'), [0, 2, 4]);
  });
  it('handles no match, pattern longer than text, and empty text', () => {
    assert.deepEqual(S.kmpSearch('abc', 'd'), []);
    assert.deepEqual(S.kmpSearch('ab', 'abc'), []);
    assert.deepEqual(S.rabinKarp('ab', 'abc'), []);
    assert.deepEqual(S.kmpSearch('', 'a'), []);
  });
  it('matches indexOf-based brute force on random strings', () => {
    for (let t = 0; t < 400; t++) {
      const alpha = t % 2 ? 'ab' : 'abc';
      const text = rstr(rint(0, 40), alpha);
      const pat = rstr(rint(1, 5), alpha);
      const want = allIndexOf(text, pat);
      assert.deepEqual(S.naiveSearch(text, pat), want);
      assert.deepEqual(S.kmpSearch(text, pat), want);
      assert.deepEqual(S.rabinKarp(text, pat), want);
      const z = S.zFunction(pat + '\u0001' + text);
      const zm = [];
      for (let i = pat.length + 1; i < z.length; i++) if (z[i] >= pat.length) zm.push(i - pat.length - 1);
      assert.deepEqual(zm, want);
    }
  });
  it('works with unicode-free large alphabets', () => {
    const text = 'the quick brown fox jumps over the lazy dog the end';
    assert.deepEqual(S.kmpSearch(text, 'the'), allIndexOf(text, 'the'));
    assert.deepEqual(S.rabinKarp(text, 'the'), allIndexOf(text, 'the'));
  });
});

describe('LPS and Z arrays', () => {
  it('known tables', () => {
    assert.deepEqual(S.buildLPS('aabaaab'), [0, 1, 0, 1, 2, 2, 3]);
    assert.deepEqual(S.zFunction('aaaaa'), [5, 4, 3, 2, 1]);
    assert.deepEqual(S.zFunction(''), []);
  });
  it('match brute force on random strings', () => {
    for (let t = 0; t < 300; t++) {
      const s = rstr(rint(1, 25), t % 3 ? 'ab' : 'abc');
      assert.deepEqual(S.buildLPS(s), lpsBrute(s));
      const z = S.zFunction(s), zb = zBrute(s);
      assert.deepEqual(z, zb);
    }
  });
});

describe('Manacher', () => {
  it('handles empty, single char, even and odd palindromes', () => {
    assert.deepEqual(S.manacher(''), { start: 0, length: 0 });
    assert.equal(S.manacher('x').length, 1);
    const r = S.manacher('xabbay');
    assert.equal('xabbay'.substr(r.start, r.length), 'abba');
  });
  it('length and palindromicity match brute force', () => {
    for (let t = 0; t < 300; t++) {
      const s = rstr(rint(1, 20), t % 2 ? 'ab' : 'abc');
      const { start, length } = S.manacher(s);
      const sub = s.substr(start, length);
      assert.equal(length, longestPalLen(s));
      assert.ok(isPal(sub));
    }
  });
});

describe('suffix array + LCP', () => {
  it('banana', () => {
    const sa = S.suffixArray('banana');
    assert.deepEqual(sa, [5, 3, 1, 0, 4, 2]);
    assert.deepEqual(S.lcpArray('banana', sa), [0, 1, 3, 0, 0, 2]);
  });
  it('matches sorting all suffixes on random strings', () => {
    for (let t = 0; t < 200; t++) {
      const s = rstr(rint(1, 30), 'abc');
      const want = Array.from(s, (_, i) => i).sort((a, b) => (s.slice(a) < s.slice(b) ? -1 : 1));
      const sa = S.suffixArray(s);
      assert.deepEqual(sa, want);
      const lcp = S.lcpArray(s, sa);
      for (let i = 1; i < sa.length; i++) {
        const a = s.slice(sa[i - 1]), b = s.slice(sa[i]);
        let k = 0; while (k < a.length && k < b.length && a[k] === b[k]) k++;
        assert.equal(lcp[i], k);
      }
    }
  });
});

describe('PolynomialHash', () => {
  it('equal substrings have equal hashes; different ones (almost surely) differ', () => {
    for (let t = 0; t < 100; t++) {
      const s = rstr(rint(2, 60), 'abcd');
      const h = new S.PolynomialHash(s);
      for (let q = 0; q < 30; q++) {
        const len = rint(1, s.length);
        const i = rint(0, s.length - len), j = rint(0, s.length - len);
        assert.equal(h.getHash(i, i + len) === h.getHash(j, j + len), s.slice(i, i + len) === s.slice(j, j + len));
      }
    }
  });
  it('mulMod stays exact for large operands', () => {
    const M = 1_000_000_007;
    const a = 999_999_999, b = 987_654_321;
    assert.equal(S.mulMod(a, b, M), Number((BigInt(a) * BigInt(b)) % BigInt(M)));
  });
});

describe('solution files: optimal agrees with bruteForce', () => {
  const p01 = require('../03_Problems/solutions/01_find_index_of_first_occurrence');
  const p02 = require('../03_Problems/solutions/02_repeated_substring_pattern');
  const p04 = require('../03_Problems/solutions/04_longest_happy_prefix');
  const p06 = require('../03_Problems/solutions/06_shortest_palindrome');
  const p09 = require('../03_Problems/solutions/09_sum_of_scores_of_built_strings');
  it('edge cases', () => {
    assert.equal(p01.optimal('hello', 'll'), 2);
    assert.equal(p01.optimal('aaa', 'aaaa'), -1);
    assert.equal(p02.optimal('a'), false);
    assert.equal(p02.optimal('abab'), true);
    assert.equal(p04.optimal('a'), '');
    assert.equal(p06.optimal(''), '');
    assert.equal(p06.optimal('aacecaaa'), 'aaacecaaa');
    assert.equal(p09.optimal('babab'), 9);
  });
  it('random inputs', () => {
    for (let t = 0; t < 200; t++) {
      const s = rstr(rint(1, 16), t % 2 ? 'ab' : 'abc');
      const pat = rstr(rint(1, 4), 'ab');
      assert.equal(p01.optimal(s, pat), p01.bruteForce(s, pat));
      assert.equal(p01.optimal(s, pat), s.indexOf(pat));
      assert.equal(p02.optimal(s), p02.bruteForce(s));
      assert.equal(p02.doubledTrick(s), p02.bruteForce(s));
      assert.equal(p04.optimal(s), p04.bruteForce(s));
      assert.equal(p06.optimal(s), p06.bruteForce(s));
      assert.equal(p09.optimal(s), p09.bruteForce(s));
    }
  });
});

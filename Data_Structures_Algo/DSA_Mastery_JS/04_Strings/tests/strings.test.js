const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const S = require('../02_Implementations/string_utils');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(5);
const randInt = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const randStr = (n, alphabet = 'abc') => Array.from({ length: n }, () => alphabet[randInt(0, alphabet.length - 1)]).join('');

describe('char index helpers', () => {
  it('round-trips every lowercase letter', () => {
    for (let i = 0; i < 26; i++) assert.equal(S.toCharCodeIndex(S.fromCharCodeIndex(i)), i);
    assert.equal(S.toCharCodeIndex('a'), 0);
    assert.equal(S.fromCharCodeIndex(25), 'z');
  });
});

describe('reverse / reverseInPlace', () => {
  it('handles empty, single and normal strings', () => {
    assert.equal(S.reverse(''), '');
    assert.equal(S.reverse('a'), 'a');
    assert.equal(S.reverse('abc'), 'cba');
  });
  it('keeps emoji intact', () => {
    assert.equal(S.reverse('a😀b'), 'b😀a');
  });
  it('reverseInPlace mutates the array and matches reverse on random input', () => {
    const chars = ['h', 'i'];
    assert.equal(S.reverseInPlace(chars), chars);
    assert.deepEqual(chars, ['i', 'h']);
    for (let t = 0; t < 200; t++) {
      const s = randStr(randInt(0, 12), 'abcxyz');
      assert.equal(S.reverseInPlace([...s]).join(''), S.reverse(s));
    }
  });
});

describe('isPalindrome', () => {
  it('handles empty, single, even and odd lengths', () => {
    assert.equal(S.isPalindrome(''), true);
    assert.equal(S.isPalindrome('x'), true);
    assert.equal(S.isPalindrome('abba'), true);
    assert.equal(S.isPalindrome('aba'), true);
    assert.equal(S.isPalindrome('ab'), false);
  });
  it('is case sensitive by default, ignores case and punctuation with alphanumericOnly', () => {
    assert.equal(S.isPalindrome('Aa'), false);
    assert.equal(S.isPalindrome('A man, a plan, a canal: Panama', { alphanumericOnly: true }), true);
    assert.equal(S.isPalindrome('0P', { alphanumericOnly: true }), false);
    assert.equal(S.isPalindrome('.,!', { alphanumericOnly: true }), true);
  });
  it('matches reverse-and-compare on random strings', () => {
    for (let t = 0; t < 300; t++) {
      const s = randStr(randInt(0, 8), 'ab');
      assert.equal(S.isPalindrome(s), s === [...s].reverse().join(''));
    }
  });
});

describe('frequency counting and anagrams', () => {
  it('charFrequency counts any characters', () => {
    assert.deepEqual([...S.charFrequency('')], []);
    assert.deepEqual(Object.fromEntries(S.charFrequency('aAb a')), { a: 2, A: 1, b: 1, ' ': 1 });
  });
  it('charFrequency26 agrees with charFrequency for lowercase input', () => {
    for (let t = 0; t < 200; t++) {
      const s = randStr(randInt(0, 30), 'abcdefghijklmnopqrstuvwxyz');
      const arr = S.charFrequency26(s);
      const map = S.charFrequency(s);
      for (let i = 0; i < 26; i++) assert.equal(arr[i], map.get(S.fromCharCodeIndex(i)) ?? 0);
    }
  });
  it('isAnagram edge cases', () => {
    assert.equal(S.isAnagram('', ''), true);
    assert.equal(S.isAnagram('a', ''), false);
    assert.equal(S.isAnagram('aab', 'abb'), false);
    assert.equal(S.isAnagram('listen', 'silent'), true);
  });
  it('isAnagram matches sort-and-compare on random strings', () => {
    const key = (s) => [...s].sort().join('');
    for (let t = 0; t < 300; t++) {
      const a = randStr(randInt(0, 6)), b = randStr(randInt(0, 6));
      assert.equal(S.isAnagram(a, b), key(a) === key(b));
    }
  });
});

describe('compress / buildString', () => {
  it('compresses runs and leaves singles uncounted', () => {
    assert.equal(S.compress(''), '');
    assert.equal(S.compress('a'), 'a');
    assert.equal(S.compress('aabccc'), 'a2bc3');
    assert.equal(S.compress('a'.repeat(12)), 'a12');
  });
  it('matches a regex-based reference on random strings', () => {
    const ref = (s) => (s.match(/(.)\1*/g) || []).map((run) => run[0] + (run.length > 1 ? run.length : '')).join('');
    for (let t = 0; t < 300; t++) {
      const s = randStr(randInt(0, 15), 'ab');
      assert.equal(S.compress(s), ref(s));
    }
  });
  it('buildString repeats a string', () => {
    assert.equal(S.buildString('ab', 0), '');
    assert.equal(S.buildString('ab', 3), 'ababab');
    assert.equal(S.buildString('', 5), '');
  });
});

describe('solution files: extra edge cases', () => {
  const atoi = require('../03_Problems/solutions/06_string_to_integer_atoi');
  const lps = require('../03_Problems/solutions/07_longest_palindromic_substring');
  const codec = require('../03_Problems/solutions/09_encode_and_decode_strings');
  const pal = require('../03_Problems/solutions/13_palindromic_substrings');
  const mul = require('../03_Problems/solutions/14_multiply_strings');

  it('String to Integer: whitespace, signs, clamping, junk', () => {
    assert.equal(atoi.optimal('   -42'), -42);
    assert.equal(atoi.optimal('4193 with words'), 4193);
    assert.equal(atoi.optimal('words 987'), 0);
    assert.equal(atoi.optimal('+-12'), 0);
    assert.equal(atoi.optimal(''), 0);
    assert.equal(atoi.optimal('99999999999999999999'), 2 ** 31 - 1);
    assert.equal(atoi.optimal('-99999999999999999999'), -(2 ** 31));
    assert.ok(Object.is(atoi.optimal('-0'), 0));
  });
  it('Longest Palindromic Substring: even center, whole string, random vs brute force', () => {
    assert.equal(lps.optimal('cbbd'), 'bb');
    assert.equal(lps.optimal('racecar'), 'racecar');
    assert.equal(lps.optimal(''), '');
    for (let t = 0; t < 200; t++) {
      const s = randStr(randInt(1, 12), 'ab');
      assert.equal(lps.optimal(s).length, lps.bruteForce(s).length);
    }
  });
  it('Encode and Decode Strings: empty list, empty strings, delimiter-like characters', () => {
    for (const list of [[], [''], ['', ''], ['a#b', '3#', '#'], ['hello', 'wörld', '😀']]) {
      assert.deepEqual(codec.decode(codec.encode(list)), list);
    }
  });
  it('Palindromic Substrings: counts every position, random vs brute force', () => {
    assert.equal(pal.optimal('aaa'), 6);
    assert.equal(pal.optimal('abc'), 3);
    for (let t = 0; t < 200; t++) {
      const s = randStr(randInt(0, 12), 'ab');
      assert.equal(pal.optimal(s), pal.bruteForce(s));
    }
  });
  it('Multiply Strings: zeros and agreement with BigInt', () => {
    assert.equal(mul.optimal('0', '12345'), '0');
    assert.equal(mul.optimal('1', '1'), '1');
    for (let t = 0; t < 200; t++) {
      const a = String(randInt(0, 1e9)) + String(randInt(0, 1e6));
      const b = String(randInt(1, 1e9));
      assert.equal(mul.optimal(a, b), (BigInt(a) * BigInt(b)).toString());
    }
  });
});

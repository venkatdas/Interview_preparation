// node --test 22_Tries/tests/tries.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { Trie } = require('../02_Implementations/trie');
const { BinaryTrie } = require('../02_Implementations/binary_trie');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// Small alphabet so random words share many prefixes.
const randWord = (rnd, maxLen = 5) => Array.from({ length: 1 + Math.floor(rnd() * maxLen) }, () => 'abc'[Math.floor(rnd() * 3)]).join('');

describe('Trie', () => {
  it('search vs startsWith: a prefix is not a word', () => {
    const t = new Trie();
    t.insert('apple').insert('app');
    assert.equal(t.search('app'), true);
    assert.equal(t.search('ap'), false);
    assert.equal(t.startsWith('ap'), true);
    assert.equal(t.startsWith('b'), false);
    assert.equal(t.search('apples'), false);
  });
  it('empty trie and empty strings', () => {
    const t = new Trie();
    assert.equal(t.search('a'), false);
    assert.equal(t.startsWith(''), true);
    assert.equal(t.countWordsWithPrefix('a'), 0);
    assert.deepEqual(t.collectWordsWithPrefix('a'), []);
    assert.equal(t.delete('a'), false);
  });
  it('duplicate inserts do not double-count', () => {
    const t = new Trie();
    t.insert('ab').insert('ab').insert('abc');
    assert.equal(t.countWordsWithPrefix('a'), 2);
    assert.equal(t.delete('ab'), true);
    assert.equal(t.search('ab'), false);
    assert.equal(t.search('abc'), true);
    assert.equal(t.countWordsWithPrefix('ab'), 1);
  });
  it('delete keeps words that share the prefix and prunes dead branches', () => {
    const t = new Trie();
    t.insert('app').insert('apple');
    assert.equal(t.delete('apple'), true);
    assert.equal(t.search('app'), true);
    assert.equal(t.startsWith('appl'), false);
    assert.equal(t.delete('apple'), false);
  });
  it('random operations match a Set-based reference', () => {
    const rnd = mulberry32(22);
    for (let round = 0; round < 20; round++) {
      const t = new Trie(), set = new Set();
      for (let i = 0; i < 400; i++) {
        const w = randWord(rnd);
        if (rnd() < 0.65) { t.insert(w); set.add(w); }
        else assert.equal(t.delete(w), set.delete(w));
        const q = randWord(rnd, 4);
        const withPrefix = [...set].filter((x) => x.startsWith(q));
        assert.equal(t.search(q), set.has(q));
        assert.equal(t.startsWith(q), withPrefix.length > 0);
        assert.equal(t.countWordsWithPrefix(q), withPrefix.length);
      }
      const q = randWord(rnd, 2);
      assert.deepEqual(t.collectWordsWithPrefix(q).sort(), [...set].filter((x) => x.startsWith(q)).sort());
    }
  });
});

describe('BinaryTrie', () => {
  it('max XOR with a single stored number is num ^ that number', () => {
    const b = new BinaryTrie();
    b.insert(5);
    assert.equal(b.maxXor(5), 0);
    assert.equal(b.maxXor(2), 7);
  });
  it('handles 0 and the largest 31-bit value', () => {
    const b = new BinaryTrie();
    b.insert(0).insert(2 ** 31 - 1);
    assert.equal(b.maxXor(0), 2 ** 31 - 1);
  });
  it('matches O(n^2) brute force on random non-negative arrays (with duplicates)', () => {
    const rnd = mulberry32(421);
    for (let t = 0; t < 200; t++) {
      const nums = Array.from({ length: 1 + Math.floor(rnd() * 30) }, () => Math.floor(rnd() * 2 ** 31));
      if (t % 4 === 0) nums.push(nums[0]); // duplicates
      const b = new BinaryTrie();
      nums.forEach((x) => b.insert(x));
      for (const x of nums) {
        let best = 0;
        for (const y of nums) best = Math.max(best, (x ^ y) >>> 0);
        assert.equal(b.maxXor(x) >>> 0, best);
      }
    }
  });
  it('smaller bit width works for small numbers', () => {
    const b = new BinaryTrie(4);
    [3, 10, 5].forEach((x) => b.insert(x));
    assert.equal(b.maxXor(5), 15);
  });
});

describe('selected solutions on extra edge cases', () => {
  const { WordDictionary } = require('../03_Problems/solutions/02_add_and_search_words');
  const rw = require('../03_Problems/solutions/04_replace_words');
  const ss = require('../03_Problems/solutions/07_search_suggestions_system');
  const mx = require('../03_Problems/solutions/08_maximum_xor_two_numbers');
  const ws = require('../03_Problems/solutions/10_word_search_ii');
  it('word dictionary: all-dot patterns and length mismatch', () => {
    const d = new WordDictionary();
    d.addWord('bad'); d.addWord('b');
    assert.equal(d.search('...'), true);
    assert.equal(d.search('.'), true);
    assert.equal(d.search('....'), false);
    assert.equal(d.search('.a.'), true);
    assert.equal(d.search('..x'), false);
  });
  it('replace words: shortest root wins; no root leaves word alone', () => {
    assert.equal(rw.optimal(['a', 'aa', 'aaa'], 'aaaa aaa aa'), 'a a a');
    assert.equal(rw.optimal(['cat'], 'dog'), 'dog');
    assert.equal(rw.optimal(['ca', 'c'], 'cattle'), 'c');
  });
  it('search suggestions: no matches after a prefix fails, random vs brute', () => {
    assert.deepEqual(ss.optimal(['abc'], 'xy'), [[], []]);
    const rnd = mulberry32(1268);
    for (let t = 0; t < 100; t++) {
      // LeetCode guarantees unique product names, so dedupe.
      const products = [...new Set(Array.from({ length: 1 + Math.floor(rnd() * 10) }, () => randWord(rnd, 4)))];
      const word = randWord(rnd, 4);
      assert.deepEqual(ss.optimal([...products], word), ss.bruteForce([...products], word));
    }
  });
  it('maximum XOR: single element gives 0; random vs brute', () => {
    assert.equal(mx.optimal([7]), 0);
    const rnd = mulberry32(8);
    for (let t = 0; t < 100; t++) {
      const nums = Array.from({ length: 1 + Math.floor(rnd() * 20) }, () => Math.floor(rnd() * 1000));
      assert.equal(mx.optimal(nums), mx.bruteForce(nums));
    }
  });
  it('word search II: words sharing prefixes, a word that needs a cell twice', () => {
    const board = [['a', 'b'], ['c', 'd']];
    assert.deepEqual(ws.optimal(board, ['ab', 'abd', 'aba', 'acdb']).sort(), ['ab', 'abd', 'acdb']);
    assert.deepEqual(ws.optimal([['a']], ['a', 'aa']), ['a']);
  });
});

// node --test 13_Backtracking/tests/backtracking.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const R = require('../02_Implementations/recursion_basics');
const B = require('../02_Implementations/backtracking_template');

// Seeded PRNG so a failing random case can be reproduced.
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const canon = (lists) => lists.map((l) => JSON.stringify(l)).sort();
// Brute-force reference: every subset via a bitmask.
function subsetsBrute(nums) {
  const out = [];
  for (let m = 0; m < 1 << nums.length; m++) out.push(nums.filter((_, i) => m & (1 << i)));
  return out;
}

describe('recursion_basics', () => {
  it('factorial: base cases and normal values', () => {
    assert.equal(R.factorial(0), 1);
    assert.equal(R.factorial(1), 1);
    assert.equal(R.factorial(10), 3628800);
  });
  it('fibNaive and fibMemo agree with an iterative reference', () => {
    let a = 0, b = 1;
    for (let n = 0; n <= 25; n++) {
      assert.equal(R.fibNaive(n), a);
      assert.equal(R.fibMemo(n), a);
      [a, b] = [b, a + b];
    }
    assert.equal(R.fibMemo(70), 190392490709135); // memo makes big n fast
  });
  it('sumArray handles empty, negatives', () => {
    assert.equal(R.sumArray([]), 0);
    assert.equal(R.sumArray([-3, 5, -2]), 0);
  });
  it('reverseString and isPalindrome on edge strings', () => {
    assert.equal(R.reverseString(''), '');
    assert.equal(R.reverseString('a'), 'a');
    assert.equal(R.reverseString('abc'), 'cba');
    assert.equal(R.isPalindrome(''), true);
    assert.equal(R.isPalindrome('a'), true);
    assert.equal(R.isPalindrome('abba'), true);
    assert.equal(R.isPalindrome('abca'), false);
  });
  it('power matches ** for many exponents (including 0 and odd/even)', () => {
    for (let e = 0; e <= 30; e++) assert.equal(R.power(2, e), 2 ** e);
    assert.equal(R.power(-3, 3), -27);
    assert.equal(R.power(0, 0), 1);
  });
  it('head vs tail recursion produce mirrored arrays', () => {
    assert.deepEqual(R.oneToNHead(0), []);
    assert.deepEqual(R.oneToNHead(4), [1, 2, 3, 4]);
    assert.deepEqual(R.nToOneTail(4), [4, 3, 2, 1]);
  });
  it('flattenNested handles deep and empty nesting', () => {
    assert.deepEqual(R.flattenNested([]), []);
    assert.deepEqual(R.flattenNested([[[]]]), []);
    assert.deepEqual(R.flattenNested([1, [2, [3, [4, [5]]]], 6]), [1, 2, 3, 4, 5, 6]);
  });
  it('towerOfHanoi makes 2^n - 1 legal moves that end on peg C', () => {
    for (let n = 1; n <= 8; n++) {
      const moves = R.towerOfHanoi(n);
      assert.equal(moves.length, 2 ** n - 1);
      const pegs = { A: [], B: [], C: [] };
      for (let d = n; d >= 1; d--) pegs.A.push(d);
      for (const m of moves) {
        const [, disk, from, to] = m.match(/disk (\d+): (\w) -> (\w)/);
        const top = pegs[from].pop();
        assert.equal(top, Number(disk));
        const under = pegs[to][pegs[to].length - 1];
        assert.ok(under === undefined || under > top, 'never put a big disk on a small one');
        pegs[to].push(top);
      }
      assert.equal(pegs.C.length, n);
    }
  });
  it('binaryStrings lists all 2^n strings in order', () => {
    assert.deepEqual(R.binaryStrings(0), ['']);
    for (let n = 1; n <= 6; n++) {
      const expected = [];
      for (let i = 0; i < 2 ** n; i++) expected.push(i.toString(2).padStart(n, '0'));
      assert.deepEqual(R.binaryStrings(n), expected);
    }
  });
});

describe('backtracking_template', () => {
  it('subsets of empty input is [[]]', () => {
    assert.deepEqual(B.subsets([]), [[]]);
  });
  it('subsets match the bitmask brute force on random inputs (incl. negatives)', () => {
    const rnd = mulberry32(13);
    for (let t = 0; t < 200; t++) {
      const n = Math.floor(rnd() * 7);
      const nums = Array.from({ length: n }, (_, i) => i * 3 - 7); // distinct, some negative
      assert.deepEqual(canon(B.subsets(nums)), canon(subsetsBrute(nums)));
    }
  });
  it('combinations(n, k) match bitmask subsets of size k; both engines agree', () => {
    for (let n = 0; n <= 7; n++) {
      for (let k = 0; k <= n; k++) {
        const ref = subsetsBrute(Array.from({ length: n }, (_, i) => i + 1)).filter((s) => s.length === k);
        assert.deepEqual(canon(B.combinations(n, k)), canon(ref));
        assert.deepEqual(canon(B.combinationsViaEngine(n, k)), canon(ref));
      }
    }
  });
  it('permutations: n! distinct orderings of the input, both engines agree', () => {
    const fact = [1, 1, 2, 6, 24, 120, 720];
    for (let n = 0; n <= 6; n++) {
      const nums = Array.from({ length: n }, (_, i) => i - 2);
      const perms = B.permutations(nums);
      assert.equal(perms.length, fact[n]);
      assert.equal(new Set(perms.map((p) => JSON.stringify(p))).size, fact[n]);
      for (const p of perms) assert.deepEqual([...p].sort((a, b) => a - b), nums);
      assert.deepEqual(canon(B.permutationsViaEngine(nums)), canon(perms));
    }
  });
  it('permutations with duplicates keep positional duplicates (no dedupe)', () => {
    assert.equal(B.permutations([1, 1, 2]).length, 6);
  });
  it('generic backtrack engine can express "all binary strings of length 3"', () => {
    const out = B.backtrack({ isComplete: (p) => p.length === 3, getChoices: () => [0, 1] });
    assert.equal(out.length, 8);
    const pruned = B.backtrack({ isComplete: (p) => p.length === 3, getChoices: () => [0, 1],
      isAllowed: (c, p) => !(c === 1 && p[p.length - 1] === 1) }); // no two adjacent 1s
    assert.equal(pruned.length, 5);
  });
});

describe('selected solutions on extra edge cases', () => {
  const nq = require('../03_Problems/solutions/12_n_queens');
  const cs = require('../03_Problems/solutions/06_combination_sum');
  const gp = require('../03_Problems/solutions/09_generate_parentheses');
  const ip = require('../03_Problems/solutions/14_restore_ip_addresses');
  const ws = require('../03_Problems/solutions/11_word_search');
  it('N-Queens solution counts for n = 1..8', () => {
    const counts = [1, 0, 0, 2, 10, 4, 40, 92];
    for (let n = 1; n <= 8; n++) assert.equal(nq.optimal(n).length, counts[n - 1]);
    assert.deepEqual(canon(nq.optimal(5)), canon(nq.bruteForce(5)));
  });
  it('combination sum: unreachable target, reuse allowed, brute agrees', () => {
    assert.deepEqual(cs.optimal([2], 1), []);
    assert.deepEqual(canon(cs.optimal([1], 3)), canon([[1, 1, 1]]));
    const rnd = mulberry32(6);
    for (let t = 0; t < 30; t++) {
      const cand = [...new Set(Array.from({ length: 4 }, () => 2 + Math.floor(rnd() * 6)))];
      const target = 1 + Math.floor(rnd() * 14);
      const norm = (r) => canon(r.map((c) => [...c].sort((a, b) => a - b)));
      assert.deepEqual(norm(cs.optimal(cand, target)), norm(cs.bruteForce(cand, target)));
    }
  });
  it('generate parentheses: Catalan counts and validity', () => {
    const catalan = [1, 1, 2, 5, 14, 42, 132];
    for (let n = 1; n <= 6; n++) {
      const res = gp.optimal(n);
      assert.equal(res.length, catalan[n]);
      for (const s of res) {
        let bal = 0;
        for (const ch of s) { bal += ch === '(' ? 1 : -1; assert.ok(bal >= 0); }
        assert.equal(bal, 0);
      }
    }
  });
  it('restore IP: leading zeros, too short, too long', () => {
    assert.deepEqual(ip.optimal('0000'), ['0.0.0.0']);
    assert.deepEqual(ip.optimal('123'), []);
    assert.deepEqual(ip.optimal('1234567890123'), []);
    assert.deepEqual(ip.optimal('255255255255'), ['255.255.255.255']);
    assert.ok(!ip.optimal('010010').includes('01.0.01.0'));
  });
  it('word search: single cell, cell reuse is not allowed', () => {
    assert.equal(ws.optimal([['a']], 'a'), true);
    assert.equal(ws.optimal([['a']], 'aa'), false);
    assert.equal(ws.optimal([['a', 'b'], ['c', 'd']], 'abdc'), true);
    assert.equal(ws.optimal([['a', 'b'], ['c', 'd']], 'abcd'), false);
  });
});

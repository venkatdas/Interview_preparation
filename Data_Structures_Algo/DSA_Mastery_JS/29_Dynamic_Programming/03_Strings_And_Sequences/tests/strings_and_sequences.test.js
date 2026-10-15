// node:test suite for string / sequence DP.
// Every exported version (bruteForce, memo, tabulation, optimized) of each solution file must
// agree on hand-picked edge cases and on seeded random small inputs.
// Run from the curriculum root: node --test 29_Dynamic_Programming/03_Strings_And_Sequences/tests/strings_and_sequences.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const sol = (name) => require(`../03_Problems/solutions/${name}`);

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(2903);
const rint = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const rstr = (len, alpha = 'ab') => Array.from({ length: len }, () => alpha[rint(0, alpha.length - 1)]).join('');
const rarr = (len, lo, hi) => Array.from({ length: len }, () => rint(lo, hi));

const VERSIONS = ['bruteForce', 'memo', 'tabulation', 'optimized'];
// Calls every exported version on a deep copy of args; all must equal `expected`
// (or bruteForce's answer when expected is undefined). Returns the agreed answer.
function allAgree(mod, args, expected) {
  const copy = () => JSON.parse(JSON.stringify(args));
  const want = expected !== undefined ? expected : mod.bruteForce(...copy());
  for (const name of VERSIONS) {
    if (typeof mod[name] !== 'function') continue;
    assert.deepEqual(mod[name](...copy()), want, `${name}(${JSON.stringify(args)})`);
  }
  return want;
}
const isPal = (s) => s === [...s].reverse().join('');
function isSubseq(small, big) { let i = 0; for (const c of big) if (c === small[i]) i++; return i === small.length; }

describe('01 Longest Common Subsequence', () => {
  const m = sol('01_longest_common_subsequence');
  it('edge cases', () => {
    allAgree(m, ['abcde', 'ace'], 3);
    allAgree(m, ['abc', 'def'], 0);
    allAgree(m, ['a', 'a'], 1);
    allAgree(m, ['abc', 'abc'], 3);
  });
  it('random inputs; reconstruct returns a common subsequence of that length', () => {
    for (let t = 0; t < 150; t++) {
      const a = rstr(rint(1, 8), 'abc'), b = rstr(rint(1, 8), 'abc');
      const len = allAgree(m, [a, b]);
      const r = m.reconstruct(a, b);
      assert.equal(r.length, len);
      assert.ok(isSubseq(r, a) && isSubseq(r, b));
    }
  });
});

describe('02 Longest Common Substring', () => {
  const m = sol('02_longest_common_substring');
  it('edge cases', () => {
    allAgree(m, ['abcdxyz', 'xyzabcd'], 4);
    allAgree(m, ['abc', 'def'], 0);
    allAgree(m, ['aaaa', 'aa'], 2);
  });
  it('random inputs', () => {
    for (let t = 0; t < 150; t++) allAgree(m, [rstr(rint(1, 9)), rstr(rint(1, 9))]);
  });
});

describe('03 Longest Increasing Subsequence', () => {
  const m = sol('03_longest_increasing_subsequence');
  it('edge cases', () => {
    allAgree(m, [[10, 9, 2, 5, 3, 7, 101, 18]], 4);
    allAgree(m, [[7, 7, 7, 7]], 1);          // strictly increasing: duplicates do not count
    allAgree(m, [[5]], 1);
    allAgree(m, [[5, 4, 3, 2, 1]], 1);
    allAgree(m, [[1, 2, 3, 4]], 4);
  });
  it('random inputs (with negatives and duplicates)', () => {
    for (let t = 0; t < 200; t++) allAgree(m, [rarr(rint(1, 10), -5, 5)]);
  });
});

describe('04 Number of Longest Increasing Subsequence', () => {
  const m = sol('04_number_of_longest_increasing_subsequence');
  it('edge cases', () => {
    allAgree(m, [[1, 3, 5, 4, 7]], 2);
    allAgree(m, [[2, 2, 2, 2, 2]], 5);
    allAgree(m, [[1]], 1);
  });
  it('random inputs', () => {
    for (let t = 0; t < 200; t++) allAgree(m, [rarr(rint(1, 10), 0, 4)]);
  });
});

describe('05 Longest Palindromic Substring (answers may differ, lengths must not)', () => {
  const m = sol('05_longest_palindromic_substring');
  const check = (s) => {
    const want = m.bruteForce(s).length;
    for (const name of VERSIONS) {
      const r = m[name](s);
      assert.equal(r.length, want, `${name}(${s})`);
      assert.ok(s.includes(r) && isPal(r), `${name}(${s}) -> ${r}`);
    }
  };
  it('edge cases', () => { ['a', 'ab', 'aa', 'babad', 'cbbd', 'racecar'].forEach(check); });
  it('random inputs', () => { for (let t = 0; t < 200; t++) check(rstr(rint(1, 12), t % 2 ? 'ab' : 'abc')); });
});

describe('06 / 07 palindromic subsequence family', () => {
  const lps = sol('06_longest_palindromic_subsequence');
  const ins = sol('07_minimum_insertions_to_make_palindrome');
  it('edge cases', () => {
    allAgree(lps, ['bbbab'], 4);
    allAgree(lps, ['a'], 1);
    allAgree(ins, ['zzazz'], 0);
    allAgree(ins, ['mbadm'], 2);
    allAgree(ins, ['leetcode'], 5);
  });
  it('random inputs; insertions = n - LPS', () => {
    for (let t = 0; t < 150; t++) {
      const s = rstr(rint(1, 10), 'abc');
      const L = allAgree(lps, [s]);
      allAgree(ins, [s], s.length - L);
    }
  });
});

describe('08 / 09 / 10 two-sequence DP', () => {
  const del = sol('08_delete_operation_for_two_strings');
  const unc = sol('09_uncrossed_lines');
  const ed = sol('10_edit_distance');
  const lcs = sol('01_longest_common_subsequence');
  it('edge cases', () => {
    allAgree(del, ['sea', 'eat'], 2);
    allAgree(del, ['a', 'a'], 0);
    allAgree(unc, [[1, 4, 2], [1, 2, 4]], 2);
    allAgree(ed, ['horse', 'ros'], 3);
    allAgree(ed, ['intention', 'execution'], 5);
    allAgree(ed, ['', 'abc'], 3);
    allAgree(ed, ['abc', ''], 3);
    allAgree(ed, ['', ''], 0);
  });
  it('random inputs; delete distance = |a| + |b| - 2 * LCS, uncrossed lines = LCS', () => {
    for (let t = 0; t < 150; t++) {
      const a = rstr(rint(1, 7), 'abc'), b = rstr(rint(1, 7), 'abc');
      const L = lcs.optimized(a, b);
      allAgree(del, [a, b], a.length + b.length - 2 * L);
      allAgree(unc, [[...a].map((c) => c.charCodeAt(0)), [...b].map((c) => c.charCodeAt(0))], L);
      const d = allAgree(ed, [a, b]);
      assert.ok(d >= Math.abs(a.length - b.length) && d <= Math.max(a.length, b.length));
    }
  });
});

describe('11 Distinct Subsequences', () => {
  const m = sol('11_distinct_subsequences');
  it('edge cases', () => {
    allAgree(m, ['rabbbit', 'rabbit'], 3);
    allAgree(m, ['babgbag', 'bag'], 5);
    allAgree(m, ['abc', 'abcd'], 0);
    allAgree(m, ['aaa', 'a'], 3);
  });
  it('random inputs', () => {
    for (let t = 0; t < 150; t++) allAgree(m, [rstr(rint(1, 10)), rstr(rint(1, 3))]);
  });
});

describe('12 Interleaving String', () => {
  const m = sol('12_interleaving_string');
  it('edge cases', () => {
    allAgree(m, ['aabcc', 'dbbca', 'aadbbcbcac'], true);
    allAgree(m, ['aabcc', 'dbbca', 'aadbbbaccc'], false);
    allAgree(m, ['', '', ''], true);
    allAgree(m, ['a', '', 'a'], true);
    allAgree(m, ['a', 'b', 'abc'], false);      // length mismatch
  });
  it('random inputs (half are real interleavings)', () => {
    for (let t = 0; t < 200; t++) {
      const a = rstr(rint(0, 5)), b = rstr(rint(0, 5));
      let c;
      if (t % 2) {
        c = ''; let i = 0, j = 0;
        while (i < a.length || j < b.length) c += (j >= b.length || (i < a.length && rand() < 0.5)) ? a[i++] : b[j++];
        allAgree(m, [a, b, c], true);
      } else {
        c = rstr(a.length + b.length);
        allAgree(m, [a, b, c]);
      }
    }
  });
});

describe('13 Shortest Common Supersequence (any valid answer of minimum length)', () => {
  const m = sol('13_shortest_common_supersequence');
  const lcs = sol('01_longest_common_subsequence');
  const check = (a, b) => {
    const want = a.length + b.length - lcs.optimized(a, b);
    for (const name of VERSIONS) {
      if (typeof m[name] !== 'function') continue;
      const r = m[name](a, b);
      assert.equal(r.length, want, `${name}(${a},${b}) -> ${r}`);
      assert.ok(isSubseq(a, r) && isSubseq(b, r));
    }
  };
  it('edge cases', () => { check('abac', 'cab'); check('aaaa', 'aaaa'); check('a', 'b'); });
  it('random inputs', () => { for (let t = 0; t < 150; t++) check(rstr(rint(1, 6), 'abc'), rstr(rint(1, 6), 'abc')); });
});

describe('14 Russian Doll Envelopes', () => {
  const m = sol('14_russian_doll_envelopes');
  it('edge cases', () => {
    allAgree(m, [[[5, 4], [6, 4], [6, 7], [2, 3]]], 3);
    allAgree(m, [[[1, 1], [1, 1], [1, 1]]], 1);
    allAgree(m, [[[1, 2]]], 1);
    allAgree(m, [[[1, 3], [1, 4], [1, 5]]], 1);   // same width never nests
  });
  it('random inputs', () => {
    for (let t = 0; t < 200; t++) {
      const env = Array.from({ length: rint(1, 8) }, () => [rint(1, 5), rint(1, 5)]);
      allAgree(m, [env]);
    }
  });
});

describe('15 / 16 pattern matching', () => {
  const wc = sol('15_wildcard_matching');
  const re = sol('16_regular_expression_matching');
  it('edge cases', () => {
    allAgree(wc, ['aa', 'a'], false);
    allAgree(wc, ['aa', '*'], true);
    allAgree(wc, ['', '*'], true);
    allAgree(wc, ['', ''], true);
    allAgree(wc, ['cb', '?a'], false);
    allAgree(wc, ['adceb', '*a*b'], true);
    allAgree(re, ['aa', 'a'], false);
    allAgree(re, ['aa', 'a*'], true);
    allAgree(re, ['ab', '.*'], true);
    allAgree(re, ['', 'a*b*'], true);
    allAgree(re, ['aab', 'c*a*b'], true);
    allAgree(re, ['mississippi', 'mis*is*p*.'], false);
  });
  it('random inputs agree with JavaScript RegExp as an independent oracle', () => {
    for (let t = 0; t < 300; t++) {
      const s = rstr(rint(0, 6));
      let p = '';
      const len = rint(0, 5);
      for (let i = 0; i < len; i++) p += 'ab?*'[rint(0, 3)];
      const wcWant = new RegExp('^' + p.replace(/\?/g, '.').replace(/\*/g, '.*') + '$').test(s);
      allAgree(wc, [s, p], wcWant);

      let rp = '';
      for (let i = 0; i < len; i++) { rp += 'ab.'[rint(0, 2)]; if (rand() < 0.4) rp += '*'; }
      allAgree(re, [s, rp], new RegExp('^(?:' + rp + ')$').test(s));
    }
  });
});

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const C = require('../02_Implementations/combinatorics');
const pascal = require('../03_Problems/solutions/01_pascals_triangle');
const paths = require('../03_Problems/solutions/02_unique_paths');
const candies = require('../03_Problems/solutions/05_distribute_candies_among_children_ii');
const kth = require('../03_Problems/solutions/07_permutation_sequence');
const anagrams = require('../03_Problems/solutions/08_count_anagrams');

// seeded PRNG: random tests are reproducible
function mulberry32(seed) {
  return function () {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const MODn = BigInt(C.MOD);

describe('mulMod / powMod (the 2^53 trap)', () => {
  it('naive multiplication is wrong but mulMod is exact', () => {
    const a = C.MOD - 1, b = C.MOD - 2;
    const exact = Number((BigInt(a) * BigInt(b)) % MODn);
    assert.notEqual((a * b) % C.MOD, exact);
    assert.equal(C.mulMod(a, b), exact);
  });
  it('matches BigInt on random residues', () => {
    const rand = mulberry32(101);
    for (let t = 0; t < 1000; t++) {
      const a = Math.floor(rand() * C.MOD), b = Math.floor(rand() * C.MOD);
      assert.equal(C.mulMod(a, b), Number((BigInt(a) * BigInt(b)) % MODn));
    }
  });
  it('powMod handles exponent 0 and Fermat inverse', () => {
    assert.equal(C.powMod(5, 0), 1);
    assert.equal(C.mulMod(7, C.powMod(7, C.MOD - 2)), 1);
  });
});

describe('exact counting', () => {
  it('handles normal cases', () => {
    assert.equal(C.nCrExact(10, 3), 120n);
    assert.equal(C.nPrExact(10, 3), 720n);
    assert.equal(C.multinomialExact([3, 2, 1]), 60n); // BANANA
    assert.equal(C.starsAndBars(10, 4), 286n);
    assert.equal(C.starsAndBars(6, 3, false), 10n);
  });
  it('handles empty / out-of-range input', () => {
    assert.equal(C.nCrExact(0, 0), 1n);
    assert.equal(C.nCrExact(5, -1), 0n);
    assert.equal(C.nCrExact(5, 6), 0n);
    assert.equal(C.starsAndBars(0, 0), 1n);
    assert.equal(C.starsAndBars(3, 0), 0n);
    assert.deepEqual(C.pascalTriangle(0), []);
    assert.equal(C.catalanExact(0), 1n);
    assert.equal(C.derangementsExact(0), 1n);
  });
  it('rejects non-integer arguments', () => {
    assert.throws(() => C.nCrExact(2.5, 1), TypeError);
    assert.throws(() => new C.ModCombinatorics(-1), RangeError);
  });
  it('Pascal rows agree with nCrExact and sum to 2^n', () => {
    const tri = C.pascalTriangle(40);
    tri.forEach((row, n) => {
      row.forEach((v, k) => assert.equal(BigInt(v), C.nCrExact(n, k)));
      assert.equal(row.reduce((a, b) => a + b, 0), 2 ** n);
    });
  });
  it('derangements agree with inclusion–exclusion', () => {
    for (let n = 0; n <= 8; n++) {
      const ie = C.inclusionExclusion(n, (mask) => {
        let bits = 0;
        for (let m = mask; m; m &= m - 1) bits++;
        return C.factorialExact(n - bits);
      });
      assert.equal(ie, C.derangementsExact(n));
    }
  });
});

describe('ModCombinatorics', () => {
  it('matches BigInt nCr on random inputs', () => {
    const rand = mulberry32(202);
    const mc = new C.ModCombinatorics(3000);
    for (let t = 0; t < 200; t++) {
      const n = Math.floor(rand() * 3000), k = Math.floor(rand() * (n + 3)) - 1;
      assert.equal(mc.nCr(n, k), Number(C.nCrExact(n, k) % MODn));
    }
  });
  it('catalan and nPr mod p match exact values', () => {
    const mc = new C.ModCombinatorics(200);
    for (let n = 0; n <= 100; n++) assert.equal(mc.catalan(n), Number(C.catalanExact(n) % MODn));
    assert.equal(mc.nPr(10, 3), 720);
  });
  it('throws when n exceeds the table', () => {
    assert.throws(() => new C.ModCombinatorics(10).nCr(11, 2), RangeError);
  });
});

describe('permutations in order', () => {
  it('nextPermutation walks every permutation, including duplicates', () => {
    const a = [1, 2, 2, 3];
    let count = 1;
    while (C.nextPermutation(a)) count++;
    assert.equal(count, 12); // 4!/2!
    assert.deepEqual(a, [1, 2, 2, 3]); // wraps back to sorted
  });
  it('kthPermutation matches enumeration (sorted / reverse-sorted ends)', () => {
    for (let n = 1; n <= 6; n++) {
      const all = C.allPermutations(Array.from({ length: n }, (_, i) => i + 1));
      all.forEach((p, i) => assert.deepEqual(C.kthPermutation(n, i + 1), p));
    }
    assert.throws(() => C.kthPermutation(3, 7), RangeError);
  });
});

describe('selected solutions on extra edge cases', () => {
  it("Pascal's Triangle", () => {
    assert.deepEqual(pascal.optimal(3), [[1], [1, 1], [1, 2, 1]]);
    assert.deepEqual(pascal.optimal(0), []);
  });
  it('Unique Paths: thin grids and exact huge answer', () => {
    assert.equal(paths.optimal(1, 100), 1);
    assert.equal(paths.optimal(100, 1), 1);
    assert.equal(paths.exactBig(50, 50), C.nCrExact(98, 49));
  });
  it('Distribute Candies: matches brute force on random inputs', () => {
    const rand = mulberry32(303);
    for (let t = 0; t < 200; t++) {
      const n = 1 + Math.floor(rand() * 40), limit = 1 + Math.floor(rand() * 20);
      assert.equal(candies.optimal(n, limit), candies.bruteForce(n, limit));
    }
  });
  it('Permutation Sequence: first and last', () => {
    assert.equal(kth.optimal(5, 1), '12345');
    assert.equal(kth.optimal(5, 120), '54321');
  });
  it('Count Anagrams: duplicates and long words', () => {
    assert.equal(anagrams.optimal('zzzz'), 1);
    assert.equal(anagrams.optimal('ab ba ab'), 8);
    const w = 'abcab'.repeat(500);
    assert.equal(anagrams.optimal(w), anagrams.exactBig(w));
  });
});

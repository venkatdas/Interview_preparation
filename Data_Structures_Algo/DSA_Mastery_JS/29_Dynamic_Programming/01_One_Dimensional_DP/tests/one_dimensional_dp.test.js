// node:test suite for 1D DP solutions.
// Every exported version (bruteForce / memo / tabulation / optimized / greedy) must agree
// with every other version, on edge cases and on seeded random small inputs.
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const sol = (name) => require(`../03_Problems/solutions/${name}`);

// Seeded PRNG so a failing random case can be reproduced exactly.
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const randInt = (rand, lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const randArray = (rand, len, lo, hi) => Array.from({ length: len }, () => randInt(rand, lo, hi));

// Run every exported function on (deep-copied) args and check they all equal `expected`
// (or, when expected is undefined, equal the bruteForce answer).
function allAgree(mod, args, expected) {
  const fns = Object.entries(mod).filter(([, f]) => typeof f === 'function');
  const copy = () => JSON.parse(JSON.stringify(args));
  const want = expected !== undefined ? expected : mod.bruteForce(...copy());
  for (const [name, fn] of fns) {
    assert.deepEqual(fn(...copy()), want, `${name}(${JSON.stringify(args)})`);
  }
  return want;
}

describe('Fibonacci family (01, 02, 04)', () => {
  const fib = sol('01_fibonacci_number');
  const stairs = sol('02_climbing_stairs');
  const trib = sol('04_nth_tribonacci');
  it('handles base cases', () => {
    allAgree(fib, [0], 0);
    allAgree(fib, [1], 1);
    allAgree(stairs, [1], 1);
    allAgree(stairs, [2], 2);
    allAgree(trib, [0], 0);
    allAgree(trib, [1], 1);
    allAgree(trib, [2], 1);
  });
  it('matches known values', () => {
    allAgree(fib, [10], 55);
    allAgree(stairs, [5], 8);
    allAgree(trib, [4], 4);
    allAgree(trib, [25], 1389537);
  });
  it('all versions agree for n up to 20', () => {
    for (let n = 1; n <= 20; n++) { allAgree(fib, [n]); allAgree(stairs, [n]); allAgree(trib, [n]); }
  });
});

describe('03 Min Cost Climbing Stairs', () => {
  const m = sol('03_min_cost_climbing_stairs');
  it('handles examples and two-step input', () => {
    allAgree(m, [[10, 15, 20]], 15);
    allAgree(m, [[1, 100, 1, 1, 1, 100, 1, 1, 100, 1]], 6);
    allAgree(m, [[5, 3]], 3);
  });
  it('matches brute force on random inputs', () => {
    const rand = mulberry32(3);
    for (let t = 0; t < 200; t++) allAgree(m, [randArray(rand, randInt(rand, 2, 14), 0, 20)]);
  });
});

describe('05/06 House Robber I and II', () => {
  const hr = sol('05_house_robber');
  const hr2 = sol('06_house_robber_ii');
  it('handles tiny inputs', () => {
    allAgree(hr, [[5]], 5);
    allAgree(hr, [[2, 7, 9, 3, 1]], 12);
    allAgree(hr2, [[5]], 5);
    allAgree(hr2, [[2, 3, 2]], 3);
    allAgree(hr2, [[1, 2, 3, 1]], 4);
  });
  it('handles all zeros', () => {
    allAgree(hr, [[0, 0, 0]], 0);
    allAgree(hr2, [[0, 0, 0]], 0);
  });
  it('matches brute force on random inputs', () => {
    const rand = mulberry32(5);
    for (let t = 0; t < 300; t++) {
      const nums = randArray(rand, randInt(rand, 1, 14), 0, 50);
      allAgree(hr, [nums]);
      allAgree(hr2, [nums]);
    }
  });
  it('circular answer never exceeds the linear one', () => {
    const rand = mulberry32(6);
    for (let t = 0; t < 200; t++) {
      const nums = randArray(rand, randInt(rand, 1, 14), 0, 50);
      assert.ok(hr2.optimized(nums) <= hr.optimized(nums));
    }
  });
});

describe('07 Delete and Earn', () => {
  const m = sol('07_delete_and_earn');
  it('handles examples, single value, duplicates', () => {
    allAgree(m, [[3, 4, 2]], 6);
    allAgree(m, [[2, 2, 3, 3, 3, 4]], 9);
    allAgree(m, [[7]], 7);
    allAgree(m, [[1, 1, 1, 1]], 4);
  });
  it('matches brute force on random inputs', () => {
    const rand = mulberry32(7);
    for (let t = 0; t < 200; t++) allAgree(m, [randArray(rand, randInt(rand, 1, 10), 1, 12)]);
  });
});

describe('08 Maximum Subarray (Kadane)', () => {
  const m = sol('08_maximum_subarray');
  it('handles example, all negatives, single element', () => {
    allAgree(m, [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], 6);
    allAgree(m, [[-3, -1, -2]], -1);
    allAgree(m, [[-5]], -5);
    allAgree(m, [[5, 4, -1, 7, 8]], 23);
  });
  it('matches brute force on random inputs (negatives included)', () => {
    const rand = mulberry32(8);
    for (let t = 0; t < 300; t++) allAgree(m, [randArray(rand, randInt(rand, 1, 15), -20, 20)]);
  });
});

describe('09 Counting Bits', () => {
  const m = sol('09_counting_bits');
  it('handles n = 0 and small n', () => {
    allAgree(m, [0], [0]);
    allAgree(m, [5], [0, 1, 1, 2, 1, 2]);
  });
  it('all versions agree up to n = 300', () => {
    for (const n of [1, 2, 7, 8, 63, 64, 300]) allAgree(m, [n]);
  });
});

describe('10 Decode Ways', () => {
  const m = sol('10_decode_ways');
  it('handles zeros correctly', () => {
    allAgree(m, ['0'], 0);
    allAgree(m, ['06'], 0);
    allAgree(m, ['10'], 1);
    allAgree(m, ['100'], 0);
    allAgree(m, ['2101'], 1);
  });
  it('handles examples', () => {
    allAgree(m, ['12'], 2);
    allAgree(m, ['226'], 3);
    allAgree(m, ['27'], 1);
  });
  it('matches brute force on random digit strings', () => {
    const rand = mulberry32(10);
    for (let t = 0; t < 300; t++) {
      const s = randArray(rand, randInt(rand, 1, 14), 0, 9).join('');
      allAgree(m, [s]);
    }
  });
});

describe('11/12 Jump Game I and II', () => {
  const jg = sol('11_jump_game');
  const jg2 = sol('12_jump_game_ii');
  it('handles examples and single element', () => {
    allAgree(jg, [[2, 3, 1, 1, 4]], true);
    allAgree(jg, [[3, 2, 1, 0, 4]], false);
    allAgree(jg, [[0]], true);
    allAgree(jg2, [[2, 3, 1, 1, 4]], 2);
    allAgree(jg2, [[0]], 0);
  });
  it('matches brute force on random inputs (II only on reachable inputs)', () => {
    const rand = mulberry32(11);
    for (let t = 0; t < 300; t++) {
      const nums = randArray(rand, randInt(rand, 1, 12), 0, 4);
      const reachable = allAgree(jg, [nums]);
      if (reachable) allAgree(jg2, [nums]);
    }
  });
});

describe('13 Paint House', () => {
  const m = sol('13_paint_house');
  it('handles example and one house', () => {
    allAgree(m, [[[17, 2, 17], [16, 16, 5], [14, 3, 19]]], 10);
    allAgree(m, [[[7, 6, 2]]], 2);
  });
  it('matches brute force on random inputs', () => {
    const rand = mulberry32(13);
    for (let t = 0; t < 200; t++) {
      const costs = Array.from({ length: randInt(rand, 1, 8) }, () => randArray(rand, 3, 1, 20));
      allAgree(m, [costs]);
    }
  });
});

describe('14/15/16 amount and split DP', () => {
  const ps = sol('14_perfect_squares');
  const cc = sol('15_coin_change');
  const ib = sol('16_integer_break');
  it('handles known values', () => {
    allAgree(ps, [12], 3);
    allAgree(ps, [13], 2);
    allAgree(ps, [1], 1);
    allAgree(cc, [[1, 2, 5], 11], 3);
    allAgree(cc, [[2], 3], -1);
    allAgree(cc, [[1], 0], 0);
    allAgree(ib, [2], 1);
    allAgree(ib, [10], 36);
  });
  it('all versions agree on small inputs', () => {
    for (let n = 1; n <= 30; n++) allAgree(ps, [n]);
    for (let n = 2; n <= 20; n++) allAgree(ib, [n]);
    const rand = mulberry32(15);
    for (let t = 0; t < 200; t++) {
      const coins = [...new Set(randArray(rand, randInt(rand, 1, 4), 1, 9))];
      allAgree(cc, [coins, randInt(rand, 0, 25)]);
    }
  });
});

describe('17 Word Break', () => {
  const m = sol('17_word_break');
  it('handles examples', () => {
    allAgree(m, ['leetcode', ['leet', 'code']], true);
    allAgree(m, ['applepenapple', ['apple', 'pen']], true);
    allAgree(m, ['catsandog', ['cats', 'dog', 'sand', 'and', 'cat']], false);
  });
  it('matches brute force on random strings over {a,b}', () => {
    const rand = mulberry32(17);
    const pool = ['a', 'b', 'ab', 'ba', 'aa', 'bb', 'aab', 'bba', 'abab'];
    for (let t = 0; t < 300; t++) {
      const s = Array.from({ length: randInt(rand, 1, 12) }, () => (rand() < 0.5 ? 'a' : 'b')).join('');
      const dict = pool.filter(() => rand() < 0.35);
      if (dict.length === 0) dict.push('ab');
      allAgree(m, [s, dict]);
    }
  });
});

describe('18/19 Stock state machines', () => {
  const cd = sol('18_stock_with_cooldown');
  const fee = sol('19_stock_with_transaction_fee');
  it('handles examples and tiny inputs', () => {
    allAgree(cd, [[1, 2, 3, 0, 2]], 3);
    allAgree(cd, [[1]], 0);
    allAgree(cd, [[5, 4, 3, 2]], 0);
    allAgree(fee, [[1, 3, 2, 8, 4, 9], 2], 8);
    allAgree(fee, [[1], 0], 0);
    allAgree(fee, [[1, 3, 7, 5, 10, 3], 3], 6);
  });
  it('matches brute force on random prices', () => {
    const rand = mulberry32(19);
    for (let t = 0; t < 300; t++) {
      const prices = randArray(rand, randInt(rand, 1, 12), 1, 15);
      allAgree(cd, [prices]);
      allAgree(fee, [prices, randInt(rand, 0, 5)]);
    }
  });
});

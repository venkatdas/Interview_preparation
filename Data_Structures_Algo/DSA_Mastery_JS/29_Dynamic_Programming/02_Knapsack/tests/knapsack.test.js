// node:test suite for the knapsack family.
// 1. 02_Implementations/knapsack.js is compared against a brute force that tries every subset /
//    every multiset.  2. Every exported version of the solution files must agree.
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  knapsack01, knapsack01Table, knapsackUnbounded, subsetSum, countSubsets,
} = require('../02_Implementations/knapsack');

const sol = (name) => require(`../03_Problems/solutions/${name}`);

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

// ---------- brute-force references ----------
function bruteSubsets(n, visit) {
  for (let mask = 0; mask < 1 << n; mask++) visit(mask);
}
function brute01(w, v, cap) {
  let best = 0;
  bruteSubsets(w.length, (mask) => {
    let tw = 0, tv = 0;
    for (let i = 0; i < w.length; i++) if (mask & (1 << i)) { tw += w[i]; tv += v[i]; }
    if (tw <= cap) best = Math.max(best, tv);
  });
  return best;
}
function bruteUnbounded(w, v, cap) {
  // try every count of item i (0..cap / w[i])
  function go(i, room) {
    if (i === w.length) return 0;
    let best = go(i + 1, room);
    for (let k = 1; k * w[i] <= room; k++) best = Math.max(best, k * v[i] + go(i + 1, room - k * w[i]));
    return best;
  }
  return go(0, cap);
}
function bruteCount(nums, target) {
  let count = 0;
  bruteSubsets(nums.length, (mask) => {
    let s = 0;
    for (let i = 0; i < nums.length; i++) if (mask & (1 << i)) s += nums[i];
    if (s === target) count++;
  });
  return count;
}

function allAgree(mod, args, expected) {
  const copy = () => JSON.parse(JSON.stringify(args));
  const want = expected !== undefined ? expected : mod.bruteForce(...copy());
  for (const [name, fn] of Object.entries(mod)) {
    if (typeof fn !== 'function') continue;
    assert.deepEqual(fn(...copy()), want, `${name}(${JSON.stringify(args)})`);
  }
  return want;
}

describe('knapsack.js implementations', () => {
  it('handles the classic example', () => {
    assert.equal(knapsack01([1, 3, 4, 5], [1, 4, 5, 7], 7), 9);
    assert.equal(knapsack01Table([1, 3, 4, 5], [1, 4, 5, 7], 7), 9);
    assert.equal(knapsackUnbounded([1, 3, 4, 5], [1, 4, 5, 7], 7), 9);
  });
  it('handles empty items and zero capacity', () => {
    assert.equal(knapsack01([], [], 10), 0);
    assert.equal(knapsack01([2, 3], [5, 6], 0), 0);
    assert.equal(knapsackUnbounded([], [], 10), 0);
    assert.equal(subsetSum([], 0), true);
    assert.equal(subsetSum([], 3), false);
    assert.equal(countSubsets([], 0), 1);
  });
  it('handles items heavier than capacity and negative targets', () => {
    assert.equal(knapsack01([10, 20], [5, 6], 5), 0);
    assert.equal(subsetSum([1, 2], -1), false);
    assert.equal(countSubsets([1, 2], -1), 0);
  });
  it('counts zeros twice (take or skip each zero)', () => {
    assert.equal(countSubsets([0, 0, 1], 1), 4);
  });
  it('0/1 and unbounded match brute force on random inputs', () => {
    const rand = mulberry32(42);
    for (let t = 0; t < 300; t++) {
      const n = randInt(rand, 0, 9);
      const w = randArray(rand, n, 1, 8);
      const v = randArray(rand, n, 0, 15);
      const cap = randInt(rand, 0, 20);
      const want = brute01(w, v, cap);
      assert.equal(knapsack01(w, v, cap), want);
      assert.equal(knapsack01Table(w, v, cap), want);
      assert.equal(knapsackUnbounded(w, v, cap), bruteUnbounded(w, v, cap));
      assert.ok(knapsackUnbounded(w, v, cap) >= want, 'unbounded can only do better');
    }
  });
  it('subsetSum and countSubsets match brute force on random inputs', () => {
    const rand = mulberry32(43);
    for (let t = 0; t < 300; t++) {
      const nums = randArray(rand, randInt(rand, 0, 10), 0, 9);
      const target = randInt(rand, 0, 30);
      const c = bruteCount(nums, target);
      assert.equal(countSubsets(nums, target), c);
      assert.equal(subsetSum(nums, target), c > 0);
    }
  });
});

describe('solution files: all versions agree', () => {
  const rand = mulberry32(7);

  it('01 0/1 knapsack and 02 unbounded knapsack', () => {
    const k01 = sol('01_knapsack_01_basic');
    const kub = sol('02_unbounded_knapsack_basic');
    allAgree(k01, [[1, 3, 4, 5], [1, 4, 5, 7], 7], 9);
    allAgree(k01, [[2, 3], [3, 4], 1], 0);
    allAgree(k01, [[], [], 5], 0);
    for (let t = 0; t < 150; t++) {
      const n = randInt(rand, 0, 8);
      const w = randArray(rand, n, 1, 7);
      const v = randArray(rand, n, 0, 12);
      const cap = randInt(rand, 0, 15);
      assert.equal(allAgree(k01, [w, v, cap]), brute01(w, v, cap));
      assert.equal(allAgree(kub, [w, v, cap]), bruteUnbounded(w, v, cap));
    }
  });

  it('03 Partition Equal Subset Sum', () => {
    const m = sol('03_subset_sum_partition_equal');
    allAgree(m, [[1, 5, 11, 5]], true);
    allAgree(m, [[1, 2, 3, 5]], false);
    allAgree(m, [[1]], false);
    allAgree(m, [[2, 2]], true);
    for (let t = 0; t < 200; t++) allAgree(m, [randArray(rand, randInt(rand, 1, 10), 1, 12)]);
  });

  it('04 Coin Change (min coins) and 05 Coin Change II', () => {
    const cc = sol('04_coin_change_min_coins');
    const cc2 = sol('05_coin_change_ii');
    allAgree(cc, [[1, 2, 5], 11], 3);
    allAgree(cc, [[2], 3], -1);
    allAgree(cc, [[1], 0], 0);
    allAgree(cc2, [5, [1, 2, 5]], 4);
    allAgree(cc2, [3, [2]], 0);
    allAgree(cc2, [0, [7]], 1);
    for (let t = 0; t < 200; t++) {
      const coins = [...new Set(randArray(rand, randInt(rand, 1, 4), 1, 8))];
      const amount = randInt(rand, 0, 20);
      allAgree(cc, [coins, amount]);
      allAgree(cc2, [amount, coins]);
    }
  });

  it('06 Combination Sum IV counts orderings, so it is >= Coin Change II', () => {
    const cs = sol('06_combination_sum_iv');
    const cc2 = sol('05_coin_change_ii');
    allAgree(cs, [[1, 2, 3], 4], 7);
    allAgree(cs, [[9], 3], 0);
    for (let t = 0; t < 200; t++) {
      const nums = [...new Set(randArray(rand, randInt(rand, 1, 4), 1, 6))];
      const target = randInt(rand, 1, 14);
      const perms = allAgree(cs, [nums, target]);
      assert.ok(perms >= cc2.optimized(target, nums));
    }
  });

  it('07 Target Sum', () => {
    const m = sol('07_target_sum');
    allAgree(m, [[1, 1, 1, 1, 1], 3], 5);
    allAgree(m, [[1], 1], 1);
    allAgree(m, [[1], 2], 0);
    allAgree(m, [[0, 0, 1], 1], 4);
    allAgree(m, [[1, 2], -3], 1);
    for (let t = 0; t < 200; t++) {
      const nums = randArray(rand, randInt(rand, 1, 10), 0, 6);
      allAgree(m, [nums, randInt(rand, -10, 10)]);
    }
  });

  it('08 Last Stone Weight II and 09 Minimum Subset Sum Difference agree with each other', () => {
    const ls = sol('08_last_stone_weight_ii');
    const md = sol('09_minimum_subset_sum_difference');
    allAgree(ls, [[2, 7, 4, 1, 8, 1]], 1);
    allAgree(ls, [[31, 26, 33, 21, 40]], 5);
    allAgree(ls, [[5]], 5);
    allAgree(md, [[1, 6, 11, 5]], 1);
    for (let t = 0; t < 200; t++) {
      const nums = randArray(rand, randInt(rand, 1, 10), 1, 20);
      assert.equal(allAgree(ls, [nums]), allAgree(md, [nums]));
    }
  });

  it('10 Rod Cutting matches the unbounded knapsack implementation', () => {
    const m = sol('10_rod_cutting');
    allAgree(m, [[1, 5, 8, 9, 10, 17, 17, 20], 8], 22);
    allAgree(m, [[3, 5, 8, 9, 10, 17, 17, 20], 8], 24);
    allAgree(m, [[7], 1], 7);
    for (let t = 0; t < 150; t++) {
      const n = randInt(rand, 1, 12);
      const prices = randArray(rand, n, 0, 25);
      const lengths = prices.map((_, i) => i + 1);
      assert.equal(allAgree(m, [prices, n]), knapsackUnbounded(lengths, prices, n));
    }
  });

  it('11 Ones and Zeroes', () => {
    const m = sol('11_ones_and_zeroes');
    allAgree(m, [['10', '0001', '111001', '1', '0'], 5, 3], 4);
    allAgree(m, [['10', '0', '1'], 1, 1], 2);
    allAgree(m, [['111'], 0, 0], 0);
    for (let t = 0; t < 150; t++) {
      const strs = Array.from({ length: randInt(rand, 1, 7) }, () =>
        Array.from({ length: randInt(rand, 1, 4) }, () => (rand() < 0.5 ? '0' : '1')).join(''));
      allAgree(m, [strs, randInt(rand, 0, 6), randInt(rand, 0, 6)]);
    }
  });
});

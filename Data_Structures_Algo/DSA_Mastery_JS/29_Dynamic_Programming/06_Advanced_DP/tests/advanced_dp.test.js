// node --test 29_Dynamic_Programming/06_Advanced_DP/tests/advanced_dp.test.js
// Every exported version (bruteForce / memo / tabulation / optimized) of each advanced-DP
// solution (bitmask, tree, digit, state machine, DP + binary search / deque) must agree,
// on edge cases and on seeded random small inputs.
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
const randString = (rand, len, alpha) => Array.from({ length: len }, () => alpha[randInt(rand, 0, alpha.length - 1)]).join("");

// Run every exported solver (skipping helpers like buildTree) on deep-copied args and
// check they all equal `expected` (or the bruteForce answer when expected is undefined).
function allAgree(mod, args, expected, skip = ["buildTree"]) {
  const fns = Object.entries(mod).filter(([n, f]) => typeof f === "function" && !skip.includes(n));
  const copy = () => JSON.parse(JSON.stringify(args));
  const want = expected !== undefined ? expected : mod.bruteForce(...copy());
  for (const [name, fn] of fns) assert.deepEqual(fn(...copy()), want, `${name}(${JSON.stringify(args)})`);
  return want;
}
const rand = mulberry32(2906);
const MOD = 1_000_000_007;

// random level-order array for buildTree: values with some nulls, root never null
function randTreeArray(len, lo, hi) {
  const a = [randInt(rand, lo, hi)];
  for (let i = 1; i < len; i++) a.push(rand() < 0.25 ? null : randInt(rand, lo, hi));
  return a;
}

describe('01 Count Numbers with Unique Digits (digit DP)', () => {
  const m = sol('01_count_numbers_with_unique_digits');
  it('known values for every n it supports', () => {
    allAgree(m, [0], 1);
    allAgree(m, [1], 10);
    allAgree(m, [2], 91);
    allAgree(m, [3], 739);
    for (let n = 0; n <= 5; n++) allAgree(m, [n]);
  });
});

describe('02 Count Vowels Permutation (state machine)', () => {
  const m = sol('02_count_vowels_permutation');
  it('known values', () => {
    allAgree(m, [1], 5);
    allAgree(m, [2], 10);
    allAgree(m, [5], 68);
  });
  it('all versions agree for n = 1..10', () => {
    for (let n = 1; n <= 10; n++) allAgree(m, [n]);
  });
});

describe('03 Number of Ways to Stay in the Same Place', () => {
  const m = sol('03_number_of_ways_to_stay_in_same_place');
  it('examples and edge cases', () => {
    allAgree(m, [3, 2], 4);
    allAgree(m, [2, 4], 2);
    allAgree(m, [1, 1], 1);
    allAgree(m, [5, 1], 1);
  });
  it('random small inputs', () => {
    for (let t = 0; t < 60; t++) allAgree(m, [randInt(rand, 1, 9), randInt(rand, 1, 6)]);
  });
  it('answers stay below the modulus', () => {
    const r = m.optimized(30, 100);
    assert.ok(r >= 0 && r < MOD);
  });
});

describe('04 Frog Jump', () => {
  const m = sol('04_frog_jump');
  it('examples and edge cases', () => {
    allAgree(m, [[0, 1, 3, 5, 6, 8, 12, 17]], true);
    allAgree(m, [[0, 1, 2, 3, 4, 8, 9, 11]], false);
    allAgree(m, [[0, 1]], true);
    allAgree(m, [[0, 2]], false);
  });
  it('random stone layouts', () => {
    for (let t = 0; t < 150; t++) {
      const stones = [0];
      const len = randInt(rand, 1, 8);
      for (let i = 0; i < len; i++) stones.push(stones[stones.length - 1] + randInt(rand, 1, 4));
      allAgree(m, [stones]);
    }
  });
});

describe('05 House Robber III (tree DP)', () => {
  const m = sol('05_house_robber_iii');
  it('examples and edge cases', () => {
    allAgree(m, [m.buildTree([3, 2, 3, null, 3, null, 1])], 7);
    allAgree(m, [m.buildTree([3, 4, 5, 1, 3, null, 1])], 9);
    allAgree(m, [m.buildTree([])], 0);
    allAgree(m, [m.buildTree([4])], 4);
  });
  it('random trees', () => {
    for (let t = 0; t < 150; t++) allAgree(m, [m.buildTree(randTreeArray(randInt(rand, 1, 15), 0, 20))]);
  });
});

describe('06 Diameter of Binary Tree (tree DP)', () => {
  const m = sol('06_diameter_longest_path_tree_dp');
  it('examples and edge cases', () => {
    allAgree(m, [m.buildTree([1, 2, 3, 4, 5])], 3);
    allAgree(m, [m.buildTree([1, 2])], 1);
    allAgree(m, [m.buildTree([1])], 0);
  });
  it('random trees', () => {
    for (let t = 0; t < 150; t++) allAgree(m, [m.buildTree(randTreeArray(randInt(rand, 1, 15), 1, 9))]);
  });
});

describe('07 Minimum Difficulty of a Job Schedule', () => {
  const m = sol('07_minimum_difficulty_job_schedule');
  it('examples and edge cases', () => {
    allAgree(m, [[6, 5, 4, 3, 2, 1], 2], 7);
    allAgree(m, [[9, 9, 9], 4], -1);       // more days than jobs
    allAgree(m, [[1, 1, 1], 3], 3);
  });
  it('random inputs', () => {
    for (let t = 0; t < 150; t++) {
      const jobs = randArray(rand, randInt(rand, 1, 8), 0, 20);
      allAgree(m, [jobs, randInt(rand, 1, 5)]);
    }
  });
});

describe('08 / 09 Best Time to Buy and Sell Stock III / IV (state machine)', () => {
  const s3 = sol('08_best_time_to_buy_sell_stock_iii');
  const s4 = sol('09_best_time_to_buy_sell_stock_iv');
  it('examples and edge cases', () => {
    allAgree(s3, [[3, 3, 5, 0, 0, 3, 1, 4]], 6);
    allAgree(s3, [[7, 6, 4, 3, 1]], 0);
    allAgree(s3, [[1]], 0);
    allAgree(s4, [2, [3, 2, 6, 5, 0, 3]], 7);
    allAgree(s4, [0, [1, 5]], 0);
  });
  it('random prices; III equals IV with k = 2', () => {
    for (let t = 0; t < 150; t++) {
      const prices = randArray(rand, randInt(rand, 1, 9), 0, 10);
      const a = allAgree(s3, [prices]);
      assert.equal(allAgree(s4, [2, prices]), a);
      allAgree(s4, [randInt(rand, 0, 4), prices]);
    }
  });
});

describe('10 Maximum Profit in Job Scheduling (DP + binary search)', () => {
  const m = sol('10_maximum_profit_job_scheduling');
  it('examples and edge cases', () => {
    allAgree(m, [[1, 2, 3, 3], [3, 4, 5, 6], [50, 10, 40, 70]], 120);
    allAgree(m, [[5], [9], [8]], 8);
    allAgree(m, [[1, 3, 5], [3, 5, 7], [1, 1, 1]], 3);
  });
  it('random job sets', () => {
    for (let t = 0; t < 150; t++) {
      const n = randInt(rand, 1, 9);
      const st = randArray(rand, n, 1, 10);
      const en = st.map((s) => s + randInt(rand, 1, 5));
      allAgree(m, [st, en, randArray(rand, n, 1, 20)]);
    }
  });
});

describe('11 Partition to K Equal Sum Subsets (bitmask DP)', () => {
  const m = sol('11_partition_k_equal_sum_subsets');
  it('examples and edge cases', () => {
    allAgree(m, [[4, 3, 2, 3, 5, 2, 1], 4], true);
    allAgree(m, [[1, 2, 3, 4], 3], false);
    allAgree(m, [[5], 1], true);
    allAgree(m, [[2, 2, 2, 2], 4], true);
  });
  it('random arrays', () => {
    for (let t = 0; t < 150; t++) {
      const nums = randArray(rand, randInt(rand, 1, 8), 1, 6);
      allAgree(m, [nums, randInt(rand, 1, Math.min(4, nums.length))]);
    }
  });
});

describe('12 Binary Tree Cameras (tree DP)', () => {
  const m = sol('12_binary_tree_cameras');
  it('examples and edge cases', () => {
    allAgree(m, [m.buildTree([0, 0, null, 0, 0])], 1);
    allAgree(m, [m.buildTree([0, 0, null, 0, null, 0, null, null, 0])], 2);
    allAgree(m, [m.buildTree([0])], 1);
  });
  it('random trees', () => {
    for (let t = 0; t < 150; t++) allAgree(m, [m.buildTree(randTreeArray(randInt(rand, 1, 12), 0, 0))]);
  });
});

describe('13 Constrained Subsequence Sum (DP + monotonic deque)', () => {
  const m = sol('13_constrained_subsequence_sum');
  it('examples and edge cases', () => {
    allAgree(m, [[10, 2, -10, 5, 20], 2], 37);
    allAgree(m, [[-1, -2, -3], 1], -1);
    allAgree(m, [[10, -2, -10, -5, 20], 2], 23);
    allAgree(m, [[-5], 1], -5);
  });
  it('random arrays', () => {
    for (let t = 0; t < 150; t++) {
      const nums = randArray(rand, randInt(rand, 1, 10), -10, 10);
      allAgree(m, [nums, randInt(rand, 1, nums.length)]);
    }
  });
});

describe('14 Find the Shortest Superstring (bitmask + last, TSP)', () => {
  const m = sol('14_shortest_superstring_tsp');
  const solvers = Object.entries(m).filter(([, f]) => typeof f === 'function');
  const check = (words) => {
    const len = m.bruteForce([...words]).length;
    for (const [name, fn] of solvers) {
      const out = fn([...words]);
      assert.equal(out.length, len, `${name} length on ${words}`);
      for (const w of words) assert.ok(out.includes(w), `${name} output misses ${w}`);
    }
  };
  it('examples and edge cases', () => {
    check(['alex', 'loves', 'leetcode']);
    check(['catg', 'ctaagt', 'gcta', 'ttca', 'atgcatc']);
    check(['abc']);
  });
  it('random word sets (no word inside another, as the problem guarantees)', () => {
    for (let t = 0; t < 60; t++) {
      const raw = [...new Set(Array.from({ length: randInt(rand, 1, 5) }, () => randString(rand, randInt(rand, 1, 4), 'ab')))];
      const words = raw.filter((w) => !raw.some((o) => o !== w && o.includes(w)));
      check(words);
    }
  });
});

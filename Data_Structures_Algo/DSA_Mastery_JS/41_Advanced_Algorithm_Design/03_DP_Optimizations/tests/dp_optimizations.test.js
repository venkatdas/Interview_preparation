const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const D = require('../02_Implementations/dp_optimizations');

const rand = D.mulberry32(777);
const ri = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const arr = (len, lo, hi) => Array.from({ length: len }, () => ri(lo, hi));

describe('prefix-sum transition (countWaysWindow)', () => {
  it('handles normal case (stairs = Fibonacci)', () => {
    assert.equal(D.countWaysWindow(5, 1, 2), 8);
  });
  it('handles empty walk and blocked tiles', () => {
    assert.equal(D.countWaysWindow(0, 1, 3), 1);
    assert.equal(D.countWaysWindow(4, 1, 2, [0]), 0);
    assert.equal(D.countWaysWindow(4, 1, 2, [4]), 0);
  });
  it('rejects bad jump ranges', () => {
    assert.throws(() => D.countWaysWindow(5, 3, 2), RangeError);
  });
  it('matches brute force on random inputs', () => {
    for (let t = 0; t < 200; t++) {
      const target = ri(0, 40); const lo = ri(1, 4); const hi = lo + ri(0, 5);
      const blocked = arr(ri(0, 4), 1, 40);
      assert.equal(D.countWaysWindow(target, lo, hi, blocked), D.countWaysWindowBrute(target, lo, hi, blocked));
    }
  });
});

describe('monotonic deque transition (windowMaxDP)', () => {
  it('handles normal case', () => {
    assert.deepEqual(D.windowMaxDP([10, -5, -2, 4, 0, 3], 3), [10, 5, 8, 14, 14, 17]);
  });
  it('handles single element, all negatives and k >= n', () => {
    assert.deepEqual(D.windowMaxDP([-3], 1), [-3]);
    assert.deepEqual(D.windowMaxDP([-1, -2, -3], 5, true), [-1, -2, -3]);
  });
  it('matches brute force on random inputs', () => {
    for (let t = 0; t < 200; t++) {
      const nums = arr(ri(1, 30), -10, 10); const k = ri(1, 8);
      assert.deepEqual(D.windowMaxDP(nums, k), D.windowMaxDPBrute(nums, k));
      assert.deepEqual(D.windowMaxDP(nums, k, true), D.windowMaxDPBrute(nums, k, true));
    }
  });
});

describe('binary-search optimizations', () => {
  it('LIS handles duplicates, sorted and reverse-sorted input', () => {
    assert.equal(D.lengthOfLIS([7, 7, 7]), 1);
    assert.equal(D.lengthOfLIS([1, 2, 3, 4]), 4);
    assert.equal(D.lengthOfLIS([4, 3, 2, 1]), 1);
    assert.equal(D.lengthOfLIS([]), 0);
  });
  it('weighted interval scheduling handles touching and nested jobs', () => {
    assert.equal(D.weightedIntervalScheduling([[1, 2, 5], [2, 3, 5], [1, 3, 9]]), 10);
    assert.equal(D.weightedIntervalScheduling([]), 0);
  });
  it('matches brute force on random inputs', () => {
    for (let t = 0; t < 200; t++) {
      const nums = arr(ri(0, 30), -20, 20);
      assert.equal(D.lengthOfLIS(nums), D.lengthOfLISBrute(nums));
      const jobs = Array.from({ length: ri(0, 15) }, () => { const s = ri(0, 30); return [s, s + ri(1, 10), ri(1, 50)]; });
      assert.equal(D.weightedIntervalScheduling(jobs), D.weightedIntervalSchedulingBrute(jobs));
    }
  });
});

describe('divide & conquer and Knuth optimizations', () => {
  it('handles k = 1 and k = n', () => {
    const pre = [0, 1, 3, 6];
    const sq = (l, r) => (pre[r] - pre[l]) ** 2;
    assert.equal(D.divideAndConquerDP(3, 1, sq), 36);
    assert.equal(D.divideAndConquerDP(3, 3, sq), 14);
    assert.throws(() => D.divideAndConquerDP(3, 4, sq), RangeError);
  });
  it('Knuth merge handles empty, single and equal piles', () => {
    assert.equal(D.knuthOptimalMerge([]), 0);
    assert.equal(D.knuthOptimalMerge([9]), 0);
    assert.equal(D.knuthOptimalMerge([1, 1, 1, 1]), 8);
  });
  it('matches brute force on random inputs', () => {
    for (let t = 0; t < 200; t++) {
      const a = arr(ri(1, 25), 0, 30);
      const pre = [0];
      for (const x of a) pre.push(pre[pre.length - 1] + x);
      const sq = (l, r) => (pre[r] - pre[l]) ** 2;
      const k = ri(1, a.length);
      assert.equal(D.divideAndConquerDP(a.length, k, sq), D.divideAndConquerDPBrute(a.length, k, sq));
      assert.equal(D.knuthOptimalMerge(a), D.knuthOptimalMergeBrute(a));
    }
  });
});

describe('convex hull trick', () => {
  it('handles parallel lines and a single line', () => {
    const cht = new D.MonotoneCHT();
    cht.addLine(1, 5); cht.addLine(1, 2); cht.addLine(1, 9);
    assert.equal(cht.query(0), 2);
    const lc = new D.LiChaoTree(0, 10);
    lc.addLine(2, 3);
    assert.equal(lc.query(4), 11);
  });
  it('rejects increasing slopes in the monotone version', () => {
    const cht = new D.MonotoneCHT();
    cht.addLine(0, 0);
    assert.throws(() => cht.addLine(1, 0), RangeError);
  });
  it('matches brute force on random inputs', () => {
    for (let t = 0; t < 200; t++) {
      const lines = Array.from({ length: ri(1, 20) }, () => [ri(-30, 30), ri(-100, 100)]);
      const lc = new D.LiChaoTree(-50, 50);
      for (const [m, b] of lines) lc.addLine(m, b);          // any order
      const cht = new D.MonotoneCHT();
      for (const [m, b] of lines.slice().sort((p, q) => q[0] - p[0])) cht.addLine(m, b);
      const xs = arr(12, -50, 50).sort((p, q) => p - q);
      for (const x of xs) {
        const want = Math.min(...lines.map(([m, b]) => m * x + b));
        assert.equal(lc.query(x), want);
        assert.equal(cht.query(x), want);
      }
    }
  });
});

describe('bitset, bitmask and space optimizations', () => {
  it('handles empty inputs', () => {
    assert.equal(D.bitsetSubsetSum([], 0), true);
    assert.equal(D.bitsetSubsetSum([], 3), false);
    assert.equal(D.knapsack01([], [], 10), 0);
  });
  it('matches brute force on random inputs', () => {
    for (let t = 0; t < 200; t++) {
      const nums = arr(ri(0, 12), 1, 20); const target = ri(0, 80);
      assert.equal(D.bitsetSubsetSum(nums, target), D.subsetSumBrute(nums, target));
      const n = ri(1, 6);
      const cost = Array.from({ length: n }, () => arr(n, 0, 30));
      assert.equal(D.minCostAssignment(cost), D.minCostAssignmentBrute(cost));
      const w = arr(ri(0, 10), 1, 12); const v = arr(w.length, 0, 25); const cap = ri(0, 40);
      assert.equal(D.knapsack01(w, v, cap), D.knapsack01Brute(w, v, cap));
    }
  });
});

describe('problem solutions (extra edge cases)', () => {
  it('Jump Game VI', () => {
    const { optimal, bruteForce } = require('../03_Problems/solutions/01_jump_game_vi');
    assert.equal(optimal([0, 0, 0, 0], 1), 0);
    assert.equal(optimal([3, -10, -10, 3], 3), bruteForce([3, -10, -10, 3], 3));
  });
  it('Constrained Subsequence Sum', () => {
    const { optimal } = require('../03_Problems/solutions/03_constrained_subsequence_sum');
    assert.equal(optimal([-10000], 1), -10000);
    assert.equal(optimal([5, -1, 5], 1), 9);
  });
  it('Maximum Profit in Job Scheduling', () => {
    const { optimal } = require('../03_Problems/solutions/04_maximum_profit_job_scheduling');
    assert.equal(optimal([1, 1, 1, 1], [2, 2, 2, 2], [1, 2, 3, 4]), 4);
  });
  it('Split array into k parts', () => {
    const { optimal, bruteForce } = require('../03_Problems/solutions/05_split_array_min_sum_of_squares');
    const nums = Array.from({ length: 120 }, (_, i) => (i * 37) % 50);
    assert.equal(optimal(nums, 7), bruteForce(nums, 7));
  });
  it('Frog jump and merge stones', () => {
    const frog = require('../03_Problems/solutions/06_frog_jump_quadratic_cost');
    assert.equal(frog.optimal([0, 100000], 0), 1e10);
    const stones = require('../03_Problems/solutions/07_minimum_cost_to_merge_stones');
    assert.equal(stones.optimal([1, 2], 3), -1);
    assert.equal(stones.knuthK2([1, 2, 3, 4]), stones.optimal([1, 2, 3, 4], 2));
  });
});

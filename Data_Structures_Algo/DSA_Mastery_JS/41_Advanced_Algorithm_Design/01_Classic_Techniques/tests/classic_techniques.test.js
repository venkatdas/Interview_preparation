// node --test 41_Advanced_Algorithm_Design/01_Classic_Techniques/tests/classic_techniques.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const T = require('../02_Implementations/classic_techniques');

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(4101);
const rint = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));
const rarr = (n, lo, hi) => Array.from({ length: n }, () => rint(lo, hi));
const sorted = (a) => [...a].sort((x, y) => x - y);

describe('Kadane', () => {
  it('examples and all-negative input', () => {
    assert.equal(T.kadane([-2, 1, -3, 4, -1, 2, 1, -5, 4]), 6);
    assert.equal(T.kadane([-3, -1, -2]), -1);
    assert.equal(T.kadane([5]), 5);
  });
  it('matches O(n^2) brute force', () => {
    for (let t = 0; t < 300; t++) {
      const a = rarr(rint(1, 20), -10, 10);
      let best = -Infinity;
      for (let i = 0; i < a.length; i++) { let s = 0; for (let j = i; j < a.length; j++) { s += a[j]; best = Math.max(best, s); } }
      assert.equal(T.kadane(a), best);
    }
  });
});

describe('Boyer-Moore majority vote', () => {
  it('finds the majority when one exists', () => {
    for (let t = 0; t < 200; t++) {
      const n = rint(1, 25), maj = rint(0, 5);
      const a = rarr(n, 0, 5);
      for (let i = 0; i < Math.floor(n / 2) + 1; i++) a[i] = maj;
      a.sort(() => rand() - 0.5);
      assert.equal(T.majorityVote(a), maj);
    }
  });
  it('majorityVoteK returns exactly the values with count > n/k', () => {
    for (let t = 0; t < 300; t++) {
      const a = rarr(rint(1, 25), 0, 4), k = rint(2, 5);
      const counts = new Map(); a.forEach((x) => counts.set(x, (counts.get(x) || 0) + 1));
      const want = [...counts].filter(([, c]) => c > a.length / k).map(([v]) => v);
      assert.deepEqual(sorted(T.majorityVoteK(a, k)), sorted(want));
    }
  });
});

describe('array tricks', () => {
  it('Floyd finds the duplicate in [1..n] arrays of length n+1', () => {
    for (let t = 0; t < 200; t++) {
      const n = rint(1, 15), dup = rint(1, n);
      const a = Array.from({ length: n }, (_, i) => i + 1);
      const extra = rint(1, 3);
      for (let e = 0; e < extra; e++) a.push(dup);
      // keep length n + 1 by replacing other values with dup when extra > 1
      while (a.length > n + 1) { const i = a.findIndex((v) => v !== dup); a.splice(i, 1); }
      a.sort(() => rand() - 0.5);
      assert.equal(T.floydFindDuplicate(a), dup);
    }
  });
  it('Dutch national flag sorts 0/1/2 in place', () => {
    for (let t = 0; t < 200; t++) {
      const a = rarr(rint(0, 20), 0, 2);
      assert.deepEqual(T.dutchNationalFlag([...a]), sorted(a));
    }
  });
  it('cyclic sort places 1..n', () => {
    for (let t = 0; t < 100; t++) {
      const n = rint(0, 15);
      const a = Array.from({ length: n }, (_, i) => i + 1).sort(() => rand() - 0.5);
      assert.deepEqual(T.cyclicSort(a), Array.from({ length: n }, (_, i) => i + 1));
    }
  });
  it('quickSelect returns the k-th smallest (0-indexed), with duplicates', () => {
    for (let t = 0; t < 300; t++) {
      const a = rarr(rint(1, 20), -5, 5), k = rint(0, a.length - 1);
      assert.equal(T.quickSelect(a, k), sorted(a)[k]);
    }
  });
});

describe('randomised sampling (statistical sanity)', () => {
  it('Fisher-Yates returns a permutation and every position is roughly uniform', () => {
    const counts = Array.from({ length: 4 }, () => new Array(4).fill(0));
    const N = 20000;
    for (let t = 0; t < N; t++) {
      const p = T.fisherYates([0, 1, 2, 3]);
      assert.deepEqual(sorted(p), [0, 1, 2, 3]);
      p.forEach((v, i) => counts[v][i]++);
    }
    for (const row of counts) for (const c of row) assert.ok(Math.abs(c / N - 0.25) < 0.03);
  });
  it('reservoir sampling picks each item with probability k/n', () => {
    const n = 10, k = 3, N = 20000, hits = new Array(n).fill(0);
    for (let t = 0; t < N; t++) {
      const s = T.reservoirSample(Array.from({ length: n }, (_, i) => i), k);
      assert.equal(new Set(s).size, k);
      s.forEach((v) => hits[v]++);
    }
    for (const h of hits) assert.ok(Math.abs(h / N - k / n) < 0.03);
    assert.deepEqual(T.reservoirSample([1, 2], 5), [1, 2]);
  });
});

describe('binary lifting and sqrt decomposition', () => {
  function randomTree(n) {
    const parent = [-1];
    for (let v = 1; v < n; v++) parent.push(rint(0, v - 1));
    return parent;
  }
  const ancestors = (parent, v) => { const out = []; for (let x = v; x !== -1; x = parent[x]) out.push(x); return out; };
  it('LCA and kth ancestor match walking up the parent array', () => {
    for (let t = 0; t < 60; t++) {
      const n = rint(1, 40), parent = randomTree(n);
      const { lca, kthAncestor, depth } = T.binaryLiftingLCA(n, parent.map((p) => (p === -1 ? 0 : p)), 0);
      for (let q = 0; q < 40; q++) {
        const u = rint(0, n - 1), v = rint(0, n - 1);
        const au = new Set(ancestors(parent, u));
        assert.equal(lca(u, v), ancestors(parent, v).find((x) => au.has(x)));
        const k = rint(0, depth[u] + 2);
        const path = ancestors(parent, u);
        assert.equal(kthAncestor(u, k), k < path.length ? path[k] : -1);
      }
    }
  });
  it('sqrt decomposition range sum matches a loop under updates', () => {
    for (let t = 0; t < 80; t++) {
      const a = rarr(rint(1, 40), -20, 20), sd = T.sqrtDecompositionRangeSum(a);
      for (let q = 0; q < 60; q++) {
        if (rand() < 0.4) { const i = rint(0, a.length - 1), v = rint(-20, 20); a[i] = v; sd.update(i, v); }
        else { const l = rint(0, a.length - 1), r = rint(l, a.length - 1); let s = 0; for (let i = l; i <= r; i++) s += a[i]; assert.equal(sd.query(l, r), s); }
      }
    }
  });
});

describe('solution files: optimal vs bruteForce', () => {
  const p01 = require('../03_Problems/solutions/01_majority_element_ii');
  const p02 = require('../03_Problems/solutions/02_find_the_duplicate_number');
  const p03 = require('../03_Problems/solutions/03_shuffle_an_array');
  const p06 = require('../03_Problems/solutions/06_range_sum_sqrt_decomposition');
  const p07 = require('../03_Problems/solutions/07_lowest_common_ancestor_binary_lifting');
  const p08 = require('../03_Problems/solutions/08_kth_ancestor_of_a_tree_node');
  const p09 = require('../03_Problems/solutions/09_closest_subsequence_sum');
  const p10 = require('../03_Problems/solutions/10_partition_array_minimize_sum_difference');
  it('array problems', () => {
    for (let t = 0; t < 150; t++) {
      const a = rarr(rint(1, 15), 0, 3);
      assert.deepEqual(sorted(p01.optimal([...a])), sorted(p01.bruteForce([...a])));
      const n = rint(1, 10), d = rint(1, n);
      const b = [...Array.from({ length: n }, (_, i) => i + 1), d].sort(() => rand() - 0.5);
      assert.equal(p02.optimal([...b]), d);
      assert.equal(p02.binarySearchOnValue([...b]), d);
      assert.equal(p02.bruteForce([...b]), d);
      const c = rarr(rint(1, 12), -20, 20), goal = rint(-40, 40);
      assert.equal(p09.optimal(c, goal), p09.bruteForce(c, goal));
      const e = rarr(2 * rint(1, 5), -15, 15);
      assert.equal(p10.optimal(e), p10.bruteForce(e));
    }
  });
  it('shuffle returns permutations and reset restores the original', () => {
    const s = new p03.optimal([1, 2, 3, 4]);
    for (let t = 0; t < 50; t++) assert.deepEqual(sorted(s.shuffle()), [1, 2, 3, 4]);
    assert.deepEqual(s.reset(), [1, 2, 3, 4]);
  });
  it('range sum, LCA and kth ancestor', () => {
    for (let t = 0; t < 60; t++) {
      const nums = rarr(rint(1, 30), -9, 9);
      const x = new p06.optimal([...nums]), y = new p06.bruteForce([...nums]);
      for (let q = 0; q < 30; q++) {
        if (rand() < 0.4) { const i = rint(0, nums.length - 1), v = rint(-9, 9); x.update(i, v); y.update(i, v); }
        else { const l = rint(0, nums.length - 1), r = rint(l, nums.length - 1); assert.equal(x.sumRange(l, r), y.sumRange(l, r)); }
      }
      const n = rint(1, 30), parent = [-1];
      for (let v = 1; v < n; v++) parent.push(rint(0, v - 1));
      const qs = Array.from({ length: 20 }, () => [rint(0, n - 1), rint(0, n - 1)]);
      assert.deepEqual(p07.optimal(parent, qs), p07.bruteForce(parent, qs));
      const ta = new p08.optimal(n, parent), tb = new p08.bruteForce(n, parent);
      for (let q = 0; q < 20; q++) { const v = rint(0, n - 1), k = rint(1, n + 1); assert.equal(ta.getKthAncestor(v, k), tb.getKthAncestor(v, k)); }
    }
  });
});

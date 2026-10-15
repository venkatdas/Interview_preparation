// node:test suite for 28_Greedy_Algorithms.
// Run: node --test 28_Greedy_Algorithms/tests/greedy_algorithms.test.js
// Strategy: every greedy is compared against a brute-force enumeration on small random inputs.
// That is the single best habit for greedy problems: try to BREAK the greedy with brute force.
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  activitySelection, fractionalKnapsack, huffmanCodeLengths, minCoinsCanonical, MinHeap,
} = require('../02_Implementations/greedy_classics');

// Seeded PRNG so a failing random case is reproducible.
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(2026);
const randInt = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));

function randomIntervals(n, maxCoord = 12) {
  return Array.from({ length: n }, () => {
    const a = randInt(0, maxCoord);
    const b = a + randInt(1, 5);
    return [a, b];
  });
}

// ---------- brute-force references ----------
function bruteMaxNonOverlapping(intervals) {
  const n = intervals.length;
  let best = 0;
  for (let mask = 0; mask < (1 << n); mask++) {
    const chosen = intervals.filter((_, i) => mask & (1 << i)).sort((a, b) => a[0] - b[0]);
    let ok = true;
    for (let i = 1; i < chosen.length; i++) if (chosen[i][0] < chosen[i - 1][1]) { ok = false; break; }
    if (ok) best = Math.max(best, chosen.length);
  }
  return best;
}

// The optimal fractional solution takes some items whole plus AT MOST ONE item partially.
// So trying every subset as "whole" plus every choice of the one fractional item is exact.
function bruteFractional(items, capacity) {
  const n = items.length;
  let best = 0;
  for (let mask = 0; mask < (1 << n); mask++) {
    let w = 0, v = 0;
    for (let i = 0; i < n; i++) if (mask & (1 << i)) { w += items[i].weight; v += items[i].value; }
    if (w > capacity) continue;
    best = Math.max(best, v);
    for (let j = 0; j < n; j++) {
      if (mask & (1 << j)) continue;
      const take = Math.min(items[j].weight, capacity - w);
      best = Math.max(best, v + (take / items[j].weight) * items[j].value);
    }
  }
  return best;
}

// Minimum total merge cost by trying every pair to merge (exponential, small n only).
function bruteHuffmanCost(freqs) {
  if (freqs.length <= 1) return freqs.length === 1 ? freqs[0] : 0;
  let best = Infinity;
  (function go(list, cost) {
    if (list.length === 1) { best = Math.min(best, cost); return; }
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const merged = list[i] + list[j];
        const rest = list.filter((_, k) => k !== i && k !== j);
        go([...rest, merged], cost + merged);
      }
    }
  })(freqs, 0);
  return best;
}

function dpMinCoins(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) for (const c of coins) if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
  return dp[amount] === Infinity ? -1 : dp[amount];
}

describe('activitySelection', () => {
  it('handles the textbook example', () => {
    assert.deepEqual(
      activitySelection([[1, 4], [3, 5], [0, 6], [5, 7], [3, 9], [5, 9], [6, 10], [8, 11], [8, 12], [2, 14], [12, 16]]),
      [[1, 4], [5, 7], [8, 11], [12, 16]],
    );
  });
  it('handles empty and single input', () => {
    assert.deepEqual(activitySelection([]), []);
    assert.deepEqual(activitySelection([[3, 4]]), [[3, 4]]);
  });
  it('treats touching intervals as compatible', () => {
    assert.equal(activitySelection([[1, 2], [2, 3], [3, 4]]).length, 3);
  });
  it('handles identical intervals and one interval covering all', () => {
    assert.equal(activitySelection([[1, 5], [1, 5], [1, 5]]).length, 1);
    assert.equal(activitySelection([[0, 100], [1, 2], [3, 4], [5, 6]]).length, 3);
  });
  it('does not mutate the input', () => {
    const input = [[5, 9], [1, 2], [3, 4]];
    const copy = input.map((x) => x.slice());
    activitySelection(input);
    assert.deepEqual(input, copy);
  });
  it('returns a valid non-overlapping set of maximum size (vs brute force)', () => {
    for (let t = 0; t < 200; t++) {
      const intervals = randomIntervals(randInt(0, 10));
      const chosen = activitySelection(intervals);
      for (let i = 1; i < chosen.length; i++) assert.ok(chosen[i][0] >= chosen[i - 1][1]);
      assert.equal(chosen.length, bruteMaxNonOverlapping(intervals));
    }
  });
});

describe('fractionalKnapsack', () => {
  it('handles the textbook example (240)', () => {
    const items = [{ weight: 10, value: 60 }, { weight: 20, value: 100 }, { weight: 30, value: 120 }];
    assert.equal(fractionalKnapsack(items, 50), 240);
  });
  it('handles zero capacity, no items, and capacity bigger than everything', () => {
    assert.equal(fractionalKnapsack([{ weight: 5, value: 10 }], 0), 0);
    assert.equal(fractionalKnapsack([], 10), 0);
    assert.equal(fractionalKnapsack([{ weight: 2, value: 3 }, { weight: 4, value: 1 }], 100), 4);
  });
  it('takes a fraction of the last item', () => {
    assert.equal(fractionalKnapsack([{ weight: 4, value: 8 }], 1), 2);
  });
  it('matches brute force on random inputs', () => {
    for (let t = 0; t < 200; t++) {
      const items = Array.from({ length: randInt(0, 7) }, () => ({ weight: randInt(1, 10), value: randInt(0, 20) }));
      const cap = randInt(0, 30);
      const got = fractionalKnapsack(items, cap);
      const want = bruteFractional(items, cap);
      assert.ok(Math.abs(got - want) < 1e-9, `items=${JSON.stringify(items)} cap=${cap}: ${got} vs ${want}`);
    }
  });
});

describe('huffmanCodeLengths', () => {
  it('handles the CLRS example', () => {
    const r = huffmanCodeLengths([45, 13, 12, 16, 9, 5]);
    assert.deepEqual(r.lengths, [1, 3, 3, 3, 4, 4]);
    assert.equal(r.totalCost, 224);
  });
  it('handles empty, one and two symbols', () => {
    assert.deepEqual(huffmanCodeLengths([]), { lengths: [], totalCost: 0 });
    assert.deepEqual(huffmanCodeLengths([7]), { lengths: [1], totalCost: 7 });
    assert.deepEqual(huffmanCodeLengths([3, 9]).lengths, [1, 1]);
  });
  it('handles ties (all equal frequencies -> balanced tree)', () => {
    assert.deepEqual(huffmanCodeLengths([1, 1, 1, 1]).lengths, [2, 2, 2, 2]);
  });
  it('is consistent and optimal vs brute force on random inputs', () => {
    for (let t = 0; t < 150; t++) {
      const freqs = Array.from({ length: randInt(2, 6) }, () => randInt(1, 20));
      const { lengths, totalCost } = huffmanCodeLengths(freqs);
      // cost = sum(freq * depth) for a Huffman tree
      assert.equal(lengths.reduce((s, l, i) => s + l * freqs[i], 0), totalCost);
      // a full binary tree satisfies Kraft equality: sum 2^-len = 1
      assert.ok(Math.abs(lengths.reduce((s, l) => s + 2 ** -l, 0) - 1) < 1e-12);
      assert.equal(totalCost, bruteHuffmanCost(freqs));
    }
  });
});

describe('minCoinsCanonical', () => {
  it('handles normal, zero and impossible amounts', () => {
    assert.equal(minCoinsCanonical([1, 5, 10, 25], 63), 6);
    assert.equal(minCoinsCanonical([1, 5, 10, 25], 0), 0);
    assert.equal(minCoinsCanonical([5, 10], 3), -1);
  });
  it('accepts coins in any order', () => {
    assert.equal(minCoinsCanonical([25, 1, 10, 5], 30), 2);
  });
  it('matches DP for canonical systems', () => {
    for (const coins of [[1, 5, 10, 25], [1, 2, 5, 10, 20, 50], [1, 2, 4, 8, 16]]) {
      for (let amount = 0; amount <= 150; amount++) assert.equal(minCoinsCanonical(coins, amount), dpMinCoins(coins, amount));
    }
  });
  it('is NOT optimal for a non-canonical system (the counter-example)', () => {
    assert.equal(minCoinsCanonical([1, 3, 4], 6), 3);
    assert.equal(dpMinCoins([1, 3, 4], 6), 2);
  });
});

describe('MinHeap', () => {
  it('pops in sorted order with duplicates and negatives', () => {
    for (let t = 0; t < 100; t++) {
      const h = new MinHeap();
      const values = Array.from({ length: randInt(0, 30) }, () => randInt(-10, 10));
      values.forEach((v) => h.push(v));
      assert.equal(h.size(), values.length);
      const out = [];
      while (h.size() > 0) out.push(h.pop());
      assert.deepEqual(out, values.slice().sort((a, b) => a - b));
    }
  });
  it('pop on empty returns undefined; custom key works', () => {
    assert.equal(new MinHeap().pop(), undefined);
    const h = new MinHeap((x) => x.p);
    [{ p: 3 }, { p: 1 }, { p: 2 }].forEach((x) => h.push(x));
    assert.equal(h.pop().p, 1);
  });
});

// ---------- selected problem solutions on extra edge cases ----------
describe('solutions: extra edge cases', () => {
  const jump = require('../03_Problems/solutions/05_jump_game');
  const gas = require('../03_Problems/solutions/07_gas_station');
  const nonOverlap = require('../03_Problems/solutions/10_non_overlapping_intervals');
  const tasks = require('../03_Problems/solutions/15_task_scheduler');
  const candy = require('../03_Problems/solutions/18_candy');

  it('Jump Game: single element, zero at start, zero jumped over', () => {
    for (const f of [jump.optimal, jump.bruteForce]) {
      assert.equal(f([0]), true);
      assert.equal(f([0, 1]), false);
      assert.equal(f([2, 0, 0]), true);
      assert.equal(f([1, 0, 1]), false);
    }
    for (let t = 0; t < 200; t++) {
      const nums = Array.from({ length: randInt(1, 10) }, () => randInt(0, 3));
      assert.equal(jump.optimal(nums), jump.bruteForce(nums));
    }
  });

  it('Gas Station: single station, impossible, exact fuel', () => {
    assert.equal(gas.optimal([5], [4]), 0);
    assert.equal(gas.optimal([1], [2]), -1);
    assert.equal(gas.optimal([1, 1, 1], [1, 1, 1]), 0);
    for (let t = 0; t < 200; t++) {
      const n = randInt(1, 8);
      const g = Array.from({ length: n }, () => randInt(0, 5));
      const c = Array.from({ length: n }, () => randInt(0, 5));
      const b = gas.bruteForce(g, c);
      const o = gas.optimal(g, c);
      // with ties several starts may work; both must agree on feasibility, and the greedy start must work
      assert.equal(o === -1, b === -1);
      if (o !== -1) {
        let tank = 0;
        for (let k = 0; k < n; k++) { const i = (o + k) % n; tank += g[i] - c[i]; assert.ok(tank >= 0); }
      }
    }
  });

  it('Non-overlapping Intervals: touching, identical, nested', () => {
    assert.equal(nonOverlap.optimal([[1, 2], [2, 3]]), 0);
    assert.equal(nonOverlap.optimal([[1, 2], [1, 2], [1, 2]]), 2);
    assert.equal(nonOverlap.optimal([[1, 10], [2, 3], [4, 5]]), 1);
    for (let t = 0; t < 200; t++) {
      const iv = randomIntervals(randInt(1, 9));
      assert.equal(nonOverlap.optimal(iv.map((x) => x.slice())), nonOverlap.bruteForce(iv.map((x) => x.slice())));
    }
  });

  it('Task Scheduler: n = 0, many distinct tasks, ties at max frequency', () => {
    assert.equal(tasks.optimal(['A', 'A', 'A'], 0), 3);
    assert.equal(tasks.optimal(['A', 'B', 'C', 'D'], 2), 4);
    assert.equal(tasks.optimal(['A', 'A', 'B', 'B'], 2), 5);
    const letters = 'ABCD';
    for (let t = 0; t < 200; t++) {
      const list = Array.from({ length: randInt(1, 12) }, () => letters[randInt(0, 3)]);
      const n = randInt(0, 4);
      assert.equal(tasks.optimal(list, n), tasks.bruteForce(list, n));
    }
  });

  it('Candy: single child, equal ratings, strictly decreasing', () => {
    assert.equal(candy.optimal([5]), 1);
    assert.equal(candy.optimal([2, 2, 2]), 3);
    assert.equal(candy.optimal([3, 2, 1]), 6);
    assert.equal(candy.optimal([1, 3, 2, 2, 1]), 7);
    for (let t = 0; t < 200; t++) {
      const r = Array.from({ length: randInt(1, 10) }, () => randInt(0, 4));
      assert.equal(candy.optimal(r), candy.bruteForce(r));
    }
  });
});

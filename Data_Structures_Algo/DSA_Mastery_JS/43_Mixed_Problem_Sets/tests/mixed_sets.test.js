// node --test 43_Mixed_Problem_Sets/tests/mixed_sets.test.js
// Requires every mixed-set solution (each runs its own asserts and prints its ✓ line),
// then checks extra edge cases and a brute-vs-optimal comparison on fresh random inputs.
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

const S = (set, file) => require(path.join('..', '03_Problems', set, 'solutions', file));

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rint = (rand, lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));

describe('Set 01', () => {
  const p1 = S('set_01', '01_unique_streak_max_sum');
  const p2 = S('set_01', '02_balanced_lr_substrings');
  const p3 = S('set_01', '03_anagram_pair_count');
  const p4 = S('set_01', '04_longest_quiet_gap');
  const p5 = S('set_01', '05_bonus_leader');
  it('01 unique streak: k larger than array, k = length, all equal', () => {
    assert.equal(p1.optimal([1, 2], 5), null);
    assert.equal(p1.optimal([3, 1, 2], 3), 6);
    assert.equal(p1.optimal([2, 2, 2, 2], 1), 2);
  });
  it('02 balanced: only pauses, alternating long string', () => {
    assert.equal(p2.optimal('....'), 10);
    assert.equal(p2.optimal('LR'.repeat(1000)), p2.optimal('RL'.repeat(1000)));
  });
  it('03 anagram pairs: one big group gives c*(c-1)/2', () => {
    assert.equal(p3.optimal(new Array(50).fill('abc')), (50 * 49) / 2);
  });
  it('04 quiet gap: negative times and duplicates across lists', () => {
    assert.equal(p4.optimal([-10, 5], [5, 5]), 15);
  });
  it('05 bonus leader: single employee, cancelling updates', () => {
    assert.equal(p5.optimal(1, []), 0);
    assert.equal(p5.optimal(3, [[0, 2, 5], [0, 2, -5]]), 0);
  });
  it('matches brute force on random inputs', () => {
    const rand = mulberry32(4301);
    for (let t = 0; t < 200; t++) {
      const nums = Array.from({ length: rint(rand, 0, 10) }, () => rint(rand, -3, 3));
      const k = rint(rand, 1, 4);
      assert.equal(p1.optimal(nums, k), p1.bruteForce(nums, k));
      let s = ''; for (let i = 0; i < rint(rand, 0, 12); i++) s += 'LR.'[rint(rand, 0, 2)];
      assert.equal(p2.optimal(s), p2.bruteForce(s));
      const n = rint(rand, 1, 8);
      const ups = Array.from({ length: rint(rand, 0, 5) }, () => { const l = rint(rand, 0, n - 1); return [l, rint(rand, l, n - 1), rint(rand, -4, 4)]; });
      assert.equal(p5.optimal(n, ups), p5.bruteForce(n, ups));
    }
  });
});

describe('Set 02', () => {
  const p1 = S('set_02', '01_snack_budget');
  const p2 = S('set_02', '02_capped_reading_split');
  const p3 = S('set_02', '03_rotated_range_count');
  const p4 = S('set_02', '04_k_items_closest_budget');
  const p5 = S('set_02', '05_active_sessions');
  it('01 snack budget: answers keep query order', () => {
    assert.deepEqual(p1.optimal([1, 1, 1], [3, 0, 2, 100]), [3, 0, 2, 3]);
  });
  it('02 capped split: cap 1 forces one chapter per day', () => {
    assert.equal(p2.optimal([3, 9, 4], 3, 1), 9);
    assert.equal(p2.optimal([3, 9, 4], 2, 1), -1);
  });
  it('03 rotated count: lo > hi, rotation by n - 1', () => {
    assert.equal(p3.optimal([1, 2, 3], 3, 1), 0);
    assert.equal(p3.optimal([9, 1, 2, 3, 4], 4, 9), 2);
  });
  it('04 k items: k equals n, exact budget', () => {
    assert.equal(p4.optimal([2, 3, 5], 3, 10), 10);
    assert.equal(p4.optimal([2, 3, 5], 3, 9), -1);
  });
  it('05 sessions: query at a start counts, at an end does not', () => {
    assert.deepEqual(p5.optimal([[2, 4]], [2, 4]), [1, 0]);
  });
  it('matches brute force on random inputs', () => {
    const rand = mulberry32(4302);
    for (let t = 0; t < 200; t++) {
      const pages = Array.from({ length: rint(rand, 1, 7) }, () => rint(rand, 1, 9));
      const k = rint(rand, 1, 4), cap = rint(rand, 1, 3);
      assert.equal(p2.optimal(pages, k, cap), p2.bruteForce(pages, k, cap));
      const prices = Array.from({ length: rint(rand, 0, 8) }, () => rint(rand, 1, 12));
      const kk = rint(rand, 0, prices.length + 1), budget = rint(rand, 0, 40);
      assert.equal(p4.optimal(prices, kk, budget), p4.bruteForce(prices, kk, budget));
    }
  });
});

describe('Set 03', () => {
  const p1 = S('set_03', '01_visible_sum_right');
  const p2 = S('set_03', '02_most_versatile_users');
  const p3 = S('set_03', '03_steady_subarrays');
  const p4 = S('set_03', '04_cursor_editor');
  const p5 = S('set_03', '05_smallest_covering_range');
  it('01 visible sum: single building, plateau', () => {
    assert.deepEqual(p1.optimal([9]), [0]);
    assert.deepEqual(p1.optimal([3, 3, 1, 3]), [0, 1, 0, 0]);
  });
  it('02 versatile users: duplicate events count once', () => {
    assert.deepEqual(p2.optimal([['a', 'x'], ['a', 'x'], ['b', 'x'], ['b', 'y']], 1), ['b']);
  });
  it('03 steady: strictly increasing with limit 0 counts singles only', () => {
    assert.equal(p3.optimal([1, 2, 3, 4], 0), 4);
  });
  it('04 cursor editor: many lefts then typing at the start', () => {
    assert.equal(p4.optimal('abc<<<<<x'), 'xabc');
  });
  it('05 covering range: lists with duplicates and negative values', () => {
    assert.deepEqual(p5.optimal([[-5, -5, 0], [-4, 10]]), [-5, -4]);
  });
  it('matches brute force on random inputs', () => {
    const rand = mulberry32(4303);
    for (let t = 0; t < 200; t++) {
      const h = Array.from({ length: rint(rand, 0, 10) }, () => rint(rand, 1, 5));
      assert.deepEqual(p1.optimal(h), p1.bruteForce(h));
      const nums = Array.from({ length: rint(rand, 0, 10) }, () => rint(rand, -4, 4));
      const lim = rint(rand, 0, 4);
      assert.equal(p3.optimal(nums, lim), p3.bruteForce(nums, lim));
      let keys = ''; for (let i = 0; i < rint(rand, 0, 15); i++) keys += 'xy<>#'[rint(rand, 0, 4)];
      assert.equal(p4.optimal(keys), p4.bruteForce(keys));
    }
  });
});

describe('Set 04', () => {
  const p1 = S('set_04', '01_divisible_downward_paths');
  const p2 = S('set_04', '02_bst_pair_count');
  const p3 = S('set_04', '03_wildcard_dictionary_count');
  const p4 = S('set_04', '04_vertical_columns');
  const p5 = S('set_04', '05_capped_xor_queries');
  it('01 divisible paths: k = 1 counts every downward path', () => {
    // tree [1,2,3]: paths [1],[2],[3],[1,2],[1,3]
    assert.equal(p1.optimal([1, 2, 3], 1), 5);
  });
  it('01 divisible paths: all-zero chain', () => {
    assert.equal(p1.optimal([0, 0, null, 0], 7), 6);
  });
  it('02 bst pairs: negative values', () => {
    assert.equal(p2.optimal([0, -5, 5, -10, null, null, 10], 0), 2);
  });
  it('03 wildcard: pattern of only "?" counts words of that length', () => {
    assert.deepEqual(p3.optimal(['ab', 'cd', 'abc', 'ab'], ['??']), [3]);
  });
  it('04 vertical: right-leaning chain', () => {
    assert.deepEqual(p4.optimal([1, null, 2, null, 3]), [[1], [2], [3]]);
  });
  it('05 capped xor: m below every number, x = 0', () => {
    assert.deepEqual(p5.optimal([4, 8], [[7, 3], [0, 8]]), [-1, 8]);
  });
  it('matches brute force on random inputs', () => {
    const rand = mulberry32(4304);
    for (let t = 0; t < 200; t++) {
      const n = rint(rand, 0, 12);
      const arr = [];
      for (let i = 0; i < n; i++) arr.push(i > 0 && rand() < 0.25 ? null : rint(rand, -5, 5));
      const k = rint(rand, 1, 4);
      assert.equal(p1.optimal(arr, k), p1.bruteForce(arr, k));
      assert.deepEqual(p4.optimal(arr), p4.bruteForce(arr));
      const nums = Array.from({ length: rint(rand, 0, 8) }, () => rint(rand, 0, 63));
      const qs = Array.from({ length: rint(rand, 0, 5) }, () => [rint(rand, 0, 63), rint(rand, 0, 70)]);
      assert.deepEqual(p5.optimal(nums, qs), p5.bruteForce(nums, qs));
    }
  });
});

describe('Set 05', () => {
  const p1 = S('set_05', '01_hiking_robot');
  const p2 = S('set_05', '02_connection_time_queries');
  const p3 = S('set_05', '03_pipeline_finish_time');
  const p4 = S('set_05', '04_coupon_routes');
  const p5 = S('set_05', '05_mandatory_roads_mst');
  it('01 hiking: detour beats the direct steep step', () => {
    assert.equal(p1.optimal([[0, 9], [1, 2]]), 1); // go down 0 -> 1 -> 2 instead of climbing to 9
  });
  it('02 connection times: repeated cable later does not change the answer', () => {
    assert.deepEqual(p2.optimal(2, [[1, 0, 1], [8, 0, 1]], [[1, 0]]), [1]);
  });
  it('03 pipeline: disconnected chains, cycle anywhere gives -1', () => {
    assert.equal(p3.optimal(4, [2, 2, 1, 10], [[0, 1], [2, 1]]), 10);
    assert.equal(p3.optimal(4, [1, 1, 1, 1], [[0, 1], [2, 3], [3, 2]]), -1);
  });
  it('04 coupons: odd toll rounds down', () => {
    assert.equal(p4.optimal(2, [[0, 1, 9]], 0, 1, 1), 4);
  });
  it('05 mandatory roads: expensive mandatory road still paid even if it makes a cycle', () => {
    assert.equal(p5.optimal(2, [[0, 1, 100]], [[0, 1, 1]]), 100);
  });
  it('matches brute force on random inputs (disconnected graphs and cycles included)', () => {
    const rand = mulberry32(4305);
    for (let t = 0; t < 200; t++) {
      const n = rint(rand, 1, 6);
      const logs = Array.from({ length: rint(rand, 0, 8) }, () => [rint(rand, 0, 15), rint(rand, 0, n - 1), rint(rand, 0, n - 1)]);
      const qs = Array.from({ length: rint(rand, 0, 4) }, () => [rint(rand, 0, n - 1), rint(rand, 0, n - 1)]);
      assert.deepEqual(p2.optimal(n, logs, qs), p2.bruteForce(n, logs, qs));
      const d = Array.from({ length: n }, () => rint(rand, 1, 5));
      const deps = Array.from({ length: rint(rand, 0, 6) }, () => [rint(rand, 0, n - 1), rint(rand, 0, n - 1)]);
      assert.equal(p3.optimal(n, d, deps), p3.bruteForce(n, d, deps));
      const roads = Array.from({ length: rint(rand, 0, 7) }, () => [rint(rand, 0, n - 1), rint(rand, 0, n - 1), rint(rand, 0, 15)]);
      const src = rint(rand, 0, n - 1), dst = rint(rand, 0, n - 1), k = rint(rand, 0, 2);
      assert.equal(p4.optimal(n, roads, src, dst, k), p4.bruteForce(n, roads, src, dst, k));
    }
  });
});

describe('Set 06', () => {
  const p1 = S('set_06', '01_compatible_assignment');
  const p2 = S('set_06', '02_shortest_burst');
  const p3 = S('set_06', '03_segmentation_ways');
  const p4 = S('set_06', '04_router_spacing');
  const p5 = S('set_06', '05_courier_all_stops');
  it('01 assignment: identity matrix of zeros vs forbidden diagonal', () => {
    assert.equal(p1.optimal([[0, 5], [5, 0]]), 0);
    assert.equal(p1.optimal([[null, 5], [5, null]]), 10);
  });
  it('02 shortest burst: answer appears only after a big negative', () => {
    assert.equal(p2.optimal([5, -100, 3, 3], 6), 2);
  });
  it('03 segmentation: modulo keeps big answers in range', () => {
    const v = p3.optimal('a'.repeat(2000), ['a', 'aa', 'aaa']);
    assert.ok(v >= 0 && v < 1000000007);
  });
  it('04 router spacing: two routers use the ends', () => {
    assert.equal(p4.optimal([7, 3, 100, 50], 2), 97);
  });
  it('05 courier: stop in a different component gives -1', () => {
    assert.equal(p5.optimal(4, [[0, 1, 2], [2, 3, 2]], 0, [1, 3]), -1);
  });
  it('matches brute force on random inputs', () => {
    const rand = mulberry32(4306);
    for (let t = 0; t < 200; t++) {
      const n = rint(rand, 0, 5);
      const cost = Array.from({ length: n }, () => Array.from({ length: n }, () => (rand() < 0.2 ? null : rint(rand, 0, 9))));
      assert.equal(p1.optimal(cost), p1.bruteForce(cost));
      const nums = Array.from({ length: rint(rand, 0, 10) }, () => rint(rand, -6, 8));
      const k = rint(rand, 1, 15);
      assert.equal(p2.optimal(nums, k), p2.bruteForce(nums, k));
      const set = new Set(); const m = rint(rand, 2, 7);
      while (set.size < m) set.add(rint(rand, 0, 40));
      const kk = rint(rand, 2, m);
      assert.equal(p4.optimal([...set], kk), p4.bruteForce([...set], kk));
    }
  });
});

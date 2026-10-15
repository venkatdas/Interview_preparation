// node:test suite for 31_Intervals.
// Run: node --test 31_Intervals/tests/intervals.test.js   (from the curriculum root)
const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  overlaps, intersection, merge, insert, sweepLineMaxOverlap, totalCoveredLength,
} = require('../02_Implementations/interval_utils');

// Seeded PRNG so a failing random case can be reproduced.
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const randInt = (rng, lo, hi) => lo + Math.floor(rng() * (hi - lo + 1));
function randomIntervals(rng, maxN = 8, maxCoord = 20) {
  const n = randInt(rng, 0, maxN);
  const out = [];
  for (let i = 0; i < n; i++) {
    const a = randInt(rng, 0, maxCoord);
    const b = randInt(rng, 0, maxCoord);
    out.push([Math.min(a, b), Math.max(a, b)]);
  }
  return out;
}

// ---------- brute-force references ----------
// Merge by repeatedly fusing any overlapping (or touching) pair until nothing changes.
function bruteMerge(intervals) {
  const list = intervals.map(x => x.slice());
  let changed = true;
  while (changed) {
    changed = false;
    outer: for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        if (list[i][0] <= list[j][1] && list[j][0] <= list[i][1]) {
          list[i] = [Math.min(list[i][0], list[j][0]), Math.max(list[i][1], list[j][1])];
          list.splice(j, 1);
          changed = true;
          break outer;
        }
      }
    }
  }
  return list.sort((a, b) => a[0] - b[0]);
}
// Max number of intervals alive at one integer time t.
// halfOpen: interval [s, e) contains t iff s <= t < e. Closed: s <= t <= e.
function bruteMaxAlive(intervals, closed) {
  let best = 0;
  for (const [t] of intervals) {
    let c = 0;
    for (const [s, e] of intervals) if (s <= t && (closed ? t <= e : t < e)) c++;
    best = Math.max(best, c);
  }
  return best;
}
// Count unit segments [x, x+1] covered by at least one interval.
function bruteCovered(intervals) {
  let total = 0;
  for (let x = -50; x < 100; x++) {
    if (intervals.some(([s, e]) => s <= x && x + 1 <= e)) total++;
  }
  return total;
}
function bruteOverlap(a, b) {
  for (let t = Math.min(a[0], b[0]); t <= Math.max(a[1], b[1]); t++) {
    if (a[0] <= t && t <= a[1] && b[0] <= t && t <= b[1]) return true;
  }
  return false;
}

describe('overlaps / intersection', () => {
  it('handles the classic cases', () => {
    assert.equal(overlaps([1, 3], [2, 6]), true);
    assert.equal(overlaps([1, 10], [3, 4]), true);   // containment
    assert.equal(overlaps([3, 4], [1, 10]), true);   // containment, other order
    assert.equal(overlaps([1, 3], [4, 5]), false);
    assert.equal(overlaps([4, 5], [1, 3]), false);
  });
  it('treats touching intervals as overlapping (inclusive ends)', () => {
    assert.equal(overlaps([1, 3], [3, 5]), true);
    assert.deepEqual(intersection([1, 3], [3, 5]), [3, 3]);
  });
  it('handles zero-length and negative intervals', () => {
    assert.equal(overlaps([2, 2], [2, 2]), true);
    assert.equal(overlaps([-5, -1], [-1, 0]), true);
    assert.deepEqual(intersection([-5, -2], [-3, 4]), [-3, -2]);
    assert.equal(intersection([-5, -2], [0, 4]), null);
  });
  it('is symmetric and agrees with a point-by-point check', () => {
    const rng = mulberry32(1);
    for (let t = 0; t < 300; t++) {
      const [a, b] = randomIntervals(rng, 2, 15).concat([[0, 0], [0, 0]]);
      assert.equal(overlaps(a, b), overlaps(b, a));
      assert.equal(overlaps(a, b), bruteOverlap(a, b));
      assert.equal(intersection(a, b) !== null, overlaps(a, b));
    }
  });
});

describe('merge', () => {
  it('merges the textbook example', () => {
    assert.deepEqual(merge([[1, 3], [2, 6], [8, 10], [15, 18]]), [[1, 6], [8, 10], [15, 18]]);
  });
  it('handles empty input and a single interval', () => {
    assert.deepEqual(merge([]), []);
    assert.deepEqual(merge([[5, 7]]), [[5, 7]]);
  });
  it('merges touching intervals and unsorted input', () => {
    assert.deepEqual(merge([[4, 5], [1, 4]]), [[1, 5]]);
    assert.deepEqual(merge([[8, 10], [1, 3], [2, 6]]), [[1, 6], [8, 10]]);
  });
  it('handles a giant interval swallowing the rest and identical intervals', () => {
    assert.deepEqual(merge([[1, 10], [2, 3], [4, 5], [9, 12]]), [[1, 12]]);
    assert.deepEqual(merge([[2, 3], [2, 3], [2, 3]]), [[2, 3]]);
  });
  it('compares against the LAST merged block, not the previous input interval', () => {
    // [1,10] absorbs [2,3]; [4,5] must still merge into [1,10]
    assert.deepEqual(merge([[1, 10], [2, 3], [4, 5]]), [[1, 10]]);
  });
  it('does not mutate the input', () => {
    const input = [[3, 4], [1, 2], [2, 3]];
    const copy = JSON.parse(JSON.stringify(input));
    merge(input);
    assert.deepEqual(input, copy);
  });
  it('matches brute-force fusing on 300 random inputs', () => {
    const rng = mulberry32(42);
    for (let t = 0; t < 300; t++) {
      const iv = randomIntervals(rng);
      assert.deepEqual(merge(iv), bruteMerge(iv), JSON.stringify(iv));
    }
  });
});

describe('insert', () => {
  it('handles normal cases', () => {
    assert.deepEqual(insert([[1, 3], [6, 9]], [2, 5]), [[1, 5], [6, 9]]);
    assert.deepEqual(insert([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]), [[1, 2], [3, 10], [12, 16]]);
  });
  it('handles empty list, before-all, after-all', () => {
    assert.deepEqual(insert([], [5, 7]), [[5, 7]]);
    assert.deepEqual(insert([[3, 5]], [1, 2]), [[1, 2], [3, 5]]);
    assert.deepEqual(insert([[1, 5]], [6, 8]), [[1, 5], [6, 8]]);
  });
  it('merges a touching new interval', () => {
    assert.deepEqual(insert([[1, 3], [6, 9]], [3, 6]), [[1, 9]]);
  });
  it('handles a new interval that swallows everything', () => {
    assert.deepEqual(insert([[2, 3], [5, 6], [8, 9]], [0, 100]), [[0, 100]]);
  });
  it('equals merge(list + new) on 300 random sorted disjoint lists', () => {
    const rng = mulberry32(7);
    for (let t = 0; t < 300; t++) {
      const base = merge(randomIntervals(rng)); // sorted and disjoint
      const [a, b] = [randInt(rng, 0, 20), randInt(rng, 0, 20)];
      const extra = [Math.min(a, b), Math.max(a, b)];
      assert.deepEqual(insert(base, extra), bruteMerge(base.concat([extra])));
    }
  });
});

describe('sweepLineMaxOverlap', () => {
  it('handles the meeting rooms examples', () => {
    assert.equal(sweepLineMaxOverlap([[0, 30], [5, 10], [15, 20]]), 2);
    assert.equal(sweepLineMaxOverlap([[7, 10], [2, 4]]), 1);
  });
  it('handles empty input and one interval', () => {
    assert.equal(sweepLineMaxOverlap([]), 0);
    assert.equal(sweepLineMaxOverlap([[1, 2]]), 1);
  });
  it('respects the touching rule (tie-break order)', () => {
    assert.equal(sweepLineMaxOverlap([[1, 3], [3, 5]]), 1);
    assert.equal(sweepLineMaxOverlap([[1, 3], [3, 5]], true), 2);
    assert.equal(sweepLineMaxOverlap([[1, 3], [3, 5], [5, 7]]), 1);
  });
  it('counts identical intervals separately', () => {
    assert.equal(sweepLineMaxOverlap([[1, 4], [1, 4], [1, 4]]), 3);
  });
  it('matches a brute-force point count on 300 random inputs (both tie rules)', () => {
    const rng = mulberry32(99);
    for (let t = 0; t < 300; t++) {
      const iv = randomIntervals(rng).filter(([s, e]) => s < e); // positive-length intervals
      assert.equal(sweepLineMaxOverlap(iv), bruteMaxAlive(iv, false), JSON.stringify(iv));
      assert.equal(sweepLineMaxOverlap(iv, true), bruteMaxAlive(iv, true), JSON.stringify(iv));
    }
  });
});

describe('totalCoveredLength', () => {
  it('handles normal, empty and touching input', () => {
    assert.equal(totalCoveredLength([[1, 3], [2, 6], [8, 10]]), 7);
    assert.equal(totalCoveredLength([]), 0);
    assert.equal(totalCoveredLength([[1, 3], [3, 5]]), 4);
    assert.equal(totalCoveredLength([[2, 2]]), 0);
  });
  it('matches unit-segment counting on 300 random inputs', () => {
    const rng = mulberry32(2024);
    for (let t = 0; t < 300; t++) {
      const iv = randomIntervals(rng);
      assert.equal(totalCoveredLength(iv), bruteCovered(iv));
    }
  });
});

// ---------- selected problem solutions on extra edge cases ----------
describe('solution 03 — Merge Intervals', () => {
  const { optimal, bruteForce } = require('../03_Problems/solutions/03_merge_intervals');
  it('handles single, nested and touching intervals', () => {
    assert.deepEqual(optimal([[1, 1]]), [[1, 1]]);
    assert.deepEqual(optimal([[1, 4], [2, 3]]), [[1, 4]]);
    assert.deepEqual(optimal([[1, 4], [4, 5]]), [[1, 5]]);
    assert.deepEqual(optimal([[0, 0], [1, 4]]), [[0, 0], [1, 4]]);
  });
  it('optimal agrees with bruteForce and the reference on random inputs', () => {
    const rng = mulberry32(3);
    for (let t = 0; t < 150; t++) {
      const iv = randomIntervals(rng);
      if (iv.length === 0) continue;
      assert.deepEqual(optimal(iv.map(x => x.slice())), bruteMerge(iv));
      assert.deepEqual(bruteForce(iv.map(x => x.slice())), bruteMerge(iv));
    }
  });
});

describe('solution 09 — Meeting Rooms II', () => {
  const { optimal, optimalHeap, bruteForce } = require('../03_Problems/solutions/09_meeting_rooms_ii');
  it('handles empty, touching and identical meetings', () => {
    assert.equal(optimal([]), 0);
    assert.equal(optimal([[1, 5], [5, 8]]), 1);
    assert.equal(optimalHeap([[1, 5], [5, 8]]), 1);
    assert.equal(optimal([[2, 3], [2, 3], [2, 3]]), 3);
    assert.equal(optimalHeap([[2, 3], [2, 3], [2, 3]]), 3);
  });
  it('sweep, heap and brute force agree on random inputs', () => {
    const rng = mulberry32(11);
    for (let t = 0; t < 200; t++) {
      const iv = randomIntervals(rng).filter(([s, e]) => s < e);
      const expected = bruteMaxAlive(iv, false);
      assert.equal(optimal(iv.map(x => x.slice())), expected);
      assert.equal(optimalHeap(iv.map(x => x.slice())), expected);
      assert.equal(bruteForce(iv.map(x => x.slice())), expected);
    }
  });
});

describe('solution 10 — Car Pooling', () => {
  const { optimal, optimalDiffArray, bruteForce } = require('../03_Problems/solutions/10_car_pooling');
  it('drops off before picking up at the same location', () => {
    assert.equal(optimal([[2, 1, 5], [3, 5, 7]], 3), true);
    assert.equal(optimalDiffArray([[2, 1, 5], [3, 5, 7]], 3), true);
  });
  it('fails when a single trip exceeds capacity', () => {
    assert.equal(optimal([[5, 0, 1]], 4), false);
    assert.equal(optimalDiffArray([[5, 0, 1]], 4), false);
  });
  it('all three versions agree on random trips', () => {
    const rng = mulberry32(5);
    for (let t = 0; t < 200; t++) {
      const trips = randomIntervals(rng).filter(([s, e]) => s < e).map(([s, e]) => [randInt(rng, 1, 4), s, e]);
      const cap = randInt(rng, 1, 10);
      const expected = bruteForce(trips, cap);
      assert.equal(optimal(trips, cap), expected);
      assert.equal(optimalDiffArray(trips, cap), expected);
    }
  });
});

describe('solution 11 — My Calendar I', () => {
  const { MyCalendar, MyCalendarBrute } = require('../03_Problems/solutions/11_my_calendar_i');
  it('accepts touching bookings and rejects swallowing ones', () => {
    const cal = new MyCalendar();
    assert.equal(cal.book(10, 20), true);
    assert.equal(cal.book(20, 30), true);   // touching at 20 is fine
    assert.equal(cal.book(5, 10), true);    // touching at 10 is fine
    assert.equal(cal.book(5, 50), false);   // would swallow everything
    assert.equal(cal.book(10, 20), false);  // identical
  });
  it('binary-search version agrees with the brute version on random sequences', () => {
    const rng = mulberry32(17);
    for (let t = 0; t < 100; t++) {
      const fast = new MyCalendar();
      const slow = new MyCalendarBrute();
      for (let k = 0; k < 15; k++) {
        const s = randInt(rng, 0, 40);
        const e = s + randInt(rng, 1, 8);
        assert.equal(fast.book(s, e), slow.book(s, e));
      }
    }
  });
});

describe('solution 15 — Minimum Interval to Include Each Query', () => {
  const { optimal, bruteForce } = require('../03_Problems/solutions/15_minimum_interval_to_include_each_query');
  it('returns -1 for queries outside every interval and keeps query order', () => {
    assert.deepEqual(optimal([[5, 6]], [1, 5, 7, 6]), [-1, 2, -1, 2]);
  });
  it('handles duplicate queries and point intervals', () => {
    assert.deepEqual(optimal([[3, 3], [1, 10]], [3, 3, 4]), [1, 1, 10]);
  });
  it('agrees with brute force on random inputs', () => {
    const rng = mulberry32(23);
    for (let t = 0; t < 200; t++) {
      const iv = randomIntervals(rng);
      const queries = Array.from({ length: randInt(rng, 0, 6) }, () => randInt(rng, 0, 22));
      assert.deepEqual(optimal(iv.map(x => x.slice()), queries.slice()), bruteForce(iv, queries));
    }
  });
});

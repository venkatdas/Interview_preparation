/**
 * Interval utilities in JavaScript. Intervals are [start, end] arrays with INCLUSIVE ends.
 *
 * 1. overlaps(a, b)              - the overlap formula
 * 2. intersection(a, b)          - the shared part, or null
 * 3. merge(intervals)            - union of overlapping/touching intervals (sorts first)
 * 4. insert(sorted, newInterval) - add one interval to a sorted non-overlapping list, O(n)
 * 5. sweepLineMaxOverlap         - max number of intervals alive at the same time
 * 6. totalCoveredLength          - length of the union
 */

// ---------- 1. overlap test ----------
// Two intervals overlap iff each one starts before (or when) the other ends.
function overlaps(a, b) {
  return a[0] <= b[1] && b[0] <= a[1];
}

// ---------- 2. intersection ----------
function intersection(a, b) {
  const start = Math.max(a[0], b[0]);
  const end = Math.min(a[1], b[1]);
  return start <= end ? [start, end] : null;
}

// ---------- 3. merge ----------
function merge(intervals) {
  if (intervals.length === 0) return [];
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]); // copy so the caller's array is untouched
  const result = [sorted[0].slice()];
  for (let i = 1; i < sorted.length; i++) {
    const last = result[result.length - 1];
    const [start, end] = sorted[i];
    if (start <= last[1]) {
      last[1] = Math.max(last[1], end); // overlapping or touching: grow the current block
    } else {
      result.push([start, end]);        // gap: start a new block
    }
  }
  return result;
}

// ---------- 4. insert ----------
// `intervals` must be sorted by start and non-overlapping. No sort needed: O(n).
function insert(intervals, newInterval) {
  const result = [];
  let [start, end] = newInterval;
  let i = 0;

  // phase 1: everything that ends before the new interval starts
  while (i < intervals.length && intervals[i][1] < start) result.push(intervals[i++]);

  // phase 2: everything that overlaps the new interval gets absorbed into it
  while (i < intervals.length && intervals[i][0] <= end) {
    start = Math.min(start, intervals[i][0]);
    end = Math.max(end, intervals[i][1]);
    i++;
  }
  result.push([start, end]);

  // phase 3: the rest
  while (i < intervals.length) result.push(intervals[i++]);
  return result;
}

// ---------- 5. sweep line ----------
// Returns the maximum number of intervals that are "alive" at one moment.
// touchingCounts: if true, [1,3] and [3,5] count as 2 alive at time 3 (inclusive ends).
function sweepLineMaxOverlap(intervals, touchingCounts = false) {
  const events = [];
  for (const [start, end] of intervals) {
    events.push([start, +1]);
    events.push([end, -1]);
  }
  // sort by time; at the same time, process -1 first unless touching counts
  events.sort((a, b) => a[0] - b[0] || (touchingCounts ? b[1] - a[1] : a[1] - b[1]));

  let running = 0;
  let best = 0;
  for (const [, delta] of events) {
    running += delta;
    best = Math.max(best, running);
  }
  return best;
}

// ---------- 6. total covered length ----------
function totalCoveredLength(intervals) {
  return merge(intervals).reduce((sum, [start, end]) => sum + (end - start), 0);
}

// ---------- self-test ----------
const assert = require('assert');

assert.strictEqual(overlaps([1, 3], [2, 6]), true);
assert.strictEqual(overlaps([1, 3], [3, 5]), true);   // touching, inclusive ends
assert.strictEqual(overlaps([1, 3], [4, 5]), false);
assert.strictEqual(overlaps([4, 5], [1, 3]), false);
assert.strictEqual(overlaps([1, 10], [3, 4]), true);  // containment

assert.deepStrictEqual(intersection([1, 5], [3, 8]), [3, 5]);
assert.deepStrictEqual(intersection([1, 2], [3, 4]), null);
assert.deepStrictEqual(intersection([1, 3], [3, 5]), [3, 3]);

assert.deepStrictEqual(merge([[1, 3], [2, 6], [8, 10], [15, 18]]), [[1, 6], [8, 10], [15, 18]]);
assert.deepStrictEqual(merge([[1, 4], [4, 5]]), [[1, 5]]);
assert.deepStrictEqual(merge([]), []);
assert.deepStrictEqual(merge([[5, 7]]), [[5, 7]]);
assert.deepStrictEqual(merge([[1, 10], [2, 3], [4, 5]]), [[1, 10]]);
const original = [[3, 4], [1, 2]];
merge(original);
assert.deepStrictEqual(original, [[3, 4], [1, 2]]); // input not mutated

assert.deepStrictEqual(insert([[1, 3], [6, 9]], [2, 5]), [[1, 5], [6, 9]]);
assert.deepStrictEqual(insert([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8]), [[1, 2], [3, 10], [12, 16]]);
assert.deepStrictEqual(insert([], [5, 7]), [[5, 7]]);
assert.deepStrictEqual(insert([[1, 5]], [6, 8]), [[1, 5], [6, 8]]);
assert.deepStrictEqual(insert([[3, 5]], [1, 2]), [[1, 2], [3, 5]]);

assert.strictEqual(sweepLineMaxOverlap([[0, 30], [5, 10], [15, 20]]), 2);
assert.strictEqual(sweepLineMaxOverlap([[7, 10], [2, 4]]), 1);
assert.strictEqual(sweepLineMaxOverlap([[1, 3], [3, 5]]), 1);        // touching does not count
assert.strictEqual(sweepLineMaxOverlap([[1, 3], [3, 5]], true), 2);  // unless asked
assert.strictEqual(sweepLineMaxOverlap([]), 0);

assert.strictEqual(totalCoveredLength([[1, 3], [2, 6], [8, 10]]), 7);
assert.strictEqual(totalCoveredLength([]), 0);

console.log('✓ interval-utils.js self-test passed');

module.exports = { overlaps, intersection, merge, insert, sweepLineMaxOverlap, totalCoveredLength };

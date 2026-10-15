/**
 * 13. Data Stream as Disjoint Intervals   (LeetCode 352 — Hard)
 *
 * PROBLEM
 * Integers arrive one at a time (addNum). At any moment getIntervals() must return the set
 * of numbers seen so far as a sorted list of disjoint closed intervals [a, b], where
 * consecutive integers are merged (seeing 1, 3, 7, 2, 6 gives [[1,3],[6,7]]).
 *
 * EXAMPLES
 * addNum(1) -> [[1,1]]
 * addNum(3) -> [[1,1],[3,3]]
 * addNum(7) -> [[1,1],[3,3],[7,7]]
 * addNum(2) -> [[1,3],[7,7]]          Explanation: 2 bridges 1 and 3
 * addNum(6) -> [[1,3],[6,7]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Duplicates? (yes, ignore them)
 * - Which is called more, addNum or getIntervals? (unknown - keep both reasonable)
 *
 * APPROACH 1 — Brute force   O(1) add, O(n log n) getIntervals
 * Store numbers in a Set. On getIntervals, sort them and group consecutive runs.
 *
 * APPROACH 2 — Optimal (sorted interval list + merge with neighbours)   O(log n + n) add (binary search + splice), O(1) get
 * Keep intervals sorted. On addNum(x):
 *   1. binary search for the first interval with start > x; let prev be the one before it.
 *   2. if prev contains x -> duplicate, done.
 *   3. if prev.end + 1 === x, extend prev; if next.start - 1 === x, extend next (lower its start);
 *      if BOTH happened, prev and next now touch -> merge them into one.
 *   4. otherwise insert [x, x] at that position.
 * With a balanced tree (TreeMap) the splice would also be O(log n); in JS a sorted array is
 * the practical choice and is what interviewers expect.
 *
 * Dry run: add 1, 3, 7, 2:
 *   add 1: list [] -> insert [1,1]
 *   add 3: next of [1,1]? none; prev [1,1]: end+1 = 2 != 3 -> insert [3,3]
 *   add 7: -> [[1,1],[3,3],[7,7]]
 *   add 2: idx=1 (first start > 2 is [3,3]); prev [1,1] end+1 == 2 -> [1,2]; next [3,3] start-1 == 2 -> [2,3];
 *          both touched -> merge into [1,3]; list [[1,3],[7,7]]
 *
 * EDGE CASES
 * - duplicate number -> no change
 * - number inside an existing interval -> no change
 * - number that bridges two intervals -> they merge into one
 * - negative numbers work the same
 */

class SummaryRangesBrute {
  #seen = new Set();
  addNum(value) { this.#seen.add(value); }
  getIntervals() {
    const sorted = [...this.#seen].sort((a, b) => a - b);
    const result = [];
    for (const x of sorted) {
      const last = result[result.length - 1];
      if (last && last[1] + 1 === x) last[1] = x;
      else result.push([x, x]);
    }
    return result;
  }
}

class SummaryRanges {
  #intervals = []; // sorted, disjoint, non-adjacent closed intervals

  addNum(value) {
    const list = this.#intervals;
    // first index whose start > value
    let lo = 0;
    let hi = list.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (list[mid][0] <= value) lo = mid + 1;
      else hi = mid;
    }
    const prev = list[lo - 1];
    const next = list[lo];

    if (prev && value <= prev[1]) return;          // already covered

    const joinsPrev = prev && prev[1] + 1 === value;
    const joinsNext = next && next[0] - 1 === value;

    if (joinsPrev && joinsNext) {
      prev[1] = next[1];                            // bridge: prev swallows next
      list.splice(lo, 1);
    } else if (joinsPrev) {
      prev[1] = value;
    } else if (joinsNext) {
      next[0] = value;
    } else {
      list.splice(lo, 0, [value, value]);
    }
  }

  getIntervals() {
    return this.#intervals.map((x) => x.slice()); // defensive copy
  }
}

// ---------- tests ----------
const assert = require('assert');
for (const Ranges of [SummaryRangesBrute, SummaryRanges]) {
  const sr = new Ranges();
  sr.addNum(1); assert.deepStrictEqual(sr.getIntervals(), [[1, 1]]);
  sr.addNum(3); assert.deepStrictEqual(sr.getIntervals(), [[1, 1], [3, 3]]);
  sr.addNum(7); assert.deepStrictEqual(sr.getIntervals(), [[1, 1], [3, 3], [7, 7]]);
  sr.addNum(2); assert.deepStrictEqual(sr.getIntervals(), [[1, 3], [7, 7]]);
  sr.addNum(6); assert.deepStrictEqual(sr.getIntervals(), [[1, 3], [6, 7]]);
  sr.addNum(6); assert.deepStrictEqual(sr.getIntervals(), [[1, 3], [6, 7]]);   // duplicate
  sr.addNum(2); assert.deepStrictEqual(sr.getIntervals(), [[1, 3], [6, 7]]);   // inside
  sr.addNum(-1); assert.deepStrictEqual(sr.getIntervals(), [[-1, -1], [1, 3], [6, 7]]);
  sr.addNum(0); assert.deepStrictEqual(sr.getIntervals(), [[-1, 3], [6, 7]]);
  sr.addNum(4); sr.addNum(5); assert.deepStrictEqual(sr.getIntervals(), [[-1, 7]]);
  const empty = new Ranges();
  assert.deepStrictEqual(empty.getIntervals(), []);
}
console.log('✓ 13-data-stream-as-disjoint-intervals passed');

module.exports = { optimal: SummaryRanges, bruteForce: SummaryRangesBrute, SummaryRanges, SummaryRangesBrute };

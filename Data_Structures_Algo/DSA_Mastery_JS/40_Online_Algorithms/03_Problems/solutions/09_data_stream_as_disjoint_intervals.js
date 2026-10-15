/**
 * 09. Data Stream as Disjoint Intervals   (LeetCode 352 — Hard)
 *
 * PROBLEM
 * Non-negative integers arrive one by one. addNum(val) adds a value; getIntervals() returns
 * the numbers seen so far summarised as a sorted list of disjoint closed intervals [start, end]
 * covering exactly the seen values.
 *
 * EXAMPLES
 * add 1     -> [[1,1]]
 * add 3     -> [[1,1],[3,3]]
 * add 7     -> [[1,1],[3,3],[7,7]]
 * add 2     -> [[1,3],[7,7]]          2 glues [1,1] and [3,3]
 * add 6     -> [[1,3],[6,7]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Duplicates possible? (yes, ignore them)
 * - Many adds, few getIntervals? or the reverse? (decides where to spend the work)
 * - Follow-up: lots of merges and the number of intervals stays small.
 *
 * APPROACH 1 — Brute force   O(1) add, O(m log m) getIntervals, O(m) space
 * Keep a Set of values. getIntervals sorts them and groups consecutive runs.
 *
 * APPROACH 2 — Optimal (sorted interval list + binary search)   O(log k + k) add, O(k) get
 * Keep intervals sorted by start (k = number of intervals, usually far fewer than values).
 * For val, binary-search i = first interval with start > val. Let L = intervals[i-1] (may be
 * missing), R = intervals[i] (may be missing).
 *   - val inside L (L.end >= val)               -> nothing to do
 *   - L.end + 1 === val and R.start - 1 === val -> merge L and R into one (remove R)
 *   - L.end + 1 === val                         -> extend L.end
 *   - R.start - 1 === val                       -> extend R.start
 *   - otherwise                                 -> insert [val, val] at i
 * splice is O(k) in the worst case; a balanced BST / TreeMap (Java) makes add O(log k).
 *
 * Dry run:
 *   add 1: list empty -> insert [1,1]
 *   add 3: i=1, L=[1,1] end+1=2!=3, no R -> insert -> [[1,1],[3,3]]
 *   add 7: insert -> [[1,1],[3,3],[7,7]]
 *   add 2: i=1, L=[1,1] end+1=2 ok, R=[3,3] start-1=2 ok -> merge -> [[1,3],[7,7]]
 *   add 6: i=1, L=[1,3] end+1=4 no, R=[7,7] start-1=6 -> R becomes [6,7]
 *
 * EDGE CASES
 * - duplicate value / value inside an interval -> unchanged
 * - val = 0 (no left neighbour)
 * - getIntervals must return copies so callers cannot corrupt the state
 */

function bruteForce() {
  const seen = new Set();
  return {
    addNum(val) { seen.add(val); },
    getIntervals() {
      const vals = [...seen].sort((a, b) => a - b);
      const out = [];
      for (const v of vals) {
        if (out.length && out[out.length - 1][1] + 1 === v) out[out.length - 1][1] = v;
        else out.push([v, v]);
      }
      return out;
    },
  };
}

function optimal() {
  const iv = [];   // sorted, disjoint, non-adjacent [start, end]
  return {
    addNum(val) {
      let lo = 0, hi = iv.length;            // first index with start > val
      while (lo < hi) { const mid = (lo + hi) >> 1; if (iv[mid][0] > val) hi = mid; else lo = mid + 1; }
      const L = lo > 0 ? iv[lo - 1] : null;
      const R = lo < iv.length ? iv[lo] : null;
      if (L && L[1] >= val) return;                          // already covered
      const joinL = L && L[1] + 1 === val;
      const joinR = R && R[0] - 1 === val;
      if (joinL && joinR) { L[1] = R[1]; iv.splice(lo, 1); }
      else if (joinL) L[1] = val;
      else if (joinR) R[0] = val;
      else iv.splice(lo, 0, [val, val]);
    },
    getIntervals() { return iv.map(([a, b]) => [a, b]); },
  };
}

// ---------- tests ----------
const assert = require('assert');
for (const make of [bruteForce, optimal]) {
  const d = make();
  const expected = [
    [[1, 1]], [[1, 1], [3, 3]], [[1, 1], [3, 3], [7, 7]], [[1, 3], [7, 7]], [[1, 3], [6, 7]],
  ];
  [1, 3, 7, 2, 6].forEach((v, i) => { d.addNum(v); assert.deepStrictEqual(d.getIntervals(), expected[i]); });
  d.addNum(2); d.addNum(7);
  assert.deepStrictEqual(d.getIntervals(), [[1, 3], [6, 7]]);   // duplicates
  d.addNum(0); d.addNum(4); d.addNum(5);
  assert.deepStrictEqual(d.getIntervals(), [[0, 7]]);
  const e = make();
  assert.deepStrictEqual(e.getIntervals(), []);
  const c = make(); c.addNum(5);
  c.getIntervals()[0][0] = 99;                                 // caller mutates the copy
  assert.deepStrictEqual(c.getIntervals(), [[5, 5]]);
}
let s = 77;
const rnd = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648;
for (let t = 0; t < 50; t++) {
  const a = bruteForce(), b = optimal();
  for (let i = 0; i < 100; i++) {
    const v = Math.floor(rnd() * 60);
    a.addNum(v); b.addNum(v);
    if (i % 7 === 0) assert.deepStrictEqual(a.getIntervals(), b.getIntervals());
  }
  assert.deepStrictEqual(a.getIntervals(), b.getIntervals());
}
console.log('✓ 09_data_stream_as_disjoint_intervals passed');

module.exports = { optimal, bruteForce };

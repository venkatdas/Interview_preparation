/**
 * 05. Smallest Covering Range   (Original — Hard)
 *
 * PROBLEM
 * k teams each publish a sorted (non-decreasing) list of times when they are free.
 * Find the smallest time range [lo, hi] that contains at least one time from EVERY list.
 * "Smallest" means smallest hi - lo; on a tie, the one with the smaller lo.
 * Every list is non-empty.
 *
 * EXAMPLES
 * Input: [[4, 10, 15], [0, 9, 12], [5, 18]]   Output: [0, 5]   Explanation: 4, 0 and 5 are inside
 * Input: [[1, 5], [3, 9], [4]]                Output: [3, 5]   Explanation: 5, 3 and 4 are inside
 * Input: [[7, 8]]                             Output: [7, 7]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - k up to 3500, total elements N up to 10^5.
 * - Lists sorted? (yes) Duplicates allowed? (yes)
 *
 * APPROACH 1 — Brute force   O(N^2 * N) time
 * Every candidate range has lo and hi equal to some elements. Try every pair (lo, hi)
 * with lo <= hi and check each list for an element inside.
 *
 * APPROACH 2 — Optimal (min-heap k-way merge + running max, a sliding window over k lists)   O(N log k) time, O(k) space
 * Put the first element of every list in a min-heap and track the current max. The range
 * [heap min, max] covers all lists. To try to shrink it, the only useful move is to advance
 * the list that holds the minimum (advancing anything else can only grow max). Pop the min,
 * push the next element of that list, update max, record the range. Stop when some list
 * runs out (the minimum can never be advanced again).
 *
 * Dry run on [[1, 5], [3, 9], [4]]:
 *   heap {1(L0), 3(L1), 4(L2)}  max=4   range [1,4] width 3   best [1,4]
 *   pop 1, push 5 (L0)          max=5   heap min 3 -> range [3,5] width 2  best [3,5]
 *   pop 3, push 9 (L1)          max=9   heap min 4 -> range [4,9] width 5
 *   pop 4: list L2 is exhausted -> stop
 *   answer [3, 5]
 *   (In code the range is recorded right after each pop, using the popped value as lo.)
 *
 * EDGE CASES
 * - a single list -> [x, x] for its first element
 * - all lists share a value -> zero-width range
 *
 * COMMON MISTAKES
 * - Advancing the list with the maximum instead of the minimum.
 * - Forgetting to update max when pushing the new element.
 */

function bruteForce(lists) {
  const all = [...new Set(lists.flat())].sort((a, b) => a - b);
  let best = null;
  for (const lo of all) for (const hi of all) {
    if (hi < lo) continue;
    if (best && (hi - lo > best[1] - best[0] || (hi - lo === best[1] - best[0] && lo >= best[0]))) continue;
    if (lists.every((l) => l.some((v) => v >= lo && v <= hi))) best = [lo, hi];
  }
  return best;
}

function optimal(lists) {
  // heap of [value, listIndex, position], ordered by value
  const heap = [];
  const less = (a, b) => a[0] < b[0];
  const push = (x) => { heap.push(x); let i = heap.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (!less(heap[i], heap[p])) break; [heap[i], heap[p]] = [heap[p], heap[i]]; i = p; } };
  const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < heap.length && less(heap[l], heap[m])) m = l; if (r < heap.length && less(heap[r], heap[m])) m = r; if (m === i) break; [heap[i], heap[m]] = [heap[m], heap[i]]; i = m; } } return top; };
  let max = -Infinity;
  lists.forEach((l, i) => { push([l[0], i, 0]); max = Math.max(max, l[0]); });
  let best = [heap[0][0], max];
  for (;;) {
    const [v, li, pos] = pop();
    if (max - v < best[1] - best[0]) best = [v, max]; // strict: earlier (smaller lo) wins ties
    if (pos + 1 === lists[li].length) break;
    const nv = lists[li][pos + 1];
    push([nv, li, pos + 1]);
    max = Math.max(max, nv);
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([[4, 10, 15], [0, 9, 12], [5, 18]]), [0, 5]);
  assert.deepStrictEqual(solve([[1, 5], [3, 9], [4]]), [3, 5]);
  assert.deepStrictEqual(solve([[7, 8]]), [7, 7]);
  assert.deepStrictEqual(solve([[1, 2, 3], [1, 2, 3], [1, 2, 3]]), [1, 1]);
  assert.deepStrictEqual(solve([[1], [10]]), [1, 10]);
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(305);
for (let t = 0; t < 300; t++) {
  const k = 1 + Math.floor(rand() * 4);
  const lists = Array.from({ length: k }, () => Array.from({ length: 1 + Math.floor(rand() * 4) }, () => Math.floor(rand() * 20)).sort((a, b) => a - b));
  assert.deepStrictEqual(optimal(lists), bruteForce(lists));
}
console.log('✓ set_03/05_smallest_covering_range passed');
module.exports = { optimal, bruteForce };

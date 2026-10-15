/**
 * 13. Smallest Range Covering Elements from K Lists   (LeetCode 632 — Hard)
 *
 * PROBLEM
 * You have k sorted lists. Find the smallest range [a, b] that contains at
 * least one number from EACH list. Smaller width wins; on a tie, smaller a.
 *
 * EXAMPLES
 * Input: [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]   Output: [20,24]
 *   Explanation: 24 from list 1, 20 from list 2, 22 from list 3; width 4 is the best possible
 * Input: [[1,2,3],[1,2,3],[1,2,3]]                     Output: [1,1]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Each list non-empty and sorted? (yes)
 * - k up to 3500, total elements up to 10^5 -> need about N log k
 *
 * APPROACH 1 — Brute force   O(N^2 * k) time, O(N) space
 * Collect all values, sort them. For every candidate start value a, extend b
 * until every list has a value in [a, b] (check by scanning each list).
 * Keep the best. Far too slow for big input but easy to trust in tests.
 *
 * APPROACH 2 — Optimal (k-way merge with a min-heap + track max)   O(N log k) time, O(k) space
 * This is "merge k sorted lists" with a twist. Keep one element from each
 * list in a min-heap (start with each list's first). At any moment the heap
 * holds k numbers, one per list, so [heap.min, currentMax] is a valid range.
 * To try to shrink it, the only move that can help is to advance the list
 * that owns the MINIMUM (advancing anything else can only raise the max).
 *   loop:
 *     range = [heap.min, max]; keep if smaller
 *     pop the min; if its list is exhausted -> stop (no more valid ranges)
 *     push the next element of that list; update max
 *
 * Dry run on [[4,10,15,24,26],[0,9,12,20],[5,18,22,30]]:
 *   heap {0,4,5} max 5   -> range [0,5]  w5     pop 0, push 9  max 9
 *   heap {4,5,9}         -> [4,9]  w5          pop 4, push 10 max 10
 *   heap {5,9,10}        -> [5,10] w5          pop 5, push 18 max 18
 *   heap {9,10,18}       -> [9,18] w9          pop 9, push 12
 *   heap {10,12,18}      -> [10,18] w8         pop 10, push 15
 *   heap {12,15,18}      -> [12,18] w6         pop 12, push 20 max 20
 *   heap {15,18,20}      -> [15,20] w5         pop 15, push 24 max 24
 *   heap {18,20,24}      -> [18,24] w6         pop 18, push 22
 *   heap {20,22,24}      -> [20,24] w4  best   pop 20, list 2 exhausted -> stop
 *   answer [20,24]
 *
 * EDGE CASES
 * - k = 1 -> [first, first]
 * - identical lists -> [x, x]
 * - lists of length 1
 */

const { MinHeap } = require('../../02_Implementations/min_heap');

function bruteForce(lists) {
  const all = [...new Set(lists.flat())].sort((a, b) => a - b);
  let best = null;
  for (const start of all) {
    for (const end of all) {
      if (end < start) continue;
      const coversAll = lists.every((list) => list.some((v) => v >= start && v <= end));
      if (coversAll) {
        if (!best || end - start < best[1] - best[0]) best = [start, end];
        break; // larger end only widens the range for this start
      }
    }
  }
  return best;
}

function optimal(lists) {
  // heap entries: [value, listIndex, indexInList]
  const heap = new MinHeap((a, b) => a[0] - b[0]);
  let currentMax = -Infinity;
  for (let listIndex = 0; listIndex < lists.length; listIndex++) {
    heap.push([lists[listIndex][0], listIndex, 0]);
    currentMax = Math.max(currentMax, lists[listIndex][0]);
  }

  let best = [-Infinity, Infinity];
  while (true) {
    const [minValue, listIndex, position] = heap.pop();
    if (currentMax - minValue < best[1] - best[0]) best = [minValue, currentMax];

    const nextPosition = position + 1;
    if (nextPosition === lists[listIndex].length) break; // that list ran out: no further valid ranges
    const nextValue = lists[listIndex][nextPosition];
    heap.push([nextValue, listIndex, nextPosition]);
    currentMax = Math.max(currentMax, nextValue);
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([[4, 10, 15, 24, 26], [0, 9, 12, 20], [5, 18, 22, 30]]), [20, 24]);
  assert.deepStrictEqual(solve([[1, 2, 3], [1, 2, 3], [1, 2, 3]]), [1, 1]);
  assert.deepStrictEqual(solve([[7]]), [7, 7]);
  assert.deepStrictEqual(solve([[1], [10]]), [1, 10]);
  assert.deepStrictEqual(solve([[10, 10], [11, 11]]), [10, 11]);
  assert.deepStrictEqual(solve([[-5, 0, 5], [-1, 1], [3]]), [0, 3]);
}
console.log('✓ 13-smallest-range-k-lists passed');

module.exports = { optimal, bruteForce };

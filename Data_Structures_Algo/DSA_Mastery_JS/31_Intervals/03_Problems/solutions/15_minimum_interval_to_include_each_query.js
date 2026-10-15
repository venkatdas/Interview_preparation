/**
 * 15. Minimum Interval to Include Each Query   (LeetCode 1851 — Hard)
 *
 * PROBLEM
 * Given intervals [left, right] (inclusive) and queries q, for each query return the SIZE
 * (right - left + 1) of the smallest interval that contains q, or -1 if none does.
 *
 * EXAMPLES
 * Input: intervals = [[1,4],[2,4],[3,6],[4,4]], queries = [2,3,4,5]   Output: [3,3,1,4]
 *   Explanation: q=2 -> [2,4] size 3; q=3 -> [2,4] size 3; q=4 -> [4,4] size 1; q=5 -> [3,6] size 4
 * Input: intervals = [[2,3],[2,5],[1,8],[20,25]], queries = [2,19,5,22]   Output: [2,-1,4,6]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Answers must be in the ORIGINAL query order? (yes - so remember indices when sorting)
 * - n, q up to 10^5 -> O(n * q) is too slow
 *
 * APPROACH 1 — Brute force   O(n * q) time, O(1) extra
 * For each query, scan every interval, keep the smallest size among those containing it.
 *
 * APPROACH 2 — Optimal (offline: sort queries + sort intervals + min-heap by size)   O((n + q) log(n + q)) time, O(n + q) space
 * Process queries in increasing order (keeping their original index). Sort intervals by
 * left. Walk a pointer over intervals: push every interval whose left <= q into a min-heap
 * keyed by size (store [size, right]). Then pop from the heap while the top's right < q
 * (those intervals ended before q and can never serve a later, larger query either). The
 * heap top (if any) is the answer for q.
 * Why it works: once an interval's left <= q it stays eligible for all bigger queries until
 * its right is passed; sizes do not change; so the heap always holds exactly the
 * "started but not yet ended" intervals, and the min is the smallest one containing q.
 *
 * Dry run on intervals [[1,4],[2,4],[3,6],[4,4]], queries [2,3,4,5]:
 *   q=2: push [1,4](4),[2,4](3). top size 3 right 4 >= 2 -> 3
 *   q=3: push [3,6](4). top 3 -> 3
 *   q=4: push [4,4](1). top 1 -> 1
 *   q=5: top [4,4] right 4 < 5 pop; [2,4] right 4 < 5 pop; [1,4] pop; [3,6] right 6 -> 4
 *   -> [3,3,1,4]
 *
 * EDGE CASES
 * - query smaller than every left -> -1
 * - query larger than every right -> -1 (heap drains)
 * - duplicate queries -> same answer
 */

function bruteForce(intervals, queries) {
  return queries.map((q) => {
    let best = Infinity;
    for (const [left, right] of intervals) {
      if (left <= q && q <= right) best = Math.min(best, right - left + 1);
    }
    return best === Infinity ? -1 : best;
  });
}

// min-heap of [size, right] ordered by size
class MinHeap {
  #data = [];
  size() { return this.#data.length; }
  peek() { return this.#data[0]; }
  push(item) {
    const d = this.#data;
    d.push(item);
    let i = d.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (d[p][0] <= d[i][0]) break;
      [d[p], d[i]] = [d[i], d[p]];
      i = p;
    }
  }
  pop() {
    const d = this.#data;
    const top = d[0];
    const last = d.pop();
    if (d.length) {
      d[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1, r = l + 1;
        let s = i;
        if (l < d.length && d[l][0] < d[s][0]) s = l;
        if (r < d.length && d[r][0] < d[s][0]) s = r;
        if (s === i) break;
        [d[s], d[i]] = [d[i], d[s]];
        i = s;
      }
    }
    return top;
  }
}

function optimal(intervals, queries) {
  const sortedIntervals = [...intervals].sort((a, b) => a[0] - b[0]);
  const order = queries.map((q, index) => [q, index]).sort((a, b) => a[0] - b[0]);
  const answer = new Array(queries.length).fill(-1);
  const heap = new MinHeap();
  let next = 0; // pointer into sortedIntervals

  for (const [q, index] of order) {
    while (next < sortedIntervals.length && sortedIntervals[next][0] <= q) {  // intervals that have started
      const [left, right] = sortedIntervals[next++];
      heap.push([right - left + 1, right]);
    }
    while (heap.size() && heap.peek()[1] < q) heap.pop();                       // intervals that already ended
    if (heap.size()) answer[index] = heap.peek()[0];
  }
  return answer;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([[1, 4], [2, 4], [3, 6], [4, 4]], [2, 3, 4, 5]), [3, 3, 1, 4]);
  assert.deepStrictEqual(solve([[2, 3], [2, 5], [1, 8], [20, 25]], [2, 19, 5, 22]), [2, -1, 4, 6]);
  assert.deepStrictEqual(solve([[1, 1]], [0, 1, 2]), [-1, 1, -1]);
  assert.deepStrictEqual(solve([], [5]), [-1]);
  assert.deepStrictEqual(solve([[1, 10], [3, 3]], [3, 3, 7]), [1, 1, 10]);
  assert.deepStrictEqual(solve([[5, 9], [1, 3]], [9, 1, 4]), [5, 3, -1]);
}
console.log('✓ 15-minimum-interval-to-include-each-query passed');

module.exports = { optimal, bruteForce };

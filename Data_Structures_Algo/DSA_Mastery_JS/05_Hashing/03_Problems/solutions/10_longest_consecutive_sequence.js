/**
 * 10. Longest Consecutive Sequence   (LeetCode 128 — Medium)
 *
 * PROBLEM
 * Given an unsorted integer array, return the length of the longest run of consecutive
 * integers (values, not positions). Must run in O(n) time.
 *
 * EXAMPLES
 * Input: [100, 4, 200, 1, 3, 2]          Output: 4   Explanation: 1, 2, 3, 4
 * Input: [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]  Output: 9   Explanation: 0..8
 * Input: []                              Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Duplicates? (yes, they don't extend a run: [1,1,2] -> 2)
 * - Negative numbers? (yes)
 * - Must it be O(n)? (the whole point; sorting would be O(n log n))
 *
 * APPROACH 1 — Brute force (sort)   O(n log n) time, O(1) or O(n) space
 * Sort, then walk once counting runs where next === current + 1 (skip equal duplicates).
 * Correct and easy, but not O(n).
 *
 * APPROACH 2 — Optimal (seen-set, only start from run beginnings)   O(n) time, O(n) space
 *   1. Put everything in a Set (O(1) membership, duplicates vanish).
 *   2. For each value v: if v - 1 is in the set, v is NOT the start of a run -> skip.
 *      Otherwise v starts a run: count upward while v+1, v+2, ... are in the set.
 * Why O(n)? Each value is walked over only from its run's start, and a run's start is
 * unique, so every value is visited at most twice (once in the outer loop, once inside
 * a run walk).
 *
 * Dry run on [100, 4, 200, 1, 3, 2]:
 *   set = {100, 4, 200, 1, 3, 2}
 *   100: 99 not in set -> start. 101? no. length 1
 *   4:   3 in set -> skip
 *   200: 199 no -> start. 201? no. length 1
 *   1:   0 no -> start. 2 yes, 3 yes, 4 yes, 5 no. length 4
 *   3:   2 in set -> skip
 *   2:   1 in set -> skip
 *   best = 4
 *
 * EDGE CASES
 * - Empty -> 0
 * - Single element -> 1
 * - Duplicates: [1, 2, 2, 3] -> 3
 * - Negative run: [-3, -2, -1] -> 3
 */

function bruteForce(nums) {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  let best = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === sorted[i - 1]) continue;       // duplicate: ignore
    if (sorted[i] === sorted[i - 1] + 1) run++;      // extends the run
    else run = 1;                                     // run broken
    best = Math.max(best, run);
  }
  return best;
}

function optimal(nums) {
  const values = new Set(nums);
  let best = 0;

  for (const value of values) {
    if (values.has(value - 1)) continue; // not the start of a run; its start will handle it

    let current = value;
    let length = 1;
    while (values.has(current + 1)) {
      current++;
      length++;
    }
    best = Math.max(best, length);
  }
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([100, 4, 200, 1, 3, 2]), 4);
  assert.strictEqual(solve([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]), 9);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([7]), 1);
  assert.strictEqual(solve([1, 2, 2, 3]), 3);
  assert.strictEqual(solve([-3, -2, -1, 5]), 3);
  assert.strictEqual(solve([9, 1, 4, 7, 3, -1, 0, 5, 8, -1, 6]), 7);
}
console.log('✓ 10-longest-consecutive-sequence passed');

module.exports = { optimal, bruteForce };

/**
 * 13. Capacity To Ship Packages Within D Days   (LeetCode 1011 — Medium)
 *
 * PROBLEM
 * Packages must be shipped IN ORDER within `days` days. Each day the ship loads
 * consecutive packages up to its capacity. Return the minimum capacity that gets
 * everything shipped on time.
 *
 * EXAMPLES
 * Input: weights = [1,2,3,4,5,6,7,8,9,10], days = 5   Output: 15
 *   day1: 1,2,3,4,5  day2: 6,7  day3: 8  day4: 9  day5: 10
 * Input: weights = [3,2,2,4,1,4], days = 3   Output: 6
 * Input: weights = [1,2,3,1,1], days = 4     Output: 3
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Order must be preserved (cannot reorder packages) -> greedy fill is correct
 * - 1 <= days <= n, so an answer always exists
 * - Lower bound for capacity: max(weights) (the biggest package must fit)
 * - Upper bound: sum(weights) (ship everything in one day)
 *
 * APPROACH 1 — Brute force   O(n * sum)
 * Try every capacity from max(weights) up to sum(weights); for each, simulate the
 * greedy loading and return the first that fits in `days`.
 *
 * APPROACH 2 — Optimal (binary search on the answer)   O(n log sum) time, O(1) space
 * daysNeeded(capacity): greedily fill each day as much as possible; count days.
 * It is monotonic (more capacity -> fewer or equal days), so search the first
 * capacity in [max, sum] with daysNeeded <= days.
 *
 * Dry run [3,2,2,4,1,4], days 3: lo = 4, hi = 16
 *   mid=10: days: [3,2,2]=7 +4=11 no -> day2 [4,1,4]=9 -> 2 days <= 3 -> hi=10
 *   mid=7:  [3,2,2]=7 | [4,1]=5 +4=9 no -> [4] -> 3 days <= 3 -> hi=7
 *   mid=5:  [3,2]=5 | [2]... +4=6 no -> [4,1]=5 | [4] -> 4 days > 3 -> lo=6
 *   mid=6:  [3,2]=5 +2=7 no -> [2,4]=6 | [1,4]=5 -> 3 days -> hi=6
 *   lo === hi === 6 -> 6
 *
 * EDGE CASES
 * - days === n -> max(weights)
 * - days === 1 -> sum(weights)
 * - single package
 */

function daysNeeded(weights, capacity) {
  let days = 1, load = 0;
  for (const w of weights) {
    if (load + w > capacity) {   // does not fit today: start a new day
      days++;
      load = 0;
    }
    load += w;
  }
  return days;
}

function bruteForce(weights, days) {
  const max = Math.max(...weights);
  const sum = weights.reduce((a, b) => a + b, 0);
  for (let capacity = max; capacity <= sum; capacity++) {
    if (daysNeeded(weights, capacity) <= days) return capacity;
  }
  return sum;
}

function optimal(weights, days) {
  let lo = Math.max(...weights);              // smallest capacity that can carry every package
  let hi = weights.reduce((a, b) => a + b, 0); // one day for everything
  while (lo < hi) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (daysNeeded(weights, mid) <= days) hi = mid;   // feasible: try smaller
    else lo = mid + 1;                                // infeasible: need more capacity
  }
  return lo;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5), 15);
  assert.strictEqual(solve([3, 2, 2, 4, 1, 4], 3), 6);
  assert.strictEqual(solve([1, 2, 3, 1, 1], 4), 3);
  assert.strictEqual(solve([7], 1), 7);
  assert.strictEqual(solve([1, 2, 3], 3), 3);          // one per day -> max
  assert.strictEqual(solve([1, 2, 3], 1), 6);          // all in one day -> sum
  assert.strictEqual(solve([10, 50, 100, 100, 50, 10], 2), 160);
}
for (let trial = 0; trial < 100; trial++) {
  const weights = Array.from({ length: 1 + Math.floor(Math.random() * 8) }, () => 1 + Math.floor(Math.random() * 20));
  const days = 1 + Math.floor(Math.random() * weights.length);
  assert.strictEqual(optimal(weights, days), bruteForce(weights, days));
}
console.log('✓ 13-capacity-to-ship-packages passed');

module.exports = { optimal, bruteForce };

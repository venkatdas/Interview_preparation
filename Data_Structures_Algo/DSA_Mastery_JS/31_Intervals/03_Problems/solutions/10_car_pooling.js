/**
 * 10. Car Pooling   (LeetCode 1094 — Medium)
 *
 * PROBLEM
 * A car with `capacity` seats drives east only. trips[i] = [numPassengers, from, to]:
 * pick up numPassengers at location `from`, drop them at `to`. Return true if every trip
 * can be served without ever exceeding capacity. Dropping off at x and picking up at x
 * happen in that order (drop first).
 *
 * EXAMPLES
 * Input: trips = [[2,1,5],[3,3,7]], capacity = 4   Output: false   Explanation: 5 people between 3 and 5
 * Input: trips = [[2,1,5],[3,3,7]], capacity = 5   Output: true
 * Input: trips = [[2,1,5],[3,5,7]], capacity = 3   Output: true    Explanation: drop at 5 before pickup at 5
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Locations are small integers (0..1000)? (yes -> a difference array works too)
 * - Drop-off before pick-up at the same location? (yes)
 *
 * APPROACH 1 — Brute force   O(n * range) time, O(range) space
 * For every location, add up passengers from all trips covering it; compare to capacity.
 *
 * APPROACH 2 — Optimal (sweep line with weighted events)   O(n log n) time, O(n) space
 * Each trip becomes two events: (+passengers at from) and (-passengers at to). Sort by
 * location; on ties process drop-offs (negative) first. Scan with a running total; if it
 * ever exceeds capacity -> false.
 * Because locations are <= 1000, a difference array (O(n + 1000)) avoids the sort entirely:
 * diff[from] += p, diff[to] -= p, then prefix-sum. Shown as `optimalDiffArray`.
 *
 * Dry run on [[2,1,5],[3,3,7]], capacity 4:
 *   events: (1,+2) (3,+3) (5,-2) (7,-3)
 *   running: 2, 5 -> 5 > 4 -> false
 *
 * EDGE CASES
 * - no trips -> true
 * - a single trip bigger than capacity -> false
 * - pickup and dropoff at the same location (drop first) -> fine
 */

function bruteForce(trips, capacity) {
  const maxLocation = Math.max(0, ...trips.map((t) => t[2]));
  for (let x = 0; x <= maxLocation; x++) {
    let onboard = 0;
    for (const [passengers, from, to] of trips) {
      if (from <= x && x < to) onboard += passengers; // passengers ride on [from, to)
    }
    if (onboard > capacity) return false;
  }
  return true;
}

function optimal(trips, capacity) {
  const events = [];
  for (const [passengers, from, to] of trips) {
    events.push([from, passengers]);
    events.push([to, -passengers]);
  }
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]); // same location: drop-offs (negative) first

  let onboard = 0;
  for (const [, delta] of events) {
    onboard += delta;
    if (onboard > capacity) return false;
  }
  return true;
}

function optimalDiffArray(trips, capacity) {
  const diff = new Array(1002).fill(0);
  for (const [passengers, from, to] of trips) {
    diff[from] += passengers;
    diff[to] -= passengers;
  }
  let onboard = 0;
  for (const delta of diff) {
    onboard += delta;
    if (onboard > capacity) return false;
  }
  return true;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal, optimalDiffArray]) {
  assert.strictEqual(solve([[2, 1, 5], [3, 3, 7]], 4), false);
  assert.strictEqual(solve([[2, 1, 5], [3, 3, 7]], 5), true);
  assert.strictEqual(solve([[2, 1, 5], [3, 5, 7]], 3), true);
  assert.strictEqual(solve([], 1), true);
  assert.strictEqual(solve([[10, 0, 1]], 9), false);
  assert.strictEqual(solve([[3, 2, 7], [3, 7, 9], [8, 3, 9]], 11), true);
  assert.strictEqual(solve([[1, 0, 10], [1, 0, 10], [1, 0, 10]], 2), false);
}
console.log('✓ 10-car-pooling passed');

module.exports = { optimal, optimalDiffArray, bruteForce };

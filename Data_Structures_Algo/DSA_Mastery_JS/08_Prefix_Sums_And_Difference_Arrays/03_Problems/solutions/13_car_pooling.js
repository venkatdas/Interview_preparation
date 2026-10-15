/**
 * 13. Car Pooling   (LeetCode 1094 — Medium)
 *
 * PROBLEM
 * A car with `capacity` seats drives east only. trips[i] = [numPassengers, from, to]:
 * numPassengers get in at location `from` and get out at `to`. Return true if it is
 * possible to complete all trips without ever exceeding capacity.
 *
 * EXAMPLES
 * Input: trips = [[2,1,5],[3,3,7]], capacity = 4   Output: false   Explanation: between 3 and 5 there are 5 people
 * Input: trips = [[2,1,5],[3,3,7]], capacity = 5   Output: true
 * Input: trips = [[2,1,5],[3,5,7]], capacity = 3   Output: true    Explanation: the first group leaves exactly when the second boards
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Drop-off at `to` happens BEFORE pick-up at the same location? (yes; so `to` is exclusive)
 * - Locations in a small range? (0 <= from < to <= 1000 -> a fixed-size array works)
 * - Many trips? (up to 1000)
 *
 * APPROACH 1 — Brute force   O(trips * route length) time, O(route length) space
 * For each trip, add passengers to every location in [from, to). Then check the max.
 *
 * APPROACH 2 — Optimal (difference array over locations)   O(trips + maxLocation) time, O(maxLocation) space
 * Each trip is a range update: +passengers on [from, to). On a difference array:
 *   diff[from] += passengers; diff[to] -= passengers
 * Then a running sum gives the passenger count at every location; fail if any > capacity.
 * Same pattern as Corporate Flight Bookings, with "time/location" as the index.
 * (Alternative: sort events by location and sweep; O(trips log trips) but no size limit.)
 *
 * Dry run on [[2,1,5],[3,3,7]], capacity 4:
 *   diff: [0, 2, 0, 3, 0, -2, 0, -3, ...]
 *   running: loc0 0, loc1 2, loc2 2, loc3 5 > 4 -> false
 *
 * EDGE CASES
 * - Drop-off and pick-up at the same location (exclusive end handles it)
 * - Single trip with passengers > capacity -> false
 * - No trips -> true
 * - Trips far apart never overlap
 */

function bruteForce(trips, capacity) {
  const maxLocation = Math.max(0, ...trips.map((t) => t[2]));
  const onboard = new Array(maxLocation + 1).fill(0);
  for (const [passengers, from, to] of trips) {
    for (let location = from; location < to; location++) onboard[location] += passengers;
  }
  return onboard.every((count) => count <= capacity);
}

function optimal(trips, capacity) {
  const maxLocation = Math.max(0, ...trips.map((t) => t[2]));
  const diff = new Array(maxLocation + 2).fill(0);

  for (const [passengers, from, to] of trips) {
    diff[from] += passengers; // board
    diff[to] -= passengers;   // alight (before anyone boards at `to`)
  }

  let onboard = 0;
  for (let location = 0; location <= maxLocation; location++) {
    onboard += diff[location];
    if (onboard > capacity) return false;
  }
  return true;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([[2, 1, 5], [3, 3, 7]], 4), false);
  assert.strictEqual(solve([[2, 1, 5], [3, 3, 7]], 5), true);
  assert.strictEqual(solve([[2, 1, 5], [3, 5, 7]], 3), true);
  assert.strictEqual(solve([[3, 2, 7], [3, 7, 9], [8, 3, 9]], 11), true);
  assert.strictEqual(solve([[9, 0, 1]], 8), false);
  assert.strictEqual(solve([], 1), true);
  assert.strictEqual(solve([[1, 0, 10], [1, 2, 3], [1, 5, 6]], 2), true);
}
console.log('✓ 13-car-pooling passed');

module.exports = { optimal, bruteForce };

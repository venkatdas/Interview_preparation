/**
 * 12. Corporate Flight Bookings   (LeetCode 1109 — Medium)
 *
 * PROBLEM
 * There are n flights labelled 1..n. bookings[i] = [first, last, seats] means `seats`
 * seats were booked on EVERY flight from first to last (inclusive). Return an array
 * answer of length n where answer[i] is the total seats booked on flight i + 1.
 *
 * EXAMPLES
 * Input: bookings = [[1,2,10],[2,3,20],[2,5,25]], n = 5   Output: [10, 55, 45, 25, 25]
 *   Explanation: flight 1: 10 | flight 2: 10+20+25 | flight 3: 20+25 | flights 4,5: 25
 * Input: bookings = [[1,2,10],[2,2,15]], n = 2            Output: [10, 25]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1-indexed flights? (yes -> subtract 1)
 * - Up to 2*10^4 bookings and flights -> O(n * bookings) = 4*10^8 is too slow
 * - Are we asked for point values only at the end? (yes -> difference array fits perfectly)
 *
 * APPROACH 1 — Brute force   O(n * bookings) time, O(n) space
 * For each booking, loop from first to last and add seats.
 *
 * APPROACH 2 — Optimal (difference array)   O(n + bookings) time, O(n) space
 * A range update [first, last] += seats becomes two point updates on a difference array:
 *   diff[first - 1] += seats      (seats "switch on" at first)
 *   diff[last]      -= seats      (seats "switch off" after last)
 * After all bookings, the running sum of diff is the answer.
 *
 * Dry run on [[1,2,10],[2,3,20],[2,5,25]], n = 5:
 *   diff (length 6): start [0,0,0,0,0,0]
 *   [1,2,10]: diff[0]+=10, diff[2]-=10  -> [10, 0, -10, 0, 0, 0]
 *   [2,3,20]: diff[1]+=20, diff[3]-=20  -> [10, 20, -10, -20, 0, 0]
 *   [2,5,25]: diff[1]+=25, diff[5]-=25  -> [10, 45, -10, -20, 0, -25]
 *   running sum: 10, 55, 45, 25, 25
 *
 * EDGE CASES
 * - Booking covers all flights
 * - Booking of a single flight (first === last)
 * - No bookings -> all zeros
 * - last === n (diff needs n + 1 slots)
 */

function bruteForce(bookings, n) {
  const answer = new Array(n).fill(0);
  for (const [first, last, seats] of bookings) {
    for (let flight = first - 1; flight <= last - 1; flight++) answer[flight] += seats;
  }
  return answer;
}

function optimal(bookings, n) {
  const diff = new Array(n + 1).fill(0);
  for (const [first, last, seats] of bookings) {
    diff[first - 1] += seats; // turn on
    diff[last] -= seats;      // turn off (index `last` is the flight AFTER the range, 0-based)
  }

  const answer = new Array(n);
  let running = 0;
  for (let i = 0; i < n; i++) {
    running += diff[i];
    answer[i] = running;
  }
  return answer;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([[1, 2, 10], [2, 3, 20], [2, 5, 25]], 5), [10, 55, 45, 25, 25]);
  assert.deepStrictEqual(solve([[1, 2, 10], [2, 2, 15]], 2), [10, 25]);
  assert.deepStrictEqual(solve([[1, 3, 5]], 3), [5, 5, 5]);
  assert.deepStrictEqual(solve([], 3), [0, 0, 0]);
  assert.deepStrictEqual(solve([[3, 3, 7]], 3), [0, 0, 7]);
  assert.deepStrictEqual(solve([[1, 1, 1], [1, 1, 1]], 1), [2]);
}
console.log('✓ 12-corporate-flight-bookings passed');

module.exports = { optimal, bruteForce };

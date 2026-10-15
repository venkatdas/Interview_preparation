/**
 * 02. Teemo Attacking   (LeetCode 495 — Easy)
 *
 * PROBLEM
 * timeSeries is a sorted list of attack times. Each attack poisons the target for
 * `duration` seconds starting at that second (attack at t covers t .. t+duration-1).
 * A new attack resets the timer (it does not stack). Return the total poisoned seconds.
 *
 * EXAMPLES
 * Input: timeSeries = [1,4], duration = 2   Output: 4   Explanation: 1-2 and 4-5
 * Input: timeSeries = [1,2], duration = 2   Output: 3   Explanation: 1-2 then reset to 2-3
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Is timeSeries sorted ascending? (yes)
 * - Can two attacks happen at the same second? (treat as one; the formula handles it)
 *
 * APPROACH 1 — Brute force   O(n * duration) time, O(n * duration) space
 * Put every poisoned second into a Set; return its size.
 *
 * APPROACH 2 — Optimal (clip each interval by the next start)   O(n) time, O(1) space
 * Each attack is the interval [t, t + duration). Because the list is sorted, attack i
 * contributes min(duration, next - t) seconds: either its full duration, or only until the
 * next attack resets it. The last attack always contributes the full duration.
 *
 * Dry run on [1,2], duration 2:
 *   i=0: min(2, 2-1) = 1
 *   last: 2            -> 3
 *
 * EDGE CASES
 * - empty -> 0
 * - single attack -> duration
 * - duration 0 -> 0
 */

function bruteForce(timeSeries, duration) {
  const poisoned = new Set();
  for (const t of timeSeries) for (let s = t; s < t + duration; s++) poisoned.add(s);
  return poisoned.size;
}

function optimal(timeSeries, duration) {
  if (timeSeries.length === 0) return 0;
  let total = 0;
  for (let i = 0; i < timeSeries.length - 1; i++) {
    total += Math.min(duration, timeSeries[i + 1] - timeSeries[i]); // clipped by the next attack
  }
  return total + duration; // the last attack runs its full course
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 4], 2), 4);
  assert.strictEqual(solve([1, 2], 2), 3);
  assert.strictEqual(solve([], 5), 0);
  assert.strictEqual(solve([7], 3), 3);
  assert.strictEqual(solve([1, 2, 3, 4, 5], 10), 14);
  assert.strictEqual(solve([1, 5], 0), 0);
  assert.strictEqual(solve([1, 1, 1], 2), 2);
}
console.log('✓ 02-teemo-attacking passed');

module.exports = { optimal, bruteForce };

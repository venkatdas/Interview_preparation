/**
 * 07. Gas Station   (LeetCode 134 — Medium)
 *
 * PROBLEM
 * There are n gas stations on a circle. gas[i] is the fuel you get at station i, cost[i] is
 * the fuel needed to drive from station i to station i + 1. You start with an empty tank.
 * Return the starting station index from which you can complete one full loop clockwise,
 * or -1 if impossible. The answer is guaranteed unique if it exists.
 *
 * EXAMPLES
 * Input: gas = [1,2,3,4,5], cost = [3,4,5,1,2]   Output: 3
 *   Explanation: start at 3: tank 4-1=3, +5-2=6, +1-3=4, +2-4=2, +3-5=0 -> made it
 * Input: gas = [2,3,4], cost = [3,4,3]           Output: -1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can we drive counter-clockwise? (no)
 * - Is the tank unlimited? (yes)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * Try every start. Simulate a full loop; if the tank ever goes negative, that start fails.
 *
 * APPROACH 2 — Optimal (one pass, circuit argument)   O(n) time, O(1) space
 * 1. If sum(gas) < sum(cost), no start works -> -1.
 * 2. Otherwise scan once with `tank`. Whenever tank drops below 0 at station i, every station
 *    from the current `start` through i is a bad start, so set start = i + 1 and tank = 0.
 *
 * WHY GREEDY WORKS
 * Claim A: if you leave `start` with 0 fuel and first run dry on the way to station i + 1,
 * then no station between start and i can be a valid start either. From any such station k
 * you would arrive at i with LESS fuel than you had coming from start (you skipped the
 * positive surplus accumulated before k), so you would run dry too.
 * Claim B: if total gas >= total cost, the last `start` we pick works. Everything before it
 * had a net negative surplus (that is why we skipped it), so the segment from start to the
 * end has surplus >= total surplus >= 0, which carries us around the loop and through the
 * early negative part.
 *
 * Dry run on gas = [1,2,3,4,5], cost = [3,4,5,1,2]:
 *   total surplus = 15 - 15 = 0 -> a start exists
 *   i=0 tank=-2 <0 -> start=1, tank=0
 *   i=1 tank=-2 <0 -> start=2, tank=0
 *   i=2 tank=-2 <0 -> start=3, tank=0
 *   i=3 tank=3
 *   i=4 tank=6   -> answer 3
 *
 * EDGE CASES
 * - single station with gas >= cost -> 0
 * - gas equals cost everywhere -> 0
 * - total gas < total cost -> -1 before scanning
 */

function bruteForce(gas, cost) {
  const n = gas.length;
  for (let start = 0; start < n; start++) {
    let tank = 0;
    let ok = true;
    for (let step = 0; step < n; step++) {
      const station = (start + step) % n;
      tank += gas[station] - cost[station];
      if (tank < 0) { ok = false; break; }
    }
    if (ok) return start;
  }
  return -1;
}

function optimal(gas, cost) {
  let totalSurplus = 0;
  let tank = 0;
  let start = 0;
  for (let i = 0; i < gas.length; i++) {
    const surplus = gas[i] - cost[i];
    totalSurplus += surplus;
    tank += surplus;
    if (tank < 0) {       // ran dry: nothing from `start`..i can be the answer
      start = i + 1;
      tank = 0;
    }
  }
  return totalSurplus >= 0 ? start : -1;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]), 3);
  assert.strictEqual(solve([2, 3, 4], [3, 4, 3]), -1);
  assert.strictEqual(solve([5], [4]), 0);
  assert.strictEqual(solve([1], [2]), -1);
  assert.strictEqual(solve([2, 2, 2], [2, 2, 2]), 0);
  assert.strictEqual(solve([5, 1, 2, 3, 4], [4, 4, 1, 5, 1]), 4);
  assert.strictEqual(solve([3, 1, 1], [1, 2, 2]), 0);
}
console.log('✓ 07-gas-station passed');

module.exports = { optimal, bruteForce };

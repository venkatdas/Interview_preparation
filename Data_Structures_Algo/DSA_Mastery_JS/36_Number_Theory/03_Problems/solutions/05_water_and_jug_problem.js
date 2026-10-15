/**
 * 05. Water and Jug Problem   (LeetCode 365 — Medium)
 *
 * PROBLEM
 * You have two jugs with capacities x and y liters and unlimited water. Allowed moves:
 * fill a jug, empty a jug, pour one jug into the other until one is empty or the other full.
 * Can you end with EXACTLY target liters in total across both jugs?
 *
 * EXAMPLES
 * Input: x=3, y=5, target=4    Output: true   (the "Die Hard" puzzle)
 * Input: x=2, y=6, target=5    Output: false  (every amount is even)
 * Input: x=1, y=2, target=3    Output: true   (fill both)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= x, y, target <= 10^3 (the formula works for any size).
 *
 * APPROACH 1 — Brute force (BFS over states)   O(x * y) time and space
 * State = (a, b) liters in each jug. BFS with the 6 moves; succeed if a + b === target.
 *
 * APPROACH 2 — Optimal (Bezout's identity)   O(log min(x, y)) time, O(1) space
 * Every move changes the total by +-x or +-y, so every reachable total is a*x + b*y.
 * Bezout: the integer combinations a*x + b*y are EXACTLY the multiples of g = gcd(x, y).
 * And it can be shown every multiple of g in [0, x + y] is actually reachable.
 *   answer = target <= x + y  AND  target % gcd(x, y) === 0
 *
 * Dry run x=3, y=5, target=4:
 *   gcd(3,5): (3,5) -> (5,3) -> (3,2) -> (2,1) -> (1,0) -> g = 1
 *   4 <= 8 and 4 % 1 === 0 -> true.  Witness: 4 = 3*3 + 5*(-1).
 *
 * EDGE CASES
 * - target = 0 -> true (both empty)
 * - target > x + y -> false even if divisible (the jugs cannot hold it)
 */

function gcd(a, b) { while (b) [a, b] = [b, a % b]; return a; }

function bruteForce(x, y, target) {
  if (target > x + y) return false;
  const seen = new Set(['0,0']);
  const queue = [[0, 0]];
  for (let head = 0; head < queue.length; head++) {
    const [a, b] = queue[head];
    if (a + b === target) return true;
    const pourAB = Math.min(a, y - b), pourBA = Math.min(b, x - a);
    const next = [[x, b], [a, y], [0, b], [a, 0], [a - pourAB, b + pourAB], [a + pourBA, b - pourBA]];
    for (const [na, nb] of next) {
      const key = na + ',' + nb;
      if (!seen.has(key)) { seen.add(key); queue.push([na, nb]); }
    }
  }
  return false;
}

function optimal(x, y, target) {
  if (target > x + y) return false;
  return target % gcd(x, y) === 0;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(3, 5, 4), true);
  assert.strictEqual(solve(2, 6, 5), false);
  assert.strictEqual(solve(1, 2, 3), true);
  assert.strictEqual(solve(3, 5, 0), true);
  assert.strictEqual(solve(3, 5, 9), false);
  assert.strictEqual(solve(4, 6, 8), true);
  assert.strictEqual(solve(7, 7, 7), true);
}
for (let x = 1; x <= 25; x++)
  for (let y = 1; y <= 25; y++)
    for (let target = 0; target <= 55; target++)
      assert.strictEqual(optimal(x, y, target), bruteForce(x, y, target));
console.log('✓ 05_water_and_jug_problem passed');

module.exports = { optimal, bruteForce };

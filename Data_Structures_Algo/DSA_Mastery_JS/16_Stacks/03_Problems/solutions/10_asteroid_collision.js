/**
 * 10. Asteroid Collision   (LeetCode 735 — Medium)
 *
 * PROBLEM
 * Each integer is an asteroid: the absolute value is its size, the sign is its
 * direction (+ right, - left). All move at the same speed. When two collide,
 * the smaller explodes; equal sizes both explode. Two asteroids moving the same
 * direction never meet. Return the asteroids left after all collisions.
 *
 * EXAMPLES
 * Input: [5,10,-5]     Output: [5,10]     Explanation: 10 and -5 collide, -5 dies
 * Input: [8,-8]        Output: []         Explanation: equal, both explode
 * Input: [10,2,-5]     Output: [10]       Explanation: 2 dies to -5, then -5 dies to 10
 * Input: [-2,-1,1,2]   Output: [-2,-1,1,2]   Explanation: nobody ever meets
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can a value be 0? (no)
 * - Only a right-mover followed by a left-mover can collide? (yes: ">" then "<")
 *
 * APPROACH 1 — Brute force (simulate passes)   O(n^2) time, O(n) space
 * Scan for any adjacent pair (positive, negative), resolve it, and restart
 * from the beginning. Each pass removes at least one asteroid.
 *
 * APPROACH 2 — Optimal (stack)   O(n) time, O(n) space
 * Push right-movers. When a left-mover arrives, it fights the top of the
 * stack while the top is a right-mover:
 *   top smaller  -> pop, keep fighting
 *   top equal    -> pop, the left-mover dies too, stop
 *   top bigger   -> the left-mover dies, stop
 * If it survives all fights (stack empty or top is a left-mover), push it.
 * Each asteroid is pushed/popped at most once -> O(n).
 *
 * Dry run on [10,2,-5]:
 *   10  push        [10]
 *   2   push        [10,2]
 *   -5  top 2 < 5 -> pop        [10]
 *       top 10 > 5 -> -5 dies   [10]
 *   result [10]
 *
 * EDGE CASES
 * - all moving left, or all moving right -> unchanged
 * - a left-mover that destroys everything then lands at the bottom ([1,2,-3] -> [-3])
 * - equal sizes
 */

function bruteForce(asteroids) {
  const list = [...asteroids];
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i + 1 < list.length; i++) {
      if (list[i] > 0 && list[i + 1] < 0) {
        const right = list[i];
        const left = -list[i + 1];
        if (right === left) list.splice(i, 2);
        else if (right > left) list.splice(i + 1, 1);
        else list.splice(i, 1);
        changed = true;
        break; // restart scanning from the beginning
      }
    }
  }
  return list;
}

function optimal(asteroids) {
  const stack = [];
  for (const asteroid of asteroids) {
    let alive = true;
    // only a right-mover on top can collide with an incoming left-mover
    while (alive && asteroid < 0 && stack.length && stack[stack.length - 1] > 0) {
      const top = stack[stack.length - 1];
      if (top < -asteroid) {
        stack.pop();          // top dies, keep fighting
      } else if (top === -asteroid) {
        stack.pop();          // both die
        alive = false;
      } else {
        alive = false;        // incoming dies
      }
    }
    if (alive) stack.push(asteroid);
  }
  return stack;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([5, 10, -5]), [5, 10]);
  assert.deepStrictEqual(solve([8, -8]), []);
  assert.deepStrictEqual(solve([10, 2, -5]), [10]);
  assert.deepStrictEqual(solve([-2, -1, 1, 2]), [-2, -1, 1, 2]);
  assert.deepStrictEqual(solve([1, 2, -3]), [-3]);
  assert.deepStrictEqual(solve([-1]), [-1]);
  assert.deepStrictEqual(solve([]), []);
  assert.deepStrictEqual(solve([1, -2, -2, -2]), [-2, -2, -2]);
}
console.log('✓ 10-asteroid-collision passed');

module.exports = { optimal, bruteForce };

/**
 * 07. Sqrt(x)   (LeetCode 69 — Easy)
 *
 * PROBLEM
 * Given a non-negative integer x, return the square root of x rounded DOWN to an integer.
 * Do not use Math.sqrt or **.
 *
 * EXAMPLES
 * Input: 4    Output: 2
 * Input: 8    Output: 2    Explanation: sqrt(8) = 2.828..., round down
 * Input: 0    Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - x up to 2^31 - 1, so mid * mid can reach ~4.6e18: safe in JS (below 2^53), but overflows
 *   in 32/64-bit int languages, where you would compare mid <= x / mid instead.
 * - Round down, not nearest? (down)
 *
 * APPROACH 1 — Brute force (count up)   O(sqrt x) time, O(1) space
 * Try 1, 2, 3, ... while i * i <= x. The last i that fits is the answer. For x = 2^31
 * that is about 46,000 steps: fine, but we can do far better.
 *
 * APPROACH 2 — Optimal (binary search on the answer)   O(log x) time, O(1) space
 * The condition "mid * mid <= x" is true for all small mid and false for all large mid.
 * That monotonic shape is exactly what binary search needs. Search mid in [1, x/2]
 * (for x >= 2, sqrt(x) <= x/2). Keep the last mid that satisfied the condition.
 * This is a teaser for "binary search on the answer", see 10_Searching.
 *
 * Dry run on x = 8:
 *   low=1 high=4 mid=2: 4 <= 8 ok,  answer=2, low=3
 *   low=3 high=4 mid=3: 9 > 8 no,   high=2
 *   low=3 > high=2 stop -> 2
 *
 * EDGE CASES
 * - 0 and 1 -> themselves
 * - perfect square -> exact root (16 -> 4)
 * - 2^31 - 1 -> 46340
 */

function bruteForce(x) {
  let root = 0;
  while ((root + 1) * (root + 1) <= x) root++;
  return root;
}

function optimal(x) {
  if (x < 2) return x;
  let low = 1;
  let high = Math.floor(x / 2);
  let answer = 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (mid * mid <= x) {
      answer = mid;   // mid fits; remember it and look for a bigger one
      low = mid + 1;
    } else {
      high = mid - 1; // mid too big
    }
  }
  return answer;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve(4), 2);
  assert.strictEqual(solve(8), 2);
  assert.strictEqual(solve(0), 0);
  assert.strictEqual(solve(1), 1);
  assert.strictEqual(solve(2), 1);
  assert.strictEqual(solve(16), 4);
  assert.strictEqual(solve(99), 9);
  assert.strictEqual(solve(2147483647), 46340);
}
for (let x = 0; x < 3000; x++) assert.strictEqual(optimal(x), Math.floor(Math.sqrt(x)));
console.log('✓ 07-sqrt-x passed');

module.exports = { optimal, bruteForce };

/**
 * 01. Visible Sum to the Right   (Original — Medium)
 *
 * PROBLEM
 * Buildings stand in a row with heights `heights`. A person on top of building i looks to
 * the right. Their view is blocked by the first building j > i with
 * heights[j] >= heights[i]; they see every building strictly between i and j (or all
 * buildings to the end if nothing blocks). Return an array ans where ans[i] is the SUM
 * of heights of the buildings person i can see.
 *
 * EXAMPLES
 * Input: [5, 2, 3, 6, 1]   Output: [5, 0, 0, 1, 0]
 *        Explanation: from 5 you see 2 and 3 (blocked by 6); from 2 the 3 blocks at once;
 *                     from 6 you see 1; the last building sees nothing
 * Input: [1, 1, 1]         Output: [0, 0, 0]   Explanation: equal height blocks
 * Input: [3, 1, 2]         Output: [3, 0, 0]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Up to 10^5 buildings -> O(n^2) is too slow.
 * - Does an equal-height building block? (yes, >=)
 * - Heights positive integers; sums fit in a JS number.
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) extra space
 * For each i walk right adding heights until a building >= heights[i].
 *
 * APPROACH 2 — Optimal (monotonic stack for "next greater-or-equal" + prefix sums)   O(n) time, O(n) space
 * 1. next[i] = index of the first j > i with heights[j] >= heights[i] (or n). A stack of
 *    indices with strictly decreasing heights finds all of these in one pass: when a new
 *    building is >= the top, it is the blocker for the top, so pop and record.
 * 2. pre[x] = sum of heights[0..x-1]. Then ans[i] = pre[next[i]] - pre[i + 1].
 *
 * Dry run on [5, 2, 3, 6, 1]:
 *   j=0 h=5 stack [] -> push            stack [0]
 *   j=1 h=2 < 5 -> push                 stack [0,1]
 *   j=2 h=3 >= 2 pop 1 (next[1]=2); 3 < 5 push   stack [0,2]
 *   j=3 h=6 pop 2 (next[2]=3), pop 0 (next[0]=3) stack [3]
 *   j=4 h=1 push                        stack [3,4]; leftovers next=5
 *   pre = [0,5,7,10,16,17]
 *   ans[0] = pre[3]-pre[1] = 5, ans[1] = pre[2]-pre[2] = 0, ans[2] = 0,
 *   ans[3] = pre[5]-pre[4] = 1, ans[4] = 0
 *
 * EDGE CASES
 * - empty array -> []
 * - strictly increasing -> all zeros
 * - strictly decreasing -> each sees everything to its right
 *
 * COMMON MISTAKES
 * - Using > instead of >= when popping: equal heights would not block.
 * - Off-by-one in the prefix difference: the blocker itself is NOT seen.
 */

function bruteForce(heights) {
  return heights.map((h, i) => {
    let sum = 0;
    for (let j = i + 1; j < heights.length && heights[j] < h; j++) sum += heights[j];
    return sum;
  });
}

function optimal(heights) {
  const n = heights.length;
  const next = new Array(n).fill(n);
  const stack = [];
  for (let j = 0; j < n; j++) {
    while (stack.length && heights[j] >= heights[stack[stack.length - 1]]) next[stack.pop()] = j;
    stack.push(j);
  }
  const pre = [0];
  for (const h of heights) pre.push(pre[pre.length - 1] + h);
  return heights.map((_, i) => pre[next[i]] - pre[i + 1]);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([5, 2, 3, 6, 1]), [5, 0, 0, 1, 0]);
  assert.deepStrictEqual(solve([1, 1, 1]), [0, 0, 0]);
  assert.deepStrictEqual(solve([3, 1, 2]), [3, 0, 0]);
  assert.deepStrictEqual(solve([]), []);
  assert.deepStrictEqual(solve([4, 3, 2, 1]), [6, 3, 1, 0]);
  assert.deepStrictEqual(solve([1, 2, 3]), [0, 0, 0]);
}
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const rand = mulberry32(301);
for (let t = 0; t < 300; t++) {
  const h = Array.from({ length: Math.floor(rand() * 12) }, () => 1 + Math.floor(rand() * 6));
  assert.deepStrictEqual(optimal(h), bruteForce(h));
}
console.log('✓ set_03/01_visible_sum_right passed');
module.exports = { optimal, bruteForce };

/**
 * 05. Daily Temperatures   (LeetCode 739 — Medium)
 *
 * PROBLEM
 * Given an array of daily temperatures, return an array where answer[i] is the
 * number of days you have to wait after day i for a warmer temperature.
 * If no warmer day exists, answer[i] = 0.
 *
 * EXAMPLES
 * Input: [73,74,75,71,69,72,76,73]   Output: [1,1,4,2,1,1,0,0]
 * Input: [30,40,50,60]               Output: [1,1,1,0]
 * Input: [30,60,90]                  Output: [1,1,0]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - "Warmer" means strictly greater? (yes)
 * - Return distances in days (index difference), not the temperatures? (yes)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) extra space
 * For each day, scan forward until you find a warmer day. Worst case (decreasing
 * temperatures) scans the whole rest of the array for every day.
 *
 * APPROACH 2 — Optimal (monotonic decreasing stack of indices)   O(n) time, O(n) space
 * Walk left to right keeping a stack of indices whose temperatures are
 * DECREASING from bottom to top. These are the days still "waiting" for a
 * warmer day. When the current day is warmer than the top of the stack, that
 * day's wait is over: answer[top] = i - top. Pop and keep checking.
 * Each index is pushed once and popped at most once -> O(n).
 *
 * Dry run on [73,74,75,71,69,72,76,73]:
 *   i=0 73   push            stack [0]
 *   i=1 74   74>73 pop 0 ans[0]=1   push   stack [1]
 *   i=2 75   75>74 pop 1 ans[1]=1   push   stack [2]
 *   i=3 71   push            stack [2,3]
 *   i=4 69   push            stack [2,3,4]
 *   i=5 72   72>69 pop 4 ans[4]=1 ; 72>71 pop 3 ans[3]=2 ; 72<75 stop ; push   stack [2,5]
 *   i=6 76   pop 5 ans[5]=1 ; pop 2 ans[2]=4 ; push   stack [6]
 *   i=7 73   push            stack [6,7]
 *   leftover indices 6,7 stay 0.
 *
 * EDGE CASES
 * - strictly decreasing input -> all zeros
 * - equal temperatures are NOT warmer (use strict <)
 * - single element -> [0]
 */

function bruteForce(temperatures) {
  const n = temperatures.length;
  const answer = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (temperatures[j] > temperatures[i]) {
        answer[i] = j - i;
        break;
      }
    }
  }
  return answer;
}

function optimal(temperatures) {
  const n = temperatures.length;
  const answer = new Array(n).fill(0);
  const stack = []; // indices; temperatures decreasing from bottom to top

  for (let i = 0; i < n; i++) {
    // resolve every colder day waiting on the stack
    while (stack.length && temperatures[stack[stack.length - 1]] < temperatures[i]) {
      const waitingDay = stack.pop();
      answer[waitingDay] = i - waitingDay;
    }
    stack.push(i);
  }
  return answer;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([73, 74, 75, 71, 69, 72, 76, 73]), [1, 1, 4, 2, 1, 1, 0, 0]);
  assert.deepStrictEqual(solve([30, 40, 50, 60]), [1, 1, 1, 0]);
  assert.deepStrictEqual(solve([30, 60, 90]), [1, 1, 0]);
  assert.deepStrictEqual(solve([90, 80, 70]), [0, 0, 0]);
  assert.deepStrictEqual(solve([50, 50, 50]), [0, 0, 0]);
  assert.deepStrictEqual(solve([42]), [0]);
  assert.deepStrictEqual(solve([]), []);
}
console.log('✓ 05-daily-temperatures passed');

module.exports = { optimal, bruteForce };

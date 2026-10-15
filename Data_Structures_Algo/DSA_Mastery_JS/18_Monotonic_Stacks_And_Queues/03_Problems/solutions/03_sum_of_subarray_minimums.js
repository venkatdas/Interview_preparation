/**
 * 03. Sum of Subarray Minimums   (LeetCode 907 — Medium)
 *
 * PROBLEM
 * Return the sum of min(b) over every contiguous subarray b of arr, modulo 1e9+7.
 *
 * EXAMPLES
 * Input: [3,1,2,4]   Output: 17
 *   subarrays: [3],[1],[2],[4],[3,1],[1,2],[2,4],[3,1,2],[1,2,4],[3,1,2,4]
 *   mins:       3   1   2   4    1     1     2      1       1        1     -> 17
 * Input: [11,81,94,43,3]   Output: 444
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 3 * 10^4 -> O(n^2) is borderline; O(n) expected
 * - Values positive, up to 3 * 10^4; answer mod 1e9+7
 * - Duplicates: each subarray must be counted exactly once
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * For every start, extend the end while tracking the running min; add it each step.
 *
 * APPROACH 2 — Optimal (Contribution technique with previous/next smaller)   O(n) time, O(n) space
 * Flip the question: instead of "min of each subarray", ask "for each element, how many
 * subarrays is it the minimum of?" Element arr[i] is the min of every subarray that
 *   starts in (prevSmaller[i], i]  and ends in [i, nextSmaller[i])
 * so it contributes arr[i] * (i - prevSmaller[i]) * (nextSmaller[i] - i).
 * Duplicates: use STRICT "<" on one side and "<=" on the other so a subarray with two equal
 * minimums is credited to exactly one of them (here: left uses <, right uses <=).
 *
 * Dry run on [3,1,2,4]:
 *   prevSmaller (strict <):   [-1, -1, 1, 2]
 *   nextSmallerOrEqual:       [ 1,  4, 4, 4]
 *   i=0: 3 * (0-(-1)) * (1-0) = 3 * 1 * 1 = 3
 *   i=1: 1 * (1-(-1)) * (4-1) = 1 * 2 * 3 = 6
 *   i=2: 2 * (2-1) * (4-2)    = 2 * 1 * 2 = 4
 *   i=3: 4 * (3-2) * (4-3)    = 4 * 1 * 1 = 4
 *   total 17
 *
 * EDGE CASES
 * - single element -> itself
 * - all equal [2,2,2] -> 2 * 6 subarrays = 12 (duplicate handling must be right)
 * - strictly increasing / decreasing
 */

const MOD = 1_000_000_007;

function bruteForce(arr) {
  let total = 0;
  for (let i = 0; i < arr.length; i++) {
    let minSoFar = Infinity;
    for (let j = i; j < arr.length; j++) {
      minSoFar = Math.min(minSoFar, arr[j]);
      total = (total + minSoFar) % MOD;
    }
  }
  return total;
}

function optimal(arr) {
  const n = arr.length;
  const prevSmaller = new Array(n).fill(-1);      // nearest left index with value <  arr[i]
  const nextSmallerEq = new Array(n).fill(n);     // nearest right index with value <= arr[i]
  const stack = [];
  for (let i = 0; i < n; i++) {
    // pop everything >= arr[i]: those popped elements have found their "next smaller-or-equal"
    while (stack.length && arr[stack[stack.length - 1]] >= arr[i]) {
      nextSmallerEq[stack.pop()] = i;
    }
    prevSmaller[i] = stack.length ? stack[stack.length - 1] : -1;   // what remains is strictly smaller
    stack.push(i);
  }
  let total = 0;
  for (let i = 0; i < n; i++) {
    const leftChoices = i - prevSmaller[i];
    const rightChoices = nextSmallerEq[i] - i;
    total = (total + arr[i] * leftChoices * rightChoices) % MOD;
  }
  return total;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([3, 1, 2, 4]), 17);
  assert.strictEqual(solve([11, 81, 94, 43, 3]), 444);
  assert.strictEqual(solve([5]), 5);
  assert.strictEqual(solve([2, 2, 2]), 12);
  assert.strictEqual(solve([1, 2, 3]), 10);
  assert.strictEqual(solve([3, 2, 1]), 10);
}
for (let trial = 0; trial < 200; trial++) {
  const n = 1 + Math.floor(Math.random() * 12);
  const arr = Array.from({ length: n }, () => 1 + Math.floor(Math.random() * 5));
  assert.strictEqual(optimal(arr), bruteForce(arr));
}
console.log('✓ 03-sum-of-subarray-minimums passed');

module.exports = { optimal, bruteForce };

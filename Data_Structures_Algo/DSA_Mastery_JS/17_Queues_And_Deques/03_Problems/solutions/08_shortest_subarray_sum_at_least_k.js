/**
 * 08. Shortest Subarray with Sum at Least K   (LeetCode 862 — Hard)
 *
 * PROBLEM
 * Given an integer array nums (may contain NEGATIVES) and an integer k,
 * return the length of the shortest non-empty contiguous subarray whose sum
 * is at least k. Return -1 if none exists.
 *
 * EXAMPLES
 * Input: nums = [1], k = 1             Output: 1
 * Input: nums = [1,2], k = 4           Output: -1
 * Input: nums = [2,-1,2], k = 3        Output: 3
 * Input: nums = [84,-37,32,40,95], k = 167   Output: 3   Explanation: 32+40+95
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Negatives allowed? (yes - that's what breaks the simple sliding window:
 *   growing the window can DECREASE the sum)
 * - k positive? (yes)
 *
 * APPROACH 1 — Brute force (prefix sums, all pairs)   O(n^2) time, O(n) space
 * prefix[i] = sum of nums[0..i-1]. Subarray (i, j] has sum prefix[j] - prefix[i].
 * Try every pair i < j, keep the shortest with sum >= k.
 *
 * APPROACH 2 — Optimal (monotonic increasing deque of prefix indices)   O(n) time, O(n) space
 * We want, for each j, the LARGEST i < j with prefix[j] - prefix[i] >= k.
 * Walk j left to right, keeping a deque of candidate start indices i with
 * prefix values INCREASING from front to back. Two pruning rules:
 *   (a) while prefix[j] - prefix[front] >= k: record j - front, pop FRONT.
 *       (front is the earliest start; once it works for this j, any later j
 *        would give a longer subarray, so we never need front again)
 *   (b) while prefix[back] >= prefix[j]: pop BACK.
 *       (j is a later start with a smaller-or-equal prefix: strictly better
 *        than back for every future end, so back is useless)
 *   then push j.
 * Each index enters and leaves the deque once -> O(n).
 *
 * Dry run on [2,-1,2], k=3:  prefix = [0,2,1,3]
 *   j=0 p=0   deque [0]
 *   j=1 p=2   (a) 2-0<3 no ; (b) 0>=2 no ; deque [0,1]
 *   j=2 p=1   (a) 1-0<3 no ; (b) prefix[1]=2>=1 pop ; deque [0,2]
 *   j=3 p=3   (a) 3-0>=3 -> length 3, pop front ; 3-1<3 stop ; (b) no ; deque [2,3]
 *   answer 3
 *
 * EDGE CASES
 * - single element >= k -> 1
 * - no valid subarray -> -1
 * - negatives that make a later, shorter window possible (84,-37,32,40,95)
 */

function bruteForce(nums, k) {
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];

  let best = Infinity;
  for (let start = 0; start < n; start++) {
    for (let end = start + 1; end <= n; end++) {
      if (prefix[end] - prefix[start] >= k) {
        best = Math.min(best, end - start);
        break; // longer subarrays from this start can't be shorter
      }
    }
  }
  return best === Infinity ? -1 : best;
}

function optimal(nums, k) {
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];

  const deque = []; // indices into prefix; prefix values increasing front -> back
  let front = 0;
  let best = Infinity;

  for (let j = 0; j <= n; j++) {
    // (a) the earliest candidate start already satisfies k: record and retire it
    while (front < deque.length && prefix[j] - prefix[deque[front]] >= k) {
      best = Math.min(best, j - deque[front]);
      front++;
    }
    // (b) j is a better start than any back with a larger-or-equal prefix
    while (front < deque.length && prefix[deque[deque.length - 1]] >= prefix[j]) {
      deque.pop();
    }
    deque.push(j);
  }
  return best === Infinity ? -1 : best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1], 1), 1);
  assert.strictEqual(solve([1, 2], 4), -1);
  assert.strictEqual(solve([2, -1, 2], 3), 3);
  assert.strictEqual(solve([84, -37, 32, 40, 95], 167), 3);
  assert.strictEqual(solve([-28, 81, -20, 28, -29], 89), 3);
  assert.strictEqual(solve([5, 5, 5], 5), 1);
  assert.strictEqual(solve([-1, -2, -3], 1), -1);
  assert.strictEqual(solve([1, 2, 3, 4, 5], 11), 3);
}
console.log('✓ 08-shortest-subarray-sum-at-least-k passed');

module.exports = { optimal, bruteForce };

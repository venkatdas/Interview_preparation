/**
 * Sliding-window templates in JavaScript (runnable).
 *
 * 1. fixedWindow        - window of exactly k: max sum of k consecutive elements
 * 2. variableWindowMax  - grow right, shrink left while INVALID; answer = longest valid window
 * 3. variableWindowMin  - grow right, shrink left while VALID; answer = shortest valid window
 * 4. atMostK            - count subarrays with at most K distinct; exactly K = atMost(K) - atMost(K-1)
 * 5. monotonicDequeMax  - max of every window of size k in O(n) (deque of indices)
 *
 * The window is always nums[left..right] (both inclusive). Its size is right - left + 1.
 */

// ---------- 1. Fixed-size window ----------
// Add the element entering on the right, remove the element leaving on the left.
function fixedWindow(nums, k) {
  if (nums.length < k || k === 0) return 0;
  let windowSum = 0;
  for (let i = 0; i < k; i++) windowSum += nums[i]; // first window
  let best = windowSum;

  for (let right = k; right < nums.length; right++) {
    windowSum += nums[right] - nums[right - k]; // slide by one: add new, drop old
    best = Math.max(best, windowSum);
  }
  return best;
}

// ---------- 2. Variable window, LONGEST valid ----------
// Example condition: window contains at most `maxDistinct` distinct values.
// Shrink only while the window is INVALID; after that, the window is a candidate.
function variableWindowMax(nums, maxDistinct) {
  const counts = new Map();
  let left = 0;
  let best = 0;

  for (let right = 0; right < nums.length; right++) {
    counts.set(nums[right], (counts.get(nums[right]) ?? 0) + 1); // expand

    while (counts.size > maxDistinct) {                           // invalid -> shrink
      const leaving = nums[left];
      counts.set(leaving, counts.get(leaving) - 1);
      if (counts.get(leaving) === 0) counts.delete(leaving);
      left++;
    }
    best = Math.max(best, right - left + 1);                       // valid window
  }
  return best;
}

// ---------- 3. Variable window, SHORTEST valid ----------
// Example condition: window sum >= target (positive numbers only).
// Shrink while the window is still VALID, recording each valid size.
function variableWindowMin(nums, target) {
  let windowSum = 0;
  let left = 0;
  let best = Infinity;

  for (let right = 0; right < nums.length; right++) {
    windowSum += nums[right];                     // expand

    while (windowSum >= target) {                 // valid -> record, then try to shrink
      best = Math.min(best, right - left + 1);
      windowSum -= nums[left];
      left++;
    }
  }
  return best === Infinity ? 0 : best;
}

// ---------- 4. "At most K" counting trick ----------
// Number of subarrays with at most k distinct values. Every valid window ending at
// `right` contributes (right - left + 1) subarrays (all the ones ending at right).
function atMostK(nums, k) {
  if (k < 0) return 0; // no window can have a negative number of distinct values (also stops exactlyK(nums, 0) from looping forever)
  const counts = new Map();
  let left = 0;
  let total = 0;

  for (let right = 0; right < nums.length; right++) {
    counts.set(nums[right], (counts.get(nums[right]) ?? 0) + 1);
    while (counts.size > k) {
      counts.set(nums[left], counts.get(nums[left]) - 1);
      if (counts.get(nums[left]) === 0) counts.delete(nums[left]);
      left++;
    }
    total += right - left + 1;
  }
  return total;
}

function exactlyK(nums, k) {
  return atMostK(nums, k) - atMostK(nums, k - 1);
}

// ---------- 5. Monotonic deque: max of each window of size k ----------
// Deque holds INDICES whose values are decreasing front -> back.
// Front is always the max of the current window.
function monotonicDequeMax(nums, k) {
  const result = [];
  const deque = []; // we use an array; shift() is O(n) in theory but fine for learning.
  // For a true O(1) deque see 17_Queues_And_Deques (head-index trick is shown below in a comment).

  for (let right = 0; right < nums.length; right++) {
    // 1. drop indices that fell out of the window on the left
    if (deque.length && deque[0] <= right - k) deque.shift();
    // 2. drop smaller values from the back: they can never be a max while nums[right] is around
    while (deque.length && nums[deque[deque.length - 1]] <= nums[right]) deque.pop();
    deque.push(right);
    // 3. once the first full window exists, the front is its max
    if (right >= k - 1) result.push(nums[deque[0]]);
  }
  return result;
}

// ---------- self-test ----------
const assert = require('assert');

assert.strictEqual(fixedWindow([2, 1, 5, 1, 3, 2], 3), 9);
assert.strictEqual(fixedWindow([1, 2], 3), 0);
assert.strictEqual(fixedWindow([5], 1), 5);

assert.strictEqual(variableWindowMax([1, 2, 1, 2, 3], 2), 4);
assert.strictEqual(variableWindowMax([1, 2, 3, 4], 1), 1);
assert.strictEqual(variableWindowMax([], 2), 0);

assert.strictEqual(variableWindowMin([2, 3, 1, 2, 4, 3], 7), 2);
assert.strictEqual(variableWindowMin([1, 1, 1], 10), 0);
assert.strictEqual(variableWindowMin([10], 7), 1);

assert.strictEqual(atMostK([1, 2, 1, 2, 3], 2), 12);
assert.strictEqual(exactlyK([1, 2, 1, 2, 3], 2), 7);
assert.strictEqual(exactlyK([1, 2, 1, 3, 4], 3), 3);

assert.deepStrictEqual(monotonicDequeMax([1, 3, -1, -3, 5, 3, 6, 7], 3), [3, 3, 5, 5, 6, 7]);
assert.deepStrictEqual(monotonicDequeMax([1], 1), [1]);
assert.deepStrictEqual(monotonicDequeMax([4, 3, 2, 1], 2), [4, 3, 2]);

console.log('✓ sliding-window-templates.js self-test passed');

module.exports = { fixedWindow, variableWindowMax, variableWindowMin, atMostK, exactlyK, monotonicDequeMax };

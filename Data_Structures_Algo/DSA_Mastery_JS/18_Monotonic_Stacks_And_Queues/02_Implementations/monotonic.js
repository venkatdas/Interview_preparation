/**
 * Monotonic stack & monotonic deque helpers in JavaScript.
 *
 * "Monotonic" = the values stored (bottom -> top, or front -> back) are always sorted.
 * We keep that invariant by popping anything that would break it BEFORE pushing. Each
 * index is pushed once and popped at most once, so every function here is O(n).
 *
 * Stack helpers (return INDEX arrays, -1 / n when there is no such element):
 *   previousSmaller(nums, strict)  index of the nearest element to the LEFT that is smaller
 *   nextSmaller(nums, strict)      index of the nearest element to the RIGHT that is smaller
 *   previousGreater(nums, strict)
 *   nextGreater(nums, strict)
 *     strict = true  -> "smaller" means <  (equal elements do NOT count)
 *     strict = false -> "smaller" means <= (equal elements DO count)
 *
 * Deque helpers:
 *   slidingWindowMax(nums, k), slidingWindowMin(nums, k)
 *     deque stores indices, implemented as an array + head pointer so that removing from
 *     the front is O(1) (Array.shift() is O(n)).
 *
 * Histogram:
 *   largestRectangleArea(heights) using one pass with a sentinel.
 */

// Generic "nearest element to one side satisfying a comparison".
// `keep(stackTopValue, current)` returns true when the stack top must be POPPED.
function nearest(nums, fromLeft, shouldPop) {
  const n = nums.length;
  const result = new Array(n).fill(fromLeft ? -1 : n);
  const stack = []; // indices
  const order = fromLeft
    ? Array.from({ length: n }, (_, i) => i)
    : Array.from({ length: n }, (_, i) => n - 1 - i);
  for (const i of order) {
    while (stack.length && shouldPop(nums[stack[stack.length - 1]], nums[i])) stack.pop();
    if (stack.length) result[i] = stack[stack.length - 1];
    stack.push(i);
  }
  return result;
}

// nearest to the left with value < current (strict) or <= current (non-strict)
function previousSmaller(nums, strict = true) {
  // pop while top is NOT smaller than current: top >= cur (strict) / top > cur (non-strict)
  return nearest(nums, true, strict ? (top, cur) => top >= cur : (top, cur) => top > cur);
}

function nextSmaller(nums, strict = true) {
  return nearest(nums, false, strict ? (top, cur) => top >= cur : (top, cur) => top > cur);
}

function previousGreater(nums, strict = true) {
  return nearest(nums, true, strict ? (top, cur) => top <= cur : (top, cur) => top < cur);
}

function nextGreater(nums, strict = true) {
  return nearest(nums, false, strict ? (top, cur) => top <= cur : (top, cur) => top < cur);
}

// Sliding window max: deque of indices whose values are DECREASING front -> back.
// Front is always the max of the current window.
function slidingWindowMax(nums, k) {
  const result = [];
  const deque = [];      // indices
  let head = 0;          // deque[head] is the logical front
  for (let i = 0; i < nums.length; i++) {
    // 1. drop indices that fell out of the window
    if (head < deque.length && deque[head] <= i - k) head++;
    // 2. drop smaller values from the back: they can never be the max again
    while (deque.length > head && nums[deque[deque.length - 1]] <= nums[i]) deque.pop();
    deque.push(i);
    // 3. window is complete
    if (i >= k - 1) result.push(nums[deque[head]]);
  }
  return result;
}

function slidingWindowMin(nums, k) {
  const result = [];
  const deque = [];
  let head = 0;
  for (let i = 0; i < nums.length; i++) {
    if (head < deque.length && deque[head] <= i - k) head++;
    while (deque.length > head && nums[deque[deque.length - 1]] >= nums[i]) deque.pop();
    deque.push(i);
    if (i >= k - 1) result.push(nums[deque[head]]);
  }
  return result;
}

// Largest rectangle in a histogram, one pass. A bar is "resolved" when we meet a lower
// bar to its right: its width spans from the previous lower bar + 1 to the current index - 1.
function largestRectangleArea(heights) {
  const stack = []; // indices with increasing heights
  let best = 0;
  for (let i = 0; i <= heights.length; i++) {
    const current = i === heights.length ? 0 : heights[i];   // sentinel 0 flushes the stack
    while (stack.length && heights[stack[stack.length - 1]] >= current) {
      const height = heights[stack.pop()];
      const left = stack.length ? stack[stack.length - 1] : -1;
      best = Math.max(best, height * (i - left - 1));
    }
    stack.push(i);
  }
  return best;
}

// ---------- self-test ----------
const assert = require('assert');

function randomInt(lo, hi) {
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}

// brute force references
function bruteNearest(nums, i, fromLeft, test) {
  if (fromLeft) {
    for (let j = i - 1; j >= 0; j--) if (test(nums[j], nums[i])) return j;
    return -1;
  }
  for (let j = i + 1; j < nums.length; j++) if (test(nums[j], nums[i])) return j;
  return nums.length;
}
function bruteWindow(nums, k, pick) {
  const out = [];
  for (let s = 0; s + k <= nums.length; s++) out.push(pick(...nums.slice(s, s + k)));
  return out;
}
function bruteHistogram(heights) {
  let best = 0;
  for (let i = 0; i < heights.length; i++) {
    let minH = Infinity;
    for (let j = i; j < heights.length; j++) {
      minH = Math.min(minH, heights[j]);
      best = Math.max(best, minH * (j - i + 1));
    }
  }
  return best;
}

for (let trial = 0; trial < 100; trial++) {
  const n = randomInt(0, 20);
  const nums = Array.from({ length: n }, () => randomInt(0, 6)); // small range -> many duplicates
  const checks = [
    [previousSmaller(nums, true), true, (other, cur) => other < cur],
    [previousSmaller(nums, false), true, (other, cur) => other <= cur],
    [nextSmaller(nums, true), false, (other, cur) => other < cur],
    [nextSmaller(nums, false), false, (other, cur) => other <= cur],
    [previousGreater(nums, true), true, (other, cur) => other > cur],
    [previousGreater(nums, false), true, (other, cur) => other >= cur],
    [nextGreater(nums, true), false, (other, cur) => other > cur],
    [nextGreater(nums, false), false, (other, cur) => other >= cur],
  ];
  for (const [got, fromLeft, test] of checks) {
    const expected = nums.map((_, i) => bruteNearest(nums, i, fromLeft, test));
    assert.deepStrictEqual(got, expected);
  }
  if (n > 0) {
    const k = randomInt(1, n);
    assert.deepStrictEqual(slidingWindowMax(nums, k), bruteWindow(nums, k, Math.max));
    assert.deepStrictEqual(slidingWindowMin(nums, k), bruteWindow(nums, k, Math.min));
  }
  assert.strictEqual(largestRectangleArea(nums), bruteHistogram(nums));
}

assert.deepStrictEqual(nextGreater([2, 1, 2, 4, 3]), [3, 2, 3, 5, 5]);
assert.deepStrictEqual(previousSmaller([3, 1, 4, 1, 5]), [-1, -1, 1, -1, 3]);
assert.deepStrictEqual(slidingWindowMax([1, 3, -1, -3, 5, 3, 6, 7], 3), [3, 3, 5, 5, 6, 7]);
assert.strictEqual(largestRectangleArea([2, 1, 5, 6, 2, 3]), 10);
assert.strictEqual(largestRectangleArea([]), 0);

console.log('✓ monotonic.js self-test passed');

module.exports = {
  previousSmaller,
  nextSmaller,
  previousGreater,
  nextGreater,
  slidingWindowMax,
  slidingWindowMin,
  largestRectangleArea,
};

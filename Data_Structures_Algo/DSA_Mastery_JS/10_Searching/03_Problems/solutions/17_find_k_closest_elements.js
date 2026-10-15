/**
 * 17. Find K Closest Elements   (LeetCode 658 — Medium)
 *
 * PROBLEM
 * Given a sorted array, an integer k and a value x, return the k elements closest to x,
 * sorted ascending. Ties: the smaller element wins (|a - x| === |b - x| and a < b -> a).
 *
 * EXAMPLES
 * Input: arr = [1,2,3,4,5], k = 4, x = 3    Output: [1,2,3,4]
 * Input: arr = [1,2,3,4,5], k = 4, x = -1   Output: [1,2,3,4]
 * Input: arr = [1,1,2,3,4,5], k = 4, x = 4  Output: [2,3,4,5]   (|5-4|=1 beats |1-4|=3)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Sorted ascending, 1 <= k <= n
 * - x may be outside the array's range
 * - Output must be sorted (so the answer is a contiguous window of the array!)
 *
 * APPROACH 1 — Brute force (sort by distance)   O(n log n)
 * Sort a copy by (|v - x|, v), take the first k, sort those ascending.
 *
 * APPROACH 2 — Optimal (binary search the window's left edge)   O(log(n - k) + k) time, O(1) extra
 * Because the output is sorted and comes from a sorted array, it is a window
 * arr[left..left+k-1]. Binary search `left` over [0, n - k]. For a candidate left,
 * compare the element just outside on the left (arr[mid]) with the element just outside
 * on the right (arr[mid + k]):
 *   if x - arr[mid] > arr[mid + k] - x  -> the right element is closer: window should shift right (lo = mid + 1)
 *   else                                -> keep or move left (hi = mid)
 * The subtraction form (not Math.abs) handles ties correctly: when equal, we prefer the
 * smaller elements, i.e. we do NOT shift right.
 *
 * Dry run arr=[1,2,3,4,5], k=4, x=3: lo=0 hi=1
 *   mid=0: x - arr[0] = 2, arr[4] - x = 2 -> not greater -> hi=0
 *   lo === hi === 0 -> [1,2,3,4]
 *
 * EDGE CASES
 * - k === n -> whole array
 * - x smaller than all -> first k; larger than all -> last k
 * - duplicates and ties
 */

function bruteForce(arr, k, x) {
  return [...arr]
    .sort((a, b) => Math.abs(a - x) - Math.abs(b - x) || a - b)
    .slice(0, k)
    .sort((a, b) => a - b);
}

function optimal(arr, k, x) {
  let lo = 0, hi = arr.length - k;             // possible window starts
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    // compare the candidate window's left neighbour-in with the element just past its right edge
    if (x - arr[mid] > arr[mid + k] - x) lo = mid + 1;   // right side is closer: shift window right
    else hi = mid;                                        // left is closer or tie: keep smaller elements
  }
  return arr.slice(lo, lo + k);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([1, 2, 3, 4, 5], 4, 3), [1, 2, 3, 4]);
  assert.deepStrictEqual(solve([1, 2, 3, 4, 5], 4, -1), [1, 2, 3, 4]);
  assert.deepStrictEqual(solve([1, 1, 2, 3, 4, 5], 4, 4), [2, 3, 4, 5]);
  assert.deepStrictEqual(solve([1, 2, 3, 4, 5], 5, 3), [1, 2, 3, 4, 5]);
  assert.deepStrictEqual(solve([1, 2, 3, 4, 5], 2, 100), [4, 5]);
  assert.deepStrictEqual(solve([1], 1, 0), [1]);
  assert.deepStrictEqual(solve([0, 0, 1, 2, 3, 3, 4, 7, 7, 8], 3, 5), [3, 3, 4]);
  assert.deepStrictEqual(solve([-5, -2, 0, 3], 2, -1), [-2, 0]);
}
for (let trial = 0; trial < 300; trial++) {
  const arr = Array.from({ length: 1 + Math.floor(Math.random() * 12) }, () => Math.floor(Math.random() * 20) - 5).sort((a, b) => a - b);
  const k = 1 + Math.floor(Math.random() * arr.length);
  const x = Math.floor(Math.random() * 30) - 10;
  assert.deepStrictEqual(optimal(arr, k, x), bruteForce(arr, k, x), JSON.stringify([arr, k, x]));
}
console.log('✓ 17-find-k-closest-elements passed');

module.exports = { optimal, bruteForce };

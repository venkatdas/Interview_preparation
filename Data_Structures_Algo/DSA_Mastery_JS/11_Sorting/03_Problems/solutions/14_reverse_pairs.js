/**
 * 14. Reverse Pairs   (LeetCode 493 — Hard)
 *
 * PROBLEM
 * Count the pairs (i, j) with i < j and nums[i] > 2 * nums[j].
 *
 * EXAMPLES
 * Input: [1,3,2,3,1]   Output: 2   ((3,1) at indices 1,4 and (3,1) at indices 3,4)
 * Input: [2,4,3,5,1]   Output: 3   ((4,1), (3,1), (5,1))
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n <= 5 * 10^4, values up to 2^31 - 1 (2 * nums[j] can exceed 32-bit; JS doubles are fine)
 * - Negative numbers? (yes, 2 * negative is still comparable)
 *
 * APPROACH 1 — Brute force   O(n^2) time
 * Check every pair i < j.
 *
 * APPROACH 2 — Optimal (merge sort with a SEPARATE counting pass)   O(n log n) time, O(n) space
 * Same framework as Count of Smaller Numbers After Self, with one twist: the condition
 * nums[i] > 2 * nums[j] is NOT the same as the merge order comparison nums[i] > nums[j],
 * so we cannot count while merging. Instead, before merging two sorted halves, do a
 * dedicated two-pointer pass: for each left element (ascending), advance a pointer j
 * over the right half while left[i] > 2 * right[j]; everything before j pairs with
 * left[i]. Because both halves are sorted, j never moves backwards -> O(n) per level.
 * Then merge normally.
 *
 * Dry run [1,3,2,3,1]:
 *   split [1,3] [2,3,1]
 *   [1,3] -> sorted, count pass between [1] and [3]: 1 > 6? no -> 0
 *   [2,3,1] -> [2] | [3,1]:  [3,1]: 3 > 2*1 = 2? yes -> count 1, merge -> [1,3]
 *              [2] vs [1,3]: 2 > 2? no -> 0, merge -> [1,2,3]
 *   top: [1,3] vs [1,2,3]: 1 > 2? no; 3 > 2*1 = 2 yes j=1; 3 > 4? no -> count 1
 *   total 0 + 1 + 0 + 1 = 2
 *
 * EDGE CASES
 * - [] and single element -> 0
 * - sorted ascending -> 0
 * - negatives: [-5, -3] -> is -5 > -6? yes -> 1  (double of a negative gets smaller)
 * - large values near 2^31: 2 * value does not overflow in JS
 */

function bruteForce(nums) {
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) if (nums[i] > 2 * nums[j]) count++;
  }
  return count;
}

function optimal(nums) {
  const arr = [...nums];
  const buffer = new Array(arr.length);

  function sort(lo, hi) {
    if (hi - lo < 1) return 0;
    const mid = (lo + hi) >> 1;
    let count = sort(lo, mid) + sort(mid + 1, hi);

    // counting pass: both halves are sorted ascending
    let j = mid + 1;
    for (let i = lo; i <= mid; i++) {
      while (j <= hi && arr[i] > 2 * arr[j]) j++;   // j only moves forward
      count += j - (mid + 1);                       // right elements [mid+1, j) all qualify
    }

    // standard merge
    let a = lo, b = mid + 1, k = lo;
    while (a <= mid && b <= hi) buffer[k++] = arr[a] <= arr[b] ? arr[a++] : arr[b++];
    while (a <= mid) buffer[k++] = arr[a++];
    while (b <= hi) buffer[k++] = arr[b++];
    for (let t = lo; t <= hi; t++) arr[t] = buffer[t];

    return count;
  }

  return sort(0, arr.length - 1);
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 3, 2, 3, 1]), 2);
  assert.strictEqual(solve([2, 4, 3, 5, 1]), 3);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([1]), 0);
  assert.strictEqual(solve([1, 2, 3, 4]), 0);
  assert.strictEqual(solve([-5, -3]), 1);
  assert.strictEqual(solve([5, 4, 3, 2, 1]), 4);
  assert.strictEqual(solve([2147483647, 2147483647, -2147483647]), 2);
}
for (let trial = 0; trial < 300; trial++) {
  const input = Array.from({ length: Math.floor(Math.random() * 25) }, () => Math.floor(Math.random() * 41) - 20);
  assert.strictEqual(optimal(input), bruteForce(input), JSON.stringify(input));
}
console.log('✓ 14-reverse-pairs passed');

module.exports = { optimal, bruteForce };

/**
 * 01. Sort an Array   (LeetCode 912 — Medium)
 *
 * PROBLEM
 * Given an array of integers, return it sorted in ascending order WITHOUT using
 * built-in sort, in O(n log n) time and with as little extra space as possible.
 *
 * EXAMPLES
 * Input: [5,2,3,1]       Output: [1,2,3,5]
 * Input: [5,1,1,2,0,0]   Output: [0,0,1,1,2,5]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n <= 5 * 10^4, values in [-5 * 10^4, 5 * 10^4]  (small range: counting sort also works!)
 * - Duplicates? (yes) Negatives? (yes)
 * - Must it be stable? (not for plain integers)
 *
 * APPROACH 1 — Brute force (insertion sort)   O(n^2) time, O(1) space
 * For each element, slide it left into the sorted prefix. Times out on 5 * 10^4
 * elements in the worst case, but it is the simplest correct sort.
 *
 * APPROACH 2 — Optimal (merge sort; quick sort shown too)   O(n log n) time, O(n) space
 * Merge sort: split in half, sort halves recursively, merge two sorted halves in O(n).
 * Recursion depth is log n, so no stack issues. Quick sort with a random pivot is
 * O(n log n) average and in-place; both are provided.
 *
 * Dry run merge sort on [5,2,3,1]:
 *   split -> [5,2] and [3,1]
 *   [5,2] -> [5],[2] -> merge -> [2,5]
 *   [3,1] -> [3],[1] -> merge -> [1,3]
 *   merge [2,5] and [1,3]: 1 < 2 take 1; 2 < 3 take 2; 3 < 5 take 3; leftover 5 -> [1,2,3,5]
 *
 * EDGE CASES
 * - [] and [x]
 * - all equal values (quick sort without random pivot / three-way would be slow)
 * - already sorted / reverse sorted
 */

function bruteForce(nums) {
  const arr = [...nums];
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) { arr[j + 1] = arr[j]; j--; }
    arr[j + 1] = key;
  }
  return arr;
}

function optimal(nums) {
  return mergeSort(nums);
}

function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = arr.length >> 1;
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  const merged = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) merged.push(left[i++]);  // <= keeps it stable
    else merged.push(right[j++]);
  }
  while (i < left.length) merged.push(left[i++]);
  while (j < right.length) merged.push(right[j++]);
  return merged;
}

// alternative: in-place quick sort with random pivot
function quickSortSolution(nums) {
  const arr = [...nums];
  function sort(lo, hi) {
    if (lo >= hi) return;
    const randomIndex = lo + Math.floor(Math.random() * (hi - lo + 1));
    [arr[randomIndex], arr[hi]] = [arr[hi], arr[randomIndex]];
    const pivot = arr[hi];
    let store = lo;
    for (let k = lo; k < hi; k++) {
      if (arr[k] < pivot) { [arr[k], arr[store]] = [arr[store], arr[k]]; store++; }
    }
    [arr[store], arr[hi]] = [arr[hi], arr[store]];
    sort(lo, store - 1);
    sort(store + 1, hi);
  }
  sort(0, arr.length - 1);
  return arr;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal, quickSortSolution]) {
  assert.deepStrictEqual(solve([5, 2, 3, 1]), [1, 2, 3, 5]);
  assert.deepStrictEqual(solve([5, 1, 1, 2, 0, 0]), [0, 0, 1, 1, 2, 5]);
  assert.deepStrictEqual(solve([]), []);
  assert.deepStrictEqual(solve([7]), [7]);
  assert.deepStrictEqual(solve([-3, -1, -2]), [-3, -2, -1]);
  assert.deepStrictEqual(solve([4, 4, 4, 4]), [4, 4, 4, 4]);
  assert.deepStrictEqual(solve([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  assert.deepStrictEqual(solve([5, 4, 3, 2, 1]), [1, 2, 3, 4, 5]);
}
const big = Array.from({ length: 50000 }, () => Math.floor(Math.random() * 100001) - 50000);
assert.deepStrictEqual(optimal(big), [...big].sort((a, b) => a - b));
assert.deepStrictEqual(quickSortSolution(big), [...big].sort((a, b) => a - b));
console.log('✓ 01-sort-an-array passed');

module.exports = { optimal, bruteForce, quickSortSolution };

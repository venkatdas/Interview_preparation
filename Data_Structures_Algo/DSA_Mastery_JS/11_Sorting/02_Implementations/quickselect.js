/**
 * Quickselect: find the k-th smallest element (0-based k) in O(n) average time.
 *
 * Idea: run quick sort's partition step, but only recurse into the ONE side that
 * contains index k. Each step throws away a fraction of the array, so the total
 * work is n + n/2 + n/4 + ... = O(n) on average. Worst case O(n^2) with bad
 * pivots, which a random pivot makes very unlikely.
 *
 *   quickselect([7, 2, 9, 4, 1], k=2)   -> 4   (sorted: 1 2 4 7 9, index 2)
 *
 *   partition with pivot 4:  [2, 1, | 4 | 7, 9]   pivot lands at index 2 === k -> done
 *   if pivot had landed at 3: answer is on the left  -> search [lo, 2]
 *   if pivot had landed at 1: answer is on the right -> search [2, hi]
 *
 * Mutates the array it is given (pass a copy if you need the original).
 *
 * Also included: a THREE-WAY partition version (Dutch national flag) that stays
 * O(n) even when the array is full of duplicates. Lomuto degrades to O(n^2) on
 * [5,5,5,5,...] because every element equals the pivot and goes to one side.
 */

function swap(arr, i, j) {
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}

// Lomuto partition with a random pivot (same as in sorting-algorithms.js)
function partition(arr, lo, hi) {
  const randomIndex = lo + Math.floor(Math.random() * (hi - lo + 1));
  swap(arr, randomIndex, hi);
  const pivot = arr[hi];
  let store = lo;
  for (let i = lo; i < hi; i++) {
    if (arr[i] < pivot) {
      swap(arr, i, store);
      store++;
    }
  }
  swap(arr, store, hi);
  return store;
}

// returns the k-th smallest (k = 0 -> minimum, k = n - 1 -> maximum)
function quickselect(arr, k) {
  if (k < 0 || k >= arr.length) throw new RangeError('k out of range');
  let lo = 0;
  let hi = arr.length - 1;
  while (lo < hi) {                        // iterative: no stack depth concerns
    const pivotIndex = partition(arr, lo, hi);
    if (pivotIndex === k) return arr[k];
    if (pivotIndex < k) lo = pivotIndex + 1;   // answer is to the right
    else hi = pivotIndex - 1;                  // answer is to the left
  }
  return arr[lo];
}

// three-way version: elements < pivot | == pivot | > pivot.
// If k falls inside the "== pivot" block we are done immediately.
function quickselectThreeWay(arr, k) {
  if (k < 0 || k >= arr.length) throw new RangeError('k out of range');
  let lo = 0;
  let hi = arr.length - 1;
  while (lo < hi) {
    const pivot = arr[lo + Math.floor(Math.random() * (hi - lo + 1))];
    let lessEnd = lo;        // arr[lo..lessEnd-1]  < pivot
    let scan = lo;           // arr[lessEnd..scan-1] == pivot
    let greaterStart = hi;   // arr[greaterStart+1..hi] > pivot
    while (scan <= greaterStart) {
      if (arr[scan] < pivot) swap(arr, scan++, lessEnd++);
      else if (arr[scan] > pivot) swap(arr, scan, greaterStart--);
      else scan++;
    }
    // now: [lo, lessEnd) < pivot, [lessEnd, greaterStart] == pivot, (greaterStart, hi] > pivot
    if (k < lessEnd) hi = lessEnd - 1;
    else if (k > greaterStart) lo = greaterStart + 1;
    else return pivot;
  }
  return arr[lo];
}

// convenience: k-th largest (1-based, like LeetCode 215)
function kthLargest(arr, k) {
  return quickselect(arr, arr.length - k);
}

// ---------- self-test ----------
const assert = require('assert');

assert.strictEqual(quickselect([7, 2, 9, 4, 1], 2), 4);
assert.strictEqual(quickselect([7, 2, 9, 4, 1], 0), 1);
assert.strictEqual(quickselect([7, 2, 9, 4, 1], 4), 9);
assert.strictEqual(quickselect([5], 0), 5);
assert.strictEqual(quickselect([3, 3, 3, 3], 2), 3);
assert.strictEqual(quickselect([-5, -1, -3], 1), -3);
assert.strictEqual(kthLargest([3, 2, 1, 5, 6, 4], 2), 5);
assert.strictEqual(kthLargest([3, 2, 3, 1, 2, 4, 5, 5, 6], 4), 4);
assert.throws(() => quickselect([1, 2], 2), RangeError);

for (let trial = 0; trial < 200; trial++) {
  const size = 1 + Math.floor(Math.random() * 40);
  const input = Array.from({ length: size }, () => Math.floor(Math.random() * 21) - 10);
  const sorted = [...input].sort((a, b) => a - b);
  const k = Math.floor(Math.random() * size);
  assert.strictEqual(quickselect([...input], k), sorted[k]);
  assert.strictEqual(quickselectThreeWay([...input], k), sorted[k]);
}

// all-duplicates input stays fast with the three-way version
const dupes = new Array(50000).fill(7);
assert.strictEqual(quickselectThreeWay(dupes, 25000), 7);

console.log('✓ quickselect.js self-test passed');

module.exports = { quickselect, quickselectThreeWay, kthLargest, partition };

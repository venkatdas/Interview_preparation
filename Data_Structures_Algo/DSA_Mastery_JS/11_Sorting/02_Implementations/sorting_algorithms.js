/**
 * Sorting algorithms in JavaScript.
 *
 *  1. bubbleSort       O(n^2)        stable    in-place   (early exit when no swaps)
 *  2. selectionSort    O(n^2)        unstable  in-place
 *  3. insertionSort    O(n^2)        stable    in-place   (O(n) on sorted input)
 *  4. shellSort        ~O(n^1.3)     unstable  in-place
 *  5. mergeSort        O(n log n)    stable    O(n) extra
 *  6. quickSortLomuto  O(n log n)avg unstable  in-place   (random pivot)
 *  7. quickSortHoare   O(n log n)avg unstable  in-place   (random pivot, fewer swaps)
 *  8. heapSort         O(n log n)    unstable  in-place
 *  9. countingSort     O(n + k)      stable    O(n + k)   integers, handles negatives via offset
 * 10. radixSort        O(d(n + b))   stable    O(n + b)   integers, handles negatives
 * 11. bucketSort       O(n + k) avg  stable    O(n + k)   numbers (floats ok)
 *
 * Every function returns the sorted array. The O(n^2)/in-place ones sort the
 * array they are given; the others may return a new array. The self-test at
 * the bottom compares each one against Array.prototype.sort on random inputs
 * with negatives and duplicates.
 */

function swap(arr, i, j) {
  const tmp = arr[i];
  arr[i] = arr[j];
  arr[j] = tmp;
}

// ---------- 1. bubble sort ----------
// Repeatedly swap adjacent out-of-order neighbours. After pass p the largest p
// elements are in their final place at the end. Stop early if a pass makes no swap.
function bubbleSort(arr) {
  const n = arr.length;
  for (let pass = 0; pass < n - 1; pass++) {
    let swapped = false;
    for (let i = 0; i < n - 1 - pass; i++) {       // last `pass` elements are done
      if (arr[i] > arr[i + 1]) {
        swap(arr, i, i + 1);
        swapped = true;
      }
    }
    if (!swapped) break;                           // already sorted -> O(n) best case
  }
  return arr;
}

// ---------- 2. selection sort ----------
// For every position, find the minimum of the rest and swap it in. Always n^2
// comparisons but at most n-1 swaps. Unstable: the long-range swap can jump an
// element over an equal one.
function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) minIndex = j;
    }
    if (minIndex !== i) swap(arr, i, minIndex);
  }
  return arr;
}

// ---------- 3. insertion sort ----------
// Keep a sorted prefix. Take the next element and slide it left until it fits.
// Stable because we only move past STRICTLY greater elements.
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {               // shift bigger elements right
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}

// ---------- 4. shell sort ----------
// Insertion sort with a gap: compare elements `gap` apart. Start with a big gap so
// far-away elements move fast, finish with gap = 1 (plain insertion sort on a
// nearly-sorted array, which is fast).
function shellSort(arr) {
  const n = arr.length;
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      const key = arr[i];
      let j = i;
      while (j >= gap && arr[j - gap] > key) {
        arr[j] = arr[j - gap];
        j -= gap;
      }
      arr[j] = key;
    }
  }
  return arr;
}

// ---------- 5. merge sort ----------
// Split in half, sort both halves, merge. log n levels, each O(n) merging.
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = arr.length >> 1;
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const out = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    // <= takes from the LEFT on ties -> equal elements keep their order (stable)
    if (left[i] <= right[j]) out.push(left[i++]);
    else out.push(right[j++]);
  }
  while (i < left.length) out.push(left[i++]);     // leftovers (only one of these runs)
  while (j < right.length) out.push(right[j++]);
  return out;
}

// ---------- 6. quick sort, Lomuto partition ----------
// Pivot goes to the end. `store` marks the boundary of the "< pivot" zone. Walk i
// through the range; whenever arr[i] < pivot, swap it into the zone and grow it.
// Finally put the pivot right after the zone. Simple, but does more swaps than Hoare
// and degrades on many duplicates.
function quickSortLomuto(arr, lo = 0, hi = arr.length - 1) {
  if (lo < hi) {
    const pivotIndex = partitionLomuto(arr, lo, hi);
    quickSortLomuto(arr, lo, pivotIndex - 1);
    quickSortLomuto(arr, pivotIndex + 1, hi);
  }
  return arr;
}

function partitionLomuto(arr, lo, hi) {
  const randomIndex = lo + Math.floor(Math.random() * (hi - lo + 1));
  swap(arr, randomIndex, hi);                      // random pivot -> avoid O(n^2) on sorted input
  const pivot = arr[hi];
  let store = lo;
  for (let i = lo; i < hi; i++) {
    if (arr[i] < pivot) {
      swap(arr, i, store);
      store++;
    }
  }
  swap(arr, store, hi);                            // pivot lands in its final spot
  return store;
}

// ---------- 7. quick sort, Hoare partition ----------
// Two pointers walk inward: i stops at something >= pivot, j stops at something <= pivot,
// swap them, continue until they cross. Returns j such that arr[lo..j] <= pivot <= arr[j+1..hi].
// NOTE: the pivot is NOT guaranteed to sit at j, so recurse on [lo, j] and [j + 1, hi].
function quickSortHoare(arr, lo = 0, hi = arr.length - 1) {
  if (lo < hi) {
    const split = partitionHoare(arr, lo, hi);
    quickSortHoare(arr, lo, split);
    quickSortHoare(arr, split + 1, hi);
  }
  return arr;
}

function partitionHoare(arr, lo, hi) {
  const randomIndex = lo + Math.floor(Math.random() * (hi - lo + 1));
  swap(arr, randomIndex, lo);                      // pivot value taken from a random spot
  const pivot = arr[lo];
  let i = lo - 1;
  let j = hi + 1;
  while (true) {
    do { i++; } while (arr[i] < pivot);
    do { j--; } while (arr[j] > pivot);
    if (i >= j) return j;
    swap(arr, i, j);
  }
}

// ---------- 8. heap sort ----------
// 1) turn the array into a max-heap (every parent >= its children)
// 2) swap the max (index 0) with the last element, shrink the heap by one, fix the root
// Children of i: 2i+1 and 2i+2. O(n) to heapify, O(log n) per extraction.
function heapSort(arr) {
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDown(arr, i, n); // build heap bottom-up
  for (let end = n - 1; end > 0; end--) {
    swap(arr, 0, end);                             // current max goes to its final place
    siftDown(arr, 0, end);                         // restore heap on the shrunken range
  }
  return arr;
}

function siftDown(arr, root, size) {
  while (true) {
    const left = 2 * root + 1;
    const right = 2 * root + 2;
    let largest = root;
    if (left < size && arr[left] > arr[largest]) largest = left;
    if (right < size && arr[right] > arr[largest]) largest = right;
    if (largest === root) return;
    swap(arr, root, largest);
    root = largest;
  }
}

// ---------- 9. counting sort (stable, handles negatives) ----------
// Count occurrences of every value, convert counts to "position of first occurrence",
// then place each element at its position scanning the INPUT from right to left
// (right-to-left + prefix positions = stable).
function countingSort(arr) {
  if (arr.length === 0) return arr;
  let min = arr[0], max = arr[0];
  for (const value of arr) {
    if (value < min) min = value;
    if (value > max) max = value;
  }
  const range = max - min + 1;                     // offset by min so negatives work
  const counts = new Array(range).fill(0);
  for (const value of arr) counts[value - min]++;
  for (let i = 1; i < range; i++) counts[i] += counts[i - 1]; // counts[v] = # elements <= v
  const out = new Array(arr.length);
  for (let i = arr.length - 1; i >= 0; i--) {
    const slot = arr[i] - min;
    counts[slot]--;
    out[counts[slot]] = arr[i];
  }
  return out;
}

// ---------- 10. radix sort (LSD, base 10, handles negatives) ----------
// Stable counting sort by the ones digit, then tens, then hundreds, ...
// Negative numbers: sort the absolute values of negatives separately, reverse them,
// and put them before the non-negatives.
function radixSort(arr) {
  const negatives = arr.filter((v) => v < 0).map((v) => -v);
  const positives = arr.filter((v) => v >= 0);
  const sortedNeg = radixSortNonNegative(negatives).reverse().map((v) => -v);
  return sortedNeg.concat(radixSortNonNegative(positives));
}

function radixSortNonNegative(arr) {
  if (arr.length === 0) return arr;
  let max = Math.max(...arr);
  let current = arr;
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) { // one pass per digit
    const counts = new Array(10).fill(0);
    for (const value of current) counts[Math.floor(value / exp) % 10]++;
    for (let d = 1; d < 10; d++) counts[d] += counts[d - 1];
    const out = new Array(current.length);
    for (let i = current.length - 1; i >= 0; i--) {       // right to left keeps it stable
      const digit = Math.floor(current[i] / exp) % 10;
      counts[digit]--;
      out[counts[digit]] = current[i];
    }
    current = out;
  }
  return current;
}

// ---------- 11. bucket sort ----------
// Spread values into n buckets by their position in [min, max], insertion-sort each
// bucket (they are tiny when the data is uniform), concatenate.
function bucketSort(arr, bucketCount = arr.length) {
  if (arr.length <= 1) return arr;
  let min = arr[0], max = arr[0];
  for (const value of arr) {
    if (value < min) min = value;
    if (value > max) max = value;
  }
  if (min === max) return [...arr];                // all equal
  const buckets = Array.from({ length: bucketCount }, () => []);
  const width = (max - min) / bucketCount;
  for (const value of arr) {
    const index = Math.min(bucketCount - 1, Math.floor((value - min) / width)); // max -> last bucket
    buckets[index].push(value);
  }
  const out = [];
  for (const bucket of buckets) out.push(...insertionSort(bucket));
  return out;
}

// ---------- self-test ----------
const assert = require('assert');

function randomArray(size, lo, hi) {
  return Array.from({ length: size }, () => lo + Math.floor(Math.random() * (hi - lo + 1)));
}

const integerSorts = {
  bubbleSort, selectionSort, insertionSort, shellSort, mergeSort,
  quickSortLomuto, quickSortHoare, heapSort, countingSort, radixSort, bucketSort,
};

const fixedCases = [
  [], [1], [2, 1], [3, 3, 3], [5, 1, 4, 2, 8], [-3, -1, -2, 0, 2, 1],
  [1, 2, 3, 4, 5], [5, 4, 3, 2, 1], [0, 0, -1, 1, -1, 0], [100, -100, 50, -50, 0],
];

for (const [name, sortFn] of Object.entries(integerSorts)) {
  for (const input of fixedCases) {
    const expected = [...input].sort((a, b) => a - b);
    assert.deepStrictEqual(sortFn([...input]), expected, `${name} failed on ${JSON.stringify(input)}`);
  }
  for (let trial = 0; trial < 30; trial++) {
    const size = Math.floor(Math.random() * 60);
    const input = randomArray(size, -50, 50);           // negatives + many duplicates
    const expected = [...input].sort((a, b) => a - b);
    assert.deepStrictEqual(sortFn([...input]), expected, `${name} failed on ${JSON.stringify(input)}`);
  }
  const big = randomArray(2000, -100000, 100000);
  assert.deepStrictEqual(sortFn([...big]), [...big].sort((a, b) => a - b), `${name} failed on big input`);
}

// stability check for the stable ones: sort pairs by key, values must keep order
function stabilityInput() {
  return [[2, 'a'], [1, 'b'], [2, 'c'], [1, 'd'], [0, 'e'], [2, 'f']];
}
const expectedStable = [[0, 'e'], [1, 'b'], [1, 'd'], [2, 'a'], [2, 'c'], [2, 'f']];
function stableMergeSortPairs(pairs) {       // reuse merge logic via keys
  if (pairs.length <= 1) return pairs;
  const mid = pairs.length >> 1;
  const left = stableMergeSortPairs(pairs.slice(0, mid));
  const right = stableMergeSortPairs(pairs.slice(mid));
  const out = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i][0] <= right[j][0]) out.push(left[i++]); else out.push(right[j++]);
  }
  return out.concat(left.slice(i), right.slice(j));
}
assert.deepStrictEqual(stableMergeSortPairs(stabilityInput()), expectedStable);

// bucket sort also handles floats
const floats = [0.42, 0.32, 0.23, 0.52, 0.25, 0.47, 0.999, 0.0];
assert.deepStrictEqual(bucketSort([...floats]), [...floats].sort((a, b) => a - b));

// the Array.prototype.sort string trap, documented in the README
assert.deepStrictEqual([10, 9, 1, 2].sort(), [1, 10, 2, 9]);
assert.deepStrictEqual([10, 9, 1, 2].sort((a, b) => a - b), [1, 2, 9, 10]);

console.log('✓ sorting-algorithms.js self-test passed');

module.exports = {
  bubbleSort, selectionSort, insertionSort, shellSort, mergeSort, merge,
  quickSortLomuto, partitionLomuto, quickSortHoare, partitionHoare,
  heapSort, countingSort, radixSort, bucketSort,
};

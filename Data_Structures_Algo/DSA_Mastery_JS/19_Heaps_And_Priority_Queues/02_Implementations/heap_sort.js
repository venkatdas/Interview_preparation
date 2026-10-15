/**
 * Heap sort in JavaScript.
 *
 * Idea: turn the array into a MAX-heap in place (O(n)), then repeatedly swap
 * the max (index 0) with the last unsorted slot and shrink the heap by one.
 * The sorted part grows from the right end.
 *
 *   [ max-heap part | sorted part (ascending) ]
 *
 * Time:  O(n log n) always (no bad case like quicksort)
 * Space: O(1) extra (sorts in place)
 * NOT stable: equal elements can change relative order.
 *
 * In practice JS's built-in sort is faster, but heap sort is the classic
 * "explain how a heap works" interview question.
 */

/** Sift the element at `index` down inside heap[0..size-1] (max-heap). */
function siftDown(arr, index, size) {
  while (true) {
    const left = 2 * index + 1;
    const right = 2 * index + 2;
    let largest = index;
    if (left < size && arr[left] > arr[largest]) largest = left;
    if (right < size && arr[right] > arr[largest]) largest = right;
    if (largest === index) return;
    [arr[index], arr[largest]] = [arr[largest], arr[index]];
    index = largest;
  }
}

/** Rearrange arr into a max-heap in O(n). */
function buildMaxHeap(arr) {
  // last parent is at (n - 2) >> 1; everything after it is a leaf
  for (let i = (arr.length - 2) >> 1; i >= 0; i--) {
    siftDown(arr, i, arr.length);
  }
}

function heapSort(arr) {
  buildMaxHeap(arr);
  // Each iteration: the max is at index 0. Put it at the end of the heap
  // region, then fix the (now smaller) heap.
  for (let end = arr.length - 1; end > 0; end--) {
    [arr[0], arr[end]] = [arr[end], arr[0]];
    siftDown(arr, 0, end); // heap region is now arr[0..end-1]
  }
  return arr;
}

// ---------- self-test ----------
const assert = require('assert');

assert.deepStrictEqual(heapSort([]), []);
assert.deepStrictEqual(heapSort([1]), [1]);
assert.deepStrictEqual(heapSort([3, 1, 2]), [1, 2, 3]);
assert.deepStrictEqual(heapSort([5, 5, 5]), [5, 5, 5]);
assert.deepStrictEqual(heapSort([-2, 10, -7, 0, 3]), [-7, -2, 0, 3, 10]);
assert.deepStrictEqual(heapSort([9, 8, 7, 6, 5, 4, 3, 2, 1]), [1, 2, 3, 4, 5, 6, 7, 8, 9]);

for (let round = 0; round < 100; round++) {
  const nums = Array.from({ length: Math.floor(Math.random() * 80) }, () => Math.floor(Math.random() * 200) - 100);
  const expected = [...nums].sort((a, b) => a - b);
  assert.deepStrictEqual(heapSort([...nums]), expected);
}

console.log('✓ heap-sort.js self-test passed');

module.exports = { heapSort, buildMaxHeap, siftDown };

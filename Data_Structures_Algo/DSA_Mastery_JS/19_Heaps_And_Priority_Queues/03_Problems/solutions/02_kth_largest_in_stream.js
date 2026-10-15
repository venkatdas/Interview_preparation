/**
 * 02. Kth Largest Element in a Stream   (LeetCode 703 — Easy)
 *
 * PROBLEM
 * Design a class KthLargest(k, nums). Each call add(val) appends val to the
 * stream and returns the k-th largest element seen so far.
 *
 * EXAMPLES
 * KthLargest(3, [4,5,8,2])
 *   add(3)  -> 4     stream 4,5,8,2,3  -> top 3 are 8,5,4
 *   add(5)  -> 5     stream +5         -> 8,5,5
 *   add(10) -> 5     -> 10,8,5
 *   add(9)  -> 8     -> 10,9,8
 *   add(4)  -> 8
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can nums have fewer than k elements at the start? (yes, but add is only
 *   called when there are at least k elements in total when we answer)
 * - How many adds? (up to 10^4 -> each add must be fast)
 *
 * APPROACH 1 — Brute force   O(n log n) per add, O(n) space
 * Keep all numbers in an array. On every add, sort and return index k-1.
 *
 * APPROACH 2 — Optimal (min-heap of size k)   O(log k) per add, O(k) space
 * Same trick as problem 01, but kept alive across calls: a min-heap with at
 * most k items holds the k largest so far; its top is the answer.
 * add(val): push, pop if size > k, return peek.
 *
 * Dry run with k = 3, nums = [4,5,8,2]:
 *   build: push 4,5,8 -> [4,5,8]; push 2 -> size 4 -> pop 2 -> [4,5,8]
 *   add(3):  push 3 -> pop 3 -> [4,5,8]  -> 4
 *   add(5):  push 5 -> pop 4 -> [5,5,8]  -> 5
 *   add(10): push 10 -> pop 5 -> [5,8,10] -> 5
 *   add(9):  push 9 -> pop 5 -> [8,9,10] -> 8
 *
 * EDGE CASES
 * - initial nums empty
 * - k = 1 (running maximum)
 * - duplicates must be kept (they count separately)
 */

const { MinHeap } = require('../../02_Implementations/min_heap');

class KthLargestBrute {
  constructor(k, nums) {
    this.k = k;
    this.nums = [...nums];
  }
  add(val) {
    this.nums.push(val);
    const sorted = [...this.nums].sort((a, b) => b - a);
    return sorted[this.k - 1];
  }
}

class KthLargest {
  constructor(k, nums) {
    this.k = k;
    this.heap = new MinHeap();
    for (const num of nums) this.add(num); // reuse add so the size cap is enforced
  }
  add(val) {
    this.heap.push(val);
    if (this.heap.size() > this.k) this.heap.pop(); // keep only the k largest
    return this.heap.peek();
  }
}

// run a list of adds and collect the answers (makes testing uniform)
function bruteForce(k, nums, adds) {
  const obj = new KthLargestBrute(k, nums);
  return adds.map((v) => obj.add(v));
}

function optimal(k, nums, adds) {
  const obj = new KthLargest(k, nums);
  return adds.map((v) => obj.add(v));
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve(3, [4, 5, 8, 2], [3, 5, 10, 9, 4]), [4, 5, 5, 8, 8]);
  assert.deepStrictEqual(solve(1, [], [-3, -2, -4, 0]), [-3, -2, -2, 0]);
  assert.deepStrictEqual(solve(2, [0], [-1, 1, -2, -4, 3]), [-1, 0, 0, 0, 1]);
  assert.deepStrictEqual(solve(2, [5, 5], [5]), [5]);
}
console.log('✓ 02-kth-largest-in-stream passed');

module.exports = { optimal, bruteForce, KthLargest };

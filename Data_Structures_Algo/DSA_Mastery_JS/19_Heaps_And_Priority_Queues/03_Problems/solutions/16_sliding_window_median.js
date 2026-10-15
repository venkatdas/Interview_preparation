/**
 * 16. Sliding Window Median   (LeetCode 480 — Hard)
 *
 * PROBLEM
 * Given nums and a window size k, return the median of every window of size k
 * as it slides from left to right one position at a time.
 *
 * EXAMPLES
 * Input: nums = [1,3,-1,-3,5,3,6,7], k = 3   Output: [1,-1,-1,3,5,6]
 *   Explanation: windows [1,3,-1] -> 1, [3,-1,-3] -> -1, [-1,-3,5] -> -1, ...
 * Input: nums = [1,2,3,4], k = 4             Output: [2.5]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - k <= nums.length, k >= 1
 * - Even k -> average of the two middles (can be a decimal)
 * - Duplicates? (yes, and this is what makes naive deletion tricky)
 *
 * APPROACH 1 — Brute force   O(n * k log k) time, O(k) space
 * For every window copy it, sort it, read the middle. Simple and correct.
 *
 * APPROACH 2 — Optimal (two heaps + lazy deletion)   O(n log n) time, O(n) space
 * Same two-heap idea as "Find Median from Data Stream" (problem 08): a
 * max-heap `low` for the smaller half, a min-heap `high` for the larger half,
 * with low.size == high.size or low.size == high.size + 1.
 * The new difficulty: when the window slides, a number LEAVES. A heap cannot
 * delete an arbitrary element in O(log n)... so we don't. We note it in a
 * `toRemove` map (value -> count) and only actually discard it when it
 * surfaces at the top of a heap ("lazy deletion").
 *
 * To keep the size invariant honest we track `balance` = (valid elements in
 * low) - (valid elements in high) as we add/remove, and fix it by moving
 * tops between heaps. Steps per slide (add `incoming`, remove `outgoing`):
 *   1. removal: if outgoing <= low.top it was in low -> balance--, else balance++
 *      record toRemove[outgoing]++
 *   2. insertion: if incoming <= low.top push to low (balance++) else to high (balance--)
 *   3. if balance > 0 move low.top to high; if balance < 0 move high.top to low
 *      (after this balance is 0 again; low keeps the extra element for odd k
 *       because we start with low holding ceil(k/2) valid elements)
 *   4. prune: while low.top is in toRemove, pop it (decrement count); same for high
 *   5. median = odd k ? low.top : (low.top + high.top) / 2
 *
 * Dry run on [1,3,-1,-3,5,3,6,7], k = 3:
 *   first window {1,3,-1}: low={1,-1} (max 1), high={3} -> median 1
 *   slide: out 1 (in low, balance -1), in -3 (<= low.top 1 -> low, balance 0)
 *          low={-1,-3, [1 lazy]} ... prune: low.top is 1 and marked -> pop ->
 *          low={-1,-3} high={3} -> median -1
 *   slide: out 3 (in high, balance +1), in 5 (> low.top -> high, balance 0)
 *          high={3(lazy),5}; prune high top 3 -> high={5}; low={-1,-3} -> median -1
 *   ... continues -> [1,-1,-1,3,5,6]
 *
 * EDGE CASES
 * - k = 1 -> the array itself
 * - k = nums.length -> single median
 * - all duplicates (lazy deletion must count, not just mark)
 * - large values: use (a + b) / 2 only when needed to avoid overflow in other languages
 */

const { MinHeap } = require('../../02_Implementations/min_heap');

function bruteForce(nums, k) {
  const result = [];
  for (let start = 0; start + k <= nums.length; start++) {
    const window = nums.slice(start, start + k).sort((a, b) => a - b);
    const mid = k >> 1;
    result.push(k % 2 ? window[mid] : (window[mid - 1] + window[mid]) / 2);
  }
  return result;
}

function optimal(nums, k) {
  const low = new MinHeap((a, b) => b - a); // max-heap: smaller half
  const high = new MinHeap(); // min-heap: larger half
  const toRemove = new Map(); // value -> how many copies are pending removal

  function prune(heap) {
    while (!heap.isEmpty() && toRemove.get(heap.peek()) > 0) {
      toRemove.set(heap.peek(), toRemove.get(heap.peek()) - 1);
      heap.pop();
    }
  }

  function median() {
    return k % 2 ? low.peek() : (low.peek() + high.peek()) / 2;
  }

  // build the first window: push everything to low, then move the smallest half up
  for (let i = 0; i < k; i++) low.push(nums[i]);
  for (let i = 0; i < k >> 1; i++) high.push(low.pop());

  const result = [median()];
  for (let i = k; i < nums.length; i++) {
    const outgoing = nums[i - k];
    const incoming = nums[i];
    let balance = 0; // change in (low valid count) - (high valid count)

    // 1. mark the outgoing element for lazy removal
    toRemove.set(outgoing, (toRemove.get(outgoing) || 0) + 1);
    if (outgoing <= low.peek()) balance--;
    else balance++;

    // 2. insert the incoming element on the correct side
    if (!low.isEmpty() && incoming <= low.peek()) {
      low.push(incoming);
      balance++;
    } else {
      high.push(incoming);
      balance--;
    }

    // 3. rebalance (balance is -2, 0 or +2 here)
    if (balance > 0) {
      high.push(low.pop());
    } else if (balance < 0) {
      low.push(high.pop());
    }

    // 4. throw away stale tops so peek() is always a live element
    prune(low);
    prune(high);

    result.push(median());
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(solve([1, 3, -1, -3, 5, 3, 6, 7], 3), [1, -1, -1, 3, 5, 6]);
  assert.deepStrictEqual(solve([1, 2, 3, 4], 4), [2.5]);
  assert.deepStrictEqual(solve([5, 4, 3, 2, 1], 1), [5, 4, 3, 2, 1]);
  assert.deepStrictEqual(solve([2, 2, 2, 2, 2], 2), [2, 2, 2, 2]);
  assert.deepStrictEqual(solve([1, 4, 2, 3], 2), [2.5, 3, 2.5]);
  assert.deepStrictEqual(solve([-7, -8, -9, -10], 3), [-8, -9]);
}
// random cross-check, including lots of duplicates
for (let round = 0; round < 50; round++) {
  const length = 1 + Math.floor(Math.random() * 30);
  const nums = Array.from({ length }, () => Math.floor(Math.random() * 7) - 3);
  const k = 1 + Math.floor(Math.random() * length);
  assert.deepStrictEqual(optimal(nums, k), bruteForce(nums, k), `nums=${nums} k=${k}`);
}
console.log('✓ 16-sliding-window-median passed');

module.exports = { optimal, bruteForce };

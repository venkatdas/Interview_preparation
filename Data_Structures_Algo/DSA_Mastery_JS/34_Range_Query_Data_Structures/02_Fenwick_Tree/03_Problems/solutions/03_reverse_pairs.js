/**
 * 03. Reverse Pairs   (LeetCode 493 — Hard)
 *
 * PROBLEM
 * Count the pairs (i, j) with i < j and nums[i] > 2 * nums[j].
 *
 * EXAMPLES
 * Input: [1,3,2,3,1]   Output: 2   Explanation: (1,4): 3 > 2*1 and (3,4): 3 > 2*1
 * Input: [2,4,3,5,1]   Output: 3   Explanation: (1,4) 4 > 2, (2,4) 3 > 2, (3,4) 5 > 2
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 5 * 10^4, values up to +-2^31 -> 2 * nums[j] fits in a double exactly
 * - Strict inequality
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * Check every pair.
 *
 * APPROACH 2 — Optimal (Fenwick tree over compressed values)   O(n log n) time, O(n) space
 * This is "count of smaller after self" with a twist: we compare nums[i] against 2*nums[j].
 * Compress the union of all values v AND all doubled values 2v into one sorted list.
 * Sweep from the right. For index i, we need the number of already-seen j with
 * 2 * nums[j] < nums[i]. Keep the BIT indexed by rank(2 * nums[j]); query
 * prefixCount(rank(nums[i]) - 1) (how many doubled values have a strictly smaller rank).
 * Then insert rank(2 * nums[i]) for future i's to the left.
 *
 * Dry run on [1,3,2,3,1]: values {1,2,3}, doubled {2,4,6} -> sorted [1,2,3,4,6], ranks 0..4
 *   i=4 (1): query ranks < rank(1)=0 -> 0; insert rank(2)=1
 *   i=3 (3): query ranks < rank(3)=2 -> 1 (the inserted 2); insert rank(6)=4
 *   i=2 (2): query ranks < 1 -> 0; insert rank(4)=3
 *   i=1 (3): query ranks < 2 -> 1; insert rank(6)=4
 *   i=0 (1): query ranks < 0 -> 0
 *   total 2
 *
 * (A merge-sort version also exists: count across halves before merging. Same complexity.)
 *
 * EDGE CASES
 * - empty / single element -> 0
 * - negatives: 2 * (-3) = -6 < -1, so (-1 then -3) counts
 * - zeros: 0 > 2*0 is false
 */

function bruteForce(nums) {
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] > 2 * nums[j]) count++;
    }
  }
  return count;
}

function optimal(nums) {
  const all = new Set();
  for (const v of nums) {
    all.add(v);
    all.add(2 * v);
  }
  const sorted = [...all].sort((a, b) => a - b);
  const rank = new Map(sorted.map((v, i) => [v, i]));
  const m = sorted.length;
  const tree = new Array(m + 1).fill(0);

  function add(index) {
    for (let i = index + 1; i <= m; i += i & -i) tree[i]++;
  }
  function prefixCount(index) {
    let sum = 0;
    for (let i = index + 1; i > 0; i -= i & -i) sum += tree[i];
    return sum;
  }

  let count = 0;
  for (let i = nums.length - 1; i >= 0; i--) {
    count += prefixCount(rank.get(nums[i]) - 1);  // seen doubled values < nums[i]
    add(rank.get(2 * nums[i]));
  }
  return count;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 3, 2, 3, 1]), 2);
  assert.strictEqual(solve([2, 4, 3, 5, 1]), 3);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([5]), 0);
  assert.strictEqual(solve([0, 0, 0]), 0);
  assert.strictEqual(solve([-1, -3]), 1);
  assert.strictEqual(solve([2147483647, 2147483647, -2147483648]), 2);
}
for (let trial = 0; trial < 100; trial++) {
  const n = Math.floor(Math.random() * 15);
  const nums = Array.from({ length: n }, () => Math.floor(Math.random() * 41) - 20);
  assert.strictEqual(optimal(nums), bruteForce(nums));
}
console.log('✓ 03-reverse-pairs passed');

module.exports = { optimal, bruteForce };

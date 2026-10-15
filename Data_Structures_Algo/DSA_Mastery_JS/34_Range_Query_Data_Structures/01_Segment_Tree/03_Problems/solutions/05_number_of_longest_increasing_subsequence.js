/**
 * 05. Number of Longest Increasing Subsequence   (LeetCode 673 — Medium)
 *
 * PROBLEM
 * Given an integer array, return how many strictly increasing subsequences have the
 * maximum possible length.
 *
 * EXAMPLES
 * Input: [1,3,5,4,7]   Output: 2   Explanation: [1,3,4,7] and [1,3,5,7]
 * Input: [2,2,2,2,2]   Output: 5   Explanation: LIS length is 1, five ways
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n up to 2000 in the original problem -> O(n^2) DP is accepted. The segment tree
 *   version is O(n log n) and is the way to handle n = 10^5.
 * - Strictly increasing (equal values do not extend a subsequence).
 *
 * APPROACH 1 — Brute force / O(n^2) DP   O(n^2) time, O(n) space
 * length[i] = longest LIS ending at i, count[i] = how many of them.
 * For each i, look at every j < i with nums[j] < nums[i]:
 *   if length[j] + 1 > length[i]: length[i] = length[j] + 1, count[i] = count[j]
 *   else if length[j] + 1 === length[i]: count[i] += count[j]
 * Answer = sum of count[i] over all i with length[i] === max length.
 *
 * APPROACH 2 — Optimal (Segment tree over VALUES storing (length, count))   O(n log n)
 * The inner loop "best over all j with nums[j] < nums[i]" is a range query over values!
 * 1. Compress values to 0..m-1.
 * 2. Segment tree indexed by compressed value; each node stores the pair
 *    (bestLength, waysWithThatLength) for the values in its range.
 *    merge(a, b): if a.len > b.len -> a; if b.len > a.len -> b; else (a.len, a.cnt + b.cnt).
 * 3. For each number left to right: q = query(0, idx - 1) -> (len, cnt).
 *    New pair for this element = (q.len + 1, max(q.cnt, 1)) -- if nothing smaller exists,
 *    the element alone starts 1 subsequence. Update the tree at idx by MERGING the new
 *    pair into the leaf (not overwriting: equal values at the same leaf accumulate counts).
 * 4. Answer = root pair's count.
 *
 * Dry run on [1,3,5,4,7] (values compressed 1->0, 3->1, 4->2, 5->3, 7->4):
 *   1: query(0,-1) = (0,0) -> leaf0 = (1,1)
 *   3: query(0,0) = (1,1) -> leaf1 = (2,1)
 *   5: query(0,2) = (2,1) -> leaf3 = (3,1)
 *   4: query(0,1) = (2,1) -> leaf2 = (3,1)
 *   7: query(0,3) = merge((3,1) at leaf2, (3,1) at leaf3) = (3,2) -> leaf4 = (4,2)
 *   root = (4,2) -> answer 2
 *
 * EDGE CASES
 * - empty array -> 0
 * - single element -> 1
 * - all equal -> n
 * - strictly decreasing -> n (LIS length 1)
 */

function bruteForce(nums) {
  const n = nums.length;
  if (n === 0) return 0;
  const length = new Array(n).fill(1);
  const count = new Array(n).fill(1);
  let bestLen = 1;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] >= nums[i]) continue;
      if (length[j] + 1 > length[i]) {
        length[i] = length[j] + 1;
        count[i] = count[j];
      } else if (length[j] + 1 === length[i]) {
        count[i] += count[j];
      }
    }
    bestLen = Math.max(bestLen, length[i]);
  }
  let total = 0;
  for (let i = 0; i < n; i++) if (length[i] === bestLen) total += count[i];
  return total;
}

function mergePairs(a, b) {
  if (a.len > b.len) return a;
  if (b.len > a.len) return b;
  return { len: a.len, cnt: a.cnt + b.cnt };
}

const EMPTY = { len: 0, cnt: 0 };

function optimal(nums) {
  const n = nums.length;
  if (n === 0) return 0;
  // 1. compress values
  const sorted = [...new Set(nums)].sort((a, b) => a - b);
  const indexOf = new Map(sorted.map((v, i) => [v, i]));
  const m = sorted.length;

  // 2. iterative segment tree of pairs
  const tree = new Array(2 * m).fill(EMPTY);

  function update(i, pair) {
    i += m;
    tree[i] = mergePairs(tree[i], pair);      // accumulate, do not overwrite
    for (i >>= 1; i >= 1; i >>= 1) tree[i] = mergePairs(tree[2 * i], tree[2 * i + 1]);
  }

  function query(l, r) {                       // inclusive; returns EMPTY if l > r
    let left = EMPTY;
    let right = EMPTY;
    for (let lo = l + m, hi = r + m + 1; lo < hi; lo >>= 1, hi >>= 1) {
      if (lo & 1) left = mergePairs(left, tree[lo++]);
      if (hi & 1) right = mergePairs(tree[--hi], right);
    }
    return mergePairs(left, right);
  }

  // 3. sweep
  for (const value of nums) {
    const idx = indexOf.get(value);
    const best = query(0, idx - 1);
    update(idx, { len: best.len + 1, cnt: Math.max(best.cnt, 1) });
  }
  return tree[1].cnt;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 3, 5, 4, 7]), 2);
  assert.strictEqual(solve([2, 2, 2, 2, 2]), 5);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([9]), 1);
  assert.strictEqual(solve([5, 4, 3, 2, 1]), 5);
  assert.strictEqual(solve([1, 2, 4, 3, 5, 4, 7, 2]), 3);
  assert.strictEqual(solve([-1, 0, -1, 0]), 3);   // (-1,0) using indices (0,1), (0,3), (2,3)
}
for (let trial = 0; trial < 100; trial++) {
  const n = Math.floor(Math.random() * 12);
  const nums = Array.from({ length: n }, () => Math.floor(Math.random() * 8) - 3);
  assert.strictEqual(optimal(nums), bruteForce(nums));
}
console.log('✓ 05-number-of-longest-increasing-subsequence passed');

module.exports = { optimal, bruteForce };

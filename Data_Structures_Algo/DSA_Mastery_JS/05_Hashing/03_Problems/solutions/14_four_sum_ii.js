/**
 * 14. 4Sum II   (LeetCode 454 — Medium)
 *
 * PROBLEM
 * Given four integer arrays nums1, nums2, nums3, nums4 all of length n, return the number
 * of tuples (i, j, k, l) such that nums1[i] + nums2[j] + nums3[k] + nums4[l] === 0.
 *
 * EXAMPLES
 * Input: [1,2], [-2,-1], [-1,2], [0,2]   Output: 2
 *   Explanation: (0,0,0,1): 1 + -2 + -1 + 2 = 0 and (1,1,0,0): 2 + -1 + -1 + 0 = 0
 * Input: [0], [0], [0], [0]              Output: 1
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Count tuples of INDICES (so duplicate values count separately)? (yes)
 * - n up to 200 -> O(n^4) = 1.6 * 10^9 is too slow, O(n^2) = 40,000 is instant
 * - Negative numbers? (yes, sums can be anything)
 *
 * APPROACH 1 — Brute force   O(n^4) time, O(1) space
 * Four nested loops. Only for tiny inputs / checking the optimal one in tests.
 *
 * APPROACH 2 — Optimal (counting pairs, "meet in the middle" with a Map)   O(n^2) time, O(n^2) space
 * Split the four arrays into two halves:
 *   1. Count every sum a + b (a from nums1, b from nums2) in a Map: sum -> occurrences.
 *   2. For every c + d (c from nums3, d from nums4), we need a + b = -(c + d).
 *      Add map.get(-(c + d)) to the answer.
 * Two O(n^2) passes instead of one O(n^4) pass. Same trick as Two Sum, one level up.
 *
 * Dry run on [1,2], [-2,-1], [-1,2], [0,2]:
 *   pair sums of nums1+nums2: 1-2=-1, 1-1=0, 2-2=0, 2-1=1 -> map {-1:1, 0:2, 1:1}
 *   nums3+nums4: -1+0=-1 need 1 -> 1; -1+2=1 need -1 -> 1; 2+0=2 need -2 -> 0; 2+2=4 need -4 -> 0
 *   total 2
 *
 * EDGE CASES
 * - All zeros -> n^4 tuples
 * - No valid tuples -> 0
 * - Duplicate values across arrays are counted per index
 */

function bruteForce(nums1, nums2, nums3, nums4) {
  let count = 0;
  for (const a of nums1)
    for (const b of nums2)
      for (const c of nums3)
        for (const d of nums4) if (a + b + c + d === 0) count++;
  return count;
}

function optimal(nums1, nums2, nums3, nums4) {
  const pairSumCount = new Map(); // (a + b) -> how many (i, j) pairs produce it
  for (const a of nums1) {
    for (const b of nums2) {
      pairSumCount.set(a + b, (pairSumCount.get(a + b) ?? 0) + 1);
    }
  }

  let count = 0;
  for (const c of nums3) {
    for (const d of nums4) {
      count += pairSumCount.get(-(c + d)) ?? 0; // complement lookup
    }
  }
  return count;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 2], [-2, -1], [-1, 2], [0, 2]), 2);
  assert.strictEqual(solve([0], [0], [0], [0]), 1);
  assert.strictEqual(solve([0, 0], [0, 0], [0, 0], [0, 0]), 16);
  assert.strictEqual(solve([1], [1], [1], [1]), 0);
  assert.strictEqual(solve([-1, -1], [-1, 1], [-1, 1], [1, -1]), 6);
  assert.strictEqual(solve([], [], [], []), 0);
}
console.log('✓ 14-four-sum-ii passed');

module.exports = { optimal, bruteForce };

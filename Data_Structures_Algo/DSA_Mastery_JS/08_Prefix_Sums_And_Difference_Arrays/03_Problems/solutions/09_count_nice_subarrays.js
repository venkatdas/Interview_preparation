/**
 * 09. Count Number of Nice Subarrays   (LeetCode 1248 — Medium)
 *
 * PROBLEM
 * A subarray is "nice" if it contains exactly k odd numbers. Return the number of nice
 * contiguous subarrays.
 *
 * EXAMPLES
 * Input: nums = [1, 1, 2, 1, 1], k = 3   Output: 2
 * Input: nums = [2, 4, 6], k = 1         Output: 0
 * Input: nums = [2, 2, 2, 1, 2, 2, 1, 2, 2, 2], k = 2   Output: 16
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Exactly k? (yes)
 * - 1 <= k <= n? (yes)
 * - Positive integers? (yes; only parity matters)
 *
 * APPROACH 1 — Brute force   O(n^2) time, O(1) space
 * For each start, extend right counting odds; count when === k, break when > k.
 *
 * APPROACH 2 — Optimal (transform to 0/1, then "subarray sum equals k")   O(n) time, O(n) space
 * Prefix-sum view (07_Sliding_Window solves it with the "at most k" window trick):
 * replace each number by 1 if odd, 0 if even. "Exactly k odds" = "subarray sum equals k".
 * That is problem 05 (Subarray Sum Equals K) verbatim: running count of odds, map of
 * prefix counts, add map[running - k] at each step.
 * Since the prefix count only goes up to n, an array of size n + 1 can replace the Map.
 *
 * Dry run on [1, 1, 2, 1, 1], k = 3 (parities 1,1,0,1,1):
 *   counts[0]=1, running 0
 *   1: running 1, need -2 -> 0; counts[1]=1
 *   1: running 2, need -1 -> 0; counts[2]=1
 *   0: running 2, need -1 -> 0; counts[2]=2
 *   1: running 3, need 0  -> 1; counts[3]=1
 *   1: running 4, need 1  -> 1; counts[4]=1
 *   2
 *
 * EDGE CASES
 * - No odd numbers -> 0
 * - All odd, k = 1 -> n
 * - k larger than total odds -> 0
 */

function bruteForce(nums, k) {
  let count = 0;
  for (let start = 0; start < nums.length; start++) {
    let odds = 0;
    for (let end = start; end < nums.length; end++) {
      if (nums[end] % 2 === 1) odds++;
      if (odds > k) break;
      if (odds === k) count++;
    }
  }
  return count;
}

function optimal(nums, k) {
  const prefixCount = new Array(nums.length + 1).fill(0); // prefixCount[c] = prefixes with c odds
  prefixCount[0] = 1;
  let oddsSoFar = 0;
  let count = 0;

  for (const num of nums) {
    oddsSoFar += num % 2;
    if (oddsSoFar >= k) count += prefixCount[oddsSoFar - k]; // earlier prefixes with exactly k fewer odds
    prefixCount[oddsSoFar]++;
  }
  return count;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([1, 1, 2, 1, 1], 3), 2);
  assert.strictEqual(solve([2, 4, 6], 1), 0);
  assert.strictEqual(solve([2, 2, 2, 1, 2, 2, 1, 2, 2, 2], 2), 16);
  assert.strictEqual(solve([1, 3, 5], 1), 3);
  assert.strictEqual(solve([1], 2), 0);
  assert.strictEqual(solve([], 1), 0);
  assert.strictEqual(solve([2, 1, 2], 1), 4);
}
console.log('✓ 09-count-nice-subarrays passed');

module.exports = { optimal, bruteForce };

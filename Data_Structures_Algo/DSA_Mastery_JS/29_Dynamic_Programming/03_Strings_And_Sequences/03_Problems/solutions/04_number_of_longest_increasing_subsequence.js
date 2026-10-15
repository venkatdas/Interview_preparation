/**
 * 04. Number of Longest Increasing Subsequence   (LeetCode 673 — Medium)
 *
 * PROBLEM
 * Given an integer array nums, return the NUMBER of longest strictly increasing
 * subsequences.
 *
 * EXAMPLES
 * Input: [1,3,5,4,7]   Output: 2   Explanation: [1,3,4,7] and [1,3,5,7]
 * Input: [2,2,2,2,2]   Output: 5   Explanation: length is 1, and there are 5 of them
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Strictly increasing? (yes)
 * - Can the count overflow? (LeetCode guarantees it fits in a 32-bit int)
 * - Empty array? (return 0)
 *
 * APPROACH 1 — Brute force   O(2^n) time, O(n) space
 * Enumerate every subsequence (take / skip), keep only increasing ones, track the
 * max length and how many reach it.
 *
 * APPROACH 2 — DP (memo / tabulation)   O(n^2) time, O(n) space
 * Same as LIS but every state carries TWO numbers.
 * STATE      length[i] = length of the longest increasing subsequence ending at i
 *            count[i]  = how many increasing subsequences of that length end at i
 * RECURRENCE for each j < i with nums[j] < nums[i]:
 *              if length[j] + 1 > length[i]: length[i] = length[j] + 1, count[i] = count[j]
 *              else if length[j] + 1 === length[i]: count[i] += count[j]
 * BASE CASES length[i] = 1, count[i] = 1
 * ANSWER     sum of count[i] over all i where length[i] === max length
 *
 * Table for [1, 3, 5, 4, 7]:
 *   i       : 0  1  2  3  4
 *   nums    : 1  3  5  4  7
 *   length  : 1  2  3  3  4
 *   count   : 1  1  1  1  2      i=4: from j=2 (len 3) count 1, from j=3 (len 3) count +1 -> 2
 *   max length 4, total count = 2
 *
 * The `memo` version returns a pair {length, count} for "best subsequence that
 * ends at index i" and sums counts at the end.
 *
 * EDGE CASES
 * - [] -> 0
 * - all equal -> n (each element is its own LIS of length 1)
 * - strictly increasing -> 1
 */

function bruteForce(nums) {
  let bestLength = 0;
  let bestCount = 0;
  function explore(index, prevValue, length) {
    if (index === nums.length) {
      if (length > bestLength) {
        bestLength = length;
        bestCount = 1;
      } else if (length === bestLength && length > 0) {
        bestCount++;
      }
      return;
    }
    explore(index + 1, prevValue, length); // skip
    if (nums[index] > prevValue) explore(index + 1, nums[index], length + 1); // take
  }
  explore(0, -Infinity, 0);
  return bestCount;
}

function memo(nums) {
  const cache = new Map(); // i -> { length, count } of LIS ending exactly at i
  function endingAt(i) {
    if (cache.has(i)) return cache.get(i);
    let length = 1;
    let count = 1;
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        const prev = endingAt(j);
        if (prev.length + 1 > length) {
          length = prev.length + 1;
          count = prev.count;
        } else if (prev.length + 1 === length) {
          count += prev.count;
        }
      }
    }
    const result = { length, count };
    cache.set(i, result);
    return result;
  }
  let maxLength = 0;
  let total = 0;
  for (let i = 0; i < nums.length; i++) {
    const { length, count } = endingAt(i);
    if (length > maxLength) {
      maxLength = length;
      total = count;
    } else if (length === maxLength) {
      total += count;
    }
  }
  return total;
}

function tabulation(nums) {
  const n = nums.length;
  if (n === 0) return 0;
  const length = new Array(n).fill(1);
  const count = new Array(n).fill(1);
  let maxLength = 1;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        if (length[j] + 1 > length[i]) {
          length[i] = length[j] + 1;
          count[i] = count[j]; // a strictly better length resets the count
        } else if (length[j] + 1 === length[i]) {
          count[i] += count[j]; // another way to reach the same length
        }
      }
    }
    maxLength = Math.max(maxLength, length[i]);
  }
  let total = 0;
  for (let i = 0; i < n; i++) if (length[i] === maxLength) total += count[i];
  return total;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, memo, tabulation]) {
  assert.strictEqual(solve([1, 3, 5, 4, 7]), 2);
  assert.strictEqual(solve([2, 2, 2, 2, 2]), 5);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([1]), 1);
  assert.strictEqual(solve([1, 2, 3]), 1);
  assert.strictEqual(solve([3, 2, 1]), 3);
  assert.strictEqual(solve([1, 2, 4, 3, 5, 4, 7, 2]), 3);
}
console.log('✓ 04-number-of-longest-increasing-subsequence passed');

module.exports = { bruteForce, memo, tabulation };

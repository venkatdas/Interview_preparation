/**
 * 15. 4Sum   (LeetCode 18 — Medium)
 *
 * PROBLEM
 * Given an integer array nums and an integer target, return all UNIQUE quadruplets
 * [a, b, c, d] (four distinct indices) such that a + b + c + d === target.
 *
 * EXAMPLES
 * Input: nums = [1, 0, -1, 0, -2, 2], target = 0
 * Output: [[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]]
 * Input: nums = [2, 2, 2, 2, 2], target = 8   Output: [[2, 2, 2, 2]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Unique by value? (yes) Order? (any)
 * - Values up to 10^9? (sums fit in JS numbers fine; in other languages watch overflow)
 * - Generalise to k-Sum? (the recursive version below does)
 *
 * APPROACH 1 — Brute force   O(n^4) time
 * Four nested loops + a Set to de-duplicate sorted quadruplets.
 *
 * APPROACH 2 — Optimal (sort + two fixed + two pointers; generalised k-Sum)   O(n^3) time, O(1) extra
 * Sort. Fix i, fix j > i, run two pointers on the rest for target - nums[i] - nums[j].
 * Skip duplicate values at every level (i, j, left, right) so each quadruplet appears once.
 *
 * The generalised recursion:
 *   kSum(start, k, target):
 *     if k === 2 -> two-pointer scan of [start, end]
 *     else for each i from start: skip dups, recurse kSum(i + 1, k - 1, target - nums[i])
 *          and prepend nums[i] to every result.
 * Complexity: O(n^(k-1)) -> 2Sum O(n), 3Sum O(n^2), 4Sum O(n^3).
 *
 * Dry run on sorted [-2, -1, 0, 0, 1, 2], target 0:
 *   i=0 (-2): need 3-sum of 2 from [-1,0,0,1,2]
 *     j=1 (-1): need pair sum 3 from [0,0,1,2]: L=2 R=5 0+2=2<3 L++; 0+2=2 L++; 1+2=3 hit -> [-2,-1,1,2]
 *     j=2 (0):  need pair 2 from [0,1,2]: 0+2=2 hit -> [-2,0,0,2]; L=4 R=4 stop
 *     j=3 (0):  duplicate of j=2 -> skip
 *     j=4 (1):  need pair 1 from [2]: fewer than 2 -> nothing
 *   i=1 (-1): need 3-sum of 1 from [0,0,1,2]
 *     j=2 (0): need pair 1 from [0,1,2]: 0+2=2>1 R--; 0+1=1 hit -> [-1,0,0,1]
 *     ...
 *   result has 3 quadruplets
 *
 * EDGE CASES
 * - Fewer than 4 elements -> []
 * - All equal and 4 copies sum to target -> one quadruplet
 * - Negative target
 * - No solution -> []
 */

function bruteForce(nums, target) {
  const seen = new Set();
  const result = [];
  const n = nums.length;
  for (let a = 0; a < n; a++)
    for (let b = a + 1; b < n; b++)
      for (let c = b + 1; c < n; c++)
        for (let d = c + 1; d < n; d++) {
          if (nums[a] + nums[b] + nums[c] + nums[d] === target) {
            const quad = [nums[a], nums[b], nums[c], nums[d]].sort((x, y) => x - y);
            const key = quad.join(',');
            if (!seen.has(key)) {
              seen.add(key);
              result.push(quad);
            }
          }
        }
  return result;
}

function optimal(nums, target) {
  const sorted = [...nums].sort((a, b) => a - b);

  function twoSum(start, target) {
    const pairs = [];
    let left = start;
    let right = sorted.length - 1;
    while (left < right) {
      const sum = sorted[left] + sorted[right];
      if (sum === target) {
        pairs.push([sorted[left], sorted[right]]);
        while (left < right && sorted[left] === sorted[left + 1]) left++;
        while (left < right && sorted[right] === sorted[right - 1]) right--;
        left++;
        right--;
      } else if (sum < target) {
        left++;
      } else {
        right--;
      }
    }
    return pairs;
  }

  function kSum(start, k, target) {
    if (k === 2) return twoSum(start, target);

    const result = [];
    for (let i = start; i < sorted.length - k + 1; i++) {
      if (i > start && sorted[i] === sorted[i - 1]) continue; // duplicate fixed value
      // pruning: smallest possible / largest possible sums with this fixed value
      if (sorted[i] * k > target && sorted[i] > 0) break;
      for (const rest of kSum(i + 1, k - 1, target - sorted[i])) {
        result.push([sorted[i], ...rest]);
      }
    }
    return result;
  }

  return kSum(0, 4, target);
}

// ---------- tests ----------
const assert = require('assert');
const normalise = (quads) =>
  quads.map((q) => [...q].sort((a, b) => a - b)).sort((a, b) => a.join(',').localeCompare(b.join(',')));

for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(
    normalise(solve([1, 0, -1, 0, -2, 2], 0)),
    normalise([[-2, -1, 1, 2], [-2, 0, 0, 2], [-1, 0, 0, 1]])
  );
  assert.deepStrictEqual(solve([2, 2, 2, 2, 2], 8), [[2, 2, 2, 2]]);
  assert.deepStrictEqual(solve([1, 2, 3], 6), []);
  assert.deepStrictEqual(solve([], 0), []);
  assert.deepStrictEqual(normalise(solve([-3, -1, 0, 2, 4, 5], 2)), [[-3, -1, 2, 4]]);
  assert.deepStrictEqual(normalise(solve([1, -2, -5, -4, -3, 3, 3, 5], -11)), [[-5, -4, -3, 1]]);
  assert.deepStrictEqual(normalise(solve([-2, -1, -1, 1, 1, 2, 2], 0)), normalise([[-2, -1, 1, 2], [-1, -1, 1, 1]]));
}
console.log('✓ 15-four-sum passed');

module.exports = { optimal, bruteForce };

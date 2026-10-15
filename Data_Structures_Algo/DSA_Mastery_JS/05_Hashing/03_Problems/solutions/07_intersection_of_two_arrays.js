/**
 * 07. Intersection of Two Arrays   (LeetCode 349 — Easy)
 *
 * PROBLEM
 * Given two integer arrays nums1 and nums2, return an array of their intersection.
 * Each element in the result must be unique. Order does not matter.
 *
 * EXAMPLES
 * Input: nums1 = [1, 2, 2, 1], nums2 = [2, 2]         Output: [2]
 * Input: nums1 = [4, 9, 5], nums2 = [9, 4, 9, 8, 4]   Output: [9, 4]   (or [4, 9])
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Unique results, or with duplicates (that's LeetCode 350, Intersection II)? (unique)
 * - Does order of output matter? (no -> we sort in tests to compare)
 * - Are the arrays sorted? (no; if yes, two pointers would use O(1) extra space)
 *
 * APPROACH 1 — Brute force   O(n * m) time, O(1) extra space
 * For each element of nums1, scan nums2 for it, and also scan the result to avoid
 * adding duplicates.
 *
 * APPROACH 2 — Optimal (seen-set)   O(n + m) time, O(n) space
 *   1. Put every element of nums1 into a Set (removes duplicates for free).
 *   2. Walk nums2. If the set has the value, add it to the result and DELETE it from
 *      the set so it can't be added twice.
 *
 * Dry run on [1,2,2,1] and [2,2]:
 *   set = {1, 2}
 *   2 -> in set -> result [2], set {1}
 *   2 -> not in set -> skip
 *   result [2]
 *
 * EDGE CASES
 * - No overlap -> []
 * - One array empty -> []
 * - Duplicates on both sides must appear once
 */

function bruteForce(nums1, nums2) {
  const result = [];
  for (const value of nums1) {
    if (nums2.includes(value) && !result.includes(value)) result.push(value);
  }
  return result;
}

function optimal(nums1, nums2) {
  const candidates = new Set(nums1);
  const result = [];

  for (const value of nums2) {
    if (candidates.has(value)) {
      result.push(value);
      candidates.delete(value); // ensure uniqueness in the result
    }
  }
  return result;
}

// Bonus (LeetCode 350): intersection WITH duplicate counts, using a frequency map.
function intersectWithCounts(nums1, nums2) {
  const counts = new Map();
  for (const value of nums1) counts.set(value, (counts.get(value) ?? 0) + 1);
  const result = [];
  for (const value of nums2) {
    if ((counts.get(value) ?? 0) > 0) {
      result.push(value);
      counts.set(value, counts.get(value) - 1);
    }
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
const sorted = (arr) => [...arr].sort((a, b) => a - b);
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(sorted(solve([1, 2, 2, 1], [2, 2])), [2]);
  assert.deepStrictEqual(sorted(solve([4, 9, 5], [9, 4, 9, 8, 4])), [4, 9]);
  assert.deepStrictEqual(solve([1, 2], [3, 4]), []);
  assert.deepStrictEqual(solve([], [1]), []);
  assert.deepStrictEqual(solve([1], []), []);
  assert.deepStrictEqual(sorted(solve([-1, -1, 0], [0, -1])), [-1, 0]);
}
assert.deepStrictEqual(sorted(intersectWithCounts([1, 2, 2, 1], [2, 2])), [2, 2]);
assert.deepStrictEqual(sorted(intersectWithCounts([4, 9, 5], [9, 4, 9, 8, 4])), [4, 9]);
console.log('✓ 07-intersection-of-two-arrays passed');

module.exports = { optimal, bruteForce, intersectWithCounts };

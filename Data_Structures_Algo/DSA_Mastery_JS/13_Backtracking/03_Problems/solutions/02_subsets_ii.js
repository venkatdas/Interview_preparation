/**
 * 02. Subsets II   (LeetCode 90 — Medium)
 *
 * PROBLEM
 * Given an array of integers that MAY contain duplicates, return all possible
 * subsets without duplicate subsets.
 *
 * EXAMPLES
 * Input: [1,2,2]   Output: [[],[1],[1,2],[1,2,2],[2],[2,2]]
 *                  Explanation: [1,2] must appear once, even though there are two 2s.
 * Input: [0]       Output: [[],[0]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can I sort the input? (yes, order does not matter for subsets)
 * - Are [1,2] and [2,1] the same subset? (yes)
 *
 * APPROACH 1 — Brute force   O(n * 2^n) time, O(n * 2^n) space
 * Generate all subsets as in problem 01, sort each one, turn it into a string key
 * like "1,2", and use a Set to drop duplicates.
 *
 * APPROACH 2 — Optimal (sort + skip duplicates at the same level)   O(n * 2^n) time, O(n) extra
 * Sort first so equal values sit next to each other. In the for-loop, if nums[i]
 * equals nums[i-1] AND i > start, we already explored a branch starting with this
 * value at this level -> skip. (i > start, not i > 0, so that going DEEPER with a
 * repeated value is still allowed: [2,2] is a real subset.)
 *
 * Dry run on [1,2,2] (sorted):
 *   go(0,[])   record []
 *     i=0 push 1 -> go(1,[1]) record [1]
 *       i=1 push 2 -> go(2,[1,2]) record [1,2]
 *         i=2 push 2 -> go(3,[1,2,2]) record [1,2,2]   (i=2 == start=2 -> allowed)
 *       i=2: nums[2]==nums[1] and 2 > start(1) -> SKIP  (would repeat [1,2])
 *     i=1 push 2 -> go(2,[2]) record [2]
 *       i=2 push 2 -> go(3,[2,2]) record [2,2]
 *     i=2: nums[2]==nums[1] and 2 > start(0) -> SKIP  (would repeat [2])
 *   6 subsets.
 *
 * EDGE CASES
 * - all elements equal [2,2,2] -> [[],[2],[2,2],[2,2,2]]
 * - no duplicates -> same as Subsets
 * - [] -> [[]]
 */

function bruteForce(nums) {
  const seen = new Set();
  const results = [];
  const n = nums.length;
  for (let mask = 0; mask < (1 << n); mask++) {
    const subset = [];
    for (let i = 0; i < n; i++) if (mask & (1 << i)) subset.push(nums[i]);
    subset.sort((a, b) => a - b);
    const key = subset.join(',');
    if (!seen.has(key)) {
      seen.add(key);
      results.push(subset);
    }
  }
  return results;
}

function optimal(nums) {
  const sorted = [...nums].sort((a, b) => a - b);  // duplicates become neighbours
  const results = [];

  function go(start, path) {
    results.push([...path]);
    for (let i = start; i < sorted.length; i++) {
      // same value as the previous sibling at THIS level -> already explored
      if (i > start && sorted[i] === sorted[i - 1]) continue;
      path.push(sorted[i]);
      go(i + 1, path);
      path.pop();
    }
  }

  go(0, []);
  return results;
}

// ---------- tests ----------
const assert = require('assert');
const normalize = (list) => list.map((s) => [...s].sort((a, b) => a - b))
  .sort((a, b) => a.length - b.length || a.join(',').localeCompare(b.join(',')));

for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(normalize(solve([1, 2, 2])),
    normalize([[], [1], [1, 2], [1, 2, 2], [2], [2, 2]]));
  assert.deepStrictEqual(solve([]), [[]]);
  assert.deepStrictEqual(normalize(solve([0])), [[], [0]]);
  assert.deepStrictEqual(normalize(solve([2, 2, 2])), normalize([[], [2], [2, 2], [2, 2, 2]]));
  assert.deepStrictEqual(normalize(solve([4, 4, 4, 1, 4])).length, 10);
  assert.deepStrictEqual(normalize(solve([-1, -1, 3])), normalize([[], [-1], [-1, -1], [3], [-1, 3], [-1, -1, 3]]));
}
assert.deepStrictEqual(normalize(optimal([1, 2, 2, 3, 3])), normalize(bruteForce([1, 2, 2, 3, 3])));
console.log('✓ 02-subsets-ii passed');

module.exports = { optimal, bruteForce };

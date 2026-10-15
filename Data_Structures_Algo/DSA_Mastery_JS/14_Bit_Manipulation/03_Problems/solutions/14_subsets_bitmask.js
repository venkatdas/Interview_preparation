/**
 * 14. Subsets (bitmask version)   (LeetCode 78 — Medium)
 *
 * PROBLEM
 * Given an array of distinct integers, return every possible subset (the power set).
 * Any order is fine.
 *
 * EXAMPLES
 * Input: [1,2,3]   Output: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
 * Input: [0]       Output: [[],[0]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - n <= 10 on LeetCode; the bitmask approach needs n < 31 in JS.
 * - Distinct elements? (yes; with duplicates you need sorting + skipping)
 *
 * APPROACH 1 — Brute force (backtracking)   O(n * 2^n) time, O(n) recursion space
 * Classic include/exclude recursion from 13_Backtracking/. Shown as the
 * "other" way; same complexity, different shape.
 *
 * APPROACH 2 — Optimal (bitmask enumeration)   O(n * 2^n) time, O(n * 2^n) output
 * There are 2^n subsets and 2^n integers in [0, 2^n). Make the integer `mask` describe a
 * subset: bit i set means "nums[i] is in". Loop mask from 0 to 2^n - 1 and decode each.
 * Same time as backtracking, but iterative and trivially extended to "only masks with
 * k bits" or "sub-masks of a given mask".
 *
 * Dry run on [1,2,3] (n = 3, masks 0..7):
 *   mask 000 -> []        mask 001 -> [1]      mask 010 -> [2]      mask 011 -> [1,2]
 *   mask 100 -> [3]       mask 101 -> [1,3]    mask 110 -> [2,3]    mask 111 -> [1,2,3]
 *
 * EDGE CASES
 * - empty input -> [[]]
 * - single element -> [[], [x]]
 */

function bruteForce(nums) {
  const result = [];
  function backtrack(index, current) {
    if (index === nums.length) { result.push([...current]); return; }
    backtrack(index + 1, current);           // exclude nums[index]
    current.push(nums[index]);
    backtrack(index + 1, current);           // include nums[index]
    current.pop();
  }
  backtrack(0, []);
  return result;
}

function optimal(nums) {
  const n = nums.length;
  const result = [];
  for (let mask = 0; mask < (1 << n); mask++) {
    const subset = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) subset.push(nums[i]); // bit i set -> element i included
    }
    result.push(subset);
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
const normalize = (subsets) => subsets.map((s) => [...s].sort((a, b) => a - b)).sort((a, b) => a.length - b.length || String(a).localeCompare(String(b)));
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(normalize(solve([1, 2, 3])),
    normalize([[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]));
  assert.deepStrictEqual(normalize(solve([0])), [[], [0]]);
  assert.deepStrictEqual(solve([]), [[]]);
  assert.strictEqual(solve([1, 2, 3, 4, 5]).length, 32);
  assert.deepStrictEqual(normalize(solve([-1, 2])), normalize([[], [-1], [2], [-1, 2]]));
}
console.log('✓ 14-subsets-bitmask passed');

module.exports = { optimal, bruteForce };

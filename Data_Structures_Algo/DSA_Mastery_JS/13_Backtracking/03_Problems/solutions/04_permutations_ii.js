/**
 * 04. Permutations II   (LeetCode 47 — Medium)
 *
 * PROBLEM
 * Given an array that may contain duplicates, return all UNIQUE permutations.
 *
 * EXAMPLES
 * Input: [1,1,2]   Output: [[1,1,2],[1,2,1],[2,1,1]]
 *                  Explanation: swapping the two 1s gives the same ordering, count it once.
 * Input: [1,2,3]   Output: all 6 permutations
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can I sort the input? (yes)
 * - How many duplicates? If all n are equal there is just one permutation.
 *
 * APPROACH 1 — Brute force   O(n * n!) time, O(n * n!) space
 * Generate all n! permutations (with indices, so duplicates are "different"), then
 * dedupe with a Set of joined strings.
 *
 * APPROACH 2 — Optimal (sort + skip duplicates with the used[] rule)   O(n * n!) worst, O(n) extra
 * Sort so duplicates are adjacent. At each level, if nums[i] === nums[i-1] and
 * nums[i-1] is NOT used, skip nums[i]. Why? If the earlier copy is unused, it means
 * we already finished (or skipped) the branch that puts "a 1" in this position; using
 * the second copy here would rebuild the identical branch. We only let the copies be
 * used in order: first 1 before second 1.
 *
 * Dry run on [1,1,2] (indices a=1, b=1, c=2):
 *   level 0: i=0 take a ... produces [1,1,2],[1,2,1]
 *            i=1 (b): nums[1]==nums[0] and used[0]=false -> SKIP (would duplicate the branch above)
 *            i=2 take 2 -> [2,?,?]: i=0 take a -> i=1 take b (used[0] true -> allowed) -> [2,1,1]
 *                                   i=1 (b) with used[0]=false -> SKIP
 *   3 permutations.
 *
 * EDGE CASES
 * - [1,1,1] -> [[1,1,1]]
 * - [] -> [[]]
 * - no duplicates -> same as Permutations
 */

function bruteForce(nums) {
  const seen = new Set();
  const results = [];
  const used = new Array(nums.length).fill(false);
  function go(path) {
    if (path.length === nums.length) {
      const key = path.join(',');
      if (!seen.has(key)) { seen.add(key); results.push([...path]); }
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true; path.push(nums[i]);
      go(path);
      used[i] = false; path.pop();
    }
  }
  go([]);
  return results;
}

function optimal(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const results = [];
  const used = new Array(sorted.length).fill(false);

  function go(path) {
    if (path.length === sorted.length) { results.push([...path]); return; }
    for (let i = 0; i < sorted.length; i++) {
      if (used[i]) continue;
      // duplicate value whose earlier copy is free -> that branch was already done
      if (i > 0 && sorted[i] === sorted[i - 1] && !used[i - 1]) continue;
      used[i] = true;  path.push(sorted[i]);
      go(path);
      used[i] = false; path.pop();
    }
  }

  go([]);
  return results;
}

// ---------- tests ----------
const assert = require('assert');
const normalize = (list) => [...list].sort((a, b) => a.join(',').localeCompare(b.join(',')));

for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(normalize(solve([1, 1, 2])), [[1, 1, 2], [1, 2, 1], [2, 1, 1]]);
  assert.strictEqual(solve([1, 2, 3]).length, 6);
  assert.deepStrictEqual(solve([1, 1, 1]), [[1, 1, 1]]);
  assert.deepStrictEqual(solve([]), [[]]);
  assert.deepStrictEqual(solve([7]), [[7]]);
  assert.strictEqual(solve([2, 2, 1, 1]).length, 6);     // 4!/(2!2!)
  assert.strictEqual(solve([3, 3, 0, 3]).length, 4);     // 4!/3!
  assert.deepStrictEqual(normalize(solve([-1, -1, 0])), [[-1, -1, 0], [-1, 0, -1], [0, -1, -1]]);
}
assert.deepStrictEqual(normalize(optimal([1, 2, 2, 3])), normalize(bruteForce([1, 2, 2, 3])));
console.log('✓ 04-permutations-ii passed');

module.exports = { optimal, bruteForce };

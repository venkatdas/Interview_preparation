/**
 * 03. Permutations   (LeetCode 46 — Medium)
 *
 * PROBLEM
 * Given an array of DISTINCT integers, return all possible orderings (permutations).
 *
 * EXAMPLES
 * Input: [1,2,3]   Output: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]
 * Input: [0,1]     Output: [[0,1],[1,0]]
 * Input: [1]       Output: [[1]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Distinct values? (yes; see Permutations II for duplicates)
 * - n <= 6 on LeetCode: n! grows fast (10! = 3.6 million)
 *
 * APPROACH 1 — Brute force (insert into every position)   O(n * n!) time, O(n * n!) space
 * Build permutations of the first k elements, then insert element k+1 into every
 * possible gap of every existing permutation. Iterative, no recursion needed.
 *   [] -> [[1]] -> [[2,1],[1,2]] -> [[3,2,1],[2,3,1],[2,1,3],[3,1,2],[1,3,2],[1,2,3]]
 *
 * APPROACH 2 — Optimal (Backtracking with used[])   O(n * n!) time, O(n) extra space
 * Order matters, so at every level we may pick ANY element that is not already in
 * the path. A boolean `used` array gives that check in O(1).
 * Record the path only when it is full (length n).
 *
 * Dry run on [1,2]:
 *   go([])        used=[F,F]
 *     i=0 choose 1  path=[1] used=[T,F]
 *       i=0 used skip; i=1 choose 2 path=[1,2] -> full, record [1,2]; un-choose 2
 *     un-choose 1   path=[] used=[F,F]
 *     i=1 choose 2  path=[2] used=[F,T]
 *       i=0 choose 1 path=[2,1] -> record [2,1]; un-choose 1
 *     un-choose 2
 *
 * EDGE CASES
 * - [] -> [[]]  (one empty permutation)
 * - single element -> [[x]]
 */

function bruteForce(nums) {
  let perms = [[]];
  for (const value of nums) {
    const next = [];
    for (const perm of perms) {
      for (let gap = 0; gap <= perm.length; gap++) {
        next.push([...perm.slice(0, gap), value, ...perm.slice(gap)]);
      }
    }
    perms = next;
  }
  return perms;
}

function optimal(nums) {
  const results = [];
  const used = new Array(nums.length).fill(false);

  function go(path) {
    if (path.length === nums.length) {      // full-length path = one permutation
      results.push([...path]);
      return;
    }
    for (let i = 0; i < nums.length; i++) { // start at 0 every time: order matters
      if (used[i]) continue;
      used[i] = true;  path.push(nums[i]);  // choose
      go(path);                             // explore
      used[i] = false; path.pop();          // un-choose
    }
  }

  go([]);
  return results;
}

// ---------- tests ----------
const assert = require('assert');
const normalize = (list) => [...list].sort((a, b) => a.join(',').localeCompare(b.join(',')));

for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(normalize(solve([1, 2, 3])),
    normalize([[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]));
  assert.deepStrictEqual(normalize(solve([0, 1])), [[0, 1], [1, 0]]);
  assert.deepStrictEqual(solve([1]), [[1]]);
  assert.deepStrictEqual(solve([]), [[]]);
  assert.strictEqual(solve([1, 2, 3, 4, 5]).length, 120);
  assert.deepStrictEqual(normalize(solve([-1, 2])), [[-1, 2], [2, -1]]);
}
assert.deepStrictEqual(normalize(optimal([5, 6, 7, 8])), normalize(bruteForce([5, 6, 7, 8])));
console.log('✓ 03-permutations passed');

module.exports = { optimal, bruteForce };

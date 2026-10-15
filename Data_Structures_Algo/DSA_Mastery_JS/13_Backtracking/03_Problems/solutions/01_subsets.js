/**
 * 01. Subsets   (LeetCode 78 — Medium)
 *
 * PROBLEM
 * Given an array of UNIQUE integers, return all possible subsets (the power set).
 * The order of subsets in the output does not matter.
 *
 * EXAMPLES
 * Input: [1,2,3]   Output: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
 * Input: [0]       Output: [[],[0]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Are the elements unique? (yes here; see Subsets II for duplicates)
 * - n is small (<= 10): the output has 2^n entries, so exponential is unavoidable.
 * - Does the order inside a subset or of the subsets matter? (no)
 *
 * APPROACH 1 — Brute force (bit mask)   O(n * 2^n) time, O(n * 2^n) space (output)
 * Every subset corresponds to an n-bit number: bit i set means "nums[i] is in".
 * Loop mask from 0 to 2^n - 1 and collect the elements whose bit is set.
 * Not really "brute", it's a great iterative solution, but it hides the recursion
 * idea that interviewers want to see.
 *
 * APPROACH 2 — Optimal (Backtracking with a start index)   O(n * 2^n) time, O(n) extra space
 * Every node in the decision tree is a valid subset, so we record the path on entry.
 * To avoid producing [1,2] and [2,1] we only ever add elements AFTER the last one
 * we added (the `start` index).
 *
 * Dry run on [1,2,3]:
 *   go(0, [])        record []
 *     push 1, go(1, [1])      record [1]
 *       push 2, go(2, [1,2])  record [1,2]
 *         push 3, go(3,[1,2,3]) record [1,2,3]; loop empty; pop 3
 *       pop 2
 *       push 3, go(3, [1,3])  record [1,3]; pop 3
 *     pop 1
 *     push 2, go(2, [2])      record [2]
 *       push 3, go(3, [2,3])  record [2,3]; pop 3
 *     pop 2
 *     push 3, go(3, [3])      record [3]; pop 3
 *   8 subsets recorded.
 *
 * EDGE CASES
 * - []  -> [[]]  (the empty set has exactly one subset: itself)
 * - single element -> [[], [x]]
 */

function bruteForce(nums) {
  const n = nums.length;
  const results = [];
  for (let mask = 0; mask < (1 << n); mask++) {
    const subset = [];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) subset.push(nums[i]);  // bit i on -> include nums[i]
    }
    results.push(subset);
  }
  return results;
}

function optimal(nums) {
  const results = [];

  function go(start, path) {
    results.push([...path]);                 // every node is a subset: record a COPY
    for (let i = start; i < nums.length; i++) {
      path.push(nums[i]);                    // choose
      go(i + 1, path);                       // explore: only elements after i
      path.pop();                            // un-choose
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
  assert.deepStrictEqual(normalize(solve([1, 2, 3])),
    normalize([[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]));
  assert.deepStrictEqual(solve([]), [[]]);
  assert.deepStrictEqual(normalize(solve([0])), [[], [0]]);
  assert.deepStrictEqual(normalize(solve([-1, 5])), normalize([[], [-1], [5], [-1, 5]]));
  assert.strictEqual(solve([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).length, 1024);
}
assert.deepStrictEqual(normalize(optimal([4, 7, 9])), normalize(bruteForce([4, 7, 9])));
console.log('✓ 01-subsets passed');

module.exports = { optimal, bruteForce };

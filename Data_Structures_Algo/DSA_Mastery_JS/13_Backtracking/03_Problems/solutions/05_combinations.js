/**
 * 05. Combinations   (LeetCode 77 — Medium)
 *
 * PROBLEM
 * Given two integers n and k, return all combinations of k numbers chosen from 1..n.
 * Order inside a combination does not matter ([1,2] and [2,1] are the same).
 *
 * EXAMPLES
 * Input: n = 4, k = 2   Output: [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]
 * Input: n = 1, k = 1   Output: [[1]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - 1 <= k <= n <= 20
 * - Output size is C(n,k) = n! / (k!(n-k)!), e.g. C(20,10) = 184,756
 *
 * APPROACH 1 — Brute force   O(n * 2^n) time
 * Generate all 2^n subsets of 1..n (bit mask) and keep those with exactly k elements.
 * Wasteful: for n=20,k=2 we build a million subsets to keep 190.
 *
 * APPROACH 2 — Optimal (Backtracking with start index + pruning)   O(k * C(n,k)) time, O(k) extra
 * Same as subsets, but only record paths of length k, and stop early when there are
 * not enough numbers left to fill the path:
 *   need = k - path.length numbers; available from i = n - i + 1
 *   so i may go at most up to n - need + 1.
 *
 * Dry run n=4, k=2:
 *   go(1,[])
 *     i=1 [1]: go(2,[1]) i=2 [1,2] record; i=3 [1,3] record; i=4 [1,4] record
 *     i=2 [2]: go(3,[2]) i=3 [2,3] record; i=4 [2,4] record
 *     i=3 [3]: go(4,[3]) i=4 [3,4] record
 *     i=4: pruned, 4 > n - need + 1 = 4 - 2 + 1 = 3 (one number cannot fill two slots)
 *
 * EDGE CASES
 * - k === n -> one combination [1..n]
 * - k === 1 -> n single-element combinations
 * - k === 0 -> [[]]
 */

function bruteForce(n, k) {
  const results = [];
  for (let mask = 0; mask < (1 << n); mask++) {
    const subset = [];
    for (let i = 0; i < n; i++) if (mask & (1 << i)) subset.push(i + 1);
    if (subset.length === k) results.push(subset);
  }
  return results;
}

function optimal(n, k) {
  const results = [];

  function go(start, path) {
    if (path.length === k) { results.push([...path]); return; }
    const need = k - path.length;
    // prune: numbers i..n must contain at least `need` numbers
    for (let i = start; i <= n - need + 1; i++) {
      path.push(i);
      go(i + 1, path);
      path.pop();
    }
  }

  go(1, []);
  return results;
}

// ---------- tests ----------
const assert = require('assert');
const normalize = (list) => [...list].sort((a, b) => a.join(',').localeCompare(b.join(',')));

for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(normalize(solve(4, 2)), [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]);
  assert.deepStrictEqual(solve(1, 1), [[1]]);
  assert.deepStrictEqual(solve(3, 3), [[1, 2, 3]]);
  assert.deepStrictEqual(normalize(solve(3, 1)), [[1], [2], [3]]);
  assert.deepStrictEqual(solve(3, 0), [[]]);
  assert.strictEqual(solve(10, 3).length, 120);
}
assert.strictEqual(optimal(20, 10).length, 184756);
assert.deepStrictEqual(normalize(optimal(6, 3)), normalize(bruteForce(6, 3)));
console.log('✓ 05-combinations passed');

module.exports = { optimal, bruteForce };

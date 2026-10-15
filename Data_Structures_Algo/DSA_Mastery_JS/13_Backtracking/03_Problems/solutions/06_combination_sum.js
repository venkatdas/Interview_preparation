/**
 * 06. Combination Sum   (LeetCode 39 — Medium)
 *
 * PROBLEM
 * Given an array of DISTINCT positive integers `candidates` and a `target`, return all
 * unique combinations where the chosen numbers sum to target. The SAME number may be
 * used an unlimited number of times.
 *
 * EXAMPLES
 * Input: candidates = [2,3,6,7], target = 7   Output: [[2,2,3],[7]]
 * Input: candidates = [2,3,5],   target = 8   Output: [[2,2,2,2],[2,3,3],[3,5]]
 * Input: candidates = [2],       target = 1   Output: []
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - All candidates positive? (yes, otherwise infinite loops with reuse)
 * - Distinct candidates? (yes; Combination Sum II handles duplicates + no reuse)
 * - Are [2,2,3] and [2,3,2] the same? (yes, one combination)
 *
 * APPROACH 1 — Brute force   exponential, worse than optimal
 * Try every multiset: for each candidate, try using it 0,1,2,... times (up to target/c),
 * recursively over the candidate list. Correct, but it explores many counts that
 * overshoot the target before checking.
 *
 * APPROACH 2 — Optimal (Backtracking, pass `i` not `i+1`, prune on remaining)
 *   O(n^(target/min)) time worst case, O(target/min) stack
 * Standard start-index backtracking. The only differences from subsets:
 *   - reuse allowed  -> recurse with go(i, ...) instead of go(i + 1, ...)
 *   - track `remaining`; record when it hits 0; prune when a candidate exceeds it
 *     (sort first so we can `break`, not just `continue`).
 *
 * Dry run candidates=[2,3,6,7], target=7:
 *   go(0, [], 7)
 *     i=0 take 2 -> go(0,[2],5)
 *       i=0 take 2 -> go(0,[2,2],3)
 *         i=0 take 2 -> go(0,[2,2,2],1): 2 > 1 break
 *         i=1 take 3 -> go(1,[2,2,3],0): record [2,2,3]
 *         i=2: 6 > 3 break
 *       i=1 take 3 -> go(1,[2,3],2): 3 > 2 break
 *       i=2: 6 > 5 break
 *     i=1 take 3 -> go(1,[3],4): take 3 -> [3,3] rem 1 -> break; 6 > 4 break
 *     i=2 take 6 -> go(2,[6],1): break
 *     i=3 take 7 -> go(3,[7],0): record [7]
 *
 * EDGE CASES
 * - target smaller than every candidate -> []
 * - a candidate equal to target -> [[target]] is one of the answers
 * - target 0 -> [[]] (usually excluded by constraints, target >= 1)
 */

function bruteForce(candidates, target) {
  const results = [];
  function go(index, path, sum) {
    if (index === candidates.length) {
      if (sum === target) results.push([...path]);
      return;
    }
    const value = candidates[index];
    // use `value` count times, for every count that keeps sum <= target
    for (let count = 0; sum + count * value <= target; count++) {
      for (let c = 0; c < count; c++) path.push(value);
      go(index + 1, path, sum + count * value);
      for (let c = 0; c < count; c++) path.pop();
    }
  }
  go(0, [], 0);
  return results;
}

function optimal(candidates, target) {
  const sorted = [...candidates].sort((a, b) => a - b);  // allows `break` pruning
  const results = [];

  function go(start, path, remaining) {
    if (remaining === 0) { results.push([...path]); return; }
    for (let i = start; i < sorted.length; i++) {
      if (sorted[i] > remaining) break;       // everything after is even bigger
      path.push(sorted[i]);
      go(i, path, remaining - sorted[i]);     // `i` not `i + 1`: reuse is allowed
      path.pop();
    }
  }

  go(0, [], target);
  return results;
}

// ---------- tests ----------
const assert = require('assert');
const normalize = (list) => list.map((c) => [...c].sort((a, b) => a - b))
  .sort((a, b) => a.join(',').localeCompare(b.join(',')));

for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(normalize(solve([2, 3, 6, 7], 7)), normalize([[2, 2, 3], [7]]));
  assert.deepStrictEqual(normalize(solve([2, 3, 5], 8)), normalize([[2, 2, 2, 2], [2, 3, 3], [3, 5]]));
  assert.deepStrictEqual(solve([2], 1), []);
  assert.deepStrictEqual(solve([1], 2), [[1, 1]]);
  assert.deepStrictEqual(solve([5], 5), [[5]]);
  assert.strictEqual(solve([7, 3, 2], 18).length, 7);
}
assert.deepStrictEqual(normalize(optimal([2, 7, 6, 3, 5, 1], 9)), normalize(bruteForce([2, 7, 6, 3, 5, 1], 9)));
console.log('✓ 06-combination-sum passed');

module.exports = { optimal, bruteForce };

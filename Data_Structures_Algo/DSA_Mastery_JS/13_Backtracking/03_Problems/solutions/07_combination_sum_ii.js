/**
 * 07. Combination Sum II   (LeetCode 40 — Medium)
 *
 * PROBLEM
 * Given a list of candidates (MAY contain duplicates) and a target, find all unique
 * combinations that sum to target. Each candidate may be used ONCE.
 *
 * EXAMPLES
 * Input: candidates = [10,1,2,7,6,1,5], target = 8
 * Output: [[1,1,6],[1,2,5],[1,7],[2,6]]
 * Input: candidates = [2,5,2,1,2], target = 5   Output: [[1,2,2],[5]]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Duplicates in input, but output combinations must be unique
 * - Each index used at most once (not each VALUE: [1,1,6] uses two different 1s)
 *
 * APPROACH 1 — Brute force   O(n * 2^n)
 * Enumerate all subsets by bit mask, keep the ones summing to target, sort each and
 * dedupe through a Set of keys.
 *
 * APPROACH 2 — Optimal (sort + skip duplicates + no reuse + prune)   O(2^n) worst, O(n) extra
 * This is Subsets II + Combination Sum glued together:
 *   - sort
 *   - recurse with i + 1 (no reuse)
 *   - skip when i > start && sorted[i] === sorted[i-1] (same value at the same level)
 *   - break when sorted[i] > remaining
 *
 * Dry run candidates=[2,5,2,1,2] -> sorted [1,2,2,2,5], target 5:
 *   go(0,[],5)
 *     i=0 take 1 -> go(1,[1],4)
 *       i=1 take 2 -> go(2,[1,2],2)
 *         i=2 take 2 -> go(3,[1,2,2],0) record [1,2,2]
 *         i=3 skip (dup of i=2 at this level); i=4 5>2 break
 *       i=2 skip dup; i=3 skip dup; i=4: 5 > 4 break
 *     i=1 take 2 -> go(2,[2],3): take 2 -> [2,2] rem 1 -> i=3 dup skip... nothing; 5 > 3 break
 *     i=2, i=3 skip dup
 *     i=4 take 5 -> go(5,[5],0) record [5]
 *
 * EDGE CASES
 * - target not reachable -> []
 * - many equal candidates: [1,1,1,1], target 2 -> [[1,1]] once
 */

function bruteForce(candidates, target) {
  const n = candidates.length;
  const seen = new Set();
  const results = [];
  for (let mask = 0; mask < (1 << n); mask++) {
    const subset = [];
    let sum = 0;
    for (let i = 0; i < n; i++) if (mask & (1 << i)) { subset.push(candidates[i]); sum += candidates[i]; }
    if (sum !== target) continue;
    subset.sort((a, b) => a - b);
    const key = subset.join(',');
    if (!seen.has(key)) { seen.add(key); results.push(subset); }
  }
  return results;
}

function optimal(candidates, target) {
  const sorted = [...candidates].sort((a, b) => a - b);
  const results = [];

  function go(start, path, remaining) {
    if (remaining === 0) { results.push([...path]); return; }
    for (let i = start; i < sorted.length; i++) {
      if (sorted[i] > remaining) break;                       // prune
      if (i > start && sorted[i] === sorted[i - 1]) continue; // skip same value at same level
      path.push(sorted[i]);
      go(i + 1, path, remaining - sorted[i]);                 // i + 1: no reuse
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
  assert.deepStrictEqual(normalize(solve([10, 1, 2, 7, 6, 1, 5], 8)),
    normalize([[1, 1, 6], [1, 2, 5], [1, 7], [2, 6]]));
  assert.deepStrictEqual(normalize(solve([2, 5, 2, 1, 2], 5)), normalize([[1, 2, 2], [5]]));
  assert.deepStrictEqual(solve([3], 1), []);
  assert.deepStrictEqual(solve([1, 1, 1, 1], 2), [[1, 1]]);
  assert.deepStrictEqual(solve([4], 4), [[4]]);
  assert.deepStrictEqual(solve([], 3), []);
}
assert.deepStrictEqual(normalize(optimal([1, 1, 2, 2, 3, 3, 4], 6)), normalize(bruteForce([1, 1, 2, 2, 3, 3, 4], 6)));
console.log('✓ 07-combination-sum-ii passed');

module.exports = { optimal, bruteForce };

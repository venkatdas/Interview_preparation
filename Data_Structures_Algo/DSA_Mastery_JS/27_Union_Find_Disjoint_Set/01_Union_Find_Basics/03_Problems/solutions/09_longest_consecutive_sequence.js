/**
 * 09. Longest Consecutive Sequence (Union-Find variant)   (LeetCode 128 — Medium)
 *
 * PROBLEM
 * Given an unsorted integer array, return the length of the longest run of consecutive
 * integers (values, not positions). Must run in O(n).
 *
 * EXAMPLES
 * Input: [100,4,200,1,3,2]          Output: 4   (1,2,3,4)
 * Input: [0,3,7,2,5,8,4,6,0,1]      Output: 9
 * Input: []                         Output: 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Duplicates? (yes, they do not extend a run - dedupe first)
 * - Negative numbers? (yes)
 *
 * APPROACH 1 — Brute force (sort)   O(n log n) time, O(1) extra
 * Sort, dedupe, walk and count runs. Simple but not O(n).
 *
 * APPROACH 2 — Optimal (Union-Find: union x with x+1)   O(n * alpha) time, O(n) space
 * Think of each distinct value as a node. There is an edge between x and x + 1 whenever
 * both exist. A run of consecutive numbers is exactly a connected component, and its
 * length is the component size.
 *   1. index each distinct value 0..k-1 (Map).
 *   2. for each value x: if x + 1 exists, union(idx[x], idx[x+1]).
 *   3. answer = max set size.
 * (The classic hash-set "only start from x where x-1 is missing" solution is also O(n)
 *  and is in 05_Hashing; this version shows union-find's "size of component" power.)
 *
 * Dry run [100,4,200,1,3,2]:
 *   ids 100:0 4:1 200:2 1:3 3:4 2:5
 *   4 -> 5 missing; 1 -> 2 exists union(3,5); 3 -> 4 exists union(4,1); 2 -> 3 union(5,4)
 *   set {1,2,3,4} has size 4 -> answer 4
 *
 * EDGE CASES
 * - empty -> 0
 * - all duplicates [1,1,1] -> 1
 * - single element -> 1
 */

const { UnionFind } = require('../../02_Implementations/union_find');

function bruteForce(nums) {
  if (!nums.length) return 0;
  const sorted = [...new Set(nums)].sort((a, b) => a - b);
  let best = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    run = sorted[i] === sorted[i - 1] + 1 ? run + 1 : 1;
    best = Math.max(best, run);
  }
  return best;
}

function optimal(nums) {
  if (!nums.length) return 0;
  const index = new Map();                         // value -> node id
  for (const value of nums) if (!index.has(value)) index.set(value, index.size);

  const uf = new UnionFind(index.size);
  for (const [value, id] of index) {
    if (index.has(value + 1)) uf.union(id, index.get(value + 1)); // link x to x+1
  }

  let best = 1;
  for (const id of index.values()) best = Math.max(best, uf.sizeOf(id));
  return best;
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([100, 4, 200, 1, 3, 2]), 4);
  assert.strictEqual(solve([0, 3, 7, 2, 5, 8, 4, 6, 0, 1]), 9);
  assert.strictEqual(solve([]), 0);
  assert.strictEqual(solve([1, 1, 1]), 1);
  assert.strictEqual(solve([7]), 1);
  assert.strictEqual(solve([-2, -1, 0, 5, 6]), 3);
  assert.strictEqual(solve([1, 2, 0, 1]), 3);
}
console.log('✓ 09-longest-consecutive-sequence passed');

module.exports = { optimal, bruteForce };

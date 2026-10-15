/**
 * 01. Majority Element II   (LeetCode 229 — Medium)
 *
 * PROBLEM
 * Find all elements that appear MORE than floor(n / 3) times. Solve in O(n) time and O(1)
 * extra space.
 *
 * EXAMPLES
 * Input: [3,2,3]        Output: [3]
 * Input: [1]            Output: [1]
 * Input: [1,2]          Output: [1,2]
 * Input: [1,1,1,3,3,2,2,2]   Output: [1,2]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Strictly more than n/3 -> at most TWO such elements can exist (three would need > n total)
 * - Output order does not matter
 *
 * APPROACH 1 — Brute force   O(n) time, O(n) space
 * Count with a Map and filter. Correct, but uses O(n) space which the follow-up forbids.
 *
 * APPROACH 2 — Optimal (Boyer-Moore with two candidates)   O(n) time, O(1) space
 * Keep two candidate slots with counters. For each x:
 *   - matches a candidate -> increment it
 *   - a slot is free (count 0) -> take it
 *   - otherwise decrement BOTH counters (we "cancel" x with one copy of each candidate:
 *     three distinct values removed together cannot change who has > n/3)
 * Survivors are only CANDIDATES: verify each with a second counting pass.
 *
 * Dry run on [1,1,1,3,3,2,2,2]:
 *   1: slotA = 1 (1)      1: A=2     1: A=3
 *   3: slotB = 3 (1)      3: B=2
 *   2: no match, no free slot -> A=2, B=1
 *   2: -> A=1, B=0        2: slot B free -> B = 2 (1)
 *   candidates 1 and 2; verify: 1 appears 3 > 8/3, 2 appears 3 > 8/3, (3 appears 2, not a candidate) -> [1,2]
 *
 * EDGE CASES
 * - n = 1 or 2 -> every element qualifies
 * - no element exceeds n/3 -> []
 * - all equal -> one answer
 */

function bruteForce(nums) {
  const counts = new Map();
  for (const x of nums) counts.set(x, (counts.get(x) || 0) + 1);
  const result = [];
  for (const [value, count] of counts) if (count > nums.length / 3) result.push(value);
  return result;
}

function optimal(nums) {
  let candA = null;
  let candB = null;
  let countA = 0;
  let countB = 0;
  for (const x of nums) {
    if (x === candA) countA++;
    else if (x === candB) countB++;
    else if (countA === 0) { candA = x; countA = 1; }
    else if (countB === 0) { candB = x; countB = 1; }
    else { countA--; countB--; }
  }
  // verification pass: the vote only guarantees that true majorities are among the candidates
  const result = [];
  for (const cand of [candA, candB]) {
    if (cand === null) continue;
    let count = 0;
    for (const x of nums) if (x === cand) count++;
    if (count > nums.length / 3 && !result.includes(cand)) result.push(cand);
  }
  return result;
}

// ---------- tests ----------
const assert = require('assert');
const sorted = (a) => a.slice().sort((x, y) => x - y);
for (const solve of [bruteForce, optimal]) {
  assert.deepStrictEqual(sorted(solve([3, 2, 3])), [3]);
  assert.deepStrictEqual(sorted(solve([1])), [1]);
  assert.deepStrictEqual(sorted(solve([1, 2])), [1, 2]);
  assert.deepStrictEqual(sorted(solve([1, 1, 1, 3, 3, 2, 2, 2])), [1, 2]);
  assert.deepStrictEqual(sorted(solve([1, 2, 3])), []);
  assert.deepStrictEqual(sorted(solve([4, 4, 4, 4])), [4]);
  assert.deepStrictEqual(sorted(solve([])), []);
}
for (let trial = 0; trial < 300; trial++) {
  const nums = Array.from({ length: Math.floor(Math.random() * 20) }, () => Math.floor(Math.random() * 4));
  assert.deepStrictEqual(sorted(optimal(nums)), sorted(bruteForce(nums)));
}
console.log('✓ 01-majority-element-ii passed');

module.exports = { optimal, bruteForce };

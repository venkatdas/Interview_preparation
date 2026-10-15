/**
 * 13. Merge Triplets to Form Target Triplet   (LeetCode 1899 — Medium)
 *
 * PROBLEM
 * You have triplets [a,b,c] and a target [x,y,z]. In one operation pick two triplets i, j
 * and replace triplet j with [max(ai,aj), max(bi,bj), max(ci,cj)]. Any number of operations.
 * Return true if target can be produced.
 *
 * EXAMPLES
 * Input: triplets = [[2,5,3],[1,8,4],[1,7,5]], target = [2,7,5]   Output: true
 *   Explanation: merge [2,5,3] and [1,7,5] -> [2,7,5]
 * Input: triplets = [[3,4,5],[4,5,6]], target = [3,2,5]             Output: false
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Can we use a triplet more than once? (irrelevant - max is idempotent)
 * - Can we use zero operations (target already present)? (yes)
 *
 * APPROACH 1 — Brute force   O(2^n * 3) time
 * Try every subset of triplets, take the position-wise max, compare with target.
 *
 * APPROACH 2 — Optimal (filter, then check coverage)   O(n) time, O(1) space
 * A triplet with ANY value bigger than the target's is poison: max can never shrink it.
 * Throw those away. Of the survivors, merge them ALL (taking max can only help). Target is
 * reachable iff each of the three positions is hit exactly by some survivor.
 *
 * WHY GREEDY WORKS
 * Merging is a max, so adding a "safe" triplet (all values <= target) never pushes any
 * position above the target. So including every safe triplet is never worse than including
 * a subset. The question collapses to: for each position, does some safe triplet equal the
 * target there?
 *
 * Dry run on [[2,5,3],[1,8,4],[1,7,5]], target [2,7,5]:
 *   [2,5,3] safe -> hits position 0 (2)
 *   [1,8,4] 8 > 7 -> skip
 *   [1,7,5] safe -> hits positions 1 (7) and 2 (5)
 *   all three positions hit -> true
 *
 * EDGE CASES
 * - target itself is in the list -> true
 * - no triplet is safe -> false
 * - safe triplets but one position never reaches the target -> false
 */

function bruteForce(triplets, target) {
  const n = triplets.length;
  for (let mask = 1; mask < (1 << n); mask++) {
    const merged = [0, 0, 0];
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) for (let k = 0; k < 3; k++) merged[k] = Math.max(merged[k], triplets[i][k]);
    }
    if (merged[0] === target[0] && merged[1] === target[1] && merged[2] === target[2]) return true;
  }
  return false;
}

function optimal(triplets, target) {
  const hit = [false, false, false];
  for (const triplet of triplets) {
    const safe = triplet[0] <= target[0] && triplet[1] <= target[1] && triplet[2] <= target[2];
    if (!safe) continue;                   // would overshoot the target somewhere
    for (let k = 0; k < 3; k++) if (triplet[k] === target[k]) hit[k] = true;
  }
  return hit[0] && hit[1] && hit[2];
}

// ---------- tests ----------
const assert = require('assert');
for (const solve of [bruteForce, optimal]) {
  assert.strictEqual(solve([[2, 5, 3], [1, 8, 4], [1, 7, 5]], [2, 7, 5]), true);
  assert.strictEqual(solve([[3, 4, 5], [4, 5, 6]], [3, 2, 5]), false);
  assert.strictEqual(solve([[2, 5, 3], [2, 3, 4], [1, 2, 5], [5, 2, 3]], [5, 5, 5]), true);
  assert.strictEqual(solve([[1, 1, 1]], [1, 1, 1]), true);
  assert.strictEqual(solve([[9, 9, 9]], [1, 1, 1]), false);
  assert.strictEqual(solve([[1, 2, 3], [3, 2, 1]], [3, 3, 3]), false);
}
console.log('✓ 13-merge-triplets passed');

module.exports = { optimal, bruteForce };

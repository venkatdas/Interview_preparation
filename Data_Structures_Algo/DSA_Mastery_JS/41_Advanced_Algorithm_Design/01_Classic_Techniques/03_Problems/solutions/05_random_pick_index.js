/**
 * 05. Random Pick Index   (LeetCode 398 — Medium)
 *
 * PROBLEM
 * Given an array with possible duplicates, implement pick(target): return a random index i
 * with nums[i] === target, every valid index equally likely. The array may be too large to
 * use extra memory proportional to it.
 *
 * EXAMPLES
 * nums = [1,2,3,3,3]; pick(3) -> 2, 3 or 4 each with probability 1/3; pick(1) -> 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - target always exists
 * - Many pick calls vs memory limit: which matters more? (decides between the two approaches)
 *
 * APPROACH 1 — Brute force (precomputed index lists)   O(n) space, O(1) per pick
 * Map value -> array of indices; pick a random entry. Fast, but O(n) extra memory.
 *
 * APPROACH 2 — Optimal (Reservoir sampling over matching indices)   O(n) per pick, O(1) space
 * Scan the array; for the c-th index that equals target (c = 1, 2, ...) replace the current
 * pick with probability 1/c. Each matching index ends up chosen with probability 1/count.
 *
 * Dry run on [1,2,3,3,3], pick(3):
 *   i=2 (1st match): pick 2 with prob 1
 *   i=3 (2nd match): replace with prob 1/2
 *   i=4 (3rd match): replace with prob 1/3 -> each of 2, 3, 4 has prob 1/3
 *
 * EDGE CASES
 * - target occurs once -> that index always
 * - all elements equal -> uniform over all indices
 */

class SolutionBrute {
  constructor(nums) {
    this.indices = new Map();
    nums.forEach((v, i) => {
      if (!this.indices.has(v)) this.indices.set(v, []);
      this.indices.get(v).push(i);
    });
  }
  pick(target) {
    const list = this.indices.get(target);
    return list[Math.floor(Math.random() * list.length)];
  }
}

class Solution {
  constructor(nums) {
    this.nums = nums;
  }
  pick(target) {
    let result = -1;
    let count = 0;
    for (let i = 0; i < this.nums.length; i++) {
      if (this.nums[i] !== target) continue;
      count++;
      if (Math.floor(Math.random() * count) === 0) result = i;    // probability 1 / count
    }
    return result;
  }
}

// ---------- tests ----------
const assert = require('assert');
for (const Cls of [SolutionBrute, Solution]) {
  const s = new Cls([1, 2, 3, 3, 3]);
  assert.strictEqual(s.pick(1), 0);
  assert.strictEqual(s.pick(2), 1);
  const trials = 6000;
  const hits = new Map();
  for (let t = 0; t < trials; t++) {
    const i = s.pick(3);
    assert.ok([2, 3, 4].includes(i));
    hits.set(i, (hits.get(i) || 0) + 1);
  }
  assert.strictEqual(hits.size, 3);
  for (const count of hits.values()) assert.ok(count > trials * 0.23 && count < trials * 0.43, `biased: ${[...hits]}`);
  const same = new Cls([7, 7]);
  assert.ok([0, 1].includes(same.pick(7)));
}
console.log('✓ 05-random-pick-index passed');

module.exports = { Solution, SolutionBrute, optimal: Solution, bruteForce: SolutionBrute };

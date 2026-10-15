/**
 * 02. Random Pick Index   (LeetCode 398 — Medium)
 *
 * PROBLEM
 * You get an integer array that may contain duplicates. Implement pick(target):
 * return a random index i with nums[i] === target. If target appears c times,
 * each of its c indices must be returned with probability 1/c.
 * The target is guaranteed to exist in the array.
 *
 * EXAMPLES
 * nums = [1, 2, 3, 3, 3]
 * pick(3) -> 2, 3 or 4, each with probability 1/3
 * pick(1) -> 0 (the only choice)
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - How large is the array, and how many pick calls? (trade memory vs time)
 * - Is extra memory allowed? (the classic follow-up says: avoid O(n) extra space)
 * - Is target always present? (yes)
 *
 * APPROACH 1 — Brute force (index map)   O(n) build, O(1) per pick, O(n) space
 * Build Map value -> list of indices once. pick(target) chooses a uniform random
 * entry from the list. Fast picks, but stores every index.
 *
 * APPROACH 2 — Optimal for memory (reservoir sampling, k = 1)   O(n) per pick, O(1) extra space
 * Scan the array. Keep a counter c of how many times target has been seen.
 * On the c-th occurrence, replace the current answer with probability 1/c.
 * Proof: occurrence j survives if chosen (1/j) and not replaced later:
 *   1/j * (j/(j+1)) * ((j+1)/(j+2)) * ... * ((c-1)/c) = 1/c.   Telescoping!
 *
 * Dry run on [1, 2, 3, 3, 3], target 3 (rng rolls in brackets):
 *   i=2: c=1, roll < 1/1 always -> ans = 2
 *   i=3: c=2, roll 0.7 < 1/2? no  -> ans = 2
 *   i=4: c=3, roll 0.1 < 1/3? yes -> ans = 4
 *   return 4
 *
 * EDGE CASES
 * - target appears once -> always that index
 * - all elements equal -> uniform over all indices
 * - negative values are fine (we only compare with ===)
 */
const { mulberry32, looksUniform } = require('../../02_Implementations/randomization');

class NaiveSolution {
  constructor(nums, rng = Math.random) {
    this.rng = rng;
    this.positions = new Map();
    nums.forEach((v, i) => {
      if (!this.positions.has(v)) this.positions.set(v, []);
      this.positions.get(v).push(i);
    });
  }
  pick(target) {
    const list = this.positions.get(target);
    return list[Math.floor(this.rng() * list.length)];
  }
}

class Solution {
  constructor(nums, rng = Math.random) {
    this.nums = nums; // only a reference: O(1) extra space
    this.rng = rng;
  }
  pick(target) {
    let count = 0;
    let answer = -1;
    for (let i = 0; i < this.nums.length; i++) {
      if (this.nums[i] !== target) continue;
      count++;
      // keep the new index with probability 1/count
      if (Math.floor(this.rng() * count) === 0) answer = i;
    }
    return answer;
  }
}

const bruteForce = (nums, target, rng) => new NaiveSolution(nums, rng).pick(target);
const optimal = (nums, target, rng) => new Solution(nums, rng).pick(target);

// ---------- tests ----------
const assert = require('assert');
const rng = mulberry32(398);
for (const Cls of [NaiveSolution, Solution]) {
  const s = new Cls([1, 2, 3, 3, 3], rng);
  assert.strictEqual(s.pick(1), 0);
  assert.strictEqual(s.pick(2), 1);
  assert.ok([2, 3, 4].includes(s.pick(3)));
  assert.strictEqual(new Cls([-5], rng).pick(-5), 0);

  const counts = [0, 0, 0];
  for (let t = 0; t < 30000; t++) counts[s.pick(3) - 2]++;
  assert.ok(looksUniform(counts), `${Cls.name} pick(3) not uniform: ${counts}`);

  const same = new Cls([4, 4, 4, 4, 4, 4], rng);
  const c6 = new Array(6).fill(0);
  for (let t = 0; t < 30000; t++) c6[same.pick(4)]++;
  assert.ok(looksUniform(c6));
}
console.log('✓ 02_random_pick_index passed');

module.exports = { Solution, NaiveSolution, optimal, bruteForce };

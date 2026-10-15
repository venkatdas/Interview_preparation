/**
 * 03. Shuffle an Array   (LeetCode 384 — Medium)
 *
 * PROBLEM
 * Implement Solution(nums) with
 *   - reset(): return the original array
 *   - shuffle(): return a random permutation where every permutation is EQUALLY likely
 *
 * EXAMPLES
 * Solution([1,2,3]); shuffle() -> e.g. [3,1,2]; reset() -> [1,2,3]; shuffle() -> e.g. [1,3,2]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Up to 200 elements, up to 5 * 10^4 calls
 * - "Equally likely" is the whole point: a biased shuffle is a wrong answer
 *
 * APPROACH 1 — Brute force   O(n^2) time per shuffle
 * Copy the array; repeatedly pick a random remaining element, remove it (splice, O(n)), and
 * append it to the output. Uniform, but O(n^2) because of splice.
 * (Non-answer: nums.sort(() => Math.random() - 0.5) is NOT uniform - comparison sorts assume
 * a consistent comparator, and the resulting distribution is visibly skewed.)
 *
 * APPROACH 2 — Optimal (Fisher-Yates / Knuth shuffle)   O(n) time, O(n) space for the copy
 * For i from n-1 down to 1: pick j uniformly in [0, i] and swap a[i] with a[j].
 * Why uniform: position n-1 receives each element with probability 1/n; given that, position
 * n-2 receives each remaining element with probability 1/(n-1); and so on -> each permutation
 * has probability 1/n * 1/(n-1) * ... * 1 = 1/n!.
 *
 * Dry run on [1,2,3] (random picks shown):
 *   i=2: j=0 -> swap a[2], a[0] -> [3,2,1]
 *   i=1: j=1 -> no change        -> [3,2,1]
 *
 * EDGE CASES
 * - single element -> shuffle returns it
 * - reset must return the ORIGINAL order even after many shuffles (keep an untouched copy)
 * - empty array
 */

class SolutionBrute {
  constructor(nums) {
    this.original = nums.slice();
  }
  reset() {
    return this.original.slice();
  }
  shuffle() {
    const pool = this.original.slice();
    const out = [];
    while (pool.length) {
      const i = Math.floor(Math.random() * pool.length);
      out.push(pool.splice(i, 1)[0]);
    }
    return out;
  }
}

class Solution {
  constructor(nums) {
    this.original = nums.slice();
  }
  reset() {
    return this.original.slice();
  }
  shuffle() {
    const a = this.original.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));   // inclusive of i: "no swap" must be possible
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}

// ---------- tests ----------
const assert = require('assert');
for (const Cls of [SolutionBrute, Solution]) {
  const s = new Cls([1, 2, 3]);
  const shuffled = s.shuffle();
  assert.deepStrictEqual(shuffled.slice().sort(), [1, 2, 3]);      // a permutation
  assert.deepStrictEqual(s.reset(), [1, 2, 3]);                     // original intact
  assert.deepStrictEqual(new Cls([7]).shuffle(), [7]);
  assert.deepStrictEqual(new Cls([]).shuffle(), []);

  // uniformity: all 6 permutations of [1,2,3] appear with roughly equal frequency (wide band)
  const trials = 6000;
  const seen = new Map();
  for (let t = 0; t < trials; t++) {
    const key = s.shuffle().join('');
    seen.set(key, (seen.get(key) || 0) + 1);
  }
  assert.strictEqual(seen.size, 6);
  for (const count of seen.values()) assert.ok(count > 600 && count < 1400, `biased: ${[...seen]}`);
}
console.log('✓ 03-shuffle-an-array passed');

module.exports = { Solution, SolutionBrute, optimal: Solution, bruteForce: SolutionBrute };

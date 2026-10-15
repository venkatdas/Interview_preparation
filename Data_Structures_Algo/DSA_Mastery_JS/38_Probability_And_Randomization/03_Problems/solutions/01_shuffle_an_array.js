/**
 * 01. Shuffle an Array   (LeetCode 384 — Medium)
 *
 * PROBLEM
 * Build a class that is given an integer array once. It must support:
 *   - reset():   return the array in its ORIGINAL order
 *   - shuffle(): return a random ordering where EVERY permutation of the
 *                array is equally likely (probability 1/n!)
 *
 * EXAMPLES
 * const s = new Solution([1, 2, 3]);
 * s.shuffle()  -> e.g. [3, 1, 2]   (any of the 6 orders, each with prob 1/6)
 * s.reset()    -> [1, 2, 3]
 * s.shuffle()  -> e.g. [1, 3, 2]
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Are the values distinct? (LeetCode: yes; our code works either way)
 * - Must shuffle() return a new array or may it mutate? (return a copy; keep the original safe)
 * - Can the array be empty? (handle it: shuffle -> [])
 *
 * APPROACH 1 — Brute force ("draw from a hat")   O(n^2) time, O(n) space
 * Copy the array into a "hat". Repeatedly pick a uniform random index in the hat,
 * append that element to the result and remove it with splice. Uniform (each step
 * picks uniformly among what is left), but splice is O(n), so O(n^2) total.
 *
 * APPROACH 2 — Optimal (Fisher–Yates)   O(n) time per shuffle, O(n) space for the copy
 * Same idea, done in place: the "hat" is the prefix a[0..i], the "result" is the
 * suffix a[i+1..n-1]. For i from n-1 down to 1, pick j uniform in [0, i] and swap
 * a[i] with a[j]. Position i is now final.
 * Why uniform: the first step has i+1 = n choices, the next n-1, ... -> n! equally
 * likely swap sequences, and each produces a DIFFERENT permutation, so every
 * permutation has probability exactly 1/n!.
 *
 * Dry run on [1, 2, 3] with random picks j = 0 then j = 1:
 *   i = 2, j = 0: swap a[2], a[0]  -> [3, 2, 1]   (1 is now final at index 2)
 *   i = 1, j = 1: swap a[1], a[1]  -> [3, 2, 1]   (swapping with itself is allowed and REQUIRED)
 *   result [3, 2, 1]
 *
 * EDGE CASES
 * - empty array or one element -> nothing to swap
 * - reset after several shuffles must give the original (we never mutate it)
 * - the classic bug: j = rand in [0, n-1] for every i -> biased (n^n not divisible by n!)
 */
const { mulberry32, looksUniform } = require('../../02_Implementations/randomization');

/** Brute force: draw from a hat with splice. */
class NaiveSolution {
  constructor(nums, rng = Math.random) {
    this.original = nums.slice();
    this.rng = rng;
  }
  reset() {
    return this.original.slice();
  }
  shuffle() {
    const hat = this.original.slice();
    const out = [];
    while (hat.length) {
      const j = Math.floor(this.rng() * hat.length);
      out.push(hat.splice(j, 1)[0]); // O(n) removal
    }
    return out;
  }
}

/** Optimal: Fisher–Yates on a copy. */
class Solution {
  constructor(nums, rng = Math.random) {
    this.original = nums.slice(); // keep our own copy so callers can't mutate it
    this.rng = rng;
  }
  reset() {
    return this.original.slice();
  }
  shuffle() {
    const a = this.original.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(this.rng() * (i + 1)); // j in [0, i], i included
      const tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }
}

const bruteForce = (nums, rng) => new NaiveSolution(nums, rng).shuffle();
const optimal = (nums, rng) => new Solution(nums, rng).shuffle();

// ---------- tests ----------
const assert = require('assert');
const rng = mulberry32(384);
for (const Cls of [NaiveSolution, Solution]) {
  const s = new Cls([1, 2, 3, 4, 5], rng);
  const sh = s.shuffle();
  assert.deepStrictEqual(sh.slice().sort((x, y) => x - y), [1, 2, 3, 4, 5]); // a permutation
  assert.deepStrictEqual(s.reset(), [1, 2, 3, 4, 5]);
  assert.deepStrictEqual(new Cls([], rng).shuffle(), []);
  assert.deepStrictEqual(new Cls([7], rng).shuffle(), [7]);
  // duplicates still give a permutation
  assert.deepStrictEqual(new Cls([2, 2, 1], rng).shuffle().sort(), [1, 2, 2]);

  // all 6 orders of [1,2,3] roughly equally likely (wide 6-sigma band)
  const counts = new Map();
  const s3 = new Cls([1, 2, 3], rng);
  for (let t = 0; t < 30000; t++) {
    const key = s3.shuffle().join('');
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  assert.strictEqual(counts.size, 6);
  assert.ok(looksUniform([...counts.values()]), `${Cls.name} not uniform`);
}
// original input array is not mutated by the class
const input = [1, 2, 3];
new Solution(input, rng).shuffle();
assert.deepStrictEqual(input, [1, 2, 3]);
console.log('✓ 01_shuffle_an_array passed');

module.exports = { Solution, NaiveSolution, optimal, bruteForce };

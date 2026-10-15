/**
 * 04. Random Pick with Weight   (LeetCode 528 — Medium)
 *
 * PROBLEM
 * You are given an array w of positive integers; w[i] is the weight of index i.
 * Implement pickIndex(): return index i with probability w[i] / sum(w).
 *
 * EXAMPLES
 * w = [1, 3]
 * pickIndex() -> 0 with probability 1/4, 1 with probability 3/4
 * w = [5]
 * pickIndex() -> always 0
 *
 * CONSTRAINTS / CLARIFYING QUESTIONS TO ASK
 * - Are weights positive integers? (yes; zeros would simply never be picked)
 * - How many pickIndex calls vs one construction? (many -> precompute)
 * - Will the weights change? (no; if yes, use a Fenwick tree for prefix sums)
 *
 * APPROACH 1 — Brute force (linear scan)   O(n) per pick, O(1) extra space
 * Draw r uniform in [0, total). Walk the weights subtracting each one; the index
 * where r drops below zero is the answer.
 *
 * APPROACH 2 — Optimal (prefix sums + binary search)   O(n) build, O(log n) per pick, O(n) space
 * Prefix sums turn weights into back-to-back intervals on a number line:
 *   w = [1, 3, 2] -> prefix = [1, 4, 6]
 *   index 0 owns [0,1), index 1 owns [1,4), index 2 owns [4,6)
 * Each interval's length equals its weight, so a uniform r in [0, 6) lands in
 * interval i with probability w[i] / 6. Find it with "first prefix > r".
 *
 * Dry run on w = [1, 3, 2], r = 4.5:
 *   lo=0, hi=2: mid=1, prefix[1]=4 > 4.5? no  -> lo=2
 *   lo=2=hi -> return 2      (4.5 is in [4,6), owned by index 2)
 * r = 4.0: mid=1, 4 > 4? no -> lo=2 -> return 2   (boundary belongs to the RIGHT interval)
 *
 * EDGE CASES
 * - single weight -> always 0
 * - r exactly on a prefix boundary -> use STRICT ">" so [start, end) is half-open
 * - huge totals -> still fine in doubles up to 2^53
 */
const { mulberry32, looksUniform } = require('../../02_Implementations/randomization');

class NaiveSolution {
  constructor(w, rng = Math.random) {
    this.w = w.slice();
    this.total = w.reduce((s, x) => s + x, 0);
    this.rng = rng;
  }
  pickIndex() {
    let r = this.rng() * this.total;
    for (let i = 0; i < this.w.length; i++) {
      r -= this.w[i];
      if (r < 0) return i;
    }
    return this.w.length - 1; // floating-point safety net
  }
}

class Solution {
  constructor(w, rng = Math.random) {
    this.prefix = [];
    let run = 0;
    for (const x of w) {
      run += x;
      this.prefix.push(run);
    }
    this.total = run;
    this.rng = rng;
  }
  pickIndex() {
    const r = this.rng() * this.total;
    let lo = 0;
    let hi = this.prefix.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.prefix[mid] > r) hi = mid;
      else lo = mid + 1;
    }
    return lo;
  }
}

const bruteForce = (w, rng) => new NaiveSolution(w, rng).pickIndex();
const optimal = (w, rng) => new Solution(w, rng).pickIndex();

// ---------- tests ----------
const assert = require('assert');
const rng = mulberry32(528);

// deterministic boundary checks with a fake rng
const fixed = (v) => () => v;
assert.strictEqual(new Solution([1, 3, 2], fixed(0)).pickIndex(), 0);
assert.strictEqual(new Solution([1, 3, 2], fixed(1 / 6)).pickIndex(), 1);       // r = 1 -> index 1
assert.strictEqual(new Solution([1, 3, 2], fixed(4 / 6)).pickIndex(), 2);       // r = 4 -> index 2
assert.strictEqual(new Solution([1, 3, 2], fixed(0.999999)).pickIndex(), 2);
assert.strictEqual(new Solution([5], rng).pickIndex(), 0);

for (const Cls of [NaiveSolution, Solution]) {
  const s = new Cls([1, 3, 2, 4], rng);
  const counts = [0, 0, 0, 0];
  for (let t = 0; t < 40000; t++) counts[s.pickIndex()]++;
  assert.ok(looksUniform(counts, [0.1, 0.3, 0.2, 0.4]), `${Cls.name}: ${counts}`);
}

// randomized: both agree when fed the same random numbers
for (let t = 0; t < 300; t++) {
  const w = Array.from({ length: 1 + Math.floor(rng() * 20) }, () => 1 + Math.floor(rng() * 50));
  const v = rng();
  assert.strictEqual(new Solution(w, fixed(v)).pickIndex(), new NaiveSolution(w, fixed(v)).pickIndex());
}
console.log('✓ 04_random_pick_with_weight passed');

module.exports = { Solution, NaiveSolution, optimal, bruteForce };
